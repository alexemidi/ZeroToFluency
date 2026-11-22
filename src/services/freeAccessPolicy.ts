export interface FreeAccessState {
  completedLessons: number[];
  passedBlocks: number[];
  activeCycle: string | null;
  activeLesson: number | null;
  activeExam: number | null;
  lastCycleDate: string | null;
}

export type FreeAccessDecision =
  | { allowed: true; state: FreeAccessState }
  | { allowed: false; reason: string };

export function initialFreeAccessState(): FreeAccessState {
  return {
    completedLessons: [],
    passedBlocks: [],
    activeCycle: null,
    activeLesson: null,
    activeExam: null,
    lastCycleDate: null,
  };
}

export function brasiliaDate(now: Date): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes): string => {
    const value = parts.find((item) => item.type === type)?.value;
    if (!value) throw new Error(`Data de Brasília sem ${type}.`);
    return value;
  };
  return `${part('year')}-${part('month')}-${part('day')}`;
}

function lessonCycle(dayNumber: number): string | null {
  if (!Number.isInteger(dayNumber) || dayNumber < 1 || dayNumber > 11) return null;
  return dayNumber <= 9 ? `1-cycle-${Math.ceil(dayNumber / 3)}` : '1-closing';
}

function activateCycle(
  state: FreeAccessState,
  cycle: string,
  today: string
): FreeAccessDecision {
  if (state.activeCycle !== cycle && state.lastCycleDate === today) {
    return { allowed: false, reason: 'Você já iniciou outro ciclo hoje. Volte amanhã para continuar.' };
  }
  if (state.activeCycle && state.activeCycle !== cycle) {
    return { allowed: false, reason: 'Conclua o ciclo em andamento antes de iniciar outro.' };
  }
  return { allowed: true, state: { ...state, activeCycle: cycle, lastCycleDate: today } };
}

export function startFreeLesson(
  state: FreeAccessState,
  dayNumber: number,
  today: string
): FreeAccessDecision {
  const cycle = lessonCycle(dayNumber);
  if (!cycle) {
    return { allowed: false, reason: 'Esta lição ainda não está disponível no plano gratuito.' };
  }
  if (state.completedLessons.includes(dayNumber)) {
    return { allowed: true, state };
  }
  if (dayNumber > 1 && !state.completedLessons.includes(dayNumber - 1)) {
    return { allowed: false, reason: 'Conclua a lição anterior antes de continuar.' };
  }
  const decision = activateCycle(state, cycle, today);
  if (!decision.allowed) return decision;
  return { allowed: true, state: { ...decision.state, activeLesson: dayNumber } };
}

export function completeFreeLesson(
  state: FreeAccessState,
  dayNumber: number,
  today: string
): FreeAccessDecision {
  const cycle = lessonCycle(dayNumber);
  if (!cycle) return { allowed: false, reason: 'Esta lição não está disponível no plano gratuito.' };
  if (state.completedLessons.includes(dayNumber)) return { allowed: true, state };
  if (state.activeLesson !== dayNumber || state.activeCycle !== cycle) {
    return { allowed: false, reason: 'Inicie a lição antes de concluí-la.' };
  }
  const closesCycle = dayNumber <= 9 && dayNumber % 3 === 0;
  return {
    allowed: true,
    state: {
      ...state,
      completedLessons: [...state.completedLessons, dayNumber],
      activeLesson: null,
      activeCycle: closesCycle ? null : cycle,
      lastCycleDate: today,
    },
  };
}

export function startFreeExam(state: FreeAccessState, blockNumber: number, today: string): FreeAccessDecision {
  if (blockNumber !== 1) {
    return { allowed: false, reason: 'Este exame ainda não está disponível no plano gratuito.' };
  }
  if (!state.completedLessons.includes(10) || !state.completedLessons.includes(11)) {
    return { allowed: false, reason: 'Conclua o banco e a lição prática antes do exame.' };
  }
  if (state.passedBlocks.includes(blockNumber)) {
    return { allowed: true, state: { ...state, activeExam: blockNumber } };
  }
  const decision = activateCycle(state, '1-closing', today);
  if (!decision.allowed) return decision;
  return { allowed: true, state: { ...decision.state, activeExam: blockNumber } };
}

export function completeFreeExam(
  state: FreeAccessState,
  blockNumber: number,
  correctAnswers: number,
  today: string
): FreeAccessDecision {
  if (blockNumber !== 1 || !Number.isInteger(correctAnswers) || correctAnswers < 0 || correctAnswers > 10) {
    return { allowed: false, reason: 'Resultado de exame inválido.' };
  }
  if (state.activeExam !== blockNumber || !state.completedLessons.includes(11)) {
    return { allowed: false, reason: 'Inicie o exame antes de concluí-lo.' };
  }
  if (state.passedBlocks.includes(blockNumber)) {
    return { allowed: true, state: { ...state, activeExam: null } };
  }
  if (state.activeCycle !== '1-closing') {
    return { allowed: false, reason: 'O ciclo de encerramento não está em andamento.' };
  }
  return {
    allowed: true,
    state: correctAnswers >= 8
      ? { ...state, passedBlocks: [...state.passedBlocks, blockNumber], activeCycle: null, activeExam: null, lastCycleDate: today }
      : { ...state, activeExam: null, lastCycleDate: today },
  };
}
