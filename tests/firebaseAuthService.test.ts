import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AuthorizedUser } from '../src/types';

const mocks = vi.hoisted(() => ({
  configured: true,
  setDoc: vi.fn(),
  deleteDoc: vi.fn(),
  addUser: vi.fn(),
  removeUser: vi.fn(),
}));

vi.mock('../src/config/firebaseConfig', () => ({
  ADMIN_EMAIL: 'admin@example.com',
  readFirebaseConfig: () => mocks.configured
    ? { apiKey: 'key', authDomain: 'test.example', projectId: 'test', appId: 'app' }
    : null,
}));
vi.mock('firebase/app', () => ({
  getApps: () => [],
  initializeApp: () => ({}),
  getApp: () => ({}),
}));
vi.mock('firebase/auth', () => ({
  getAuth: () => ({}),
  GoogleAuthProvider: vi.fn(),
  onAuthStateChanged: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
}));
vi.mock('firebase/firestore', () => ({
  getFirestore: () => ({}),
  doc: (_db: unknown, collection: string, id: string) => `${collection}/${id}`,
  collection: vi.fn(),
  getDocFromServer: vi.fn(),
  getDocsFromServer: vi.fn(),
  setDoc: mocks.setDoc,
  deleteDoc: mocks.deleteDoc,
}));
vi.mock('../src/services/storageService', () => ({
  storageService: {
    addOrUpdateAuthorizedUser: mocks.addUser,
    removeAuthorizedUser: mocks.removeUser,
  },
}));

import { firebaseAuthService } from '../src/services/firebaseAuthService';

const student: AuthorizedUser = {
  email: 'Student@Example.com',
  name: 'Student',
  role: 'student',
  tenantId: 'default-teacher-tenant',
  active: true,
  unlockedWeeks: 1,
  createdAt: '2026-01-01',
};

describe('alterações da lista de acesso', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.configured = true;
    mocks.setDoc.mockResolvedValue(undefined);
    mocks.deleteDoc.mockResolvedValue(undefined);
  });

  it('só atualiza o cadastro local depois da confirmação do Firestore', async () => {
    mocks.setDoc.mockRejectedValueOnce(new Error('offline'));
    await expect(firebaseAuthService.saveAllowedUser(student)).rejects.toThrow('offline');
    expect(mocks.addUser).not.toHaveBeenCalled();

    await firebaseAuthService.saveAllowedUser(student);
    expect(mocks.setDoc).toHaveBeenLastCalledWith(
      'allowedUsers/student@example.com',
      { ...student, email: 'student@example.com' }
    );
    expect(mocks.addUser).toHaveBeenCalledOnce();
  });

  it('não remove o cadastro local quando a exclusão remota falha', async () => {
    mocks.deleteDoc.mockRejectedValueOnce(new Error('offline'));
    await expect(firebaseAuthService.removeAllowedUser(student.email)).rejects.toThrow('offline');
    expect(mocks.removeUser).not.toHaveBeenCalled();

    await firebaseAuthService.removeAllowedUser(student.email);
    expect(mocks.removeUser).toHaveBeenCalledOnce();
  });

  it('não apresenta sucesso sem Firebase configurado ou para cadastro de professor', async () => {
    mocks.configured = false;
    await expect(firebaseAuthService.saveAllowedUser(student)).rejects.toThrow('Firebase não configurado');
    await expect(firebaseAuthService.removeAllowedUser(student.email)).rejects.toThrow('Firebase não configurado');
    mocks.configured = true;
    await expect(firebaseAuthService.saveAllowedUser({ ...student, role: 'teacher' })).rejects.toThrow();
    expect(mocks.setDoc).not.toHaveBeenCalled();
    expect(mocks.addUser).not.toHaveBeenCalled();
  });
});
