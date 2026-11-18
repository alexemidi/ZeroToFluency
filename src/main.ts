import {
  AuthorizedUser,
  CefrLevel,
  Flashcard,
  FlashcardType,
  SrsButtonRating,
  SrsCardProgress,
  StudyDayLesson,
  BlockTestQuestion,
  BlockTestSkill,
  BlockTestResult,
  BlockTestAnswerSubmission,
} from './types';
import {
  storageService,
  TextPrerequisiteAnalysis,
} from './services/storageService';
import { firebaseAuthService } from './services/firebaseAuthService';
import { audioService } from './services/audioService';
import {
  evaluateLetterCorrespondence,
  buildWordByWordCorrespondence,
  AnkiStyleDiffResult,
} from './services/letterMatcher';
import {
  applySrsRating,
  createInitialSrsProgress,
  getButtonIntervalLabels,
  getTodayDateIso,
  addDaysToIsoDate,
} from './services/srsEngine';
import { importFlashcardsFromCsv, getSampleCsvTemplate } from './services/csvService';
import { getCatalogWords, getCatalogPhrases } from './data/rawCatalog';
import {
  GRAMMAR_ROADMAP_100_DAYS,
  CEFR_CURRICULUM_PLAN_A1_TO_C2,
} from './data/curriculumData';
import {
  BLOCK_TESTS_MAP,
  drawBlockTestQuestions,
  evaluateBlockTestResponse,
  A1_BLOCKS_METADATA,
  BlockMeta,
} from './data/blockTestsData';

type AppTab =
  | 'dashboard'
  | 'study_player'
  | 'lesson_complete'
  | 'block_test'
  | 'cefr_plan'
  | 'calendar'
  | 'student_cards'
  | 'catalog'
  | 'teacher_admin';

interface BlockTestSessionState {
  blockNumber: number;
  questions: BlockTestQuestion[];
  currentIndex: number;
  answers: BlockTestAnswerSubmission[];
  currentResponse: string;
  isAudioPlaying: boolean;
  isListeningSpeech: boolean;
  speechTranscript: string;
  hasSpeechRecognition: boolean;
  evaluationResult: { isCorrect: boolean; matchedAnswer?: string } | null;
  isSubmitted: boolean;
  startedAtMs: number;
  speechRecognitionInstance?: any;
}

interface StudySessionState {
  mode: 'lesson_day' | 'daily_reviews' | 'custom_cards';
  title: string;
  dayNumber?: number;
  queue: Flashcard[];
  currentIndex: number;
  phase: 1 | 2 | 3;
  userTypedEnglish: string;
  userTypedPortuguese: string;
  isGrammarExpanded: boolean;
  isReportFormOpen: boolean;
  reportReasonDraft: string;
  suggestedRating: SrsButtonRating;
  completedInSession: number;
  startedAtMs: number;
  elapsedBeforeResumeSec: number;
  answeredCount: number;
  accuracySum: number;
  newWordsCountInLesson: number;
}

interface LessonCompletionSummary {
  mode: 'lesson_day' | 'daily_reviews' | 'custom_cards';
  lessonNumber?: number;
  lessonTitle: string;
  durationSeconds: number;
  accuracyPercent: number;
  newWordsLearned: number;
  totalCardsCompleted: number;
  incentiveHeadline: string;
  incentiveMessage: string;
  canContinueNextLesson: boolean;
  nextLesson?: StudyDayLesson;
  blockReason?: string;
}

class ZeroToFluencyApp {
  private root: HTMLElement;
  private currentUser: AuthorizedUser | null = null;
  private activeTab: AppTab = 'dashboard';
  private selectedCefrTab: CefrLevel = 'A1';
  private authError: string | null = null;
  private notificationBanner: { type: 'success' | 'error'; message: string } | null = null;
  private session: StudySessionState | null = null;
  private lastCompletedSummary: LessonCompletionSummary | null = null;
  private teacherShowAllLessons = false;
  private teacherExpandedLessonCards: number | null = null;
  private teacherInSessionScriptOpen = true;
  private catalogSearchQuery = '';
  private theme: 'dark' | 'light' = 'dark';
  private lastDialogueAnalysis: TextPrerequisiteAnalysis | null = null;
  private blockTestSession: BlockTestSessionState | null = null;
  private expandedBlocks: Set<number> = new Set<number>([1]);
  private isResetModalOpen = false;
  private isRestoringSession = false;
  private isSigningIn = false;

  constructor(rootElement: HTMLElement) {
    this.root = rootElement;
    const firebaseMode = firebaseAuthService.isConfigured();
    this.currentUser = null;
    this.isRestoringSession = firebaseMode;
    const savedTheme = localStorage.getItem('ztf_theme') as 'dark' | 'light' | null;
    this.theme = savedTheme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.theme);
    this.setupGlobalKeyboardShortcuts();
    this.render();

