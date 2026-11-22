import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  createInitialSrsProgress,
  applySrsRating,
  addDaysToIsoDate,
} from '../src/services/srsEngine';
import {
  evaluateLetterCorrespondence,
  buildWordByWordCorrespondence,
  normalizeText,
} from '../src/services/letterMatcher';
import {
  INITIAL_STUDY_DAYS,
  GRAMMAR_ROADMAP_100_DAYS,
  CEFR_CURRICULUM_PLAN_A1_TO_C2,
} from '../src/data/curriculumData';
import {
  BLOCK_TESTS_MAP,
  drawBlockTestQuestions,
  evaluateBlockTestResponse,
} from '../src/data/blockTestsData';
import { storageService } from '../src/services/storageService';
import { prepareEnglishTextForSpeech } from '../src/services/audioService';

const expandCurriculumContractions = (text: string) =>
  text.replace(/\bi'm\b/gi, 'i am').replace(/\bdidn't\b/gi, 'did not');

describe('Algoritmo de Repetição Espaçada (SRS com 3 botões: Errei, Ok, Aprendido e Load Balancing)', () => {
  it('deve agendar a revisão para o DIA SEGUINTE (1 dia) quando o aluno marca "Aprendido" já na 1ª vez, sem repetir no mesmo dia', () => {
    const today = '2026-11-06';
    const tomorrow = addDaysToIsoDate(today, 1);
    const counts: Record<string, number> = {};
    const initial = createInitialSrsProgress('card-1', 'aluno@gmail.com', 'tenant', today);

    const afterLearned = applySrsRating(initial, 'good', today, counts, 0);
    expect(afterLearned.stage).toBe('graduated');
    expect(afterLearned.intervalDays).toBe(1);
    expect(afterLearned.nextReviewDateIso).toBe(tomorrow);
  });

  it('deve revisar NO MESMO DIA na 1ª vez que o aluno marca "Ok" (hard), e agendar para o dia seguinte na 2ª passagem', () => {
    const today = '2026-11-06';
    const tomorrow = addDaysToIsoDate(today, 1);
    const counts: Record<string, number> = {};
    const initial = createInitialSrsProgress('card-ok', 'aluno@gmail.com', 'tenant', today);

    // 1ª vez marcando "Ok" -> fica no mesmo dia (intervalDays = 0, first_pass)
    const pass1Ok = applySrsRating(initial, 'hard', today, counts, 0);
    expect(pass1Ok.stage).toBe('first_pass');
    expect(pass1Ok.intervalDays).toBe(0);
    expect(pass1Ok.nextReviewDateIso).toBe(today);

    // 2ª passagem no mesmo dia marcando "Ok" -> vai para o dia seguinte (1 dia)
    const pass2Ok = applySrsRating(pass1Ok, 'hard', today, counts, 0);
    expect(pass2Ok.stage).toBe('graduated');
    expect(pass2Ok.intervalDays).toBe(1);
    expect(pass2Ok.nextReviewDateIso).toBe(tomorrow);
  });

  it('deve distribuir 10 flashcards já graduados (1d) entre 3, 4 e 5 dias na revisão do dia seguinte com "Aprendido"', () => {
    const today = '2026-11-06';
    const counts: Record<string, number> = {};

    for (let i = 0; i < 10; i++) {
      const initial = createInitialSrsProgress(`card-${i}`, 'aluno@gmail.com', 'tenant', today);
      const day1Graduated = applySrsRating(initial, 'good', today, counts, i);
      expect(day1Graduated.intervalDays).toBe(1);

      const nextReview = applySrsRating(day1Graduated, 'good', today, counts, i);
      expect(nextReview.stage).toBe('graduated');
      expect([3, 4, 5]).toContain(nextReview.intervalDays);
    }

    const day3 = addDaysToIsoDate(today, 3);
    const day4 = addDaysToIsoDate(today, 4);
    const day5 = addDaysToIsoDate(today, 5);

    expect(counts[day3]).toBeLessThanOrEqual(4);
    expect(counts[day4]).toBeLessThanOrEqual(4);
    expect(counts[day5]).toBeLessThanOrEqual(4);
    expect((counts[day3] ?? 0) + (counts[day4] ?? 0) + (counts[day5] ?? 0)).toBe(10);
  });
});

describe('Pronúncia Fonética de Palavras Isoladas no Áudio (Web Speech API)', () => {
  it('deve converter "An" isolado para "ann." para que o sintetizador pronuncie claramente a consoante final /n/', () => {
    expect(prepareEnglishTextForSpeech('An')).toBe('ann.');
    expect(prepareEnglishTextForSpeech('an')).toBe('ann.');
    expect(prepareEnglishTextForSpeech('An apple.')).toBe('An apple.');
  });
});

describe('Correspondência por Palavra Inteira + Sinônimos + Deduplicação de Palavras na Gramática', () => {
  it('deve marcar "the" em um único bloco verde contínuo sem separar letra por letra em caixas', () => {
    const res = evaluateLetterCorrespondence('the', 'The');
    expect(res.isSubmitted).toBe(true);
    expect(res.accuracyPercent).toBe(100);
    expect(res.userSegments).toEqual([{ text: 'the', status: 'correct' }]);
  });

  it('deve marcar a palavra inteira como errada ("ele" vs "ela", "casado" vs "casada") e aceitar "de novo" como equivalente a "novamente"', () => {
    const userTyped = 'e agora ele é casado de novo';
    const target = 'e agora ela era casada novamente.';

    const diff = evaluateLetterCorrespondence(userTyped, target);

    expect(diff.userSegments[0]).toEqual({ text: 'e agora', status: 'correct' });
    expect(diff.userSegments[1]).toEqual({ text: 'ele é casado', status: 'wrong' });
    expect(diff.userSegments[2]).toEqual({ text: 'de novo', status: 'correct' });
  });

  it('deve inserir traços "-----" quando faltar uma palavra na resposta do aluno', () => {
    const userTyped = 'seu primeiro marido tinha morrido,';
    const target = 'o primeiro marido dela tinha morrido,';

    const diff = evaluateLetterCorrespondence(userTyped, target);

    expect(diff.userSegments[0]).toEqual({ text: 'seu', status: 'wrong' });
    expect(diff.userSegments[1]).toEqual({ text: 'primeiro marido', status: 'correct' });
    expect(diff.userSegments[2].status).toBe('missing');
    expect(diff.userSegments[2].text).toContain('----');
    expect(diff.targetSegments[2]).toEqual({ text: 'dela', status: 'missing' });
    expect(diff.userSegments[3]).toEqual({ text: 'tinha morrido', status: 'correct' });
  });

  it('deve aceitar múltiplas traduções válidas separadas por espaço ("o a" ou "o a os as") para "O / A / Os / As" sem cobrar a barra "/"', () => {
    const twoVariants = evaluateLetterCorrespondence('o a', 'O / A / Os / As');
    expect(twoVariants.accuracyPercent).toBe(100);
    expect(twoVariants.userSegments).toEqual([{ text: 'o a', status: 'correct' }]);

    const allFourVariants = evaluateLetterCorrespondence('o a os as', 'O / A / Os / As');
    expect(allFourVariants.accuracyPercent).toBe(100);
    expect(allFourVariants.userSegments).toEqual([{ text: 'o a os as', status: 'correct' }]);
  });

  it('não deve repetir palavras iguais na explicação da frase ("The boy and the girl." deve listar "The" apenas uma vez)', () => {
    const mapping = buildWordByWordCorrespondence(
      'The boy and the girl.',
      'O menino e a menina.'
    );
    const wordsListed = mapping.map((m) => m.englishWord.toLowerCase());
    expect(wordsListed).toEqual(['the', 'boy', 'and', 'girl']);
  });

  it('deve tratar palavras compostas ("Living room", "You guys") como uma única unidade na explicação da frase', () => {
    const mapping = buildWordByWordCorrespondence(
      'We are in the living room.',
      'Nós estamos na sala de estar.'
    );
    const wordsListed = mapping.map((m) => m.englishWord.toLowerCase());
    expect(wordsListed).toEqual(['we', 'are', 'in', 'the', 'living room']);
    const livingRoomEntry = mapping.find((m) => m.englishWord.toLowerCase() === 'living room');
    expect(livingRoomEntry?.portugueseEquivalent).toContain('sala de estar');
  });
});

