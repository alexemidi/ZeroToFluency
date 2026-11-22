import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import { BLOCK_ONE_LESSONS } from '../src/data/blockOneLessons';
import { INITIAL_STUDY_DAYS } from '../src/data/curriculumData';
import { drawBlockTestQuestions, evaluateBlockTestResponse } from '../src/data/blockTestsData';
import { storageService } from '../src/services/storageService';

const block = readFileSync('roteiro_a1_v2.md', 'utf8').split('# BLOCO 1 —')[1].split('# BLOCO 2 —')[0];

describe('Bloco 1 no site', () => {
  it('reproduz os cards, anotações e sequência do roteiro', () => {
    expect(BLOCK_ONE_LESSONS.map((lesson) => lesson.dayNumber)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    for (const lesson of BLOCK_ONE_LESSONS) {
      const heading = new RegExp(`^#{3,4} Lição ${lesson.dayNumber}(?:-BF)? —.*$`, 'm').exec(block)!;
      const start = heading.index + heading[0].length;
      const next = block.slice(start).search(/^#{3,4} Lição \d+|^### Encerramento/m);
      const section = block.slice(start, next < 0 ? undefined : start + next);
      const lines = section.split('\n').filter((line) => /^\d+\. /.test(line));
      expect(lesson.cards).toHaveLength(lines.length);
      lines.forEach((line, index) => {
        const card = lesson.cards[index];
        const annotated = /^\d+\. `\[(Palavra|Frase|Gramática)\]` \*\*(.+?)\*\*(?: — (.*))?$/.exec(line);
        const text = /^\d+\. (.+?) — (.+)$/.exec(line);
        expect(card.english).toBe(annotated ? annotated[2] : text![1]);
        if (card.type !== 'grammar') {
          expect(card.portuguese).toBe((annotated ? annotated[3] : text![2]).replace(/\s*`\[Ver [^`]+\]`/g, ''));
          expect(card.wordHelp?.english).toBe(/`\[Ver palavra: (.+?)\]`/.exec(line)?.[1]);
          expect(Boolean(card.thirdPersonHelp)).toBe(line.includes('[Ver terceira pessoa: is'));
        }
      });
      expect(lesson.cards.filter((card) => card.type === 'grammar')).toHaveLength(
        [1, 2, 4, 5, 7, 8].includes(lesson.dayNumber) ? 1 : 0
      );
    }
    expect(INITIAL_STUDY_DAYS.find((lesson) => lesson.dayNumber === 12)).toBeUndefined();
    expect(INITIAL_STUDY_DAYS.find((lesson) => lesson.dayNumber === 13)?.blockNumber).toBe(2);
  });

  it('sorteia cinco frases estudadas e cinco inéditas em quatro formatos sem repetir frases', () => {
    const known = new Set(BLOCK_ONE_LESSONS.flatMap((lesson) => lesson.cards)
      .filter((card) => card.type === 'phrase').map((card) => card.english));
    const appendix = new Set([...block.split('#### Lição 12 —')[1].matchAll(/^\d+\. (.+?) —/gm)].map((match) => match[1]));
    for (let attempt = 0; attempt < 30; attempt++) {
      const questions = drawBlockTestQuestions(1);
      expect(questions).toHaveLength(10);
      expect(new Set(questions.map((question) => question.audioText)).size).toBe(10);
      expect(questions.filter((question) => known.has(question.audioText!))).toHaveLength(5);
      expect(questions.filter((question) => appendix.has(question.audioText!))).toHaveLength(5);
      for (const skill of ['listening_writing', 'listening_translation', 'reading_speaking', 'reading_translation']) {
        expect(questions.filter((question) => question.skill === skill).length).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it('não aceita a frase em inglês como tradução em português', () => {
    const question = {
      id: 'translation', blockNumber: 1, qNum: 1, skill: 'reading_translation' as const,
      prompt: 'Traduza', audioText: 'I am ready.', acceptedAnswers: ['Eu estou pronto.'],
    };
    expect(evaluateBlockTestResponse(question, 'I am ready.').isCorrect).toBe(false);
    expect(evaluateBlockTestResponse(question, 'Eu estou pronto.').isCorrect).toBe(true);
  });

  it('migra a trilha antiga, preserva cards personalizados e reinicia apenas dados de progresso', () => {
    const values = new Map<string, string>();
    const localStorage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => { values.set(key, value); },
      removeItem: (key: string) => { values.delete(key); },
    };
    vi.stubGlobal('localStorage', localStorage);
    const old = {
      ...INITIAL_STUDY_DAYS[0],
      cards: [
        { ...INITIAL_STUDY_DAYS[0].cards[0], id: 'day-1-card-1-a1v2', english: 'antigo' },
        { ...INITIAL_STUDY_DAYS[0].cards[0], id: 'custom-1', isCustom: true, english: 'personalizado' },
      ],
    };
    const oldSecond = { ...INITIAL_STUDY_DAYS.find((day) => day.dayNumber === 13)!, dayNumber: 11 };
    localStorage.setItem('ztf_study_days', JSON.stringify([old, oldSecond]));
    localStorage.setItem('ztf_srs_progress', '{"aluno":{}}');
    localStorage.setItem('ztf_custom_cards', '[{"id":"personal"}]');
    const migrated = storageService.getStudyDays();
    expect(migrated.find((day) => day.dayNumber === 1)?.cards.some((card) => card.id === 'custom-1')).toBe(true);
    expect(migrated.find((day) => day.dayNumber === 13)?.blockNumber).toBe(2);
    expect(localStorage.getItem('ztf_srs_progress')).toBeNull();
    expect(localStorage.getItem('ztf_custom_cards')).toBe('[{"id":"personal"}]');
    expect(storageService.getStudyDays()).toEqual(migrated);
    vi.unstubAllGlobals();
  });
});