    if (firebaseMode) {
      void firebaseAuthService.restoreSession().then((user) => {
        this.currentUser = user;
        this.isRestoringSession = false;
        this.render();
      }).catch(() => {
        this.isRestoringSession = false;
        this.authError = 'Não foi possível verificar sua sessão. Tente entrar novamente.';
        this.render();
      });
    }
  }

  private toggleTheme(): void {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', this.theme);
    localStorage.setItem('ztf_theme', this.theme);
    this.render();
  }

  private showBanner(type: 'success' | 'error', message: string): void {
    this.notificationBanner = { type, message };
    this.render();
    setTimeout(() => {
      if (this.notificationBanner?.message === message) {
        this.notificationBanner = null;
        this.render();
      }
    }, 4500);
  }

  /**
   * Calcula a sugestão automática de avaliação SRS na Fase 3 com base na correspondência:
   * - Se o aluno não digitou nada (opcional) ou acertou >= 85%: "Aprendido" ('good')
   * - Se acertou entre 50% e 84%: "Ok" ('hard')
   * - Se digitou e acertou < 50%: "Errei" ('again')
   */
  private computeSuggestedRating(userTypedPt: string, targetPt: string): SrsButtonRating {
    const ptEval = evaluateLetterCorrespondence(userTypedPt, targetPt);
    if (!ptEval.isSubmitted || ptEval.accuracyPercent >= 85) {
      return 'good';
    }
    if (ptEval.accuracyPercent >= 50) {
      return 'hard';
    }
    return 'again';
  }

  private setupGlobalKeyboardShortcuts(): void {
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const activeId = document.activeElement?.id ?? '';

      // Atalho Enter na tela de transição pós-lição para continuar aprendendo
      if (this.activeTab === 'lesson_complete' && e.key === 'Enter') {
        if (activeTag === 'input' || activeTag === 'textarea') return;
        if (this.lastCompletedSummary?.canContinueNextLesson && this.lastCompletedSummary.nextLesson) {
          e.preventDefault();
          this.startLessonSession(this.lastCompletedSummary.nextLesson, true);
        }
        return;
      }

      if (!this.session || this.activeTab !== 'study_player') return;
      const currentCard = this.session.queue[this.session.currentIndex];
      if (!currentCard) return;

      // Se estiver digitando dentro do formulário de reporte da bandeirinha, não avança o card com Enter
      if (activeId === 'report-reason-input' || activeId === 'report-suggestion-input') {
        return;
      }

      if (e.key === 'Enter') {
        if (this.session.phase === 1) {
          e.preventDefault();
          this.advanceToPhase(2);
        } else if (this.session.phase === 2) {
          e.preventDefault();
          this.advanceToPhase(3);
        } else if (this.session.phase === 3) {
          if (activeTag === 'input' || activeTag === 'textarea') return;
          e.preventDefault();
          this.handleSrsAnswer(this.session.suggestedRating);
        }
      } else if (this.session.phase === 3) {
        if (activeTag === 'input' || activeTag === 'textarea') return;
        if (e.key === '1') {
          e.preventDefault();
          this.handleSrsAnswer('again');
        } else if (e.key === '2') {
          e.preventDefault();
          this.handleSrsAnswer('hard');
        } else if (e.key === '3') {
          e.preventDefault();
          this.handleSrsAnswer('good');
        }
      }
    });
  }

  /**
   * Verifica se o usuário pode iniciar uma nova lição hoje considerando módulos liberados e cotas.
   */
  private checkCanUserStartLesson(day: StudyDayLesson): { allowed: boolean; reason?: string } {
    if (!this.currentUser) return { allowed: false, reason: 'Usuário não autenticado.' };
    if (this.currentUser.role === 'teacher') return { allowed: true };

    const maxUnlockedLesson = this.currentUser.unlockedWeeks * 7;
    if (day.dayNumber > maxUnlockedLesson) {
      return {
        allowed: false,
        reason: `Limite do módulo atingido (${maxUnlockedLesson} lições liberadas). Revise o conteúdo atual até a próxima liberação do professor.`,
      };
    }

    const isAlreadyCompleted = storageService.isDayCompletedByUser(
      this.currentUser.email,
      day.dayNumber
    );
    if (!isAlreadyCompleted) {
      const metrics = storageService.getStudyDaysMetrics(this.currentUser.email);
      if (metrics.totalStudyDaysEquivalent >= metrics.maxTotalStudyDaysLimit) {
        return {
          allowed: false,
          reason: `Limite geral do seu plano atingido (${metrics.maxTotalStudyDaysLimit} dias de estudo / ${metrics.maxTotalStudyDaysLimit * 10} palavras).`,
        };
      }
      if (metrics.newWordsLearnedToday >= metrics.dailyWordsQuota) {
        return {
          allowed: false,
          reason: `Meta máxima de hoje atingida: ${metrics.dailyStudyDaysQuota} dia(s) de estudo (${metrics.dailyWordsQuota} palavras novas). Faça suas revisões ou volte amanhã.`,
        };
      }
    }

    return { allowed: true };
  }

  /**
   * Salva o ponto exato onde o aluno está na lição atual para retomar caso saia.
   */
  private persistCurrentSessionCheckpoint(): void {
    if (!this.session || !this.currentUser || this.session.mode !== 'lesson_day' || !this.session.dayNumber) {
      return;
    }
    const elapsedNow =
      this.session.elapsedBeforeResumeSec +
      Math.max(0, Math.round((Date.now() - this.session.startedAtMs) / 1000));

    storageService.saveLessonCheckpoint({
      userEmail: this.currentUser.email,
      dayNumber: this.session.dayNumber,
      title: this.session.title,
      queueCardIds: this.session.queue.map((c) => c.id),
      currentIndex: this.session.currentIndex,
      elapsedSeconds: elapsedNow,
      answeredCount: this.session.answeredCount,
      accuracySum: this.session.accuracySum,
      newWordsCountInLesson: this.session.newWordsCountInLesson,
      updatedAtIso: new Date().toISOString(),
    });
  }

  /**
   * Acionado pelo botão principal "Estudar": retoma de onde parou ou abre a próxima lição pendente.
   */
  private startNextOrResumedStudy(): void {
    if (!this.currentUser) return;
    const nextLesson = storageService.getNextPendingLessonForUser(this.currentUser.email);
    if (!nextLesson) {
      this.showBanner('success', 'Você concluiu todas as lições disponíveis!');
      return;
    }
    this.startLessonSession(nextLesson, true);
  }

  private startLessonSession(day: StudyDayLesson, allowResumeCheckpoint = true): void {
    if (!this.currentUser) return;

    const permission = this.checkCanUserStartLesson(day);
    if (!permission.allowed) {
      this.showBanner('error', permission.reason ?? 'Lição bloqueada.');
      return;
    }

    const checkpoint = allowResumeCheckpoint
      ? storageService.getLessonCheckpoint(this.currentUser.email)
      : null;

    if (checkpoint && checkpoint.dayNumber === day.dayNumber && checkpoint.queueCardIds.length > 0) {
      const cardById = new Map<string, Flashcard>();
      day.cards.forEach((c) => cardById.set(c.id, c));
      const restoredQueue = checkpoint.queueCardIds
        .map((id) => cardById.get(id))
        .filter((c): c is Flashcard => Boolean(c));

      if (restoredQueue.length > 0 && checkpoint.currentIndex < restoredQueue.length) {
        this.session = {
          mode: 'lesson_day',
          title: day.title,
          dayNumber: day.dayNumber,
          queue: restoredQueue,
          currentIndex: checkpoint.currentIndex,
          phase: 1,
          userTypedEnglish: '',
          userTypedPortuguese: '',
          isGrammarExpanded: false,
          isReportFormOpen: false,
          reportReasonDraft: '',
          suggestedRating: 'good',
          completedInSession: checkpoint.currentIndex,
          startedAtMs: Date.now(),
          elapsedBeforeResumeSec: checkpoint.elapsedSeconds,
          answeredCount: checkpoint.answeredCount,
          accuracySum: checkpoint.accuracySum,
          newWordsCountInLesson: checkpoint.newWordsCountInLesson,
        };

        this.activeTab = 'study_player';
        this.render();
        this.playCurrentCardAudio();
        return;
      }
    }

    const { queue, skippedCount } = storageService.getLessonQueueForUser(
      this.currentUser.email,
      day
    );

    const srsMap = storageService.getUserSrsMap(this.currentUser.email);
    queue.forEach((card) => {
      const existing = srsMap[card.id];
      if (!existing) {
        storageService.saveUserCardSrs(
          this.currentUser!.email,
          createInitialSrsProgress(card.id, this.currentUser!.email)
        );
      } else if (existing.stage !== 'graduated') {
        storageService.saveUserCardSrs(this.currentUser!.email, {
          ...existing,
          stage: 'new',
          passCountInSession: 0,
        });
      }
    });

    const newWordsInQueue = queue.filter((c) => c.type === 'word').length;

    this.session = {
      mode: 'lesson_day',
      title: day.title,
      dayNumber: day.dayNumber,
      queue,
      currentIndex: 0,
      phase: 1,
      userTypedEnglish: '',
      userTypedPortuguese: '',
      isGrammarExpanded: false,
      isReportFormOpen: false,
      reportReasonDraft: '',
      suggestedRating: 'good',
      completedInSession: 0,
      startedAtMs: Date.now(),
      elapsedBeforeResumeSec: 0,
      answeredCount: 0,
      accuracySum: 0,
      newWordsCountInLesson: newWordsInQueue,
    };

    this.persistCurrentSessionCheckpoint();

    if (skippedCount > 0) {
      this.showBanner(
        'success',
        `${skippedCount} card(s) já conhecido(s) pulado(s) automaticamente.`
      );
    }

    this.activeTab = 'study_player';
    this.render();
    this.playCurrentCardAudio();
  }

  private startDueReviewsSession(): void {
    if (!this.currentUser) return;
    const dueCards = storageService.getDueReviewCards(this.currentUser.email);
    if (dueCards.length === 0) {
      this.showBanner('success', 'Nenhuma revisão pendente para hoje.');
      return;
    }

    this.session = {
      mode: 'daily_reviews',
      title: 'Revisão Espaçada do Dia',
      queue: [...dueCards],
      currentIndex: 0,
      phase: 1,
      userTypedEnglish: '',
      userTypedPortuguese: '',
      isGrammarExpanded: false,
      isReportFormOpen: false,
      reportReasonDraft: '',
      suggestedRating: 'good',
      completedInSession: 0,
      startedAtMs: Date.now(),
      elapsedBeforeResumeSec: 0,
      answeredCount: 0,
      accuracySum: 0,
      newWordsCountInLesson: 0,
    };

    this.activeTab = 'study_player';
    this.render();
    this.playCurrentCardAudio();
  }

  private startCustomCardsSession(): void {
    if (!this.currentUser) return;
    const customCards = storageService.getCustomStudentCards(this.currentUser.email);
    if (customCards.length === 0) {
      this.showBanner('error', 'Adicione um flashcard primeiro.');
      return;
    }

    const srsMap = storageService.getUserSrsMap(this.currentUser.email);
    customCards.forEach((card) => {
      if (!srsMap[card.id]) {
        storageService.saveUserCardSrs(
          this.currentUser!.email,
          createInitialSrsProgress(card.id, this.currentUser!.email)
        );
      }
    });

    this.session = {
      mode: 'custom_cards',
      title: 'Meus Cards',
      queue: [...customCards],
      currentIndex: 0,
      phase: 1,
      userTypedEnglish: '',
      userTypedPortuguese: '',
      isGrammarExpanded: false,
      isReportFormOpen: false,
      reportReasonDraft: '',
      suggestedRating: 'good',
      completedInSession: 0,
      startedAtMs: Date.now(),
      elapsedBeforeResumeSec: 0,
      answeredCount: 0,
      accuracySum: 0,
      newWordsCountInLesson: 0,
    };

    this.activeTab = 'study_player';
    this.render();
    this.playCurrentCardAudio();
  }

  private playCurrentCardAudio(rate = 0.96): void {
    if (!this.session) return;
    const card = this.session.queue[this.session.currentIndex];
    if (!card || card.type === 'grammar') return;
    audioService.speak(card.english, card.audioUrl, rate);
  }

  private advanceToPhase(targetPhase: 2 | 3): void {
    if (!this.session) return;
    const card = this.session.queue[this.session.currentIndex];
    if (!card) return;

    const ptInput = document.getElementById('phase2-pt-input') as HTMLInputElement | null;
    if (ptInput) {
      this.session.userTypedPortuguese = ptInput.value;
    }

    this.session.phase = targetPhase;
    this.session.isGrammarExpanded = false;
    this.session.isReportFormOpen = false;
    this.session.reportReasonDraft = '';

    if (targetPhase === 3) {
      this.session.suggestedRating = this.computeSuggestedRating(
        this.session.userTypedPortuguese,
        card.portuguese
      );
    }

    this.render();
    this.playCurrentCardAudio();

    if (targetPhase === 2) {
      setTimeout(() => {
        const nextInput = document.getElementById(
          'phase2-pt-input'
        ) as HTMLInputElement | null;
        nextInput?.focus();
      }, 50);
    }
  }

  private buildIncentiveCopy(accuracyPercent: number): { headline: string; message: string } {
    if (accuracyPercent >= 90) {
      return {
        headline: 'Domínio sólido e preciso.',
        message:
          'Você conectou o som, a escrita e o significado com excelente clareza. É exatamente essa consistência que constrói a fluência natural.',
      };
    }
    if (accuracyPercent >= 75) {
      return {
        headline: 'Progresso firme e bem estruturado.',
        message:
          'Seu repertório ativo está crescendo a cada sessão. O sistema de revisão espaçada vai trazer cada palavra no momento exato para consolidar sua memória.',
      };
    }
    return {
      headline: 'Etapa concluída com persistência.',
      message:
        'O primeiro contato com novas estruturas exige atenção. As palavras revisadas hoje voltarão no tempo ideal para se tornarem automáticas.',
    };
  }

  private formatDuration(totalSec: number): string {
    const safeSec = Math.max(1, totalSec);
    const mins = Math.floor(safeSec / 60);
    const secs = safeSec % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  }

  private handleSrsAnswer(rating: SrsButtonRating): void {
    if (!this.session || !this.currentUser) return;
    const card = this.session.queue[this.session.currentIndex];
    if (!card) return;

    const todayIso = getTodayDateIso();
    const srsMap = storageService.getUserSrsMap(this.currentUser.email);
    const currentProgress: SrsCardProgress =
      srsMap[card.id] ??
      createInitialSrsProgress(card.id, this.currentUser.email, card.tenantId, todayIso);

    // Contabiliza precisão desta resposta para a tela de transição
    const ptEval = evaluateLetterCorrespondence(
      this.session.userTypedPortuguese,
      card.portuguese
    );
    let cardScore = 100;
    if (ptEval.isSubmitted) {
      cardScore = rating === 'good' ? Math.max(ptEval.accuracyPercent, 90) : ptEval.accuracyPercent;
    } else {
      cardScore = rating === 'good' ? 100 : rating === 'hard' ? 75 : 35;
    }
    this.session.answeredCount += 1;
    this.session.accuracySum += cardScore;

    const scheduledCounts = storageService.getScheduledCountsByDate(this.currentUser.email);
    const updatedProgress = applySrsRating(
      currentProgress,
      rating,
      todayIso,
      scheduledCounts,
      this.session.currentIndex
    );

    storageService.saveUserCardSrs(this.currentUser.email, updatedProgress);

    if (updatedProgress.intervalDays === 0) {
      this.session.queue.push(card);
    } else {
      this.session.completedInSession++;
      if (this.session.mode === 'daily_reviews') {
        storageService.recordDailyActivity(this.currentUser.email, {
          reviewsDelta: 1,
        });
      } else {
        storageService.recordDailyActivity(this.currentUser.email, {
          newCardsDelta: 1,
        });
      }
    }

    if (this.session.currentIndex + 1 < this.session.queue.length) {
      this.session.currentIndex++;
      this.session.phase = 1;
      this.session.userTypedEnglish = '';
      this.session.userTypedPortuguese = '';
      this.session.isGrammarExpanded = false;
      this.session.isReportFormOpen = false;
      this.session.reportReasonDraft = '';
      this.session.suggestedRating = 'good';
      this.persistCurrentSessionCheckpoint();
      this.render();
      this.playCurrentCardAudio();
    } else {
      const totalElapsedSec =
        this.session.elapsedBeforeResumeSec +
        Math.max(1, Math.round((Date.now() - this.session.startedAtMs) / 1000));
      const finalAccuracy = Math.round(
        this.session.accuracySum / Math.max(1, this.session.answeredCount)
      );
      const copy = this.buildIncentiveCopy(finalAccuracy);

      if (this.session.mode === 'lesson_day' && this.session.dayNumber) {
        storageService.clearLessonCheckpoint(this.currentUser.email);
        storageService.recordDailyActivity(this.currentUser.email, {
          completedDayNumber: this.session.dayNumber,
        });
      }

      const nextPending = storageService.getNextPendingLessonForUser(this.currentUser.email);
      const canStartNext =
        nextPending && nextPending.dayNumber !== this.session.dayNumber
          ? this.checkCanUserStartLesson(nextPending)
          : { allowed: false, reason: 'Todas as lições disponíveis foram concluídas.' };

      this.lastCompletedSummary = {
        mode: this.session.mode,
        lessonNumber: this.session.dayNumber,
        lessonTitle: this.session.title,
        durationSeconds: totalElapsedSec,
        accuracyPercent: finalAccuracy,
        newWordsLearned: this.session.newWordsCountInLesson,
        totalCardsCompleted: this.session.completedInSession,
        incentiveHeadline: copy.headline,
        incentiveMessage: copy.message,
        canContinueNextLesson: Boolean(canStartNext.allowed && nextPending),
        nextLesson: canStartNext.allowed && nextPending ? nextPending : undefined,
        blockReason: canStartNext.reason,
      };

      this.session = null;
      this.activeTab = 'lesson_complete';
      this.render();
    }
  }

  public render(): void {
    if (!this.currentUser) {
      this.root.innerHTML = this.renderLoginScreen();
      this.bindLoginEvents();
      return;
    }

    this.root.innerHTML = `
      <div class="app-shell">
        ${this.renderNavbar()}
        ${this.renderNotificationBanner()}
        <main>
          ${this.renderActiveTabContent()}
        </main>
      </div>
      ${this.renderResetModal()}
    `;

    this.bindAuthenticatedEvents();
  }

  private renderNotificationBanner(): string {
    if (!this.notificationBanner) return '';
    const isError = this.notificationBanner.type === 'error';
    return `
      <div style="
        padding: 10px 14px;
        border-radius: 6px;
        margin-bottom: 18px;
        background: ${isError ? 'rgba(244,63,94,0.14)' : 'rgba(16,185,129,0.14)'};
        border: 1px solid ${isError ? 'rgba(244,63,94,0.4)' : 'rgba(16,185,129,0.4)'};
        color: ${isError ? 'var(--match-err-text)' : 'var(--match-ok-text)'};
        font-size: 0.88rem;
      ">
        ${this.escapeHtml(this.notificationBanner.message)}
      </div>
    `;
  }

  private renderLoginScreen(): string {
    const configured = firebaseAuthService.isConfigured();
    const errorHtml = this.authError
      ? `<div class="login-alert">${this.escapeHtml(this.authError)}</div>`
      : '';

    let actionHtml: string;
    if (this.isRestoringSession) {
      actionHtml = `<div class="login-loading"><span class="spinner"></span>Verificando seu acesso...</div>`;
    } else if (!configured) {
      actionHtml = `<div class="login-alert">O login com Google ainda não foi configurado neste site.</div>`;
    } else {
      actionHtml = `
        <button id="btn-google-login" class="google-btn" ${this.isSigningIn ? 'disabled' : ''}>
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.2 8.9 5 12 5z"/>
            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.2-2 3.7-5 3.7-8.7z"/>
            <path fill="#FBBC05" d="M5.3 14.8c-.2-.8-.4-1.6-.4-2.5s.2-1.7.4-2.5L1.6 7C.6 9 0 11.2 0 13.5s.6 4.5 1.6 6.5l3.7-2.9z"/>
            <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5l-3.7 2.8C3.5 21.4 7.4 24 12 24z"/>
          </svg>
          ${this.isSigningIn ? 'Entrando...' : 'Continuar com Google'}
        </button>
        <p class="login-note">O acesso é liberado pelo professor. Use o e-mail Google informado a ele.</p>`;
    }

    return `
      <div class="login-stage">
        <div class="login-bubbles" aria-hidden="true">
          <span class="bubble b1"></span><span class="bubble b2"></span>
          <span class="bubble b3"></span><span class="bubble b4"></span>
        </div>
        <div class="login-wrapper">
          <div class="login-logo" aria-hidden="true">
            <span class="logo-block lb-1">Z</span><span class="logo-block lb-2">T</span><span class="logo-block lb-3">F</span>
          </div>
          <h1 class="login-title">ZeroToFluency</h1>
          <p class="login-subtitle">Aprenda inglês frase por frase, no seu ritmo.</p>
          ${errorHtml}
          ${actionHtml}
        </div>
      </div>
    `;
  }

  private renderNavbar(): string {
    if (!this.currentUser) return '';
    const dueReviews = storageService.getDueReviewCards(this.currentUser.email).length;
    const pendingReports =
      this.currentUser.role === 'teacher'
        ? storageService.getTranslationReports().filter((r) => r.status === 'pending').length
        : 0;

    return `
      <header class="top-navbar">
        <div class="brand-logo" id="nav-brand-home">
          <span class="brand-dot"></span>
          <span>ZeroToFluency</span>
        </div>

        <nav class="nav-tabs">
          <button class="nav-tab ${this.activeTab === 'dashboard' || this.activeTab === 'study_player' || this.activeTab === 'lesson_complete' ? 'active' : ''}" data-tab="dashboard">
            Estudar ${dueReviews > 0 ? `<span class="tag-minimal">${dueReviews}</span>` : ''}
          </button>
          <button class="nav-tab ${this.activeTab === 'cefr_plan' ? 'active' : ''}" data-tab="cefr_plan">
            Níveis (A1–C2)
          </button>
          <button class="nav-tab ${this.activeTab === 'calendar' ? 'active' : ''}" data-tab="calendar">
            Calendário
          </button>
          <button class="nav-tab ${this.activeTab === 'student_cards' ? 'active' : ''}" data-tab="student_cards">
            Meus Cards
          </button>
          <button class="nav-tab ${this.activeTab === 'catalog' ? 'active' : ''}" data-tab="catalog">
            Banco
          </button>
          ${
            this.currentUser.role === 'teacher'
              ? `<button class="nav-tab ${this.activeTab === 'teacher_admin' ? 'active' : ''}" data-tab="teacher_admin">
                  Professor ${pendingReports > 0 ? `<span class="tag-minimal">${pendingReports}</span>` : ''}
                </button>`
              : ''
          }
        </nav>

        <div class="user-pill">
          <button id="btn-toggle-theme" class="theme-toggle-btn" title="Alternar tema claro/escuro">
            <span class="css-icon-theme"></span>
          </button>
          <span>${this.escapeHtml(this.currentUser.name)}</span>
          <button id="btn-open-reset-modal" class="btn btn-sm btn-ghost" title="Resetar histórico e progresso dos estudos" style="color: var(--accent-danger);">
            Resetar Estudos
          </button>
          <button id="btn-logout" class="btn btn-sm">Sair</button>
        </div>
      </header>
    `;
  }

  private renderResetModal(): string {
    if (!this.isResetModalOpen) return '';
    return `
      <div class="modal-backdrop" id="reset-modal-backdrop">
        <div class="modal-dialog">
          <h3 style="margin-top: 0; font-size: 1.2rem; font-weight: 700; color: var(--accent-danger);">
            Resetar Todos os Estudos
          </h3>
          <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.5; margin: 12px 0 20px;">
            Tem certeza de que deseja resetar todo o seu histórico de estudos? Todos os cartões SRS aprendidos, revisões agendadas, estatísticas diárias e testes de bloco serão zerados para recomeçar do zero. Esta ação não pode ser desfeita.
          </p>
          <div style="display: flex; justify-content: flex-end; gap: 10px;">
            <button id="btn-cancel-reset" class="btn btn-secondary">Cancelar</button>
            <button id="btn-confirm-reset" class="btn btn-danger">Confirmar Reset</button>
          </div>
        </div>
      </div>
    `;
  }

  private renderActiveTabContent(): string {
    switch (this.activeTab) {
      case 'dashboard':
        return this.renderDashboard();
      case 'study_player':
        return this.renderStudyPlayer();
      case 'block_test':
        return this.renderBlockTestScreen();
      case 'lesson_complete':
        return this.renderLessonCompleteTransition();
      case 'cefr_plan':
        return this.renderCefrPlanTab();
      case 'calendar':
        return this.renderCalendarTab();
      case 'student_cards':
        return this.renderStudentCustomCardsTab();
      case 'catalog':
        return this.renderCatalogTab();
      case 'teacher_admin':
        return this.renderTeacherAdminTab();
      default:
        return this.renderDashboard();
    }
  }

  private renderDashboard(): string {
    if (!this.currentUser) return '';
    const days = storageService.getStudyDays();
    const completedLessons = storageService.getCompletedDayNumbers(this.currentUser.email);
    const dueReviews = storageService.getDueReviewCards(this.currentUser.email);
    const metrics = storageService.getStudyDaysMetrics(this.currentUser.email);
    const checkpoint = storageService.getLessonCheckpoint(this.currentUser.email);
    const nextLesson = storageService.getNextPendingLessonForUser(this.currentUser.email);

    const maxUnlockedLesson =
      this.currentUser.role === 'teacher' ? 999 : this.currentUser.unlockedWeeks * 7;

    const weeksMap = new Map<number, StudyDayLesson[]>();
    days.forEach((d) => {
      const w = d.weekNumber || Math.ceil(d.dayNumber / 7);
      if (!weeksMap.has(w)) weeksMap.set(w, []);
      weeksMap.get(w)!.push(d);
    });

    const isResumingCheckpoint =
      Boolean(checkpoint && nextLesson && checkpoint.dayNumber === nextLesson.dayNumber);

    return `
      <section class="summary-bar">
        <div class="summary-metrics">
          <div class="metric-item">
            <span class="metric-label">Dias estudados (1 dia = 10 palavras)</span>
            <span class="metric-val">${metrics.totalStudyDaysEquivalent} / ${metrics.maxTotalStudyDaysLimit}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Hoje (Limite: ${this.currentUser.role === 'teacher' ? 'Livre' : `${metrics.dailyStudyDaysQuota} dias / ${metrics.dailyWordsQuota} pal.`})</span>
            <span class="metric-val">${metrics.studyDaysCompletedToday} dia (${metrics.newWordsLearnedToday} pal.)</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Palavras conhecidas</span>
            <span class="metric-val">${metrics.knownWordsTotal}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Lições concluídas</span>
            <span class="metric-val">${completedLessons.length} / ${days.length}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Revisões hoje</span>
            <span class="metric-val">${dueReviews.length}</span>
          </div>
        </div>
      </section>

      <!-- CENTRAL DE ESTUDO DIRETO (BOTÃO ESTUDAR QUE RETOMA EXATAMENTE DE ONDE PAROU) -->
      <section class="study-hub-card">
        <div class="study-hub-badge">
          ${
            isResumingCheckpoint && checkpoint
              ? `Em andamento • Card ${checkpoint.currentIndex + 1} de ${checkpoint.queueCardIds.length}`
              : nextLesson
                ? `Próxima Etapa • Lição ${nextLesson.dayNumber} de ${days.length} (Nível ${nextLesson.cefrLevel || 'A1'})`
                : 'Trilha Concluída'
          }
        </div>

        <h2 class="study-hub-title">
          ${nextLesson ? this.escapeHtml(nextLesson.title) : 'Todas as lições concluídas'}
        </h2>

        <p class="study-hub-subtitle">
          ${
            nextLesson
              ? this.escapeHtml(nextLesson.grammarFocus)
              : 'Continue praticando suas revisões diárias para manter a fluência.'
          }
        </p>

        <div style="display:flex; justify-content:center; align-items:center; gap:12px; flex-wrap:wrap;">
          ${
            nextLesson
              ? `<button id="btn-main-study-now" class="btn-study-cta">
                  <span>${isResumingCheckpoint ? 'Estudar (Retomar de onde parou)' : 'Estudar'}</span>
                </button>`
              : ''
          }

          ${
            dueReviews.length > 0
              ? `<button id="btn-start-due-reviews" class="btn btn-primary" style="padding: 15px 24px; font-size: 0.98rem;">
                  Revisar Pendências de Hoje (${dueReviews.length})
                </button>`
              : ''
          }
        </div>
      </section>

      <!-- TRILHA MODULAR DE 15 BLOCOS (NÍVEL A1) COM TESTES DE AVALIAÇÃO -->
      <section class="curriculum-blocks-container">
        <div class="curriculum-blocks-header">
          <div>
            <h3 class="curriculum-blocks-title">Trilha Pedagógica A1 — 15 Blocos Construtivos</h3>
            <span style="font-size: 0.82rem; color: var(--text-secondary);">
              150 lições graduais com textos narrativos e Teste de Bloco (5 habilidades, mínimo 80% para desbloquear).
            </span>
          </div>
          <span class="tag-minimal">
            ${storageService.getPassedBlockTests(this.currentUser.email).length} de 15 Blocos Aprovados
          </span>
        </div>

        ${A1_BLOCKS_METADATA.map((block) => this.renderBlockCard(block, days, completedLessons)).join('')}
      </section>

      <!-- OPÇÃO EXCLUSIVA DO PROFESSOR PARA VER TODAS AS LIÇÕES E CARDS -->
      ${
        this.currentUser.role === 'teacher'
          ? `
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom: 16px;">
            <div style="font-size: 0.88rem; color: var(--text-secondary);">
              Modo Professor: <strong>${days.length} lições</strong> estruturadas (${days.reduce((acc, d) => acc + d.cards.length, 0)} flashcards no total).
            </div>
            <button id="btn-teacher-toggle-lessons" class="btn btn-sm">
              ${this.teacherShowAllLessons ? 'Ocultar lista de lições e cards' : `Ver todas as ${days.length} lições e cards (Modo Professor)`}
            </button>
          </div>

          ${
            this.teacherShowAllLessons
              ? Array.from(weeksMap.entries())
                  .map(([weekNum, weekDays]) => {
                    const isWeekUnlocked =
                      this.currentUser!.role === 'teacher' ||
                      weekNum <= this.currentUser!.unlockedWeeks;
                    const levelLabel = weekDays[0]?.cefrLevel || 'A1';
                    return `
                      <div class="week-section">
                        <div class="week-header">
                          <strong>Módulo ${weekNum} (Nível ${levelLabel})</strong>
                          <span>${isWeekUnlocked ? `${weekDays.length} lições` : '<span class="css-icon-lock"></span>Aguardando liberação'}</span>
                        </div>

                        <div class="days-grid">
                          ${weekDays
                            .map((day) => {
                              const isCompleted = completedLessons.includes(day.dayNumber);
                              const isLocked = day.dayNumber > maxUnlockedLesson;
                              const newWordsInLesson = day.cards.filter((c) => c.type === 'word').length;
                              const isCardsOpen = this.teacherExpandedLessonCards === day.dayNumber;
                              return `
                                <article class="day-card ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}" style="cursor: default;">
                                  <div>
                                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px;">
                                      <span class="tag-minimal">
                                        ${day.isDialogueDay ? `Prática • ${day.cards.length} cards` : `${newWordsInLesson} palavras • ${day.cards.length} cards`}
                                      </span>
                                      ${isCompleted ? `<span class="css-icon-check" title="Concluído"></span>` : ''}
                                      ${isLocked ? `<span class="css-icon-lock" title="Bloqueado"></span>` : ''}
                                    </div>
                                    <h3 style="font-size: 0.98rem; font-weight: 600; margin-bottom: 4px;">
                                      ${this.escapeHtml(day.title)}
                                    </h3>
                                    <p style="font-size: 0.8rem; color: var(--text-secondary);">
                                      ${this.escapeHtml(day.grammarFocus)}
                                    </p>
                                  </div>

                                  <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top: 8px;">
                                    <button class="btn btn-primary btn-sm" data-start-day="${day.dayNumber}">
                                      Testar Lição
                                    </button>
                                    <button class="btn btn-sm" data-toggle-lesson-cards="${day.dayNumber}">
                                      ${isCardsOpen ? 'Ocultar Cards' : `Ver Cards (${day.cards.length})`}
                                    </button>
                                  </div>

                                  ${
                                    isCardsOpen
                                      ? `
                                      <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border-color); max-height: 260px; overflow-y: auto; font-size: 0.8rem;">
                                        ${day.cards
                                          .map(
                                            (c, idx) => `
                                          <div style="display:flex; justify-content:space-between; gap:8px; padding: 4px 0; border-bottom: 1px dashed var(--border-color);">
                                            <div>
                                              <span style="color:var(--text-muted);">${idx + 1}. [${c.type}]</span>
                                              <strong>${this.escapeHtml(c.english)}</strong> —
                                              <span style="color:var(--text-secondary);">${this.escapeHtml(c.portuguese)}</span>
                                            </div>
                                            ${
                                              c.type !== 'grammar'
                                                ? `<button class="css-icon-play-sm" data-speak-text="${this.escapeHtml(
                                                    c.english
                                                  )}" title="Ouvir"></button>`
                                                : ''
                                            }
                                          </div>
                                        `
                                          )
                                          .join('')}
                                      </div>
                                    `
                                      : ''
                                  }
                                </article>
                              `;
                            })
                            .join('')}
                        </div>
                      </div>
                    `;
                  })
                  .join('')
              : ''
          }
        `
          : ''
      }
    `;
  }

  private renderBlockCard(
    block: BlockMeta,
    allDays: StudyDayLesson[],
    completedLessons: number[]
  ): string {
    if (!this.currentUser) return '';
    const email = this.currentUser.email;
    const isTeacher = this.currentUser.role === 'teacher';
    const isUnlocked = isTeacher || storageService.isBlockUnlocked(block.blockNumber, email);
    const isPassed = storageService.isBlockPassedTest(block.blockNumber, email);
    const blockDays = allDays.filter(
      (d) => d.dayNumber >= block.lessonRange[0] && d.dayNumber <= block.lessonRange[1]
    );

    const completedInBlock = blockDays.filter((d) => completedLessons.includes(d.dayNumber)).length;
    const allBlockLessonsCompleted = completedInBlock >= blockDays.length && blockDays.length > 0;
    const isOpen = this.expandedBlocks.has(block.blockNumber);

    const testResults = storageService.getBlockTestResults(email);
    const bestResult = testResults
      .filter((r) => r.blockNumber === block.blockNumber)
      .sort((a, b) => b.score - a.score)[0];

    let badgeClass = 'badge-locked';
    let badgeText = 'Bloqueado';
    if (isPassed) {
      badgeClass = 'badge-passed';
      badgeText = bestResult ? `Aprovado • ${bestResult.score}/10 (${bestResult.score * 10}%)` : 'Aprovado';
    } else if (allBlockLessonsCompleted) {
      badgeClass = 'badge-ready';
      badgeText = 'Teste Disponível';
    } else if (isUnlocked) {
      badgeClass = 'badge-progress';
      badgeText = `${completedInBlock}/${blockDays.length} Lições`;
    }

    const progressPercent = blockDays.length > 0 ? (completedInBlock / blockDays.length) * 100 : 0;

    return `
      <article class="block-card ${isUnlocked ? 'unlocked' : 'locked'}">
        <header class="block-header" data-toggle-block="${block.blockNumber}">
          <div class="block-header-info">
            <div class="block-title-row">
              <h4 class="block-title">${this.escapeHtml(block.title)}</h4>
              <span class="block-badge ${badgeClass}">
                ${isUnlocked ? (isPassed ? '<span class="css-icon-check"></span>' : '') : '<span class="css-icon-lock"></span>'}
                ${badgeText}
              </span>
            </div>
            <div class="block-theme">
              ${this.escapeHtml(block.theme)} • Lições ${block.lessonRange[0]} a ${block.lessonRange[1]}
            </div>
          </div>
          <div class="block-header-actions">
            <span class="block-toggle-arrow ${isOpen ? 'open' : ''}"></span>
          </div>
        </header>

        <div class="block-progress-track">
          <div class="block-progress-fill" style="width: ${progressPercent}%;"></div>
        </div>

        ${
          isOpen
            ? `
          <div class="block-body">
            <div style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 12px;">
              <strong>Foco Gramatical:</strong> ${this.escapeHtml(block.grammarTopics)}
            </div>

            <div class="block-lessons-grid">
              ${blockDays
                .map((day) => {
                  const isDone = completedLessons.includes(day.dayNumber);
                  const isCheckpoint =
                    Boolean(storageService.getLessonCheckpoint(email)?.dayNumber === day.dayNumber);
                  const isCardsOpen = this.teacherExpandedLessonCards === day.dayNumber;
                  return `
                    <div class="block-lesson-row ${isDone ? 'completed' : ''}">
                      <div class="block-lesson-info">
                        <div class="block-lesson-title">
                          ${isDone ? '<span class="css-icon-check"></span> ' : ''}${this.escapeHtml(day.title)}
                        </div>
                        <div class="block-lesson-sub">
                          ${day.isDialogueDay ? 'Texto Narrativo de Fechamento' : `${day.cards.length} cards`}
                        </div>
                      </div>
                      <div style="display:flex; gap:6px; align-items:center;">
                        ${
                          isTeacher
                            ? `<button class="btn btn-sm" data-toggle-lesson-cards="${day.dayNumber}" title="Ver todas as frases e palavras do roteiro desta lição">
                                ${isCardsOpen ? 'Ocultar Roteiro' : 'Ver Roteiro'}
                              </button>`
                            : ''
                        }
                        ${
                          isUnlocked
                            ? `<button class="btn btn-sm ${isDone ? '' : 'btn-primary'}" data-start-day="${day.dayNumber}">
                                ${isDone ? 'Revisar' : isCheckpoint ? 'Continuar' : 'Estudar'}
                              </button>`
                            : ''
                        }
                      </div>
                    </div>
                    ${
                      isTeacher && isCardsOpen
                        ? `
                      <div style="grid-column: 1 / -1; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 8px; padding: 12px; margin-top: -6px; margin-bottom: 10px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid var(--border-color);">
                          <div>
                            <span class="tag-minimal" style="background:var(--accent-primary); color:#fff; font-weight:700;">Modo Professor</span>
                            <strong style="margin-left:6px; font-size:0.9rem;">Roteiro da Lição: ${this.escapeHtml(day.title)}</strong>
                            <span style="color:var(--text-secondary); font-size:0.8rem; margin-left:6px;">(${day.cards.length} cards)</span>
                          </div>
                          <button class="btn btn-primary btn-sm" data-start-day="${day.dayNumber}">
                            Testar Lição
                          </button>
                        </div>
                        <div style="display:flex; flex-direction:column; gap:6px; max-height: 320px; overflow-y: auto;">
                          ${day.cards
                            .map(
                              (c, idx) => `
                            <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; padding: 6px 10px; background: var(--bg-elevated); border-radius: 6px; font-size: 0.84rem;">
                              <div style="display:flex; align-items:center; gap:8px; flex:1;">
                                <span style="font-weight:700; color:var(--text-muted); min-width:20px;">${idx + 1}.</span>
                                <span class="tag-minimal" style="${
                                  c.type === 'phrase'
                                    ? 'background:rgba(16,185,129,0.15); color:#10b981; font-weight:700;'
                                    : c.type === 'grammar'
                                    ? 'background:rgba(168,85,247,0.15); color:#a855f7; font-weight:700;'
                                    : 'background:rgba(59,130,246,0.15); color:#3b82f6; font-weight:700;'
                                }">
                                  ${c.type === 'phrase' ? 'Frase' : c.type === 'grammar' ? 'Gramática' : 'Palavra'}
                                </span>
                                <strong style="color:var(--text-primary); font-size:0.9rem;">${this.escapeHtml(c.english)}</strong>
                                <span style="color:var(--text-secondary);">— ${this.escapeHtml(c.portuguese)}</span>
                              </div>
                              <div style="display:flex; gap:6px; align-items:center;">
                                ${
                                  c.type !== 'grammar'
                                    ? `<button class="css-icon-play-sm" data-speak-text="${this.escapeHtml(c.english)}" title="Ouvir áudio"></button>`
                                    : ''
                                }
                                <button class="btn btn-sm" data-start-day="${day.dayNumber}" data-start-card-idx="${idx}" title="Iniciar lição diretamente neste card">
                                  Testar
                                </button>
                              </div>
                            </div>
                          `
                            )
                            .join('')}
                        </div>
                      </div>
                    `
                        : ''
                    }
                  `;
                })
                .join('')}
            </div>

            <div class="block-test-action-banner">
              <div class="block-test-action-info">
                <div class="block-test-action-title">
                  Teste do Bloco ${block.blockNumber} (10 Questões • 4 Habilidades)
                </div>
                <div class="block-test-action-desc">
                  ${
                    isPassed
                      ? `Você já foi aprovado neste bloco com nota ${bestResult?.score ?? 8}/10. Você pode refazer o teste a qualquer momento.`
                      : allBlockLessonsCompleted || isTeacher
                        ? 'Todas as 10 lições foram concluídas. Faça a avaliação de 10 questões (mínimo 80% / 8 acertos) para desbloquear o próximo bloco.'
                        : `Complete todas as 10 lições deste bloco para habilitar o teste oficial de aprovação.`
                  }
                </div>
              </div>

              ${
                allBlockLessonsCompleted || isPassed || isTeacher
                  ? `<button class="btn btn-primary" data-start-block-test="${block.blockNumber}">
                      ${isPassed ? 'Refazer Teste do Bloco' : 'Iniciar Teste do Bloco'}
                    </button>`
                  : `<button class="btn btn-sm" disabled style="opacity:0.6; cursor:not-allowed;">
                      Bloqueado (Complete as 10 lições)
                    </button>`
              }
            </div>
          </div>
        `
            : ''
        }
      </article>
    `;
  }

  public startBlockTestSession(blockNumber: number): void {
    if (!this.currentUser) return;
    const questions = drawBlockTestQuestions(blockNumber);
    if (!questions || questions.length === 0) {
      this.showBanner('error', `Nenhuma questão encontrada para o Bloco ${blockNumber}.`);
      return;
    }

    const hasSpeech =
      typeof window !== 'undefined' &&
      Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

    this.blockTestSession = {
      blockNumber,
      questions,
      currentIndex: 0,
      answers: [],
      currentResponse: '',
      isAudioPlaying: false,
      isListeningSpeech: false,
      speechTranscript: '',
      hasSpeechRecognition: hasSpeech,
      evaluationResult: null,
      isSubmitted: false,
      startedAtMs: Date.now(),
    };

    this.activeTab = 'block_test';
    this.render();

    // Auto-play audio if first question is listening
    const currentQ = questions[0];
    if (currentQ.skill === 'listening_writing' || currentQ.skill === 'listening_translation') {
      setTimeout(() => {
        this.playBlockTestAudio(0.96);
      }, 350);
    }
  }

  private playBlockTestAudio(rate = 0.96): void {
    if (!this.blockTestSession) return;
    const q = this.blockTestSession.questions[this.blockTestSession.currentIndex];
    if (!q) return;
    const textToSpeak = q.audioText || q.prompt;
    audioService.speak(textToSpeak, undefined, rate);
  }

  private toggleBlockTestSpeech(): void {
    if (!this.blockTestSession) return;
    const s = this.blockTestSession;

    if (s.isListeningSpeech) {
      if (s.speechRecognitionInstance) {
        try {
          s.speechRecognitionInstance.stop();
        } catch {
          // ignore
        }
      }
      s.isListeningSpeech = false;
      this.render();
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      this.showBanner('error', 'Reconhecimento de voz indisponível no navegador. Use a autoavaliação.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = true;

      s.speechRecognitionInstance = recognition;
      s.isListeningSpeech = true;
      s.speechTranscript = '';
      this.render();

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        if (this.blockTestSession) {
          this.blockTestSession.speechTranscript = transcript;
          this.blockTestSession.currentResponse = transcript;
          const transcriptBox = document.getElementById('block-test-input') as HTMLInputElement | null;
          if (transcriptBox) transcriptBox.value = transcript;
          this.render();
        }
      };

      recognition.onerror = () => {
        if (this.blockTestSession) {
          this.blockTestSession.isListeningSpeech = false;
          this.render();
        }
      };

      recognition.onend = () => {
        if (this.blockTestSession) {
          this.blockTestSession.isListeningSpeech = false;
          this.render();
        }
      };

      recognition.start();
    } catch {
      s.isListeningSpeech = false;
      this.render();
    }
  }

  private submitBlockTestAnswer(): void {
    if (!this.blockTestSession) return;
    const s = this.blockTestSession;
    const q = s.questions[s.currentIndex];
    if (!q) return;

    const inputEl = document.getElementById('block-test-input') as HTMLInputElement | null;
    const response = inputEl ? inputEl.value : s.currentResponse;
    s.currentResponse = response;

    const evalResult = evaluateBlockTestResponse(q, response);
    s.evaluationResult = evalResult;
    s.isSubmitted = true;

    s.answers.push({
      questionId: q.id,
      userResponse: response,
      isCorrect: evalResult.isCorrect,
      skill: q.skill,
    });

    this.render();
  }

  private advanceBlockTestQuestion(): void {
    if (!this.blockTestSession || !this.currentUser) return;
    const s = this.blockTestSession;

    s.currentIndex++;
    s.currentResponse = '';
    s.evaluationResult = null;
    s.isSubmitted = false;
    s.isListeningSpeech = false;
    s.speechTranscript = '';

    if (s.currentIndex >= s.questions.length) {
      // Test finished, compute and save result
      const correctCount = s.answers.filter((a) => a.isCorrect).length;
      const totalQuestions = s.questions.length;
      const passed = correctCount >= 8;

      const result: BlockTestResult = {
        blockNumber: s.blockNumber,
        userEmail: this.currentUser.email,
        passed,
        score: correctCount,
        totalQuestions,
        attemptDateIso: new Date().toISOString(),
        answers: s.answers,
      };

      storageService.saveBlockTestResult(result);
      if (passed) {
        this.showBanner('success', `Aprovado no Bloco ${s.blockNumber}! Bloco ${s.blockNumber + 1} desbloqueado.`);
        this.expandedBlocks.add(s.blockNumber + 1);
      }
    } else {
      // Auto-play audio if next question is listening
      const nextQ = s.questions[s.currentIndex];
      if (nextQ.skill === 'listening_writing' || nextQ.skill === 'listening_translation') {
        setTimeout(() => {
          this.playBlockTestAudio(0.96);
        }, 300);
      }
    }

    this.render();
  }

  private renderBlockTestScreen(): string {
    if (!this.blockTestSession || !this.currentUser) {
      return this.renderDashboard();
    }

    const s = this.blockTestSession;
    const isCompleted = s.currentIndex >= s.questions.length;

    if (isCompleted) {
      return this.renderBlockTestCompleted();
    }

    const q = s.questions[s.currentIndex];
    const progressPercent = (s.currentIndex / s.questions.length) * 100;

    let skillLabel = 'Questão';
    let skillClass = 'writing';
    if (q.skill === 'listening_writing') {
      skillLabel = 'Listening + Writing (Áudio -> Digite em Inglês)';
      skillClass = 'writing';
    } else if (q.skill === 'listening_translation') {
      skillLabel = 'Listening + Tradução (Áudio -> Digite em Português)';
      skillClass = 'translation';
    } else if (q.skill === 'reading_speaking') {
      skillLabel = 'Reading + Speaking (Leia a Frase em Voz Alta)';
      skillClass = 'speaking';
    } else if (q.skill === 'reading_translation') {
      skillLabel = 'Reading + Tradução (Texto em Inglês -> Digite em Português)';
      skillClass = 'translation';
    }

    return `
      <section class="block-test-stage">
        <header class="block-test-header">
          <div>
            <div style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 4px;">
              Teste do Bloco ${s.blockNumber} • Questão ${s.currentIndex + 1} de ${s.questions.length}
            </div>
            <span class="skill-tag ${skillClass}">
              ${skillLabel}
            </span>
          </div>
          <button id="btn-exit-block-test" class="btn btn-sm">
            Sair do Teste
          </button>
        </header>

        <div class="block-progress-track" style="margin-bottom: 24px;">
          <div class="block-progress-fill" style="width: ${progressPercent}%;"></div>
        </div>

        <div class="block-test-prompt-instruction">
          ${this.escapeHtml(q.prompt)}
        </div>

        ${
          q.skill === 'listening_writing' || q.skill === 'listening_translation'
            ? `
            <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap; margin: 20px 0;">
              <button id="btn-block-test-audio-normal" class="btn btn-primary" style="display:inline-flex; align-items:center; gap:8px;">
                <span class="css-icon-play"></span> Ouvir Áudio (1.0x)
              </button>
              <button id="btn-block-test-audio-slow" class="btn btn-secondary" style="display:inline-flex; align-items:center; gap:8px;">
                <span class="css-icon-play-slow"></span> Ouvir Lento (0.5x)
              </button>
            </div>
          `
            : ''
        }

        ${
          q.skill === 'reading_speaking' || q.skill === 'reading_translation'
            ? `
            <div class="block-test-prompt-text">
              "${this.escapeHtml(q.audioText || q.prompt)}"
            </div>
          `
            : ''
        }

        ${
          q.skill === 'reading_speaking'
            ? `
            <div style="margin: 20px 0; display:flex; flex-direction:column; gap:12px;">
              <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
                <button
                  id="btn-block-test-mic"
                  class="mic-action-btn ${s.isListeningSpeech ? 'listening' : ''}"
                >
                  <span style="display:inline-block; width:12px; height:12px; border-radius:50%; background: ${s.isListeningSpeech ? '#ef4444' : '#6366f1'};"></span>
                  ${s.isListeningSpeech ? 'Ouvindo... Fale agora' : 'Gravar Pronúncia (Microfone)'}
                </button>

                <button id="btn-block-test-speak-fallback" class="btn btn-sm">
                  Pronunciei Corretamente (Autoavaliação)
                </button>
              </div>

              ${
                s.speechTranscript
                  ? `<div style="font-size: 0.9rem; padding: 10px 14px; background: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
                      <strong>Transcrição detectada:</strong> "${this.escapeHtml(s.speechTranscript)}"
                    </div>`
                  : ''
              }
            </div>
          `
            : ''
        }

        ${
          q.skill !== 'reading_speaking'
            ? `
            <div style="margin-top: 20px;">
              <label for="block-test-input" style="display:block; font-size:0.84rem; color:var(--text-secondary); margin-bottom: 6px;">
                ${q.skill === 'listening_writing' ? 'Digite a frase exata em inglês:' : 'Digite a tradução em português:'}
              </label>
              <input
                type="text"
                id="block-test-input"
                class="input-field"
                placeholder="${q.skill === 'listening_writing' ? 'Ex: I am happy...' : 'Ex: Eu sou...'}"
                value="${this.escapeHtml(s.currentResponse)}"
                ${s.isSubmitted ? 'readonly' : 'autofocus'}
                autocomplete="off"
                spellcheck="false"
              />
            </div>
          `
            : ''
        }

        ${
          s.isSubmitted && s.evaluationResult
            ? `
            <div class="test-feedback-box ${s.evaluationResult.isCorrect ? 'correct' : 'incorrect'}">
              <div style="font-weight: 700; margin-bottom: 4px;">
                ${s.evaluationResult.isCorrect ? 'Resposta Correta!' : 'Resposta Incorreta'}
              </div>
              <div>
                ${
                  s.evaluationResult.isCorrect
                    ? `Gabarito correspondido: <strong>"${this.escapeHtml(s.evaluationResult.matchedAnswer ?? '')}"</strong>`
                    : `Sua resposta: "${this.escapeHtml(s.currentResponse || '(vazio)')}"<br/>
                       Gabarito aceito: <strong>"${this.escapeHtml(q.acceptedAnswers[0] || q.audioText || '')}"</strong>
                       ${q.acceptedAnswers.length > 1 ? `<br/><span style="font-size:0.8rem; color:var(--text-secondary);">Outras variantes válidas: ${q.acceptedAnswers.slice(1).map((a) => `"${this.escapeHtml(a)}"`).join(', ')}</span>` : ''}`
                }
              </div>
            </div>
          `
            : ''
        }

        <div style="margin-top: 28px; display:flex; justify-content:flex-end; gap:12px;">
          ${
            !s.isSubmitted
              ? `<button id="btn-submit-block-answer" class="btn btn-primary" style="padding: 12px 24px;">
                  Confirmar Resposta
                </button>`
              : `<button id="btn-next-block-question" class="btn btn-primary" style="padding: 12px 24px;">
                  ${s.currentIndex + 1 >= s.questions.length ? 'Ver Resultado da Prova' : 'Próxima Questão'}
                </button>`
          }
        </div>
      </section>
    `;
  }

  private renderBlockTestCompleted(): string {
    if (!this.blockTestSession || !this.currentUser) return '';
    const s = this.blockTestSession;
    const correctCount = s.answers.filter((a) => a.isCorrect).length;
    const totalCount = s.questions.length;
    const scorePercent = Math.round((correctCount / totalCount) * 100);
    const passed = correctCount >= 8;

    return `
      <section class="block-test-stage test-result-summary">
        <span class="block-badge ${passed ? 'badge-passed' : 'badge-locked'}" style="font-size: 0.88rem; padding: 6px 16px;">
          ${passed ? '<span class="css-icon-check"></span> Aprovado no Bloco' : 'Reprovado — Nota Mínima: 80% (8/10)'}
        </span>

        <h2 style="font-size: 1.5rem; font-weight: 800; margin-top: 14px;">
          Resultado — Teste do Bloco ${s.blockNumber}
        </h2>

        <div class="test-score-large ${passed ? 'passed' : 'failed'}">
          ${correctCount} / ${totalCount}
        </div>
        <div style="font-size: 1.05rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 20px;">
          ${scorePercent}% de aproveitamento
        </div>

        <p style="font-size: 0.92rem; color: var(--text-secondary); max-width: 520px; margin: 0 auto 24px;">
          ${
            passed
              ? `Parabéns! Você demonstrou domínio nas habilidades avaliadas e desbloqueou oficialmente o <strong>Bloco ${s.blockNumber + 1}</strong>!`
              : `Você atingiu ${correctCount} acertos de um mínimo de 8 necessários. Revise as lições do Bloco ${s.blockNumber} e tente novamente.`
          }
        </p>

        <!-- Detalhamento questão por questão -->
        <div style="text-align: left; margin: 24px 0; background: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 16px;">
          <h4 style="font-size: 0.92rem; font-weight: 700; margin-bottom: 12px;">Desempenho por Questão:</h4>
          ${s.answers
            .map((ans, idx) => {
              const q = s.questions.find((quest) => quest.id === ans.questionId);
              return `
              <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; padding: 8px 0; border-bottom: 1px dashed var(--border-color); font-size: 0.85rem;">
                <div>
                  <span style="font-weight: 600;">#${idx + 1} [${ans.skill}]</span>:
                  <span>${this.escapeHtml(q?.audioText || q?.prompt || '')}</span>
                  <div style="font-size: 0.78rem; color: var(--text-secondary);">
                    Sua resposta: "${this.escapeHtml(ans.userResponse || '(vazio)')}"
                  </div>
                </div>
                <span class="block-badge ${ans.isCorrect ? 'badge-passed' : 'badge-locked'}" style="font-size: 0.72rem;">
                  ${ans.isCorrect ? 'Correto' : 'Incorreto'}
                </span>
              </div>
            `;
            })
            .join('')}
        </div>

        <div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap; margin-top: 24px;">
          <button id="btn-exit-block-test" class="btn">
            Voltar ao Dashboard
          </button>
          <button id="btn-retry-block-test" class="btn btn-secondary">
            Tentar Novamente (Novo Sorteio)
          </button>
          ${
            passed && s.blockNumber < 15
              ? `<button id="btn-next-unlocked-block" class="btn btn-primary">
                  Avançar para o Bloco ${s.blockNumber + 1}
                </button>`
              : ''
          }
        </div>
      </section>
    `;
  }

  private renderLessonCompleteTransition(): string {
    const summary = this.lastCompletedSummary;
    if (!summary) {
      return this.renderDashboard();
    }

    const currentLesson = summary.lessonNumber
      ? storageService.getStudyDays().find((d) => d.dayNumber === summary.lessonNumber)
      : null;
    const grammarCard = currentLesson?.cards.find((c) => c.type === 'grammar');

    return `
      <div class="transition-card">
        <div class="css-icon-award"></div>
        <span class="tag-minimal">${this.escapeHtml(summary.lessonTitle)} concluída</span>

        <h2 style="font-size: 1.5rem; font-weight: 800; margin: 12px 0 8px;">
          ${this.escapeHtml(summary.incentiveHeadline)}
        </h2>
        <p style="font-size: 0.92rem; color: var(--text-secondary); max-width: 480px; margin: 0 auto;">
          ${this.escapeHtml(summary.incentiveMessage)}
        </p>

        <div class="transition-stats-grid">
          <div class="transition-stat-box">
            <span class="transition-stat-val">${this.escapeHtml(this.formatDuration(summary.durationSeconds))}</span>
            <span class="transition-stat-label">Tempo da lição</span>
          </div>
          <div class="transition-stat-box">
            <span class="transition-stat-val">${summary.accuracyPercent}%</span>
            <span class="transition-stat-label">Precisão / Acertos</span>
          </div>
          <div class="transition-stat-box">
            <span class="transition-stat-val">+${summary.newWordsLearned}</span>
            <span class="transition-stat-label">Palavras novas</span>
          </div>
        </div>

        ${
          grammarCard
            ? `
            <div class="grammar-summary-card">
              <h4>${this.escapeHtml(grammarCard.grammarRule?.title || grammarCard.english || 'Dica de Gramática')}</h4>
              <p style="white-space: pre-line;">${this.escapeHtml(grammarCard.grammarRule?.explanation || grammarCard.portuguese)}</p>
              ${
                grammarCard.grammarRule?.examples && grammarCard.grammarRule.examples.length > 0
                  ? `
                  <ul style="margin: 10px 0 0 16px; padding: 0; font-size: 0.88rem; color: var(--text-secondary);">
                    ${grammarCard.grammarRule.examples
                      .map(
                        (ex) =>
                          `<li><strong>${this.escapeHtml(ex.english)}</strong>${
                            ex.portuguese ? ` — ${this.escapeHtml(ex.portuguese)}` : ''
                          }</li>`
                      )
                      .join('')}
                  </ul>
                `
                  : ''
              }
            </div>
          `
            : ''
        }

        ${
          summary.canContinueNextLesson && summary.nextLesson
            ? `
            <div style="margin-top: 24px;">
              <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 10px;">
                Próxima etapa pronta: <strong>${this.escapeHtml(summary.nextLesson.title)}</strong>
              </div>
              <div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">
                <button id="btn-continue-learning-next" class="btn-study-cta">
                  Continuar aprendendo ↵
                </button>
                <button id="btn-back-to-dashboard" class="btn">
                  Voltar ao painel
                </button>
              </div>
            </div>
          `
            : `
            <div style="margin-top: 24px;">
              ${
                summary.blockReason
                  ? `<div style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 14px;">
                      ${this.escapeHtml(summary.blockReason)}
                    </div>`
                  : ''
              }
              <button id="btn-back-to-dashboard" class="btn btn-primary">
                Voltar ao painel
              </button>
            </div>
          `
        }
      </div>
    `;
  }

  private renderCefrPlanTab(): string {
    const activePlan =
      CEFR_CURRICULUM_PLAN_A1_TO_C2.find((p) => p.level === this.selectedCefrTab) ??
      CEFR_CURRICULUM_PLAN_A1_TO_C2[0];

    return `
      <div class="panel-card">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom: 14px;">
          <div>
            <h2 style="font-size: 1.15rem; font-weight: 700;">
              Planejamento Completo de Gramática e Vocabulário (A1 ao C2 — 10.000 Palavras)
            </h2>
            <p style="font-size: 0.84rem; color: var(--text-secondary);">
              Cada Dia de Estudo equivale a 10 palavras novas aprendidas (incluindo verbos frasais e expressões compostas).
            </p>
          </div>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            ${CEFR_CURRICULUM_PLAN_A1_TO_C2.map(
              (p) => `
              <button
                class="btn btn-sm ${p.level === activePlan.level ? 'btn-primary' : ''}"
                data-select-cefr="${p.level}"
              >
                ${p.level} (${p.cumulativeWords} pal.)
              </button>
            `
            ).join('')}
          </div>
        </div>

        <div style="background: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 18px; margin-bottom: 16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom: 6px;">
            <h3 style="font-size: 1.05rem; font-weight: 700;">${this.escapeHtml(activePlan.title)}</h3>
            <span class="tag-minimal">${this.escapeHtml(activePlan.subtitle)}</span>
          </div>
          <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 12px;">
            ${this.escapeHtml(activePlan.description)}
          </p>

          <div style="font-size: 0.84rem; font-weight: 600; margin-bottom: 6px;">
            Ao terminar o nível ${activePlan.level}, o aluno deve conseguir:
          </div>
          <ul style="padding-left: 18px; font-size: 0.84rem; color: var(--text-secondary); display:grid; gap:3px;">
            ${activePlan.expectedOutcomes
              .map((out) => `<li>${this.escapeHtml(out)}</li>`)
              .join('')}
          </ul>
        </div>

        <h3 style="font-size: 0.96rem; font-weight: 700; margin-bottom: 8px;">
          Conteúdos Gramaticais do Nível ${activePlan.level} (${activePlan.grammarContents.length} tópicos)
        </h3>
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 34%;">Conteúdo</th>
              <th>O que aprender / dominar</th>
            </tr>
          </thead>
          <tbody>
            ${activePlan.grammarContents
              .map(
                (item) => `
              <tr>
                <td><strong>${this.escapeHtml(item.topic)}</strong></td>
                <td style="color: var(--text-secondary);">${this.escapeHtml(item.whatToLearn)}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  private renderAnkiTwoLineDiff(diff: AnkiStyleDiffResult): string {
    if (!diff.isSubmitted) return '';

    const userRowHtml = diff.userSegments
      .map(
        (seg) =>
          `<span class="ztf-token ${seg.status}">${this.escapeHtml(seg.text)}</span>`
      )
      .join('');

    const targetRowHtml = diff.targetSegments
      .map(
        (seg) =>
          `<span class="ztf-token ${seg.status}">${this.escapeHtml(seg.text)}</span>`
      )
      .join('');

    if (diff.accuracyPercent === 100) {
      return `
        <div class="ztf-diff-card">
          <div class="ztf-diff-row">
            <span class="ztf-diff-label">Sua escrita</span>
            <div class="ztf-diff-tokens">${userRowHtml}</div>
          </div>
        </div>
      `;
    }

    return `
      <div class="ztf-diff-card">
        <div class="ztf-diff-row">
          <span class="ztf-diff-label">Sua escrita</span>
          <div class="ztf-diff-tokens">${userRowHtml}</div>
        </div>
        <div class="ztf-diff-row">
          <span class="ztf-diff-label">Referência</span>
          <div class="ztf-diff-tokens">${targetRowHtml}</div>
        </div>
      </div>
    `;
  }

  private renderStudyPlayer(): string {
    if (!this.session || !this.currentUser) {
      return `<div class="panel-card"><p>Nenhuma sessão ativa.</p></div>`;
    }

    const card = this.session.queue[this.session.currentIndex];
    if (!card) {
      return `<div class="panel-card"><p>Sessão concluída.</p></div>`;
    }

    const srsMap = storageService.getUserSrsMap(this.currentUser.email);
    const cardProgress =
      srsMap[card.id] ?? createInitialSrsProgress(card.id, this.currentUser.email);
    const intervalLabels = getButtonIntervalLabels(cardProgress);

    const ptEval = evaluateLetterCorrespondence(
      this.session.userTypedPortuguese,
      card.portuguese
    );
    const wordMapping = buildWordByWordCorrespondence(
      card.english,
      card.portuguese,
      card.auxiliaryWord
    );

    const isWordCard = card.type === 'word';
    const hasGrammarContent = wordMapping.length > 1 || Boolean(card.grammarRule);
    const suggested = this.session.suggestedRating;
    const isTeacher = this.currentUser.role === 'teacher';

    return `
      <div class="player-container">
        <div class="player-topbar">
          <span>${this.escapeHtml(this.session.title)} • ${this.session.currentIndex + 1} / ${this.session.queue.length}</span>
          <button id="btn-exit-session" class="btn btn-sm">Voltar</button>
        </div>

        ${
          isTeacher
            ? `
          <div class="teacher-player-toolbar" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; background:var(--bg-elevated); border:1px solid var(--border-color); border-radius:10px; padding:8px 12px; margin-bottom:12px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="tag-minimal" style="background:var(--accent-primary); color:#fff; font-weight:700;">Modo Professor</span>
              <span style="font-size:0.84rem; font-weight:600;">Navegação Rápida do Roteiro</span>
            </div>
            <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
              <button class="btn btn-sm" data-teacher-nav="prev" ${this.session.currentIndex === 0 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''} title="Card anterior sem precisar de Enter">
                Card Anterior
              </button>
              <button class="btn btn-sm" data-teacher-nav="reveal" title="Revelar tradução do card atual">
                Revelar Tradução
              </button>
              <button class="btn btn-sm" data-teacher-nav="next" ${this.session.currentIndex + 1 >= this.session.queue.length ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''} title="Próximo card sem precisar de Enter">
                Próximo Card
              </button>
              <button id="btn-toggle-teacher-script" class="btn btn-sm btn-primary">
                ${this.teacherInSessionScriptOpen ? 'Ocultar Roteiro' : `Ver Todas as Frases (${this.session.queue.length})`}
              </button>
            </div>
          </div>
        `
            : ''
        }

        <div class="anki-card-stage">
          <div class="anki-prompt-row">
            ${
              this.session.phase >= 2
                ? `<div class="anki-prompt-en">${this.escapeHtml(card.english)}</div>`
                : `<div class="css-mystery-badge" title="Ouça o áudio"></div>`
            }
            <div class="audio-controls-group">
              <button id="btn-replay-audio" class="css-icon-play" title="Ouvir (velocidade normal)"></button>
              <button id="btn-replay-audio-slow" class="css-icon-play-slow" title="Ouvir mais devagar (0.5x)">
                <span class="css-slow-wave-icon"></span>
                <span>0.5x</span>
              </button>
            </div>
          </div>

          <hr class="anki-divider" />

          ${
            this.session.phase === 1
              ? `
              <div>
                <button id="btn-go-phase-2" class="btn btn-primary" style="width: 100%;">
                  ${isWordCard ? 'Ver palavra ↵' : 'Ver frase ↵'}
                </button>
              </div>
            `
              : ''
          }

          ${
            this.session.phase === 2
              ? `
              <input
                id="phase2-pt-input"
                type="text"
                class="input-field"
                placeholder="Tradução (opcional)"
                value="${this.escapeHtml(this.session.userTypedPortuguese)}"
                autocomplete="off"
              />
              <div style="margin-top: 16px;">
                <button id="btn-go-phase-3" class="btn btn-primary" style="width: 100%;">
                  Mostrar resposta ↵
                </button>
              </div>
            `
              : ''
          }

          ${
            this.session.phase === 3
              ? `
              <div class="anki-answer-pt">${this.escapeHtml(card.portuguese)}</div>

              ${ptEval.isSubmitted ? this.renderAnkiTwoLineDiff(ptEval) : ''}

              <div style="display:flex; justify-content:center; align-items:center; gap:10px; flex-wrap:wrap; margin-top: 12px;">
                ${
                  hasGrammarContent
                    ? `
                    <button id="btn-toggle-grammar" class="btn-grammar-toggle" style="margin-top:0;">
                      <span>Ver gramática</span>
                      <span class="css-chevron ${this.session.isGrammarExpanded ? 'up' : ''}"></span>
                    </button>
                  `
                    : ''
                }

                <button id="btn-toggle-report-flag" class="btn-flag-report" title="Reportar problema ou sugerir que sua tradução seja aceita">
                  <span class="css-icon-flag"></span>
                  <span>Sugerir / Reportar</span>
                </button>
              </div>

              ${
                this.session.isReportFormOpen
                  ? `
                  <div class="report-box">
                    <div style="font-size: 0.82rem; font-weight: 700; margin-bottom: 8px;">
                      Reportar tradução ou sugerir resposta correta
                    </div>
                    <input
                      id="report-suggestion-input"
                      type="text"
                      class="input-field"
                      placeholder="Tradução sugerida"
                      value="${this.escapeHtml(this.session.userTypedPortuguese)}"
                      style="margin-bottom: 8px; font-size: 0.88rem; padding: 8px 12px;"
                    />
                    <input
                      id="report-reason-input"
                      type="text"
                      class="input-field"
                      placeholder="Por que essa tradução deveria ser aceita ou qual o problema?"
                      value="${this.escapeHtml(this.session.reportReasonDraft)}"
                      style="margin-bottom: 10px; font-size: 0.88rem; padding: 8px 12px;"
                    />
                    <div style="display:flex; gap:8px; justify-content:flex-end;">
                      <button id="btn-cancel-report" class="btn btn-sm">Cancelar</button>
                      <button id="btn-submit-report" class="btn btn-primary btn-sm">Enviar ao Professor</button>
                    </div>
                  </div>
                `
                  : ''
              }

              ${
                hasGrammarContent && this.session.isGrammarExpanded
                  ? `
                  ${
                    wordMapping.length > 1
                      ? `
                      <div class="word-breakdown-list">
                        ${wordMapping
                          .map(
                            (wm) => `
                            <div class="word-breakdown-item">
                              <span class="wb-en">${this.escapeHtml(wm.englishWord)}</span>
                              <span class="wb-pt">${this.escapeHtml(wm.portugueseEquivalent)}</span>
                              ${wm.grammarClass ? `<span class="wb-class">(${this.escapeHtml(wm.grammarClass)})</span>` : ''}
                            </div>
                          `
                          )
                          .join('')}
                      </div>
                    `
                      : ''
                  }

                  ${
                    card.grammarRule
                      ? `
                      <div style="text-align: left; background: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: 10px; padding: 14px; margin-top: 14px; font-size: 0.88rem;">
                        <div style="font-weight: 700; margin-bottom: 6px;">${this.escapeHtml(card.grammarRule.title)}</div>
                        <p style="color: var(--text-secondary); margin-bottom: 10px;">${this.escapeHtml(card.grammarRule.explanation)}</p>
                        ${card.grammarRule.examples
                          .map(
                            (ex) => `
                            <div style="margin-top: 4px;">
                              <strong>${this.escapeHtml(ex.english)}</strong> — <span style="color: var(--text-secondary);">${this.escapeHtml(ex.portuguese)}</span>
                              ${ex.note ? `<div style="font-size: 0.78rem; color: var(--text-muted);">${this.escapeHtml(ex.note)}</div>` : ''}
                            </div>
                          `
                          )
                          .join('')}
                      </div>
                    `
                      : ''
                  }
                `
                  : ''
              }

              <hr class="anki-divider" />

              <!-- 3 Botões SRS Autorais ZeroToFluency (Errei, Ok, Aprendido) com sugestão no Enter ↵ -->
              <div class="ztf-rating-grid">
                <button class="ztf-rate-btn again ${suggested === 'again' ? 'suggested' : ''}" data-srs-rate="again">
                  <span class="ztf-rate-title">Errei${suggested === 'again' ? ' ↵' : ''}</span>
                  <span class="ztf-rate-badge">${this.escapeHtml(intervalLabels.againLabel)}</span>
                </button>
                <button class="ztf-rate-btn hard ${suggested === 'hard' ? 'suggested' : ''}" data-srs-rate="hard">
                  <span class="ztf-rate-title">Ok${suggested === 'hard' ? ' ↵' : ''}</span>
                  <span class="ztf-rate-badge">${this.escapeHtml(intervalLabels.hardLabel)}</span>
                </button>
                <button class="ztf-rate-btn good ${suggested === 'good' ? 'suggested' : ''}" data-srs-rate="good">
                  <span class="ztf-rate-title">Aprendido${suggested === 'good' ? ' ↵' : ''}</span>
                  <span class="ztf-rate-badge">${this.escapeHtml(intervalLabels.goodLabel)}</span>
                </button>
              </div>
            `
              : ''
          }
        </div>

        ${
          isTeacher && this.teacherInSessionScriptOpen
            ? `
          <div class="teacher-session-script-drawer" style="margin-top:16px; background:var(--bg-surface); border:1px solid var(--border-color); border-radius:12px; padding:14px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; padding-bottom:8px; border-bottom:1px solid var(--border-color);">
              <div>
                <strong style="font-size:0.95rem;">Roteiro Completo da Lição: Todas as Frases & Cards</strong>
                <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:2px;">
                  Visualize todas as frases do roteiro de uma só vez, sem precisar dar Enter de card em card.
                </div>
              </div>
              <span class="tag-minimal">${this.session.queue.length} cards no roteiro</span>
            </div>

            <div style="display:flex; flex-direction:column; gap:8px; max-height:360px; overflow-y:auto; padding-right:4px;">
              ${this.session.queue
                .map((c, idx) => {
                  const isCurrent = idx === this.session!.currentIndex;
                  return `
                  <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; padding:8px 12px; border-radius:8px; font-size:0.86rem; border:1px solid ${
                    isCurrent ? 'var(--accent-primary)' : 'var(--border-color)'
                  }; background:${isCurrent ? 'rgba(99,102,241,0.08)' : 'var(--bg-elevated)'};">
                    <div style="display:flex; align-items:center; gap:10px; flex:1;">
                      <span style="font-weight:700; color:${isCurrent ? 'var(--accent-primary)' : 'var(--text-muted)'}; min-width:22px;">${idx + 1}.</span>
                      <span class="tag-minimal" style="${
                        c.type === 'phrase'
                          ? 'background:rgba(16,185,129,0.15); color:#10b981; font-weight:700;'
                          : c.type === 'grammar'
                          ? 'background:rgba(168,85,247,0.15); color:#a855f7; font-weight:700;'
                          : 'background:rgba(59,130,246,0.15); color:#3b82f6; font-weight:700;'
                      }">
                        ${c.type === 'phrase' ? 'Frase' : c.type === 'grammar' ? 'Gramática' : 'Palavra'}
                      </span>
                      <div>
                        <strong style="color:var(--text-primary); font-size:0.92rem;">${this.escapeHtml(c.english)}</strong>
                        <div style="color:var(--text-secondary); font-size:0.82rem; margin-top:2px;">${this.escapeHtml(c.portuguese)}</div>
                      </div>
                    </div>
                    <div style="display:flex; gap:6px; align-items:center;">
                      ${
                        c.type !== 'grammar'
                          ? `<button class="css-icon-play-sm" data-speak-text="${this.escapeHtml(c.english)}" title="Ouvir áudio"></button>`
                          : ''
                      }
                      <button class="btn btn-sm ${isCurrent ? 'btn-primary' : ''}" data-teacher-jump-card="${idx}">
                        ${isCurrent ? 'Card Ativo' : 'Pular para este'}
                      </button>
                    </div>
                  </div>
                `;
                })
                .join('')}
            </div>
          </div>
        `
            : ''
        }
      </div>
    `;
  }

  private renderCalendarTab(): string {
    if (!this.currentUser) return '';
    const todayIso = getTodayDateIso();
    const scheduledCounts = storageService.getScheduledCountsByDate(this.currentUser.email);
    const activities = storageService.getUserCalendarActivities(this.currentUser.email);
    const completedLessons = storageService.getCompletedDayNumbers(this.currentUser.email);
    const metrics = storageService.getStudyDaysMetrics(this.currentUser.email);

    const next14Days = Array.from({ length: 14 }, (_, idx) => {
      const dateIso = addDaysToIsoDate(todayIso, idx);
      const count = scheduledCounts[dateIso] ?? 0;
      const activity = activities[dateIso];
      return { dateIso, idx, count, activity };
    });

    return `
      <div class="panel-card">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom: 12px;">
          <h2 style="font-size: 1.1rem; font-weight: 700;">Calendário de Revisões</h2>
          <span class="tag-minimal">${metrics.totalStudyDaysEquivalent} dias estudados (${metrics.knownWordsTotal} palavras) • ${completedLessons.length} lições</span>
        </div>

        <div class="calendar-forecast-grid">
          ${next14Days
            .map(
              (d) => `
              <div class="calendar-day-box ${d.idx === 0 ? 'today' : ''}">
                <div style="font-size: 0.75rem; color: var(--text-secondary);">
                  ${d.idx === 0 ? 'Hoje' : d.dateIso.slice(5)}
                </div>
                <div style="font-size: 1.25rem; font-weight: 700; margin: 4px 0;">
                  ${d.count} <span style="font-size: 0.76rem; font-weight: 400; color: var(--text-secondary);">rev</span>
                </div>
                ${
                  d.activity && d.activity.lessonsCompleted.length > 0
                    ? `<div style="font-size: 0.72rem; color: var(--match-ok-text);">
                        Lição ${d.activity.lessonsCompleted.join(', ')}
                      </div>`
                    : ''
                }
              </div>
            `
            )
            .join('')}
        </div>
      </div>
    `;
  }

  private renderStudentCustomCardsTab(): string {
    if (!this.currentUser) return '';
    const customCards = storageService.getCustomStudentCards(this.currentUser.email);
    const knownWordsCount = storageService.getKnownWordsCount(this.currentUser.email);

    return `
      <div class="panel-card">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom: 14px;">
          <div>
            <h2 style="font-size: 1.1rem; font-weight: 700;">Meus Flashcards</h2>
            <p style="font-size: 0.82rem; color: var(--text-secondary);">
              Palavras já conhecidas no seu vocabulário: <strong>${knownWordsCount}</strong>. Se você cadastrar uma palavra que já faz parte do curso, ela será marcada como aprendida e pulada quando a lição dela chegar.
            </p>
          </div>
          ${
            customCards.length > 0
              ? `<button id="btn-practice-custom-cards" class="btn btn-primary btn-sm">
                  Estudar (${customCards.length})
                </button>`
              : ''
          }
        </div>

        <div class="form-grid">
          <select id="custom-card-type" class="input-field">
            <option value="word">Palavra</option>
            <option value="phrase">Frase</option>
          </select>
          <input id="custom-card-en" type="text" class="input-field" placeholder="Inglês" />
          <input id="custom-card-pt" type="text" class="input-field" placeholder="Português" />
          <input id="custom-card-aux" type="text" class="input-field" placeholder="Nota auxiliar (opcional)" />
        </div>
        <button id="btn-add-custom-card" class="btn btn-primary" style="margin-top: 12px;">
          Adicionar
        </button>

        ${
          customCards.length > 0
            ? `
            <table class="data-table">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Inglês</th>
                  <th>Português</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                ${customCards
                  .map(
                    (c) => `
                  <tr>
                    <td><span class="tag-minimal">${c.type === 'word' ? 'Palavra' : 'Frase'}</span></td>
                    <td><strong>${this.escapeHtml(c.english)}</strong></td>
                    <td>${this.escapeHtml(c.portuguese)}</td>
                    <td>
                      <button class="css-icon-play-sm" data-speak-text="${this.escapeHtml(c.english)}" title="Ouvir"></button>
                    </td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          `
            : ''
        }
      </div>
    `;
  }

  private renderCatalogTab(): string {
    const words = getCatalogWords();
    const phrases = getCatalogPhrases();
    const q = this.catalogSearchQuery.trim().toLowerCase();

    const filteredWords = q
      ? words.filter(
          (w) =>
            w.english.toLowerCase().includes(q) ||
            w.portuguese.toLowerCase().includes(q)
        )
      : words.slice(0, 80);

    const filteredPhrases = q
      ? phrases.filter(
          (p) =>
            p.english.toLowerCase().includes(q) ||
            p.portuguese.toLowerCase().includes(q)
        )
      : phrases.slice(0, 80);

    return `
      <div class="panel-card">
        <input
          id="catalog-search-input"
          type="text"
          class="input-field"
          placeholder="Buscar palavra ou frase..."
          value="${this.escapeHtml(this.catalogSearchQuery)}"
        />

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 18px;">
          <div>
            <h3 style="font-size: 0.92rem; color: var(--text-secondary); margin-bottom: 8px;">
              Palavras (${words.length})
            </h3>
            <div style="max-height: 440px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: 8px;">
              <table class="data-table" style="margin-top:0;">
                <tbody>
                  ${filteredWords
                    .map(
                      (w) => `
                      <tr>
                        <td style="color:var(--text-muted); width:36px;">${w.rank}</td>
                        <td><strong>${this.escapeHtml(w.english)}</strong></td>
                        <td style="color:var(--text-secondary);">${this.escapeHtml(w.portuguese)}</td>
                        <td style="width:36px;">
                          <button class="css-icon-play-sm" data-speak-text="${this.escapeHtml(w.english)}"></button>
                        </td>
                      </tr>
                    `
                    )
                    .join('')}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 style="font-size: 0.92rem; color: var(--text-secondary); margin-bottom: 8px;">
              Frases (${phrases.length})
            </h3>
            <div style="max-height: 440px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: 8px;">
              <table class="data-table" style="margin-top:0;">
                <tbody>
                  ${filteredPhrases
                    .map(
                      (p) => `
                      <tr>
                        <td><strong>${this.escapeHtml(p.english)}</strong></td>
                        <td style="color:var(--text-secondary);">${this.escapeHtml(p.portuguese)}</td>
                        <td style="width:36px;">
                          <button class="css-icon-play-sm" data-speak-text="${this.escapeHtml(p.english)}"></button>
                        </td>
                      </tr>
                    `
                    )
                    .join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private renderTeacherAdminTab(): string {
    if (!this.currentUser || this.currentUser.role !== 'teacher') {
      return `<div class="panel-card"><p>Acesso restrito.</p></div>`;
    }

    const authorizedUsers = storageService.getAuthorizedUsers();
    const studyDays = storageService.getStudyDays();
    const reports = storageService.getTranslationReports();
    const firebaseReady = firebaseAuthService.isConfigured();

    return `
      <!-- 0. REPORTES E SUGESTÕES DE TRADUÇÃO DOS ALUNOS (BANDEIRINHA) -->
      <div class="panel-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 10px;">
          <h2 style="font-size: 1.05rem; font-weight: 700;">
            Sugestões e Reportes de Tradução (Bandeirinha)
          </h2>
          <span class="tag-minimal">${reports.filter((r) => r.status === 'pending').length} pendente(s)</span>
        </div>

        ${
          reports.length === 0
            ? `<p style="font-size: 0.85rem; color: var(--text-secondary);">Nenhum reporte enviado pelos alunos até o momento.</p>`
            : `
            <table class="data-table">
              <thead>
                <tr>
                  <th>Lição / Inglês</th>
                  <th>Gabarito Atual</th>
                  <th>Sugestão do Aluno & Motivo</th>
                  <th>Editar / Incluir Possibilidade</th>
                </tr>
              </thead>
              <tbody>
                ${reports
                  .map(
                    (rep) => `
                  <tr>
                    <td>
                      <span class="tag-minimal">Lição ${rep.lessonNumber}</span>
                      <div style="font-weight:700; margin-top:4px;">${this.escapeHtml(rep.english)}</div>
                      <div style="font-size:0.74rem; color:var(--text-muted);">${this.escapeHtml(rep.studentName)}</div>
                    </td>
                    <td style="color:var(--text-secondary);">${this.escapeHtml(rep.currentPortuguese)}</td>
                    <td>
                      <div><strong>Digitou:</strong> ${this.escapeHtml(rep.studentTypedPortuguese || '—')}</div>
                      <div style="font-size:0.8rem; color:var(--text-secondary);">${this.escapeHtml(rep.studentReason)}</div>
                      <span class="tag-minimal" style="margin-top:4px; display:inline-block;">${rep.status}</span>
                    </td>
                    <td>
                      <input
                        id="admin-rep-pt-${this.escapeHtml(rep.id)}"
                        type="text"
                        class="input-field"
                        style="font-size:0.82rem; padding:6px 10px; margin-bottom:6px;"
                        value="${this.escapeHtml(rep.studentTypedPortuguese || rep.currentPortuguese)}"
                        placeholder="Nova possibilidade ou novo gabarito"
                      />
                      <div style="display:flex; gap:6px; flex-wrap:wrap;">
                        <button class="btn btn-primary btn-sm" data-resolve-report="${this.escapeHtml(rep.id)}" data-resolve-action="accept_append">
                          + Incluir Possibilidade
                        </button>
                        <button class="btn btn-sm" data-resolve-report="${this.escapeHtml(rep.id)}" data-resolve-action="replace_custom">
                          Substituir Gabarito
                        </button>
                        <button class="btn btn-danger btn-sm" data-resolve-report="${this.escapeHtml(rep.id)}" data-resolve-action="dismiss">
                          Arquivar
                        </button>
                      </div>
                    </td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          `
        }
      </div>

      <!-- 1. CONTROLE DE ALUNOS E LIMITES DE DIAS DE ESTUDO (1 DIA = 10 PALAVRAS) -->
      <div class="panel-card">
        <h2 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 6px;">
          Alunos Autorizados & Limites de Estudo (1 Dia = 10 Palavras)
        </h2>
        <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 10px;">
          Defina quantos dias de estudo por dia o aluno pode avançar (Ex: 2 dias = 20 palavras/dia para seus alunos; 1 dia = 10 palavras/dia no gratuito; 3 ou 4 dias em planos superiores) e o teto geral do plano.
        </p>

        <div class="form-grid">
          <input id="admin-user-name" type="text" class="input-field" placeholder="Nome" />
          <input id="admin-user-email" type="email" class="input-field" placeholder="E-mail Google" />
          <input id="admin-user-weeks" type="number" min="1" max="150" value="1" class="input-field" placeholder="Módulos liberados" title="Cada módulo libera 7 lições" />
          <input id="admin-user-daily-quota" type="number" min="1" max="20" value="2" class="input-field" placeholder="Dias/dia (Ex: 2 = 20 pal.)" title="Limite diário em Dias de Estudo (1 dia = 10 palavras)" />
          <input id="admin-user-max-days" type="number" min="10" max="1000" value="1000" class="input-field" placeholder="Teto Geral (Ex: 50, 100, 1000)" title="Limite geral de Dias de Estudo do plano" />
        </div>
        <button id="btn-admin-save-user" class="btn btn-primary" style="margin-top: 12px;">
          Salvar Aluno
        </button>

        <table class="data-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Progresso neste navegador</th>
              <th>Limite Diário / Geral</th>
              <th>Módulos</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${authorizedUsers
              .map((u) => {
                const m = storageService.getStudyDaysMetrics(u.email);
                return `
              <tr>
                <td><strong>${this.escapeHtml(u.name)}</strong></td>
                <td>${this.escapeHtml(u.email)}</td>
                <td><span class="tag-minimal">${m.totalStudyDaysEquivalent}d (${m.knownWordsTotal} pal.)</span></td>
                <td>
                  ${u.role === 'teacher' ? 'Livre' : `${u.dailyStudyDaysQuota ?? 2}d/dia (${(u.dailyStudyDaysQuota ?? 2) * 10} pal.) • Máx ${u.maxTotalStudyDaysLimit ?? 1000}d`}
                </td>
                <td>
                  ${u.role === 'teacher' ? 'Total' : `${u.unlockedWeeks} mód. (${u.unlockedWeeks * 7} lições)`}
                </td>
                <td style="display:flex; gap:6px; justify-content:flex-end;">
                  ${
                    u.role === 'student'
                      ? `<button class="btn btn-sm" data-toggle-user-active="${this.escapeHtml(u.email)}">
                          ${u.active ? 'Pausar' : 'Ativar'}
                        </button>
                        <button class="btn btn-sm" data-unlock-next-week="${this.escapeHtml(u.email)}">
                          +7 lições
                        </button>`
                      : ''
                  }
                  ${u.role === 'student' ? `<button class="btn btn-danger btn-sm" data-remove-user="${this.escapeHtml(u.email)}">
                    Remover
                  </button>` : ''}
                </td>
              </tr>
            `;
              })
              .join('')}
          </tbody>
        </table>
      </div>

      <!-- 2. MAPA DE MÓDULOS INICIAIS E PONTOS DE DIÁLOGOS/HISTÓRIAS -->
      <div class="panel-card">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom: 6px;">
          <h2 style="font-size: 1.05rem; font-weight: 700;">
            Roteiro de Módulos & Pontos de Diálogos/Histórias
          </h2>
          <span class="tag-minimal">${studyDays.length} lições ativas</span>
        </div>
        <div class="roadmap-grid">
          ${GRAMMAR_ROADMAP_100_DAYS.map(
            (m) => `
            <div class="roadmap-card">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span class="tag-minimal">${this.escapeHtml(m.daysRange)}</span>
                <span style="font-size:0.75rem; color:var(--text-muted);">Módulo ${m.moduleNumber}</span>
              </div>
              <div style="font-weight:700; font-size:0.92rem;">${this.escapeHtml(m.title)}</div>
              <div style="font-size:0.8rem; color:var(--text-secondary);">${this.escapeHtml(m.grammarTopics.join(' • '))}</div>
              <div style="font-size:0.78rem; color:var(--accent-primary); margin-top:2px;">
                ${this.escapeHtml(m.dialogueAndStoryCheckpoints.join(' | '))}
              </div>
            </div>
          `
          ).join('')}
        </div>
      </div>

      <!-- 3. INSERÇÃO ELÁSTICA DE DIÁLOGO / HISTÓRIA COM LIÇÃO PREPARATÓRIA (i+1) -->
      <div class="panel-card">
        <h2 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 6px;">
          Inserir Diálogo ou Fábula (Empurra Lições Seguintes Automaticamente)
        </h2>
        <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 12px;">
          Escolha após qual lição inserir. Se você preencher palavras novas na caixa preparatória (i+1), o sistema cria uma Lição Preparatória antes do diálogo e renumera todas as lições posteriores.
        </p>

        <div class="form-grid" style="margin-bottom: 10px;">
          <input id="admin-dialogue-title" type="text" class="input-field" placeholder="Título do Diálogo ou Fábula" />
          <input id="admin-dialogue-after-day" type="number" min="0" max="${studyDays.length}" value="${studyDays.length}" class="input-field" placeholder="Inserir após a Lição..." />
        </div>

        <textarea id="admin-dialogue-prep-lines" rows="2" class="input-field" placeholder="Opcional — Cards da Lição Preparatória (i+1): Inglês — Português (um por linha)" style="margin-bottom: 10px;"></textarea>
        <textarea id="admin-dialogue-lines" rows="4" class="input-field" placeholder="Frases do Diálogo / História: Inglês — Português (uma frase por linha)"></textarea>

        ${
          this.lastDialogueAnalysis
            ? `
            <div style="background:var(--bg-elevated); border:1px solid var(--border-color); border-radius:8px; padding:10px 14px; margin-top:10px; font-size:0.84rem;">
              <div><strong>Lição ideal sugerida pelo vocabulário:</strong> Após a Lição ${this.lastDialogueAnalysis.suggestedAfterDay}</div>
              <div><strong>Palavras já ensinadas:</strong> ${this.lastDialogueAnalysis.knownWords.length > 0 ? this.escapeHtml(this.lastDialogueAnalysis.knownWords.join(', ')) : 'nenhuma'}</div>
              <div><strong>Palavras novas detectadas (para Lição Preparatória i+1):</strong> ${this.lastDialogueAnalysis.unknownWords.length > 0 ? this.escapeHtml(this.lastDialogueAnalysis.unknownWords.join(', ')) : 'nenhuma (100% conhecido)'}</div>
            </div>
          `
            : ''
        }

        <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top: 12px;">
          <button id="btn-admin-analyze-dialogue" class="btn">
            Analisar Pré-requisitos
          </button>
          <button id="btn-admin-create-dialogue" class="btn btn-primary">
            Inserir no Cronograma
          </button>
        </div>
      </div>

      <!-- 4. NOVO FLASHCARD INDIVIDUAL -->
      <div class="panel-card">
        <h2 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 10px;">
          Adicionar Flashcard a uma Lição
        </h2>

        <div class="form-grid">
          <input id="admin-card-day" type="number" min="1" value="${studyDays.length + 1}" class="input-field" placeholder="Lição" />
          <select id="admin-card-type" class="input-field">
            <option value="word">Palavra</option>
            <option value="phrase">Frase</option>
            <option value="grammar">Gramática (Último card)</option>
            <option value="dialogue">Diálogo</option>
          </select>
          <input id="admin-card-en" type="text" class="input-field" placeholder="Inglês" />
          <input id="admin-card-pt" type="text" class="input-field" placeholder="Português (separe possibilidades por /)" />
          <input id="admin-card-aux-en" type="text" class="input-field" placeholder="Auxiliar (EN)" />
          <input id="admin-card-aux-pt" type="text" class="input-field" placeholder="Auxiliar (PT)" />
        </div>
        <textarea id="admin-card-grammar-exp" rows="2" class="input-field" placeholder="Explicação gramatical (opcional)" style="margin-top: 10px;"></textarea>
        <button id="btn-admin-add-card" class="btn btn-primary" style="margin-top: 12px;">
          Adicionar à Lição
        </button>
      </div>

      <!-- 5. CSV -->
      <div class="panel-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 10px;">
          <h2 style="font-size: 1.05rem; font-weight: 700;">Importar CSV</h2>
          <button id="btn-load-sample-csv" class="btn btn-sm">Exemplo CSV</button>
        </div>

        <input id="csv-file-input" type="file" accept=".csv,text/csv" style="color:var(--text-secondary); margin-bottom: 10px;" />
        <textarea id="csv-textarea" rows="4" class="input-field" placeholder="dayNumber,type,english,portuguese..."></textarea>
        <button id="btn-import-csv" class="btn btn-primary" style="margin-top: 12px;">
          Importar
        </button>
      </div>

      <!-- 6. STATUS DO LOGIN GOOGLE -->
      <div class="panel-card">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <h2 style="font-size: 1.05rem; font-weight: 700;">
            Login Google & Lista Online (Firebase)
          </h2>
          <span class="tag-minimal">
            ${firebaseReady ? 'Configurado' : 'Aguardando variáveis VITE_FIREBASE_*'}
          </span>
        </div>
        <p style="font-size: 0.84rem; color: var(--text-secondary); margin-top: 8px;">
          ${
            firebaseReady
              ? 'Os alunos adicionados, pausados ou removidos acima são sincronizados automaticamente com o Firestore.'
              : 'Configure as variáveis de ambiente VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID e VITE_FIREBASE_APP_ID na Vercel ou no arquivo .env.'
          }
        </p>
      </div>
    `;
  }

  private bindLoginEvents(): void {
    const loginBtn = document.getElementById('btn-google-login');

    loginBtn?.addEventListener('click', async () => {
      if (this.isSigningIn) return;
      this.isSigningIn = true;
      this.authError = null;
      this.render();

      const res = await firebaseAuthService.signInWithGoogle();
      this.isSigningIn = false;

      if (!res.success || !res.user) {
        this.authError = res.errorMessage ?? 'Acesso não autorizado.';
        this.render();
        return;
      }

      this.authError = null;
      this.currentUser = res.user;
      this.activeTab = 'dashboard';
      this.render();
    });
  }

  private parseLinePairs(rawText: string): Array<{ english: string; portuguese: string }> {
    return rawText
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split(/—|-/).map((p) => p.trim());
        return {
          english: parts[0] ?? line,
          portuguese: parts[1] ?? '',
        };
      })
      .filter((item) => item.english && item.portuguese);
  }

  private bindAuthenticatedEvents(): void {
    document.getElementById('nav-brand-home')?.addEventListener('click', () => {
      this.activeTab = 'dashboard';
      this.render();
    });

    document.querySelectorAll<HTMLElement>('[data-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab') as AppTab;
        if (tab) {
          this.activeTab = tab;
          this.render();
        }
      });
    });

    document.querySelectorAll<HTMLElement>('[data-select-cefr]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const level = btn.getAttribute('data-select-cefr') as CefrLevel;
        if (level) {
          this.selectedCefrTab = level;
          this.render();
        }
      });
    });

    document.getElementById('btn-toggle-theme')?.addEventListener('click', () => {
      this.toggleTheme();
    });

    document.getElementById('btn-logout')?.addEventListener('click', () => {
      void firebaseAuthService.signOut();
      this.currentUser = null;
      this.session = null;
      this.render();
    });

    document.getElementById('btn-open-reset-modal')?.addEventListener('click', () => {
      this.isResetModalOpen = true;
      this.render();
    });

    document.getElementById('btn-cancel-reset')?.addEventListener('click', () => {
      this.isResetModalOpen = false;
      this.render();
    });

    document.getElementById('btn-confirm-reset')?.addEventListener('click', () => {
      if (!this.currentUser) return;
      storageService.resetUserProgress(this.currentUser.email);
      this.isResetModalOpen = false;
      this.session = null;
      this.lastCompletedSummary = null;
      this.activeTab = 'dashboard';
      this.showBanner('success', 'Seus estudos foram resetados com sucesso! Você pode recomeçar da Lição 1.');
      this.render();
    });

    document.getElementById('reset-modal-backdrop')?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) {
        this.isResetModalOpen = false;
        this.render();
      }
    });

    document
      .getElementById('btn-main-study-now')
      ?.addEventListener('click', () => this.startNextOrResumedStudy());

    document
      .getElementById('btn-teacher-toggle-lessons')
      ?.addEventListener('click', () => {
        this.teacherShowAllLessons = !this.teacherShowAllLessons;
        this.render();
      });

    document
      .querySelectorAll<HTMLElement>('[data-toggle-lesson-cards]')
      .forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const dayNum = Number(btn.getAttribute('data-toggle-lesson-cards'));
          this.teacherExpandedLessonCards =
            this.teacherExpandedLessonCards === dayNum ? null : dayNum;
          this.render();
        });
      });

    document
      .getElementById('btn-continue-learning-next')
      ?.addEventListener('click', () => {
        if (this.lastCompletedSummary?.nextLesson) {
          this.startLessonSession(this.lastCompletedSummary.nextLesson, true);
        }
      });

    document
      .getElementById('btn-back-to-dashboard')
      ?.addEventListener('click', () => {
        this.activeTab = 'dashboard';
        this.render();
      });

    document
      .getElementById('btn-start-due-reviews')
      ?.addEventListener('click', () => this.startDueReviewsSession());

    document.querySelectorAll<HTMLElement>('[data-start-day]').forEach((cardEl) => {
      cardEl.addEventListener('click', (e) => {
        e.stopPropagation();
        const dayNum = Number(cardEl.getAttribute('data-start-day'));
        const startCardIdx = cardEl.getAttribute('data-start-card-idx');
        const day = storageService
          .getStudyDays()
          .find((d) => d.dayNumber === dayNum);
        if (day) {
          this.startLessonSession(day, true);
          if (startCardIdx !== null && this.session) {
            const idx = Number(startCardIdx);
            if (idx >= 0 && idx < this.session.queue.length) {
              this.session.currentIndex = idx;
              this.session.phase = 2;
              this.persistCurrentSessionCheckpoint();
              this.playCurrentCardAudio();
              this.render();
            }
          }
        }
      });
    });

    // Eventos de Blocos de Estudo (1 a 15) e Testes de Bloco
    document.querySelectorAll<HTMLElement>('[data-toggle-block]').forEach((el) => {
      el.addEventListener('click', () => {
        const bNum = Number(el.getAttribute('data-toggle-block'));
        if (this.expandedBlocks.has(bNum)) {
          this.expandedBlocks.delete(bNum);
        } else {
          this.expandedBlocks.add(bNum);
        }
        this.render();
      });
    });

    document.querySelectorAll<HTMLElement>('[data-start-block-test]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const bNum = Number(btn.getAttribute('data-start-block-test'));
        if (bNum) {
          this.startBlockTestSession(bNum);
        }
      });
    });

    document.getElementById('btn-exit-block-test')?.addEventListener('click', () => {
      if (this.blockTestSession?.speechRecognitionInstance) {
        try {
          this.blockTestSession.speechRecognitionInstance.stop();
        } catch {}
      }
      this.blockTestSession = null;
      this.activeTab = 'dashboard';
      this.render();
    });

    document.getElementById('btn-block-test-audio-normal')?.addEventListener('click', () => {
      this.playBlockTestAudio(0.96);
    });

    document.getElementById('btn-block-test-audio-slow')?.addEventListener('click', () => {
      this.playBlockTestAudio(0.55);
    });

    document.getElementById('btn-block-test-mic')?.addEventListener('click', () => {
      this.toggleBlockTestSpeech();
    });

    document.getElementById('btn-block-test-speak-fallback')?.addEventListener('click', () => {
      if (!this.blockTestSession) return;
      const q = this.blockTestSession.questions[this.blockTestSession.currentIndex];
      this.blockTestSession.currentResponse = q?.audioText || q?.prompt || 'Autoavaliação';
      this.submitBlockTestAnswer();
    });

    document.getElementById('btn-submit-block-answer')?.addEventListener('click', () => {
      this.submitBlockTestAnswer();
    });

    document.getElementById('btn-next-block-question')?.addEventListener('click', () => {
      this.advanceBlockTestQuestion();
    });

    document.getElementById('btn-retry-block-test')?.addEventListener('click', () => {
      if (this.blockTestSession) {
        this.startBlockTestSession(this.blockTestSession.blockNumber);
      }
    });

    document.getElementById('btn-next-unlocked-block')?.addEventListener('click', () => {
      if (this.blockTestSession) {
        const nextB = this.blockTestSession.blockNumber + 1;
        this.blockTestSession = null;
        this.activeTab = 'dashboard';
        this.expandedBlocks.add(nextB);
        this.render();
      }
    });

    const blockTestInput = document.getElementById('block-test-input') as HTMLInputElement | null;
    blockTestInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (!this.blockTestSession?.isSubmitted) {
          this.submitBlockTestAnswer();
        } else {
          this.advanceBlockTestQuestion();
        }
      }
    });

    document.getElementById('btn-exit-session')?.addEventListener('click', () => {
      this.persistCurrentSessionCheckpoint();
      this.session = null;
      this.activeTab = 'dashboard';
      this.render();
    });

    document.getElementById('btn-replay-audio')?.addEventListener('click', () => {
      this.playCurrentCardAudio(0.96);
    });

    document.getElementById('btn-replay-audio-slow')?.addEventListener('click', () => {
      this.playCurrentCardAudio(0.55);
    });

    document.getElementById('btn-go-phase-2')?.addEventListener('click', () => {
      this.advanceToPhase(2);
    });

    document.getElementById('btn-go-phase-3')?.addEventListener('click', () => {
      this.advanceToPhase(3);
    });

    document.getElementById('btn-toggle-teacher-script')?.addEventListener('click', () => {
      this.teacherInSessionScriptOpen = !this.teacherInSessionScriptOpen;
      this.render();
    });

    document.querySelectorAll<HTMLElement>('[data-teacher-jump-card]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!this.session) return;
        const targetIdx = Number(btn.getAttribute('data-teacher-jump-card'));
        if (targetIdx >= 0 && targetIdx < this.session.queue.length) {
          this.session.currentIndex = targetIdx;
          this.session.phase = 2;
          this.persistCurrentSessionCheckpoint();
          this.render();
          this.playCurrentCardAudio();
        }
      });
    });

    document.querySelectorAll<HTMLElement>('[data-teacher-nav]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!this.session) return;
        const action = btn.getAttribute('data-teacher-nav');
        if (action === 'prev') {
          if (this.session.currentIndex > 0) {
            this.session.currentIndex--;
            this.session.phase = 2;
            this.persistCurrentSessionCheckpoint();
            this.render();
            this.playCurrentCardAudio();
          }
        } else if (action === 'next') {
          if (this.session.currentIndex + 1 < this.session.queue.length) {
            this.session.currentIndex++;
            this.session.phase = 2;
            this.persistCurrentSessionCheckpoint();
            this.render();
            this.playCurrentCardAudio();
          }
        } else if (action === 'reveal') {
          this.session.phase = 3;
          this.render();
        }
      });
    });

    document.getElementById('btn-toggle-grammar')?.addEventListener('click', () => {
      if (!this.session) return;
      this.session.isGrammarExpanded = !this.session.isGrammarExpanded;
      this.render();
    });

    document.getElementById('btn-toggle-report-flag')?.addEventListener('click', () => {
      if (!this.session) return;
      this.session.isReportFormOpen = !this.session.isReportFormOpen;
      this.render();
    });

    document.getElementById('btn-cancel-report')?.addEventListener('click', () => {
      if (!this.session) return;
      this.session.isReportFormOpen = false;
      this.render();
    });

    document.getElementById('btn-submit-report')?.addEventListener('click', () => {
      if (!this.session || !this.currentUser) return;
      const card = this.session.queue[this.session.currentIndex];
      if (!card) return;

      const suggestionEl = document.getElementById(
        'report-suggestion-input'
      ) as HTMLInputElement | null;
      const reasonEl = document.getElementById(
        'report-reason-input'
      ) as HTMLInputElement | null;

      const suggestion = suggestionEl?.value.trim() ?? '';
      const reason = reasonEl?.value.trim() ?? '';

      if (!suggestion && !reason) {
        this.showBanner('error', 'Informe sua tradução sugerida ou o motivo do reporte.');
        return;
      }

      storageService.submitTranslationReport({
        cardId: card.id,
        lessonNumber: card.dayNumber,
        english: card.english,
        currentPortuguese: card.portuguese,
        studentTypedPortuguese: suggestion || this.session.userTypedPortuguese,
        studentReason: reason || 'Sugestão de tradução equivalente',
        studentEmail: this.currentUser.email,
        studentName: this.currentUser.name,
      });

      this.session.isReportFormOpen = false;
      this.showBanner('success', 'Sugestão enviada para análise do professor.');
    });

    document.querySelectorAll<HTMLElement>('[data-srs-rate]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const rating = btn.getAttribute('data-srs-rate') as SrsButtonRating;
        if (rating) {
          this.handleSrsAnswer(rating);
        }
      });
    });

    document
      .getElementById('btn-practice-custom-cards')
      ?.addEventListener('click', () => this.startCustomCardsSession());

    document.getElementById('btn-add-custom-card')?.addEventListener('click', () => {
      if (!this.currentUser) return;
      const typeEl = document.getElementById('custom-card-type') as HTMLSelectElement;
      const enEl = document.getElementById('custom-card-en') as HTMLInputElement;
      const ptEl = document.getElementById('custom-card-pt') as HTMLInputElement;
      const auxEl = document.getElementById('custom-card-aux') as HTMLInputElement;

      const en = enEl?.value.trim() ?? '';
      const pt = ptEl?.value.trim() ?? '';
      if (!en || !pt) {
        this.showBanner('error', 'Preencha inglês e português.');
        return;
      }

      const result = storageService.addCustomStudentCard(
        this.currentUser.email,
        (typeEl?.value as 'word' | 'phrase') || 'word',
        en,
        pt,
        auxEl?.value
      );

      if (result.matchedExistingCourseCard) {
        this.showBanner(
          'success',
          `"${en}" já existe no curso (Lição ${result.matchedDayNumbers.join(', ')}). Marcado como aprendido para não repetir.`
        );
      } else {
        this.showBanner('success', 'Flashcard adicionado e contabilizado nas palavras conhecidas.');
      }
    });

    const searchInput = document.getElementById(
      'catalog-search-input'
    ) as HTMLInputElement | null;
    searchInput?.addEventListener('input', () => {
      this.catalogSearchQuery = searchInput.value;
      const pos = searchInput.selectionStart ?? searchInput.value.length;
      this.render();
      const restored = document.getElementById(
        'catalog-search-input'
      ) as HTMLInputElement | null;
      if (restored) {
        restored.focus();
        restored.setSelectionRange(pos, pos);
      }
    });

    document.querySelectorAll<HTMLElement>('[data-speak-text]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-speak-text') ?? '';
        if (text) audioService.speak(text);
      });
    });

    document.querySelectorAll<HTMLElement>('[data-resolve-report]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const reportId = btn.getAttribute('data-resolve-report') ?? '';
        const action = btn.getAttribute('data-resolve-action') as
          | 'accept_append'
          | 'replace_custom'
          | 'dismiss';
        const ptInput = document.getElementById(
          `admin-rep-pt-${reportId}`
        ) as HTMLInputElement | null;
        const customPt = ptInput?.value.trim();

        const ok = storageService.resolveTranslationReport({
          reportId,
          action,
          newPortugueseText: customPt,
        });

        if (ok) {
          this.showBanner(
            'success',
            action === 'dismiss'
              ? 'Reporte arquivado.'
              : 'Tradução do card atualizada com sucesso.'
          );
        }
      });
    });

    document.getElementById('btn-admin-save-user')?.addEventListener('click', async () => {
      const name = (
        document.getElementById('admin-user-name') as HTMLInputElement
      )?.value.trim();
      const email = (
        document.getElementById('admin-user-email') as HTMLInputElement
      )?.value.trim();
      const weeks = Number(
        (document.getElementById('admin-user-weeks') as HTMLInputElement)?.value || 1
      );
      const dailyQuota = Number(
        (document.getElementById('admin-user-daily-quota') as HTMLInputElement)?.value || 2
      );
      const maxDays = Number(
        (document.getElementById('admin-user-max-days') as HTMLInputElement)?.value || 1000
      );
      if (!name || !email || !/^[^\s@/]+@[^\s@/]+\.[^\s@/]+$/.test(email)) {
        this.showBanner('error', 'Informe nome e e-mail.');
        return;
      }

      const normalizedEmail = email.toLowerCase();
      const existing = storageService.getAuthorizedUsers().find((u) => u.email === normalizedEmail);
      if (existing?.role === 'teacher') {
        this.showBanner('error', 'O administrador não pode ser cadastrado como aluno.');
        return;
      }
      const user: AuthorizedUser = {
        ...existing,
        name,
        email: normalizedEmail,
        role: 'student',
        tenantId: 'default-teacher-tenant',
        active: true,
        unlockedWeeks: Math.max(1, weeks),
        dailyStudyDaysQuota: Math.max(1, dailyQuota),
        maxTotalStudyDaysLimit: Math.max(10, maxDays),
        createdAt: existing?.createdAt ?? new Date().toISOString(),
      };
      try {
        await firebaseAuthService.saveAllowedUser(user);
        this.showBanner('success', 'Aluno e limites atualizados.');
      } catch {
        this.showBanner('error', 'Não foi possível salvar o aluno na nuvem. Tente novamente.');
      }
    });

    document
      .querySelectorAll<HTMLElement>('[data-toggle-user-active]')
      .forEach((btn) => {
        btn.addEventListener('click', async () => {
          const email = btn.getAttribute('data-toggle-user-active') ?? '';
          const users = storageService.getAuthorizedUsers();
          const target = users.find(
            (u) => u.email.toLowerCase() === email.toLowerCase()
          );
          if (target) {
            const updated = { ...target, active: !target.active };
            try {
              await firebaseAuthService.saveAllowedUser(updated);
              this.showBanner('success', updated.active
                ? `Acesso ativado para ${target.name}.`
                : `Acesso pausado para ${target.name}.`);
            } catch {
              this.showBanner('error', 'Não foi possível alterar o acesso na nuvem. Tente novamente.');
            }
          }
        });
      });

    document
      .querySelectorAll<HTMLElement>('[data-unlock-next-week]')
      .forEach((btn) => {
        btn.addEventListener('click', async () => {
          const email = btn.getAttribute('data-unlock-next-week') ?? '';
          const users = storageService.getAuthorizedUsers();
          const target = users.find(
            (u) => u.email.toLowerCase() === email.toLowerCase()
          );
          if (target) {
            try {
              await firebaseAuthService.saveAllowedUser({ ...target, unlockedWeeks: target.unlockedWeeks + 1 });
              this.showBanner('success', `+7 lições liberadas para ${target.name}.`);
            } catch {
              this.showBanner('error', 'Não foi possível atualizar as lições na nuvem. Tente novamente.');
            }
          }
        });
      });

    document.querySelectorAll<HTMLElement>('[data-remove-user]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const email = btn.getAttribute('data-remove-user') ?? '';
        try {
          await firebaseAuthService.removeAllowedUser(email);
          this.showBanner('success', 'Removido.');
        } catch {
          this.showBanner('error', 'Não foi possível remover da nuvem. Tente novamente.');
        }
      });
    });

    document.getElementById('btn-admin-add-card')?.addEventListener('click', () => {
      const dayNum = Number(
        (document.getElementById('admin-card-day') as HTMLInputElement)?.value || 1
      );
      const type = (
        document.getElementById('admin-card-type') as HTMLSelectElement
      )?.value as FlashcardType;
      const en = (
        document.getElementById('admin-card-en') as HTMLInputElement
      )?.value.trim();
      const pt = (
        document.getElementById('admin-card-pt') as HTMLInputElement
      )?.value.trim();
      const auxEn = (
        document.getElementById('admin-card-aux-en') as HTMLInputElement
      )?.value.trim();
      const auxPt = (
        document.getElementById('admin-card-aux-pt') as HTMLInputElement
      )?.value.trim();
      const grammarExp = (
        document.getElementById('admin-card-grammar-exp') as HTMLTextAreaElement
      )?.value.trim();

      if (!en || !pt) {
        this.showBanner('error', 'Preencha inglês e português.');
        return;
      }

      storageService.addCardToDay(dayNum, {
        tenantId: 'default-teacher-tenant',
        dayNumber: dayNum,
        type,
        english: en,
        portuguese: pt,
        auxiliaryWord: auxEn && auxPt ? { english: auxEn, portuguese: auxPt } : undefined,
        grammarRule:
          type === 'grammar' || grammarExp
            ? {
                title: `Gramática — Lição ${dayNum}`,
                explanation: grammarExp || pt,
                examples: [{ english: en, portuguese: pt }],
              }
            : undefined,
      });

      this.showBanner('success', `Adicionado à Lição ${dayNum}.`);
    });

    document
      .getElementById('btn-admin-analyze-dialogue')
      ?.addEventListener('click', () => {
        const rawLines =
          (
            document.getElementById('admin-dialogue-lines') as HTMLTextAreaElement
          )?.value.trim() || '';
        const parsedLines = this.parseLinePairs(rawLines);
        if (parsedLines.length === 0) {
          this.showBanner('error', 'Digite as frases no formato: Inglês — Português');
          return;
        }
        this.lastDialogueAnalysis = storageService.analyzeTextPrerequisites(parsedLines);
        this.render();
      });

    document
      .getElementById('btn-admin-create-dialogue')
      ?.addEventListener('click', () => {
        const title =
          (
            document.getElementById('admin-dialogue-title') as HTMLInputElement
          )?.value.trim() || 'Diálogo';
        const afterDay = Number(
          (document.getElementById('admin-dialogue-after-day') as HTMLInputElement)
            ?.value ?? storageService.getStudyDays().length
        );
        const rawPrepLines =
          (
            document.getElementById('admin-dialogue-prep-lines') as HTMLTextAreaElement
          )?.value.trim() || '';
        const rawLines =
          (
            document.getElementById('admin-dialogue-lines') as HTMLTextAreaElement
          )?.value.trim() || '';

        const parsedLines = this.parseLinePairs(rawLines);
        if (parsedLines.length < 2) {
          this.showBanner('error', 'Formato esperado: Inglês — Português');
          return;
        }

        const prepCards = this.parseLinePairs(rawPrepLines).map((item) => ({
          type: (item.english.trim().includes(' ') ? 'phrase' : 'word') as 'word' | 'phrase',
          english: item.english,
          portuguese: item.portuguese,
        }));

        const created = storageService.insertElasticDialogueOrStory({
          afterDayNumber: afterDay,
          titleBase: title,
          dialogueCards: parsedLines,
          preparatoryCards: prepCards,
        });

        this.lastDialogueAnalysis = null;
        this.showBanner(
          'success',
          `${created.length} lição(ões) inserida(s) após a Lição ${afterDay}. As lições seguintes foram renumeradas.`
        );
      });

    document.getElementById('btn-load-sample-csv')?.addEventListener('click', () => {
      const area = document.getElementById('csv-textarea') as HTMLTextAreaElement | null;
      if (area) {
        area.value = getSampleCsvTemplate();
      }
    });

    const fileInput = document.getElementById(
      'csv-file-input'
    ) as HTMLInputElement | null;
    fileInput?.addEventListener('change', () => {
      const file = fileInput.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const area = document.getElementById(
          'csv-textarea'
        ) as HTMLTextAreaElement | null;
        if (area && typeof reader.result === 'string') {
          area.value = reader.result;
        }
      };
      reader.readAsText(file);
    });

    document.getElementById('btn-import-csv')?.addEventListener('click', () => {
      const area = document.getElementById('csv-textarea') as HTMLTextAreaElement | null;
      const text = area?.value.trim() ?? '';
      if (!text) {
        this.showBanner('error', 'Selecione ou cole um CSV.');
        return;
      }
      const res = importFlashcardsFromCsv(text);
      if (res.errors.length > 0 && res.importedCount === 0) {
        this.showBanner('error', res.errors.join(' | '));
      } else {
        this.showBanner('success', `${res.importedCount} cards importados.`);
      }
    });
  }

  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

function bootstrapApp(): void {
  const root = document.getElementById('app');
  if (root && !root.hasAttribute('data-initialized')) {
    root.setAttribute('data-initialized', 'true');
    new ZeroToFluencyApp(root);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapApp);
} else {
  bootstrapApp();
}
