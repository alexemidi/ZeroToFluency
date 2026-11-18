/**
 * Definições de tipos principais do sistema ZeroToFluency.
 * Projetado com suporte Multi-Tenant (escola/professor), controle de acesso (allowlist),
 * repetição espaçada com balanceamento de carga (load balancing) e flashcards de 3 fases.
 */

export type UserRole = 'teacher' | 'student';
export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type SubscriptionTier = 'free' | 'student_class' | 'plus' | 'pro';

export interface AuthorizedUser {
  email: string;
  name: string;
  role: UserRole;
  tenantId: string;
  active: boolean;
  unlockedWeeks: number; // Cada semana libera 7 lições
  dailyStudyDaysQuota?: number; // Quantos "dias de estudo" (blocos de 10 palavras novas) o aluno pode aprender por dia (Padrão alunos: 2 = 20 palavras/dia; Gratuito: 1 = 10 palavras/dia)
  maxTotalStudyDaysLimit?: number; // Limite geral do plano (ex: 50 ou 100 dias no plano gratuito, ou 1000 no curso completo)
  subscriptionTier?: SubscriptionTier;
  passedBlockTests?: number[]; // Índices dos blocos (1 a 15) em que o aluno foi aprovado com >= 80%
  createdAt: string;
}

export interface TranslationReport {
  id: string;
  cardId: string;
  lessonNumber: number;
  english: string;
  currentPortuguese: string;
  studentTypedPortuguese: string;
  studentReason: string;
  studentEmail: string;
  studentName: string;
  status: 'pending' | 'accepted_added' | 'edited_card' | 'dismissed';
  adminNotes?: string;
  createdAtIso: string;
}

export type FlashcardType = 'word' | 'phrase' | 'grammar' | 'dialogue';

export interface Flashcard {
  id: string;
  tenantId: string;
  dayNumber: number; // Lição ("Dia") a que pertence (0 = card personalizado do aluno)
  orderInDay: number; // 1 a 10 nos dias normais (10 = gramática), ou 8 a 15 em dias de diálogo
  type: FlashcardType;
  english: string;
  portuguese: string;
  /**
   * Palavra auxiliar ainda não aprendida que aparece na frase apenas como apoio
   * (Ex: "Auxiliar: girls = meninas (ainda não conta no vocabulário fixo)")
   */
  auxiliaryWord?: {
    english: string;
    portuguese: string;
    futureDayNumber?: number;
  };
  /**
   * Explicação detalhada quando o card é do tipo 'grammar' ou nota gramatical extra
   */
  grammarRule?: {
    title: string;
    explanation: string;
    examples: Array<{ english: string; portuguese: string; note?: string }>;
    realRuleObservation?: string;
  };
  /**
   * Se pertence a um diálogo, indica o personagem/interlocutor
   */
  dialogueSpeaker?: string;
  audioUrl?: string; // Opcional (caso o professor insira um MP3 customizado)
  isCustom?: boolean;
  createdByEmail?: string;
}

export interface StudyDayLesson {
  dayNumber: number; // Número da Lição (Unidade pedagógica: 1 a 150)
  weekNumber: number; // Módulo / Semana de liberação
  blockNumber?: number; // Bloco temático (1 a 15)
  cefrLevel?: CefrLevel; // A1, A2, B1, B2, C1 ou C2
  title: string;
  subtitle: string;
  grammarFocus: string;
  isDialogueDay: boolean;
  isReviewLesson?: boolean;
  cards: Flashcard[];
}

export type BlockTestSkill =
  | 'listening_writing'
  | 'listening_translation'
  | 'reading_speaking'
  | 'reading_translation';

export interface BlockTestQuestion {
  id: string; // ex: 'block-1-q-1'
  blockNumber: number; // 1 a 15
  qNum: number; // 1 a 20 no banco
  skill: BlockTestSkill;
  prompt: string; // Instrução exibida ao aluno
  audioText?: string; // Texto falado na síntese de áudio (listening)
  acceptedAnswers: string[]; // Respostas válidas para escrita ou tradução
}

export interface BlockTestAnswerSubmission {
  questionId: string;
  userResponse: string;
  isCorrect: boolean;
  skill: BlockTestSkill;
}

export interface BlockTestResult {
  blockNumber: number;
  userEmail: string;
  passed: boolean; // >= 80% (8 de 10)
  score: number; // 0 a 10
  totalQuestions: number; // 10
  attemptDateIso: string;
  answers: BlockTestAnswerSubmission[];
}

export type SrsButtonRating = 'again' | 'hard' | 'good';

/**
 * Fase do cartão no algoritmo similar ao Anki:
 * - 'new': Ainda não visto
 * - 'first_pass': Visto 1 vez na sessão inicial; precisa passar pelo menos mais 1 vez (< 1 min) na mesma sessão
 * - 'graduated': Já passou pelas duas passagens da lição inicial e agora está agendado em dias futuros
 * - 'relearning': O aluno clicou em "De novo" (< 1 min) e o cartão voltou para revisão imediata na sessão
 */
export type SrsCardStage = 'new' | 'first_pass' | 'graduated' | 'relearning';

export interface SrsCardProgress {
  cardId: string;
  userEmail: string;
  tenantId: string;
  stage: SrsCardStage;
  intervalDays: number; // 0 enquanto está na sessão do mesmo dia; >= 1 após graduado
  easeFactor: number; // Fator multiplicador (padrão 2.5)
  repetitions: number;
  passCountInSession: number; // Rastreia se já passou a 1ª vez obrigatória (< 1 min)
  nextReviewDateIso: string; // YYYY-MM-DD para revisões agendadas em dias futuros, ou timestamp ISO se < 1 min
  lastReviewedAtIso: string;
}

export interface LetterDiffItem {
  char: string;
  expectedChar?: string;
  status: 'correct' | 'wrong' | 'missing' | 'extra';
}

export interface WordCorrespondenceItem {
  englishWord: string;
  portugueseEquivalent: string;
  grammarClass?: string;
  isNewTarget?: boolean;
  isAuxiliary?: boolean;
}

export interface DailyCalendarActivity {
  dateIso: string; // YYYY-MM-DD
  lessonsCompleted: number[]; // Quais "Dias" (lições) o aluno concluiu nesta data real
  newCardsStudied: number;
  reviewsCompleted: number;
}

export interface RawWordCatalogItem {
  rank: number;
  english: string;
  portuguese: string;
  exampleNote?: string;
  category?: 'present' | 'past_ed' | 'past_d' | 'past_ied' | 'past_irregular' | 'general';
  baseVerb?: string;
}

export interface RawPhraseCatalogItem {
  id: number;
  portuguese: string;
  english: string;
  requiredWords: string[];
}
