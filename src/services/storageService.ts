import {
  AuthorizedUser,
  BlockTestResult,
  DailyCalendarActivity,
  Flashcard,
  FlashcardType,
  SrsCardProgress,
  StudyDayLesson,
  TranslationReport,
} from '../types';
import { INITIAL_STUDY_DAYS } from '../data/curriculumData';
import { addDaysToIsoDate, createInitialSrsProgress, getTodayDateIso } from './srsEngine';
import { normalizeText } from './letterMatcher';
import { logger } from './logger';

const STORAGE_KEYS = {
  SCHEMA_VERSION: 'ztf_schema_version',
  CURRENT_USER: 'ztf_current_user',
  AUTHORIZED_USERS: 'ztf_authorized_users',
  STUDY_DAYS: 'ztf_study_days',
  CURRICULUM_REVISION: 'ztf_curriculum_revision',
  CUSTOM_CARDS: 'ztf_custom_cards',
  SRS_PROGRESS: 'ztf_srs_progress',
  DAILY_ACTIVITY: 'ztf_daily_activity',
  TRANSLATION_REPORTS: 'ztf_translation_reports',
  LESSON_CHECKPOINTS: 'ztf_lesson_checkpoints',
  BLOCK_TEST_RESULTS: 'ztf_block_test_results',
  FIREBASE_CONFIG: 'ztf_firebase_config',
};

const CURRENT_SCHEMA_VERSION = 9;
const CURRENT_CURRICULUM_REVISION = 'a1-block-5-reviewed-v1';

const DEFAULT_AUTHORIZED_USERS: AuthorizedUser[] = [
  {
    email: 'professor@zerotofluency.com',
    name: 'Professor (Admin)',
    role: 'teacher',
    tenantId: 'default-teacher-tenant',
    active: true,
    unlockedWeeks: 30,
    dailyStudyDaysQuota: 99,
    maxTotalStudyDaysLimit: 1000,
    subscriptionTier: 'pro',
    passedBlockTests: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    createdAt: '2026-11-01T10:00:00Z',
  },
  {
    email: 'julia.aluna@gmail.com',
    name: 'Julia (Aluna — Limite: 2 Dias de Estudo/dia)',
    role: 'student',
    tenantId: 'default-teacher-tenant',
    active: true,
    unlockedWeeks: 5, // Liberadas lições iniciais
    dailyStudyDaysQuota: 2, // 2 dias de estudo por dia = até 20 palavras novas por dia
    maxTotalStudyDaysLimit: 1000,
    subscriptionTier: 'student_class',
    passedBlockTests: [],
    createdAt: '2026-11-01T10:05:00Z',
  },
  {
    email: 'lucas.aluno@gmail.com',
    name: 'Lucas (Aluno — Limite: 2 Dias de Estudo/dia)',
    role: 'student',
    tenantId: 'default-teacher-tenant',
    active: true,
    unlockedWeeks: 10,
    dailyStudyDaysQuota: 2, // 2 dias de estudo por dia = até 20 palavras novas por dia
    maxTotalStudyDaysLimit: 1000,
    subscriptionTier: 'student_class',
    passedBlockTests: [1],
    createdAt: '2026-11-01T10:10:00Z',
  },
];

export interface CustomCardRegistrationResult {
  card: Flashcard;
  matchedExistingCourseCard: boolean;
  matchedDayNumbers: number[];
}

export interface TextPrerequisiteAnalysis {
  suggestedAfterDay: number;
  knownWords: string[];
  unknownWords: string[];
  totalLines: number;
}

export interface LessonSessionCheckpoint {
  userEmail: string;
  dayNumber: number;
  title: string;
  queueCardIds: string[];
  currentIndex: number;
  elapsedSeconds: number;
  answeredCount: number;
  accuracySum: number;
  newWordsCountInLesson: number;
  updatedAtIso: string;
}

class StorageService {
  constructor() {
    this.runMigrationsIfNeeded();
  }

  private runMigrationsIfNeeded(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;

    const rawVersion = localStorage.getItem(STORAGE_KEYS.SCHEMA_VERSION);
    const version = rawVersion ? Number(rawVersion) : 0;

    if (version < CURRENT_SCHEMA_VERSION) {
      logger.info('Executando migration de banco local para versão ' + CURRENT_SCHEMA_VERSION);
      if (!localStorage.getItem(STORAGE_KEYS.AUTHORIZED_USERS)) {
        localStorage.setItem(
          STORAGE_KEYS.AUTHORIZED_USERS,
          JSON.stringify(DEFAULT_AUTHORIZED_USERS)
        );
      }
      localStorage.setItem(STORAGE_KEYS.STUDY_DAYS, JSON.stringify(INITIAL_STUDY_DAYS));
      localStorage.setItem(STORAGE_KEYS.SCHEMA_VERSION, String(CURRENT_SCHEMA_VERSION));
    }
  }

