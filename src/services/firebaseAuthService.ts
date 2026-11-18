import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import {
  Auth,
  GoogleAuthProvider,
  User,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  Firestore,
  collection,
  deleteDoc,
  doc,
  getDocFromServer,
  getDocsFromServer,
  getFirestore,
  setDoc,
} from 'firebase/firestore';
import { AuthorizedUser } from '../types';
import { ADMIN_EMAIL, readFirebaseConfig } from '../config/firebaseConfig';
import { storageService } from './storageService';
import { logger } from './logger';

export interface LoginResult {
  success: boolean;
  user?: AuthorizedUser;
  errorMessage?: string;
}

const USERS_COLLECTION = 'allowedUsers';

function buildAdminUser(email: string, name: string): AuthorizedUser {
  return {
    email,
    name,
    role: 'teacher',
    tenantId: 'default-teacher-tenant',
    active: true,
    unlockedWeeks: 30,
    dailyStudyDaysQuota: 99,
    maxTotalStudyDaysLimit: 1000,
    subscriptionTier: 'pro',
    passedBlockTests: [],
    createdAt: new Date().toISOString(),
  };
}

class FirebaseAuthService {
  private app: FirebaseApp | null = null;

  /** Login real só existe quando as chaves do Firebase foram configuradas no build. */
  public isConfigured(): boolean {
    return readFirebaseConfig() !== null;
  }

  private getApp(): FirebaseApp {
    if (this.app) return this.app;
    const config = readFirebaseConfig();
    if (!config) throw new Error('Firebase não configurado.');
    this.app = getApps().length > 0 ? getApp() : initializeApp(config);
    return this.app;
  }

  private auth(): Auth {
    return getAuth(this.getApp());
  }

  private db(): Firestore {
    return getFirestore(this.getApp());
  }

  public async signInWithGoogle(): Promise<LoginResult> {
    if (!this.isConfigured()) {
      return {
        success: false,
        errorMessage: 'O login com Google ainda não foi configurado neste site.',
      };
    }
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const credential = await signInWithPopup(this.auth(), provider);
      return await this.authorize(credential.user);
    } catch (err) {
      const code = (err as { code?: string }).code ?? '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        return { success: false, errorMessage: 'Login cancelado.' };
      }
      logger.error('Erro no login Google', { err: String(err) });
      return {
        success: false,
        errorMessage: 'Não foi possível entrar com o Google. Tente novamente.',
      };
    }
  }

  /** Revalida a sessão ao abrir o site: se o acesso foi removido, o usuário é deslogado. */
  public async restoreSession(): Promise<AuthorizedUser | null> {
    if (!this.isConfigured()) return null;
    const firebaseUser = await new Promise<User | null>((resolve) => {
      const unsubscribe = onAuthStateChanged(this.auth(), (user) => {
        unsubscribe();
        resolve(user);
      }, (error) => {
        logger.error('Falha ao restaurar sessão', { err: String(error) });
        resolve(null);
      });
    });
    if (!firebaseUser) {
      storageService.setCurrentUser(null);
      return null;
    }
    const result = await this.authorize(firebaseUser);
    return result.success && result.user ? result.user : null;
  }

  public async signOut(): Promise<void> {
    storageService.setCurrentUser(null);
    if (!this.isConfigured()) return;
    try {
      await signOut(this.auth());
    } catch (err) {
      logger.warn('Falha ao encerrar sessão Firebase', { err: String(err) });
    }
  }

  private async authorize(firebaseUser: User): Promise<LoginResult> {
    const email = firebaseUser.email?.trim().toLowerCase();
    if (!email || !firebaseUser.emailVerified) {
      await this.signOut();
      return {
        success: false,
        errorMessage: 'Não foi possível confirmar o e-mail da sua conta Google.',
      };
    }

    let user: AuthorizedUser | null = null;

    if (email === ADMIN_EMAIL.toLowerCase()) {
      const existing = storageService
        .getAuthorizedUsers()
        .find((u) => u.email.toLowerCase() === email);
      user = {
        ...buildAdminUser(email, firebaseUser.displayName ?? 'Professor'),
        ...existing,
        email,
        role: 'teacher',
        active: true,
      };
      try {
        await this.pullAllUsersIntoLocalStore();
      } catch (err) {
        logger.error('Falha ao sincronizar alunos', { err: String(err) });
        await this.signOut();
        return { success: false, errorMessage: 'Não foi possível carregar a lista de alunos. Tente novamente.' };
      }
    } else {
      try {
        const snapshot = await getDocFromServer(doc(this.db(), USERS_COLLECTION, email));
        if (snapshot.exists()) {
          user = { ...(snapshot.data() as AuthorizedUser), email, role: 'student' };
        }
      } catch (err) {
        logger.error('Falha ao consultar a lista de acesso', { err: String(err) });
        await this.signOut();
        return {
          success: false,
          errorMessage: 'Não foi possível verificar seu acesso agora. Tente novamente.',
        };
      }
    }

    if (!user) {
      await this.signOut();
      return {
        success: false,
        errorMessage:
          'Este e-mail ainda não foi liberado. Fale com o professor para receber acesso.',
      };
    }
    if (!user.active) {
      await this.signOut();
      return { success: false, errorMessage: 'Seu acesso está pausado pelo professor.' };
    }

    const localUser = storageService.getAuthorizedUsers().find((u) => u.email.toLowerCase() === email);
    if (user.role === 'student' && localUser?.passedBlockTests) {
      user.passedBlockTests = localUser.passedBlockTests;
    }
    storageService.addOrUpdateAuthorizedUser(user);
    const saved = storageService.getAuthorizedUsers().find((u) => u.email === email) ?? user;
    storageService.setCurrentUser(saved);
    logger.info('Login Google realizado', { email, role: saved.role });
    return { success: true, user: saved };
  }

  private async pullAllUsersIntoLocalStore(): Promise<void> {
    const remote = await this.fetchAllowedUsers();
    const local = storageService.getAuthorizedUsers();
    const admin = local.filter((u) => u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase());
    const students = remote.map((user) => {
      const existing = local.find((u) => u.email.toLowerCase() === user.email);
      return existing?.passedBlockTests
        ? { ...user, passedBlockTests: existing.passedBlockTests }
        : user;
    });
    storageService.saveAuthorizedUsers([...admin, ...students]);
  }

  public async fetchAllowedUsers(): Promise<AuthorizedUser[]> {
    const snapshot = await getDocsFromServer(collection(this.db(), USERS_COLLECTION));
    return snapshot.docs.map((d) => ({
      ...(d.data() as AuthorizedUser),
      email: d.id,
    }));
  }

  public async saveAllowedUser(user: AuthorizedUser): Promise<void> {
    if (!this.isConfigured()) throw new Error('Firebase não configurado.');
    if (user.role !== 'student') throw new Error('Apenas alunos podem ser cadastrados.');
    const email = user.email.trim().toLowerCase();
    const normalized = { ...user, email };
    await setDoc(doc(this.db(), USERS_COLLECTION, email), normalized);
    storageService.addOrUpdateAuthorizedUser(normalized);
  }

  public async removeAllowedUser(email: string): Promise<void> {
    if (!this.isConfigured()) throw new Error('Firebase não configurado.');
    await deleteDoc(doc(this.db(), USERS_COLLECTION, email.trim().toLowerCase()));
    storageService.removeAuthorizedUser(email);
  }
}

export const firebaseAuthService = new FirebaseAuthService();
