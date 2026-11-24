import { describe, expect, it } from 'vitest';
import { drawBlockTestQuestions } from '../src/data/blockTestsData';
import { BLOCK_THREE_LESSONS, BLOCK_TWO_LESSONS, REVISED_BLOCK_APPENDICES } from '../src/data/revisedBlocks';

describe('blocos 2 e 3 revisados', () => {
  it('inclui os ciclos, banco de frases e fechamento previstos no roteiro', () => {
    expect(BLOCK_TWO_LESSONS.map((lesson) => lesson.dayNumber)).toEqual([13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]);
    expect(BLOCK_THREE_LESSONS.map((lesson) => lesson.dayNumber)).toEqual([25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35]);
    expect(BLOCK_TWO_LESSONS.find((lesson) => lesson.dayNumber === 22)?.cards.length).toBeGreaterThan(0);
    expect(BLOCK_THREE_LESSONS.find((lesson) => lesson.dayNumber === 34)?.cards.length).toBeGreaterThan(0);
    expect(BLOCK_TWO_LESSONS.find((lesson) => lesson.dayNumber === 23)?.isDialogueDay).toBe(true);
    expect(BLOCK_THREE_LESSONS.find((lesson) => lesson.dayNumber === 35)?.cards.length).toBeGreaterThan(0);
    expect(REVISED_BLOCK_APPENDICES[2]).toHaveLength(10);
    expect(REVISED_BLOCK_APPENDICES[3]).toHaveLength(10);
  });

  it('sorteia cinco frases estudadas e cinco inéditas nos quatro formatos', () => {
    for (const [blockNumber, lessons] of [[2, BLOCK_TWO_LESSONS], [3, BLOCK_THREE_LESSONS]] as const) {
      const known = new Set(lessons.flatMap((lesson) => lesson.cards)
        .filter((card) => card.type === 'phrase' || card.type === 'dialogue').map((card) => card.english));
      const appendix = new Set(REVISED_BLOCK_APPENDICES[blockNumber].map(([english]) => english));
      const questions = drawBlockTestQuestions(blockNumber);
      expect(questions).toHaveLength(10);
      expect(questions.filter((question) => known.has(question.audioText!))).toHaveLength(5);
      expect(questions.filter((question) => appendix.has(question.audioText!))).toHaveLength(5);
      for (const skill of ['listening_writing', 'listening_translation', 'reading_speaking', 'reading_translation']) {
        expect(questions.filter((question) => question.skill === skill).length).toBeGreaterThanOrEqual(2);
      }
    }
  });
});
