import { SrsButtonRating, SrsCardProgress } from '../types';

/**
 * Adiciona N dias a uma string ISO YYYY-MM-DD (em UTC/local neutro).
 */
export function addDaysToIsoDate(baseDateIso: string, daysToAdd: number): string {
  const dateOnly = baseDateIso.slice(0, 10);
  const [y, m, d] = dateOnly.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + daysToAdd);
  return dt.toISOString().slice(0, 10);
}

/**
 * Retorna a data atual no formato YYYY-MM-DD.
 */
export function getTodayDateIso(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Cria o estado inicial de um flashcard nunca estudado.
 */
export function createInitialSrsProgress(
  cardId: string,
  userEmail: string,
  tenantId = 'default-teacher-tenant',
  todayIso = getTodayDateIso()
): SrsCardProgress {
  return {
    cardId,
    userEmail,
    tenantId,
    stage: 'new',
    intervalDays: 0,
    easeFactor: 2.5,
    repetitions: 0,
    passCountInSession: 0,
    nextReviewDateIso: todayIso,
    lastReviewedAtIso: new Date().toISOString(),
  };
}

/**
 * Calcula o espalhamento (Load Balancing) dos intervalos para evitar que todos os cards
 * estudados no mesmo dia caiam juntos na mesma data futura.
 */
export function pickLoadBalancedInterval(
  candidateDays: number[],
  todayIso: string,
  existingScheduledCountsByDate: Record<string, number>,
  cardIndexSeed = 0
): number {
  if (candidateDays.length === 0) return 1;
  if (candidateDays.length === 1) return candidateDays[0];

  let bestDay = candidateDays[0];
  let minCount = Infinity;

  for (let i = 0; i < candidateDays.length; i++) {
    const idx = (i + cardIndexSeed) % candidateDays.length;
    const candidate = candidateDays[idx];
    const targetDate = addDaysToIsoDate(todayIso, candidate);
    const count = existingScheduledCountsByDate[targetDate] ?? 0;

    if (count < minCount) {
      minCount = count;
      bestDay = candidate;
    }
  }

  return bestDay;
}

/**
 * Processa a resposta do aluno em um flashcard (3 botões: 'again' = Errei, 'hard' = Ok, 'good' = Aprendido).
 *
 * Regras definidas pelo professor:
 * 1. Na primeira vez que o card aparece na lição (`current.stage === 'new'`):
 *    - 'good' (Aprendido): A revisão será APENAS no dia seguinte (`intervalDays = 1`, `stage = 'graduated'`),
 *      não repetindo no mesmo dia.
 *    - 'hard' (Ok): Na primeira vez, a revisão acontece no MESMO dia/sessão (`intervalDays = 0`, `stage = 'first_pass'`).
 *    - 'again' (Errei): Permanece no mesmo dia/sessão (`intervalDays = 0`, `stage = 'relearning'`).
 *
 * 2. Na repetição dentro da mesma sessão (`current.stage === 'first_pass'` ou `'relearning'`):
 *    - 'again' (Errei): Continua na sessão de hoje (`intervalDays = 0`).
 *    - 'hard' (Ok) ou 'good' (Aprendido): Gradua para o dia seguinte (`intervalDays = 1`, `stage = 'graduated'`).
 *
 * 3. Nas revisões em dias seguintes (`current.stage === 'graduated'`):
 *    - 'again' (Errei): Volta para reaprendizagem na sessão de hoje (`intervalDays = 0`, `stage = 'relearning'`).
 *    - 'hard' (Ok): Avança de forma moderada (1-2 dias se estava em 1 dia, ou * 1.3).
 *    - 'good' (Aprendido): Espalha entre 3, 4 ou 5 dias (quando vem de 1 dia) ou multiplica pelo easeFactor com load balancing.
 */
export function applySrsRating(
  current: SrsCardProgress,
  rating: SrsButtonRating,
  todayIso: string,
  existingScheduledCountsByDate: Record<string, number>,
  cardIndexSeed = 0
): SrsCardProgress {
  const nowIso = new Date().toISOString();

  // SE CLICOU EM "ERREI" ('again') EM QUALQUER PASSAGEM:
  // Permanece na sessão do dia até o aluno consolidar.
  if (rating === 'again') {
    return {
      ...current,
      stage: 'relearning',
      intervalDays: 0,
      easeFactor: Math.max(1.3, Number((current.easeFactor - 0.2).toFixed(2))),
      passCountInSession: current.passCountInSession + 1,
      nextReviewDateIso: todayIso,
      lastReviewedAtIso: nowIso,
    };
  }

  // 1ª VEZ QUE O CARD É VISTO NA LIÇÃO ('new'):
  if (current.stage === 'new') {
    if (rating === 'hard') {
      // Marcou "Ok" na 1ª vez: revisa ainda hoje na mesma sessão!
      return {
        ...current,
        stage: 'first_pass',
        intervalDays: 0,
        passCountInSession: 1,
        nextReviewDateIso: todayIso,
        lastReviewedAtIso: nowIso,
      };
    }

    // Marcou "Aprendido" ('good') na 1ª vez: vai direto para o dia seguinte (1 dia)!
    const nextDate = addDaysToIsoDate(todayIso, 1);
    existingScheduledCountsByDate[nextDate] =
      (existingScheduledCountsByDate[nextDate] ?? 0) + 1;

    return {
      ...current,
      stage: 'graduated',
      intervalDays: 1,
      repetitions: 1,
      passCountInSession: 1,
      nextReviewDateIso: nextDate,
      lastReviewedAtIso: nowIso,
    };
  }

  // 2ª PASSAGEM NO MESMO DIA (após ter clicado em "Ok" ou "Errei" na 1ª vez)
  if (current.stage === 'first_pass' || current.stage === 'relearning') {
    const nextDate = addDaysToIsoDate(todayIso, 1);
    existingScheduledCountsByDate[nextDate] =
      (existingScheduledCountsByDate[nextDate] ?? 0) + 1;

    return {
      ...current,
      stage: 'graduated',
      intervalDays: 1,
      easeFactor:
        rating === 'hard'
          ? Math.max(1.3, Number((current.easeFactor - 0.15).toFixed(2)))
          : current.easeFactor,
      repetitions: current.repetitions + 1,
      passCountInSession: current.passCountInSession + 1,
      nextReviewDateIso: nextDate,
      lastReviewedAtIso: nowIso,
    };
  }

  // REVISÃO DE CARTÃO JÁ GRADUADO EM DIAS POSTERIORES ('graduated')
  let candidateSpread: number[];
  let nextEase = current.easeFactor;

  if (rating === 'hard') {
    nextEase = Math.max(1.3, Number((current.easeFactor - 0.15).toFixed(2)));
    if (current.intervalDays <= 1) {
      candidateSpread = [1, 2];
    } else {
      const baseHard = Math.max(
        current.intervalDays + 1,
        Math.round(current.intervalDays * 1.3)
      );
      candidateSpread = [baseHard, baseHard + 1];
    }
  } else {
    // 'good' (Aprendido) em revisão de dia seguinte ou posterior
    nextEase = Math.min(3.0, Number((current.easeFactor + 0.05).toFixed(2)));
    if (current.intervalDays <= 1) {
      candidateSpread = [3, 4, 5];
    } else {
      const baseGood = Math.max(
        current.intervalDays + 2,
        Math.round(current.intervalDays * current.easeFactor)
      );
      candidateSpread =
        baseGood >= 4
          ? [baseGood - 1, baseGood, baseGood + 1]
          : [baseGood, baseGood + 1];
    }
  }

  const balancedInterval = pickLoadBalancedInterval(
    candidateSpread,
    todayIso,
    existingScheduledCountsByDate,
    cardIndexSeed
  );
  const nextDate = addDaysToIsoDate(todayIso, balancedInterval);

  existingScheduledCountsByDate[nextDate] =
    (existingScheduledCountsByDate[nextDate] ?? 0) + 1;

  return {
    ...current,
    stage: 'graduated',
    intervalDays: balancedInterval,
    easeFactor: nextEase,
    repetitions: current.repetitions + 1,
    passCountInSession: current.passCountInSession + 1,
    nextReviewDateIso: nextDate,
    lastReviewedAtIso: nowIso,
  };
}

/**
 * Retorna os rótulos de tempo que aparecem nos 3 botões ("Errei", "Ok", "Aprendido")
 * conforme o estágio atual do cartão.
 */
export function getButtonIntervalLabels(progress: SrsCardProgress): {
  againLabel: string;
  hardLabel: string;
  goodLabel: string;
} {
  if (progress.stage === 'new') {
    return {
      againLabel: 'Hoje',
      hardLabel: 'Hoje',
      goodLabel: '1 dia',
    };
  }

  if (progress.stage === 'first_pass' || progress.stage === 'relearning') {
    return {
      againLabel: 'Hoje',
      hardLabel: '1 dia',
      goodLabel: '1 dia',
    };
  }

  if (progress.intervalDays <= 1) {
    return {
      againLabel: 'Hoje',
      hardLabel: '1-2d',
      goodLabel: '3-5d',
    };
  }

  const hardDays = Math.max(
    progress.intervalDays + 1,
    Math.round(progress.intervalDays * 1.3)
  );
  const goodDays = Math.max(
    progress.intervalDays + 2,
    Math.round(progress.intervalDays * progress.easeFactor)
  );

  return {
    againLabel: 'Hoje',
    hardLabel: `${hardDays}d`,
    goodLabel: `${goodDays}d`,
  };
}