  public getAuthorizedUsers(): AuthorizedUser[] {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTHORIZED_USERS);
    if (!raw) return [...DEFAULT_AUTHORIZED_USERS];
    try {
      return JSON.parse(raw) as AuthorizedUser[];
    } catch {
      return [...DEFAULT_AUTHORIZED_USERS];
    }
  }

  public saveAuthorizedUsers(users: AuthorizedUser[]): void {
    localStorage.setItem(STORAGE_KEYS.AUTHORIZED_USERS, JSON.stringify(users));
    logger.info('Lista de controle de acesso atualizada', { totalUsers: users.length });
  }

  public addOrUpdateAuthorizedUser(user: AuthorizedUser): void {
    const users = this.getAuthorizedUsers();
    const normalizedEmail = user.email.trim().toLowerCase();
    const existingIndex = users.findIndex((u) => u.email.toLowerCase() === normalizedEmail);
    const updatedUser: AuthorizedUser = {
      ...user,
      email: normalizedEmail,
    };

    if (existingIndex >= 0) {
      users[existingIndex] = updatedUser;
    } else {
      users.push(updatedUser);
    }
    this.saveAuthorizedUsers(users);
  }

  public removeAuthorizedUser(email: string): void {
    const normalized = email.trim().toLowerCase();
    const users = this.getAuthorizedUsers().filter(
      (u) => u.email.toLowerCase() !== normalized
    );
    this.saveAuthorizedUsers(users);
  }

  public checkUserAccess(email: string): {
    allowed: boolean;
    user?: AuthorizedUser;
    reason?: string;
  } {
    const normalized = email.trim().toLowerCase();
    const users = this.getAuthorizedUsers();
    const found = users.find((u) => u.email.toLowerCase() === normalized);

    if (!found) {
      logger.warn('Tentativa de login bloqueada: e-mail não está na lista do professor', {
        email: normalized,
      });
      return {
        allowed: false,
        reason:
          'Este e-mail Google ainda não foi liberado pelo professor. Peça ao professor para autorizar seu e-mail no Painel do Professor.',
      };
    }

    if (!found.active) {
      return {
        allowed: false,
        user: found,
        reason: 'Seu acesso está temporariamente pausado pelo professor.',
      };
    }

    return { allowed: true, user: found };
  }

  public getCurrentUser(): AuthorizedUser | null {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) return null;
    try {
      const saved = JSON.parse(raw) as AuthorizedUser;
      const check = this.checkUserAccess(saved.email);
      return check.allowed && check.user ? check.user : null;
    } catch {
      return null;
    }
  }

  public setCurrentUser(user: AuthorizedUser | null): void {
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      return;
    }
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }

  private migrateReviewedBlockFiveLessons(days: StudyDayLesson[]): StudyDayLesson[] {
    if (localStorage.getItem(STORAGE_KEYS.CURRICULUM_REVISION) === CURRENT_CURRICULUM_REVISION) {
      return days;
    }

    const updatedLessons = INITIAL_STUDY_DAYS.filter(
      (lesson) => lesson.dayNumber >= 41 && lesson.dayNumber <= 46
    );
    const updatedLessonNumbers = new Set<number>();
    const isCurriculumCardId = (id: string): boolean =>
      /^day-\d+-card-\d+(?:-[a-z0-9]+)?$/i.test(id);
    const titleIdentity = (title: string): string =>
      title.replace(/^(?:Dia|Lição)\s+\d+\s+—\s*/i, '').trim();

    const migratedDays = days.map((storedLesson) => {
      const lessonTemplate = updatedLessons.find(
        (lesson) =>
          lesson.blockNumber === storedLesson.blockNumber &&
          titleIdentity(lesson.title) === titleIdentity(storedLesson.title)
      );
      if (!lessonTemplate) return storedLesson;

      updatedLessonNumbers.add(lessonTemplate.dayNumber);
      const existingCourseCards = storedLesson.cards.filter(
        (card) => !card.isCustom && isCurriculumCardId(card.id)
      );
      const storedCardIds = new Set(storedLesson.cards.map((card) => card.id));
      const reusedCardIds = new Set<string>();
      const updatedCards = lessonTemplate.cards.map((templateCard) => {
        const matchingCard = existingCourseCards.find(
          (storedCard) =>
            !reusedCardIds.has(storedCard.id) &&
            storedCard.type === templateCard.type &&
            storedCard.english === templateCard.english &&
            storedCard.portuguese === templateCard.portuguese &&
            JSON.stringify(storedCard.grammarRule) === JSON.stringify(templateCard.grammarRule) &&
            JSON.stringify(storedCard.auxiliaryWord) === JSON.stringify(templateCard.auxiliaryWord)
        );
        if (matchingCard) {
          reusedCardIds.add(matchingCard.id);
          return {
            ...templateCard,
            id: matchingCard.id,
            tenantId: matchingCard.tenantId,
            dayNumber: storedLesson.dayNumber,
          };
        }

        let freshId = templateCard.id.replace(
          /^day-\d+-/,
          `day-${storedLesson.dayNumber}-`
        );
        if (storedCardIds.has(freshId)) {
          const revisionBaseId = freshId;
          let revision = 2;
          while (storedCardIds.has(freshId)) {
            freshId = `${revisionBaseId}-r${revision}`;
            revision += 1;
          }
        }

        return {
          ...templateCard,
          id: freshId,
          dayNumber: storedLesson.dayNumber,
        };
      });

      const customCards = storedLesson.cards.filter(
        (card) => card.isCustom || !isCurriculumCardId(card.id)
      );
      const title = titleIdentity(lessonTemplate.title);

      return {
        ...storedLesson,
        ...lessonTemplate,
        dayNumber: storedLesson.dayNumber,
        weekNumber: storedLesson.weekNumber,
        title: `Lição ${storedLesson.dayNumber} — ${title}`,
        cards: [
          ...updatedCards,
          ...customCards.map((card, index) => ({
            ...card,
            dayNumber: storedLesson.dayNumber,
            orderInDay: updatedCards.length + index + 1,
          })),
        ],
      };
    });

    if (updatedLessonNumbers.size > 0) {
      localStorage.setItem(STORAGE_KEYS.STUDY_DAYS, JSON.stringify(migratedDays));
    }
    localStorage.setItem(STORAGE_KEYS.CURRICULUM_REVISION, CURRENT_CURRICULUM_REVISION);
    return migratedDays;
  }

  public getStudyDays(): StudyDayLesson[] {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDY_DAYS);
    if (!raw) return [...INITIAL_STUDY_DAYS];
    try {
      const parsed = JSON.parse(raw) as StudyDayLesson[];
      return parsed.length > 0
        ? this.migrateReviewedBlockFiveLessons(parsed)
        : [...INITIAL_STUDY_DAYS];
    } catch {
      return [...INITIAL_STUDY_DAYS];
    }
  }

  public saveStudyDays(days: StudyDayLesson[]): void {
    const sorted = [...days].sort((a, b) => a.dayNumber - b.dayNumber);
    localStorage.setItem(STORAGE_KEYS.STUDY_DAYS, JSON.stringify(sorted));
  }

  public addCardToDay(dayNumber: number, newCard: Omit<Flashcard, 'id' | 'orderInDay'>): Flashcard {
    const days = this.getStudyDays();
    let day = days.find((d) => d.dayNumber === dayNumber);

    if (!day) {
      const weekNumber = Math.ceil(dayNumber / 7);
      day = {
        dayNumber,
        weekNumber,
        title: `Dia ${dayNumber} — Lição Personalizada`,
        subtitle: 'Criado pelo professor',
        grammarFocus: 'Vocabulário e Prática',
        isDialogueDay: newCard.type === 'dialogue',
        cards: [],
      };
      days.push(day);
    }

    const orderInDay = day.cards.length + 1;
    const created: Flashcard = {
      ...newCard,
      id: `day-${dayNumber}-card-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      orderInDay,
    };

    day.cards.push(created);
    this.saveStudyDays(days);
    return created;
  }

  /**
   * Divide um diálogo/história em blocos equilibrados de até 15 frases por dia.
   */
  private chunkDialogueCards(
    dialogueCards: Array<{ speaker?: string; english: string; portuguese: string }>
  ): Array<typeof dialogueCards> {
    const chunks: Array<typeof dialogueCards> = [];
    const total = dialogueCards.length;

    if (total <= 15) {
      chunks.push(dialogueCards);
    } else {
      const numDays = Math.ceil(total / 15);
      const baseSize = Math.floor(total / numDays);
      let remainder = total % numDays;
      let cursor = 0;

      for (let i = 0; i < numDays; i++) {
        const size = baseSize + (remainder > 0 ? 1 : 0);
        if (remainder > 0) remainder--;
        chunks.push(dialogueCards.slice(cursor, cursor + size));
        cursor += size;
      }
    }
    return chunks;
  }

  /**
   * Analisa um texto de diálogo ou fábula proposto pelo professor, verifica quais palavras
   * já foram ensinadas nos dias do curso e sugere o dia ideal após o qual inserir, além de
   * listar palavras desconhecidas para gerar um Dia Preparatório (i+1) automático.
   */
  public analyzeTextPrerequisites(
    rawLines: Array<{ english: string; portuguese: string }>
  ): TextPrerequisiteAnalysis {
    const days = this.getStudyDays();
    const wordFirstDayMap = new Map<string, number>();

    for (const day of days) {
      for (const card of day.cards) {
        if (card.type === 'word') {
          const cleanWords = card.english
            .toLowerCase()
            .replace(/[^a-z']/g, ' ')
            .split(/\s+/)
            .filter(Boolean);
          for (const w of cleanWords) {
            if (!wordFirstDayMap.has(w)) {
              wordFirstDayMap.set(w, day.dayNumber);
            }
          }
        }
      }
    }

    const usedWords = new Set<string>();
    for (const line of rawLines) {
      const tokens = line.english
        .toLowerCase()
        .replace(/[^a-z']/g, ' ')
        .split(/\s+/)
        .filter(Boolean);
      tokens.forEach((t) => usedWords.add(t));
    }

    const knownWords: string[] = [];
    const unknownWords: string[] = [];
    let maxDayRequired = 1;

    for (const w of usedWords) {
      const foundDay = wordFirstDayMap.get(w);
      if (foundDay !== undefined) {
        knownWords.push(w);
        if (foundDay > maxDayRequired) {
          maxDayRequired = foundDay;
        }
      } else {
        unknownWords.push(w);
      }
    }

    return {
      suggestedAfterDay: maxDayRequired,
      knownWords,
      unknownWords,
      totalLines: rawLines.length,
    };
  }

  /**
   * Insere elasticamente Dia(s) Preparatório(s) (i+1) e/ou Dia(s) de Diálogo ou História
   * logo após `afterDayNumber`, empurrando a numeração de todos os dias seguintes (+N)
   * sem quebrar o cronograma.
   */
  public insertElasticDialogueOrStory(options: {
    afterDayNumber: number;
    titleBase: string;
    dialogueCards: Array<{ speaker?: string; english: string; portuguese: string }>;
    preparatoryCards?: Array<{ type: 'word' | 'phrase'; english: string; portuguese: string }>;
  }): StudyDayLesson[] {
    const days = this.getStudyDays();
    const maxExistingDay = days.reduce((max, d) => Math.max(max, d.dayNumber), 0);
    const targetAfterDay = Math.min(Math.max(0, options.afterDayNumber), maxExistingDay);

    const lessonsToInsert: Omit<StudyDayLesson, 'dayNumber' | 'weekNumber'>[] = [];

    // 1. Se houver cards preparatórios (i+1), monta o Dia Preparatório sem card de gramática
    if (options.preparatoryCards && options.preparatoryCards.length > 0) {
      lessonsToInsert.push({
        title: `Preparação — ${options.titleBase}`,
        subtitle: 'Vocabulário preparatório (i+1) para o diálogo/história (sem gramática).',
        grammarFocus: `Vocabulário Preparatório: ${options.titleBase}`,
        isDialogueDay: true,
        cards: options.preparatoryCards.map((item, idx) => ({
          id: `prep-${Date.now()}-${idx + 1}`,
          tenantId: 'default-teacher-tenant',
          dayNumber: 0,
          orderInDay: idx + 1,
          type: item.type,
          english: item.english,
          portuguese: item.portuguese,
        })),
      });
    }

    // 2. Monta o(s) Dia(s) de Diálogo / História (dividindo entre 8 e 15 frases se passar de 15)
    const chunks = this.chunkDialogueCards(options.dialogueCards);
    chunks.forEach((chunk, idx) => {
      const partSuffix = chunks.length > 1 ? ` (Parte ${idx + 1}/${chunks.length})` : '';
      lessonsToInsert.push({
        title: `Diálogo / História: ${options.titleBase}${partSuffix}`,
        subtitle: `Prática contextualizada com ${chunk.length} flashcards (sem card de gramática).`,
        grammarFocus: 'Compreensão e Prática em Contexto',
        isDialogueDay: true,
        cards: chunk.map((item, cIdx) => ({
          id: `dlg-${Date.now()}-${idx + 1}-${cIdx + 1}`,
          tenantId: 'default-teacher-tenant',
          dayNumber: 0,
          orderInDay: cIdx + 1,
          type: 'dialogue',
          dialogueSpeaker: item.speaker || (cIdx % 2 === 0 ? 'Pessoa A' : 'Pessoa B'),
          english: item.english,
          portuguese: item.portuguese,
        })),
      });
    });

    const shiftCount = lessonsToInsert.length;
    if (shiftCount === 0) return [];

    // 3. Empurra para frente todas as lições com dayNumber > targetAfterDay
    for (const day of days) {
      if (day.dayNumber > targetAfterDay) {
        day.dayNumber += shiftCount;
        day.weekNumber = Math.ceil(day.dayNumber / 7);
        const strippedTitle = day.title.replace(/^(Dia|Lição)\s+\d+\s*—\s*/i, '');
        day.title = `Lição ${day.dayNumber} — ${strippedTitle}`;
        day.cards.forEach((c) => {
          c.dayNumber = day.dayNumber;
        });
      }
    }

    // 4. Cria as novas lições nas posições abertas (targetAfterDay + 1 ... targetAfterDay + shiftCount)
    const createdLessons: StudyDayLesson[] = lessonsToInsert.map((template, idx) => {
      const newDayNum = targetAfterDay + idx + 1;
      const weekNumber = Math.ceil(newDayNum / 7);
      const cardsWithDay = template.cards.map((c) => ({
        ...c,
        id: `day-${newDayNum}-${c.id}`,
        dayNumber: newDayNum,
      }));
      return {
        ...template,
        dayNumber: newDayNum,
        weekNumber,
        title: `Lição ${newDayNum} — ${template.title}`,
        cards: cardsWithDay,
      };
    });

    days.push(...createdLessons);
    this.saveStudyDays(days);
    return createdLessons;
  }

  public addDialogueDaysAutomatically(
    titleBase: string,
    dialogueCards: Array<{ speaker?: string; english: string; portuguese: string }>
  ): StudyDayLesson[] {
    const days = this.getStudyDays();
    const maxExistingDay = days.reduce((max, d) => Math.max(max, d.dayNumber), 0);
    return this.insertElasticDialogueOrStory({
      afterDayNumber: maxExistingDay,
      titleBase,
      dialogueCards,
    });
  }

  public getCustomStudentCards(userEmail: string): Flashcard[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_CARDS);
    if (!raw) return [];
    try {
      const all = JSON.parse(raw) as Flashcard[];
      return all.filter(
        (c) => !c.createdByEmail || c.createdByEmail.toLowerCase() === userEmail.toLowerCase()
      );
    } catch {
      return [];
    }
  }

  /**
   * Registra um flashcard personalizado do aluno.
   * Se a palavra ou frase cadastrada já existir no cronograma oficial do curso (ex: o aluno
   * cadastra "am" como "sou" antes do Dia 4), NÃO duplica o card: marca automaticamente
   * o card oficial do curso como aprendido ('graduated') para que conte nas palavras conhecidas
   * e seja pulado quando o aluno chegar naquele dia!
   */
  public addCustomStudentCard(
    userEmail: string,
    cardType: 'word' | 'phrase',
    english: string,
    portuguese: string,
    auxiliaryNote?: string
  ): CustomCardRegistrationResult {
    const normalizedTargetEn = normalizeText(english).toLowerCase();
    const days = this.getStudyDays();
    const matchingCourseCards: Flashcard[] = [];
    const matchedDayNumbers: number[] = [];

    for (const day of days) {
      for (const card of day.cards) {
        if (
          card.type !== 'grammar' &&
          normalizeText(card.english).toLowerCase() === normalizedTargetEn
        ) {
          matchingCourseCards.push(card);
          if (!matchedDayNumbers.includes(day.dayNumber)) {
            matchedDayNumbers.push(day.dayNumber);
          }
        }
      }
    }

    const todayIso = getTodayDateIso();

    if (matchingCourseCards.length > 0) {
      for (const courseCard of matchingCourseCards) {
        const baseProgress = createInitialSrsProgress(
          courseCard.id,
          userEmail,
          courseCard.tenantId,
          todayIso
        );
        this.saveUserCardSrs(userEmail, {
          ...baseProgress,
          stage: 'graduated',
          intervalDays: 4,
          nextReviewDateIso: addDaysToIsoDate(todayIso, 4),
          lastReviewedAtIso: todayIso,
        });
      }

      logger.info('Palavra/frase já existe no cronograma oficial; marcada como aprendida', {
        userEmail,
        english,
        matchedDayNumbers,
      });

      return {
        card: matchingCourseCards[0],
        matchedExistingCourseCard: true,
        matchedDayNumbers,
      };
    }

    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_CARDS);
    const all: Flashcard[] = raw ? (JSON.parse(raw) as Flashcard[]) : [];

    const newCard: Flashcard = {
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      tenantId: 'default-teacher-tenant',
      dayNumber: 0,
      orderInDay: all.length + 1,
      type: cardType,
      english: english.trim(),
      portuguese: portuguese.trim(),
      auxiliaryWord: auxiliaryNote
        ? { english: 'Nota', portuguese: auxiliaryNote.trim() }
        : undefined,
      isCustom: true,
      createdByEmail: userEmail.toLowerCase(),
    };

    all.push(newCard);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_CARDS, JSON.stringify(all));

    // Marca também o card personalizado criado pelo aluno no SRS
    const customProgress = createInitialSrsProgress(
      newCard.id,
      userEmail,
      newCard.tenantId,
      todayIso
    );
    this.saveUserCardSrs(userEmail, {
      ...customProgress,
      stage: 'graduated',
      intervalDays: 4,
      nextReviewDateIso: addDaysToIsoDate(todayIso, 4),
      lastReviewedAtIso: todayIso,
    });

    logger.info('Aluno criou flashcard próprio', { userEmail, cardType, english });
    return {
      card: newCard,
      matchedExistingCourseCard: false,
      matchedDayNumbers: [],
    };
  }

  /**
   * Retorna a fila de cartões para estudar em um dia, pulando automaticamente cartões
   * que o aluno já conhece/graduou previamente (ex: cadastrou "am" antes do Dia 4 -> pula o
   * card "Am" e vai direto do card "I" para "I am.").
   * Caso o dia inteiro já tenha sido concluído e o aluno clique para praticar novamente,
   * retorna todos os cartões do dia.
   */
  public getLessonQueueForUser(
    userEmail: string,
    day: StudyDayLesson
  ): { queue: Flashcard[]; skippedCount: number } {
    const srsMap = this.getUserSrsMap(userEmail);
    const studyCards = day.cards.filter((c) => c.type !== 'grammar');
    const nonGraduated = studyCards.filter((c) => srsMap[c.id]?.stage !== 'graduated');

    if (nonGraduated.length === 0) {
      return { queue: [...studyCards], skippedCount: 0 };
    }

    return {
      queue: nonGraduated,
      skippedCount: studyCards.length - nonGraduated.length,
    };
  }

  /**
   * Calcula o total de palavras únicas em inglês já conhecidas/dominadas pelo aluno
   * (somando cartões de palavra graduados no curso + palavras personalizadas do aluno).
   */
  public getKnownWordsCount(userEmail: string): number {
    const srsMap = this.getUserSrsMap(userEmail);
    const days = this.getStudyDays();
    const customCards = this.getCustomStudentCards(userEmail);
    const knownSet = new Set<string>();

    let maxCompletedDay = 0;
    let hasGraduatedCardDay31 = false;
    let hasGraduatedCardDay81 = false;
    let hasGraduatedCardDay141 = false;

    for (const day of days) {
      if (this.isDayCompletedByUser(userEmail, day.dayNumber)) {
        if (day.dayNumber > maxCompletedDay) maxCompletedDay = day.dayNumber;
      }
      for (const card of day.cards) {
        if (srsMap[card.id]?.stage === 'graduated') {
          if (card.type === 'word') {
            knownSet.add(normalizeText(card.english).toLowerCase());
          }
          if (day.dayNumber >= 141) hasGraduatedCardDay141 = true;
          if (day.dayNumber >= 81) hasGraduatedCardDay81 = true;
          if (day.dayNumber >= 31) hasGraduatedCardDay31 = true;
        }
      }
    }

    for (const custom of customCards) {
      if (custom.type === 'word') {
        knownSet.add(normalizeText(custom.english).toLowerCase());
      }
    }

    let total = knownSet.size;

    // Multiplicadores Morfológicos conforme especificações do nível A1:
    // Bloco 4 (Dia 31+): Plural regular (+s, -es, -ies) (+15% de ampliação de vocabulário ativo)
    if (maxCompletedDay >= 31 || hasGraduatedCardDay31) {
      total = Math.round(total * 1.15);
    }

    // Bloco 9 (Dia 81+): 3ª pessoa do singular (-s, -es) no Simple Present (+10%)
    if (maxCompletedDay >= 81 || hasGraduatedCardDay81) {
      total = Math.round(total * 1.10);
    }

    // Bloco 15 (Dia 141+): Passado regular (-ed) (+10%)
    if (maxCompletedDay >= 141 || hasGraduatedCardDay141) {
      total = Math.round(total * 1.10);
    }

    return total;
  }

  public getUserSrsMap(userEmail: string): Record<string, SrsCardProgress> {
    const raw = localStorage.getItem(STORAGE_KEYS.SRS_PROGRESS);
    if (!raw) return {};
    try {
      const all = JSON.parse(raw) as Record<string, Record<string, SrsCardProgress>>;
      return all[userEmail.toLowerCase()] ?? {};
    } catch {
      return {};
    }
  }

  public saveUserCardSrs(userEmail: string, progress: SrsCardProgress): void {
    const raw = localStorage.getItem(STORAGE_KEYS.SRS_PROGRESS);
    const all: Record<string, Record<string, SrsCardProgress>> = raw ? JSON.parse(raw) : {};
    const key = userEmail.toLowerCase();
    if (!all[key]) {
      all[key] = {};
    }
    all[key][progress.cardId] = progress;
    localStorage.setItem(STORAGE_KEYS.SRS_PROGRESS, JSON.stringify(all));
  }

  public getScheduledCountsByDate(userEmail: string): Record<string, number> {
    const map = this.getUserSrsMap(userEmail);
    const counts: Record<string, number> = {};
    for (const item of Object.values(map)) {
      if (item.stage === 'graduated' && item.nextReviewDateIso) {
        const d = item.nextReviewDateIso.slice(0, 10);
        counts[d] = (counts[d] ?? 0) + 1;
      }
    }
    return counts;
  }

  public getDueReviewCards(userEmail: string, todayIso = getTodayDateIso()): Flashcard[] {
    const srsMap = this.getUserSrsMap(userEmail);
    const allDays = this.getStudyDays();
    const customCards = this.getCustomStudentCards(userEmail);

    const cardLookup = new Map<string, Flashcard>();
    for (const d of allDays) {
      for (const c of d.cards) {
        cardLookup.set(c.id, c);
      }
    }
    for (const c of customCards) {
      cardLookup.set(c.id, c);
    }

    const dueCards: Flashcard[] = [];
    for (const prog of Object.values(srsMap)) {
      if (prog.stage === 'graduated' && prog.nextReviewDateIso.slice(0, 10) <= todayIso) {
        const card = cardLookup.get(prog.cardId);
        if (card) {
          dueCards.push(card);
        }
      }
    }

    return dueCards;
  }

  public isDayCompletedByUser(userEmail: string, dayNumber: number): boolean {
    const days = this.getStudyDays();
    const day = days.find((d) => d.dayNumber === dayNumber);
    if (!day || day.cards.length === 0) return false;

    const srsMap = this.getUserSrsMap(userEmail);
    return day.cards.every((c) => srsMap[c.id]?.stage === 'graduated');
  }

  public getCompletedDayNumbers(userEmail: string): number[] {
    const days = this.getStudyDays();
    return days
      .filter((d) => this.isDayCompletedByUser(userEmail, d.dayNumber))
      .map((d) => d.dayNumber);
  }

  public getUserCalendarActivities(userEmail: string): Record<string, DailyCalendarActivity> {
    const raw = localStorage.getItem(STORAGE_KEYS.DAILY_ACTIVITY);
    if (!raw) return {};
    try {
      const all = JSON.parse(raw) as Record<string, Record<string, DailyCalendarActivity>>;
      return all[userEmail.toLowerCase()] ?? {};
    } catch {
      return {};
    }
  }

  public recordDailyActivity(
    userEmail: string,
    options: {
      completedDayNumber?: number;
      newCardsDelta?: number;
      reviewsDelta?: number;
      dateIso?: string;
    }
  ): void {
    const raw = localStorage.getItem(STORAGE_KEYS.DAILY_ACTIVITY);
    const all: Record<string, Record<string, DailyCalendarActivity>> = raw
      ? JSON.parse(raw)
      : {};
    const key = userEmail.toLowerCase();
    const dateIso = options.dateIso ?? getTodayDateIso();

    if (!all[key]) all[key] = {};
    if (!all[key][dateIso]) {
      all[key][dateIso] = {
        dateIso,
        lessonsCompleted: [],
        newCardsStudied: 0,
        reviewsCompleted: 0,
      };
    }

    const entry = all[key][dateIso];
    if (
      options.completedDayNumber !== undefined &&
      !entry.lessonsCompleted.includes(options.completedDayNumber)
    ) {
      entry.lessonsCompleted.push(options.completedDayNumber);
    }
    if (options.newCardsDelta) {
      entry.newCardsStudied += options.newCardsDelta;
    }
    if (options.reviewsDelta) {
      entry.reviewsCompleted += options.reviewsDelta;
    }

    localStorage.setItem(STORAGE_KEYS.DAILY_ACTIVITY, JSON.stringify(all));
  }

  /**
   * 1 Dia de Estudo equivale a 10 palavras novas aprendidas.
   * Retorna quantas palavras novas foram aprendidas hoje e no total, e a equivalência em Dias de Estudo.
   */
  public getStudyDaysMetrics(
    userEmail: string,
    todayIso = getTodayDateIso()
  ): {
    knownWordsTotal: number;
    totalStudyDaysEquivalent: number;
    newWordsLearnedToday: number;
    studyDaysCompletedToday: number;
    dailyStudyDaysQuota: number;
    dailyWordsQuota: number;
    maxTotalStudyDaysLimit: number;
  } {
    const knownWordsTotal = this.getKnownWordsCount(userEmail);
    const totalStudyDaysEquivalent = Number((knownWordsTotal / 10).toFixed(1));

    const srsMap = this.getUserSrsMap(userEmail);
    const days = this.getStudyDays();
    const customCards = this.getCustomStudentCards(userEmail);

    const wordsGraduatedToday = new Set<string>();
    for (const day of days) {
      for (const card of day.cards) {
        const prog = srsMap[card.id];
        if (
          card.type === 'word' &&
          prog?.stage === 'graduated' &&
          prog.lastReviewedAtIso?.slice(0, 10) === todayIso
        ) {
          wordsGraduatedToday.add(normalizeText(card.english).toLowerCase());
        }
      }
    }
    for (const custom of customCards) {
      const prog = srsMap[custom.id];
      if (
        custom.type === 'word' &&
        prog?.stage === 'graduated' &&
        prog.lastReviewedAtIso?.slice(0, 10) === todayIso
      ) {
        wordsGraduatedToday.add(normalizeText(custom.english).toLowerCase());
      }
    }

    const newWordsLearnedToday = wordsGraduatedToday.size;
    const studyDaysCompletedToday = Number((newWordsLearnedToday / 10).toFixed(1));

    const user = this.getAuthorizedUsers().find(
      (u) => u.email.toLowerCase() === userEmail.toLowerCase()
    );
    const dailyStudyDaysQuota =
      user?.role === 'teacher' ? 99 : (user?.dailyStudyDaysQuota ?? 2);
    const dailyWordsQuota = dailyStudyDaysQuota * 10;
    const maxTotalStudyDaysLimit = user?.maxTotalStudyDaysLimit ?? 1000;

    return {
      knownWordsTotal,
      totalStudyDaysEquivalent,
      newWordsLearnedToday,
      studyDaysCompletedToday,
      dailyStudyDaysQuota,
      dailyWordsQuota,
      maxTotalStudyDaysLimit,
    };
  }

  /**
   * Gerenciamento de Reportes de Tradução (Bandeirinha acionada pelos alunos)
   */
  public getTranslationReports(): TranslationReport[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSLATION_REPORTS);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as TranslationReport[];
    } catch {
      return [];
    }
  }

  public saveTranslationReports(reports: TranslationReport[]): void {
    localStorage.setItem(STORAGE_KEYS.TRANSLATION_REPORTS, JSON.stringify(reports));
  }

  public submitTranslationReport(data: {
    cardId: string;
    lessonNumber: number;
    english: string;
    currentPortuguese: string;
    studentTypedPortuguese: string;
    studentReason: string;
    studentEmail: string;
    studentName: string;
  }): TranslationReport {
    const reports = this.getTranslationReports();
    const created: TranslationReport = {
      id: `rep-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      ...data,
      status: 'pending',
      createdAtIso: new Date().toISOString(),
    };
    reports.unshift(created);
    this.saveTranslationReports(reports);
    logger.info('Novo reporte de tradução enviado pelo aluno', {
      cardId: data.cardId,
      studentEmail: data.studentEmail,
    });
    return created;
  }

  /**
   * Permite ao Administrador aceitar a tradução sugerida pelo aluno (adicionando-a com " / "
   * às possibilidades válidas do flashcard) ou editar diretamente o texto em inglês/português do card.
   */
  public resolveTranslationReport(options: {
    reportId: string;
    action: 'accept_append' | 'replace_custom' | 'dismiss';
    newPortugueseText?: string;
    newEnglishText?: string;
  }): boolean {
    const reports = this.getTranslationReports();
    const report = reports.find((r) => r.id === options.reportId);
    if (!report) return false;

    if (options.action === 'dismiss') {
      report.status = 'dismissed';
      this.saveTranslationReports(reports);
      return true;
    }

    const days = this.getStudyDays();
    let updatedCard = false;

    for (const day of days) {
      for (const card of day.cards) {
        if (card.id === report.cardId) {
          if (options.action === 'accept_append') {
            const candidate = (options.newPortugueseText ?? report.studentTypedPortuguese).trim();
            if (candidate) {
              const existingParts = card.portuguese
                .split('/')
                .map((p) => normalizeText(p).toLowerCase());
              if (!existingParts.includes(normalizeText(candidate).toLowerCase())) {
                card.portuguese = `${card.portuguese} / ${candidate}`;
              }
            }
            report.status = 'accepted_added';
          } else if (options.action === 'replace_custom') {
            if (options.newPortugueseText && options.newPortugueseText.trim()) {
              card.portuguese = options.newPortugueseText.trim();
            }
            if (options.newEnglishText && options.newEnglishText.trim()) {
              card.english = options.newEnglishText.trim();
            }
            report.status = 'edited_card';
          }
          updatedCard = true;
          break;
        }
      }
      if (updatedCard) break;
    }

    this.saveStudyDays(days);
    this.saveTranslationReports(reports);
    return true;
  }

  /**
   * Persistência de Checkpoint de Lição em Andamento (para o botão "Estudar" retomar
   * exatamente de onde o aluno parou caso ele saia no meio da lição).
   */
  public getLessonCheckpoint(userEmail: string): LessonSessionCheckpoint | null {
    const raw = localStorage.getItem(STORAGE_KEYS.LESSON_CHECKPOINTS);
    if (!raw) return null;
    try {
      const map = JSON.parse(raw) as Record<string, LessonSessionCheckpoint>;
      return map[userEmail.toLowerCase()] ?? null;
    } catch {
      return null;
    }
  }

  public saveLessonCheckpoint(checkpoint: LessonSessionCheckpoint): void {
    const raw = localStorage.getItem(STORAGE_KEYS.LESSON_CHECKPOINTS);
    let map: Record<string, LessonSessionCheckpoint> = {};
    if (raw) {
      try {
        map = JSON.parse(raw) as Record<string, LessonSessionCheckpoint>;
      } catch {
        map = {};
      }
    }
    map[checkpoint.userEmail.toLowerCase()] = checkpoint;
    localStorage.setItem(STORAGE_KEYS.LESSON_CHECKPOINTS, JSON.stringify(map));
  }

  public clearLessonCheckpoint(userEmail: string): void {
    const raw = localStorage.getItem(STORAGE_KEYS.LESSON_CHECKPOINTS);
    if (!raw) return;
    try {
      const map = JSON.parse(raw) as Record<string, LessonSessionCheckpoint>;
      delete map[userEmail.toLowerCase()];
      localStorage.setItem(STORAGE_KEYS.LESSON_CHECKPOINTS, JSON.stringify(map));
    } catch {
      // ignora erro de parse
    }
  }

  /**
   * Retorna a lição que o aluno deve fazer ao clicar em "Estudar":
   * 1º Se houver um checkpoint salvo no meio de uma lição, retorna essa lição.
   * 2º Caso contrário, retorna a primeira lição ainda não concluída (ou a última lição disponível).
   */
  public getNextPendingLessonForUser(userEmail: string): StudyDayLesson | null {
    const days = this.getStudyDays();
    if (days.length === 0) return null;

    const checkpoint = this.getLessonCheckpoint(userEmail);
    if (checkpoint) {
      const foundCheckpointLesson = days.find((d) => d.dayNumber === checkpoint.dayNumber);
      if (foundCheckpointLesson) {
        return foundCheckpointLesson;
      }
    }

    const completed = new Set(this.getCompletedDayNumbers(userEmail));
    const firstPending = days.find((d) => !completed.has(d.dayNumber));
    return firstPending ?? days[days.length - 1];
  }

  /**
   * Gerenciamento de Testes de Bloco (5 Habilidades)
   */
  public getBlockTestResults(userEmail: string): BlockTestResult[] {
    const raw = localStorage.getItem(STORAGE_KEYS.BLOCK_TEST_RESULTS);
    if (!raw) return [];
    try {
      const all = JSON.parse(raw) as Record<string, BlockTestResult[]>;
      return all[userEmail.toLowerCase()] ?? [];
    } catch {
      return [];
    }
  }

  public saveBlockTestResult(result: BlockTestResult): void {
    const raw = localStorage.getItem(STORAGE_KEYS.BLOCK_TEST_RESULTS);
    const all: Record<string, BlockTestResult[]> = raw ? JSON.parse(raw) : {};
    const key = result.userEmail.toLowerCase();
    if (!all[key]) all[key] = [];
    all[key].push(result);
    localStorage.setItem(STORAGE_KEYS.BLOCK_TEST_RESULTS, JSON.stringify(all));

    // Se aprovado (score >= 8 de 10), registra o bloco aprovado no perfil do usuário
    if (result.passed) {
      const users = this.getAuthorizedUsers();
      const user = users.find((u) => u.email.toLowerCase() === key);
      if (user) {
        if (!user.passedBlockTests) user.passedBlockTests = [];
        if (!user.passedBlockTests.includes(result.blockNumber)) {
          user.passedBlockTests.push(result.blockNumber);
          user.passedBlockTests.sort((a, b) => a - b);
          this.saveAuthorizedUsers(users);
        }
      }
    }
  }

  public isBlockPassedTest(arg1: string | number, arg2?: string | number): boolean {
    const blockNumber = typeof arg1 === 'number' ? arg1 : Number(arg2 ?? 1);
    const userEmail = typeof arg1 === 'string' ? arg1 : String(arg2 ?? '');
    const users = this.getAuthorizedUsers();
    const user = users.find((u) => u.email.toLowerCase() === userEmail.toLowerCase());
    if (user?.role === 'teacher') return true;
    return Boolean(user?.passedBlockTests?.includes(blockNumber));
  }

  public isBlockUnlocked(arg1: string | number, arg2?: string | number): boolean {
    const blockNumber = typeof arg1 === 'number' ? arg1 : Number(arg2 ?? 1);
    const userEmail = typeof arg1 === 'string' ? arg1 : String(arg2 ?? '');
    if (blockNumber <= 1) return true;
    const users = this.getAuthorizedUsers();
    const user = users.find((u) => u.email.toLowerCase() === userEmail.toLowerCase());
    if (user?.role === 'teacher') return true;
    return Boolean(user?.passedBlockTests?.includes(blockNumber - 1));
  }

  public getPassedBlockTests(userEmail: string): number[] {
    const users = this.getAuthorizedUsers();
    const user = users.find((u) => u.email.toLowerCase() === userEmail.toLowerCase());
    return user?.passedBlockTests ?? [];
  }

  /**
   * Reseta todo o progresso de estudos do usuário especificado:
   * - Limpa o histórico de SRS (repetição espaçada)
   * - Limpa checkpoints de lição em andamento
   * - Limpa histórico de atividade no calendário
   * - Limpa notas e resultados dos testes de bloco
   * - Zera a lista de blocos aprovados (passedBlockTests)
   */
  public resetUserProgress(userEmail: string): void {
    const emailKey = userEmail.toLowerCase();

    // 1. Limpar SRS do usuário
    const srsRaw = localStorage.getItem(STORAGE_KEYS.SRS_PROGRESS);
    if (srsRaw) {
      try {
        const allSrs = JSON.parse(srsRaw);
        delete allSrs[emailKey];
        localStorage.setItem(STORAGE_KEYS.SRS_PROGRESS, JSON.stringify(allSrs));
      } catch {}
    }

    // 2. Limpar Checkpoint de lição
    const checkpointsRaw = localStorage.getItem(STORAGE_KEYS.LESSON_CHECKPOINTS);
    if (checkpointsRaw) {
      try {
        const allCp = JSON.parse(checkpointsRaw);
        delete allCp[emailKey];
        localStorage.setItem(STORAGE_KEYS.LESSON_CHECKPOINTS, JSON.stringify(allCp));
      } catch {}
    }

    // 3. Limpar Atividade diária
    const actRaw = localStorage.getItem(STORAGE_KEYS.DAILY_ACTIVITY);
    if (actRaw) {
      try {
        const allAct = JSON.parse(actRaw);
        delete allAct[emailKey];
        localStorage.setItem(STORAGE_KEYS.DAILY_ACTIVITY, JSON.stringify(allAct));
      } catch {}
    }

    // 4. Limpar Resultados de testes de bloco
    const testsRaw = localStorage.getItem(STORAGE_KEYS.BLOCK_TEST_RESULTS);
    if (testsRaw) {
      try {
        const allTests = JSON.parse(testsRaw);
        delete allTests[emailKey];
        localStorage.setItem(STORAGE_KEYS.BLOCK_TEST_RESULTS, JSON.stringify(allTests));
      } catch {}
    }

    // 5. Resetar passedBlockTests do usuário em authorizedUsers
    const users = this.getAuthorizedUsers();
    const u = users.find((x) => x.email.toLowerCase() === emailKey);
    if (u) {
      u.passedBlockTests = [];
      this.saveAuthorizedUsers(users);
    }

    // 6. Sincroniza currículo padrão garantindo estrutura atualizada
    localStorage.setItem(STORAGE_KEYS.STUDY_DAYS, JSON.stringify(INITIAL_STUDY_DAYS));
  }
}

export const storageService = new StorageService();
