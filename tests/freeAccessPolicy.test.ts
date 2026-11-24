import { describe, expect, it } from 'vitest';
import {
  brasiliaDate,
  completeFreeExam,
  completeFreeLesson,
  FreeAccessDecision,
  initialFreeAccessState,
  startFreeExam,
  startFreeLesson,
} from '../src/services/freeAccessPolicy';

function allowed(decision: FreeAccessDecision) {
  if (!decision.allowed) throw new Error(decision.reason);
  return decision.state;
}

describe('regras do plano gratuito', () => {
  it('usa a data de Brasília, inclusive na virada da meia-noite', () => {
    expect(brasiliaDate(new Date('2026-11-22T02:59:59Z'))).toBe('2026-11-21');
    expect(brasiliaDate(new Date('2026-11-22T03:00:00Z'))).toBe('2026-11-22');
  });

  it('permite continuar um ciclo e repetir conteúdo, mas não iniciar outro no mesmo dia', () => {
    const day1 = '2026-11-22';
    const day2 = '2026-11-23';
    let state = initialFreeAccessState();
    for (const lesson of [1, 2, 3]) {
      state = allowed(startFreeLesson(state, lesson, day1));
      state = allowed(completeFreeLesson(state, lesson, day1));
    }
    expect(startFreeLesson(state, 4, day1).allowed).toBe(false);
    expect(startFreeLesson(state, 1, day1).allowed).toBe(true);
    state = allowed(startFreeLesson(state, 4, day2));
    expect(state.activeCycle).toBe('1-cycle-2');
  });

  it('retomar um ciclo incompleto em outro dia conta como ciclo desse dia', () => {
    let state = initialFreeAccessState();
    state = allowed(startFreeLesson(state, 1, '2026-11-22'));
    state = allowed(completeFreeLesson(state, 1, '2026-11-22'));
    state = allowed(startFreeLesson(state, 2, '2026-11-23'));
    state = allowed(completeFreeLesson(state, 2, '2026-11-23'));
    state = allowed(startFreeLesson(state, 3, '2026-11-23'));
    state = allowed(completeFreeLesson(state, 3, '2026-11-23'));
    expect(startFreeLesson(state, 4, '2026-11-23').allowed).toBe(false);
    expect(startFreeLesson(state, 4, '2026-11-24').allowed).toBe(true);
  });

  it('trata banco, prática e exame como um ciclo, com novas tentativas no mesmo dia', () => {
    let state = initialFreeAccessState();
    for (const [lesson, day] of [
      [1, '2026-11-22'], [2, '2026-11-22'], [3, '2026-11-22'],
      [4, '2026-11-23'], [5, '2026-11-23'], [6, '2026-11-23'],
      [7, '2026-11-24'], [8, '2026-11-24'], [9, '2026-11-24'],
    ] as const) {
      state = allowed(startFreeLesson(state, lesson, day));
      state = allowed(completeFreeLesson(state, lesson, day));
    }
    expect(startFreeLesson(state, 10, '2026-11-24').allowed).toBe(false);
    state = allowed(startFreeLesson(state, 10, '2026-11-25'));
    state = allowed(completeFreeLesson(state, 10, '2026-11-25'));
    state = allowed(startFreeLesson(state, 11, '2026-11-25'));
    state = allowed(completeFreeLesson(state, 11, '2026-11-25'));
    state = allowed(startFreeExam(state, 1, '2026-11-25'));
    state = allowed(completeFreeExam(state, 1, 6, '2026-11-25'));
    expect(startFreeLesson(state, 1, '2026-11-25').allowed).toBe(true);
    state = allowed(startFreeExam(state, 1, '2026-11-25'));
    state = allowed(completeFreeExam(state, 1, 7, '2026-11-25'));
    expect(state.passedBlocks).toEqual([1]);
    expect(state.activeCycle).toBeNull();
    expect(state.lastCycleDate).toBe('2026-11-25');
    expect(startFreeLesson(state, 13, '2026-11-26').allowed).toBe(false);
    expect(startFreeExam(state, 11, '2026-11-26').allowed).toBe(false);
  });

  it('não aceita conclusão sem iniciar ou resultado fora de 0 a 10', () => {
    const state = initialFreeAccessState();
    expect(completeFreeLesson(state, 1, '2026-11-22').allowed).toBe(false);
    expect(completeFreeExam(state, 1, 8, '2026-11-22').allowed).toBe(false);
    expect(completeFreeExam(state, 1, 11, '2026-11-22').allowed).toBe(false);
  });
});
