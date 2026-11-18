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
  it('mantém títulos e sequência dos cards das lições 1 a 20 iguais ao roteiro revisado', () => {
    const plan = readFileSync('roteiro_a1_v2.md', 'utf8');
    for (let number = 1; number <= 20; number++) {
      const heading = new RegExp(`^### Lição ${number} — (.+)$`, 'm').exec(plan)!;
      const start = heading.index + heading[0].length;
      const end = plan.slice(start).search(/^### |^# BLOCO /m);
      const section = plan.slice(start, end < 0 ? undefined : start + end);
      const expected = [...section.matchAll(/^\d+\. `\[(Palavra|Frase|Diálogo|Gramática)\]` \*\*(.+?)\*\*(?: — (.+?))?$/gm)]
        .map((match) => ({
          type: { Palavra: 'word', Frase: 'phrase', Diálogo: 'dialogue', Gramática: 'grammar' }[match[1]],
          english: match[2],
          portuguese: (match[3] || '').replace(/\s+`\[Ver palavra: .+?\]`$/, ''),
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
    expect(lesson8.cards.map((c) => c.english)).toContain('I am in the house.');
    expect(lesson8.cards.map((c) => c.english)).toContain('You are on the bus.');

    const lesson24 = INITIAL_STUDY_DAYS.find((d) => d.dayNumber === 24)!;
    expect(lesson24.cards.map((c) => c.english)).toContain('Living room');
    expect(lesson24.cards.map((c) => c.english)).toContain('My father is in the living room.');
  });

  it('deve seguir a sequência revisada da lição 1', () => {
    const day1 = INITIAL_STUDY_DAYS.find((d) => d.dayNumber === 1)!;
    expect(day1).toBeDefined();
    expect(day1.cards.slice(0, 10).map((c) => c.english)).toEqual([
      'The',
      'Apple',
      'The apple.',
      'Orange',
      'The orange.',
      'And',
      'The apple and the orange.',
      'Boy',
      'The boy.',
      'The boy and the girl.',
    ]);
    expect(day1.cards[10].type).toBe('grammar');
  });

  it('não adiciona explicações gramaticais às lições revisadas de fixação', () => {
    for (const number of [3, 6, 9, 13, 16, 19]) {
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
    for (const prefix of ['i am', 'you are', 'he is', 'she is', 'it is', 'we are', 'they are']) {
      expect(sentences.some((sentence) => sentence.startsWith(`${prefix} `))).toBe(true);
    }
  });

  it('não repete no banco 10x frases estudadas no primeiro bloco', () => {
    const plan = readFileSync('roteiro_a1_v2.md', 'utf8');
    const section = plan.split('### Lição 10x —')[1].split('# BLOCO 2')[0];
    const unseen = [...section.matchAll(/^\d+\. `\[Frase inédita\]` \*\*(.+?)\*\*/gm)]
      .map((match) => match[1].toLowerCase());
    const studied = new Set(INITIAL_STUDY_DAYS.slice(0, 10)
      .flatMap((lesson) => lesson.cards)
      .filter((card) => card.type === 'phrase')
      .map((card) => card.english.toLowerCase()));
    expect(unseen).toHaveLength(10);
    expect(new Set(unseen).size).toBe(10);
    expect(unseen.filter((sentence) => studied.has(sentence))).toEqual([]);
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
    expect(a1Lessons.length).toBe(150);
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
    expect(queue[1].english).toBe('I am a student.');
  });

  it('deve atualizar as lições revisadas do Bloco 5 preservando progresso de cards idênticos e cards personalizados', () => {
    const storedDays = storageService.getStudyDays();
    const lesson41 = storedDays.find((day) => day.dayNumber === 41)!;
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
      JSON.stringify(storedDays.map((day) => (day.dayNumber === 41 ? outdatedLesson : day)))
    );
    localStorage.removeItem('ztf_curriculum_revision');
    const progress = createInitialSrsProgress(
      unchangedCard.id,
      'julia.aluna@gmail.com',
      unchangedCard.tenantId,
      '2026-11-06'
    );
    storageService.saveUserCardSrs('julia.aluna@gmail.com', progress);

    const migratedLesson = storageService.getStudyDays().find((day) => day.dayNumber === 41)!;
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
      const apple = migrated.cards.find((card) => card.english === 'Apple')!;
      expect(apple.id).not.toBe(changed.id);
      expect(storageService.getUserSrsMap(email)[apple.id]).toBeUndefined();
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
    expect(storageService.getFollowingLesson(150)).toBeNull();
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
    const applePhraseCard = lesson1.cards.find((c) => c.english === 'The apple.')!;

    const report = storageService.submitTranslationReport({
      cardId: applePhraseCard.id,
      lessonNumber: 1,
      english: 'The apple.',
      currentPortuguese: applePhraseCard.portuguese,
      studentTypedPortuguese: 'A maçã fresca.',
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
    expect(updatedCard.portuguese).toContain('A maçã fresca.');

    const correspondence = evaluateLetterCorrespondence('A maçã fresca', updatedCard.portuguese);
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
    expect(INITIAL_STUDY_DAYS.length).toBe(150);

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
    for (let b = 1; b <= 15; b++) {
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
    expect(totalQuestions).toBe(300);
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
    const q1 = BLOCK_TESTS_MAP[1].find((q) => q.qNum === 2)!;
    // q1: "I am a happy student.", variant: "I'm a happy student."
    const evalExact = evaluateBlockTestResponse(q1, 'I am a happy student');
    expect(evalExact.isCorrect).toBe(true);

    const evalVariant = evaluateBlockTestResponse(q1, "i'm a happy student.");
    expect(evalVariant.isCorrect).toBe(true);

    const evalWrong = evaluateBlockTestResponse(q1, 'I am a sad student');
    expect(evalWrong.isCorrect).toBe(false);
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
    expect(queue).toHaveLength(10); // 6 words + 4 phrases = 10 cards
  });
});
