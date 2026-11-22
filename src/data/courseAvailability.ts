import { StudyDayLesson } from '../types';

/**
 * Registro editorial do conteúdo que já foi migrado e conferido no site.
 *
 * Não derive disponibilidade de `weekNumber` nem de uma quantidade fixa de
 * lições: a numeração muda enquanto o roteiro é reorganizado. Ao publicar um
 * bloco novo, inclua seu número aqui somente depois de seus cards, fechamento
 * e exame estarem implementados e validados no aplicativo.
 */
export const PUBLISHED_A1_BLOCKS = [1] as const;

export function isPublishedA1Block(blockNumber: number | undefined): boolean {
  return blockNumber !== undefined && PUBLISHED_A1_BLOCKS.includes(blockNumber as 1);
}

export function isPublishedLesson(lesson: StudyDayLesson): boolean {
  return lesson.cefrLevel === 'A1' && isPublishedA1Block(lesson.blockNumber);
}

export function publishedLessons(lessons: StudyDayLesson[]): StudyDayLesson[] {
  return lessons.filter(isPublishedLesson);
}

export function publishedBlockCountLabel(): string {
  return `${PUBLISHED_A1_BLOCKS.length} bloco revisado disponível`;
}
