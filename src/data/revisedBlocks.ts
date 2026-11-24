import roteiroA1 from '../../roteiro_a1_v2.md?raw';
import { Flashcard, FlashcardType, StudyDayLesson } from '../types';

type AppendixPhrase = [english: string, portuguese: string];

const stripNotes = (text: string): string => text
  .replace(/\s*`\[Ver [^\]]+\]`/g, '')
  .replace(/\*\*/g, '')
  .trim();

function blockText(blockNumber: number): string {
  const marker = `# BLOCO ${blockNumber} \u2014`;
  const start = roteiroA1.indexOf(marker);
  const next = roteiroA1.indexOf(`# BLOCO ${blockNumber + 1} \u2014`, start + 1);
  return start < 0 ? '' : roteiroA1.slice(start, next < 0 ? undefined : next);
}

function parseCard(line: string, dayNumber: number, orderInDay: number): Flashcard | null {
  const content = line.replace(/^\d+\.\s*/, '');
  const annotated = /^`\[(Palavra|Frase|Gram\u00e1tica)\]` \*\*(.+?)\*\*(?: \u2014 (.+))?$/.exec(content);
  const spoken = /^(?:(.+?):\s+)?(.+?) \u2014 (.+)$/.exec(content);
  if (!annotated && !spoken) return null;

  const type = annotated
    ? ({ Palavra: 'word', Frase: 'phrase', Gram\u00e1tica: 'grammar' } as Record<string, FlashcardType>)[annotated[1]]
    : (spoken![1] ? 'dialogue' : 'phrase');
  const english = annotated ? annotated[2] : spoken![2];
  const rawPortuguese = annotated ? annotated[3] ?? '' : spoken![3];
  const wordHelp = /`\[Ver palavra: (.+?)\]`/.exec(rawPortuguese)?.[1];
  const thirdPerson = /`\[Ver terceira pessoa: (.+?) \u2192 (.+?) \u2014 (.+?)\]`/.exec(rawPortuguese);

  return {
    id: `day-${dayNumber}-card-${orderInDay}-revised`,
    tenantId: 'default-teacher-tenant', dayNumber, orderInDay, type, english,
    portuguese: type === 'grammar' ? '' : stripNotes(rawPortuguese),
    dialogueSpeaker: !annotated ? spoken![1] : undefined,
    wordHelp: wordHelp ? { english: wordHelp, portuguese: '' } : undefined,
    thirdPersonHelp: thirdPerson
      ? { english: thirdPerson[1], base: thirdPerson[2], explanation: thirdPerson[3] }
      : undefined,
  };
}

function parseRevisedBlock(blockNumber: number): StudyDayLesson[] {
  const text = blockText(blockNumber);
  const headings = [...text.matchAll(/^#{3,4} Li\u00e7\u00e3o (\d+)(?:-BF)? \u2014 (.+)$/gm)];
  return headings.flatMap((heading, index) => {
    const dayNumber = Number(heading[1]);
    const titleSuffix = heading[2];
    const start = (heading.index ?? 0) + heading[0].length;
    const end = index + 1 < headings.length ? headings[index + 1].index : text.length;
    const section = text.slice(start, end);
    if (/exame:/i.test(titleSuffix)) return [];

    const cards = section.split('\n').filter((line) => /^\d+\.\s/.test(line))
      .map((line, cardIndex) => parseCard(line, dayNumber, cardIndex + 1))
      .filter((card): card is Flashcard => card !== null);
    const grammarCard = cards.find((card) => card.type === 'grammar');
    if (grammarCard) {
      const explanation = section.split('\n').filter((line) => /^\s*>/.test(line))
        .map((line) => stripNotes(line.replace(/^\s*>\s?/, ''))).join(' ');
      grammarCard.grammarRule = { title: grammarCard.english, explanation, examples: [] };
    }
    const subtitle = /^\*(.+)\*$/m.exec(section)?.[1] ?? '';
    const grammarFocus = /\*\*Foco\*\*:\s*(.+)/.exec(section)?.[1] ?? subtitle;
    return [{
      dayNumber, weekNumber: Math.ceil(dayNumber / 7), blockNumber, cefrLevel: 'A1',
      title: `Li\u00e7\u00e3o ${dayNumber}${titleSuffix.startsWith('banco') ? '-BF' : ''} \u2014 ${titleSuffix}`,
      subtitle, grammarFocus,
      isDialogueDay: /di\u00e1logo/i.test(titleSuffix), isReviewLesson: /fixa\u00e7\u00e3o/i.test(titleSuffix), cards,
    }];
  });
}

function parseAppendix(blockNumber: number): AppendixPhrase[] {
  const text = blockText(blockNumber);
  const section = text.match(/#{3,4} Li\u00e7\u00e3o \d+ \u2014 exame:[\s\S]*?(?=\n#|$)/i)?.[0] ?? '';
  return section.split('\n').flatMap((line) => {
    const match = /^\d+\.\s*(.+?) \u2014 (.+)$/.exec(line);
    return match ? [[match[1], stripNotes(match[2])] as AppendixPhrase] : [];
  });
}

export const BLOCK_TWO_LESSONS = parseRevisedBlock(2);
export const BLOCK_THREE_LESSONS = parseRevisedBlock(3);
export const REVISED_BLOCK_APPENDICES: Record<number, AppendixPhrase[]> = {
  2: parseAppendix(2),
  3: parseAppendix(3),
};
