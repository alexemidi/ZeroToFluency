import { describe, expect, it } from 'vitest';
import { PUBLISHED_A1_BLOCKS, isPublishedA1Block, isPublishedLesson, publishedLessons } from '../src/data/courseAvailability';
import { INITIAL_STUDY_DAYS } from '../src/data/curriculumData';

describe('publicação do novo roteiro', () => {
  it('expõe somente blocos já migrados para alunos', () => {
    expect(PUBLISHED_A1_BLOCKS).toEqual([1, 2, 3]);
    const available = publishedLessons(INITIAL_STUDY_DAYS);
    expect(available).not.toHaveLength(0);
    expect(available.every(isPublishedLesson)).toBe(true);
    expect(available.every((lesson) => lesson.blockNumber !== undefined && [1, 2, 3].includes(lesson.blockNumber))).toBe(true);
    expect(isPublishedA1Block(2)).toBe(true);
    expect(isPublishedA1Block(3)).toBe(true);
  });
});