describe('Currículo Construtivo i+1 (Sem Palavras Auxiliares Desconhecidas), Lições 1–7 Exatas e Plano CEFR A1–C2 (10.000 Palavras)', () => {
  it('mantém títulos e sequência dos cards das lições 1 a 9 iguais ao roteiro revisado', () => {
    const plan = readFileSync('roteiro_a1_v2.md', 'utf8');
    for (let number = 1; number <= 9; number++) {
      const heading = new RegExp(`^### Lição ${number} — (.+)$`, 'm').exec(plan)!;
      const start = heading.index + heading[0].length;
      const end = plan.slice(start).search(/^### |^# BLOCO /m);
      const section = plan.slice(start, end < 0 ? undefined : start + end);
      const expected = [...section.matchAll(/^\d+\. `\[(Palavra|Frase|Diálogo|Gramática)\]` \*\*(.+?)\*\*(?: — (.+?))?$/gm)]
        .map((match) => ({
          type: { Palavra: 'word', Frase: 'phrase', Diálogo: 'dialogue', Gramática: 'grammar' }[match[1]],
          english: match[2],
          portuguese: (match[3] || '').replace(/\s+`\[Ver [^`]+\]`/g, ''),
        }));
      const lesson = INITIAL_STUDY_DAYS.find((item) => item.dayNumber === number)!;
      expect(lesson.title).toBe(`Lição ${number} — ${heading[1]}`);
      expect(lesson.cards.map(({ type, english, portuguese }) => ({
        type,
        english,
        portuguese: type === 'grammar' ? '' : portuguese,
      }))).toEqual(expected);
    }
  });
  it('deve conter os 10 módulos do Mapa Gramatical de 100 Dias e os 6 níveis CEFR (A1 a C2) somando 10.000 palavras e 1.000 dias de estudo', () => {
    expect(GRAMMAR_ROADMAP_100_DAYS).toHaveLength(10);
    expect(CEFR_CURRICULUM_PLAN_A1_TO_C2).toHaveLength(6);
    const lastLevel = CEFR_CURRICULUM_PLAN_A1_TO_C2[CEFR_CURRICULUM_PLAN_A1_TO_C2.length - 1];
    expect(lastLevel.level).toBe('C2');
    expect(lastLevel.cumulativeWords).toBe(10000);
    expect(lastLevel.cumulativeStudyDays).toBe(1000);
  });

  it('deve garantir que nenhum card em todo o curso tenha barra "/" no campo em inglês (para nunca ser lida em voz alta pelo sintetizador)', () => {
    for (const lesson of INITIAL_STUDY_DAYS) {
      for (const card of lesson.cards) {
        expect(card.english.includes('/')).toBe(false);
      }
    }
  });

  it('deve manter as lições revisadas e preservar os rascunhos posteriores', () => {
    const lesson8 = INITIAL_STUDY_DAYS.find((d) => d.dayNumber === 8)!;
    expect(lesson8.cards.map((c) => c.english)).toContain('In');
    expect(lesson8.cards.map((c) => c.english)).toContain('I am in the school.');
    expect(lesson8.cards.map((c) => c.english)).toContain('You are in the cafeteria.');

    const lesson24 = INITIAL_STUDY_DAYS.find((d) => d.dayNumber === 26)!;
    expect(lesson24.cards.map((c) => c.english)).toContain('Living room');
    expect(lesson24.cards.map((c) => c.english)).toContain('My father is in the living room.');
  });

  it('deve seguir a sequência revisada da lição 1', () => {
    const day1 = INITIAL_STUDY_DAYS.find((d) => d.dayNumber === 1)!;
    expect(day1).toBeDefined();
    expect(day1.cards.slice(0, 10).map((c) => c.english)).toEqual([
      'The',
      'Pencil',
      'The pencil.',
      'Pen',
      'The pen.',
      'And',
      'The pencil and the pen.',
      'Boy',
      'The boy.',
      'Girl',
    ]);
    expect(day1.cards[11].type).toBe('grammar');
  });

  it('não adiciona explicações gramaticais às lições revisadas de fixação', () => {
    for (const number of [3, 6, 9]) {
      const lesson = INITIAL_STUDY_DAYS.find((day) => day.dayNumber === number)!;
      expect(lesson.isReviewLesson).toBe(true);
      expect(lesson.cards.every((card) => card.type === 'phrase' && !card.grammarRule)).toBe(true);
    }
  });

  it('apresenta todos os pronomes antes das preposições e os usa com To Be na lição 8', () => {
    const lessons = INITIAL_STUDY_DAYS.slice(3, 8);
    const beforePrepositions = lessons.slice(0, 4).flatMap((lesson) => lesson.cards)
      .filter((card) => card.type !== 'grammar');
    expect(beforePrepositions.some((card) => /\b(in|on|under)\b/i.test(card.english))).toBe(false);
    const words = beforePrepositions.filter((card) => card.type === 'word')
      .map((card) => card.english.toLowerCase());
    expect(words).toEqual(expect.arrayContaining(['i', 'you', 'he', 'she', 'it', 'we', 'they']));
    const sentences = lessons[4].cards.filter((card) => card.type === 'phrase')
      .map((card) => card.english.toLowerCase());
    for (const prefix of ['i am', 'you are', 'they are']) {
      expect(sentences.some((sentence) => sentence.startsWith(`${prefix} `))).toBe(true);
    }
    expect(sentences.some((sentence) => sentence.includes(' is '))).toBe(true);
  });

  it('não repete nos exames dos blocos 1 a 13 frases estudadas anteriormente no roteiro', () => {
    const plan = readFileSync('roteiro_a1_v2.md', 'utf8');
    const activePlan = plan.replace(/<details>[\s\S]*?<\/details>/g, '');
    const blocks = [
      activePlan.split('# BLOCO 1 —')[1].split('# BLOCO 2 —')[0],
      activePlan.split('# BLOCO 2 —')[1].split('# BLOCO 3 —')[0],
      activePlan.split('# BLOCO 3 —')[1].split('# BLOCO 4 —')[0],
      activePlan.split('# BLOCO 4 —')[1].split('# BLOCO 5 —')[0],
      activePlan.split('# BLOCO 5 —')[1].split('# BLOCO 6 —')[0],
      activePlan.split('# BLOCO 6 —')[1].split('# BLOCO 7 —')[0],
      activePlan.split('# BLOCO 7 —')[1].split('# BLOCO 8 —')[0],
      activePlan.split('# BLOCO 8 —')[1].split('# BLOCO 9 —')[0],
      activePlan.split('# BLOCO 9 —')[1].split('# BLOCO 10 —')[0],
      activePlan.split('# BLOCO 10 —')[1].split('# BLOCO 11 —')[0],
      activePlan.split('# BLOCO 11 —')[1].split('# BLOCO 12 —')[0],
      activePlan.split('# BLOCO 12 —')[1].split('# BLOCO 13 —')[0],
      activePlan.split('# BLOCO 13 —')[1].split('# BLOCO 14 —')[0],
    ];
    const studied = new Set<string>();
    const contractions: Record<string, string> = {
      "i'm": 'i am',
      "you're": 'you are',
      "he's": 'he is',
      "she's": 'she is',
      "it's": 'it is',
      "we're": 'we are',
      "they're": 'they are',
      "isn't": 'is not',
      "aren't": 'are not',
      "can't": 'cannot',
      "don't": 'do not',
      "doesn't": 'does not',
      "didn't": 'did not',
    };

    for (const [index, block] of blocks.entries()) {
      const examHeading = `#### Lição ${[12, 24, 36, 48, 60, 75, 87, 99, 111, 123, 135, 147, 159][index]} — exame: apêndice de frases inéditas`;
      const [lessons, exam] = block.split(examHeading);
      expect(exam).toBeDefined();
      const sentenceParts = (text: string) =>
        (text.match(/[^.!?]+[.!?]/g) || []).map((sentence) =>
          sentence.trim().toLowerCase()
            .replace(/’/g, "'")
            .replace(/\b(?:i'm|you're|he's|she's|it's|we're|they're|isn't|aren't|can't|don't|doesn't|didn't)\b/g, (word) => contractions[word])
            .replace(/[.!?]+$/, '')
        );

      for (const line of lessons.split('\n')) {
        const content = /^\d+\. (?:`\[Frase\]` \*\*(.+?)\*\*|(?:Recepcionista|Hóspede|Mãe|Filha): (.+?) —|(.+?) —)/.exec(line);
        if (content) sentenceParts(content[1] || content[2] || content[3]).forEach((sentence) => studied.add(sentence));
        for (const example of line.matchAll(/\*\*([^*]+[.!?])\*\*/g)) {
          sentenceParts(example[1]).forEach((sentence) => studied.add(sentence));
        }
      }

      const unseen = [...exam.matchAll(/^\d+\. (.+?) —/gm)]
        .flatMap((match) => sentenceParts(match[1]));
      expect(unseen).toHaveLength(10);
      expect(new Set(unseen).size).toBe(10);
      expect(unseen.filter((sentence) => studied.has(sentence))).toEqual([]);
    }
  });

  it('usa nas descrições e nas histórias apenas vocabulário apresentado até cada texto', () => {
    const plan = readFileSync('roteiro_a1_v2.md', 'utf8').replace(/<details>[\s\S]*?<\/details>/g, '');
    for (const number of [11, 35, 47, 59, 86, 98, 110, 122, 134, 146, 158]) {
      const start = plan.indexOf(`#### Lição ${number} — ${number >= 122 ? 'história' : 'descrição'}:`);
      expect(start).toBeGreaterThan(-1);
      const before = plan.slice(0, start);
      const description = plan.slice(start).split(/^#### Lição /m)[1];
      const known = new Set<string>();
      const addKnown = (entry: string) => {
        for (const token of entry.toLowerCase().match(/[a-z]+/g) || []) {
          known.add(token);
          if (number >= 110) {
            known.add(`${token}ing`);
            if (token.endsWith('e')) known.add(`${token.slice(0, -1)}ing`);
            if (/[^aeiou][aeiou][^aeiouwxy]$/.test(token)) known.add(`${token}${token.slice(-1)}ing`);
          }
          if (number >= 122) {
            known.add(`${token}ed`);
            if (token.endsWith('e')) known.add(`${token}d`);
            if (/[^aeiou]y$/.test(token)) known.add(`${token.slice(0, -1)}ied`);
            if (/[^aeiou][aeiou][^aeiouwxy]$/.test(token)) known.add(`${token}${token.slice(-1)}ed`);
          }
          if (number >= 47) {
            known.add(`${token}s`);
            if (/(s|x|ch|sh)$/.test(token)) known.add(`${token}es`);
            if (/[^aeiou]y$/.test(token)) known.add(`${token.slice(0, -1)}ies`);
          }
        }
      };
      for (const match of before.matchAll(/`\[Palavra\]` \*\*(.+?)\*\*|`\[Ver palavra: (.+?)\]`/g)) {
        addKnown(match[1] || match[2]);
      }
      for (const match of before.matchAll(/\[Ver singular: [a-z]+ → ([a-z]+)/g)) addKnown(match[1]);
      const lines = [...description.matchAll(/^\d+\. (.+?) —/gm)];
      expect(lines.length).toBeGreaterThan(0);
      expect(description).not.toContain('`[Palavra]`');
      expect(description).not.toContain('`[Ver palavra:');
      for (const line of lines) {
        const words = expandCurriculumContractions(line[1].toLowerCase())
          .replace(/\b([a-z]+)'s\b/g, '$1').match(/[a-z]+/g) || [];
        expect(words.filter((word) => !known.has(word)), line[0]).toEqual([]);
      }
    }
  });

  it('mantém progressão, contadores e recursos no bloco 13', () => {
    const plan = readFileSync('roteiro_a1_v2.md', 'utf8').replace(/<details>[\s\S]*?<\/details>/g, '');
    const before = plan.split('# BLOCO 13 —')[0];
    const block = plan.split('# BLOCO 13 —')[1].split('# BLOCO 14 —')[0];
    const introduced = (text: string) => [...text.matchAll(/`\[Palavra\]` \*\*(.+?)\*\*|`\[Ver palavra: (.+?)\]`/g)]
      .map((match) => (match[1] || match[2]).toLowerCase());
    const seen = new Set(introduced(before));
    expect(seen.size).toBe(784);
    for (let number = 148; number <= 156; number++) {
      const section = block.split(`### Lição ${number} —`)[1]?.split(/^### /m)[0];
      if (!section) throw new Error(`Lição ${number} não encontrada no bloco 13`);
      const words = introduced(section);
      expect(words).toHaveLength(6);
      expect(words.filter((word) => seen.has(word))).toEqual([]);
      expect(new Set(words).size).toBe(words.length);
      words.forEach((word) => seen.add(word));
      expect(section).toContain(`**PAL:** ${words.length}<br>`);
      expect(section).toContain(`**TPA:** ${seen.size}<br>`);
      expect(section.toLowerCase()).toContain(`**PA:** ${words.join(', ')}`.toLowerCase());
      if ([150, 153, 156].includes(number)) {
        expect(section).not.toContain('`[Gramática]`');
        expect(section).not.toContain('`[Palavra]`');
        expect(section.split('\n').filter((line) => /^\d+\. `\[Frase\]`/.test(line))).toHaveLength(6);
      } else {
        expect(section).toContain('`[Gramática]`');
        expect(section).not.toContain('`[Ver palavra:');
      }
    }

    const bank = block.split('#### Lição 157-BF —')[1].split('#### Lição 158 —')[0];
    const phrases = bank.split('\n').filter((line) => /^\d+\. `\[Frase\]`/.test(line));
    expect(phrases.length).toBeGreaterThanOrEqual(8);
    expect(phrases.length).toBeLessThanOrEqual(15);
    phrases.forEach((phrase) => expect(introduced(phrase)).toHaveLength(1));
    const bankWords = introduced(bank);
    expect(bankWords.filter((word) => seen.has(word))).toEqual([]);
    expect(new Set(bankWords).size).toBe(bankWords.length);
    expect(bank).toContain(`**PAL:** ${bankWords.length}<br>`);
    expect(bank).toContain(`**TPA:** ${seen.size + bankWords.length}<br>`);
    expect(bank.toLowerCase()).toContain(`**PA:** ${bankWords.join(', ')}`.toLowerCase());

    const vocabulary = readFileSync('vocabulario_a1.md', 'utf8');
    const entries = [...vocabulary.matchAll(/^\| (\d+) \| ([^|]+?) \| Lição [^|]+, Bloco 13 \|/gm)];
    expect(entries.map((entry) => entry[2].trim().toLowerCase())).toEqual(introduced(block));
    expect(entries.map((entry) => Number(entry[1]))).toEqual(
      Array.from({ length: 66 }, (_, index) => 785 + index)
    );

    const [study, exam] = block.split('#### Lição 159 — exame: apêndice de frases inéditas');
    expect(exam).toBeDefined();
    expect(exam).not.toMatch(/\[Ver /);
    expect(study).not.toMatch(/\[Ver terceira pessoa: [^\]]+ —/);
    const known = new Set<string>();
    const addKnown = (entry: string) => {
      for (const token of entry.toLowerCase().match(/[a-z]+/g) || []) {
        known.add(token);
        known.add(`${token}s`);
        if (/(s|x|ch|sh|o)$/.test(token)) known.add(`${token}es`);
        if (/[^aeiou]y$/.test(token)) known.add(`${token.slice(0, -1)}ies`);
        known.add(`${token}ed`);
        if (token.endsWith('e')) known.add(`${token}d`);
        if (/[^aeiou]y$/.test(token)) known.add(`${token.slice(0, -1)}ied`);
        if (/[^aeiou][aeiou][^aeiouwxy]$/.test(token)) known.add(`${token}${token.slice(-1)}ed`);
      }
    };
    introduced(before).forEach(addKnown);
    for (const match of before.matchAll(/\[Ver singular: [a-z]+ → ([a-z]+)/g)) addKnown(match[1]);
    for (const line of block.split('\n')) {
      introduced(line).forEach(addKnown);
      if (line.includes('`[Palavra]`') || line.includes('`[Gramática]`')) continue;
      const phrase = /^\d+\. (?:`\[Frase\]` \*\*(.+?)\*\*|(.+?) —)/.exec(line);
      if (!phrase) continue;
      const words = expandCurriculumContractions((phrase[1] || phrase[2]).toLowerCase())
        .replace(/\b([a-z]+)'s\b/g, '$1').match(/[a-z]+/g) || [];
      expect(words.filter((word) => !known.has(word)), line).toEqual([]);
    }
    expect(study).not.toContain('[Ver singular:');
    expect(study).not.toContain('[Ver terceira pessoa: is → be]');
    expect(study).toContain('[Ver terceira pessoa: would → would]');
  });

  it('não conta novamente os singulares de plurais regulares anteriormente apresentados', () => {
    const plan = readFileSync('roteiro_a1_v2.md', 'utf8').split('# BLOCO 14 —')[0]
      .replace(/<details>[\s\S]*?<\/details>/g, '');
    const entries = [...plan.matchAll(/`\[Palavra\]` \*\*(.+?)\*\*|`\[Ver palavra: (.+?)\]`/g)]
      .map((match) => (match[1] || match[2]).toLowerCase());
    for (const [singular, plural] of [
      ['gift', 'gifts'], ['ribbon', 'ribbons'], ['lemon', 'lemons'],
      ['dish', 'dishes'], ['bridge', 'bridges'],
    ]) {
      expect(entries.includes(singular) && entries.includes(plural), `${singular}/${plural}`).toBe(false);
    }
  });

  it('mantém progressão, contadores e recursos no bloco 12', () => {
    const plan = readFileSync('roteiro_a1_v2.md', 'utf8').replace(/<details>[\s\S]*?<\/details>/g, '');
    const before = plan.split('# BLOCO 12 —')[0];
    const block = plan.split('# BLOCO 12 —')[1].split('# BLOCO 13 —')[0];
    const introduced = (text: string) => [...text.matchAll(/`\[Palavra\]` \*\*(.+?)\*\*|`\[Ver palavra: (.+?)\]`/g)]
      .map((match) => (match[1] || match[2]).toLowerCase());
    const seen = new Set(introduced(before));
    expect(seen.size).toBe(718);
    for (let number = 136; number <= 144; number++) {
      const section = block.split(`### Lição ${number} —`)[1]?.split(/^### /m)[0];
      if (!section) throw new Error(`Lição ${number} não encontrada no bloco 12`);
      const words = introduced(section);
      expect(words).toHaveLength(6);
      expect(words.filter((word) => seen.has(word))).toEqual([]);
      expect(new Set(words).size).toBe(words.length);
      words.forEach((word) => seen.add(word));
      expect(section).toContain(`**PAL:** ${words.length}<br>`);
      expect(section).toContain(`**TPA:** ${seen.size}<br>`);
      expect(section.toLowerCase()).toContain(`**PA:** ${words.join(', ')}`.toLowerCase());
      if ([138, 141, 144].includes(number)) {
        expect(section).not.toContain('`[Gramática]`');
        expect(section).not.toContain('`[Palavra]`');
        expect(section.split('\n').filter((line) => /^\d+\. `\[Frase\]`/.test(line))).toHaveLength(6);
      } else {
        expect(section).toContain('`[Gramática]`');
        expect(section).not.toContain('`[Ver palavra:');
      }
    }

    const bank = block.split('#### Lição 145-BF —')[1].split('#### Lição 146 —')[0];
    const phrases = bank.split('\n').filter((line) => /^\d+\. `\[Frase\]`/.test(line));
    expect(phrases.length).toBeGreaterThanOrEqual(8);
    expect(phrases.length).toBeLessThanOrEqual(15);
    phrases.forEach((phrase) => expect(introduced(phrase)).toHaveLength(1));
    const bankWords = introduced(bank);
    expect(bankWords.filter((word) => seen.has(word))).toEqual([]);
    expect(new Set(bankWords).size).toBe(bankWords.length);
    expect(bank).toContain(`**PAL:** ${bankWords.length}<br>`);
    expect(bank).toContain(`**TPA:** ${seen.size + bankWords.length}<br>`);
    expect(bank.toLowerCase()).toContain(`**PA:** ${bankWords.join(', ')}`.toLowerCase());

    const vocabulary = readFileSync('vocabulario_a1.md', 'utf8');
    const entries = [...vocabulary.matchAll(/^\| (\d+) \| ([^|]+?) \| Lição [^|]+, Bloco 12 \|/gm)];
    expect(entries.map((entry) => entry[2].trim().toLowerCase())).toEqual(introduced(block));
    expect(entries.map((entry) => Number(entry[1]))).toEqual(
      Array.from({ length: 66 }, (_, index) => 719 + index)
    );

    const [study, exam] = block.split('#### Lição 147 — exame: apêndice de frases inéditas');
    expect(exam).toBeDefined();
    expect(exam).not.toMatch(/\[Ver /);
    expect(study).not.toMatch(/\[Ver terceira pessoa: [^\]]+ —/);
    const known = new Set<string>();
    const addKnown = (entry: string) => {
      for (const token of entry.toLowerCase().match(/[a-z]+/g) || []) {
        known.add(token);
        known.add(`${token}s`);
        if (/(s|x|ch|sh|o)$/.test(token)) known.add(`${token}es`);
        if (/[^aeiou]y$/.test(token)) known.add(`${token.slice(0, -1)}ies`);
        known.add(`${token}ed`);
        if (token.endsWith('e')) known.add(`${token}d`);
        if (/[^aeiou]y$/.test(token)) known.add(`${token.slice(0, -1)}ied`);
        if (/[^aeiou][aeiou][^aeiouwxy]$/.test(token)) known.add(`${token}${token.slice(-1)}ed`);
      }
    };
    introduced(before).forEach(addKnown);
    for (const match of before.matchAll(/\[Ver singular: [a-z]+ → ([a-z]+)/g)) addKnown(match[1]);
    for (const line of block.split('\n')) {
      introduced(line).forEach(addKnown);
      if (line.includes('`[Palavra]`') || line.includes('`[Gramática]`')) continue;
      const phrase = /^\d+\. (?:`\[Frase\]` \*\*(.+?)\*\*|(.+?) —)/.exec(line);
      if (!phrase) continue;
      const words = expandCurriculumContractions((phrase[1] || phrase[2]).toLowerCase())
        .replace(/\b([a-z]+)'s\b/g, '$1').match(/[a-z]+/g) || [];
      expect(words.filter((word) => !known.has(word)), line).toEqual([]);
    }
    expect(study).not.toContain('[Ver singular:');
    expect(study).not.toContain('[Ver terceira pessoa: snows → snow]');
    expect(study).not.toContain('[Ver terceira pessoa: asked → ask]');
    expect(study).not.toMatch(/\[Ver terceira pessoa: (?:visited|seen|climbed|sailed) →/);
    const questionLesson = block.split('### Lição 143 —')[1].split(/^### /m)[0];
    expect(questionLesson).toContain('Have you ever tried');
    expect(questionLesson).toContain('**Never**');
    expect(questionLesson).toContain('I have not visited the museum.');
    expect(questionLesson).toContain('My friend has not tasted the food.');
    expect(questionLesson).toContain('*see → saw → seen*');
    expect(questionLesson).toContain('*make → made → made*');
    const practice = block.split('### Lição 144 —')[1].split(/^### /m)[0];
    expect(practice).toContain('We have not camped in a tent.');
  });

  it('mantém progressão, contadores e recursos no bloco 11', () => {
    const plan = readFileSync('roteiro_a1_v2.md', 'utf8').replace(/<details>[\s\S]*?<\/details>/g, '');
    const before = plan.split('# BLOCO 11 —')[0];
    const block = plan.split('# BLOCO 11 —')[1].split('# BLOCO 12 —')[0];
    const introduced = (text: string) => [...text.matchAll(/`\[Palavra\]` \*\*(.+?)\*\*|`\[Ver palavra: (.+?)\]`/g)]
      .map((match) => (match[1] || match[2]).toLowerCase());
    const seen = new Set(introduced(before));
    expect(seen.size).toBe(652);
    for (let number = 124; number <= 132; number++) {
      const section = block.split(`### Lição ${number} —`)[1]?.split(/^### /m)[0];
      if (!section) throw new Error(`Lição ${number} não encontrada no bloco 11`);
      const words = introduced(section);
      expect(words).toHaveLength(6);
      expect(words.filter((word) => seen.has(word))).toEqual([]);
      expect(new Set(words).size).toBe(words.length);
      words.forEach((word) => seen.add(word));
      expect(section).toContain(`**PAL:** ${words.length}<br>`);
      expect(section).toContain(`**TPA:** ${seen.size}<br>`);
      expect(section.toLowerCase()).toContain(`**PA:** ${words.join(', ')}`.toLowerCase());
      if ([126, 129, 132].includes(number)) {
        expect(section).not.toContain('`[Gramática]`');
        expect(section).not.toContain('`[Palavra]`');
        expect(section.split('\n').filter((line) => /^\d+\. `\[Frase\]`/.test(line))).toHaveLength(6);
      } else {
        expect(section).toContain('`[Gramática]`');
        expect(section).not.toContain('`[Ver palavra:');
      }
    }

    const bank = block.split('#### Lição 133-BF —')[1].split('#### Lição 134 —')[0];
    const phrases = bank.split('\n').filter((line) => /^\d+\. `\[Frase\]`/.test(line));
    expect(phrases.length).toBeGreaterThanOrEqual(8);
    expect(phrases.length).toBeLessThanOrEqual(15);
    phrases.forEach((phrase) => expect(introduced(phrase)).toHaveLength(1));
    const bankWords = introduced(bank);
    expect(bankWords.filter((word) => seen.has(word))).toEqual([]);
    expect(new Set(bankWords).size).toBe(bankWords.length);
    expect(bank).toContain(`**PAL:** ${bankWords.length}<br>`);
    expect(bank).toContain(`**TPA:** ${seen.size + bankWords.length}<br>`);
    expect(bank.toLowerCase()).toContain(`**PA:** ${bankWords.join(', ')}`.toLowerCase());

    const vocabulary = readFileSync('vocabulario_a1.md', 'utf8');
    const entries = [...vocabulary.matchAll(/^\| (\d+) \| ([^|]+?) \| Lição [^|]+, Bloco 11 \|/gm)];
    expect(entries.map((entry) => entry[2].trim().toLowerCase())).toEqual(introduced(block));
    expect(entries.map((entry) => Number(entry[1]))).toEqual(
      Array.from({ length: 66 }, (_, index) => 653 + index)
    );

    const [study, exam] = block.split('#### Lição 135 — exame: apêndice de frases inéditas');
    expect(exam).toBeDefined();
    expect(exam).not.toMatch(/\[Ver /);
    expect(study).not.toMatch(/\[Ver terceira pessoa: [^\]]+ —/);
    const known = new Set<string>();
    const addKnown = (entry: string) => {
      for (const token of entry.toLowerCase().match(/[a-z]+/g) || []) {
        known.add(token);
        known.add(`${token}s`);
        if (/(s|x|ch|sh|o)$/.test(token)) known.add(`${token}es`);
        if (/[^aeiou]y$/.test(token)) known.add(`${token.slice(0, -1)}ies`);
        known.add(`${token}ed`);
        if (token.endsWith('e')) known.add(`${token}d`);
        if (/[^aeiou]y$/.test(token)) known.add(`${token.slice(0, -1)}ied`);
        if (/[^aeiou][aeiou][^aeiouwxy]$/.test(token)) known.add(`${token}${token.slice(-1)}ed`);
      }
    };
    introduced(before).forEach(addKnown);
    for (const match of before.matchAll(/\[Ver singular: [a-z]+ → ([a-z]+)/g)) addKnown(match[1]);
    for (const line of block.split('\n')) {
      introduced(line).forEach(addKnown);
      if (line.includes('`[Palavra]`') || line.includes('`[Gramática]`')) continue;
      const phrase = /^\d+\. (?:`\[Frase\]` \*\*(.+?)\*\*|(.+?) —)/.exec(line);
      if (!phrase) continue;
      const words = expandCurriculumContractions((phrase[1] || phrase[2]).toLowerCase())
        .replace(/\b([a-z]+)'s\b/g, '$1').match(/[a-z]+/g) || [];
      expect(words.filter((word) => !known.has(word)), line).toEqual([]);
    }
    expect(study).not.toContain('[Ver singular:');
    expect(study).toContain('[Ver terceira pessoa: must → must]');
    expect(study).not.toContain('[Ver terceira pessoa: can → can]');
    expect(study).toContain('[Ver terceira pessoa: carried → carry]');
    expect(study).not.toMatch(/\[Ver terceira pessoa: (?:hide|see) →/);
    expect(block.split('### Lição 132 —')[1].split(/^### /m)[0]).toMatch(/\bnot as \w+ as\b/);
  });

  it('mantém progressão, vocabulário e plurais no bloco 8', () => {
    const plan = readFileSync('roteiro_a1_v2.md', 'utf8').replace(/<details>[\s\S]*?<\/details>/g, '');
    const before = plan.split('# BLOCO 8 —')[0];
    const block = plan.split('# BLOCO 8 —')[1].split('# BLOCO 9 —')[0];
    const introduced = (text: string) => [...text.matchAll(/`\[Palavra\]` \*\*(.+?)\*\*|`\[Ver palavra: (.+?)\]`/g)]
      .map((match) => (match[1] || match[2]).toLowerCase());
    const seen = new Set(introduced(before));

    for (let number = 88; number <= 96; number++) {
      const section = block.split(`### Lição ${number} —`)[1]?.split(/^### /m)[0];
      if (!section) throw new Error(`Lição ${number} não encontrada no bloco 8`);
      const words = introduced(section);
      expect(words.length).toBeGreaterThanOrEqual(4);
      expect(words.length).toBeLessThanOrEqual(6);
      expect(words.filter((word) => seen.has(word))).toEqual([]);
      expect(new Set(words).size).toBe(words.length);
      words.forEach((word) => seen.add(word));
      expect(section).toContain(`**PAL:** ${words.length}<br>`);
      expect(section).toContain(`**TPA:** ${seen.size}<br>`);
      expect(section.toLowerCase()).toContain(`**PA:** ${words.join(', ')}`.toLowerCase());
      if ([90, 93, 96].includes(number)) {
        expect(words).toHaveLength(6);
        expect(section).not.toContain('`[Gramática]`');
        expect(section).not.toContain('`[Palavra]`');
      } else {
        expect(section).toContain('`[Gramática]`');
        expect(section).not.toContain('`[Ver palavra:');
      }
    }

    const irregulars = block.split('### Lição 91 —')[1].split(/^### /m)[0];
    expect(irregulars.indexOf('**Tooth**')).toBeLessThan(irregulars.indexOf('**Teeth**'));
    expect(irregulars.indexOf('**Person**')).toBeLessThan(irregulars.indexOf('**People**'));
    const lesson = (number: number) => block.split(`### Lição ${number} —`)[1].split(/^### /m)[0];
    const contrasts = lesson(88).split('\n').filter((line) => line.includes('`[Frase]`') && /\bbut\b/i.test(line));
    expect(contrasts.length).toBeGreaterThanOrEqual(4);
    expect(contrasts.some((line) => /coffee is hot, but the tea is cold/i.test(line))).toBe(true);
    expect(lesson(90)).toMatch(/\bbut\b/i);
    expect(lesson(90)).toMatch(/\btoo\b/i);
    expect(lesson(90)).toMatch(/\balso\b/i);
    expect(lesson(93)).toMatch(/\b(?:mice|people)\b/i);
    expect(lesson(93)).toMatch(/\bsome\b/i);
    expect(lesson(93)).toMatch(/\bmany\b/i);
    expect(lesson(96)).toMatch(/\bwant to\b/i);
    expect(lesson(96)).toMatch(/\bgo (?:back )?to\b/i);
    const bank = block.split('#### Lição 97-BF —')[1].split('#### Lição 98 —')[0];
    const phrases = bank.split('\n').filter((line) => /^\d+\. `\[Frase\]`/.test(line));
    const bankWords = introduced(bank);
    expect(phrases.length).toBeGreaterThanOrEqual(8);
    expect(phrases.length).toBeLessThanOrEqual(15);
    phrases.forEach((phrase) => expect(introduced(phrase)).toHaveLength(1));
    expect(bankWords.filter((word) => seen.has(word))).toEqual([]);
    expect(new Set(bankWords).size).toBe(bankWords.length);
    expect(bank).toContain(`**PAL:** ${bankWords.length}<br>`);
    expect(bank).toContain(`**TPA:** ${seen.size + bankWords.length}<br>`);
    expect(bank.toLowerCase()).toContain(`**PA:** ${bankWords.join(', ')}`.toLowerCase());
    const vocabulary = readFileSync('vocabulario_a1.md', 'utf8');
    const entries = [...vocabulary.matchAll(/^\| (\d+) \| ([^|]+?) \| Lição [^|]+, Bloco 8 \|/gm)];
    expect(entries.map((entry) => entry[2].trim().toLowerCase())).toEqual(introduced(block));
    expect(entries.map((entry) => Number(entry[1]))).toEqual(
      Array.from({ length: 66 }, (_, index) => 455 + index)
    );

    const [study, exam] = block.split('#### Lição 99 — exame: apêndice de frases inéditas');
    expect(exam).toBeDefined();
    expect(exam).not.toContain('[Ver singular:');
    const plurals: Record<string, string> = {
      mice: 'mouse', teeth: 'tooth', people: 'person', claws: 'claw',
      humans: 'human', pets: 'pet', cats: 'cat', things: 'thing',
      bedrooms: 'bedroom', stairs: 'stair',
    };
    const known = new Set<string>();
    const addKnown = (entry: string) => {
      for (const token of entry.toLowerCase().match(/[a-z]+/g) || []) {
        known.add(token);
        const base = plurals[token] || token;
        known.add(base);
        known.add(`${base}s`);
        if (/(s|x|ch|sh|o)$/.test(base)) known.add(`${base}es`);
        if (/[^aeiou]y$/.test(base)) known.add(`${base.slice(0, -1)}ies`);
      }
    };
    introduced(before).forEach(addKnown);
    for (const match of before.matchAll(/\[Ver singular: [a-z]+ → ([a-z]+)/g)) addKnown(match[1]);
    for (const line of block.split('\n')) {
      introduced(line).forEach(addKnown);
      if (line.includes('`[Palavra]`') || line.includes('`[Gramática]`')) continue;
      const phrase = /^\d+\. (?:`\[Frase\]` \*\*(.+?)\*\*|(.+?) —)/.exec(line);
      if (!phrase) continue;
      const words = (phrase[1] || phrase[2]).toLowerCase().match(/[a-z]+/g) || [];
      expect(words.filter((word) => !known.has(word)), line).toEqual([]);
    }
    for (const line of study.split('\n')) {
      if (!/^(?:\d+\. |\s*>)/.test(line)) continue;
      const content = line.split(' — ')[0].split(' `[Ver')[0];
      const words = new Set((content.match(/[A-Za-z]+/g) || []).map((word) => word.toLowerCase()));
      for (const [plural, singular] of Object.entries({ mice: 'mouse', teeth: 'tooth', people: 'person' })) {
        if (words.has(plural)) {
          expect(line, `Falta Ver singular para ${plural}`).toMatch(
            new RegExp(`\\[Ver singular: ${plural} → ${singular} — [^\\]]+\\]`)
          );
        }
      }
    }
  });

  it('mantém progressão, contadores e recursos no bloco 9', () => {
    const plan = readFileSync('roteiro_a1_v2.md', 'utf8').replace(/<details>[\s\S]*?<\/details>/g, '');
    const before = plan.split('# BLOCO 9 —')[0];
    const block = plan.split('# BLOCO 9 —')[1].split('# BLOCO 10 —')[0];
    const introduced = (text: string) => [...text.matchAll(/`\[Palavra\]` \*\*(.+?)\*\*|`\[Ver palavra: (.+?)\]`/g)]
      .map((match) => (match[1] || match[2]).toLowerCase());
    const seen = new Set(introduced(before));
    expect(seen.size).toBe(520);
    for (let number = 100; number <= 108; number++) {
      const section = block.split(`### Lição ${number} —`)[1]?.split(/^### /m)[0];
      if (!section) throw new Error(`Lição ${number} não encontrada no bloco 9`);
      const words = introduced(section);
      expect(words).toHaveLength(6);
      expect(words.filter((word) => seen.has(word))).toEqual([]);
      expect(new Set(words).size).toBe(words.length);
      words.forEach((word) => seen.add(word));
      expect(section).toContain(`**PAL:** ${words.length}<br>`);
      expect(section).toContain(`**TPA:** ${seen.size}<br>`);
      expect(section.toLowerCase()).toContain(`**PA:** ${words.join(', ')}`.toLowerCase());
      if ([102, 105, 108].includes(number)) {
        expect(section).not.toContain('`[Gramática]`');
        expect(section).not.toContain('`[Palavra]`');
      } else {
        expect(section).toContain('`[Gramática]`');
        expect(section).not.toContain('`[Ver palavra:');
      }
    }

    const bank = block.split('#### Lição 109-BF —')[1].split('#### Lição 110 —')[0];
    const phrases = bank.split('\n').filter((line) => /^\d+\. `\[Frase\]`/.test(line));
    expect(phrases.length).toBeGreaterThanOrEqual(8);
    expect(phrases.length).toBeLessThanOrEqual(15);
    phrases.forEach((phrase) => expect(introduced(phrase)).toHaveLength(1));
    const bankWords = introduced(bank);
    expect(bankWords.filter((word) => seen.has(word))).toEqual([]);
    expect(new Set(bankWords).size).toBe(bankWords.length);
    expect(bank).toContain(`**PAL:** ${bankWords.length}<br>`);
    expect(bank).toContain(`**TPA:** ${seen.size + bankWords.length}<br>`);
    expect(bank.toLowerCase()).toContain(`**PA:** ${bankWords.join(', ')}`.toLowerCase());

    const vocabulary = readFileSync('vocabulario_a1.md', 'utf8');
    const entries = [...vocabulary.matchAll(/^\| (\d+) \| ([^|]+?) \| Lição [^|]+, Bloco 9 \|/gm)];
    expect(entries.map((entry) => entry[2].trim().toLowerCase())).toEqual(introduced(block));
    expect(entries.map((entry) => Number(entry[1]))).toEqual(
      Array.from({ length: 66 }, (_, index) => 521 + index)
    );

    const [study, exam] = block.split('#### Lição 111 — exame: apêndice de frases inéditas');
    expect(exam).toBeDefined();
    expect(exam).not.toMatch(/\[Ver (?:singular|terceira pessoa|palavra):/);
    const plurals: Record<string, string> = {
      students: 'student', mice: 'mouse', stairs: 'stair', keys: 'key',
      shadows: 'shadow', rooms: 'room', flowers: 'flower', friends: 'friend',
    };
    const known = new Set<string>();
    const addKnown = (entry: string) => {
      for (const token of entry.toLowerCase().match(/[a-z]+/g) || []) {
        known.add(token);
        const base = plurals[token] || token;
        known.add(base);
        known.add(`${base}s`);
        if (/(s|x|ch|sh|o)$/.test(base)) known.add(`${base}es`);
        if (/[^aeiou]y$/.test(base)) known.add(`${base.slice(0, -1)}ies`);
        known.add(`${base}ing`);
        if (base.endsWith('e')) known.add(`${base.slice(0, -1)}ing`);
        if (/[^aeiou][aeiou][^aeiouwxy]$/.test(base)) known.add(`${base}${base.slice(-1)}ing`);
      }
    };
    introduced(before).forEach(addKnown);
    for (const match of before.matchAll(/\[Ver singular: [a-z]+ → ([a-z]+)/g)) addKnown(match[1]);
    for (const line of block.split('\n')) {
      introduced(line).forEach(addKnown);
      if (line.includes('`[Palavra]`') || line.includes('`[Gramática]`')) continue;
      const phrase = /^\d+\. (?:`\[Frase\]` \*\*(.+?)\*\*|(.+?) —)/.exec(line);
      if (!phrase) continue;
      const words = (phrase[1] || phrase[2]).toLowerCase().match(/[a-z]+/g) || [];
      expect(words.filter((word) => !known.has(word)), line).toEqual([]);
    }
    for (const line of study.split('\n')) {
      if (!/^(?:\d+\. |\s*>)/.test(line) || line.includes('`[Gramática]`')) continue;
      const content = line.split(' — ')[0].split(' `[Ver')[0];
      const words = new Set((content.match(/[A-Za-z]+/g) || []).map((word) => word.toLowerCase()));
      if (words.has('mice')) expect(line).toContain('[Ver singular: mice → mouse —');
      if (/\b(?:she|he|it|the (?:mouse|pillow|room|storm|thunder|rainbow|dog|path|gate|roof|trip)) was\b/i.test(content)) {
        expect(line).toContain('[Ver terceira pessoa: was → be —');
      }
    }
  });

  it('mantém progressão, contadores e recursos no bloco 10', () => {
    const plan = readFileSync('roteiro_a1_v2.md', 'utf8').replace(/<details>[\s\S]*?<\/details>/g, '');
    const before = plan.split('# BLOCO 10 —')[0];
    const block = plan.split('# BLOCO 10 —')[1].split('# BLOCO 11 —')[0];
    const introduced = (text: string) => [...text.matchAll(/`\[Palavra\]` \*\*(.+?)\*\*|`\[Ver palavra: (.+?)\]`/g)]
      .map((match) => (match[1] || match[2]).toLowerCase());
    const seen = new Set(introduced(before));
    expect(seen.size).toBe(586);
    for (let number = 112; number <= 120; number++) {
      const section = block.split(`### Lição ${number} —`)[1]?.split(/^### /m)[0];
      if (!section) throw new Error(`Lição ${number} não encontrada no bloco 10`);
      const words = introduced(section);
      expect(words).toHaveLength(6);
      expect(words.filter((word) => seen.has(word))).toEqual([]);
      expect(new Set(words).size).toBe(words.length);
      words.forEach((word) => seen.add(word));
      expect(section).toContain(`**PAL:** ${words.length}<br>`);
      expect(section).toContain(`**TPA:** ${seen.size}<br>`);
      expect(section.toLowerCase()).toContain(`**PA:** ${words.join(', ')}`.toLowerCase());
      if ([114, 117, 120].includes(number)) {
        expect(section).not.toContain('`[Gramática]`');
        expect(section).not.toContain('`[Palavra]`');
      } else {
        expect(section).toContain('`[Gramática]`');
        expect(section).not.toContain('`[Ver palavra:');
      }
    }
    const regularPast = block.split('### Lição 115 —')[1].split(/^### /m)[0];
    expect(regularPast).toContain('consoante + *y*');
    expect(regularPast).toContain('vogal + *y*');
    expect(regularPast).toContain('*try → tried*');
    expect(regularPast).toContain('*enjoy → enjoyed*');
    expect(regularPast).toContain('*trap → trapped*');
    expect(regularPast).toContain('Não dobramos *w*, *x* ou *y*');
    expect(regularPast).toContain('consoante + vogal + consoante (CVC)');
    expect(regularPast).toContain('*visit → visited*');
    expect(regularPast).not.toContain('vogal curta');
    const story = block.split('#### Lição 122 — história:')[1].split('#### Lição 123 —')[0];
    expect(story).toContain('It started to rain. — Começou a chover. `[Ver terceira pessoa: started → start]`');
    expect(story).toContain('We ate the bread and cheese. It was delicious.');
    expect(story).toContain('We went back to the garden and saw a rainbow. It was beautiful.');
    expect(story).not.toMatch(/\[Ver terceira pessoa: [^\]]+ —/);

    const bank = block.split('#### Lição 121-BF —')[1].split('#### Lição 122 —')[0];
    const phrases = bank.split('\n').filter((line) => /^\d+\. `\[Frase\]`/.test(line));
    expect(phrases.length).toBeGreaterThanOrEqual(8);
    expect(phrases.length).toBeLessThanOrEqual(15);
    phrases.forEach((phrase) => expect(introduced(phrase)).toHaveLength(1));
    const bankWords = introduced(bank);
    expect(bankWords.filter((word) => seen.has(word))).toEqual([]);
    expect(new Set(bankWords).size).toBe(bankWords.length);
    expect(bank).toContain(`**PAL:** ${bankWords.length}<br>`);
    expect(bank).toContain(`**TPA:** ${seen.size + bankWords.length}<br>`);
    expect(bank.toLowerCase()).toContain(`**PA:** ${bankWords.join(', ')}`.toLowerCase());

    const vocabulary = readFileSync('vocabulario_a1.md', 'utf8');
    const entries = [...vocabulary.matchAll(/^\| (\d+) \| ([^|]+?) \| Lição [^|]+, Bloco 10 \|/gm)];
    expect(entries.map((entry) => entry[2].trim().toLowerCase())).toEqual(introduced(block));
    expect(entries.map((entry) => Number(entry[1]))).toEqual(
      Array.from({ length: 66 }, (_, index) => 587 + index)
    );

    const [study, exam] = block.split('#### Lição 123 — exame: apêndice de frases inéditas');
    expect(exam).toBeDefined();
    expect(exam).not.toMatch(/\[Ver (?:singular|terceira pessoa|palavra):/);
    const plurals: Record<string, string> = {
      mice: 'mouse', curtains: 'curtain', flowers: 'flower', hours: 'hour',
    };
    const known = new Set<string>();
    const addKnown = (entry: string) => {
      for (const token of entry.toLowerCase().match(/[a-z]+/g) || []) {
        known.add(token);
        const base = plurals[token] || token;
        known.add(base);
        known.add(`${base}s`);
        if (/(s|x|ch|sh|o)$/.test(base)) known.add(`${base}es`);
        if (/[^aeiou]y$/.test(base)) known.add(`${base.slice(0, -1)}ies`);
        known.add(`${base}ed`);
        if (base.endsWith('e')) known.add(`${base}d`);
        if (/[^aeiou]y$/.test(base)) known.add(`${base.slice(0, -1)}ied`);
        if (/[^aeiou][aeiou][^aeiouwxy]$/.test(base)) known.add(`${base}${base.slice(-1)}ed`);
      }
    };
    introduced(before).forEach(addKnown);
    for (const match of before.matchAll(/\[Ver singular: [a-z]+ → ([a-z]+)/g)) addKnown(match[1]);
    for (const line of block.split('\n')) {
      introduced(line).forEach(addKnown);
      if (line.includes('`[Palavra]`') || line.includes('`[Gramática]`')) continue;
      const phrase = /^\d+\. (?:`\[Frase\]` \*\*(.+?)\*\*|(.+?) —)/.exec(line);
      if (!phrase) continue;
      const words = (phrase[1] || phrase[2]).toLowerCase().match(/[a-z]+/g) || [];
      expect(words.filter((word) => !known.has(word)), line).toEqual([]);
    }
    let inStory = false;
    for (const line of study.split('\n')) {
      if (line.startsWith('#### Lição 122 — história:')) inStory = true;
      if (!/^(?:\d+\. |\s*>)/.test(line) || line.includes('`[Gramática]`')) continue;
      const content = line.split(' — ')[0].split(' `[Ver')[0];
      for (const [form, base] of Object.entries({ touched: 'touch', trapped: 'trap', ate: 'eat', said: 'say', left: 'leave', did: 'do', was: 'be', rained: 'rain', carried: 'carry', started: 'start' })) {
        if (new RegExp(`\\b(?:she|he|it|the (?:cat|mouse|student|bathroom|garage|hallway|room|ceiling|carpet|mat|entrance|footprint|restaurant|week|month|year|dog|picnic|garden|food|tea|sky|wind)|my friend) ${form}\\b`, 'i').test(content)) {
          expect(line).toContain(`[Ver terceira pessoa: ${form} → ${base}${inStory ? ']' : ' —'}`);
        }
      }
    }
  });

  it('mantém progressão, vocabulário e plurais no bloco 7', () => {
    const plan = readFileSync('roteiro_a1_v2.md', 'utf8').replace(/<details>[\s\S]*?<\/details>/g, '');
    const before = plan.split('# BLOCO 7 —')[0];
    const block = plan.split('# BLOCO 7 —')[1].split('# BLOCO 8 —')[0];
    const introduced = (text: string) => [...text.matchAll(/`\[Palavra\]` \*\*(.+?)\*\*|`\[Ver palavra: (.+?)\]`/g)]
      .map((match) => (match[1] || match[2]).toLowerCase());
    const seen = new Set(introduced(before));

    for (let number = 76; number <= 84; number++) {
      const section = block.split(`### Lição ${number} —`)[1]?.split(/^### /m)[0];
      if (!section) throw new Error(`Lição ${number} não encontrada no bloco 7`);
      const words = introduced(section);
      expect(words.length).toBeGreaterThanOrEqual(4);
      expect(words.length).toBeLessThanOrEqual(6);
      expect(words.filter((word) => seen.has(word))).toEqual([]);
      expect(new Set(words).size).toBe(words.length);
      words.forEach((word) => seen.add(word));
      expect(section).toContain(`**PAL:** ${words.length}<br>`);
      expect(section).toContain(`**TPA:** ${seen.size}<br>`);
      expect(section.toLowerCase()).toContain(`**PA:** ${words.join(', ')}`.toLowerCase());
      if ([78, 81, 84].includes(number)) {
        expect(words).toHaveLength(6);
        expect(section).not.toContain('`[Gramática]`');
        expect(section).not.toContain('`[Palavra]`');
      } else {
        expect(section).toContain('`[Gramática]`');
        expect(section).not.toContain('`[Ver palavra:');
      }
    }

    const bank = block.split('#### Lição 85-BF —')[1].split('#### Lição 86 —')[0];
    const phrases = bank.split('\n').filter((line) => /^\d+\. `\[Frase\]`/.test(line));
    const bankWords = introduced(bank);
    expect(phrases.length).toBeGreaterThanOrEqual(8);
    expect(phrases.length).toBeLessThanOrEqual(15);
    phrases.forEach((phrase) => expect(introduced(phrase)).toHaveLength(1));
    expect(bankWords.filter((word) => seen.has(word))).toEqual([]);
    expect(new Set(bankWords).size).toBe(bankWords.length);
    expect(bank).toContain(`**PAL:** ${bankWords.length}<br>`);
    expect(bank).toContain(`**TPA:** ${seen.size + bankWords.length}<br>`);
    expect(bank.toLowerCase()).toContain(`**PA:** ${bankWords.join(', ')}`.toLowerCase());
    const vocabulary = readFileSync('vocabulario_a1.md', 'utf8');
    const entries = [...vocabulary.matchAll(/^\| (\d+) \| ([^|]+?) \| Lição [^|]+, Bloco 7 \|/gm)];
    expect(entries.map((entry) => entry[2].trim().toLowerCase())).toEqual(introduced(block));
    expect(entries.map((entry) => Number(entry[1]))).toEqual(
      Array.from({ length: 66 }, (_, index) => 389 + index)
    );

    const [study, exam] = block.split('#### Lição 87 — exame: apêndice de frases inéditas');
    expect(exam).toBeDefined();
    expect(exam).not.toContain('[Ver singular:');
    const plurals: Record<string, string> = {
      birds: 'bird', games: 'game', parties: 'party', animals: 'animal',
      wings: 'wing', feathers: 'feather', students: 'student', books: 'book',
    };
    const known = new Set<string>();
    const addKnown = (entry: string) => {
      for (const token of entry.toLowerCase().match(/[a-z]+/g) || []) {
        known.add(token);
        const base = plurals[token] || token;
        known.add(base);
        known.add(`${base}s`);
        if (/(s|x|ch|sh|o)$/.test(base)) known.add(`${base}es`);
        if (/[^aeiou]y$/.test(base)) known.add(`${base.slice(0, -1)}ies`);
      }
    };
    introduced(before).forEach(addKnown);
    for (const match of before.matchAll(/\[Ver singular: [a-z]+ → ([a-z]+)/g)) addKnown(match[1]);
    for (const line of block.split('\n')) {
      if (line.startsWith('### Lição 79 —')) known.add('does');
      introduced(line).forEach(addKnown);
      if (line.includes('`[Palavra]`') || line.includes('`[Gramática]`')) continue;
      const phrase = /^\d+\. (?:`\[Frase\]` \*\*(.+?)\*\*|(.+?) —)/.exec(line);
      if (!phrase) continue;
      const english = (phrase[1] || phrase[2]).toLowerCase()
        .replace(/\bdon't\b/g, 'do not')
        .replace(/\bdoesn't\b/g, 'does not');
      expect((english.match(/[a-z]+/g) || []).filter((word) => !known.has(word)), line).toEqual([]);
    }
    expect(study).not.toContain('[Ver singular:');
  });

  it('limita as notas de cada regra ao bloco de apresentação e ao seguinte', () => {
    const plan = readFileSync('roteiro_a1_v2.md', 'utf8')
      .replace(/<details>[\s\S]*?<\/details>/g, '');
    const block = (number: number) => plan.split(`# BLOCO ${number} —`)[1]
      .split(`# BLOCO ${number + 1} —`)[0];
    for (const number of [1, 2]) {
      expect(block(number)).toContain('[Ver terceira pessoa: is → be');
    }
    for (let number = 3; number <= 13; number++) {
      expect(block(number)).not.toContain('[Ver terceira pessoa: is → be');
    }
    expect(block(4)).toContain('[Ver singular:');
    expect(block(5)).toContain('[Ver singular:');
    expect(block(6)).not.toContain('[Ver singular:');
    expect(block(8)).toContain('[Ver singular: mice → mouse');
    expect(block(9)).toContain('[Ver singular: mice → mouse');
    expect(block(10)).not.toContain('[Ver singular:');
    expect(block(6)).toContain('[Ver terceira pessoa: can → can');
    expect(block(7)).toContain('[Ver terceira pessoa: can → can');
    expect(block(8)).not.toContain('[Ver terceira pessoa: can → can');
    expect(block(9)).toContain('[Ver terceira pessoa: was → be');
    expect(block(10)).toContain('[Ver terceira pessoa: was → be');
    expect(block(11)).not.toContain('[Ver terceira pessoa: was → be');
    expect(block(10)).toContain('[Ver terceira pessoa: started → start');
    expect(block(11)).toContain('[Ver terceira pessoa: carried → carry');
    expect(block(12)).not.toContain('[Ver terceira pessoa: asked → ask');
    expect(block(11)).toContain("[Ver contração: didn't → did not");
    expect(block(13)).toContain('[Ver terceira pessoa: would → would]');
    expect(block(13).indexOf('**Best friend**')).toBeLessThan(block(13).indexOf('She is my best friend.'));
  });

  it('mantém progressão, vocabulário e plurais no bloco 6', () => {
    const plan = readFileSync('roteiro_a1_v2.md', 'utf8').replace(/<details>[\s\S]*?<\/details>/g, '');
    const before = plan.split('# BLOCO 6 —')[0];
    const block = plan.split('# BLOCO 6 —')[1].split('# BLOCO 7 —')[0];
    const introduced = (text: string) => [...text.matchAll(/`\[Palavra\]` \*\*(.+?)\*\*|`\[Ver palavra: (.+?)\]`/g)]
      .map((match) => (match[1] || match[2]).toLowerCase());
    const seen = new Set(introduced(before));

    for (let number = 61; number <= 72; number++) {
      const section = block.split(`### Lição ${number} —`)[1]?.split(/^### /m)[0];
      if (!section) throw new Error(`Lição ${number} não encontrada no bloco 6`);
      const words = introduced(section);
      expect(words.length).toBeGreaterThanOrEqual(4);
      expect(words.length).toBeLessThanOrEqual(6);
      expect(words.filter((word) => seen.has(word))).toEqual([]);
      expect(new Set(words).size).toBe(words.length);
      words.forEach((word) => seen.add(word));
      expect(section).toContain(`**PAL:** ${words.length}<br>`);
      expect(section).toContain(`**TPA:** ${seen.size}<br>`);
      expect(section.toLowerCase()).toContain(`**PA:** ${words.join(', ')}`.toLowerCase());
      if ([63, 66, 69, 72].includes(number)) {
        expect(words).toHaveLength(6);
        expect(section).not.toContain('`[Gramática]`');
        expect(section).not.toContain('`[Palavra]`');
      } else {
        expect(section).toContain('`[Gramática]`');
        expect(section).not.toContain('`[Ver palavra:');
      }
    }
    const lesson = (number: number) => block.split(`### Lição ${number} —`)[1].split(/^### /m)[0];
    expect(introduced(lesson(67))).toEqual(expect.arrayContaining(['when', 'which']));
    expect(introduced(lesson(68))).toEqual(expect.arrayContaining(['have', 'has']));
    expect(introduced(lesson(70))).toEqual(expect.arrayContaining(['can', 'see', 'find', 'help', 'say', 'talk']));
    expect(lesson(69)).toMatch(/\b(?:have|has)\b/);
    expect(lesson(69)).toMatch(/\bwhen\b/i);
    expect(lesson(69)).toMatch(/\bwhich\b/i);
    expect(lesson(69)).not.toMatch(/\bcan\b/i);
    expect(lesson(71)).toMatch(/\bcannot\b/i);
    expect(lesson(72)).toMatch(/\bcan\b/i);
    expect(lesson(72)).not.toMatch(/\b(?:when|which)\b/i);

    const bank = block.split('#### Lição 73-BF —')[1].split('#### Lição 74 —')[0];
    const phrases = bank.split('\n').filter((line) => /^\d+\. `\[Frase\]`/.test(line));
    const bankWords = introduced(bank);
    expect(phrases.length).toBeGreaterThanOrEqual(8);
    expect(phrases.length).toBeLessThanOrEqual(15);
    for (const phrase of phrases) expect(introduced(phrase)).toHaveLength(1);
    expect(bankWords.filter((word) => seen.has(word))).toEqual([]);
    expect(new Set(bankWords).size).toBe(bankWords.length);
    expect(bank).toContain(`**PAL:** ${bankWords.length}<br>`);
    expect(bank).toContain(`**TPA:** ${seen.size + bankWords.length}<br>`);
    expect(bank.toLowerCase()).toContain(`**PA:** ${bankWords.join(', ')}`.toLowerCase());
    const vocabulary = readFileSync('vocabulario_a1.md', 'utf8');
    const entries = [...vocabulary.matchAll(/^\| (\d+) \| ([^|]+?) \| Lição [^|]+, Bloco 6 \|/gm)];
    expect(entries.map((entry) => entry[2].trim().toLowerCase())).toEqual(introduced(block));
    expect(entries.map((entry) => Number(entry[1]))).toEqual(
      Array.from({ length: 82 }, (_, index) => 307 + index)
    );

    const [study, exam] = block.split('#### Lição 75 — exame: apêndice de frases inéditas');
    expect(exam).toBeDefined();
    expect(exam).not.toContain('[Ver singular:');
    const plurals: Record<string, string> = { ducks: 'duck', eggs: 'egg', tickets: 'ticket', stars: 'star', stairs: 'stair' };
    const known = new Set<string>();
    const addKnown = (entry: string) => {
      for (const token of entry.toLowerCase().match(/[a-z]+/g) || []) {
        known.add(token);
        const base = plurals[token] || token;
        known.add(base);
        known.add(`${base}s`);
        if (/(s|x|ch|sh)$/.test(base)) known.add(`${base}es`);
        if (/[^aeiou]y$/.test(base)) known.add(`${base.slice(0, -1)}ies`);
      }
    };
    introduced(before).forEach(addKnown);
    for (const match of before.matchAll(/\[Ver singular: [a-z]+ → ([a-z]+)/g)) addKnown(match[1]);
    for (const line of block.split('\n')) {
      if (line.startsWith('### Lição 71 —')) known.add('cannot');
      introduced(line).forEach(addKnown);
      if (line.includes('`[Palavra]`') || line.includes('`[Gramática]`')) continue;
      const phrase = /^\d+\. (?:`\[Frase\]` \*\*(.+?)\*\*|(?:(?:Mãe|Filha): )?(.+?) —)/.exec(line);
      if (!phrase) continue;
      const english = (phrase[1] || phrase[2]).toLowerCase()
        .replace(/\bi'm\b/g, 'i am')
        .replace(/\bcan't\b/g, 'cannot')
        .replace(/\bisn't\b/g, 'is not');
      expect((english.match(/[a-z]+/g) || []).filter((word) => !known.has(word)), line).toEqual([]);
    }
    expect(study).not.toContain('[Ver singular:');
  });

  it('mantém progressão, contexto lexical e encerramento do bloco 5', () => {
    const plan = readFileSync('roteiro_a1_v2.md', 'utf8').replace(/<details>[\s\S]*?<\/details>/g, '');
    const before = plan.split('# BLOCO 5 —')[0];
    const block = plan.split('# BLOCO 5 —')[1].split('# BLOCO 6 —')[0];
    const introduced = (text: string) => [...text.matchAll(/`\[Palavra\]` \*\*(.+?)\*\*|`\[Ver palavra: (.+?)\]`/g)]
      .map((match) => (match[1] || match[2]).toLowerCase());
    const seen = new Set(introduced(before));

    for (let number = 49; number <= 57; number++) {
      const section = block.split(`### Lição ${number} —`)[1]?.split(/^### /m)[0];
      if (!section) throw new Error(`Lição ${number} não encontrada no bloco 5`);
      const words = introduced(section);
      expect(words.length).toBeGreaterThanOrEqual(4);
      expect(words.length).toBeLessThanOrEqual(6);
      expect(words.filter((word) => seen.has(word))).toEqual([]);
      expect(new Set(words).size).toBe(words.length);
      words.forEach((word) => seen.add(word));
      expect(section).toContain(`**PAL:** ${words.length}<br>`);
      expect(section).toContain(`**TPA:** ${seen.size}<br>`);
      expect(section.toLowerCase()).toContain(`**PA:** ${words.join(', ')}`.toLowerCase());
      if ([51, 54, 57].includes(number)) {
        expect(words).toHaveLength(6);
        expect(section).not.toContain('`[Gramática]`');
        expect(section).not.toContain('`[Palavra]`');
      } else {
        expect(section).toContain('`[Gramática]`');
        expect(section).not.toContain('`[Ver palavra:');
      }
    }

    const bank = block.split('#### Lição 58-BF —')[1].split('#### Lição 59 —')[0];
    const phrases = bank.split('\n').filter((line) => /^\d+\. `\[Frase\]`/.test(line));
    const bankWords = introduced(bank);
    expect(phrases.length).toBeGreaterThanOrEqual(8);
    expect(phrases.length).toBeLessThanOrEqual(15);
    for (const phrase of phrases) expect(introduced(phrase)).toHaveLength(1);
    expect(bankWords.filter((word) => seen.has(word))).toEqual([]);
    expect(new Set(bankWords).size).toBe(bankWords.length);
    expect(bank).toContain(`**PAL:** ${bankWords.length}<br>`);
    expect(bank).toContain(`**TPA:** ${seen.size + bankWords.length}<br>`);
    expect(bank.toLowerCase()).toContain(`**PA:** ${bankWords.join(', ')}`.toLowerCase());
    const vocabulary = readFileSync('vocabulario_a1.md', 'utf8');
    const blockEntries = [...vocabulary.matchAll(/^\| (\d+) \| ([^|]+?) \| Lição [^|]+, Bloco 5 \|/gm)];
    expect(blockEntries.map((entry) => entry[2].trim().toLowerCase())).toEqual(introduced(block));
    expect(blockEntries.map((entry) => Number(entry[1]))).toEqual(
      Array.from({ length: 64 }, (_, index) => 243 + index)
    );

    const plurals: Record<string, string> = {
      shirts: 'shirt', shoes: 'shoe', socks: 'sock', belts: 'belt', dresses: 'dress', foxes: 'fox',
      rabbits: 'rabbit', ducks: 'duck', restaurants: 'restaurant', pharmacies: 'pharmacy',
      bridges: 'bridge', cars: 'car', buses: 'bus', cucumbers: 'cucumber', pans: 'pan',
      bottles: 'bottle', mushrooms: 'mushroom', gloves: 'glove', boots: 'boot',
    };
    const [study, exam] = block.split('#### Lição 60 — exame: apêndice de frases inéditas');
    expect(exam).toBeDefined();
    expect(exam).not.toContain('[Ver singular:');
    const known = new Set<string>();
    const addKnown = (entry: string) => {
      for (const token of entry.toLowerCase().match(/[a-z]+/g) || []) {
        known.add(token);
        const base = plurals[token] || token;
        known.add(base);
        known.add(`${base}s`);
        if (/(s|x|ch|sh)$/.test(base)) known.add(`${base}es`);
        if (/[^aeiou]y$/.test(base)) known.add(`${base.slice(0, -1)}ies`);
      }
    };
    introduced(before).forEach(addKnown);
    for (const line of block.split('\n')) {
      introduced(line).forEach(addKnown);
      if (line.includes('`[Palavra]`') || line.includes('`[Gramática]`')) continue;
      const phrase = /^\d+\. (?:`\[Frase\]` \*\*(.+?)\*\*|(.+?) —)/.exec(line);
      if (!phrase) continue;
      const english = (phrase[1] || phrase[2]).toLowerCase()
        .replace(/\baren't\b/g, 'are not')
        .replace(/\bisn't\b/g, 'is not');
      expect((english.match(/[a-z]+/g) || []).filter((word) => !known.has(word)), line).toEqual([]);
    }
    for (const line of study.split('\n')) {
      if (!/^(?:\d+\. |\s*>)/.test(line)) continue;
      const content = line.split(' — ')[0].split(' `[Ver singular:')[0];
      const words = new Set((content.match(/[A-Za-z]+/g) || []).map((word) => word.toLowerCase()));
      for (const [plural, singular] of Object.entries(plurals)) {
        if (words.has(plural)) {
          expect(line, `Falta Ver singular para ${plural}`).toMatch(
            new RegExp(`\\[Ver singular: ${plural} → ${singular} — [^\\]]+\\]`)
          );
        }
      }
      if (words.has('jeans')) expect(line).toContain('[Ver singular: jeans — para esta peça de roupa, jeans não tem singular usual em inglês]');
    }
  });

  it('mantém os limites de vocabulário e o formato dos ciclos e banco do bloco 3', () => {
    const plan = readFileSync('roteiro_a1_v2.md', 'utf8').replace(/<details>[\s\S]*?<\/details>/g, '');
    const before = plan.split('# BLOCO 3 —')[0];
    const block = plan.split('# BLOCO 3 —')[1].split('# BLOCO 4 —')[0];
    const introduced = (text: string) => [...text.matchAll(/`\[Palavra\]` \*\*(.+?)\*\*|`\[Ver palavra: (.+?)\]`/g)]
      .map((match) => (match[1] || match[2]).toLowerCase());
    const seen = new Set(introduced(before));

    for (let number = 25; number <= 33; number++) {
      const section = block.split(`### Lição ${number} —`)[1]?.split(/^### /m)[0];
      if (!section) throw new Error(`Lição ${number} não encontrada no bloco 3`);
      const words = introduced(section);
      expect(words.length).toBeGreaterThanOrEqual(4);
      expect(words.length).toBeLessThanOrEqual(6);
      expect(words.filter((word) => seen.has(word))).toEqual([]);
      expect(new Set(words).size).toBe(words.length);
      words.forEach((word) => seen.add(word));
      expect(section).toContain(`**PAL:** ${words.length}<br>`);
      expect(section).toContain(`**TPA:** ${seen.size}<br>`);
      if ([27, 30, 33].includes(number)) {
        expect(words).toHaveLength(6);
        expect(section).not.toContain('`[Gramática]`');
      } else {
        expect(section).toContain('`[Gramática]`');
        expect(section).not.toContain('`[Ver palavra:');
      }
    }

    const bank = block.split('#### Lição 34-BF —')[1].split('#### Lição 35 —')[0];
    const bankPhrases = bank.split('\n').filter((line) => /^\d+\. `\[Frase\]`/.test(line));
    const bankWords = introduced(bank);
    expect(bankPhrases.length).toBeGreaterThanOrEqual(8);
    expect(bankPhrases.length).toBeLessThanOrEqual(15);
    for (const phrase of bankPhrases) expect(introduced(phrase)).toHaveLength(1);
    expect(bankWords).toHaveLength(bankPhrases.length);
    expect(new Set(bankWords).size).toBe(bankWords.length);
    expect(bankWords.filter((word) => seen.has(word))).toEqual([]);
    expect(bank).toContain(`**PAL:** ${bankWords.length}<br>`);
    expect(bank).toContain(`**TPA:** ${seen.size + bankWords.length}<br>`);
  });

  it('anota os plurais estudados no bloco 4, mas não nos exames', () => {
    const plan = readFileSync('roteiro_a1_v2.md', 'utf8').replace(/<details>[\s\S]*?<\/details>/g, '');
    const block = plan.split('# BLOCO 4 —')[1].split('# BLOCO 5 —')[0];
    const [study, exam] = block.split('#### Lição 48 — exame: apêndice de frases inéditas');
    expect(exam).toBeDefined();
    const plurals: Record<string, string> = {
      balloons: 'balloon', gifts: 'gift', candles: 'candle', cards: 'card', ribbons: 'ribbon', flags: 'flag',
      oranges: 'orange', apples: 'apple', eggs: 'egg', pears: 'pear', lemons: 'lemon', carrots: 'carrot',
      vegetables: 'vegetable', boxes: 'box', dishes: 'dish', brushes: 'brush', buses: 'bus',
      benches: 'bench', classes: 'class', candies: 'candy', parties: 'party', gardens: 'garden',
      cities: 'city', stories: 'story', books: 'book', puppies: 'puppy', butterflies: 'butterfly',
      sandwiches: 'sandwich', families: 'family', babies: 'baby', strawberries: 'strawberry',
    };
    for (const line of study.split('\n')) {
      if (!/^(?:\d+\. |\s*>)/.test(line)) continue;
      const content = line.split(' — ')[0].split(' `[Ver singular:')[0];
      const words = new Set((content.match(/[A-Za-z]+/g) || []).map((word) => word.toLowerCase()));
      for (const [plural, singular] of Object.entries(plurals)) {
        if (words.has(plural)) {
          expect(line, `Falta Ver singular para ${plural}`).toMatch(
            new RegExp(`\\[Ver singular: ${plural} → ${singular} — [^\\]]+\\]`)
          );
        }
      }
    }
    for (const [index, number] of [12, 24, 36, 48].entries()) {
      const current = plan.split(`# BLOCO ${index + 1} —`)[1].split(`# BLOCO ${index + 2} —`)[0];
      const examText = current.split(`#### Lição ${number} — exame: apêndice de frases inéditas`)[1];
      expect(examText).toBeDefined();
      expect(examText).not.toContain('[Ver singular:');
    }
  });

  it('mantém progressão, limites e contadores do bloco 4', () => {
    const plan = readFileSync('roteiro_a1_v2.md', 'utf8').replace(/<details>[\s\S]*?<\/details>/g, '');
    const before = plan.split('# BLOCO 4 —')[0];
    const block = plan.split('# BLOCO 4 —')[1].split('# BLOCO 5 —')[0];
    const introduced = (text: string) => [...text.matchAll(/`\[Palavra\]` \*\*(.+?)\*\*|`\[Ver palavra: (.+?)\]`/g)]
      .map((match) => (match[1] || match[2]).toLowerCase());
    const seen = new Set(introduced(before));

    for (let number = 37; number <= 45; number++) {
      const section = block.split(`### Lição ${number} —`)[1]?.split(/^### /m)[0];
      if (!section) throw new Error(`Lição ${number} não encontrada no bloco 4`);
      const words = introduced(section);
      expect(words.length).toBeGreaterThanOrEqual(4);
      expect(words.length).toBeLessThanOrEqual(6);
      expect(words.filter((word) => seen.has(word))).toEqual([]);
      expect(new Set(words).size).toBe(words.length);
      words.forEach((word) => seen.add(word));
      expect(section).toContain(`**PAL:** ${words.length}<br>`);
      expect(section).toContain(`**TPA:** ${seen.size}<br>`);
      expect(section.toLowerCase()).toContain(`**PA:** ${words.join(', ')}`.toLowerCase());
      if ([39, 42, 45].includes(number)) {
        expect(words).toHaveLength(6);
        expect(section).not.toContain('`[Gramática]`');
      } else {
        expect(section).toContain('`[Gramática]`');
        expect(section).not.toContain('`[Ver palavra:');
      }
    }

    const bank = block.split('#### Lição 46-BF —')[1].split('#### Lição 47 —')[0];
    const bankPhrases = bank.split('\n').filter((line) => /^\d+\. `\[Frase\]`/.test(line));
    const bankWords = introduced(bank);
    expect(bankPhrases.length).toBeGreaterThanOrEqual(8);
    expect(bankPhrases.length).toBeLessThanOrEqual(15);
    for (const phrase of bankPhrases) expect(introduced(phrase)).toHaveLength(1);
    expect(bankWords.filter((word) => seen.has(word))).toEqual([]);
    expect(new Set(bankWords).size).toBe(bankWords.length);
    expect(bank).toContain(`**PAL:** ${bankWords.length}<br>`);
    expect(bank).toContain(`**TPA:** ${seen.size + bankWords.length}<br>`);

    const known = new Set(introduced(before));
    const pluralFirst: Record<string, string> = {
      balloons: 'balloon', gifts: 'gift', candles: 'candle', cards: 'card', ribbons: 'ribbon', flags: 'flag',
      pears: 'pear', lemons: 'lemon', carrots: 'carrot',
      boxes: 'box', dishes: 'dish', brushes: 'brush', buses: 'bus', benches: 'bench', classes: 'class',
      candies: 'candy', parties: 'party', cities: 'city', stories: 'story', puppies: 'puppy', butterflies: 'butterfly',
    };
    const regularPlurals: Record<string, string> = {
      books: 'book', pens: 'pen', pencils: 'pencil', apples: 'apple', oranges: 'orange', eggs: 'egg',
      dogs: 'dog', cups: 'cup', gardens: 'garden', vegetables: 'vegetable',
      sandwiches: 'sandwich', peaches: 'peach', glasses: 'glass',
      families: 'family', babies: 'baby', strawberries: 'strawberry', teachers: 'teacher',
    };
    let lesson = 0;
    for (const line of block.split('\n')) {
      const heading = /^### Lição (\d+) —/.exec(line);
      if (heading) {
        lesson = Number(heading[1]);
      }
      introduced(line).forEach((word) => {
        known.add(word);
        if (pluralFirst[word]) known.add(pluralFirst[word]);
      });
      for (const [plural, singular] of Object.entries(regularPlurals)) {
        const ruleTaught = lesson >= (['sandwiches', 'peaches', 'glasses'].includes(plural) ? 44
          : ['families', 'babies', 'strawberries'].includes(plural) ? 45 : 38);
        if (ruleTaught && known.has(singular)) known.add(plural);
      }
      if (line.includes('`[Palavra]`') || line.includes('`[Gramática]`')) continue;
      const phrase = /^\d+\. (?:`\[Frase\]` \*\*(.+?)\*\*|(.+?) —)/.exec(line);
      if (!phrase) continue;
      const words = (phrase[1] || phrase[2]).toLowerCase().match(/[a-z]+/g) || [];
      expect(words.filter((word) => !known.has(word)), line).toEqual([]);
    }

    const numbers = new Set(['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']);
    for (let number = 37; number <= 45; number++) {
      const section = block.split(`### Lição ${number} —`)[1].split(/^### /m)[0];
      expect(introduced(section).filter((word) => numbers.has(word)).length).toBeLessThanOrEqual(3);
    }
    const first = introduced(block.split('### Lição 37 —')[1].split(/^### /m)[0]);
    expect(first.every((word) => pluralFirst[word] && !new Set(introduced(before)).has(pluralFirst[word]))).toBe(true);

    const lesson38 = block.split('### Lição 38 —')[1].split(/^### /m)[0];
    expect(lesson38).toContain('An apple is a fruit.');
    expect(introduced(lesson38)).toContain('vegetable');
    const lesson40 = block.split('### Lição 40 —')[1].split(/^### /m)[0];
    expect(introduced(lesson40)).toEqual(expect.arrayContaining(['this', 'that']));
    const fixation42 = block.split('### Lição 42 —')[1].split(/^### /m)[0];
    expect(fixation42).toMatch(/\*\*This .+?\*\*/);
    expect(fixation42).toMatch(/\*\*That .+?\*\*/);
  });

  it('deve manter a ordem fixa dos 22 tópicos do Nível A1 no planejamento e cobrir 150 lições estruturadas no Nível A1', () => {
    const a1Plan = CEFR_CURRICULUM_PLAN_A1_TO_C2[0];
    expect(a1Plan.level).toBe('A1');
    const topicNames = a1Plan.grammarContents.map((g) => g.topic);
    expect(topicNames).toEqual([
      'Articles',
      'Personal pronouns',
      'Prepositions of place',
      'Verb to be (Afirmativa e Negativa)',
      'Prepositions (with, from, at, for, of, near)',
      'Verb to be (Interrogativa)',
      'Possessive adjectives',
      'Plural nouns',
      'Demonstratives',
      'There is / There are',
      'Question words',
      'Verb to have',
      'Simple Present',
      'Do / Does',
      'Third person',
      'Imperatives',
      'Prepositions of time',
      "Possessive 's",
      "Can / Can't",
      'Basic adjectives',
      'Countable / Uncountable',
      "Like / Don't like",
    ]);

    const a1Lessons = INITIAL_STUDY_DAYS.filter((d) => d.cefrLevel === 'A1');
    expect(a1Lessons.length).toBe(151);
  });
});

describe('Pré-cadastro Inteligente de Palavras Conhecidas (Pulo Automático) e Inserção Elástica de Diálogo', () => {
  beforeEach(() => {
    const store: Record<string, string> = {};
    const mockStorage: Storage = {
      getItem: (key: string) => (key in store ? store[key] : null),
      setItem: (key: string, val: string) => {
        store[key] = String(val);
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        Object.keys(store).forEach((k) => delete store[k]);
      },
      key: (idx: number) => Object.keys(store)[idx] ?? null,
      get length() {
        return Object.keys(store).length;
      },
    };
    Object.defineProperty(globalThis, 'localStorage', {
      value: mockStorage,
      configurable: true,
      writable: true,
    });
    storageService.saveStudyDays(JSON.parse(JSON.stringify(INITIAL_STUDY_DAYS)));
  });

  it('revisa apenas frases e falas vencidas e não conta palavras ou gramática no calendário', () => {
    const email = 'aluno@example.com';
    const days = storageService.getStudyDays();
    const template = days[0].cards[0];
    const cards = (['word', 'phrase', 'dialogue', 'grammar'] as const).map((type) => ({
      ...template,
      id: `review-${type}`,
      type,
    }));
    days[0].cards = cards;
    storageService.saveStudyDays(days);
    for (const card of cards) {
      storageService.saveUserCardSrs(email, {
        ...createInitialSrsProgress(card.id, email),
        stage: 'graduated',
        nextReviewDateIso: card.type === 'dialogue' ? '2026-01-03' : '2026-01-01',
      });
    }

    expect(storageService.getDueReviewCards(email, '2026-01-02').map((card) => card.type))
      .toEqual(['phrase']);
    expect(storageService.getDueReviewCards(email, '2026-01-03').map((card) => card.type))
      .toEqual(['phrase', 'dialogue']);
    expect(storageService.getScheduledCountsByDate(email))
      .toEqual({ '2026-01-01': 1, '2026-01-03': 1 });
  });

  it('limita o sorteio de revisões e favorece frases atrasadas sem duplicá-las', () => {
    const email = 'aluno@example.com';
    const days = storageService.getStudyDays();
    const template = days[0].cards[0];
    const cards = ['recente', 'antiga', 'outra'].map((name) => ({
      ...template,
      id: `phrase-${name}`,
      type: 'phrase' as const,
    }));
    days[0].cards = cards;
    storageService.saveStudyDays(days);
    cards.forEach((card, index) => {
      storageService.saveUserCardSrs(email, {
        ...createInitialSrsProgress(card.id, email),
        stage: 'graduated',
        nextReviewDateIso: index === 1 ? '2026-01-01' : '2026-01-10',
      });
    });

    const random = vi.spyOn(Math, 'random').mockReturnValue(0.5);
    try {
      const selected = storageService.selectDueReviewCards(email, 2, '2026-01-10');
      expect(selected).toHaveLength(2);
      expect(selected[0].id).toBe('phrase-antiga');
      expect(new Set(selected.map((card) => card.id)).size).toBe(2);
      expect(storageService.selectDueReviewCards(email, 2, '2026-01-10', 1)).toEqual([]);
      expect(storageService.selectDueReviewCards(email, 2, '2026-01-10', 2)).toHaveLength(2);
      expect(() => storageService.selectDueReviewCards(email, 0, '2026-01-10'))
        .toThrow(RangeError);
    } finally {
      random.mockRestore();
    }
  });

  it('deve pular a palavra conhecida "am" na lição 4 sem pular a frase', () => {
    const email = 'julia.aluna@gmail.com';
    const regResult = storageService.addCustomStudentCard(email, 'word', 'am', 'sou');

    expect(regResult.matchedExistingCourseCard).toBe(true);
    expect(regResult.matchedDayNumbers).toContain(4);
    expect(storageService.getCustomStudentCards(email)).toHaveLength(0);
    expect(storageService.getKnownWordsCount(email)).toBe(1);

    const day4 = storageService.getStudyDays().find((d) => d.dayNumber === 4)!;
    const { queue, skippedCount } = storageService.getLessonQueueForUser(email, day4);
    expect(skippedCount).toBe(1);
    expect(queue[0].english).toBe('I');
    expect(queue[1].english).toBe('I am a boy.');
  });

  it('deve atualizar as lições revisadas do Bloco 5 preservando progresso de cards idênticos e cards personalizados', () => {
    const storedDays = storageService.getStudyDays();
    const lesson41 = storedDays.find((day) => day.dayNumber === 43)!;
    const unchangedCard = lesson41.cards[1];
    const customCard = {
      ...lesson41.cards[0],
      id: 'custom-card-41-test',
      english: 'My custom word',
      portuguese: 'Minha palavra personalizada',
      isCustom: true,
    };
    const outdatedCard = {
      ...lesson41.cards[0],
      english: 'Outdated word',
      portuguese: 'Palavra antiga',
    };
    const outdatedLesson = {
      ...lesson41,
      cards: [
        outdatedCard,
        unchangedCard,
        customCard,
      ],
    };
    localStorage.setItem(
      'ztf_study_days',
      JSON.stringify(storedDays.map((day) => (day.dayNumber === 43 ? outdatedLesson : day)))
    );
    localStorage.removeItem('ztf_curriculum_revision');
    const progress = createInitialSrsProgress(
      unchangedCard.id,
      'julia.aluna@gmail.com',
      unchangedCard.tenantId,
      '2026-11-06'
    );
    storageService.saveUserCardSrs('julia.aluna@gmail.com', progress);

    const migratedLesson = storageService.getStudyDays().find((day) => day.dayNumber === 43)!;
    const migratedUnchangedCard = migratedLesson.cards.find(
      (card) => card.english === unchangedCard.english
    )!;

    expect(migratedLesson.cards.find((card) => card.english === 'This')).toBeDefined();
    expect(migratedLesson.cards.find((card) => card.english === 'Outdated word')).toBeUndefined();
    expect(migratedLesson.cards.find((card) => card.english === 'This')?.id).not.toBe(
      outdatedCard.id
    );
    expect(migratedUnchangedCard.id).toBe(unchangedCard.id);
    expect(
      storageService.getUserSrsMap('julia.aluna@gmail.com')[unchangedCard.id]
    ).toEqual(progress);
    expect(migratedLesson.cards.find((card) => card.id === customCard.id)).toMatchObject({
      english: customCard.english,
      portuguese: customCard.portuguese,
      isCustom: true,
    });
  });

  it('migra a lição original deslocada sem transferir progresso de conteúdo alterado', () => {
      const email = 'aluno@example.com';
      const template = INITIAL_STUDY_DAYS[0];
      const same = { ...template.cards[0], id: 'day-1-card-1', dayNumber: 3 };
      const changed = { ...template.cards[1], id: 'day-1-card-2', dayNumber: 3, english: 'Outro' };
      const custom = { ...template.cards[1], id: 'custom-test', dayNumber: 3, isCustom: true };
      const teacherCard = { ...template.cards[1], id: 'day-1-card-1760000000000-abcd', dayNumber: 3 };
      storageService.getStudyDays();
      storageService.saveStudyDays([{
        ...template,
        dayNumber: 3,
        title: 'Lição 3 — Conteúdo antigo',
        cards: [same, changed, custom, teacherCard],
      }]);
      localStorage.removeItem('ztf_reviewed_a1_revision');
      storageService.saveUserCardSrs(email, {
        ...createInitialSrsProgress(same.id, email),
        stage: 'graduated',
      });
      storageService.saveUserCardSrs(email, {
        ...createInitialSrsProgress(changed.id, email),
        stage: 'graduated',
      });
      storageService.saveLessonCheckpoint({
        userEmail: email,
        dayNumber: 3,
        title: 'Antiga',
        queueCardIds: [same.id, changed.id],
        currentIndex: 1,
        elapsedSeconds: 10,
        answeredCount: 1,
        accuracySum: 100,
        newWordsCountInLesson: 1,
        updatedAtIso: '2026-01-01',
      });

      const migrated = storageService.getStudyDays()[0];
      expect(migrated.title).toBe('Lição 3 — Artigo Definido "The" e Conjunção "And"');
      expect(migrated.cards[0].id).toBe(same.id);
      expect(storageService.getUserSrsMap(email)[same.id].stage).toBe('graduated');
      const pencil = migrated.cards.find((card) => card.english === 'Pencil')!;
      expect(pencil.id).not.toBe(changed.id);
      expect(storageService.getUserSrsMap(email)[pencil.id]).toBeUndefined();
      expect(migrated.cards.some((card) => card.id === custom.id)).toBe(true);
      expect(migrated.cards.some((card) => card.id === teacherCard.id)).toBe(true);
      expect(storageService.getLessonCheckpoint(email)).toBeNull();
  });

  it('considera concluída a lição quando os cards de estudo, sem a gramática, foram graduados', () => {
      const email = 'aluno@example.com';
      const lesson = storageService.getStudyDays()[0];
      for (const card of lesson.cards.filter((item) => item.type !== 'grammar')) {
        storageService.saveUserCardSrs(email, {
          ...createInitialSrsProgress(card.id, email),
          stage: 'graduated',
        });

      }
      expect(storageService.isDayCompletedByUser(email, lesson.dayNumber)).toBe(true);
  });

  it('continua para a próxima lição, mesmo que haja lições anteriores pendentes', () => {
    expect(storageService.getFollowingLesson(5)?.dayNumber).toBe(6);
    expect(storageService.getFollowingLesson(152)).toBeNull();
  });

  it('deve empurrar os dias seguintes para frente quando um diálogo com Dia Preparatório (i+1) é inserido após o Dia 4', () => {
    const beforeDays = storageService.getStudyDays();
    const day5Before = beforeDays.find((d) => d.dayNumber === 5)!;
    expect(day5Before.title).toContain('He is');

    const inserted = storageService.insertElasticDialogueOrStory({
      afterDayNumber: 4,
      titleBase: 'Encontro Rápido',
      preparatoryCards: [{ type: 'word', english: 'Hello', portuguese: 'Olá' }],
      dialogueCards: [
        { english: 'Hello! I am a student.', portuguese: 'Olá! Eu sou um estudante.' },
        { english: 'You are in a house.', portuguese: 'Você está em uma casa.' },
      ],
    });

    expect(inserted).toHaveLength(2); // Dia 5 (Preparatório) e Dia 6 (Diálogo)
    expect(inserted[0].dayNumber).toBe(5);
    expect(inserted[1].dayNumber).toBe(6);

    const afterDays = storageService.getStudyDays();
    const shiftedDay5 = afterDays.find((d) => d.dayNumber === 7)!;
    expect(shiftedDay5.title).toContain('He is');
  });

  it('deve permitir ao aluno reportar uma tradução (bandeirinha) e ao professor aprová-la como nova possibilidade oficial (+ Incluir Possibilidade)', () => {
    const lesson1 = storageService.getStudyDays().find((d) => d.dayNumber === 1)!;
    const applePhraseCard = lesson1.cards.find((c) => c.english === 'The pencil.')!;

    const report = storageService.submitTranslationReport({
      cardId: applePhraseCard.id,
      lessonNumber: 1,
      english: 'The pencil.',
      currentPortuguese: applePhraseCard.portuguese,
      studentTypedPortuguese: 'O lápis novo.',
      studentReason: 'Gostaria de sugerir como sinônimo contextual.',
      studentEmail: 'julia.aluna@gmail.com',
      studentName: 'Júlia',
    });

    expect(report.status).toBe('pending');
    expect(storageService.getTranslationReports()).toHaveLength(1);

    storageService.resolveTranslationReport({
      reportId: report.id,
      action: 'accept_append',
    });

    const updatedLesson1 = storageService.getStudyDays().find((d) => d.dayNumber === 1)!;
    const updatedCard = updatedLesson1.cards.find((c) => c.id === applePhraseCard.id)!;
    expect(updatedCard.portuguese).toContain('O lápis novo.');

    const correspondence = evaluateLetterCorrespondence('O lápis novo', updatedCard.portuguese);
    expect(correspondence.accuracyPercent).toBe(100);
  });

  it('deve calcular corretamente 1 Dia de Estudo = 10 palavras aprendidas e respeitar a cota de 2 dias de estudo por dia para alunos', () => {
    const email = 'julia.aluna@gmail.com';
    const today = '2026-11-06';

    // Cadastra 15 palavras conhecidas
    const sampleWords = [
      ['the', 'o'],
      ['girl', 'menina'],
      ['and', 'e'],
      ['boy', 'menino'],
      ['man', 'homem'],
      ['woman', 'mulher'],
      ['book', 'livro'],
      ['apple', 'maçã'],
      ['table', 'mesa'],
      ['arm', 'braço'],
      ['box', 'caixa'],
      ['house', 'casa'],
      ['dog', 'cachorro'],
      ['cat', 'gato'],
      ['student', 'estudante'],
    ];

    for (const [en, pt] of sampleWords) {
      storageService.addCustomStudentCard(email, 'word', en, pt);
    }

    const metrics = storageService.getStudyDaysMetrics(email, today);
    expect(metrics.knownWordsTotal).toBe(15);
    expect(metrics.totalStudyDaysEquivalent).toBe(1.5); // 15 palavras = 1.5 dias de estudo
    expect(metrics.dailyStudyDaysQuota).toBe(2); // Limite de 2 dias de estudo/dia (20 palavras/dia)
  });

  it('deve possuir 150 lições completas do Nível A1 e retomar exatamente do card onde o aluno parou via checkpoint', () => {
    expect(INITIAL_STUDY_DAYS.length).toBe(151);

    const email = 'julia.aluna@gmail.com';
    const lesson2 = storageService.getStudyDays().find((d) => d.dayNumber === 2)!;

    storageService.saveLessonCheckpoint({
      userEmail: email,
      dayNumber: 2,
      title: lesson2.title,
      queueCardIds: lesson2.cards.map((c) => c.id),
      currentIndex: 4,
      elapsedSeconds: 42,
      answeredCount: 4,
      accuracySum: 380,
      newWordsCountInLesson: 6,
      updatedAtIso: new Date().toISOString(),
    });

    const resumedLesson = storageService.getNextPendingLessonForUser(email);
    expect(resumedLesson?.dayNumber).toBe(2);

    const checkpoint = storageService.getLessonCheckpoint(email);
    expect(checkpoint?.currentIndex).toBe(4);
    expect(checkpoint?.elapsedSeconds).toBe(42);
  });
});

describe('Testes de Bloco (15 Blocos, Banco de 300 Questões, 4 Habilidades e Desbloqueio Progressivo)', () => {
  it('deve possuir exatamente 15 bancos de testes com 20 questões cada (300 questões no total), sendo 5 por habilidade', () => {
    const blockNumbers = Object.keys(BLOCK_TESTS_MAP).map(Number);
    expect(blockNumbers.length).toBe(15);

    let totalQuestions = 0;
    for (let b = 2; b <= 15; b++) {
      const bank = BLOCK_TESTS_MAP[b];
      expect(bank).toBeDefined();
      expect(bank.length).toBe(20);
      totalQuestions += bank.length;

      const lw = bank.filter((q) => q.skill === 'listening_writing');
      const lt = bank.filter((q) => q.skill === 'listening_translation');
      const rs = bank.filter((q) => q.skill === 'reading_speaking');
      const rt = bank.filter((q) => q.skill === 'reading_translation');

      expect(lw.length).toBe(5);
      expect(lt.length).toBe(5);
      expect(rs.length).toBe(5);
      expect(rt.length).toBe(5);
    }
    expect(totalQuestions).toBe(280);
  });

  it('deve sortear exatamente 10 questões no teste com no mínimo 2 de cada uma das 4 habilidades', () => {
    for (let b = 1; b <= 15; b++) {
      const drawn = drawBlockTestQuestions(b);
      expect(drawn.length).toBe(10);

      const counts: Record<string, number> = {
        listening_writing: 0,
        listening_translation: 0,
        reading_speaking: 0,
        reading_translation: 0,
      };

      for (const q of drawn) {
        counts[q.skill] = (counts[q.skill] ?? 0) + 1;
        expect(q.blockNumber).toBe(b);
      }

      expect(counts.listening_writing).toBeGreaterThanOrEqual(2);
      expect(counts.listening_translation).toBeGreaterThanOrEqual(2);
      expect(counts.reading_speaking).toBeGreaterThanOrEqual(2);
      expect(counts.reading_translation).toBeGreaterThanOrEqual(2);
    }
  });

  it('deve avaliar respostas de teste tolerando pontuação, maiúsculas/minúsculas e aceitar variantes registradas', () => {
    const q1 = { ...BLOCK_TESTS_MAP[1][0], skill: 'listening_writing' as const,
      audioText: 'I am a happy student.', acceptedAnswers: ["I'm a happy student."] };
    // q1: "I am a happy student.", variant: "I'm a happy student."
    const evalExact = evaluateBlockTestResponse(q1, 'I am a happy student');
    expect(evalExact.isCorrect).toBe(true);

    const evalVariant = evaluateBlockTestResponse(q1, "i'm a happy student.");
    expect(evalVariant.isCorrect).toBe(true);

    const evalWrong = evaluateBlockTestResponse(q1, 'I am a sad student');
    expect(evalWrong.isCorrect).toBe(false);
  });

  it('deve aceitar traduções equivalentes com artigo opcional, sinônimo e artigo antes de nome próprio', () => {
    const translationQuestion = {
      ...BLOCK_TESTS_MAP[1][0],
      skill: 'reading_translation' as const,
      audioText: 'Pedro is a student in the school.',
      acceptedAnswers: ['Pedro é aluno na escola.'],
    };

    const result = evaluateBlockTestResponse(translationQuestion, 'O Pedro é um estudante na escola.');
    expect(result.isCorrect).toBe(true);
    expect(result.feedback).toContain('sem “the”');
  });

  it('deve tratar a transcrição de fala como orientação, preservando as palavras compreendidas', () => {
    const speakingQuestion = {
      ...BLOCK_TESTS_MAP[1][0],
      skill: 'reading_speaking' as const,
      audioText: 'You are a dog.',
      acceptedAnswers: ['You are a dog.'],
    };

    const result = evaluateBlockTestResponse(speakingQuestion, 'You are a let.');
    expect(result.isCorrect).toBe(true);
    expect(result.accuracyPercent).toBe(75);
    expect(result.wordFeedback?.map((word) => word.status)).toEqual([
      'correct', 'correct', 'correct', 'attention',
    ]);
  });

  it('deve controlar o desbloqueio progressivo de blocos (Bloco 1 sempre liberado, Bloco N exige 10 lições e nota >= 8 no Teste N-1)', () => {
    const email = 'aluno.bloco@gmail.com';
    storageService.addOrUpdateAuthorizedUser({
      email,
      name: 'Aluno Bloco',
      role: 'student',
      active: true,
      tenantId: 'tenant',
      unlockedWeeks: 2,
      passedBlockTests: [],
      createdAt: new Date().toISOString(),
    });

    // Bloco 1 sempre desbloqueado
    expect(storageService.isBlockUnlocked(1, email)).toBe(true);

    // Bloco 2 bloqueado inicialmente
    expect(storageService.isBlockUnlocked(2, email)).toBe(false);

    // Conclui lições 1 a 10
    const studyDays = storageService.getStudyDays();
    for (let d = 1; d <= 10; d++) {
      const lesson = studyDays.find((l) => l.dayNumber === d)!;
      for (const card of lesson.cards) {
        const prog = createInitialSrsProgress(card.id, email, 'tenant');
        prog.stage = 'graduated';
        storageService.saveUserCardSrs(email, prog);
      }
    }

    // Ainda bloqueado porque não fez o Teste 1
    expect(storageService.isBlockUnlocked(2, email)).toBe(false);

    // Realiza Teste 1 com nota 7/10 (Reprovado, exige 8)
    storageService.saveBlockTestResult({
      userEmail: email,
      blockNumber: 1,
      totalQuestions: 10,
      score: 7,
      passed: false,
      attemptDateIso: new Date().toISOString(),
      answers: [],
    });
    expect(storageService.isBlockUnlocked(2, email)).toBe(false);

    // Realiza Teste 1 com nota 8/10 (Aprovado >= 80%)
    storageService.saveBlockTestResult({
      userEmail: email,
      blockNumber: 1,
      totalQuestions: 10,
      score: 8,
      passed: true,
      attemptDateIso: new Date().toISOString(),
      answers: [],
    });
    expect(storageService.isBlockUnlocked(2, email)).toBe(true);
  });

  it('deve aplicar multiplicadores morfológicos de vocabulário (+15% plural, +10% 3ª pessoa, +10% passado) no cálculo de palavras conhecidas', () => {
    const email = 'aluno.vocab@gmail.com';

    // Cadastra 100 palavras básicas (Dia 1 a 10)
    for (let i = 1; i <= 100; i++) {
      storageService.addCustomStudentCard(email, 'word', `word${i}`, `palavra${i}`);
    }
    expect(storageService.getKnownWordsCount(email)).toBe(100);

    // Simula aluno avançando e tendo cards graduados no Dia 35 (desbloqueia plural +s, +15%)
    const day35Lesson = storageService.getStudyDays().find((l) => l.dayNumber === 35);
    if (day35Lesson && day35Lesson.cards.length > 0) {
      const card = day35Lesson.cards[0];
      const prog = createInitialSrsProgress(card.id, email, 'tenant');
      prog.stage = 'graduated';
      storageService.saveUserCardSrs(email, prog);
    }
    // 100 base + 1 card = 101, com +15% plural: round(101 * 1.15) = 116
    expect(storageService.getKnownWordsCount(email)).toBe(116);
  });

  it('deve resetar todo o progresso do usuário através de storageService.resetUserProgress', () => {
    const email = 'lucas.aluno@gmail.com';
    storageService.saveLessonCheckpoint({
      userEmail: email,
      dayNumber: 3,
      title: 'Lição 3',
      queueCardIds: ['c1', 'c2'],
      currentIndex: 1,
      elapsedSeconds: 30,
      answeredCount: 1,
      accuracySum: 100,
      newWordsCountInLesson: 6,
      updatedAtIso: '2026-11-06T10:00:00Z',
    });
    storageService.recordDailyActivity(email, { completedDayNumber: 1, newCardsDelta: 10 });
    storageService.saveBlockTestResult({
      blockNumber: 1,
      userEmail: email,
      score: 9,
      totalQuestions: 10,
      passed: true,
      attemptDateIso: '2026-11-06T11:00:00Z',
      answers: [],
    });

    expect(storageService.getLessonCheckpoint(email)).not.toBeNull();
    expect(storageService.getPassedBlockTests(email)).toContain(1);
    expect(Object.keys(storageService.getUserCalendarActivities(email)).length).toBeGreaterThan(0);

    storageService.resetUserProgress(email);

    expect(storageService.getLessonCheckpoint(email)).toBeNull();
    expect(storageService.getPassedBlockTests(email)).toHaveLength(0);
    expect(storageService.getUserSrsMap(email)).toEqual({});
    expect(storageService.getBlockTestResults(email)).toHaveLength(0);
    expect(storageService.getUserCalendarActivities(email)).toEqual({});
  });

  it('deve excluir cards do tipo grammar da fila ativa de estudo retornada por getLessonQueueForUser', () => {
    const email = 'grammar.test@gmail.com';
    const day1 = storageService.getStudyDays().find((d) => d.dayNumber === 1)!;
    expect(day1.cards.some((c) => c.type === 'grammar')).toBe(true);

    const { queue } = storageService.getLessonQueueForUser(email, day1);
    expect(queue.some((c) => c.type === 'grammar')).toBe(false);
    expect(queue).toHaveLength(11);
  });
});
