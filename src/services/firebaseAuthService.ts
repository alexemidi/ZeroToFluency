import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { AuthorizedUser } from '../types';
import { storageService } from './storageService';
import { logger } from './logger';

export interface FirebaseCustomConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
}

const FB_CONFIG_KEY = 'ztf_firebase_config';

class FirebaseAuthService {
  private app: FirebaseApp | null = null;

  public getSavedConfig(): FirebaseCustomConfig | null {
    const raw = localStorage.getItem(FB_CONFIG_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as FirebaseCustomConfig;
      if (parsed.apiKey && parsed.authDomain && parsed.projectId) {
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  }

  public saveConfig(config: FirebaseCustomConfig | null): void {
    if (!config) {
      localStorage.removeItem(FB_CONFIG_KEY);
      this.app = null;
      return;
    }
    localStorage.setItem(FB_CONFIG_KEY, JSON.stringify(config));
    this.app = null;
  }

  public async signInWithGoogle(simulatedEmailIfNoConfig?: string): Promise<{
    success: boolean;
    user?: AuthorizedUser;
    errorMessage?: string;
  }> {
    const config = this.getSavedConfig();

    // Se o professor configurou chaves reais do Firebase Auth, abre o Popup real do Google
    if (config && !simulatedEmailIfNoConfig) {
      try {
        if (!this.app) {
          this.app = initializeApp(config);
        }
        const auth = getAuth(this.app);
        const provider = new GoogleAuthProvider();
        const credential = await signInWithPopup(auth, provider);
        const email = credential.user.email;

        if (!email) {
          return {
            success: false,
            errorMessage: 'Não foi possível obter o e-mail da sua conta Google.',
          };
        }

        return this.verifyAllowlistAndLogin(email);
      } catch (err) {
        logger.error('Erro no popup do Firebase Google Auth', { err: String(err) });
        return {
          success: false,
          errorMessage: `Falha ao autenticar com Firebase Google Auth: ${String(err)}`,
        };
      }
    }

    // Modo de Login Google Imediato (verifica a allowlist do professor pelo e-mail Google informado)
    if (!simulatedEmailIfNoConfig) {
      return {
        success: false,
        errorMessage: 'Informe ou selecione o seu e-mail Google para entrar.',
      };
    }

    return this.verifyAllowlistAndLogin(simulatedEmailIfNoConfig);
  }

  private verifyAllowlistAndLogin(email: string): {
    success: boolean;
    user?: AuthorizedUser;
    errorMessage?: string;
  } {
    const check = storageService.checkUserAccess(email);
    if (!check.allowed || !check.user) {
      return {
        success: false,
        errorMessage:
          check.reason ??
          'Acesso restrito: este e-mail Google não está na lista de alunos autorizados pelo professor.',
      };
    }

    storageService.setCurrentUser(check.user);
    logger.info('Login Google realizado com sucesso', {
      email: check.user.email,
      role: check.user.role,
    });
    return {
      success: true,
      user: check.user,
    };
  }
}

export const firebaseAuthService = new FirebaseAuthService();
