import { StudyDayLesson, Flashcard, CefrLevel } from '../types';
import { REVIEWED_A1_LESSONS } from './reviewedA1Lessons';
import { BLOCK_ONE_LESSONS } from './blockOneLessons';

/**
 * Currículo Pedagógico Estruturado 100% Construtivo Nível A1 (150 Lições, 15 Blocos, 1.500+ Palavras).
 *
 * Regras estritas:
 * 1. Cadência de no máximo 2 cards de Palavra antes de Frase de fixação imediata.
 * 2. Sentenças atômicas, sem sobrecarga ou frases compostas nos estágios iniciais.
 * 3. Realismo comunicativo e coerência de diálogos nativos.
 * 4. 15 Textos de Fechamento Contextualizados (Descrições, Relatos, Histórias e Diálogos).
 * 5. Multiplicadores morfológicos (Plural +s, 3ª pessoa singular, Passado regular -ed).
 */

const TENANT_ID = 'default-teacher-tenant';
const CURRICULUM_CARD_REVISION_BY_DAY: Partial<Record<number, string>> = {
  41: 'b5r1',
  42: 'b5r1',
  43: 'b5r1',
  44: 'b5r1',
  45: 'b5r1',
  46: 'b5r1',
};

function makeCard(
  dayNumber: number,
  orderInDay: number,
  data: Omit<Flashcard, 'id' | 'tenantId' | 'dayNumber' | 'orderInDay'>
): Flashcard {
  return {
    id: `day-${dayNumber}-card-${orderInDay}${CURRICULUM_CARD_REVISION_BY_DAY[dayNumber] ? `-${CURRICULUM_CARD_REVISION_BY_DAY[dayNumber]}` : ''}`,
    tenantId: TENANT_ID,
    dayNumber,
    orderInDay,
    ...data,
  };
}


export interface CefrGrammarTopic {
  topic: string;
  whatToLearn: string;
}

export interface CefrLevelCurriculumPlan {
  level: CefrLevel;
  title: string;
  subtitle: string;
  description: string;
  targetNewWordsInLevel: number;
  cumulativeWords: number;
  equivalentStudyDaysInLevel: number;
  cumulativeStudyDays: number;
  grammarContents: CefrGrammarTopic[];
  expectedOutcomes: string[];
}

export interface GrammarRoadmapModule {
  moduleNumber: number;
  daysRange: string;
  title: string;
  grammarTopics: string[];
  dialogueAndStoryCheckpoints: string[];
  recommendedInsertAfterDay: number;
}

export const CEFR_CURRICULUM_PLAN_A1_TO_C2: CefrLevelCurriculumPlan[] = [
  {
    level: 'A1',
    title: 'A1 — Iniciante (Fundamentos)',
    subtitle: 'Primeiras 600 palavras e phrasal verbs básicos (60 Dias de Estudo)',
    description:
      'O aluno aprende a construir frases simples, identificar elementos da frase e falar sobre si mesmo, apresentando-se e comunicando-se em necessidades imediatas.',
    targetNewWordsInLevel: 1500, cumulativeWords: 1500, equivalentStudyDaysInLevel: 150, cumulativeStudyDays: 150,
    grammarContents: [
      { topic: 'Articles', whatToLearn: 'A, an (regra real pelo som), the' },
      { topic: 'Personal pronouns', whatToLearn: 'I, you, he, she, it, we, you guys, they' },
      { topic: 'Prepositions of place', whatToLearn: 'In, on, under, behind, next to (divididas em partes ao longo do módulo)' },
      { topic: 'Verb to be (Afirmativa e Negativa)', whatToLearn: 'Am, is, are; afirmativa e negativa (em lições separadas)' },
      { topic: 'Prepositions (with, from, at, for, of, near)', whatToLearn: 'Conexão, origem, local específico, finalidade, posse e proximidade' },
      { topic: 'Verb to be (Interrogativa)', whatToLearn: 'Am, is, are; interrogativa' },
      { topic: 'Possessive adjectives', whatToLearn: 'My, your, his, her, its, our, their' },
      { topic: 'Plural nouns', whatToLearn: 'Regular e irregular (books, men, women, children)' },
      { topic: 'Demonstratives', whatToLearn: 'This, that, these, those' },
      { topic: 'There is / There are', whatToLearn: 'Existência de coisas no singular e plural' },
      { topic: 'Question words', whatToLearn: 'What, where, when, who, why (because), how' },
      { topic: 'Verb to have', whatToLearn: 'Have, has (posse, família e objetos)' },
      { topic: 'Simple Present', whatToLearn: 'Rotinas e hábitos cotidianos' },
      { topic: 'Do / Does', whatToLearn: 'Perguntas e negativas no presente' },
      { topic: 'Third person', whatToLearn: 'Regras de he, she, it: likes, studies, goes' },
      { topic: 'Imperatives', whatToLearn: 'Open the door, don\'t speak' },
      { topic: 'Prepositions of time', whatToLearn: 'In, on, at' },
      { topic: "Possessive 's", whatToLearn: "John's car, Mary's house" },
      { topic: "Can / Can't", whatToLearn: 'Habilidades e permissões' },
      { topic: 'Basic adjectives', whatToLearn: 'Big, small, beautiful, expensive, cheap, good, bad, happy, sad, new' },
      { topic: 'Countable / Uncountable', whatToLearn: 'Some, any, a/an, basic quantifiers' },
      { topic: "Like / Don't like", whatToLearn: 'Preferências pessoais' },
    ],
    expectedOutcomes: [
      'Apresentar-se e apresentar outras pessoas.',
      'Falar sobre família, objetos, profissões e nacionalidades.',
      'Descrever sua rotina.',
      'Fazer perguntas básicas.',
      'Construir frases afirmativas, negativas e interrogativas simples.',
      'Comunicar-se nos 5 ambientes prioritários (Escola, Em Casa, Praça/Parque, Shopping/Roupas e Restaurante) no nível A1.',
    ],
  },
  {
    level: 'A2',
    title: 'A2 — Básico (Expansão da Comunicação)',
    subtitle: '+900 palavras novas (Total acumulado: 1.500 palavras • 150 Dias de Estudo)',
    description:
      'O aluno começa a falar sobre acontecimentos passados, planos futuros, comparações e situações cotidianas com mais detalhes.',
    targetNewWordsInLevel: 900,
    cumulativeWords: 1500,
    equivalentStudyDaysInLevel: 90,
    cumulativeStudyDays: 150,
    grammarContents: [
      { topic: 'Simple Past', whatToLearn: 'Verbos regulares (+ed, +d, +ied) e irregulares' },
      { topic: 'Was / Were', whatToLearn: 'Passado do verbo to be (afirmativa, negativa e pergunta)' },
      { topic: "Did / Didn't", whatToLearn: 'Perguntas e negativas no passado' },
      { topic: 'Past Continuous', whatToLearn: 'Ações em andamento no passado (was/were + -ing)' },
      { topic: 'Future with Going to', whatToLearn: 'Planos e intenções' },
      { topic: 'Future with Will', whatToLearn: 'Previsões e decisões espontâneas' },
      { topic: 'Present Continuous', whatToLearn: 'Ações acontecendo agora' },
      { topic: 'Present Continuous for future', whatToLearn: 'Compromissos e planos agendados' },
      { topic: 'Comparatives', whatToLearn: 'Bigger, more expensive, better, worse' },
      { topic: 'Superlatives', whatToLearn: 'The biggest, the most expensive, the best' },
      { topic: 'Adverbs of frequency', whatToLearn: 'Always, usually, sometimes, never' },
      { topic: 'Object pronouns', whatToLearn: 'Me, him, her, us, them' },
      { topic: 'Possessive pronouns', whatToLearn: 'Mine, yours, his, hers, ours, theirs' },
      { topic: 'Modal verbs', whatToLearn: "Must, mustn't, should, shouldn't" },
      { topic: "Have to / Don't have to", whatToLearn: 'Obrigação e ausência de obrigação' },
      { topic: 'Quantifiers', whatToLearn: 'Much, many, a lot of, few, little' },
      { topic: 'Too / Enough', whatToLearn: 'Excesso e suficiência' },
      { topic: 'Infinitive of purpose', whatToLearn: 'I study to learn English' },
      { topic: 'Gerund (introdução)', whatToLearn: 'I enjoy swimming' },
      { topic: 'Conjunctions', whatToLearn: 'And, but, because, so' },
      { topic: 'Prepositions', whatToLearn: 'Movement, direction and time' },
    ],
    expectedOutcomes: [
      'Contar acontecimentos passados.',
      'Falar sobre planos e intenções.',
      'Comparar pessoas, objetos e lugares.',
      'Dar conselhos e expressar obrigações.',
      'Descrever experiências cotidianas com mais detalhes.',
    ],
  },
  {
    level: 'B1',
    title: 'B1 — Intermediário (Independência Linguística)',
    subtitle: '+1.500 palavras novas (Total acumulado: 3.000 palavras • 300 Dias de Estudo)',
    description:
      'O aluno constrói discursos mais elaborados, conecta ideias e compreende relações temporais, experiências e hipóteses condicionais.',
    targetNewWordsInLevel: 1500,
    cumulativeWords: 3000,
    equivalentStudyDaysInLevel: 150,
    cumulativeStudyDays: 300,
    grammarContents: [
      { topic: 'Present Perfect', whatToLearn: 'Experiências e acontecimentos com relação ao presente' },
      { topic: 'Present Perfect vs Simple Past', whatToLearn: 'Diferenças práticas de uso' },
      { topic: 'Present Perfect Continuous', whatToLearn: 'Ações iniciadas no passado e ainda em andamento' },
      { topic: 'Past Perfect', whatToLearn: 'Ações anteriores a outras ações passadas (had + particípio)' },
      { topic: 'Past Continuous vs Simple Past', whatToLearn: 'Ações simultâneas e interrupções (when / while)' },
      { topic: 'Future Continuous', whatToLearn: 'Ações em andamento no futuro (will be + -ing)' },
      { topic: 'First Conditional', whatToLearn: 'If it rains, I will stay home' },
      { topic: 'Second Conditional', whatToLearn: 'If I had money, I would travel' },
      { topic: 'Zero Conditional', whatToLearn: 'Fatos e verdades gerais' },
      { topic: 'Modal verbs', whatToLearn: 'May, might, could, would' },
      { topic: 'Modal verbs of deduction', whatToLearn: "Must, might, can't" },
      { topic: 'Passive Voice', whatToLearn: 'Voz passiva nos tempos mais comuns' },
      { topic: 'Reported Speech', whatToLearn: 'Discurso indireto básico' },
      { topic: 'Relative Clauses', whatToLearn: 'Who, which, that, where' },
      { topic: 'Gerund vs Infinitive', whatToLearn: 'Enjoy doing / want to do' },
      { topic: 'Used to', whatToLearn: 'Hábitos e estados do passado' },
      { topic: 'Would for past habits', whatToLearn: 'Hábitos recorrentes no passado' },
      { topic: 'Phrasal verbs', whatToLearn: 'Introdução sistemática aos verbos frasais' },
      { topic: 'Question tags', whatToLearn: "Isn't it? Don't you?" },
      { topic: 'Reflexive pronouns', whatToLearn: 'Myself, yourself, themselves' },
      { topic: 'Adverbs of manner', whatToLearn: 'Quickly, carefully, easily' },
      { topic: 'Connectors', whatToLearn: 'Although, however, therefore, while' },
    ],
    expectedOutcomes: [
      'Narrar acontecimentos com maior complexidade.',
      'Falar sobre experiências pessoais.',
      'Expressar hipóteses e possibilidades.',
      'Explicar opiniões e justificá-las.',
      'Compreender textos e conversas sobre assuntos familiares.',
    ],
  },
  {
    level: 'B2',
    title: 'B2 — Intermediário Superior (Fluência Funcional e Argumentação)',
    subtitle: '+2.000 palavras novas (Total acumulado: 5.000 palavras • 500 Dias de Estudo)',
    description:
      'O aluno utiliza estruturas complexas com espontaneidade para defender argumentos, discutir temas abstratos e conversar naturalmente com nativos.',
    targetNewWordsInLevel: 2000,
    cumulativeWords: 5000,
    equivalentStudyDaysInLevel: 200,
    cumulativeStudyDays: 500,
    grammarContents: [
      { topic: 'Present Perfect Continuous', whatToLearn: 'Usos avançados e contrastes' },
      { topic: 'Past Perfect Continuous', whatToLearn: 'Duração de ações anteriores a outras no passado' },
      { topic: 'Future Perfect', whatToLearn: 'Ações concluídas até determinado momento futuro' },
      { topic: 'Future Perfect Continuous', whatToLearn: 'Duração até um ponto futuro' },
      { topic: 'Third Conditional', whatToLearn: 'If I had studied, I would have passed' },
      { topic: 'Mixed Conditionals', whatToLearn: 'Mistura de condições e resultados em tempos diferentes' },
      { topic: 'Advanced Passive Voice', whatToLearn: 'Passive em diferentes tempos e estruturas' },
      { topic: 'Causative Form', whatToLearn: 'Have / get something done' },
      { topic: 'Reported Speech', whatToLearn: 'Mudanças de tempos, pronomes e expressões' },
      { topic: 'Reporting verbs', whatToLearn: 'Suggest, admit, deny, recommend' },
      { topic: 'Advanced Relative Clauses', whatToLearn: 'Defining e non-defining clauses' },
      { topic: 'Reduced Relative Clauses', whatToLearn: 'Redução de orações relativas' },
      { topic: 'Wish / If only', whatToLearn: 'Desejos e arrependimentos' },
      { topic: 'Modal verbs in the past', whatToLearn: 'Should have, must have, might have, could have' },
      { topic: 'Inversion (introdução)', whatToLearn: 'Never have I seen...' },
      { topic: 'Participle clauses', whatToLearn: 'Having finished, feeling tired...' },
      { topic: 'Advanced Gerund / Infinitive', whatToLearn: 'Diferenças de significado e estruturas' },
      { topic: 'Advanced phrasal verbs', whatToLearn: 'Phrasal verbs separáveis, inseparáveis e seus usos' },
      { topic: 'Linking devices', whatToLearn: 'Nevertheless, furthermore, consequently' },
      { topic: 'Ellipsis and substitution', whatToLearn: 'So do I, neither do I, do so' },
    ],
    expectedOutcomes: [
      'Defender opiniões e argumentar.',
      'Participar de discussões mais complexas.',
      'Compreender textos técnicos e acadêmicos de dificuldade moderada.',
      'Expressar hipóteses, críticas e arrependimentos.',
      'Utilizar diferentes estruturas gramaticais com naturalidade.',
    ],
  },
  {
    level: 'C1',
    title: 'C1 — Avançado (Precisão, Nuances e Flexibilidade)',
    subtitle: '+2.500 palavras novas (Total acumulado: 7.500 palavras • 750 Dias de Estudo)',
    description:
      'O foco passa a ser dominar nuances, registros acadêmicos/profissionais, construções sofisticadas, collocations e expressões idiomáticas.',
    targetNewWordsInLevel: 2500,
    cumulativeWords: 7500,
    equivalentStudyDaysInLevel: 250,
    cumulativeStudyDays: 750,
    grammarContents: [
      { topic: 'Advanced inversion', whatToLearn: 'Little did I know, Had I known...' },
      { topic: 'Cleft sentences', whatToLearn: 'What I need is... / It was John who...' },
      { topic: 'Advanced conditionals', whatToLearn: 'Inversões condicionais e estruturas implícitas' },
      { topic: 'Subjunctive', whatToLearn: 'I suggest that he be present' },
      { topic: 'Advanced modal verbs', whatToLearn: 'Nuances de certeza, obrigação e possibilidade' },
      { topic: 'Advanced passive constructions', whatToLearn: 'Passive reporting: He is said to...' },
      { topic: 'Nominalisation', whatToLearn: 'Transformar verbos e adjetivos em substantivos' },
      { topic: 'Complex noun phrases', whatToLearn: 'Estruturas nominais complexas' },
      { topic: 'Advanced participle clauses', whatToLearn: 'Construções reduzidas e relações lógicas' },
      { topic: 'Advanced discourse markers', whatToLearn: 'Whereas, notwithstanding, albeit' },
      { topic: 'Hedging', whatToLearn: 'It seems that, arguably, to some extent' },
      { topic: 'Advanced reporting structures', whatToLearn: 'Reporting verbs e padrões sintáticos' },
      { topic: 'Collocations', whatToLearn: 'Make a decision, take responsibility' },
      { topic: 'Idiomatic expressions', whatToLearn: 'Expressões idiomáticas naturais' },
      { topic: 'Register', whatToLearn: 'Linguagem formal, informal e acadêmica' },
      { topic: 'Advanced word order', whatToLearn: 'Ênfase e organização das informações' },
    ],
    expectedOutcomes: [
      'Participar de debates complexos.',
      'Produzir textos acadêmicos e profissionais.',
      'Compreender linguagem implícita e nuances.',
      'Adaptar a linguagem ao contexto.',
      'Expressar ideias complexas com precisão.',
    ],
  },
  {
    level: 'C2',
    title: 'C2 — Proficiência (Domínio Pleno do Idioma — 10.000 Palavras)',
    subtitle: '+2.500 palavras, phrasal verbs e expressões (Total: 10.000 palavras • 1.000 Dias de Estudo)',
    description:
      'Domínio do idioma com extrema flexibilidade, precisão lexical, compreensão de ironias, duplo sentido, retórica e textos complexos.',
    targetNewWordsInLevel: 2500,
    cumulativeWords: 10000,
    equivalentStudyDaysInLevel: 250,
    cumulativeStudyDays: 1000,
    grammarContents: [
      { topic: 'Stylistic inversion', whatToLearn: 'Inversões para efeitos retóricos e estilísticos' },
      { topic: 'Advanced subjunctive', whatToLearn: 'Construções formais e expressões fixas' },
      { topic: 'Ellipsis', whatToLearn: 'Omissões sofisticadas sem perda de compreensão' },
      { topic: 'Discourse cohesion', whatToLearn: 'Coesão e coerência em textos complexos' },
      { topic: 'Advanced idioms', whatToLearn: 'Expressões idiomáticas e coloquialismos' },
      { topic: 'Nuanced modal usage', whatToLearn: 'Nuances de modalidade e intenção' },
      { topic: 'Register variation', whatToLearn: 'Alternância entre registros e estilos' },
      { topic: 'Complex syntax', whatToLearn: 'Períodos longos e estruturas sintáticas sofisticadas' },
      { topic: 'Rhetorical devices', whatToLearn: 'Ênfase, paralelismo e construções retóricas' },
      { topic: 'Lexical precision', whatToLearn: 'Escolha de palavras com diferenças sutis de significado' },
      { topic: 'Ambiguity', whatToLearn: 'Identificação e uso consciente de ambiguidades' },
      { topic: 'Proverbial expressions', whatToLearn: 'Provérbios e expressões culturais' },
    ],
    expectedOutcomes: [
      'Compreender praticamente tudo o que lê ou ouve.',
      'Expressar-se espontaneamente e com precisão.',
      'Compreender ironias, humor, duplo sentido e referências culturais.',
      'Adaptar seu discurso a praticamente qualquer contexto.',
      'Produzir textos sofisticados e bem estruturados.',
    ],
  },
];

export interface GrammarRoadmapModule {
  moduleNumber: number;
  daysRange: string;
  title: string;
  grammarTopics: string[];
  dialogueAndStoryCheckpoints: string[];
  recommendedInsertAfterDay: number;
}

export const GRAMMAR_ROADMAP_100_DAYS: GrammarRoadmapModule[] = [
  {
    moduleNumber: 1,
    daysRange: 'Dias 1 a 14',
    title: 'Módulo 1 — Base Nominal, Preposições, Verbo To Be Completo e Wh- Questions',
    grammarTopics: [
      'Dia 1: Artigo Definido (The) e Conjunção (And) + 4 substantivos (girl, boy, man, woman)',
      'Dia 2: Artigos Indefinidos (A / An + Regra Real por Som) + 4 substantivos (book, apple, table, arm)',
      'Dia 3: Preposições de Lugar (In, On, Under) + 3 substantivos (box, car, dog)',
      'Dia 4: Verbo To Be (I am, You are) — ser vs estar no contexto + 2 substantivos (house, student)',
      'Dia 5: Verbo To Be Singular (He is, She is, It is) + 2 substantivos (doctor, friend)',
      'Dia 6: Verbo To Be Plural (We are, You guys are, They are) + 2 substantivos (room, park)',
      'Dia 7: Negação no Verbo To Be (Not) + Adjetivos (good, bad, happy, sad) + 2 substantivos (city, school)',
      'Dias 8 e 9: Demais Preposições Essenciais (at, to, from, with, for, of, near, beside) + novos substantivos e adjetivos',
      'Dias 10 e 11: Forma Interrogativa no Verbo To Be (Am I...?, Are you...?, Is he/she/it...?, Are they...?)',
      'Dias 12 a 14: Palavras de Pergunta (What, Where, Who, How, Why, When) combinadas com To Be',
    ],
    dialogueAndStoryCheckpoints: [
      'Diálogo Casual 1 (Após Dia 14): Apresentação, perguntar o nome, de onde é, falar sobre si mesmo e perguntar sobre a outra pessoa.',
      'Diálogo 2 (Após Dia 14): Conversa na Escola / Faculdade e na Praça.',
    ],
    recommendedInsertAfterDay: 14,
  },
  {
    moduleNumber: 2,
    daysRange: 'Dias 15 a 22',
    title: 'Módulo 2 — Plurais dos Substantivos, Demonstrativos e Possessivos',
    grammarTopics: [
      'Dias 15 e 16: Plural Regular (+s, +es) e Irregulares (man → men, woman → women, child → children) + There is / There are',
      'Dias 17 e 18: Pronomes Demonstrativos no Singular e Plural (This, That, These, Those)',
      'Dias 19 a 21: Adjetivos Possessivos (my, your, his, her, our, their) e Pronomes Objeto (me, him, her, us, them)',
      'Dia 22: Caso Genitivo de Posse (\'s — The boy\'s book)',
    ],
    dialogueAndStoryCheckpoints: [
      'Diálogo 3 (Após Dia 22): Em Casa — na Cozinha, no Quarto e na Sala de Estar.',
    ],
    recommendedInsertAfterDay: 22,
  },
  {
    moduleNumber: 3,
    daysRange: 'Dias 23 a 36',
    title: 'Módulo 3 — Simple Present (Have/Has, Do/Does, Regra do -S na 3ª Pessoa)',
    grammarTopics: [
      'Dias 23 e 24: Verbo Have (I/You/We/They have) e 3ª pessoa Has (He/She/It has)',
      'Dias 25 e 26: Verbo Do e 3ª pessoa Does (como verbo principal e auxiliar)',
      'Dias 27 a 29: Verbos de Ação no Presente + Regra de adicionar -S na 3ª pessoa (run → runs, work → works, eat → eats)',
      'Dia 30: Regras especiais da 3ª pessoa (go → goes, watch → watches, study → studies)',
      'Dias 31 e 32: Negação no Simple Present (don\'t e doesn\'t)',
      'Dias 33 e 34: Interrogativa no Simple Present (Do you...?, Does he...?, Where do you...?)',
      'Dias 35 e 36: Advérbios de Frequência (always, often, sometimes, never) e Rotina',
    ],
    dialogueAndStoryCheckpoints: [
      'Diálogo 4 (Após Dia 36): No Mercado e Feira de Frutas.',
      'Diálogo 5 (Após Dia 36): Na Farmácia.',
      '1ª Fábula Curta no Presente (1 a 2 dias + 1 Dia Preparatório i+1).',
    ],
    recommendedInsertAfterDay: 36,
  },
  {
    moduleNumber: 4,
    daysRange: 'Dias 37 a 46',
    title: 'Módulo 4 — Verbos Modais (Can, Would, Should), Want to / Need to e Imperativo',
    grammarTopics: [
      'Dias 37 a 39: Modal Can e Can\'t (habilidade, permissão e pedidos)',
      'Dias 40 e 41: Verbos conectados com "to" (want to, need to, have to, like to)',
      'Dias 42 e 43: Pedidos educados com Would like e conselhos com Should',
      'Dias 44 a 46: Imperativo e Phrasal Verbs de cotidiano (Come in, Sit down, Turn on, Turn off, Wake up)',
    ],
    dialogueAndStoryCheckpoints: [
      'Diálogo 6 (Após Dia 46): No Aeroporto e Viagem.',
      'Diálogo 7 (Após Dia 46): No Hotel e Restaurante.',
      'Diálogo 8 (Após Dia 46): No Hospital / Médico e Reunião de Negócios.',
    ],
    recommendedInsertAfterDay: 46,
  },
  {
    moduleNumber: 5,
    daysRange: 'Dias 47 a 54',
    title: 'Módulo 5 — Present Continuous e Gerúndio (-ING)',
    grammarTopics: [
      'Dias 47 a 50: To Be + Verbo com -ING (I am working, She is talking, What are you doing?)',
      'Dias 51 a 54: Negação, Perguntas e contraste Simple Present vs Present Continuous',
    ],
    dialogueAndStoryCheckpoints: [
      'Diálogo 9 (Após Dia 54): Ligação telefônica e descrevendo ações ao vivo.',
    ],
    recommendedInsertAfterDay: 54,
  },
  {
    moduleNumber: 6,
    daysRange: 'Dias 55 a 70',
    title: 'Módulo 6 — Simple Past Completo (To Be, Regulares +D/+ED/+IED e Irregulares)',
    grammarTopics: [
      'Dias 55 a 57:Verbo To Be no Passado — Afirmativa (was/were), Negativa (wasn\'t/weren\'t) e Interrogativa (Was he...? / Where were you?)',
      'Dias 58 e 59: Passado Regular Regra 1 (+ED: look → looked, work → worked, play → played) + yesterday',
      'Dias 60 e 61: Passado Regular Regra 2 (+D: like → liked, live → lived, close → closed)',
      'Dias 62 e 63: Passado Regular Regra 3 (Consoante + Y → -IED: study → studied, try → tried, cry → cried)',
      'Dias 64 a 67: Passado Irregular (go → went, see → saw, run → ran, send → sent, make → made, come → came, have → had)',
      'Dias 68 a 70: Negação (didn\'t) e Perguntas no Passado (Did you...? / What did you do yesterday?)',
    ],
    dialogueAndStoryCheckpoints: [
      'Fábulas Clássicas e Histórias do YouTube no Passado (Após Dia 70): Curtas (1-2 dias), Médias (3-5 dias) e Longas (6+ dias) com Dia Preparatório i+1.',
    ],
    recommendedInsertAfterDay: 70,
  },
  {
    moduleNumber: 7,
    daysRange: 'Dias 71 a 80',
    title: 'Módulo 7 — Futuro (To Be + Going to e Will / Won\'t)',
    grammarTopics: [
      'Dias 71 a 74: Futuro Planejado (I am going to work, Are you going to travel?)',
      'Dias 75 a 78: Futuro Simples com Will / Won\'t (I will help you, Will you come tomorrow?)',
      'Dias 79 e 80: Revisão Integrada Passado × Presente × Futuro',
    ],
    dialogueAndStoryCheckpoints: [
      'Diálogo 10 (Após Dia 80): Planejando férias, viagens e metas.',
    ],
    recommendedInsertAfterDay: 80,
  },
  {
    moduleNumber: 8,
    daysRange: 'Dias 81 a 88',
    title: 'Módulo 8 — Comparativos, Superlativos e Quantificadores',
    grammarTopics: [
      'Dias 81 a 83: Comparativos (-er than, more ... than, better, worse)',
      'Dias 84 a 86: Superlativos (the -est, the most ..., the best, the worst)',
      'Dias 87 e 88: Quantificadores (much, many, some, any, a lot of, enough, too)',
    ],
    dialogueAndStoryCheckpoints: [
      'Diálogo 11 (Após Dia 88): Compras, negociação e comparação de produtos.',
    ],
    recommendedInsertAfterDay: 88,
  },
  {
    moduleNumber: 9,
    daysRange: 'Dias 89 a 96',
    title: 'Módulo 9 — Present Perfect e Particípio Passado',
    grammarTopics: [
      'Dias 89 a 92: Have/Has + Particípio (been, done, gone, seen, eaten, written, read)',
      'Dias 93 a 96: Uso com already, yet, just, ever, never, since e for',
    ],
    dialogueAndStoryCheckpoints: [
      'Diálogo 12 (Após Dia 96): Entrevista de emprego e experiências de vida.',
    ],
    recommendedInsertAfterDay: 96,
  },
  {
    moduleNumber: 10,
    daysRange: 'Dias 97 a 100+',
    title: 'Módulo 10 — Condicionais (If / Would), Conectivos Avançados e Histórias Longas',
    grammarTopics: [
      'Dias 97 e 98: First & Second Conditionals (If I have time, I will... / If I had money, I would...)',
      'Dias 99 e 100: Conectivos Avançados (although, despite, however, therefore) e Fluência em Vídeos',
    ],
    dialogueAndStoryCheckpoints: [
      'Histórias Longas (6+ dias) e Vídeos Completos.',
    ],
    recommendedInsertAfterDay: 100,
  },
];

const ORIGINAL_STUDY_DAYS: StudyDayLesson[] = [
  {
    dayNumber: 1,
    weekNumber: 1,
    blockNumber: 1,
    cefrLevel: 'A1',
    title: "Lição 1 — Artigo Definido \"The\" e Conjunção \"And\"",
    subtitle: "Identificação com substantivos regulares e com vogal",
    grammarFocus: "Artigo definido The (o, a, os, as) antes de consoante e vogal, e conjunção And.",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(1, 1, {
              "type": "word",
              "english": "The",
              "portuguese": "O, a, os, as"
      }),
      makeCard(1, 2, {
              "type": "word",
              "english": "Apple",
              "portuguese": "Maçã"
      }),
      makeCard(1, 3, {
              "type": "phrase",
              "english": "The apple.",
              "portuguese": "A maçã."
      }),
      makeCard(1, 4, {
              "type": "word",
              "english": "Orange",
              "portuguese": "Laranja"
      }),
      makeCard(1, 5, {
              "type": "word",
              "english": "And",
              "portuguese": "E"
      }),
      makeCard(1, 6, {
              "type": "phrase",
              "english": "The orange.",
              "portuguese": "A laranja."
      }),
      makeCard(1, 7, {
              "type": "word",
              "english": "Boy",
              "portuguese": "Menino, garoto"
      }),
      makeCard(1, 8, {
              "type": "word",
              "english": "Girl",
              "portuguese": "Menina, garota"
      }),
      makeCard(1, 9, {
              "type": "phrase",
              "english": "The apple and the orange.",
              "portuguese": "A maçã e a laranja."
      }),
      makeCard(1, 10, {
              "type": "phrase",
              "english": "The boy and the girl.",
              "portuguese": "O menino e a menina."
      }),
      makeCard(1, 11, {
              "type": "grammar",
              "english": "Gramática — Lição 1: O Artigo Definido \"The\" e a Conjunção \"And\"",
              "portuguese": "O artigo *The* serve tanto para o singular quanto para o plural, masculino e feminino (*o, a, os, as*). Antes de palavras iniciadas por som de vogal (*the apple*, *the orange*), sua pronúncia se torna sutilmente /ðiː/. A conjunção *And* une elementos na frase.",
              "grammarRule": {
                      "title": "Gramática — Lição 1: O Artigo Definido \"The\" e a Conjunção \"And\"",
                      "explanation": "O artigo *The* serve tanto para o singular quanto para o plural, masculino e feminino (*o, a, os, as*). Antes de palavras iniciadas por som de vogal (*the apple*, *the orange*), sua pronúncia se torna sutilmente /ðiː/. A conjunção *And* une elementos na frase.",
                      "examples": [
                              {
                                      "english": "The apple and the orange.",
                                      "portuguese": ""
                              },
                              {
                                      "english": "The boy and the girl.",
                                      "portuguese": ""
                              }
                      ]
              }
      }),
    ]
  },
  {
    dayNumber: 2,
    weekNumber: 1,
    blockNumber: 1,
    cefrLevel: 'A1',
    title: "Lição 2 — Artigos Indefinidos \"A\" e \"An\"",
    subtitle: "Diferenciação prática por som vocálico e consonantal",
    grammarFocus: "Uso de A antes de som de consoante e An antes de som de vogal.",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(2, 1, {
              "type": "word",
              "english": "A",
              "portuguese": "Um, uma (antes de som de consoante)"
      }),
      makeCard(2, 2, {
              "type": "word",
              "english": "Car",
              "portuguese": "Carro"
      }),
      makeCard(2, 3, {
              "type": "phrase",
              "english": "A car.",
              "portuguese": "Um carro."
      }),
      makeCard(2, 4, {
              "type": "word",
              "english": "An",
              "portuguese": "Um, uma (antes de som de vogal)"
      }),
      makeCard(2, 5, {
              "type": "word",
              "english": "Egg",
              "portuguese": "Ovo"
      }),
      makeCard(2, 6, {
              "type": "phrase",
              "english": "An egg.",
              "portuguese": "Um ovo."
      }),
      makeCard(2, 7, {
              "type": "word",
              "english": "House",
              "portuguese": "Casa"
      }),
      makeCard(2, 8, {
              "type": "word",
              "english": "Office",
              "portuguese": "Escritório"
      }),
      makeCard(2, 9, {
              "type": "phrase",
              "english": "A house.",
              "portuguese": "Uma casa."
      }),
      makeCard(2, 10, {
              "type": "phrase",
              "english": "A house and an office.",
              "portuguese": "Uma casa e um escritório."
      }),
      makeCard(2, 11, {
              "type": "grammar",
              "english": "Gramática — Lição 2: \"A\" vs \"An\"",
              "portuguese": "Usa-se *a* antes de sons consonantais (*a car, a house*) e *an* antes de sons vocálicos (*an egg, an office, an apple*). O critério é fonético: evita o choque entre duas vogais consecutivas.",
              "grammarRule": {
                      "title": "Gramática — Lição 2: \"A\" vs \"An\"",
                      "explanation": "Usa-se *a* antes de sons consonantais (*a car, a house*) e *an* antes de sons vocálicos (*an egg, an office, an apple*). O critério é fonético: evita o choque entre duas vogais consecutivas.",
                      "examples": [
                              {
                                      "english": "A car and an office.",
                                      "portuguese": ""
                              },
                              {
                                      "english": "A house and an egg.",
                                      "portuguese": ""
                              }
                      ]
              }
      }),
    ]
  },
  {
    dayNumber: 3,
    weekNumber: 1,
    blockNumber: 1,
    cefrLevel: 'A1',
    title: "Lição 3 — Cafeteria e Pedidos Corteses Reais",
    subtitle: "Vocabulário de bebidas e adjetivos de temperatura com pedidos corteses",
    grammarFocus: "Pedidos naturais com please e adjetivos de temperatura (hot, cold) antes do substantivo.",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(3, 1, {
              "type": "word",
              "english": "Coffee",
              "portuguese": "Café"
      }),
      makeCard(3, 2, {
              "type": "word",
              "english": "Please",
              "portuguese": "Por favor"
      }),
      makeCard(3, 3, {
              "type": "phrase",
              "english": "A coffee, please.",
              "portuguese": "Um café, por favor."
      }),
      makeCard(3, 4, {
              "type": "word",
              "english": "Hot",
              "portuguese": "Quente"
      }),
      makeCard(3, 5, {
              "type": "phrase",
              "english": "Hot coffee, please.",
              "portuguese": "Café quente, por favor."
      }),
      makeCard(3, 6, {
              "type": "word",
              "english": "Water",
              "portuguese": "Água"
      }),
      makeCard(3, 7, {
              "type": "word",
              "english": "Cold",
              "portuguese": "Gelado, frio"
      }),
      makeCard(3, 8, {
              "type": "phrase",
              "english": "Cold water, please.",
              "portuguese": "Água gelada, por favor."
      }),
      makeCard(3, 9, {
              "type": "word",
              "english": "Ice",
              "portuguese": "Gelo"
      }),
      makeCard(3, 10, {
              "type": "phrase",
              "english": "Cold water and ice, please.",
              "portuguese": "Água gelada e gelo, por favor."
      }),
      makeCard(3, 11, {
              "type": "grammar",
              "english": "Gramática — Lição 3: Adjetivos de Temperatura e Pedidos Corteses",
              "portuguese": "No inglês, os adjetivos de temperatura (*hot, cold*) antecedem o substantivo a que se referem (*hot coffee*, *cold water*). Para fazer pedidos corteses em cafés, utiliza-se a palavra *please* ao final.",
              "grammarRule": {
                      "title": "Gramática — Lição 3: Adjetivos de Temperatura e Pedidos Corteses",
                      "explanation": "No inglês, os adjetivos de temperatura (*hot, cold*) antecedem o substantivo a que se referem (*hot coffee*, *cold water*). Para fazer pedidos corteses em cafés, utiliza-se a palavra *please* ao final.",
                      "examples": [
                              {
                                      "english": "Hot coffee, please.",
                                      "portuguese": "Café quente, por favor."
                              },
                              {
                                      "english": "Cold water, please.",
                                      "portuguese": "Água gelada, por favor."
                              }
                      ]
              }
      }),
    ]
  },
  {
    dayNumber: 4,
    weekNumber: 1,
    blockNumber: 1,
    cefrLevel: 'A1',
    title: "Lição 4 — Preposições de Lugar: \"In\", \"On\" e \"Under\"",
    subtitle: "Localização física de objetos e alimentos",
    grammarFocus: "Preposições espaciais in (dentro), on (sobre/em cima) e under (embaixo).",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(4, 1, {
              "type": "word",
              "english": "In",
              "portuguese": "Em, dentro de"
      }),
      makeCard(4, 2, {
              "type": "word",
              "english": "Table",
              "portuguese": "Mesa"
      }),
      makeCard(4, 3, {
              "type": "phrase",
              "english": "In the office.",
              "portuguese": "No escritório."
      }),
      makeCard(4, 4, {
              "type": "word",
              "english": "On",
              "portuguese": "Em, sobre, em cima de"
      }),
      makeCard(4, 5, {
              "type": "word",
              "english": "Desk",
              "portuguese": "Escrivaninha, mesa de trabalho"
      }),
      makeCard(4, 6, {
              "type": "phrase",
              "english": "On the table.",
              "portuguese": "Na mesa."
      }),
      makeCard(4, 7, {
              "type": "word",
              "english": "Under",
              "portuguese": "Embaixo de"
      }),
      makeCard(4, 8, {
              "type": "word",
              "english": "Box",
              "portuguese": "Caixa"
      }),
      makeCard(4, 9, {
              "type": "phrase",
              "english": "The apple on the desk.",
              "portuguese": "A maçã na escrivaninha."
      }),
      makeCard(4, 10, {
              "type": "phrase",
              "english": "The box under the table.",
              "portuguese": "A caixa embaixo da mesa."
      }),
      makeCard(4, 11, {
              "type": "grammar",
              "english": "Gramática — Lição 4: Preposições In, On e Under",
              "portuguese": "*In* expressa interior ou espaço fechado (*in the office*); *on* indica contato com uma superfície (*on the table*); *under* indica posição inferior (*under the desk*).",
              "grammarRule": {
                      "title": "Gramática — Lição 4: Preposições In, On e Under",
                      "explanation": "*In* expressa interior ou espaço fechado (*in the office*); *on* indica contato com uma superfície (*on the table*); *under* indica posição inferior (*under the desk*).",
                      "examples": [
                              {
                                      "english": "The apple on the desk.",
                                      "portuguese": ""
                              },
                              {
                                      "english": "The box under the table.",
                                      "portuguese": ""
                              }
                      ]
              }
      }),
    ]
  },
  {
    dayNumber: 5,
    weekNumber: 1,
    blockNumber: 1,
    cefrLevel: 'A1',
    title: "Lição 5 — Verbo To Be: \"I am\" e \"You are\"",
    subtitle: "Identidade e localização do falante e do interlocutor",
    grammarFocus: "Formas singulares I am e You are (ser e estar).",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(5, 1, {
              "type": "word",
              "english": "I",
              "portuguese": "Eu"
      }),
      makeCard(5, 2, {
              "type": "word",
              "english": "Am",
              "portuguese": "Sou, estou"
      }),
      makeCard(5, 3, {
              "type": "phrase",
              "english": "I am in the house.",
              "portuguese": "Eu estou na casa."
      }),
      makeCard(5, 4, {
              "type": "word",
              "english": "Student",
              "portuguese": "Estudante, aluno(a)"
      }),
      makeCard(5, 5, {
              "type": "word",
              "english": "You",
              "portuguese": "Você"
      }),
      makeCard(5, 6, {
              "type": "phrase",
              "english": "I am a student.",
              "portuguese": "Eu sou estudante."
      }),
      makeCard(5, 7, {
              "type": "word",
              "english": "Are",
              "portuguese": "É, está"
      }),
      makeCard(5, 8, {
              "type": "word",
              "english": "Friend",
              "portuguese": "Amigo, amiga"
      }),
      makeCard(5, 9, {
              "type": "phrase",
              "english": "You are a student.",
              "portuguese": "Você é estudante."
      }),
      makeCard(5, 10, {
              "type": "phrase",
              "english": "You are a friend.",
              "portuguese": "Você é um amigo."
      }),
      makeCard(5, 11, {
              "type": "grammar",
              "english": "Gramática — Lição 5: Verbo To Be no Singular (I e You)",
              "portuguese": "*I am* (contraído: *I'm*) e *you are* (contraído: *you're*) traduzem tanto \"ser\" quanto \"estar\" conforme o contexto da frase. Note que usamos artigo antes de profissões e papéis (*I am a student*).",
              "grammarRule": {
                      "title": "Gramática — Lição 5: Verbo To Be no Singular (I e You)",
                      "explanation": "*I am* (contraído: *I'm*) e *you are* (contraído: *you're*) traduzem tanto \"ser\" quanto \"estar\" conforme o contexto da frase. Note que usamos artigo antes de profissões e papéis (*I am a student*).",
                      "examples": [
                              {
                                      "english": "I am a student.",
                                      "portuguese": ""
                              },
                              {
                                      "english": "You are a friend.",
                                      "portuguese": ""
                              }
                      ]
              }
      }),
    ]
  },
  {
    dayNumber: 6,
    weekNumber: 1,
    blockNumber: 1,
    cefrLevel: 'A1',
    title: "Lição 6 — Estados, Presença e Plural Natural com \"Like\"",
    subtitle: "Expressando sentimentos e preferências no plural",
    grammarFocus: "Like com plurais regulares para preferências gerais.",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(6, 1, {
              "type": "word",
              "english": "Happy",
              "portuguese": "Feliz"
      }),
      makeCard(6, 2, {
              "type": "word",
              "english": "Here",
              "portuguese": "Aqui"
      }),
      makeCard(6, 3, {
              "type": "phrase",
              "english": "I am happy here.",
              "portuguese": "Eu estou feliz aqui."
      }),
      makeCard(6, 4, {
              "type": "word",
              "english": "Like",
              "portuguese": "Gostar de"
      }),
      makeCard(6, 5, {
              "type": "word",
              "english": "Books",
              "portuguese": "Livros"
      }),
      makeCard(6, 6, {
              "type": "phrase",
              "english": "You are here.",
              "portuguese": "Você está aqui."
      }),
      makeCard(6, 7, {
              "type": "word",
              "english": "Dogs",
              "portuguese": "Cachorros"
      }),
      makeCard(6, 8, {
              "type": "word",
              "english": "Cats",
              "portuguese": "Gatos"
      }),
      makeCard(6, 9, {
              "type": "phrase",
              "english": "I like books.",
              "portuguese": "Eu gosto de livros."
      }),
      makeCard(6, 10, {
              "type": "phrase",
              "english": "I like dogs and cats.",
              "portuguese": "Eu gosto de cachorros e gatos."
      }),
      makeCard(6, 11, {
              "type": "grammar",
              "english": "Gramática — Lição 6: Plural Geral com o Verbo Like",
              "portuguese": "Para dizer que você gosta de algo em geral (livros, cachorros, gatos), o inglês usa naturalmente o plural sem artigo: *I like books* (e não *I like book*). Isso soa 100% natural para falantes nativos.",
              "grammarRule": {
                      "title": "Gramática — Lição 6: Plural Geral com o Verbo Like",
                      "explanation": "Para dizer que você gosta de algo em geral (livros, cachorros, gatos), o inglês usa naturalmente o plural sem artigo: *I like books* (e não *I like book*). Isso soa 100% natural para falantes nativos.",
                      "examples": [
                              {
                                      "english": "I like books.",
                                      "portuguese": ""
                              },
                              {
                                      "english": "I like dogs and cats.",
                                      "portuguese": ""
                              }
                      ]
              }
      }),
    ]
  },
  {
    dayNumber: 7,
    weekNumber: 1,
    blockNumber: 1,
    cefrLevel: 'A1',
    title: "Lição 7 — Verbo To Be: \"He is\", \"She is\" e \"It is\"",
    subtitle: "Terceira pessoa do singular com pessoas, animais e objetos",
    grammarFocus: "Concordância verbal com is e artigos diante de profissões iniciadas por vogal.",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(7, 1, {
              "type": "word",
              "english": "He",
              "portuguese": "Ele"
      }),
      makeCard(7, 2, {
              "type": "word",
              "english": "Is",
              "portuguese": "É, está"
      }),
      makeCard(7, 3, {
              "type": "phrase",
              "english": "He is a friend.",
              "portuguese": "Ele é um amigo."
      }),
      makeCard(7, 4, {
              "type": "word",
              "english": "Doctor",
              "portuguese": "Médico, médica"
      }),
      makeCard(7, 5, {
              "type": "word",
              "english": "She",
              "portuguese": "Ela"
      }),
      makeCard(7, 6, {
              "type": "phrase",
              "english": "She is a doctor.",
              "portuguese": "Ela é médica."
      }),
      makeCard(7, 7, {
              "type": "word",
              "english": "Actor",
              "portuguese": "Ator"
      }),
      makeCard(7, 8, {
              "type": "word",
              "english": "It",
              "portuguese": "Ele, ela, isso (objetos e lugares)"
      }),
      makeCard(7, 9, {
              "type": "phrase",
              "english": "He is an actor.",
              "portuguese": "Ele é ator."
      }),
      makeCard(7, 10, {
              "type": "phrase",
              "english": "It is an office.",
              "portuguese": "É um escritório."
      }),
      makeCard(7, 11, {
              "type": "grammar",
              "english": "Gramática — Lição 7: To Be na 3ª Pessoa (He, She e It)",
              "portuguese": "*He, she, it* sempre usam a forma verbal *is* (contraídos: *he's, she's, it's*). Lembre-se de usar *an* antes de profissões e substantivos com som vocálico (*he is an actor*, *it is an office*).",
              "grammarRule": {
                      "title": "Gramática — Lição 7: To Be na 3ª Pessoa (He, She e It)",
                      "explanation": "*He, she, it* sempre usam a forma verbal *is* (contraídos: *he's, she's, it's*). Lembre-se de usar *an* antes de profissões e substantivos com som vocálico (*he is an actor*, *it is an office*).",
                      "examples": [
                              {
                                      "english": "He is a doctor.",
                                      "portuguese": ""
                              },
                              {
                                      "english": "He is an actor.",
                                      "portuguese": ""
                              }
                      ]
              }
      }),
    ]
  },
  {
    dayNumber: 8,
    weekNumber: 1,
    blockNumber: 1,
    cefrLevel: 'A1',
    title: "Lição 8 — Verbo To Be no Plural: \"We\" e \"They\"",
    subtitle: "Pronomes no plural e ambientes comunitários",
    grammarFocus: "Forma verbal are com pronomes plurais e preposições at/in.",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(8, 1, {
              "type": "word",
              "english": "We",
              "portuguese": "Nós"
      }),
      makeCard(8, 2, {
              "type": "word",
              "english": "Park",
              "portuguese": "Parque"
      }),
      makeCard(8, 3, {
              "type": "phrase",
              "english": "We are in the park.",
              "portuguese": "Nós estamos no parque."
      }),
      makeCard(8, 4, {
              "type": "word",
              "english": "They",
              "portuguese": "Eles, elas"
      }),
      makeCard(8, 5, {
              "type": "word",
              "english": "School",
              "portuguese": "Escola"
      }),
      makeCard(8, 6, {
              "type": "phrase",
              "english": "They are in the school.",
              "portuguese": "Eles estão na escola."
      }),
      makeCard(8, 7, {
              "type": "word",
              "english": "At",
              "portuguese": "Em, no, na"
      }),
      makeCard(8, 8, {
              "type": "word",
              "english": "Airport",
              "portuguese": "Aeroporto"
      }),
      makeCard(8, 9, {
              "type": "phrase",
              "english": "We are at the airport.",
              "portuguese": "Nós estamos no aeroporto."
      }),
      makeCard(8, 10, {
              "type": "phrase",
              "english": "They are at the airport.",
              "portuguese": "Eles estão no aeroporto."
      }),
      makeCard(8, 11, {
              "type": "grammar",
              "english": "Gramática — Lição 8: To Be no Plural (We e They)",
              "portuguese": "*We, they* sempre usam *are*. Para indicar estar no aeroporto, a expressão nativa mais comum é *at the airport*.",
              "grammarRule": {
                      "title": "Gramática — Lição 8: To Be no Plural (We e They)",
                      "explanation": "*We, they* sempre usam *are*. Para indicar estar no aeroporto, a expressão nativa mais comum é *at the airport*.",
                      "examples": [
                              {
                                      "english": "We are in the park.",
                                      "portuguese": ""
                              },
                              {
                                      "english": "We are at the airport.",
                                      "portuguese": ""
                              }
                      ]
              }
      }),
    ]
  },
  {
    dayNumber: 9,
    weekNumber: 1,
    blockNumber: 1,
    cefrLevel: 'A1',
    title: "Lição 9 — Revisão do Bloco 1: Ações, Pessoas e Estados",
    subtitle: "Consolidação com pessoas e verbos de ação",
    grammarFocus: "Revisão das estruturas afirmativas e ações no presente.",
    isDialogueDay: false,
    isReviewLesson: true,
    cards: [
      makeCard(9, 1, {
              "type": "word",
              "english": "Tired",
              "portuguese": "Cansado, cansada"
      }),
      makeCard(9, 2, {
              "type": "word",
              "english": "Yes",
              "portuguese": "Sim"
      }),
      makeCard(9, 3, {
              "type": "phrase",
              "english": "Yes, I am tired.",
              "portuguese": "Sim, eu estou cansado."
      }),
      makeCard(9, 4, {
              "type": "word",
              "english": "Man",
              "portuguese": "Homem"
      }),
      makeCard(9, 5, {
              "type": "word",
              "english": "Woman",
              "portuguese": "Mulher"
      }),
      makeCard(9, 6, {
              "type": "phrase",
              "english": "The man and the woman are here.",
              "portuguese": "O homem e a mulher estão aqui."
      }),
      makeCard(9, 7, {
              "type": "word",
              "english": "Play",
              "portuguese": "Jogar, brincar"
      }),
      makeCard(9, 8, {
              "type": "word",
              "english": "Phone",
              "portuguese": "Telefone, celular"
      }),
      makeCard(9, 9, {
              "type": "phrase",
              "english": "They play in the park.",
              "portuguese": "Eles brincam no parque."
      }),
      makeCard(9, 10, {
              "type": "phrase",
              "english": "The phone is in the office.",
              "portuguese": "O celular está no escritório."
      }),
      makeCard(9, 11, {
              "type": "grammar",
              "english": "Gramática — Lição 9: Consolidação de Estruturas Afirmativas",
              "portuguese": "Consolidação das frases afirmativas com verbo *To Be* e introdução de verbos de ação simples como *play*. Todas as frases comunicam ideias reais e funcionais.",
              "grammarRule": {
                      "title": "Gramática — Lição 9: Consolidação de Estruturas Afirmativas",
                      "explanation": "Consolidação das frases afirmativas com verbo *To Be* e introdução de verbos de ação simples como *play*. Todas as frases comunicam ideias reais e funcionais.",
                      "examples": [
                              {
                                      "english": "The man and the woman are here.",
                                      "portuguese": ""
                              },
                              {
                                      "english": "They play in the park.",
                                      "portuguese": ""
                              }
                      ]
              }
      }),
    ]
  },
  {
    dayNumber: 10,
    weekNumber: 2,
    blockNumber: 1,
    cefrLevel: 'A1',
    title: "Lição 10 — Descrição 1 (A Escola, o Escritório e o Parque)",
    subtitle: "Texto de Fechamento do Bloco 1 reunindo os conceitos em narrativa",
    grammarFocus: "Compreensão de texto em contexto comunicativo.",
    isDialogueDay: true,
    isReviewLesson: false,
    cards: [
      makeCard(10, 1, {
              "type": "phrase",
              "english": "The school is big.",
              "portuguese": "A escola é grande."
      }),
      makeCard(10, 2, {
              "type": "phrase",
              "english": "The teacher is here in the room.",
              "portuguese": "O professor está aqui na sala."
      }),
      makeCard(10, 3, {
              "type": "phrase",
              "english": "I am a student.",
              "portuguese": "Eu sou estudante."
      }),
      makeCard(10, 4, {
              "type": "phrase",
              "english": "I am in the office.",
              "portuguese": "Eu estou no escritório."
      }),
      makeCard(10, 5, {
              "type": "phrase",
              "english": "The boy and the girl are in the park.",
              "portuguese": "O menino e a menina estão no parque."
      }),
      makeCard(10, 6, {
              "type": "phrase",
              "english": "They play in the park.",
              "portuguese": "Eles brincam no parque."
      }),
      makeCard(10, 7, {
              "type": "phrase",
              "english": "They are happy.",
              "portuguese": "Eles estão felizes."
      }),
      makeCard(10, 8, {
              "type": "phrase",
              "english": "The dog is in the park with the boy.",
              "portuguese": "O cachorro está no parque com o menino."
      }),
      makeCard(10, 9, {
              "type": "phrase",
              "english": "We are happy in the school.",
              "portuguese": "Nós estamos felizes na escola."
      }),
    ]
  },
  {
    dayNumber: 11,
    weekNumber: 2,
    blockNumber: 2,
    cefrLevel: 'A1',
    title: "Lição 11 — Negação no Verbo To Be: \"Not\"",
    subtitle: "Formas negativas diretas para profissões e estados",
    grammarFocus: "Uso de not imediatamente após am, is, are.",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(11, 1, {
              "type": "word",
              "english": "Not",
              "portuguese": "Não"
      }),
      makeCard(11, 2, {
              "type": "word",
              "english": "Teacher",
              "portuguese": "Professor, professora"
      }),
      makeCard(11, 3, {
              "type": "phrase",
              "english": "I am not sad.",
              "portuguese": "Eu não estou triste."
      }),
      makeCard(11, 4, {
              "type": "word",
              "english": "Lawyer",
              "portuguese": "Advogado, advogada"
      }),
      makeCard(11, 5, {
              "type": "word",
              "english": "Artist",
              "portuguese": "Artista"
      }),
      makeCard(11, 6, {
              "type": "phrase",
              "english": "He is not a teacher.",
              "portuguese": "Ele não é professor."
      }),
      makeCard(11, 7, {
              "type": "word",
              "english": "Sad",
              "portuguese": "Triste"
      }),
      makeCard(11, 8, {
              "type": "word",
              "english": "Busy",
              "portuguese": "Ocupado, ocupada"
      }),
      makeCard(11, 9, {
              "type": "phrase",
              "english": "She is an artist.",
              "portuguese": "Ela é artista."
      }),
      makeCard(11, 10, {
              "type": "phrase",
              "english": "The lawyer is busy.",
              "portuguese": "O advogado está ocupado."
      }),
      makeCard(11, 11, {
              "type": "grammar",
              "english": "Gramática — Lição 11: A Negação com \"Not\"",
              "portuguese": "Para negar com o verbo To Be, acrescenta-se a palavra *not* logo após a forma verbal: *I am not*, *he is not*, *she is not*. Lembre-se: *an artist* por iniciar com som vocálico.",
              "grammarRule": {
                      "title": "Gramática — Lição 11: A Negação com \"Not\"",
                      "explanation": "Para negar com o verbo To Be, acrescenta-se a palavra *not* logo após a forma verbal: *I am not*, *he is not*, *she is not*. Lembre-se: *an artist* por iniciar com som vocálico.",
                      "examples": [
                              {
                                      "english": "I am not sad.",
                                      "portuguese": ""
                              },
                              {
                                      "english": "He is not a teacher.",
                                      "portuguese": ""
                              }
                      ]
              }
      }),
    ]
  },
  {
    dayNumber: 12,
    weekNumber: 2,
    blockNumber: 2,
    cefrLevel: 'A1',
    title: "Lição 12 — Preposições \"With\" e \"From\" com Pessoas da Família",
    subtitle: "Companhia e origem de pessoas",
    grammarFocus: "With (companhia) e from (origem).",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(12, 1, {
              "type": "word",
              "english": "With",
              "portuguese": "Com"
      }),
      makeCard(12, 2, {
              "type": "word",
              "english": "From",
              "portuguese": "De, vindo de"
      }),
      makeCard(12, 3, {
              "type": "phrase",
              "english": "I am with my brother.",
              "portuguese": "Eu estou com meu irmão."
      }),
      makeCard(12, 4, {
              "type": "word",
              "english": "Father",
              "portuguese": "Pai"
      }),
      makeCard(12, 5, {
              "type": "word",
              "english": "Mother",
              "portuguese": "Mãe"
      }),
      makeCard(12, 6, {
              "type": "phrase",
              "english": "She is with her mother.",
              "portuguese": "Ela está com a mãe dela."
      }),
      makeCard(12, 7, {
              "type": "word",
              "english": "Brother",
              "portuguese": "Irmão"
      }),
      makeCard(12, 8, {
              "type": "word",
              "english": "Sister",
              "portuguese": "Irmã"
      }),
      makeCard(12, 9, {
              "type": "phrase",
              "english": "The doctor is from Brazil.",
              "portuguese": "O médico é do Brasil."
      }),
      makeCard(12, 10, {
              "type": "phrase",
              "english": "We are with the teacher.",
              "portuguese": "Nós estamos com o professor."
      }),
      makeCard(12, 11, {
              "type": "grammar",
              "english": "Gramática — Lição 12: Preposições With e From",
              "portuguese": "*With* indica companhia (*with my brother*); *from* indica origem ou procedência (*from Brazil*).",
              "grammarRule": {
                      "title": "Gramática — Lição 12: Preposições With e From",
                      "explanation": "*With* indica companhia (*with my brother*); *from* indica origem ou procedência (*from Brazil*).",
                      "examples": [
                              {
                                      "english": "I am with my brother.",
                                      "portuguese": ""
                              },
                              {
                                      "english": "The doctor is from Brazil.",
                                      "portuguese": ""
                              }
                      ]
              }
      }),
    ]
  },
  {
    dayNumber: 13,
    weekNumber: 2,
    blockNumber: 2,
    cefrLevel: 'A1',
    title: "Lição 13 — Lugares e Serviços com \"At\" e \"Near\"",
    subtitle: "Localização específica em estabelecimentos urbanos",
    grammarFocus: "At para pontos específicos e Near para proximidade.",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(13, 1, {
              "type": "word",
              "english": "At",
              "portuguese": "Em, no, na"
      }),
      makeCard(13, 2, {
              "type": "word",
              "english": "Near",
              "portuguese": "Perto de"
      }),
      makeCard(13, 3, {
              "type": "phrase",
              "english": "He is at the hospital.",
              "portuguese": "Ele está no hospital."
      }),
      makeCard(13, 4, {
              "type": "word",
              "english": "Hospital",
              "portuguese": "Hospital"
      }),
      makeCard(13, 5, {
              "type": "word",
              "english": "Bank",
              "portuguese": "Banco (instituição financeira)"
      }),
      makeCard(13, 6, {
              "type": "phrase",
              "english": "The bank is near the hotel.",
              "portuguese": "O banco fica perto do hotel."
      }),
      makeCard(13, 7, {
              "type": "word",
              "english": "Hotel",
              "portuguese": "Hotel"
      }),
      makeCard(13, 8, {
              "type": "word",
              "english": "Market",
              "portuguese": "Mercado"
      }),
      makeCard(13, 9, {
              "type": "phrase",
              "english": "She is at the market.",
              "portuguese": "Ela está no mercado."
      }),
      makeCard(13, 10, {
              "type": "phrase",
              "english": "The office is near the bank.",
              "portuguese": "O escritório fica perto do banco."
      }),
      makeCard(13, 11, {
              "type": "grammar",
              "english": "Gramática — Lição 13: Preposições At e Near",
              "portuguese": "*At* expressa presença em pontos ou estabelecimentos específicos (*at the hospital*, *at the market*). *Near* expressa proximidade espacial direta.",
              "grammarRule": {
                      "title": "Gramática — Lição 13: Preposições At e Near",
                      "explanation": "*At* expressa presença em pontos ou estabelecimentos específicos (*at the hospital*, *at the market*). *Near* expressa proximidade espacial direta.",
                      "examples": [
                              {
                                      "english": "He is at the hospital.",
                                      "portuguese": ""
                              },
                              {
                                      "english": "The bank is near the hotel.",
                                      "portuguese": ""
                              }
                      ]
              }
      }),
    ]
  },
  {
    dayNumber: 14,
    weekNumber: 2,
    blockNumber: 2,
    cefrLevel: 'A1',
    title: "Lição 14 — Preposições \"For\" e \"Of\" com Alimentos e Bebidas",
    subtitle: "Finalidade, destinação e conteúdo de recipientes",
    grammarFocus: "For (destinação) e Of (conteúdo/pertencimento).",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(14, 1, {
              "type": "word",
              "english": "For",
              "portuguese": "Para, por"
      }),
      makeCard(14, 2, {
              "type": "word",
              "english": "Of",
              "portuguese": "De, do, da"
      }),
      makeCard(14, 3, {
              "type": "phrase",
              "english": "A cup of coffee for the teacher.",
              "portuguese": "Uma xícara de café para o professor."
      }),
      makeCard(14, 4, {
              "type": "word",
              "english": "Tea",
              "portuguese": "Chá"
      }),
      makeCard(14, 5, {
              "type": "word",
              "english": "Milk",
              "portuguese": "Leite"
      }),
      makeCard(14, 6, {
              "type": "phrase",
              "english": "A glass of water, please.",
              "portuguese": "Um copo de água, por favor."
      }),
      makeCard(14, 7, {
              "type": "word",
              "english": "Glass",
              "portuguese": "Copo"
      }),
      makeCard(14, 8, {
              "type": "word",
              "english": "Cup",
              "portuguese": "Xícara"
      }),
      makeCard(14, 9, {
              "type": "phrase",
              "english": "The tea is for my mother.",
              "portuguese": "O chá é para minha mãe."
      }),
      makeCard(14, 10, {
              "type": "phrase",
              "english": "A glass of cold milk.",
              "portuguese": "Um copo de leite gelado."
      }),
      makeCard(14, 11, {
              "type": "grammar",
              "english": "Gramática — Lição 14: Preposições For e Of",
              "portuguese": "*For* indica finalidade ou destinatário (*for the teacher*). *Of* conecta recipientes e seus conteúdos (*a cup of coffee*, *a glass of water*).",
              "grammarRule": {
                      "title": "Gramática — Lição 14: Preposições For e Of",
                      "explanation": "*For* indica finalidade ou destinatário (*for the teacher*). *Of* conecta recipientes e seus conteúdos (*a cup of coffee*, *a glass of water*).",
                      "examples": [
                              {
                                      "english": "A cup of coffee for the teacher.",
                                      "portuguese": ""
                              },
                              {
                                      "english": "A glass of water, please.",
                                      "portuguese": ""
                              }
                      ]
              }
      }),
    ]
  },
  {
    dayNumber: 15,
    weekNumber: 2,
    blockNumber: 2,
    cefrLevel: 'A1',
    title: "Lição 15 — Interrogação Simples no Verbo To Be",
    subtitle: "Perguntas por inversão: \"Are you...?\" e \"Is he...?\"",
    grammarFocus: "Inversão do verbo To Be para formar perguntas diretas.",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(15, 1, {
              "type": "word",
              "english": "Question",
              "portuguese": "Pergunta"
      }),
      makeCard(15, 2, {
              "type": "word",
              "english": "Ready",
              "portuguese": "Pronto, pronta"
      }),
      makeCard(15, 3, {
              "type": "phrase",
              "english": "Are you ready?",
              "portuguese": "Você está pronto?"
      }),
      makeCard(15, 4, {
              "type": "word",
              "english": "Sure",
              "portuguese": "Certo, certa, com certeza"
      }),
      makeCard(15, 5, {
              "type": "word",
              "english": "Fine",
              "portuguese": "Bem, ótimo"
      }),
      makeCard(15, 6, {
              "type": "phrase",
              "english": "Are you hungry?",
              "portuguese": "Você está com fome?"
      }),
      makeCard(15, 7, {
              "type": "word",
              "english": "Hungry",
              "portuguese": "Com fome"
      }),
      makeCard(15, 8, {
              "type": "word",
              "english": "Thirsty",
              "portuguese": "Com sede"
      }),
      makeCard(15, 9, {
              "type": "phrase",
              "english": "Is he fine?",
              "portuguese": "Ele está bem?"
      }),
      makeCard(15, 10, {
              "type": "phrase",
              "english": "Are you thirsty?",
              "portuguese": "Você está com sede?"
      }),
      makeCard(15, 11, {
              "type": "grammar",
              "english": "Gramática — Lição 15: Interrogação no Verbo To Be",
              "portuguese": "Para fazer perguntas com To Be, invertemos a ordem: o verbo vem antes do sujeito (*Are you...?*, *Is he...?*). Adjetivos de estado como *hungry* e *thirsty* não usam ter (\"have\"), mas sim o verbo To Be.",
              "grammarRule": {
                      "title": "Gramática — Lição 15: Interrogação no Verbo To Be",
                      "explanation": "Para fazer perguntas com To Be, invertemos a ordem: o verbo vem antes do sujeito (*Are you...?*, *Is he...?*). Adjetivos de estado como *hungry* e *thirsty* não usam ter (\"have\"), mas sim o verbo To Be.",
                      "examples": [
                              {
                                      "english": "Are you ready?",
                                      "portuguese": ""
                              },
                              {
                                      "english": "Are you hungry?",
                                      "portuguese": ""
                              }
                      ]
              }
      }),
    ]
  },
  {
    dayNumber: 16,
    weekNumber: 3,
    blockNumber: 2,
    cefrLevel: 'A1',
    title: "Lição 16 — Interrogação Plural e Respostas Curtas",
    subtitle: "Perguntas com \"Are they...?\" e respostas com \"No\"",
    grammarFocus: "Inversão plural e respostas negativas curtas.",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(16, 1, {
              "type": "word",
              "english": "No",
              "portuguese": "Não (resposta curta)"
      }),
      makeCard(16, 2, {
              "type": "word",
              "english": "Too",
              "portuguese": "Também"
      }),
      makeCard(16, 3, {
              "type": "phrase",
              "english": "Are they late?",
              "portuguese": "Eles estão atrasados?"
      }),
      makeCard(16, 4, {
              "type": "word",
              "english": "Now",
              "portuguese": "Agora"
      }),
      makeCard(16, 5, {
              "type": "word",
              "english": "Class",
              "portuguese": "Aula, turma"
      }),
      makeCard(16, 6, {
              "type": "phrase",
              "english": "No, they are early.",
              "portuguese": "Não, eles estão adiantados."
      }),
      makeCard(16, 7, {
              "type": "word",
              "english": "Late",
              "portuguese": "Atrasado, atrasada"
      }),
      makeCard(16, 8, {
              "type": "word",
              "english": "Early",
              "portuguese": "Cedo, adiantado (inicia com vogal)"
      }),
      makeCard(16, 9, {
              "type": "phrase",
              "english": "Are we in the class now?",
              "portuguese": "Nós estamos na aula agora?"
      }),
      makeCard(16, 10, {
              "type": "phrase",
              "english": "I am ready too.",
              "portuguese": "Eu estou pronto também."
      }),
      makeCard(16, 11, {
              "type": "grammar",
              "english": "Gramática — Lição 16: Interrogação Plural e Respostas Curtas",
              "portuguese": "*Are they late?* inverte o verbo com o pronome plural. *No* é usado para responder negativamente antes da oração.",
              "grammarRule": {
                      "title": "Gramática — Lição 16: Interrogação Plural e Respostas Curtas",
                      "explanation": "*Are they late?* inverte o verbo com o pronome plural. *No* é usado para responder negativamente antes da oração.",
                      "examples": [
                              {
                                      "english": "Are they late?",
                                      "portuguese": ""
                              },
                              {
                                      "english": "No, they are early.",
                                      "portuguese": ""
                              }
                      ]
              }
      }),
    ]
  },
  {
    dayNumber: 17,
    weekNumber: 3,
    blockNumber: 2,
    cefrLevel: 'A1',
    title: "Lição 17 — Mobília e Cômodos Residenciais",
    subtitle: "Identificação de elementos do quarto e sala",
    grammarFocus: "Preposições em mobílias do lar.",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(17, 1, {
              "type": "word",
              "english": "Room",
              "portuguese": "Quarto, cômodo"
      }),
      makeCard(17, 2, {
              "type": "word",
              "english": "Bed",
              "portuguese": "Cama"
      }),
      makeCard(17, 3, {
              "type": "phrase",
              "english": "The chair is in the room.",
              "portuguese": "A cadeira está no quarto."
      }),
      makeCard(17, 4, {
              "type": "word",
              "english": "Chair",
              "portuguese": "Cadeira"
      }),
      makeCard(17, 5, {
              "type": "word",
              "english": "Window",
              "portuguese": "Janela"
      }),
      makeCard(17, 6, {
              "type": "phrase",
              "english": "The window is open.",
              "portuguese": "A janela está aberta."
      }),
      makeCard(17, 7, {
              "type": "word",
              "english": "Door",
              "portuguese": "Porta"
      }),
      makeCard(17, 8, {
              "type": "word",
              "english": "Apartment",
              "portuguese": "Apartamento"
      }),
      makeCard(17, 9, {
              "type": "phrase",
              "english": "The cat is on the bed.",
              "portuguese": "O gato está em cima da cama."
      }),
      makeCard(17, 10, {
              "type": "phrase",
              "english": "We are in the apartment.",
              "portuguese": "Nós estamos no apartamento."
      }),
      makeCard(17, 11, {
              "type": "grammar",
              "english": "Gramática — Lição 17: Localização em Ambientes do Lar",
              "portuguese": "Uso de *on the bed* (na superfície da cama), *in the room* (no interior do quarto) e *in the apartment*.",
              "grammarRule": {
                      "title": "Gramática — Lição 17: Localização em Ambientes do Lar",
                      "explanation": "Uso de *on the bed* (na superfície da cama), *in the room* (no interior do quarto) e *in the apartment*.",
                      "examples": [
                              {
                                      "english": "The chair is in the room.",
                                      "portuguese": ""
                              },
                              {
                                      "english": "We are in the apartment.",
                                      "portuguese": ""
                              }
                      ]
              }
      }),
    ]
  },
  {
    dayNumber: 18,
    weekNumber: 3,
    blockNumber: 2,
    cefrLevel: 'A1',
    title: "Lição 18 — Adjetivos Descritivos de Objetos e Espaços",
    subtitle: "Qualidades essenciais de ambientes e pertences",
    grammarFocus: "Posição e concordância dos adjetivos qualificadores.",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(18, 1, {
              "type": "word",
              "english": "Clean",
              "portuguese": "Limpo, limpa"
      }),
      makeCard(18, 2, {
              "type": "word",
              "english": "Quiet",
              "portuguese": "Silencioso, calmo"
      }),
      makeCard(18, 3, {
              "type": "phrase",
              "english": "The room is clean and quiet.",
              "portuguese": "O quarto é limpo e silencioso."
      }),
      makeCard(18, 4, {
              "type": "word",
              "english": "Old",
              "portuguese": "Velho, antigo"
      }),
      makeCard(18, 5, {
              "type": "word",
              "english": "New",
              "portuguese": "Novo, nova"
      }),
      makeCard(18, 6, {
              "type": "phrase",
              "english": "The old house is beautiful.",
              "portuguese": "A casa antiga é bonita."
      }),
      makeCard(18, 7, {
              "type": "word",
              "english": "Small",
              "portuguese": "Pequeno, pequena"
      }),
      makeCard(18, 8, {
              "type": "word",
              "english": "Beautiful",
              "portuguese": "Bonito, linda"
      }),
      makeCard(18, 9, {
              "type": "phrase",
              "english": "It is a new car.",
              "portuguese": "É um carro novo."
      }),
      makeCard(18, 10, {
              "type": "phrase",
              "english": "The small dog is happy.",
              "portuguese": "O cachorro pequeno está feliz."
      }),
      makeCard(18, 11, {
              "type": "grammar",
              "english": "Gramática — Lição 18: Adjetivos Descritivos",
              "portuguese": "Adjetivos em inglês não têm plural nem gênero: *clean*, *quiet*, *beautiful*. Podem vir antes do substantivo (*a new car*) ou após o verbo To Be (*the room is clean*).",
              "grammarRule": {
                      "title": "Gramática — Lição 18: Adjetivos Descritivos",
                      "explanation": "Adjetivos em inglês não têm plural nem gênero: *clean*, *quiet*, *beautiful*. Podem vir antes do substantivo (*a new car*) ou após o verbo To Be (*the room is clean*).",
                      "examples": [
                              {
                                      "english": "The old house is beautiful.",
                                      "portuguese": ""
                              },
                              {
                                      "english": "It is a new car.",
                                      "portuguese": ""
                              }
                      ]
              }
      }),
    ]
  },
  {
    dayNumber: 19,
    weekNumber: 3,
    blockNumber: 2,
    cefrLevel: 'A1',
    title: "Lição 19 — Expressões de Cortesia e Recepção",
    subtitle: "Comunicação polida em hotéis e recepções",
    grammarFocus: "Expressões fixas de cortesia em situações de serviço.",
    isDialogueDay: false,
    isReviewLesson: true,
    cards: [
      makeCard(19, 1, {
              "type": "word",
              "english": "Thanks",
              "portuguese": "Obrigado, valeu"
      }),
      makeCard(19, 2, {
              "type": "word",
              "english": "Welcome",
              "portuguese": "Bem-vindo, de nada"
      }),
      makeCard(19, 3, {
              "type": "phrase",
              "english": "Excuse me, where is the office?",
              "portuguese": "Com licença, onde é o escritório?"
      }),
      makeCard(19, 4, {
              "type": "word",
              "english": "Excuse me",
              "portuguese": "Com licença"
      }),
      makeCard(19, 5, {
              "type": "word",
              "english": "Key",
              "portuguese": "Chave"
      }),
      makeCard(19, 6, {
              "type": "phrase",
              "english": "Here is the key, thanks.",
              "portuguese": "Aqui está a chave, obrigado."
      }),
      makeCard(19, 7, {
              "type": "word",
              "english": "Name",
              "portuguese": "Nome"
      }),
      makeCard(19, 8, {
              "type": "word",
              "english": "Help",
              "portuguese": "Ajuda, ajudar"
      }),
      makeCard(19, 9, {
              "type": "phrase",
              "english": "Welcome to the hotel.",
              "portuguese": "Bem-vindo ao hotel."
      }),
      makeCard(19, 10, {
              "type": "phrase",
              "english": "Can you help me, please?",
              "portuguese": "Você pode me ajudar, por favor?"
      }),
      makeCard(19, 11, {
              "type": "grammar",
              "english": "Gramática — Lição 19: Fórmulas de Polidez no Inglês",
              "portuguese": "*Excuse me* é a forma mais polida para iniciar uma interação ou pedir passagem. *Here is the key* apresenta objetos com cortesia.",
              "grammarRule": {
                      "title": "Gramática — Lição 19: Fórmulas de Polidez no Inglês",
                      "explanation": "*Excuse me* é a forma mais polida para iniciar uma interação ou pedir passagem. *Here is the key* apresenta objetos com cortesia.",
                      "examples": [
                              {
                                      "english": "Excuse me, where is the office?",
                                      "portuguese": ""
                              },
                              {
                                      "english": "Here is the key, thanks.",
                                      "portuguese": ""
                              }
                      ]
              }
      }),
    ]
  },
  {
    dayNumber: 20,
    weekNumber: 3,
    blockNumber: 2,
    cefrLevel: 'A1',
    title: "Lição 20 — Diálogo 1 (Check-in no Hotel e Recepção)",
    subtitle: "Texto de Fechamento do Bloco 2 com diálogo prático de viagem",
    grammarFocus: "Diálogo completo integrando To Be interrogativo, preposições e cortesias.",
    isDialogueDay: true,
    isReviewLesson: false,
    cards: [
      makeCard(20, 1, {
              "type": "phrase",
              "english": "Good morning! Welcome to the hotel.",
              "portuguese": "Bom dia! Bem-vindo ao hotel."
      }),
      makeCard(20, 2, {
              "type": "phrase",
              "english": "Hello! I am here for the room.",
              "portuguese": "Olá! Eu estou aqui pelo quarto."
      }),
      makeCard(20, 3, {
              "type": "phrase",
              "english": "What is your name, please?",
              "portuguese": "Qual é o seu nome, por favor?"
      }),
      makeCard(20, 4, {
              "type": "phrase",
              "english": "My name is John. I am from Brazil.",
              "portuguese": "Meu nome é John. Eu sou do Brasil."
      }),
      makeCard(20, 5, {
              "type": "phrase",
              "english": "Your room is on the second floor.",
              "portuguese": "Seu quarto é no segundo andar."
      }),
      makeCard(20, 6, {
              "type": "phrase",
              "english": "Here is your key. The room is very quiet.",
              "portuguese": "Aqui está sua chave. O quarto é muito silencioso."
      }),
      makeCard(20, 7, {
              "type": "phrase",
              "english": "Thank you very much!",
              "portuguese": "Muito obrigado!"
      }),
      makeCard(20, 8, {
              "type": "phrase",
              "english": "You are welcome! Have a good day.",
              "portuguese": "De nada! Tenha um bom dia."
      }),
    ]
  },
  {
    dayNumber: 21,
    weekNumber: 4,
    blockNumber: 3,
    cefrLevel: 'A1',
    title: "Lição 21 — Adjetivos Possessivos: \"My\" e \"Your\"",
    subtitle: "Expressando posse imediata e vínculos familiares diretos",
    grammarFocus: "My (meu/minha) e Your (seu/sua).",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(21, 1, {
              "type": "word",
              "english": "My",
              "portuguese": "Meu, minha, meus, minhas"
      }),
      makeCard(21, 2, {
              "type": "word",
              "english": "Your",
              "portuguese": "Seu, sua, seus, suas"
      }),
      makeCard(21, 3, {
              "type": "phrase",
              "english": "My father is at the office.",
              "portuguese": "Meu pai está no escritório."
      }),
      makeCard(21, 4, {
              "type": "word",
              "english": "Son",
              "portuguese": "Filho"
      }),
      makeCard(21, 5, {
              "type": "word",
              "english": "Daughter",
              "portuguese": "Filha"
      }),
      makeCard(21, 6, {
              "type": "phrase",
              "english": "Your daughter is a student.",
              "portuguese": "Sua filha é estudante."
      }),
      makeCard(21, 7, {
              "type": "word",
              "english": "Job",
              "portuguese": "Emprego, trabalho"
      }),
      makeCard(21, 8, {
              "type": "word",
              "english": "Boss",
              "portuguese": "Chefe"
      }),
      makeCard(21, 9, {
              "type": "phrase",
              "english": "My son is a doctor.",
              "portuguese": "Meu filho é médico."
      }),
      makeCard(21, 10, {
              "type": "phrase",
              "english": "Your boss is a lawyer.",
              "portuguese": "Seu chefe é advogado."
      }),
      makeCard(21, 11, {
              "type": "grammar",
              "english": "Gramática — Lição 21: Possessivos My e Your",
              "portuguese": "*My* e *Your* não variam em gênero nem em número (*my son*, *my daughters*). Nunca se usa artigo antes de possessivo em inglês (*my car*, nunca *the my car*).",
              "grammarRule": {
                      "title": "Gramática — Lição 21: Possessivos My e Your",
                      "explanation": "*My* e *Your* não variam em gênero nem em número (*my son*, *my daughters*). Nunca se usa artigo antes de possessivo em inglês (*my car*, nunca *the my car*).",
                      "examples": [
                              {
                                      "english": "My father is at the office.",
                                      "portuguese": ""
                              },
                              {
                                      "english": "Your daughter is a student.",
                                      "portuguese": ""
                              }
                      ]
              }
      }),
    ]
  },
  {
    dayNumber: 22,
    weekNumber: 4,
    blockNumber: 3,
    cefrLevel: 'A1',
    title: "Lição 22 — Possessivos de 3ª Pessoa: \"His\", \"Her\" e \"Its\"",
    subtitle: "Posse atribuída a ele, a ela e a animais/objetos",
    grammarFocus: "Diferenciação clara entre his (dele) e her (dela).",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(22, 1, {
              "type": "word",
              "english": "His",
              "portuguese": "Dele, seu (de ele)"
      }),
      makeCard(22, 2, {
              "type": "word",
              "english": "Her",
              "portuguese": "Dela, sua (de ela)"
      }),
      makeCard(22, 3, {
              "type": "phrase",
              "english": "His wife is a teacher.",
              "portuguese": "A esposa dele é professora."
      }),
      makeCard(22, 4, {
              "type": "word",
              "english": "Its",
              "portuguese": "Dele, dela (coisas e animais)"
      }),
      makeCard(22, 5, {
              "type": "word",
              "english": "Husband",
              "portuguese": "Marido"
      }),
      makeCard(22, 6, {
              "type": "phrase",
              "english": "Her husband is an engineer.",
              "portuguese": "O marido dela é engenheiro."
      }),
      makeCard(22, 7, {
              "type": "word",
              "english": "Wife",
              "portuguese": "Esposa"
      }),
      makeCard(22, 8, {
              "type": "word",
              "english": "Baby",
              "portuguese": "Bebê"
      }),
      makeCard(22, 9, {
              "type": "phrase",
              "english": "Her baby is happy.",
              "portuguese": "O bebê dela está feliz."
      }),
      makeCard(22, 10, {
              "type": "phrase",
              "english": "His brother is in the car.",
              "portuguese": "O irmão dele está no carro."
      }),
      makeCard(22, 11, {
              "type": "grammar",
              "english": "Gramática — Lição 22: His vs Her",
              "portuguese": "Em inglês, o possessivo concorda com o **possuidor**: se pertence a um homem, é *his*; se pertence a uma mulher, é *her*, independentemente do gênero do objeto possuído.",
              "grammarRule": {
                      "title": "Gramática — Lição 22: His vs Her",
                      "explanation": "Em inglês, o possessivo concorda com o **possuidor**: se pertence a um homem, é *his*; se pertence a uma mulher, é *her*, independentemente do gênero do objeto possuído.",
                      "examples": [
                              {
                                      "english": "His wife is a teacher.",
                                      "portuguese": ""
                              },
                              {
                                      "english": "Her husband is an engineer.",
                                      "portuguese": ""
                              }
                      ]
              }
      }),
    ]
  },
  {
    dayNumber: 23,
    weekNumber: 4,
    blockNumber: 3,
    cefrLevel: 'A1',
    title: "Lição 23 — Família Coletiva: \"Our\" e \"Their\"",
    subtitle: "Vínculos familiares no plural e verbo Love",
    grammarFocus: "Possessivos plurais Our e Their, e expressando afeto com Love.",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(23, 1, {
              "type": "word",
              "english": "Our",
              "portuguese": "Nosso, nossa, nossos, nossas"
      }),
      makeCard(23, 2, {
              "type": "word",
              "english": "Their",
              "portuguese": "Deles, delas, seus"
      }),
      makeCard(23, 3, {
              "type": "phrase",
              "english": "Our family is in Brazil.",
              "portuguese": "Nossa família está no Brasil."
      }),
      makeCard(23, 4, {
              "type": "word",
              "english": "Family",
              "portuguese": "Família"
      }),
      makeCard(23, 5, {
              "type": "word",
              "english": "Parents",
              "portuguese": "Pais (pai e mãe)"
      }),
      makeCard(23, 6, {
              "type": "phrase",
              "english": "I love my parents.",
              "portuguese": "Eu amo meus pais."
      }),
      makeCard(23, 7, {
              "type": "word",
              "english": "Love",
              "portuguese": "Amar, amar muito"
      }),
      makeCard(23, 8, {
              "type": "word",
              "english": "Kind",
              "portuguese": "Gentil, bondoso"
      }),
      makeCard(23, 9, {
              "type": "phrase",
              "english": "Their parents are very kind.",
              "portuguese": "Os pais deles são muito gentis."
      }),
      makeCard(23, 10, {
              "type": "phrase",
              "english": "We love our friends.",
              "portuguese": "Nós amamos nossos amigos."
      }),
      makeCard(23, 11, {
              "type": "grammar",
              "english": "Gramática — Lição 23: Possessivos Our e Their",
              "portuguese": "*Our* refere-se a nós; *their* refere-se a eles/elas. *Parents* em inglês significa especificamente pai e mãe (parentes em geral é *relatives*).",
              "grammarRule": {
                      "title": "Gramática — Lição 23: Possessivos Our e Their",
                      "explanation": "*Our* refere-se a nós; *their* refere-se a eles/elas. *Parents* em inglês significa especificamente pai e mãe (parentes em geral é *relatives*).",
                      "examples": [
                              {
                                      "english": "Our family is in Brazil.",
                                      "portuguese": ""
                              },
                              {
                                      "english": "I love my parents.",
                                      "portuguese": ""
                              }
                      ]
              }
      }),
    ]
  },
  {
    dayNumber: 24,
    weekNumber: 4,
    blockNumber: 3,
    cefrLevel: 'A1',
    title: "Lição 24 — Ambientes da Cozinha e Sala",
    subtitle: "Objetos utilitários e convivência doméstica",
    grammarFocus: "Vocabulário do lar e preposições de cômodos.",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(24, 1, {
              "type": "word",
              "english": "Kitchen",
              "portuguese": "Cozinha"
      }),
      makeCard(24, 2, {
              "type": "word",
              "english": "Living room",
              "portuguese": "Sala de estar"
      }),
      makeCard(24, 3, {
              "type": "phrase",
              "english": "My mother is in the kitchen.",
              "portuguese": "Minha mãe está na cozinha."
      }),
      makeCard(24, 4, {
              "type": "word",
              "english": "Garden",
              "portuguese": "Jardim"
      }),
      makeCard(24, 5, {
              "type": "word",
              "english": "Plate",
              "portuguese": "Prato"
      }),
      makeCard(24, 6, {
              "type": "phrase",
              "english": "The plate is on the table.",
              "portuguese": "O prato está na mesa."
      }),
      makeCard(24, 7, {
              "type": "word",
              "english": "Fork",
              "portuguese": "Garfo"
      }),
      makeCard(24, 8, {
              "type": "word",
              "english": "Spoon",
              "portuguese": "Colher"
      }),
      makeCard(24, 9, {
              "type": "phrase",
              "english": "Our garden is beautiful.",
              "portuguese": "Nosso jardim é bonito."
      }),
      makeCard(24, 10, {
              "type": "phrase",
              "english": "My father is in the living room.",
              "portuguese": "Meu pai está na sala de estar."
      }),
      makeCard(24, 11, {
              "type": "grammar",
              "english": "Gramática — Lição 24: Cômodos da Casa e Utensílios",
              "portuguese": "*In the kitchen*, *in the living room*, *in the garden*. Lembre-se de usar *on the table* para objetos sobre superfícies.",
              "grammarRule": {
                      "title": "Gramática — Lição 24: Cômodos da Casa e Utensílios",
                      "explanation": "*In the kitchen*, *in the living room*, *in the garden*. Lembre-se de usar *on the table* para objetos sobre superfícies.",
                      "examples": [
                              {
                                      "english": "My mother is in the kitchen.",
                                      "portuguese": ""
                              },
                              {
                                      "english": "The plate is on the table.",
                                      "portuguese": ""
                              }
                      ]
              }
      }),
    ]
  },
  {
    dayNumber: 25,
    weekNumber: 4,
    blockNumber: 3,
    cefrLevel: 'A1',
    title: "Lição 25 — Alimentos do Café da Manhã",
    subtitle: "Vocabulário matinal e sucos de frutas",
    grammarFocus: "Substantivos de café da manhã e combinações naturais.",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(25, 1, {
              "type": "word",
              "english": "Bread",
              "portuguese": "Pão"
      }),
      makeCard(25, 2, {
              "type": "word",
              "english": "Butter",
              "portuguese": "Manteiga"
      }),
      makeCard(25, 3, {
              "type": "phrase",
              "english": "Bread and butter, please.",
              "portuguese": "Pão e manteiga, por favor."
      }),
      makeCard(25, 4, {
              "type": "word",
              "english": "Cheese",
              "portuguese": "Queijo"
      }),
      makeCard(25, 5, {
              "type": "word",
              "english": "Apple juice",
              "portuguese": "Suco de maçã"
      }),
      makeCard(25, 6, {
              "type": "phrase",
              "english": "I like bread with cheese.",
              "portuguese": "Eu gosto de pão com queijo."
      }),
      makeCard(25, 7, {
              "type": "word",
              "english": "Fruit",
              "portuguese": "Fruta"
      }),
      makeCard(25, 8, {
              "type": "word",
              "english": "Fresh",
              "portuguese": "Fresco, fresca"
      }),
      makeCard(25, 9, {
              "type": "phrase",
              "english": "The fruit is fresh.",
              "portuguese": "A fruta está fresca."
      }),
      makeCard(25, 10, {
              "type": "phrase",
              "english": "Apple juice, please.",
              "portuguese": "Suco de maçã, por favor."
      }),
      makeCard(25, 11, {
              "type": "grammar",
              "english": "Gramática — Lição 25: Alimentos do Café da Manhã",
              "portuguese": "Para bebidas compostas, a fruta funciona como especificador antes do líquido: *apple juice* (suco de maçã), *orange juice* (suco de laranja).",
              "grammarRule": {
                      "title": "Gramática — Lição 25: Alimentos do Café da Manhã",
                      "explanation": "Para bebidas compostas, a fruta funciona como especificador antes do líquido: *apple juice* (suco de maçã), *orange juice* (suco de laranja).",
                      "examples": [
                              {
                                      "english": "Bread and butter, please.",
                                      "portuguese": ""
                              },
                              {
                                      "english": "Apple juice, please.",
                                      "portuguese": ""
                              }
                      ]
              }
      }),
    ]
  },
  {
    dayNumber: 26,
    weekNumber: 4,
    blockNumber: 3,
    cefrLevel: 'A1',
    title: "Lição 26 — Preposições Espaciais Específicas",
    subtitle: "Between, Behind e In front of no ambiente exterior",
    grammarFocus: "Preposições de posicionamento relacional.",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(26, 1, {
              "type": "word",
              "english": "Between",
              "portuguese": "Entre (dois elementos)"
      }),
      makeCard(26, 2, {
              "type": "word",
              "english": "Behind",
              "portuguese": "Atrás de"
      }),
      makeCard(26, 3, {
              "type": "phrase",
              "english": "The car is in the garage.",
              "portuguese": "O carro está na garagem."
      }),
      makeCard(26, 4, {
              "type": "word",
              "english": "In front of",
              "portuguese": "Em frente a"
      }),
      makeCard(26, 5, {
              "type": "word",
              "english": "Tree",
              "portuguese": "Árvore"
      }),
      makeCard(26, 6, {
              "type": "phrase",
              "english": "The tree is in front of the house.",
              "portuguese": "A árvore fica em frente à casa."
      }),
      makeCard(26, 7, {
              "type": "word",
              "english": "Street",
              "portuguese": "Rua"
      }),
      makeCard(26, 8, {
              "type": "word",
              "english": "Garage",
              "portuguese": "Garagem"
      }),
      makeCard(26, 9, {
              "type": "phrase",
              "english": "The cat is behind the door.",
              "portuguese": "O gato está atrás da porta."
      }),
      makeCard(26, 10, {
              "type": "phrase",
              "english": "The table is between the chairs.",
              "portuguese": "A mesa está entre as cadeiras."
      }),
      makeCard(26, 11, {
              "type": "grammar",
              "english": "Gramática — Lição 26: Posições Relacionais",
              "portuguese": "*Between* é usado entre dois pontos de referência. *Behind* indica parte de trás e *in front of* indica a parte dianteira.",
              "grammarRule": {
                      "title": "Gramática — Lição 26: Posições Relacionais",
                      "explanation": "*Between* é usado entre dois pontos de referência. *Behind* indica parte de trás e *in front of* indica a parte dianteira.",
                      "examples": [
                              {
                                      "english": "The tree is in front of the house.",
                                      "portuguese": ""
                              },
                              {
                                      "english": "The table is between the chairs.",
                                      "portuguese": ""
                              }
                      ]
              }
      }),
    ]
  },
  {
    dayNumber: 27,
    weekNumber: 4,
    blockNumber: 3,
    cefrLevel: 'A1',
    title: "Lição 27 — Conforto e Qualidade do Lar",
    subtitle: "Adjetivos para descrever ambientes acolhedores",
    grammarFocus: "Qualificadores de ambiente e intensidade com very.",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(27, 1, {
              "type": "word",
              "english": "Comfortable",
              "portuguese": "Confortável"
      }),
      makeCard(27, 2, {
              "type": "word",
              "english": "Warm",
              "portuguese": "Aconchegante, morno"
      }),
      makeCard(27, 3, {
              "type": "phrase",
              "english": "The bed is very comfortable.",
              "portuguese": "A cama é muito confortável."
      }),
      makeCard(27, 4, {
              "type": "word",
              "english": "Big house",
              "portuguese": "Casa grande"
      }),
      makeCard(27, 5, {
              "type": "word",
              "english": "Modern",
              "portuguese": "Moderno, moderna"
      }),
      makeCard(27, 6, {
              "type": "phrase",
              "english": "Our apartment is modern and clean.",
              "portuguese": "Nosso apartamento é moderno e limpo."
      }),
      makeCard(27, 7, {
              "type": "word",
              "english": "Simple",
              "portuguese": "Simples"
      }),
      makeCard(27, 8, {
              "type": "word",
              "english": "Cozy",
              "portuguese": "Aconchegante, acolhedor"
      }),
      makeCard(27, 9, {
              "type": "phrase",
              "english": "The living room is warm and cozy.",
              "portuguese": "A sala de estar é acolhedora e aconchegante."
      }),
      makeCard(27, 10, {
              "type": "phrase",
              "english": "It is a simple and quiet house.",
              "portuguese": "É uma casa simples e calma."
      }),
      makeCard(27, 11, {
              "type": "grammar",
              "english": "Gramática — Lição 27: Intensificador \"Very\" com Adjetivos",
              "portuguese": "Usa-se *very* antes de adjetivos para intensificar a qualidade: *very comfortable*, *very clean*.",
              "grammarRule": {
                      "title": "Gramática — Lição 27: Intensificador \"Very\" com Adjetivos",
                      "explanation": "Usa-se *very* antes de adjetivos para intensificar a qualidade: *very comfortable*, *very clean*.",
                      "examples": [
                              {
                                      "english": "The bed is very comfortable.",
                                      "portuguese": ""
                              },
                              {
                                      "english": "Our apartment is modern and clean.",
                                      "portuguese": ""
                              }
                      ]
              }
      }),
    ]
  },
  {
    dayNumber: 28,
    weekNumber: 4,
    blockNumber: 3,
    cefrLevel: 'A1',
    title: "Lição 28 — Vizinhança e Comunidade",
    subtitle: "Relações de bairro e proximidade urbana",
    grammarFocus: "Vocabulário de vizinhança e adjetivos de segurança.",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(28, 1, {
              "type": "word",
              "english": "Neighbor",
              "portuguese": "Vizinho, vizinha"
      }),
      makeCard(28, 2, {
              "type": "word",
              "english": "Neighborhood",
              "portuguese": "Bairro, vizinhança"
      }),
      makeCard(28, 3, {
              "type": "phrase",
              "english": "Our neighborhood is very safe.",
              "portuguese": "Nosso bairro é muito seguro."
      }),
      makeCard(28, 4, {
              "type": "word",
              "english": "Safe",
              "portuguese": "Seguro, protegida"
      }),
      makeCard(28, 5, {
              "type": "word",
              "english": "Near here",
              "portuguese": "Perto daqui"
      }),
      makeCard(28, 6, {
              "type": "phrase",
              "english": "My neighbor is friendly.",
              "portuguese": "Meu vizinho é amigável."
      }),
      makeCard(28, 7, {
              "type": "word",
              "english": "Far",
              "portuguese": "Longe, distante"
      }),
      makeCard(28, 8, {
              "type": "word",
              "english": "Friendly",
              "portuguese": "Amigável, simpático"
      }),
      makeCard(28, 9, {
              "type": "phrase",
              "english": "The school is not far.",
              "portuguese": "A escola não é longe."
      }),
      makeCard(28, 10, {
              "type": "phrase",
              "english": "The bank is near here.",
              "portuguese": "O banco fica perto daqui."
      }),
      makeCard(28, 11, {
              "type": "grammar",
              "english": "Gramática — Lição 28: Vizinhança e Distâncias",
              "portuguese": "*Near here* (perto daqui) e *not far* (não longe) são expressões comunicativas práticas essenciais.",
              "grammarRule": {
                      "title": "Gramática — Lição 28: Vizinhança e Distâncias",
                      "explanation": "*Near here* (perto daqui) e *not far* (não longe) são expressões comunicativas práticas essenciais.",
                      "examples": [
                              {
                                      "english": "Our neighborhood is very safe.",
                                      "portuguese": ""
                              },
                              {
                                      "english": "My neighbor is friendly.",
                                      "portuguese": ""
                              }
                      ]
              }
      }),
    ]
  },
  {
    dayNumber: 29,
    weekNumber: 4,
    blockNumber: 3,
    cefrLevel: 'A1',
    title: "Lição 29 — Rotina em Família e Café da Manhã",
    subtitle: "Convivência diária e hábitos matinais",
    grammarFocus: "Advérbios de tempo e rotina matinal.",
    isDialogueDay: false,
    isReviewLesson: true,
    cards: [
      makeCard(29, 1, {
              "type": "word",
              "english": "Together",
              "portuguese": "Juntos, juntas"
      }),
      makeCard(29, 2, {
              "type": "word",
              "english": "Always",
              "portuguese": "Sempre"
      }),
      makeCard(29, 3, {
              "type": "phrase",
              "english": "We are together at home.",
              "portuguese": "Nós estamos juntos em casa."
      }),
      makeCard(29, 4, {
              "type": "word",
              "english": "Morning",
              "portuguese": "Manhã"
      }),
      makeCard(29, 5, {
              "type": "word",
              "english": "Breakfast",
              "portuguese": "Café da manhã"
      }),
      makeCard(29, 6, {
              "type": "phrase",
              "english": "Breakfast is on the table.",
              "portuguese": "O café da manhã está na mesa."
      }),
      makeCard(29, 7, {
              "type": "word",
              "english": "Every day",
              "portuguese": "Todo dia, diariamente"
      }),
      makeCard(29, 8, {
              "type": "word",
              "english": "Home",
              "portuguese": "Lar, em casa"
      }),
      makeCard(29, 9, {
              "type": "phrase",
              "english": "We have coffee every morning.",
              "portuguese": "Nós tomamos café toda manhã."
      }),
      makeCard(29, 10, {
              "type": "phrase",
              "english": "I am always happy at home.",
              "portuguese": "Eu sou sempre feliz em casa."
      }),
      makeCard(29, 11, {
              "type": "grammar",
              "english": "Gramática — Lição 29: Hábitos e Rotina com \"Always\"",
              "portuguese": "*Always* posiciona-se após o verbo To Be (*I am always happy*) ou antes de verbos comuns (*we always have coffee*).",
              "grammarRule": {
                      "title": "Gramática — Lição 29: Hábitos e Rotina com \"Always\"",
                      "explanation": "*Always* posiciona-se após o verbo To Be (*I am always happy*) ou antes de verbos comuns (*we always have coffee*).",
                      "examples": [
                              {
                                      "english": "We are together at home.",
                                      "portuguese": ""
                              },
                              {
                                      "english": "I am always happy at home.",
                                      "portuguese": ""
                              }
                      ]
              }
      }),
    ]
  },
  {
    dayNumber: 30,
    weekNumber: 4,
    blockNumber: 3,
    cefrLevel: 'A1',
    title: "Lição 30 — Relato 1 (Minha Família e Nossa Casa)",
    subtitle: "Texto de Fechamento do Bloco 3 consolidando lar e família",
    grammarFocus: "Texto narrativo descritivo em primeira pessoa.",
    isDialogueDay: true,
    isReviewLesson: false,
    cards: [
      makeCard(30, 1, {
              "type": "phrase",
              "english": "Welcome to our home in the city.",
              "portuguese": "Bem-vindo ao nosso lar na cidade."
      }),
      makeCard(30, 2, {
              "type": "phrase",
              "english": "My family is very happy here.",
              "portuguese": "Minha família é muito feliz aqui."
      }),
      makeCard(30, 3, {
              "type": "phrase",
              "english": "Our apartment is clean and cozy.",
              "portuguese": "Nosso apartamento é limpo e aconchegante."
      }),
      makeCard(30, 4, {
              "type": "phrase",
              "english": "My father is an engineer, and my mother is a teacher.",
              "portuguese": "Meu pai é engenheiro, e minha mãe é professora."
      }),
      makeCard(30, 5, {
              "type": "phrase",
              "english": "My brother and my sister are students.",
              "portuguese": "Meu irmão e minha irmã são estudantes."
      }),
      makeCard(30, 6, {
              "type": "phrase",
              "english": "We have breakfast together every morning.",
              "portuguese": "Nós tomamos café da manhã juntos toda manhã."
      }),
      makeCard(30, 7, {
              "type": "phrase",
              "english": "The garden is beautiful, and our dog plays in the yard.",
              "portuguese": "O jardim é bonito, e nosso cachorro brinca no quintal."
      }),
      makeCard(30, 8, {
              "type": "phrase",
              "english": "I love my parents, and our home is very safe.",
              "portuguese": "Eu amo meus pais, e nosso lar é muito seguro."
      }),
    ]
  },
  {
    dayNumber: 31,
    weekNumber: 5,
    blockNumber: 4,
    cefrLevel: 'A1',
    title: "Lição 31 — Plural Regular com \"+s\"",
    subtitle: "Regra geral do plural para substantivos conhecidos",
    grammarFocus: "Adição de -s no plural e concordância com are.",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(31, 1, {
              "type": "word",
              "english": "Books",
              "portuguese": "Livros"
      }),
      makeCard(31, 2, {
              "type": "word",
              "english": "Cars",
              "portuguese": "Carros"
      }),
      makeCard(31, 3, {
              "type": "phrase",
              "english": "Two cars are in the street.",
              "portuguese": "Dois carros estão na rua."
      }),
      makeCard(31, 4, {
              "type": "word",
              "english": "Houses",
              "portuguese": "Casas"
      }),
      makeCard(31, 5, {
              "type": "word",
              "english": "Tables",
              "portuguese": "Mesas"
      }),
      makeCard(31, 6, {
              "type": "phrase",
              "english": "The books are on the desk.",
              "portuguese": "Os livros estão na escrivaninha."
      }),
      makeCard(31, 7, {
              "type": "word",
              "english": "Apples",
              "portuguese": "Maçãs"
      }),
      makeCard(31, 8, {
              "type": "word",
              "english": "Dogs",
              "portuguese": "Cachorros"
      }),
      makeCard(31, 9, {
              "type": "phrase",
              "english": "I like apples and oranges.",
              "portuguese": "Eu gosto de maçãs e laranjas."
      }),
      makeCard(31, 10, {
              "type": "phrase",
              "english": "The dogs are in the park.",
              "portuguese": "Os cachorros estão no parque."
      }),
      makeCard(31, 11, {
              "type": "grammar",
              "english": "Gramática — Lição 31: A Regra Geral do Plural (+s)",
              "portuguese": "A maioria dos substantivos em inglês forma o plural simplesmente acrescentando **-s** ao final da palavra (*book -> books, car -> cars*). O verbo concorda no plural (*cars are*).",
              "grammarRule": {
                      "title": "Gramática — Lição 31: A Regra Geral do Plural (+s)",
                      "explanation": "A maioria dos substantivos em inglês forma o plural simplesmente acrescentando **-s** ao final da palavra (*book -> books, car -> cars*). O verbo concorda no plural (*cars are*).",
                      "examples": [
                              {
                                      "english": "Two cars are in the street.",
                                      "portuguese": ""
                              },
                              {
                                      "english": "The books are on the desk.",
                                      "portuguese": ""
                              }
                      ]
              }
      }),
    ]
  },
  {
    dayNumber: 32,
    weekNumber: 5,
    blockNumber: 4,
    cefrLevel: 'A1',
    title: "Lição 32 — Números Cardinais de 1 a 6",
    subtitle: "Quantificação com substantivos plurais",
    grammarFocus: "Números cardinais de um a seis.",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(32, 1, {
              "type": "word",
              "english": "One",
              "portuguese": "Um, uma"
      }),
      makeCard(32, 2, {
              "type": "word",
              "english": "Two",
              "portuguese": "Dois, duas"
      }),
      makeCard(32, 3, {
              "type": "phrase",
              "english": "I have two brothers.",
              "portuguese": "Eu tenho dois irmãos."
      }),
      makeCard(32, 4, {
              "type": "word",
              "english": "Three",
              "portuguese": "Três"
      }),
      makeCard(32, 5, {
              "type": "word",
              "english": "Four",
              "portuguese": "Quatro"
      }),
      makeCard(32, 6, {
              "type": "phrase",
              "english": "Three books are on the table.",
              "portuguese": "Três livros estão na mesa."
      }),
      makeCard(32, 7, {
              "type": "word",
              "english": "Five",
              "portuguese": "Cinco"
      }),
      makeCard(32, 8, {
              "type": "word",
              "english": "Six",
              "portuguese": "Seis"
      }),
      makeCard(32, 9, {
              "type": "phrase",
              "english": "Four apples in the box.",
              "portuguese": "Quatro maçãs na caixa."
      }),
      makeCard(32, 10, {
              "type": "phrase",
              "english": "Five students are in the room.",
              "portuguese": "Cinco alunos estão na sala."
      }),
      makeCard(32, 11, {
              "type": "grammar",
              "english": "Gramática — Lição 32: Números Cardinais (1 a 6)",
              "portuguese": "Números antecedem diretamente o substantivo no plural: *two brothers*, *three books*, *four apples*.",
              "grammarRule": {
                      "title": "Gramática — Lição 32: Números Cardinais (1 a 6)",
                      "explanation": "Números antecedem diretamente o substantivo no plural: *two brothers*, *three books*, *four apples*.",
                      "examples": [
                              {
                                      "english": "I have two brothers.",
                                      "portuguese": ""
                              },
                              {
                                      "english": "Three books are on the table.",
                                      "portuguese": ""
                              }
                      ]
              }
      }),
    ]
  },
  {
    dayNumber: 33,
    weekNumber: 5,
    blockNumber: 4,
    cefrLevel: 'A1',
    title: "Lição 33 — Números de 7 a 10 e Quantificador \"Many\"",
    subtitle: "Contagem e quantificação com substantivos plurais",
    grammarFocus: "Números de sete a dez e o quantificador many.",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(33, 1, {
              "type": "word",
              "english": "Seven",
              "portuguese": "Sete"
      }),
      makeCard(33, 2, {
              "type": "word",
              "english": "Eight",
              "portuguese": "Oito"
      }),
      makeCard(33, 3, {
              "type": "phrase",
              "english": "Seven days in a week.",
              "portuguese": "Sete dias em uma semana."
      }),
      makeCard(33, 4, {
              "type": "word",
              "english": "Nine",
              "portuguese": "Nove"
      }),
      makeCard(33, 5, {
              "type": "word",
              "english": "Ten",
              "portuguese": "Dez"
      }),
      makeCard(33, 6, {
              "type": "phrase",
              "english": "Eight students are here.",
              "portuguese": "Oito alunos estão aqui."
      }),
      makeCard(33, 7, {
              "type": "word",
              "english": "Many",
              "portuguese": "Muitos, muitas"
      }),
      makeCard(33, 8, {
              "type": "word",
              "english": "Items",
              "portuguese": "Itens"
      }),
      makeCard(33, 9, {
              "type": "phrase",
              "english": "Ten oranges on the table.",
              "portuguese": "Dez laranjas na mesa."
      }),
      makeCard(33, 10, {
              "type": "phrase",
              "english": "Many books in the school.",
              "portuguese": "Muitos livros na escola."
      }),
      makeCard(33, 11, {
              "type": "grammar",
              "english": "Gramática — Lição 33: Números 7 a 10 e \"Many\"",
              "portuguese": "*Many* é usado para coisas contáveis no plural: *many books*, *many students*. *Eight* e *items* iniciam com som vocálico.",
              "grammarRule": {
                      "title": "Gramática — Lição 33: Números 7 a 10 e \"Many\"",
                      "explanation": "*Many* é usado para coisas contáveis no plural: *many books*, *many students*. *Eight* e *items* iniciam com som vocálico.",
                      "examples": [
                              {
                                      "english": "Seven days in a week.",
                                      "portuguese": ""
                              },
                              {
                                      "english": "Many books in the school.",
                                      "portuguese": ""
                              }
                      ]
              }
      }),
    ]
  },
  {
    dayNumber: 34,
    weekNumber: 5,
    blockNumber: 4,
    cefrLevel: 'A1',
    title: "Lição 34 — Plural com \"+es\" (Sibilantes)",
    subtitle: "Terminações em -s, -ss, -sh, -ch, -x",
    grammarFocus: "Regra morfológica do sufixo -es.",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(34, 1, {
              "type": "word",
              "english": "Boxes",
              "portuguese": "Caixas"
      }),
      makeCard(34, 2, {
              "type": "word",
              "english": "Glasses",
              "portuguese": "Copos, taças, óculos"
      }),
      makeCard(34, 3, {
              "type": "phrase",
              "english": "Two boxes are in the room.",
              "portuguese": "Duas caixas estão na sala."
      }),
      makeCard(34, 4, {
              "type": "word",
              "english": "Bushes",
              "portuguese": "Arbustos"
      }),
      makeCard(34, 5, {
              "type": "word",
              "english": "Watches",
              "portuguese": "Relógios de pulso"
      }),
      makeCard(34, 6, {
              "type": "phrase",
              "english": "Three glasses of water.",
              "portuguese": "Três copos de água."
      }),
      makeCard(34, 7, {
              "type": "word",
              "english": "Sandwiches",
              "portuguese": "Sanduíches"
      }),
      makeCard(34, 8, {
              "type": "word",
              "english": "Buses",
              "portuguese": "Ônibus (plural)"
      }),
      makeCard(34, 9, {
              "type": "phrase",
              "english": "Two sandwiches, please.",
              "portuguese": "Dois sanduíches, por favor."
      }),
      makeCard(34, 10, {
              "type": "phrase",
              "english": "Two buses are at the station.",
              "portuguese": "Dois ônibus estão na estação."
      }),
      makeCard(34, 11, {
              "type": "grammar",
              "english": "Gramática — Lição 34: Plural com \"+es\"",
              "portuguese": "Substantivos terminados em sons sibilantes (*-s, -ss, -sh, -ch, -x*) recebem **-es** para facilitar a pronúncia: *box -> boxes*, *bus -> buses*, *sandwich -> sandwiches*.",
              "grammarRule": {
                      "title": "Gramática — Lição 34: Plural com \"+es\"",
                      "explanation": "Substantivos terminados em sons sibilantes (*-s, -ss, -sh, -ch, -x*) recebem **-es** para facilitar a pronúncia: *box -> boxes*, *bus -> buses*, *sandwich -> sandwiches*.",
                      "examples": [
                              {
                                      "english": "Two boxes are in the room.",
                                      "portuguese": ""
                              },
                              {
                                      "english": "Two sandwiches, please.",
                                      "portuguese": ""
                              }
                      ]
              }
      }),
    ]
  },
  {
    dayNumber: 35,
    weekNumber: 5,
    blockNumber: 4,
    cefrLevel: 'A1',
    title: "Lição 35 — Plural com \"-ies\" (Consoante + Y)",
    subtitle: "Eliminação do Y e acréscimo de -ies",
    grammarFocus: "Regra morfológica de consoante + y -> -ies.",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(35, 1, {
              "type": "word",
              "english": "Cities",
              "portuguese": "Cidades"
      }),
      makeCard(35, 2, {
              "type": "word",
              "english": "Babies",
              "portuguese": "Bebês"
      }),
      makeCard(35, 3, {
              "type": "phrase",
              "english": "Two big cities in Brazil.",
              "portuguese": "Duas grandes cidades no Brasil."
      }),
      makeCard(35, 4, {
              "type": "word",
              "english": "Parties",
              "portuguese": "Festas"
      }),
      makeCard(35, 5, {
              "type": "word",
              "english": "Families",
              "portuguese": "Famílias"
      }),
      makeCard(35, 6, {
              "type": "phrase",
              "english": "The babies are happy.",
              "portuguese": "Os bebês estão felizes."
      }),
      makeCard(35, 7, {
              "type": "word",
              "english": "Stories",
              "portuguese": "Histórias"
      }),
      makeCard(35, 8, {
              "type": "word",
              "english": "Countries",
              "portuguese": "Países"
      }),
      makeCard(35, 9, {
              "type": "phrase",
              "english": "Three families are in the park.",
              "portuguese": "Três famílias estão no parque."
      }),
      makeCard(35, 10, {
              "type": "phrase",
              "english": "We love parties with our friends.",
              "portuguese": "Nós amamos festas com nossos amigos."
      }),
      makeCard(35, 11, {
              "type": "grammar",
              "english": "Gramática — Lição 35: Plural com \"-ies\"",
              "portuguese": "Quando o substantivo termina em **consoante + y**, troca-se o *y* por **-ies** (*city -> cities*, *baby -> babies*, *family -> families*). Se for vogal + y, segue o plural normal com +s (*day -> days*).",
              "grammarRule": {
                      "title": "Gramática — Lição 35: Plural com \"-ies\"",
                      "explanation": "Quando o substantivo termina em **consoante + y**, troca-se o *y* por **-ies** (*city -> cities*, *baby -> babies*, *family -> families*). Se for vogal + y, segue o plural normal com +s (*day -> days*).",
                      "examples": [
                              {
                                      "english": "Two big cities in Brazil.",
                                      "portuguese": ""
                              },
                              {
                                      "english": "The babies are happy.",
                                      "portuguese": ""
                              }
                      ]
              }
      }),
    ]
  },
  {
    dayNumber: 36,
    weekNumber: 5,
    blockNumber: 4,
    cefrLevel: 'A1',
    title: "Lição 36 — Plurais Irregulares Fundamentais",
    subtitle: "Men, Women, Children e People",
    grammarFocus: "Substantivos plurais irregulares sem adição de -s.",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(36, 1, {
              "type": "word",
              "english": "Men",
              "portuguese": "Homens"
      }),
      makeCard(36, 2, {
              "type": "word",
              "english": "Women",
              "portuguese": "Mulheres"
      }),
      makeCard(36, 3, {
              "type": "phrase",
              "english": "The men and the women are in the office.",
              "portuguese": "Os homens e as mulheres estão no escritório."
      }),
      makeCard(36, 4, {
              "type": "word",
              "english": "Children",
              "portuguese": "Crianças"
      }),
      makeCard(36, 5, {
              "type": "word",
              "english": "People",
              "portuguese": "Pessoas"
      }),
      makeCard(36, 6, {
              "type": "phrase",
              "english": "The children play in the park.",
              "portuguese": "As crianças brincam no parque."
      }),
      makeCard(36, 7, {
              "type": "word",
              "english": "Teeth",
              "portuguese": "Dentes"
      }),
      makeCard(36, 8, {
              "type": "word",
              "english": "Feet",
              "portuguese": "Pés"
      }),
      makeCard(36, 9, {
              "type": "phrase",
              "english": "Many people are at the market.",
              "portuguese": "Muitas pessoas estão no mercado."
      }),
      makeCard(36, 10, {
              "type": "phrase",
              "english": "Two children are here.",
              "portuguese": "Duas crianças estão aqui."
      }),
      makeCard(36, 11, {
              "type": "grammar",
              "english": "Gramática — Lição 36: Plurais Irregulares",
              "portuguese": "Alguns substantivos não recebem -s no plural: *man -> men*, *woman -> women*, *child -> children*, *person -> people*. Todos concordam com verbos no plural (*children play*, *people are*).",
              "grammarRule": {
                      "title": "Gramática — Lição 36: Plurais Irregulares",
                      "explanation": "Alguns substantivos não recebem -s no plural: *man -> men*, *woman -> women*, *child -> children*, *person -> people*. Todos concordam com verbos no plural (*children play*, *people are*).",
                      "examples": [
                              {
                                      "english": "The children play in the park.",
                                      "portuguese": ""
                              },
                              {
                                      "english": "Many people are at the market.",
                                      "portuguese": ""
                              }
                      ]
              }
      }),
    ]
  },
  {
    dayNumber: 37,
    weekNumber: 5,
    blockNumber: 4,
    cefrLevel: 'A1',
    title: "Lição 37 — Cores Primárias e Neutras",
    subtitle: "Cores qualificando substantivos no singular e plural",
    grammarFocus: "Adjetivos de cor invariáveis antes do substantivo.",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(37, 1, {
              "type": "word",
              "english": "Red",
              "portuguese": "Vermelho, vermelha"
      }),
      makeCard(37, 2, {
              "type": "word",
              "english": "Blue",
              "portuguese": "Azul"
      }),
      makeCard(37, 3, {
              "type": "phrase",
              "english": "The apple is red.",
              "portuguese": "A maçã é vermelha."
      }),
      makeCard(37, 4, {
              "type": "word",
              "english": "Yellow",
              "portuguese": "Amarelo, amarela"
      }),
      makeCard(37, 5, {
              "type": "word",
              "english": "Black",
              "portuguese": "Preto, preta"
      }),
      makeCard(37, 6, {
              "type": "phrase",
              "english": "The car is blue.",
              "portuguese": "O carro é azul."
      }),
      makeCard(37, 7, {
              "type": "word",
              "english": "White",
              "portuguese": "Branco, branca"
      }),
      makeCard(37, 8, {
              "type": "word",
              "english": "Color",
              "portuguese": "Cor"
      }),
      makeCard(37, 9, {
              "type": "phrase",
              "english": "The black dog is friendly.",
              "portuguese": "O cachorro preto é amigável."
      }),
      makeCard(37, 10, {
              "type": "phrase",
              "english": "A white cup of coffee.",
              "portuguese": "Uma xícara branca de café."
      }),
      makeCard(37, 11, {
              "type": "grammar",
              "english": "Gramática — Lição 37: Adjetivos de Cor",
              "portuguese": "Cores funcionam como adjetivos e nunca vão para o plural (*blue cars*, não *blues cars*). Vêm antes do substantivo ou após o verbo To Be (*the apple is red*).",
              "grammarRule": {
                      "title": "Gramática — Lição 37: Adjetivos de Cor",
                      "explanation": "Cores funcionam como adjetivos e nunca vão para o plural (*blue cars*, não *blues cars*). Vêm antes do substantivo ou após o verbo To Be (*the apple is red*).",
                      "examples": [
                              {
                                      "english": "The apple is red.",
                                      "portuguese": ""
                              },
                              {
                                      "english": "The black dog is friendly.",
                                      "portuguese": ""
                              }
                      ]
              }
      }),
    ]
  },
  {
    dayNumber: 38,
    weekNumber: 5,
    blockNumber: 4,
    cefrLevel: 'A1',
    title: "Lição 38 — Cores Complementares e Descrição Visual",
    subtitle: "Green, Orange, Brown, Pink e Gray",
    grammarFocus: "Ampliação do vocabulário cromático.",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(38, 1, {
              "type": "word",
              "english": "Green",
              "portuguese": "Verde"
      }),
      makeCard(38, 2, {
              "type": "word",
              "english": "Orange",
              "portuguese": "Laranja (cor)"
      }),
      makeCard(38, 3, {
              "type": "phrase",
              "english": "The green tree is in the garden.",
              "portuguese": "A árvore verde fica no jardim."
      }),
      makeCard(38, 4, {
              "type": "word",
              "english": "Brown",
              "portuguese": "Marrom"
      }),
      makeCard(38, 5, {
              "type": "word",
              "english": "Pink",
              "portuguese": "Rosa"
      }),
      makeCard(38, 6, {
              "type": "phrase",
              "english": "The brown desk is new.",
              "portuguese": "A escrivaninha marrom é nova."
      }),
      makeCard(38, 7, {
              "type": "word",
              "english": "Gray",
              "portuguese": "Cinza"
      }),
      makeCard(38, 8, {
              "type": "word",
              "english": "Bright",
              "portuguese": "Brilhante, vibrante"
      }),
      makeCard(38, 9, {
              "type": "phrase",
              "english": "She has a pink dress.",
              "portuguese": "Ela tem um vestido rosa."
      }),
      makeCard(38, 10, {
              "type": "phrase",
              "english": "The gray cat is under the table.",
              "portuguese": "O gato cinza está embaixo da mesa."
      }),
      makeCard(38, 11, {
              "type": "grammar",
              "english": "Gramática — Lição 38: Cores como Adjetivos",
              "portuguese": "Note que *orange* pode significar tanto a fruta (substantivo) quanto a cor (adjetivo): *an orange* (uma laranja) vs *an orange car* (um carro laranja).",
              "grammarRule": {
                      "title": "Gramática — Lição 38: Cores como Adjetivos",
                      "explanation": "Note que *orange* pode significar tanto a fruta (substantivo) quanto a cor (adjetivo): *an orange* (uma laranja) vs *an orange car* (um carro laranja).",
                      "examples": [
                              {
                                      "english": "The green tree is in the garden.",
                                      "portuguese": ""
                              },
                              {
                                      "english": "The gray cat is under the table.",
                                      "portuguese": ""
                              }
                      ]
              }
      }),
    ]
  },
  {
    dayNumber: 39,
    weekNumber: 5,
    blockNumber: 4,
    cefrLevel: 'A1',
    title: "Lição 39 — Compras na Feira e Alimentos",
    subtitle: "Frutas, legumes e compras no mercado",
    grammarFocus: "Contagem com números e plurais na feira.",
    isDialogueDay: false,
    isReviewLesson: true,
    cards: [
      makeCard(39, 1, {
              "type": "word",
              "english": "Banana",
              "portuguese": "Banana"
      }),
      makeCard(39, 2, {
              "type": "word",
              "english": "Tomato",
              "portuguese": "Tomate"
      }),
      makeCard(39, 3, {
              "type": "phrase",
              "english": "Four bananas in the bag.",
              "portuguese": "Quatro bananas na sacola."
      }),
      makeCard(39, 4, {
              "type": "word",
              "english": "Potato",
              "portuguese": "Batata"
      }),
      makeCard(39, 5, {
              "type": "word",
              "english": "Carrot",
              "portuguese": "Cenoura"
      }),
      makeCard(39, 6, {
              "type": "phrase",
              "english": "The tomatoes are red and fresh.",
              "portuguese": "Os tomates são vermelhos e frescos."
      }),
      makeCard(39, 7, {
              "type": "word",
              "english": "Bag",
              "portuguese": "Sacola, bolsa"
      }),
      makeCard(39, 8, {
              "type": "word",
              "english": "Cheap",
              "portuguese": "Barato, barata"
      }),
      makeCard(39, 9, {
              "type": "phrase",
              "english": "The carrots are cheap today.",
              "portuguese": "As cenouras estão baratas hoje."
      }),
      makeCard(39, 10, {
              "type": "phrase",
              "english": "Six potatoes and two apples, please.",
              "portuguese": "Seis batatas e duas maçãs, por favor."
      }),
      makeCard(39, 11, {
              "type": "grammar",
              "english": "Gramática — Lição 39: Pedidos e Compras na Feira",
              "portuguese": "Para comprar na feira, juntamos a quantidade ao substantivo no plural e finalizamos com *please*: *four bananas, please*.",
              "grammarRule": {
                      "title": "Gramática — Lição 39: Pedidos e Compras na Feira",
                      "explanation": "Para comprar na feira, juntamos a quantidade ao substantivo no plural e finalizamos com *please*: *four bananas, please*.",
                      "examples": [
                              {
                                      "english": "Four bananas in the bag.",
                                      "portuguese": ""
                              },
                              {
                                      "english": "Six potatoes and two apples, please.",
                                      "portuguese": ""
                              }
                      ]
              }
      }),
    ]
  },
  {
    dayNumber: 40,
    weekNumber: 5,
    blockNumber: 4,
    cefrLevel: 'A1',
    title: "Lição 40 — Descrição 2 (A Feira e a Praça Central)",
    subtitle: "Texto de Fechamento do Bloco 4 reunindo cores, números e plurais",
    grammarFocus: "Descrição narrativa consolidando os plurais e quantidades.",
    isDialogueDay: true,
    isReviewLesson: false,
    cards: [
      makeCard(40, 1, {
              "type": "phrase",
              "english": "Today is Saturday, and the market is full of people.",
              "portuguese": "Hoje é sábado, e a feira está cheia de pessoas."
      }),
      makeCard(40, 2, {
              "type": "phrase",
              "english": "Many families are here in the square.",
              "portuguese": "Muitas famílias estão aqui na praça."
      }),
      makeCard(40, 3, {
              "type": "phrase",
              "english": "The apples are red, and the bananas are yellow.",
              "portuguese": "As maçãs são vermelhas, e as bananas são amarelas."
      }),
      makeCard(40, 4, {
              "type": "phrase",
              "english": "I buy six fresh tomatoes and four carrots.",
              "portuguese": "Eu compro seis tomates frescos e quatro cenouras."
      }),
      makeCard(40, 5, {
              "type": "phrase",
              "english": "Two women sell fresh fruits in big bags.",
              "portuguese": "Duas mulheres vendem frutas frescas em sacolas grandes."
      }),
      makeCard(40, 6, {
              "type": "phrase",
              "english": "The children play near the trees with their dogs.",
              "portuguese": "As crianças brincam perto das árvores com seus cachorros."
      }),
      makeCard(40, 7, {
              "type": "phrase",
              "english": "Everything is cheap and fresh at the market.",
              "portuguese": "Tudo está barato e fresco na feira."
      }),
    ]
  },
  {
    dayNumber: 41,
    weekNumber: 6,
    blockNumber: 5,
    cefrLevel: 'A1',
    title: "Lição 41 — Demonstrativos no Singular: \"This\" e \"That\"",
    subtitle: "Lição 41 do nível A1",
    grammarFocus: "*This* indica proximidade no tempo ou espaço; *that* indica distanciamento. Ambos concordam com nomes e verbos no singular.",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(41, 1, {
        "type": "word",
        "english": "This",
        "portuguese": "Este, esta, isto (próximo a quem fala)"
      }),
      makeCard(41, 2, {
        "type": "word",
        "english": "Shirt",
        "portuguese": "Camisa"
      }),
      makeCard(41, 3, {
        "type": "phrase",
        "english": "This shirt is blue.",
        "portuguese": "Esta camisa é azul."
      }),
      makeCard(41, 4, {
        "type": "word",
        "english": "That",
        "portuguese": "Aquele, aquela, aquilo (afastado de quem fala)"
      }),
      makeCard(41, 5, {
        "type": "word",
        "english": "Jacket",
        "portuguese": "Jaqueta, casaco"
      }),
      makeCard(41, 6, {
        "type": "phrase",
        "english": "That jacket is red.",
        "portuguese": "Aquela jaqueta é vermelha."
      }),
      makeCard(41, 7, {
        "type": "phrase",
        "english": "This book is new.",
        "portuguese": "Este livro é novo."
      }),
      makeCard(41, 8, {
        "type": "phrase",
        "english": "That book is old.",
        "portuguese": "Aquele livro é velho."
      }),
      makeCard(41, 9, {
        "type": "phrase",
        "english": "This is a blue shirt.",
        "portuguese": "Isto é uma camisa azul."
      }),
      makeCard(41, 10, {
        "type": "phrase",
        "english": "That is a red jacket.",
        "portuguese": "Aquilo é uma jaqueta vermelha."
      }),
      makeCard(41, 11, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "*This* indica proximidade no tempo ou espaço; *that* indica distanciamento. Ambos concordam com nomes e verbos no singular.",
        "grammarRule": {
          "title": "Gramática — Lição 41",
          "explanation": "*This* indica proximidade no tempo ou espaço; *that* indica distanciamento. Ambos concordam com nomes e verbos no singular.",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 42,
    weekNumber: 6,
    blockNumber: 5,
    cefrLevel: 'A1',
    title: "Lição 42 — Demonstrativos no Plural: \"These\" e \"Those\"",
    subtitle: "Lição 42 do nível A1",
    grammarFocus: "*These* é o plural de *this*; *those* é o plural de *that*. Concordam com substantivos no plural e usam o verbo *are*.",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(42, 1, {
        "type": "word",
        "english": "These",
        "portuguese": "Estes, estas (próximos a quem fala)"
      }),
      makeCard(42, 2, {
        "type": "word",
        "english": "Pants",
        "portuguese": "Calça(s) (palavra sempre plural no inglês)"
      }),
      makeCard(42, 3, {
        "type": "phrase",
        "english": "These pants are black.",
        "portuguese": "Estas calças são pretas."
      }),
      makeCard(42, 4, {
        "type": "word",
        "english": "Those",
        "portuguese": "Aqueles, aquelas (afastados de quem fala)"
      }),
      makeCard(42, 5, {
        "type": "word",
        "english": "Shoes",
        "portuguese": "Sapatos (plural)"
      }),
      makeCard(42, 6, {
        "type": "phrase",
        "english": "Those shoes are brown.",
        "portuguese": "Aqueles sapatos são marrons."
      }),
      makeCard(42, 7, {
        "type": "phrase",
        "english": "These books are on the table.",
        "portuguese": "Estes livros estão sobre a mesa."
      }),
      makeCard(42, 8, {
        "type": "phrase",
        "english": "Those shoes are under the bed.",
        "portuguese": "Aqueles sapatos estão embaixo da cama."
      }),
      makeCard(42, 9, {
        "type": "phrase",
        "english": "These are black pants.",
        "portuguese": "Estas são calças pretas."
      }),
      makeCard(42, 10, {
        "type": "phrase",
        "english": "Those are brown shoes.",
        "portuguese": "Aqueles são sapatos marrons."
      }),
      makeCard(42, 11, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "*These* é o plural de *this*; *those* é o plural de *that*. Concordam obrigatoriamente com o verbo *are* e substantivos no plural.",
        "grammarRule": {
          "title": "Gramática — Lição 42",
          "explanation": "*These* é o plural de *this*; *those* é o plural de *that*. Concordam obrigatoriamente com o verbo *are* e substantivos no plural.",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 43,
    weekNumber: 7,
    blockNumber: 5,
    cefrLevel: 'A1',
    title: "Lição 43 — Revisão: Vestuário e Compras *(4 palavras novas)*",
    subtitle: "Novas: **Dress** (Plural *dresses* com +es), **Coat** (substantivo com plural *coats*), **Cheap** (adjetivo de valor), **Expensive** (adjetivo de valor).",
    grammarFocus: "Fixação exclusiva de *this/that/these/those* das Lições 41 e 42. O vocabulário novo é aplicado nas frases; não há explicação gramatical nova.",
    isDialogueDay: false,
    isReviewLesson: true,
    cards: [
      makeCard(43, 1, {
        "type": "word",
        "english": "Dress",
        "portuguese": "Vestido (plural: dresses)"
      }),
      makeCard(43, 2, {
        "type": "phrase",
        "english": "This red dress is beautiful.",
        "portuguese": "Este vestido vermelho é bonito."
      }),
      makeCard(43, 3, {
        "type": "word",
        "english": "Coat",
        "portuguese": "Casaco comprido, sobretudo"
      }),
      makeCard(43, 4, {
        "type": "phrase",
        "english": "That brown coat is new.",
        "portuguese": "Aquele casaco marrom é novo."
      }),
      makeCard(43, 5, {
        "type": "word",
        "english": "Cheap",
        "portuguese": "Barato, barata"
      }),
      makeCard(43, 6, {
        "type": "phrase",
        "english": "These black shoes are cheap.",
        "portuguese": "Estes sapatos pretos são baratos."
      }),
      makeCard(43, 7, {
        "type": "word",
        "english": "Expensive",
        "portuguese": "Caro, cara"
      }),
      makeCard(43, 8, {
        "type": "phrase",
        "english": "That jacket is very expensive.",
        "portuguese": "Aquela jaqueta é muito cara."
      }),
      makeCard(43, 9, {
        "type": "phrase",
        "english": "This dress is cheap.",
        "portuguese": "Este vestido é barato."
      }),
      makeCard(43, 10, {
        "type": "phrase",
        "english": "That coat is expensive.",
        "portuguese": "Aquele casaco é caro."
      }),
      makeCard(43, 11, {
        "type": "phrase",
        "english": "These pants are cheap.",
        "portuguese": "Estas calças são baratas."
      }),
      makeCard(43, 12, {
        "type": "phrase",
        "english": "Those shoes are expensive.",
        "portuguese": "Aqueles sapatos são caros."
      })
    ]
  },
  {
    dayNumber: 44,
    weekNumber: 7,
    blockNumber: 5,
    cefrLevel: 'A1',
    title: "Lição 44 — Existência Afirmativa no Singular: \"There is\"",
    subtitle: "Lição 44 do nível A1",
    grammarFocus: "*There is* (contraído: *There's*) expressa a existência de algo no singular; não deve ser confundido com *have*, que indica posse.",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(44, 1, {
        "type": "word",
        "english": "There is",
        "portuguese": "Há, existe, tem (para singular)"
      }),
      makeCard(44, 2, {
        "type": "word",
        "english": "Supermarket",
        "portuguese": "Supermercado"
      }),
      makeCard(44, 3, {
        "type": "phrase",
        "english": "There is a supermarket in the city.",
        "portuguese": "Há um supermercado na cidade."
      }),
      makeCard(44, 4, {
        "type": "word",
        "english": "Pharmacy",
        "portuguese": "Farmácia (plural: pharmacies)"
      }),
      makeCard(44, 5, {
        "type": "phrase",
        "english": "There is a pharmacy in the city.",
        "portuguese": "Há uma farmácia na cidade."
      }),
      makeCard(44, 6, {
        "type": "phrase",
        "english": "There is a doctor in the office.",
        "portuguese": "Há um médico no escritório."
      }),
      makeCard(44, 7, {
        "type": "phrase",
        "english": "There is a big bed in the room.",
        "portuguese": "Há uma cama grande no quarto."
      }),
      makeCard(44, 8, {
        "type": "phrase",
        "english": "There is a clean cup on the table.",
        "portuguese": "Há uma xícara limpa sobre a mesa."
      }),
      makeCard(44, 9, {
        "type": "phrase",
        "english": "There is an apple on the table.",
        "portuguese": "Há uma maçã sobre a mesa."
      }),
      makeCard(44, 10, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "*There is* (contraído: *There's*) expressa a existência de algo no singular. Não confunda com o verbo *have*, que indica posse.",
        "grammarRule": {
          "title": "Gramática — Lição 44",
          "explanation": "*There is* (contraído: *There's*) expressa a existência de algo no singular. Não confunda com o verbo *have*, que indica posse.",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 45,
    weekNumber: 7,
    blockNumber: 5,
    cefrLevel: 'A1',
    title: "Lição 45 — Existência Afirmativa no Plural: \"There are\"",
    subtitle: "Lição 45 do nível A1",
    grammarFocus: "*There are* expressa existência no plural e não possui forma contraída comum na escrita padrão.",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(45, 1, {
        "type": "word",
        "english": "There are",
        "portuguese": "Há, existem, têm (para plural)"
      }),
      makeCard(45, 2, {
        "type": "word",
        "english": "Restaurant (Plural: Restaurants)",
        "portuguese": "Restaurante, restaurantes"
      }),
      makeCard(45, 3, {
        "type": "phrase",
        "english": "There are two restaurants in the city.",
        "portuguese": "Há dois restaurantes na cidade."
      }),
      makeCard(45, 4, {
        "type": "phrase",
        "english": "There are many green trees in the park.",
        "portuguese": "Há muitas árvores verdes no parque."
      }),
      makeCard(45, 5, {
        "type": "phrase",
        "english": "There are four chairs in the kitchen.",
        "portuguese": "Há quatro cadeiras na cozinha."
      }),
      makeCard(45, 6, {
        "type": "phrase",
        "english": "There are ten students in the school.",
        "portuguese": "Há dez estudantes na escola."
      }),
      makeCard(45, 7, {
        "type": "phrase",
        "english": "There are three buses in the park.",
        "portuguese": "Há três ônibus no parque."
      }),
      makeCard(45, 8, {
        "type": "phrase",
        "english": "There are many people in the city.",
        "portuguese": "Há muitas pessoas na cidade."
      }),
      makeCard(45, 9, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "*There are* expressa existência no plural e não possui forma contraída comum na escrita padrão.",
        "grammarRule": {
          "title": "Gramática — Lição 45",
          "explanation": "*There are* expressa existência no plural e não possui forma contraída comum na escrita padrão.",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 46,
    weekNumber: 7,
    blockNumber: 5,
    cefrLevel: 'A1',
    title: "Lição 46 — Revisão: Pertences e Conveniência *(4 palavras novas)*",
    subtitle: "Novas: **Hat** (substantivo com plural *hats*), **Umbrella** (substantivo com plural *umbrellas*), **Store** (substantivo com plural *stores*), **Nice** (adjetivo geral positivo).",
    grammarFocus: "Fixação exclusiva de *there is/there are* das Lições 44 e 45. O vocabulário novo é aplicado nas frases, sem explicação gramatical nova.",
    isDialogueDay: false,
    isReviewLesson: true,
    cards: [
      makeCard(46, 1, {
        "type": "word",
        "english": "Hat",
        "portuguese": "Chapéu"
      }),
      makeCard(46, 2, {
        "type": "word",
        "english": "Nice",
        "portuguese": "Agradável, bom, simpático, legal"
      }),
      makeCard(46, 3, {
        "type": "phrase",
        "english": "This black hat is nice.",
        "portuguese": "Este chapéu preto é legal."
      }),
      makeCard(46, 4, {
        "type": "word",
        "english": "Umbrella",
        "portuguese": "Guarda-chuva"
      }),
      makeCard(46, 5, {
        "type": "phrase",
        "english": "There is a red umbrella in the room.",
        "portuguese": "Há um guarda-chuva vermelho no cômodo."
      }),
      makeCard(46, 6, {
        "type": "word",
        "english": "Store",
        "portuguese": "Loja"
      }),
      makeCard(46, 7, {
        "type": "phrase",
        "english": "There is a store in the city.",
        "portuguese": "Há uma loja na cidade."
      }),
      makeCard(46, 8, {
        "type": "phrase",
        "english": "There are two brown hats in the store.",
        "portuguese": "Há dois chapéus marrons na loja."
      }),
      makeCard(46, 9, {
        "type": "phrase",
        "english": "There is an umbrella under the chair.",
        "portuguese": "Há um guarda-chuva embaixo da cadeira."
      }),
      makeCard(46, 10, {
        "type": "phrase",
        "english": "These shoes are nice and cheap.",
        "portuguese": "Estes sapatos são legais e baratos."
      })
    ]
  },
  {
    dayNumber: 47,
    weekNumber: 7,
    blockNumber: 5,
    cefrLevel: 'A1',
    title: "Lição 47 — Existência Negativa: \"There isn't\" e \"There aren't\"",
    subtitle: "Lição 47 do nível A1",
    grammarFocus: "A negação de existência é feita com *There is not* (*Ther...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(47, 1, {
        "type": "word",
        "english": "There isn't",
        "portuguese": "Não há, não existe (singular negativo)"
      }),
      makeCard(47, 2, {
        "type": "word",
        "english": "Problem (Plural: Problems)",
        "portuguese": "Problema, problemas"
      }),
      makeCard(47, 3, {
        "type": "phrase",
        "english": "There isn't a problem here.",
        "portuguese": "Não há um problema aqui."
      }),
      makeCard(47, 4, {
        "type": "word",
        "english": "There aren't",
        "portuguese": "Não há, não existem (plural negativo)"
      }),
      makeCard(47, 5, {
        "type": "phrase",
        "english": "There aren't buses on this street.",
        "portuguese": "Não há ônibus nesta rua."
      }),
      makeCard(47, 6, {
        "type": "phrase",
        "english": "There isn't a hospital in this small city.",
        "portuguese": "Não tem um hospital nesta cidade pequena."
      }),
      makeCard(47, 7, {
        "type": "phrase",
        "english": "There aren't chairs in the room.",
        "portuguese": "Não há cadeiras na sala."
      }),
      makeCard(47, 8, {
        "type": "phrase",
        "english": "There isn't milk in the kitchen.",
        "portuguese": "Não há leite na cozinha."
      }),
      makeCard(47, 9, {
        "type": "phrase",
        "english": "There aren't students in the school today.",
        "portuguese": "Não há estudantes na escola hoje."
      }),
      makeCard(47, 10, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "A negação de existência é feita com *There is not* (*There isn't*) para o singular e *There are not* (*There aren't*) para o plural.",
        "grammarRule": {
          "title": "Gramática — Lição 47",
          "explanation": "A negação de existência é feita com *There is not* (*There isn't*) para o singular e *There are not* (*There aren't*) para o plural.",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 48,
    weekNumber: 7,
    blockNumber: 5,
    cefrLevel: 'A1',
    title: "Lição 48 — Existência Interrogativa: \"Is there...?\" e \"Are there...?\"",
    subtitle: "Lição 48 do nível A1",
    grammarFocus: "Para formular perguntas de existência, inverte-se o verbo...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(48, 1, {
        "type": "word",
        "english": "Any",
        "portuguese": "Algum, alguma, nenhuns (em perguntas e negativas plurais)"
      }),
      makeCard(48, 2, {
        "type": "word",
        "english": "Bus stop",
        "portuguese": "Ponto de ônibus"
      }),
      makeCard(48, 3, {
        "type": "phrase",
        "english": "Is there a bus stop near here?",
        "portuguese": "Há um ponto de ônibus perto daqui?"
      }),
      makeCard(48, 4, {
        "type": "word",
        "english": "Station",
        "portuguese": "Estação"
      }),
      makeCard(48, 5, {
        "type": "phrase",
        "english": "Is there a station in the city?",
        "portuguese": "Há uma estação na cidade?"
      }),
      makeCard(48, 6, {
        "type": "phrase",
        "english": "Are there any pharmacies on this street?",
        "portuguese": "Há alguma farmácia nesta rua?"
      }),
      makeCard(48, 7, {
        "type": "phrase",
        "english": "Is there a table near the window? Yes, there is.",
        "portuguese": "Há uma mesa perto da janela? Sim, há."
      }),
      makeCard(48, 8, {
        "type": "phrase",
        "english": "Are there any clean cups? No, there aren't.",
        "portuguese": "Há alguma xícara limpa? Não, não há."
      }),
      makeCard(48, 9, {
        "type": "phrase",
        "english": "Is there any coffee for the teacher? Yes, there is.",
        "portuguese": "Há algum café para o professor? Sim, há."
      }),
      makeCard(48, 10, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Para formular perguntas de existência, inverte-se o verbo com a partícula *there*: *Is there a/an...?* (singular) e *Are there any...?* (plural).",
        "grammarRule": {
          "title": "Gramática — Lição 48",
          "explanation": "Para formular perguntas de existência, inverte-se o verbo com a partícula *there*: *Is there a/an...?* (singular) e *Are there any...?* (plural).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 49,
    weekNumber: 7,
    blockNumber: 5,
    cefrLevel: 'A1',
    title: "Lição 49 — Revisão: Serviços do Bairro *(4 palavras novas)*",
    subtitle: "Novas: **Post office** (locução substantiva), **Near here** (locução adverbial), **Around** (preposição/advérbio), **Map** (substantivo).",
    grammarFocus: "Revisão: Serviços do Bairro *(4 palavras novas)*",
    isDialogueDay: false,
    isReviewLesson: true,
    cards: [
      makeCard(49, 1, {
        "type": "word",
        "english": "Near here",
        "portuguese": "Perto daqui"
      }),
      makeCard(49, 2, {
        "type": "phrase",
        "english": "Is there a bank near here?",
        "portuguese": "Há um banco perto daqui?"
      }),
      makeCard(49, 3, {
        "type": "word",
        "english": "Post office",
        "portuguese": "Correio, agência de correios"
      }),
      makeCard(49, 4, {
        "type": "phrase",
        "english": "There is a post office next to the supermarket.",
        "portuguese": "Há um correio ao lado do supermercado."
      }),
      makeCard(49, 5, {
        "type": "word",
        "english": "Map",
        "portuguese": "Mapa"
      }),
      makeCard(49, 6, {
        "type": "phrase",
        "english": "There is a map on the table.",
        "portuguese": "Há um mapa sobre a mesa."
      }),
      makeCard(49, 7, {
        "type": "word",
        "english": "Around",
        "portuguese": "Por perto, ao redor"
      }),
      makeCard(49, 8, {
        "type": "phrase",
        "english": "Are there good restaurants around?",
        "portuguese": "Há bons restaurantes por perto?"
      }),
      makeCard(49, 9, {
        "type": "phrase",
        "english": "Excuse me!",
        "portuguese": "Com licença!"
      }),
      makeCard(49, 10, {
        "type": "phrase",
        "english": "Is there a pharmacy near here? Yes, there is.",
        "portuguese": "Há uma farmácia perto daqui? Sim, há."
      }),
      makeCard(49, 11, {
        "type": "phrase",
        "english": "There aren't any post offices around the park.",
        "portuguese": "Não há nenhum correio ao redor do parque."
      }),
      makeCard(49, 12, {
        "type": "phrase",
        "english": "Those nice stores are near the bus stop.",
        "portuguese": "Aquelas lojas legais ficam perto do ponto de ônibus."
      })
    ]
  },
  {
    dayNumber: 50,
    weekNumber: 8,
    blockNumber: 5,
    cefrLevel: 'A1',
    title: "Lição 50 — Diálogo 2 (Na Loja e no Bairro: Compras e Informações)",
    subtitle: "Lição 50 do nível A1",
    grammarFocus: "Diálogo 2 (Na Loja e no Bairro: Compras e Informações)",
    isDialogueDay: true,
    isReviewLesson: false,
    cards: [
      makeCard(50, 1, {
        "type": "dialogue",
        "english": "Excuse me, good morning!",
        "portuguese": "Com licença, bom dia!"
      }),
      makeCard(50, 2, {
        "type": "dialogue",
        "english": "Is there a store near here?",
        "portuguese": "Há uma loja perto daqui?"
      }),
      makeCard(50, 3, {
        "type": "dialogue",
        "english": "Yes, there is.",
        "portuguese": "Sim, há."
      }),
      makeCard(50, 4, {
        "type": "dialogue",
        "english": "There is a nice store next to the supermarket.",
        "portuguese": "Há uma loja legal ao lado do supermercado."
      }),
      makeCard(50, 5, {
        "type": "dialogue",
        "english": "Thanks! Is this black jacket expensive?",
        "portuguese": "Obrigado! Esta jaqueta preta é cara?"
      }),
      makeCard(50, 6, {
        "type": "dialogue",
        "english": "No, this jacket is cheap.",
        "portuguese": "Não, esta jaqueta é barata."
      }),
      makeCard(50, 7, {
        "type": "dialogue",
        "english": "Those shoes are expensive.",
        "portuguese": "Aqueles sapatos são caros."
      }),
      makeCard(50, 8, {
        "type": "dialogue",
        "english": "Are there any red shirts in this store?",
        "portuguese": "Há alguma camisa vermelha nesta loja?"
      }),
      makeCard(50, 9, {
        "type": "dialogue",
        "english": "Yes, there are. Those red shirts are very nice.",
        "portuguese": "Sim, há. Aquelas camisas vermelhas são muito bonitas."
      }),
      makeCard(50, 10, {
        "type": "dialogue",
        "english": "A red shirt and these black pants, please.",
        "portuguese": "Uma camisa vermelha e estas calças pretas, por favor."
      }),
      makeCard(50, 11, {
        "type": "dialogue",
        "english": "You are welcome! Have a good day.",
        "portuguese": "De nada! Tenha um bom dia."
      })
    ]
  },
  {
    dayNumber: 51,
    weekNumber: 8,
    blockNumber: 6,
    cefrLevel: 'A1',
    title: "Lição 51 — Question Words: \"What\" e \"Where\"",
    subtitle: "Lição 51 do nível A1",
    grammarFocus: "*What* questiona sobre objetos ou identidade; *Where* que...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(51, 1, {
        "type": "word",
        "english": "What",
        "portuguese": "O que, qual"
      }),
      makeCard(51, 2, {
        "type": "word",
        "english": "Where",
        "portuguese": "Onde"
      }),
      makeCard(51, 3, {
        "type": "phrase",
        "english": "What is your name?",
        "portuguese": "Qual é o seu nome?"
      }),
      makeCard(51, 4, {
        "type": "phrase",
        "english": "Where is the hospital?",
        "portuguese": "Onde fica o hospital?"
      }),
      makeCard(51, 5, {
        "type": "word",
        "english": "Country",
        "portuguese": "País (plural: countries)"
      }),
      makeCard(51, 6, {
        "type": "phrase",
        "english": "What country is this?",
        "portuguese": "Que país é este?"
      }),
      makeCard(51, 7, {
        "type": "phrase",
        "english": "Where is my bag?",
        "portuguese": "Onde está a minha bolsa?"
      }),
      makeCard(51, 8, {
        "type": "phrase",
        "english": "What is in that box?",
        "portuguese": "O que está naquela caixa?"
      }),
      makeCard(51, 9, {
        "type": "phrase",
        "english": "Where is the doctor? He is at the hospital.",
        "portuguese": "Onde está o médico? Ele está no hospital."
      }),
      makeCard(51, 10, {
        "type": "phrase",
        "english": "What is on the table?",
        "portuguese": "O que está sobre a mesa?"
      }),
      makeCard(51, 11, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "*What* questiona sobre objetos ou identidade; *Where* questiona sobre localização. Em perguntas com o To Be, o verbo inverte imediatamente após a palavra interrogativa (*What is...*, *Where are...*).",
        "grammarRule": {
          "title": "Gramática — Lição 51",
          "explanation": "*What* questiona sobre objetos ou identidade; *Where* questiona sobre localização. Em perguntas com o To Be, o verbo inverte imediatamente após a palavra interrogativa (*What is...*, *Where are...*).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 52,
    weekNumber: 8,
    blockNumber: 6,
    cefrLevel: 'A1',
    title: "Lição 52 — Origens e Países 1: \"Where are you from?\"",
    subtitle: "Lição 52 do nível A1",
    grammarFocus: "Para perguntar a origem: *Where are you from?* $\\rightarr...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(52, 1, {
        "type": "word",
        "english": "United States",
        "portuguese": "Estados Unidos"
      }),
      makeCard(52, 2, {
        "type": "word",
        "english": "American",
        "portuguese": "Americano, americana"
      }),
      makeCard(52, 3, {
        "type": "phrase",
        "english": "I am from the United States.",
        "portuguese": "Eu sou dos Estados Unidos."
      }),
      makeCard(52, 4, {
        "type": "phrase",
        "english": "She is American.",
        "portuguese": "Ela é americana."
      }),
      makeCard(52, 5, {
        "type": "word",
        "english": "England",
        "portuguese": "Inglaterra"
      }),
      makeCard(52, 6, {
        "type": "word",
        "english": "English",
        "portuguese": "Inglês, inglesa (nacionalidade)"
      }),
      makeCard(52, 7, {
        "type": "phrase",
        "english": "He is from England.",
        "portuguese": "Ele é da Inglaterra."
      }),
      makeCard(52, 8, {
        "type": "phrase",
        "english": "They are English.",
        "portuguese": "Eles são ingleses."
      }),
      makeCard(52, 9, {
        "type": "phrase",
        "english": "Where are you from? I am from Brazil.",
        "portuguese": "De onde você é? Eu sou do Brasil."
      }),
      makeCard(52, 10, {
        "type": "phrase",
        "english": "Is he American or English?",
        "portuguese": "Ele é americano ou inglês?"
      }),
      makeCard(52, 11, {
        "type": "phrase",
        "english": "We are from Brazil, and they are from England.",
        "portuguese": "Nós somos do Brasil, e eles são da Inglaterra."
      }),
      makeCard(52, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Para perguntar a origem: *Where are you from?* $\\rightarrow$ resposta: *I am from + [país]*. Nacionalidades em inglês iniciam sempre com letra maiúscula (*American, English*).",
        "grammarRule": {
          "title": "Gramática — Lição 52",
          "explanation": "Para perguntar a origem: *Where are you from?* $\\rightarrow$ resposta: *I am from + [país]*. Nacionalidades em inglês iniciam sempre com letra maiúscula (*American, English*).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 53,
    weekNumber: 8,
    blockNumber: 6,
    cefrLevel: 'A1',
    title: "Lição 53 — Revisão: Identidade e Boas-Vindas *(4 palavras novas)*",
    subtitle: "Novas: **Spain** (substantivo próprio), **Spanish** (adjetivo de nacionalidade), **Meet** (verbo de encontro), **Nice to meet you** (fórmula social).",
    grammarFocus: "Revisão: Identidade e Boas-Vindas *(4 palavras novas)*",
    isDialogueDay: false,
    isReviewLesson: true,
    cards: [
      makeCard(53, 1, {
        "type": "word",
        "english": "Spain",
        "portuguese": "Espanha"
      }),
      makeCard(53, 2, {
        "type": "word",
        "english": "Spanish",
        "portuguese": "Espanhol, espanhola"
      }),
      makeCard(53, 3, {
        "type": "phrase",
        "english": "She is from Spain.",
        "portuguese": "Ela é da Espanha."
      }),
      makeCard(53, 4, {
        "type": "phrase",
        "english": "He is Spanish.",
        "portuguese": "Ele é espanhol."
      }),
      makeCard(53, 5, {
        "type": "word",
        "english": "Meet",
        "portuguese": "Conhecer, encontrar"
      }),
      makeCard(53, 6, {
        "type": "word",
        "english": "Nice to meet you",
        "portuguese": "Prazer em conhecer você"
      }),
      makeCard(53, 7, {
        "type": "phrase",
        "english": "Hello! Nice to meet you.",
        "portuguese": "Olá! Prazer em conhecer você."
      }),
      makeCard(53, 8, {
        "type": "phrase",
        "english": "Where is she from? She is from Spain.",
        "portuguese": "De onde ela é? Ela é da Espanha."
      }),
      makeCard(53, 9, {
        "type": "phrase",
        "english": "He speaks Spanish and English.",
        "portuguese": "Ele fala espanhol e inglês."
      }),
      makeCard(53, 10, {
        "type": "phrase",
        "english": "What is his name? His name is Carlos.",
        "portuguese": "Qual é o nome dele? O nome dele é Carlos."
      }),
      makeCard(53, 11, {
        "type": "phrase",
        "english": "Nice to meet you, Carlos!",
        "portuguese": "Prazer em conhecer você, Carlos!"
      }),
      makeCard(53, 12, {
        "type": "phrase",
        "english": "Are they from England? No, they are from Spain.",
        "portuguese": "Eles são da Inglaterra? Não, eles são da Espanha."
      })
    ]
  },
  {
    dayNumber: 54,
    weekNumber: 8,
    blockNumber: 6,
    cefrLevel: 'A1',
    title: "Lição 54 — Question Words: \"Who\" e \"How\"",
    subtitle: "Lição 54 do nível A1",
    grammarFocus: "*Who* investiga identidade pessoal (*Who is he?*); *How* ...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(54, 1, {
        "type": "word",
        "english": "Who",
        "portuguese": "Quem"
      }),
      makeCard(54, 2, {
        "type": "word",
        "english": "How",
        "portuguese": "Como"
      }),
      makeCard(54, 3, {
        "type": "phrase",
        "english": "Who is that man?",
        "portuguese": "Quem é aquele homem?"
      }),
      makeCard(54, 4, {
        "type": "phrase",
        "english": "How are you?",
        "portuguese": "Como você está?"
      }),
      makeCard(54, 5, {
        "type": "phrase",
        "english": "Who is she? She is my teacher.",
        "portuguese": "Quem é ela? Ela é minha professora."
      }),
      makeCard(54, 6, {
        "type": "phrase",
        "english": "How are you today? I am fine, thanks.",
        "portuguese": "Como você está hoje? Estou bem, obrigado."
      }),
      makeCard(54, 7, {
        "type": "phrase",
        "english": "Who are those people?",
        "portuguese": "Quem são aquelas pessoas?"
      }),
      makeCard(54, 8, {
        "type": "phrase",
        "english": "They are my friends.",
        "portuguese": "Eles são meus amigos."
      }),
      makeCard(54, 9, {
        "type": "phrase",
        "english": "Who is at the door?",
        "portuguese": "Quem está na porta?"
      }),
      makeCard(54, 10, {
        "type": "phrase",
        "english": "It is my brother.",
        "portuguese": "É meu irmão."
      }),
      makeCard(54, 11, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "*Who* investiga identidade pessoal (*Who is he?*); *How* pergunta sobre modo, qualidade ou condição (*How are you?*).",
        "grammarRule": {
          "title": "Gramática — Lição 54",
          "explanation": "*Who* investiga identidade pessoal (*Who is he?*); *How* pergunta sobre modo, qualidade ou condição (*How are you?*).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 55,
    weekNumber: 8,
    blockNumber: 6,
    cefrLevel: 'A1',
    title: "Lição 55 — Profissões 1 (Com Artigos \"A\" e \"An\")",
    subtitle: "Lição 55 do nível A1",
    grammarFocus: "Em inglês, profissões no singular exigem **obrigatoriamen...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(55, 1, {
        "type": "word",
        "english": "Nurse",
        "portuguese": "Enfermeiro, enfermeira"
      }),
      makeCard(55, 2, {
        "type": "word",
        "english": "Driver",
        "portuguese": "Motorista"
      }),
      makeCard(55, 3, {
        "type": "phrase",
        "english": "She is a nurse at the hospital.",
        "portuguese": "Ela é enfermeira no hospital."
      }),
      makeCard(55, 4, {
        "type": "phrase",
        "english": "He is a bus driver.",
        "portuguese": "Ele é motorista de ônibus."
      }),
      makeCard(55, 5, {
        "type": "word",
        "english": "Engineer",
        "portuguese": "Engenheiro, engenheira"
      }),
      makeCard(55, 6, {
        "type": "word",
        "english": "Waiter",
        "portuguese": "Garçom"
      }),
      makeCard(55, 7, {
        "type": "phrase",
        "english": "My brother is an engineer.",
        "portuguese": "Meu irmão é engenheiro."
      }),
      makeCard(55, 8, {
        "type": "phrase",
        "english": "That man is a waiter in the restaurant.",
        "portuguese": "Aquele homem é garçom no restaurante."
      }),
      makeCard(55, 9, {
        "type": "phrase",
        "english": "Who is the nurse? She is my sister.",
        "portuguese": "Quem é a enfermeira? Ela é minha irmã."
      }),
      makeCard(55, 10, {
        "type": "phrase",
        "english": "Is he a driver? Yes, he is.",
        "portuguese": "Ele é motorista? Sim, ele é."
      }),
      makeCard(55, 11, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Em inglês, profissões no singular exigem **obrigatoriamente** o artigo indefinido *a* ou *an* (*a nurse*, *an engineer*), diferentemente do português (\"ela é enfermeira\").",
        "grammarRule": {
          "title": "Gramática — Lição 55",
          "explanation": "Em inglês, profissões no singular exigem **obrigatoriamente** o artigo indefinido *a* ou *an* (*a nurse*, *an engineer*), diferentemente do português (\"ela é enfermeira\").",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 56,
    weekNumber: 8,
    blockNumber: 6,
    cefrLevel: 'A1',
    title: "Lição 56 — Revisão: Profissões e Local de Trabalho *(4 palavras novas)*",
    subtitle: "Novas: **Manager** (substantivo regular), **Job** (substantivo regular), **Great** (adjetivo geral), **Help** (verbo de cooperação com I/you/we/they).",
    grammarFocus: "Revisão: Profissões e Local de Trabalho *(4 palavras novas)*",
    isDialogueDay: false,
    isReviewLesson: true,
    cards: [
      makeCard(56, 1, {
        "type": "word",
        "english": "Manager",
        "portuguese": "Gerente"
      }),
      makeCard(56, 2, {
        "type": "word",
        "english": "Job",
        "portuguese": "Emprego, trabalho (plural: jobs)"
      }),
      makeCard(56, 3, {
        "type": "phrase",
        "english": "He is a store manager.",
        "portuguese": "Ele é gerente de loja."
      }),
      makeCard(56, 4, {
        "type": "phrase",
        "english": "This is a great job.",
        "portuguese": "Este é um ótimo trabalho."
      }),
      makeCard(56, 5, {
        "type": "word",
        "english": "Great",
        "portuguese": "Ótimo, excelente"
      }),
      makeCard(56, 6, {
        "type": "word",
        "english": "Help",
        "portuguese": "Ajudar"
      }),
      makeCard(56, 7, {
        "type": "phrase",
        "english": "The nurses help the doctors.",
        "portuguese": "As enfermeiras ajudam os médicos."
      }),
      makeCard(56, 8, {
        "type": "phrase",
        "english": "What is your job? I am an engineer.",
        "portuguese": "Qual é o seu trabalho? Eu sou engenheiro."
      }),
      makeCard(56, 9, {
        "type": "phrase",
        "english": "Who is the manager of the hotel?",
        "portuguese": "Quem é o gerente do hotel?"
      }),
      makeCard(56, 10, {
        "type": "phrase",
        "english": "That woman is a great doctor.",
        "portuguese": "Aquela mulher é uma médica excelente."
      }),
      makeCard(56, 11, {
        "type": "phrase",
        "english": "Where is the waiter? He is in the kitchen.",
        "portuguese": "Onde está o garçom? Ele está na cozinha."
      }),
      makeCard(56, 12, {
        "type": "phrase",
        "english": "The drivers help the people.",
        "portuguese": "Os motoristas ajudam as pessoas."
      })
    ]
  },
  {
    dayNumber: 57,
    weekNumber: 9,
    blockNumber: 6,
    cefrLevel: 'A1',
    title: "Lição 57 — Question Words: \"When\" e \"Which\"",
    subtitle: "Lição 57 do nível A1",
    grammarFocus: "*When* pergunta sobre tempo/data (*When is the meeting?*)...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(57, 1, {
        "type": "word",
        "english": "When",
        "portuguese": "Quando"
      }),
      makeCard(57, 2, {
        "type": "word",
        "english": "Party",
        "portuguese": "Festa (já revisada)"
      }),
      makeCard(57, 3, {
        "type": "phrase",
        "english": "When is the party?",
        "portuguese": "Quando é a festa?"
      }),
      makeCard(57, 4, {
        "type": "phrase",
        "english": "The party is today.",
        "portuguese": "A festa é hoje."
      }),
      makeCard(57, 5, {
        "type": "word",
        "english": "Which",
        "portuguese": "Qual, quais (escolha entre opções delimitadas)"
      }),
      makeCard(57, 6, {
        "type": "word",
        "english": "Meeting",
        "portuguese": "Reunião (plural: meetings)"
      }),
      makeCard(57, 7, {
        "type": "phrase",
        "english": "When is the meeting?",
        "portuguese": "Quando é a reunião?"
      }),
      makeCard(57, 8, {
        "type": "phrase",
        "english": "The meeting is now.",
        "portuguese": "A reunião é agora."
      }),
      makeCard(57, 9, {
        "type": "phrase",
        "english": "Which car is new?",
        "portuguese": "Qual carro é novo?"
      }),
      makeCard(57, 10, {
        "type": "phrase",
        "english": "This blue car is new.",
        "portuguese": "Este carro azul é novo."
      }),
      makeCard(57, 11, {
        "type": "phrase",
        "english": "Which bus is for the hospital?",
        "portuguese": "Qual ônibus é para o hospital?"
      }),
      makeCard(57, 12, {
        "type": "phrase",
        "english": "The yellow bus is for the hospital.",
        "portuguese": "O ônibus amarelo é para o hospital."
      }),
      makeCard(57, 13, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "*When* pergunta sobre tempo/data (*When is the meeting?*); *Which* implica seleção entre um conjunto restrito de alternativas (*Which bus...?*).",
        "grammarRule": {
          "title": "Gramática — Lição 57",
          "explanation": "*When* pergunta sobre tempo/data (*When is the meeting?*); *Which* implica seleção entre um conjunto restrito de alternativas (*Which bus...?*).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 58,
    weekNumber: 9,
    blockNumber: 6,
    cefrLevel: 'A1',
    title: "Lição 58 — Países 2: França e Japão",
    subtitle: "Lição 58 do nível A1",
    grammarFocus: "Padrões comuns de terminação de nacionalidades: *-an* (Am...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(58, 1, {
        "type": "word",
        "english": "France",
        "portuguese": "França"
      }),
      makeCard(58, 2, {
        "type": "word",
        "english": "French",
        "portuguese": "Francês, francesa"
      }),
      makeCard(58, 3, {
        "type": "phrase",
        "english": "She is from France.",
        "portuguese": "Ela é da França."
      }),
      makeCard(58, 4, {
        "type": "phrase",
        "english": "She is French.",
        "portuguese": "Ela é francesa."
      }),
      makeCard(58, 5, {
        "type": "word",
        "english": "Japan",
        "portuguese": "Japão"
      }),
      makeCard(58, 6, {
        "type": "word",
        "english": "Japanese",
        "portuguese": "Japonês, japonesa"
      }),
      makeCard(58, 7, {
        "type": "phrase",
        "english": "He is from Japan.",
        "portuguese": "Ele é do Japão."
      }),
      makeCard(58, 8, {
        "type": "phrase",
        "english": "He is Japanese.",
        "portuguese": "Ele é japonês."
      }),
      makeCard(58, 9, {
        "type": "phrase",
        "english": "Which engineer is from France?",
        "portuguese": "Qual engenheiro é da França?"
      }),
      makeCard(58, 10, {
        "type": "phrase",
        "english": "That manager is Japanese.",
        "portuguese": "Aquele gerente é japonês."
      }),
      makeCard(58, 11, {
        "type": "phrase",
        "english": "Where is the meeting? It is in France.",
        "portuguese": "Onde é a reunião? É na França."
      }),
      makeCard(58, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Padrões comuns de terminação de nacionalidades: *-an* (American), *-ish* (English, Spanish), *-ch* (French), *-ese* (Japanese).",
        "grammarRule": {
          "title": "Gramática — Lição 58",
          "explanation": "Padrões comuns de terminação de nacionalidades: *-an* (American), *-ish* (English, Spanish), *-ch* (French), *-ese* (Japanese).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 59,
    weekNumber: 9,
    blockNumber: 6,
    cefrLevel: 'A1',
    title: "Lição 59 — Revisão: Formulário e Dados Pessoais *(4 palavras novas)*",
    subtitle: "Novas: **Address** (substantivo), **Number** (substantivo), **Email** (substantivo), **Form** (substantivo).",
    grammarFocus: "Revisão: Formulário e Dados Pessoais *(4 palavras novas)*",
    isDialogueDay: false,
    isReviewLesson: true,
    cards: [
      makeCard(59, 1, {
        "type": "word",
        "english": "Address",
        "portuguese": "Endereço"
      }),
      makeCard(59, 2, {
        "type": "word",
        "english": "Number",
        "portuguese": "Número"
      }),
      makeCard(59, 3, {
        "type": "phrase",
        "english": "What is your address?",
        "portuguese": "Qual é o seu endereço?"
      }),
      makeCard(59, 4, {
        "type": "phrase",
        "english": "What is your phone number?",
        "portuguese": "Qual é o seu número de telefone?"
      }),
      makeCard(59, 5, {
        "type": "word",
        "english": "Email",
        "portuguese": "E-mail"
      }),
      makeCard(59, 6, {
        "type": "word",
        "english": "Form",
        "portuguese": "Formulário, ficha"
      }),
      makeCard(59, 7, {
        "type": "phrase",
        "english": "My email is on the form.",
        "portuguese": "Meu e-mail está no formulário."
      }),
      makeCard(59, 8, {
        "type": "phrase",
        "english": "There is a form on the table.",
        "portuguese": "Há um formulário sobre a mesa."
      }),
      makeCard(59, 9, {
        "type": "phrase",
        "english": "What is his job? He is a driver.",
        "portuguese": "Qual é o trabalho dele? Ele é motorista."
      }),
      makeCard(59, 10, {
        "type": "phrase",
        "english": "Where is she from? She is from France.",
        "portuguese": "De onde ela é? Ela é da França."
      }),
      makeCard(59, 11, {
        "type": "phrase",
        "english": "Who is the manager? That tall man.",
        "portuguese": "Quem é o gerente? Aquele homem alto."
      }),
      makeCard(59, 12, {
        "type": "phrase",
        "english": "Your address and your email are here.",
        "portuguese": "Seu endereço e seu e-mail estão aqui."
      })
    ]
  },
  {
    dayNumber: 60,
    weekNumber: 9,
    blockNumber: 6,
    cefrLevel: 'A1',
    title: "Lição 60 — Diálogo 3 / Entrevista (Recepção de Imigração e Boas-Vindas)",
    subtitle: "Lição 60 do nível A1",
    grammarFocus: "Diálogo 3 / Entrevista (Recepção de Imigração e Boas-Vindas)",
    isDialogueDay: true,
    isReviewLesson: false,
    cards: [
      makeCard(60, 1, {
        "type": "dialogue",
        "english": "Good morning!",
        "portuguese": "Bom dia!"
      }),
      makeCard(60, 2, {
        "type": "dialogue",
        "english": "What is your name?",
        "portuguese": "Qual é o seu nome?"
      }),
      makeCard(60, 3, {
        "type": "dialogue",
        "english": "My name is Lucas.",
        "portuguese": "Meu nome é Lucas."
      }),
      makeCard(60, 4, {
        "type": "dialogue",
        "english": "Where are you from, Lucas?",
        "portuguese": "De onde você é, Lucas?"
      }),
      makeCard(60, 5, {
        "type": "dialogue",
        "english": "I am from Brazil.",
        "portuguese": "Eu sou do Brasil."
      }),
      makeCard(60, 6, {
        "type": "dialogue",
        "english": "What is your job?",
        "portuguese": "Qual é o seu trabalho?"
      }),
      makeCard(60, 7, {
        "type": "dialogue",
        "english": "I am an engineer.",
        "portuguese": "Eu sou engenheiro."
      }),
      makeCard(60, 8, {
        "type": "dialogue",
        "english": "What is your address in the city?",
        "portuguese": "Qual é o seu endereço na cidade?"
      }),
      makeCard(60, 9, {
        "type": "dialogue",
        "english": "Hotel Central, near the park.",
        "portuguese": "Hotel Central, perto do parque."
      }),
      makeCard(60, 10, {
        "type": "dialogue",
        "english": "Great! Welcome to the city.",
        "portuguese": "Ótimo! Bem-vindo à cidade."
      }),
      makeCard(60, 11, {
        "type": "dialogue",
        "english": "Thanks! Nice to meet you.",
        "portuguese": "Obrigado! Prazer em conhecer você."
      })
    ]
  },
  {
    dayNumber: 61,
    weekNumber: 9,
    blockNumber: 7,
    cefrLevel: 'A1',
    title: "Lição 61 — O Verbo \"Have\" com I, You, We, They",
    subtitle: "Lição 61 do nível A1",
    grammarFocus: "O verbo *have* expressa posse real ou relação. Com os pro...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(61, 1, {
        "type": "word",
        "english": "Have",
        "portuguese": "Ter (com I, you, we, they)"
      }),
      makeCard(61, 2, {
        "type": "word",
        "english": "Passport",
        "portuguese": "Passaporte"
      }),
      makeCard(61, 3, {
        "type": "phrase",
        "english": "I have a passport.",
        "portuguese": "Eu tenho um passaporte."
      }),
      makeCard(61, 4, {
        "type": "word",
        "english": "Suitcase",
        "portuguese": "Mala de viagem"
      }),
      makeCard(61, 5, {
        "type": "phrase",
        "english": "You have a big suitcase.",
        "portuguese": "Você tem uma mala grande."
      }),
      makeCard(61, 6, {
        "type": "phrase",
        "english": "We have two tickets.",
        "portuguese": "Nós temos duas passagens."
      }),
      makeCard(61, 7, {
        "type": "phrase",
        "english": "They have American passports.",
        "portuguese": "Eles têm passaportes americanos."
      }),
      makeCard(61, 8, {
        "type": "phrase",
        "english": "I have my bag and my phone.",
        "portuguese": "Eu tenho minha bolsa e meu celular."
      }),
      makeCard(61, 9, {
        "type": "phrase",
        "english": "We have our suitcases here.",
        "portuguese": "Nós temos nossas malas aqui."
      }),
      makeCard(61, 10, {
        "type": "phrase",
        "english": "They have a new car.",
        "portuguese": "Eles têm um carro novo."
      }),
      makeCard(61, 11, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "O verbo *have* expressa posse real ou relação. Com os pronomes *I, you, we, they*, utiliza-se a forma base *have*.",
        "grammarRule": {
          "title": "Gramática — Lição 61",
          "explanation": "O verbo *have* expressa posse real ou relação. Com os pronomes *I, you, we, they*, utiliza-se a forma base *have*.",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 62,
    weekNumber: 9,
    blockNumber: 7,
    cefrLevel: 'A1',
    title: "Lição 62 — O Verbo \"Has\" com He, She, It",
    subtitle: "Lição 62 do nível A1",
    grammarFocus: "*Have* é um verbo irregular. Na 3ª pessoa do singular (*h...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(62, 1, {
        "type": "word",
        "english": "Has",
        "portuguese": "Tem (forma da 3ª pessoa do singular: he, she, it)"
      }),
      makeCard(62, 2, {
        "type": "word",
        "english": "Backpack",
        "portuguese": "Mochila"
      }),
      makeCard(62, 3, {
        "type": "phrase",
        "english": "He has a black backpack.",
        "portuguese": "Ele tem uma mochila preta."
      }),
      makeCard(62, 4, {
        "type": "word",
        "english": "Wallet",
        "portuguese": "Carteira"
      }),
      makeCard(62, 5, {
        "type": "phrase",
        "english": "She has a brown wallet.",
        "portuguese": "Ela tem uma carteira marrom."
      }),
      makeCard(62, 6, {
        "type": "phrase",
        "english": "My brother has a new job.",
        "portuguese": "Meu irmão tem um novo emprego."
      }),
      makeCard(62, 7, {
        "type": "phrase",
        "english": "The teacher has two books.",
        "portuguese": "O professor tem dois livros."
      }),
      makeCard(62, 8, {
        "type": "phrase",
        "english": "The hotel has a restaurant.",
        "portuguese": "O hotel tem um restaurante."
      }),
      makeCard(62, 9, {
        "type": "phrase",
        "english": "Julia has a red suitcase.",
        "portuguese": "Julia tem uma mala vermelha."
      }),
      makeCard(62, 10, {
        "type": "phrase",
        "english": "She has her passport and her ticket.",
        "portuguese": "Ela tem o passaporte dela e a passagem dela."
      }),
      makeCard(62, 11, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "*Have* é um verbo irregular. Na 3ª pessoa do singular (*he, she, it*), sua forma é **has** (*he has*, *she has*, *it has*).",
        "grammarRule": {
          "title": "Gramática — Lição 62",
          "explanation": "*Have* é um verbo irregular. Na 3ª pessoa do singular (*he, she, it*), sua forma é **has** (*he has*, *she has*, *it has*).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 63,
    weekNumber: 9,
    blockNumber: 7,
    cefrLevel: 'A1',
    title: "Lição 63 — Revisão: Documentos e Pagamento *(4 palavras novas)*",
    subtitle: "Novas: **Credit card** (locução substantiva), **Cash** (substantivo incontável), **Important** (adjetivo), **Ready** (adjetivo).",
    grammarFocus: "Revisão: Documentos e Pagamento *(4 palavras novas)*",
    isDialogueDay: false,
    isReviewLesson: true,
    cards: [
      makeCard(63, 1, {
        "type": "word",
        "english": "Credit card",
        "portuguese": "Cartão de crédito"
      }),
      makeCard(63, 2, {
        "type": "word",
        "english": "Cash",
        "portuguese": "Dinheiro em espécie, dinheiro vivo"
      }),
      makeCard(63, 3, {
        "type": "phrase",
        "english": "I have a credit card and cash.",
        "portuguese": "Eu tenho um cartão de crédito e dinheiro vivo."
      }),
      makeCard(63, 4, {
        "type": "word",
        "english": "Important",
        "portuguese": "Importante"
      }),
      makeCard(63, 5, {
        "type": "word",
        "english": "Ready",
        "portuguese": "Pronto, pronta"
      }),
      makeCard(63, 6, {
        "type": "phrase",
        "english": "The passport is very important.",
        "portuguese": "O passaporte é muito importante."
      }),
      makeCard(63, 7, {
        "type": "phrase",
        "english": "My suitcase is ready.",
        "portuguese": "Minha mala está pronta."
      }),
      makeCard(63, 8, {
        "type": "phrase",
        "english": "We have cash for the bus.",
        "portuguese": "Nós temos dinheiro em espécie para o ônibus."
      }),
      makeCard(63, 9, {
        "type": "phrase",
        "english": "She has an important meeting today.",
        "portuguese": "Ela tem uma reunião importante hoje."
      }),
      makeCard(63, 10, {
        "type": "phrase",
        "english": "Are you ready? Yes, I am ready.",
        "portuguese": "Você está pronto? Sim, estou pronto."
      }),
      makeCard(63, 11, {
        "type": "phrase",
        "english": "He has his wallet and his credit card.",
        "portuguese": "Ele tem a carteira dele e o cartão de crédito dele."
      }),
      makeCard(63, 12, {
        "type": "phrase",
        "english": "The tickets are in the backpack.",
        "portuguese": "As passagens estão na mochila."
      })
    ]
  },
  {
    dayNumber: 64,
    weekNumber: 10,
    blockNumber: 7,
    cefrLevel: 'A1',
    title: "Lição 64 — O Verbo \"Need\" (Precisar)",
    subtitle: "Lição 64 do nível A1",
    grammarFocus: "*Need* traduz \"precisar de\". Em inglês, o objeto liga-se ...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(64, 1, {
        "type": "word",
        "english": "Need",
        "portuguese": "Precisar de"
      }),
      makeCard(64, 2, {
        "type": "word",
        "english": "Medicine",
        "portuguese": "Remédio, medicamento"
      }),
      makeCard(64, 3, {
        "type": "phrase",
        "english": "I need medicine, please.",
        "portuguese": "Eu preciso de remédio, por favor."
      }),
      makeCard(64, 4, {
        "type": "word",
        "english": "Taxi",
        "portuguese": "Táxi"
      }),
      makeCard(64, 5, {
        "type": "phrase",
        "english": "We need a taxi now.",
        "portuguese": "Nós precisamos de um táxi agora."
      }),
      makeCard(64, 6, {
        "type": "phrase",
        "english": "I need help, please.",
        "portuguese": "Eu preciso de ajuda, por favor."
      }),
      makeCard(64, 7, {
        "type": "phrase",
        "english": "You need a new passport.",
        "portuguese": "Você precisa de um passaporte novo."
      }),
      makeCard(64, 8, {
        "type": "phrase",
        "english": "We need water, please.",
        "portuguese": "Nós precisamos de água, por favor."
      }),
      makeCard(64, 9, {
        "type": "phrase",
        "english": "He needs a doctor.",
        "portuguese": "Ele precisa de um médico."
      }),
      makeCard(64, 10, {
        "type": "phrase",
        "english": "They need a big table.",
        "portuguese": "Eles precisam de uma mesa grande."
      }),
      makeCard(64, 11, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "*Need* traduz \"precisar de\". Em inglês, o objeto liga-se diretamente ao verbo, **sem preposição**: *I need help* (nunca *I need of help*).",
        "grammarRule": {
          "title": "Gramática — Lição 64",
          "explanation": "*Need* traduz \"precisar de\". Em inglês, o objeto liga-se diretamente ao verbo, **sem preposição**: *I need help* (nunca *I need of help*).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 65,
    weekNumber: 10,
    blockNumber: 7,
    cefrLevel: 'A1',
    title: "Lição 65 — O Verbo \"Want\" (Querer)",
    subtitle: "Lição 65 do nível A1",
    grammarFocus: "*Want* expressa desejo direto por algo (*I want a coffee*...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(65, 1, {
        "type": "word",
        "english": "Want",
        "portuguese": "Querer (com I, you, we, they)"
      }),
      makeCard(65, 2, {
        "type": "word",
        "english": "Juice",
        "portuguese": "Suco"
      }),
      makeCard(65, 3, {
        "type": "phrase",
        "english": "I want cold juice, please.",
        "portuguese": "Eu quero suco gelado, por favor."
      }),
      makeCard(65, 4, {
        "type": "word",
        "english": "Sandwich",
        "portuguese": "Sanduíche"
      }),
      makeCard(65, 5, {
        "type": "phrase",
        "english": "I want a sandwich.",
        "portuguese": "Eu quero um sanduíche."
      }),
      makeCard(65, 6, {
        "type": "phrase",
        "english": "We want two coffees, please.",
        "portuguese": "Nós queremos dois cafés, por favor."
      }),
      makeCard(65, 7, {
        "type": "phrase",
        "english": "They want a table near the window.",
        "portuguese": "Eles querem uma mesa perto da janela."
      }),
      makeCard(65, 8, {
        "type": "phrase",
        "english": "She wants a cup of tea.",
        "portuguese": "Ela quer uma xícara de chá."
      }),
      makeCard(65, 9, {
        "type": "phrase",
        "english": "I am hungry, and I want a sandwich.",
        "portuguese": "Eu estou com fome, e eu quero um sanduíche."
      }),
      makeCard(65, 10, {
        "type": "phrase",
        "english": "He wants a glass of water.",
        "portuguese": "Ele quer um copo de água."
      }),
      makeCard(65, 11, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "*Want* expressa desejo direto por algo (*I want a coffee*). Na 3ª pessoa do singular, adiciona-se -s (*she wants*).",
        "grammarRule": {
          "title": "Gramática — Lição 65",
          "explanation": "*Want* expressa desejo direto por algo (*I want a coffee*). Na 3ª pessoa do singular, adiciona-se -s (*she wants*).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 66,
    weekNumber: 10,
    blockNumber: 7,
    cefrLevel: 'A1',
    title: "Lição 66 — Revisão: No Aeroporto *(4 palavras novas)*",
    subtitle: "Novas: **Airport** (substantivo), **Flight** (substantivo), **Luggage** (substantivo incontável), **Late** (adjetivo).",
    grammarFocus: "Revisão: No Aeroporto *(4 palavras novas)*",
    isDialogueDay: false,
    isReviewLesson: true,
    cards: [
      makeCard(66, 1, {
        "type": "word",
        "english": "Airport",
        "portuguese": "Aeroporto"
      }),
      makeCard(66, 2, {
        "type": "word",
        "english": "Flight",
        "portuguese": "Voo"
      }),
      makeCard(66, 3, {
        "type": "phrase",
        "english": "We are at the airport.",
        "portuguese": "Nós estamos no aeroporto."
      }),
      makeCard(66, 4, {
        "type": "phrase",
        "english": "Our flight is ready.",
        "portuguese": "Nosso voo está pronto."
      }),
      makeCard(66, 5, {
        "type": "word",
        "english": "Luggage",
        "portuguese": "Bagagem"
      }),
      makeCard(66, 6, {
        "type": "word",
        "english": "Late",
        "portuguese": "Atrasado, atrasada, tarde"
      }),
      makeCard(66, 7, {
        "type": "phrase",
        "english": "My luggage is here.",
        "portuguese": "Minha bagagem está aqui."
      }),
      makeCard(66, 8, {
        "type": "phrase",
        "english": "The flight is late today.",
        "portuguese": "O voo está atrasado hoje."
      }),
      makeCard(66, 9, {
        "type": "phrase",
        "english": "We need our luggage now.",
        "portuguese": "Nós precisamos da nossa bagagem agora."
      }),
      makeCard(66, 10, {
        "type": "phrase",
        "english": "I have my passport for the flight.",
        "portuguese": "Eu tenho meu passaporte para o voo."
      }),
      makeCard(66, 11, {
        "type": "phrase",
        "english": "The airport is very big and clean.",
        "portuguese": "O aeroporto é muito grande e limpo."
      }),
      makeCard(66, 12, {
        "type": "phrase",
        "english": "He is late for the meeting.",
        "portuguese": "Ele está atrasado para a reunião."
      })
    ]
  },
  {
    dayNumber: 67,
    weekNumber: 10,
    blockNumber: 7,
    cefrLevel: 'A1',
    title: "Lição 67 — \"Need to\" e \"Want to\" + Verbo",
    subtitle: "Lição 67 do nível A1",
    grammarFocus: "Quando *need* e *want* antecedem uma ação verbal, utiliza...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(67, 1, {
        "type": "word",
        "english": "Go",
        "portuguese": "Ir"
      }),
      makeCard(67, 2, {
        "type": "word",
        "english": "Buy",
        "portuguese": "Comprar"
      }),
      makeCard(67, 3, {
        "type": "phrase",
        "english": "I need to go now.",
        "portuguese": "Eu preciso ir agora."
      }),
      makeCard(67, 4, {
        "type": "phrase",
        "english": "I want to buy a ticket.",
        "portuguese": "Eu quero comprar uma passagem."
      }),
      makeCard(67, 5, {
        "type": "word",
        "english": "Sleep",
        "portuguese": "Dormir"
      }),
      makeCard(67, 6, {
        "type": "word",
        "english": "Drink",
        "portuguese": "Beber"
      }),
      makeCard(67, 7, {
        "type": "phrase",
        "english": "I am tired, and I want to sleep.",
        "portuguese": "Eu estou cansado, e eu quero dormir."
      }),
      makeCard(67, 8, {
        "type": "phrase",
        "english": "We want to drink cold water.",
        "portuguese": "Nós queremos beber água gelada."
      }),
      makeCard(67, 9, {
        "type": "phrase",
        "english": "We need to go to the airport.",
        "portuguese": "Nós precisamos ir para o aeroporto."
      }),
      makeCard(67, 10, {
        "type": "phrase",
        "english": "She wants to buy a new bag.",
        "portuguese": "Ela quer comprar uma bolsa nova."
      }),
      makeCard(67, 11, {
        "type": "phrase",
        "english": "I need to sleep.",
        "portuguese": "Eu preciso dormir."
      }),
      makeCard(67, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Quando *need* e *want* antecedem uma ação verbal, utiliza-se a partícula **to** para introduzir o verbo no infinitivo (*need to go*, *want to buy*, *want to drink*).",
        "grammarRule": {
          "title": "Gramática — Lição 67",
          "explanation": "Quando *need* e *want* antecedem uma ação verbal, utiliza-se a partícula **to** para introduzir o verbo no infinitivo (*need to go*, *want to buy*, *want to drink*).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 68,
    weekNumber: 10,
    blockNumber: 7,
    cefrLevel: 'A1',
    title: "Lição 68 — Dispositivos Pessoais e Tecnologia",
    subtitle: "Lição 68 do nível A1",
    grammarFocus: "Substantivos tecnológicos contáveis formam o plural regul...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(68, 1, {
        "type": "word",
        "english": "Computer",
        "portuguese": "Computador"
      }),
      makeCard(68, 2, {
        "type": "word",
        "english": "Tablet",
        "portuguese": "Tablet"
      }),
      makeCard(68, 3, {
        "type": "phrase",
        "english": "I have a computer and a tablet.",
        "portuguese": "Eu tenho um computador e um tablet."
      }),
      makeCard(68, 4, {
        "type": "word",
        "english": "Charger",
        "portuguese": "Carregador"
      }),
      makeCard(68, 5, {
        "type": "phrase",
        "english": "I need a phone charger.",
        "portuguese": "Eu preciso de um carregador de celular."
      }),
      makeCard(68, 6, {
        "type": "phrase",
        "english": "My charger is in the backpack.",
        "portuguese": "Meu carregador está na mochila."
      }),
      makeCard(68, 7, {
        "type": "phrase",
        "english": "The computer is on the desk.",
        "portuguese": "O computador está sobre a escrivaninha."
      }),
      makeCard(68, 8, {
        "type": "phrase",
        "english": "She has a new tablet.",
        "portuguese": "Ela tem um tablet novo."
      }),
      makeCard(68, 9, {
        "type": "phrase",
        "english": "Where is my charger? It is in the suitcase.",
        "portuguese": "Onde está o meu carregador? Está na mala."
      }),
      makeCard(68, 10, {
        "type": "phrase",
        "english": "We have two computers in the office.",
        "portuguese": "Nós temos dois computadores no escritório."
      }),
      makeCard(68, 11, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Substantivos tecnológicos contáveis formam o plural regular com -s (*computer $\\rightarrow$ computers*, *charger $\\rightarrow$ chargers*).",
        "grammarRule": {
          "title": "Gramática — Lição 68",
          "explanation": "Substantivos tecnológicos contáveis formam o plural regular com -s (*computer $\\rightarrow$ computers*, *charger $\\rightarrow$ chargers*).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 69,
    weekNumber: 10,
    blockNumber: 7,
    cefrLevel: 'A1',
    title: "Lição 69 — Revisão: Conveniência e Farmácia *(4 palavras novas)*",
    subtitle: "Novas: **Bottle** (substantivo), **Pill** (substantivo), **Price** (substantivo), **Time** (substantivo).",
    grammarFocus: "Revisão: Conveniência e Farmácia *(4 palavras novas)*",
    isDialogueDay: false,
    isReviewLesson: true,
    cards: [
      makeCard(69, 1, {
        "type": "word",
        "english": "Bottle",
        "portuguese": "Garrafa"
      }),
      makeCard(69, 2, {
        "type": "phrase",
        "english": "A bottle of water, please.",
        "portuguese": "Uma garrafa de água, por favor."
      }),
      makeCard(69, 3, {
        "type": "word",
        "english": "Pill",
        "portuguese": "Pílula, comprimido"
      }),
      makeCard(69, 4, {
        "type": "phrase",
        "english": "I need two pills, please.",
        "portuguese": "Eu preciso de dois comprimidos, por favor."
      }),
      makeCard(69, 5, {
        "type": "word",
        "english": "Price",
        "portuguese": "Preço"
      }),
      makeCard(69, 6, {
        "type": "word",
        "english": "Time",
        "portuguese": "Tempo, hora"
      }),
      makeCard(69, 7, {
        "type": "phrase",
        "english": "What is the price of this bottle?",
        "portuguese": "Qual é o preço desta garrafa?"
      }),
      makeCard(69, 8, {
        "type": "phrase",
        "english": "We have time for a coffee.",
        "portuguese": "Nós temos tempo para um café."
      }),
      makeCard(69, 9, {
        "type": "phrase",
        "english": "I want to buy a bottle of water.",
        "portuguese": "Eu quero comprar uma garrafa de água."
      }),
      makeCard(69, 10, {
        "type": "phrase",
        "english": "The price of the medicine is good.",
        "portuguese": "O preço do remédio é bom."
      }),
      makeCard(69, 11, {
        "type": "phrase",
        "english": "We have time before the flight.",
        "portuguese": "Nós temos tempo antes do voo."
      }),
      makeCard(69, 12, {
        "type": "phrase",
        "english": "She has a bottle of juice in her bag.",
        "portuguese": "Ela tem uma garrafa de suco na bolsa dela."
      })
    ]
  },
  {
    dayNumber: 70,
    weekNumber: 10,
    blockNumber: 7,
    cefrLevel: 'A1',
    title: "Lição 70 — Relato 2 (No Aeroporto: Documentos e Bagagem)",
    subtitle: "Lição 70 do nível A1",
    grammarFocus: "Relato 2 (No Aeroporto: Documentos e Bagagem)",
    isDialogueDay: true,
    isReviewLesson: false,
    cards: [
      makeCard(70, 1, {
        "type": "phrase",
        "english": "Today I am at the airport with my brother.",
        "portuguese": "Hoje eu estou no aeroporto com o meu irmão."
      }),
      makeCard(70, 2, {
        "type": "phrase",
        "english": "Our flight is to the United States.",
        "portuguese": "Nosso voo é para os Estados Unidos."
      }),
      makeCard(70, 3, {
        "type": "phrase",
        "english": "I have my passport and my ticket in my backpack.",
        "portuguese": "Eu tenho meu passaporte e minha passagem na minha mochila."
      }),
      makeCard(70, 4, {
        "type": "phrase",
        "english": "My brother has his credit card and cash in his wallet.",
        "portuguese": "Meu irmão tem o cartão de crédito e dinheiro vivo na carteira dele."
      }),
      makeCard(70, 5, {
        "type": "phrase",
        "english": "Our luggage is ready, and it is not late.",
        "portuguese": "Nossa bagagem está pronta, e não está atrasada."
      }),
      makeCard(70, 6, {
        "type": "phrase",
        "english": "We have time, and I want to drink a coffee.",
        "portuguese": "Nós temos tempo, e eu quero beber um café."
      }),
      makeCard(70, 7, {
        "type": "phrase",
        "english": "I buy a bottle of water and a sandwich.",
        "portuguese": "Eu compro uma garrafa de água e um sanduíche."
      }),
      makeCard(70, 8, {
        "type": "phrase",
        "english": "Now we need to go to the gate.",
        "portuguese": "Agora nós precisamos ir para o portão."
      }),
      makeCard(70, 9, {
        "type": "phrase",
        "english": "We are ready and very happy!",
        "portuguese": "Nós estamos prontos e muito felizes!"
      })
    ]
  },
  {
    dayNumber: 71,
    weekNumber: 11,
    blockNumber: 8,
    cefrLevel: 'A1',
    title: "Lição 71 — Ações da Manhã: \"Wake up\" e \"Get up\"",
    subtitle: "Lição 71 do nível A1",
    grammarFocus: "No Simple Present com os pronomes da base (*I, you, we, t...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(71, 1, {
        "type": "word",
        "english": "Wake up",
        "portuguese": "Acordar"
      }),
      makeCard(71, 2, {
        "type": "word",
        "english": "Morning",
        "portuguese": "Manhã"
      }),
      makeCard(71, 3, {
        "type": "phrase",
        "english": "I wake up in the morning.",
        "portuguese": "Eu acordo de manhã."
      }),
      makeCard(71, 4, {
        "type": "word",
        "english": "Get up",
        "portuguese": "Levantar-se (da cama)"
      }),
      makeCard(71, 5, {
        "type": "phrase",
        "english": "I get up in the morning.",
        "portuguese": "Eu me levanto de manhã."
      }),
      makeCard(71, 6, {
        "type": "word",
        "english": "Breakfast",
        "portuguese": "Café da manhã (desjejum)"
      }),
      makeCard(71, 7, {
        "type": "phrase",
        "english": "We eat breakfast in the kitchen.",
        "portuguese": "Nós tomamos café da manhã na cozinha."
      }),
      makeCard(71, 8, {
        "type": "phrase",
        "english": "I wake up and eat breakfast.",
        "portuguese": "Eu acordo e tomo café da manhã."
      }),
      makeCard(71, 9, {
        "type": "phrase",
        "english": "They get up in the morning.",
        "portuguese": "Eles se levantam de manhã."
      }),
      makeCard(71, 10, {
        "type": "phrase",
        "english": "We wake up and get up.",
        "portuguese": "Nós acordamos e nos levantamos."
      }),
      makeCard(71, 11, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "No Simple Present com os pronomes da base (*I, you, we, they*), os verbos permanecem em sua forma infinitiva sem *to* (*wake up*, *get up*, *eat*). A expressão temporal correspondente é *in the morning*.",
        "grammarRule": {
          "title": "Gramática — Lição 71",
          "explanation": "No Simple Present com os pronomes da base (*I, you, we, they*), os verbos permanecem em sua forma infinitiva sem *to* (*wake up*, *get up*, *eat*). A expressão temporal correspondente é *in the morning*.",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 72,
    weekNumber: 11,
    blockNumber: 8,
    cefrLevel: 'A1',
    title: "Lição 72 — Alimentos do Café da Manhã: Comer e Beber",
    subtitle: "Lição 72 do nível A1",
    grammarFocus: "*Bread* e *cheese* são substantivos incontáveis no inglês...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(72, 1, {
        "type": "word",
        "english": "Bread",
        "portuguese": "Pão (substantivo incontável)"
      }),
      makeCard(72, 2, {
        "type": "word",
        "english": "Butter",
        "portuguese": "Manteiga"
      }),
      makeCard(72, 3, {
        "type": "phrase",
        "english": "I eat bread and butter.",
        "portuguese": "Eu como pão com manteiga."
      }),
      makeCard(72, 4, {
        "type": "word",
        "english": "Cheese",
        "portuguese": "Queijo"
      }),
      makeCard(72, 5, {
        "type": "word",
        "english": "Egg (Plural: Eggs)",
        "portuguese": "Ovo, ovos"
      }),
      makeCard(72, 6, {
        "type": "phrase",
        "english": "We eat bread and cheese.",
        "portuguese": "Nós comemos pão com queijo."
      }),
      makeCard(72, 7, {
        "type": "phrase",
        "english": "They eat two eggs in the morning.",
        "portuguese": "Eles comem dois ovos de manhã."
      }),
      makeCard(72, 8, {
        "type": "phrase",
        "english": "I drink coffee with milk.",
        "portuguese": "Eu bebo café com leite."
      }),
      makeCard(72, 9, {
        "type": "phrase",
        "english": "You eat bread, and you drink coffee.",
        "portuguese": "Você come pão e bebe café."
      }),
      makeCard(72, 10, {
        "type": "phrase",
        "english": "We eat eggs, bread and cheese for breakfast.",
        "portuguese": "Nós comemos ovos, pão e queijo no café da manhã."
      }),
      makeCard(72, 11, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "*Bread* e *cheese* são substantivos incontáveis no inglês padrão (utiliza-se *bread*, não *a bread*). Combinações cotidianas autênticas de alimentação matinal.",
        "grammarRule": {
          "title": "Gramática — Lição 72",
          "explanation": "*Bread* e *cheese* são substantivos incontáveis no inglês padrão (utiliza-se *bread*, não *a bread*). Combinações cotidianas autênticas de alimentação matinal.",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 73,
    weekNumber: 11,
    blockNumber: 8,
    cefrLevel: 'A1',
    title: "Lição 73 — Revisão: Café da Manhã e Início do Dia *(4 palavras novas)*",
    subtitle: "Novas: **Tea** (substantivo incontável), **Early** (advérbio), **Fruit** (substantivo), **Start** (verbo com I/you/we/they).",
    grammarFocus: "Revisão: Café da Manhã e Início do Dia *(4 palavras novas)*",
    isDialogueDay: false,
    isReviewLesson: true,
    cards: [
      makeCard(73, 1, {
        "type": "word",
        "english": "Tea",
        "portuguese": "Chá"
      }),
      makeCard(73, 2, {
        "type": "word",
        "english": "Early",
        "portuguese": "Cedo"
      }),
      makeCard(73, 3, {
        "type": "phrase",
        "english": "I wake up early in the morning.",
        "portuguese": "Eu acordo cedo de manhã."
      }),
      makeCard(73, 4, {
        "type": "phrase",
        "english": "We drink hot tea.",
        "portuguese": "Nós bebemos chá quente."
      }),
      makeCard(73, 5, {
        "type": "word",
        "english": "Fruit",
        "portuguese": "Fruta (plural: fruits)"
      }),
      makeCard(73, 6, {
        "type": "word",
        "english": "Start",
        "portuguese": "Começar, iniciar"
      }),
      makeCard(73, 7, {
        "type": "phrase",
        "english": "I eat fruit for breakfast.",
        "portuguese": "Eu como fruta no café da manhã."
      }),
      makeCard(73, 8, {
        "type": "phrase",
        "english": "We start the day early.",
        "portuguese": "Nós começamos o dia cedo."
      }),
      makeCard(73, 9, {
        "type": "phrase",
        "english": "You get up early and drink tea.",
        "portuguese": "Você se levanta cedo e bebe chá."
      }),
      makeCard(73, 10, {
        "type": "phrase",
        "english": "They eat bread, eggs and fruit.",
        "portuguese": "Eles comem pão, ovos e fruta."
      }),
      makeCard(73, 11, {
        "type": "phrase",
        "english": "I drink a cup of coffee and start my job.",
        "portuguese": "Eu bebo uma xícara de café e começo meu trabalho."
      }),
      makeCard(73, 12, {
        "type": "phrase",
        "english": "The morning is quiet in our house.",
        "portuguese": "A manhã é tranquila em nossa casa."
      })
    ]
  },
  {
    dayNumber: 74,
    weekNumber: 11,
    blockNumber: 8,
    cefrLevel: 'A1',
    title: "Lição 74 — Atividades Diárias: Trabalhar e Estudar",
    subtitle: "Lição 74 do nível A1",
    grammarFocus: "Verbos nucleares de rotina: *work* e *study*. Emprego de ...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(74, 1, {
        "type": "word",
        "english": "Work",
        "portuguese": "Trabalhar (verbo)"
      }),
      makeCard(74, 2, {
        "type": "word",
        "english": "Study",
        "portuguese": "Estudar (verbo)"
      }),
      makeCard(74, 3, {
        "type": "phrase",
        "english": "I work at the hospital.",
        "portuguese": "Eu trabalho no hospital."
      }),
      makeCard(74, 4, {
        "type": "phrase",
        "english": "We study English.",
        "portuguese": "Nós estudamos inglês."
      }),
      makeCard(74, 5, {
        "type": "word",
        "english": "University",
        "portuguese": "Universidade, faculdade"
      }),
      makeCard(74, 6, {
        "type": "phrase",
        "english": "They study at the university.",
        "portuguese": "Eles estudam na universidade."
      }),
      makeCard(74, 7, {
        "type": "phrase",
        "english": "You work in a big office.",
        "portuguese": "Você trabalha em um grande escritório."
      }),
      makeCard(74, 8, {
        "type": "phrase",
        "english": "I work in the morning.",
        "portuguese": "Eu trabalho de manhã."
      }),
      makeCard(74, 9, {
        "type": "phrase",
        "english": "I study at the university.",
        "portuguese": "Eu estudo na universidade."
      }),
      makeCard(74, 10, {
        "type": "phrase",
        "english": "The engineers work at the bank.",
        "portuguese": "Os engenheiros trabalham no banco."
      }),
      makeCard(74, 11, {
        "type": "phrase",
        "english": "We study and work in the city.",
        "portuguese": "Nós estudamos e trabalhamos na cidade."
      }),
      makeCard(74, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Verbos nucleares de rotina: *work* e *study*. Emprego de preposições adequadas: *at the hospital*, *at the university*, *in an office*.",
        "grammarRule": {
          "title": "Gramática — Lição 74",
          "explanation": "Verbos nucleares de rotina: *work* e *study*. Emprego de preposições adequadas: *at the hospital*, *at the university*, *in an office*.",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 75,
    weekNumber: 11,
    blockNumber: 8,
    cefrLevel: 'A1',
    title: "Lição 75 — Moradia e Convivência: Viver e Cozinhar",
    subtitle: "Lição 75 do nível A1",
    grammarFocus: "Estrutura *live in + lugar*; *cook dinner* (sem artigo an...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(75, 1, {
        "type": "word",
        "english": "Live",
        "portuguese": "Morar, viver"
      }),
      makeCard(75, 2, {
        "type": "word",
        "english": "Apartment",
        "portuguese": "Apartamento"
      }),
      makeCard(75, 3, {
        "type": "phrase",
        "english": "I live in a small apartment.",
        "portuguese": "Eu moro em um apartamento pequeno."
      }),
      makeCard(75, 4, {
        "type": "word",
        "english": "Cook",
        "portuguese": "Cozinhar"
      }),
      makeCard(75, 5, {
        "type": "word",
        "english": "Dinner",
        "portuguese": "Jantar (refeição noturna)"
      }),
      makeCard(75, 6, {
        "type": "phrase",
        "english": "We cook dinner at home.",
        "portuguese": "Nós cozinhamos o jantar em casa."
      }),
      makeCard(75, 7, {
        "type": "phrase",
        "english": "They live in Brazil.",
        "portuguese": "Eles moram no Brasil."
      }),
      makeCard(75, 8, {
        "type": "phrase",
        "english": "You live near the park.",
        "portuguese": "Você mora perto do parque."
      }),
      makeCard(75, 9, {
        "type": "phrase",
        "english": "I cook dinner for my family.",
        "portuguese": "Eu cozinho o jantar para a minha família."
      }),
      makeCard(75, 10, {
        "type": "phrase",
        "english": "We live in a big city.",
        "portuguese": "Nós moramos em uma cidade grande."
      }),
      makeCard(75, 11, {
        "type": "phrase",
        "english": "We love our apartment.",
        "portuguese": "Nós amamos nosso apartamento."
      }),
      makeCard(75, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Estrutura *live in + lugar*; *cook dinner* (sem artigo antes dos nomes genéricos de refeições: *breakfast, lunch, dinner*).",
        "grammarRule": {
          "title": "Gramática — Lição 75",
          "explanation": "Estrutura *live in + lugar*; *cook dinner* (sem artigo antes dos nomes genéricos de refeições: *breakfast, lunch, dinner*).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 76,
    weekNumber: 11,
    blockNumber: 8,
    cefrLevel: 'A1',
    title: "Lição 76 — Revisão: Almoço e Alimentos Salgados *(4 palavras novas)*",
    subtitle: "Novas: **Lunch** (substantivo), **Rice** (substantivo incontável), **Meat** (substantivo incontável), **Salad** (substantivo).",
    grammarFocus: "Revisão: Almoço e Alimentos Salgados *(4 palavras novas)*",
    isDialogueDay: false,
    isReviewLesson: true,
    cards: [
      makeCard(76, 1, {
        "type": "word",
        "english": "Lunch",
        "portuguese": "Almoço"
      }),
      makeCard(76, 2, {
        "type": "word",
        "english": "Rice",
        "portuguese": "Arroz"
      }),
      makeCard(76, 3, {
        "type": "phrase",
        "english": "We eat rice and meat for lunch.",
        "portuguese": "Nós comemos arroz e carne no almoço."
      }),
      makeCard(76, 4, {
        "type": "word",
        "english": "Meat",
        "portuguese": "Carne"
      }),
      makeCard(76, 5, {
        "type": "word",
        "english": "Salad",
        "portuguese": "Salada"
      }),
      makeCard(76, 6, {
        "type": "phrase",
        "english": "I eat a fresh green salad.",
        "portuguese": "Eu como uma salada verde fresca."
      }),
      makeCard(76, 7, {
        "type": "phrase",
        "english": "They eat lunch at the restaurant.",
        "portuguese": "Eles almoçam no restaurante."
      }),
      makeCard(76, 8, {
        "type": "phrase",
        "english": "We cook rice, meat and salad for dinner.",
        "portuguese": "Nós cozinhamos arroz, carne e salada para o jantar."
      }),
      makeCard(76, 9, {
        "type": "phrase",
        "english": "I work in the morning and eat lunch at the office.",
        "portuguese": "Eu trabalho de manhã e almoço no escritório."
      }),
      makeCard(76, 10, {
        "type": "phrase",
        "english": "The lunch at the hotel is very good.",
        "portuguese": "O almoço no hotel é muito bom."
      }),
      makeCard(76, 11, {
        "type": "phrase",
        "english": "Rice, salad and water, please.",
        "portuguese": "Arroz, salada e água, por favor."
      }),
      makeCard(76, 12, {
        "type": "phrase",
        "english": "We eat lunch together.",
        "portuguese": "Nós almoçamos juntos."
      })
    ]
  },
  {
    dayNumber: 77,
    weekNumber: 11,
    blockNumber: 8,
    cefrLevel: 'A1',
    title: "Lição 77 — Períodos do Dia: \"Afternoon\", \"Evening\" e \"Night\"",
    subtitle: "Lição 77 do nível A1",
    grammarFocus: "Preposições para as partes do dia: *in the morning*, *in ...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(77, 1, {
        "type": "word",
        "english": "Afternoon",
        "portuguese": "Tarde (in the afternoon = à tarde)"
      }),
      makeCard(77, 2, {
        "type": "word",
        "english": "Evening",
        "portuguese": "Noite (in the evening = à noite / entardecer)"
      }),
      makeCard(77, 3, {
        "type": "phrase",
        "english": "I study in the afternoon.",
        "portuguese": "Eu estudo à tarde."
      }),
      makeCard(77, 4, {
        "type": "phrase",
        "english": "We eat dinner in the evening.",
        "portuguese": "Nós jantamos à noite."
      }),
      makeCard(77, 5, {
        "type": "word",
        "english": "Night",
        "portuguese": "Noite (at night = à noite / hora de dormir)"
      }),
      makeCard(77, 6, {
        "type": "phrase",
        "english": "I sleep at night.",
        "portuguese": "Eu durmo à noite."
      }),
      makeCard(77, 7, {
        "type": "phrase",
        "english": "They work in the afternoon.",
        "portuguese": "Eles trabalham à tarde."
      }),
      makeCard(77, 8, {
        "type": "phrase",
        "english": "In the evening, we are at home.",
        "portuguese": "À noite, nós estamos em casa."
      }),
      makeCard(77, 9, {
        "type": "phrase",
        "english": "The street is quiet at night.",
        "portuguese": "A rua é silenciosa à noite."
      }),
      makeCard(77, 10, {
        "type": "phrase",
        "english": "We study in the morning and work in the afternoon.",
        "portuguese": "Nós estudamos de manhã e trabalhamos à tarde."
      }),
      makeCard(77, 11, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Preposições para as partes do dia: *in the morning*, *in the afternoon*, *in the evening*, mas com o uso obrigatório de **at night**.",
        "grammarRule": {
          "title": "Gramática — Lição 77",
          "explanation": "Preposições para as partes do dia: *in the morning*, *in the afternoon*, *in the evening*, mas com o uso obrigatório de **at night**.",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 78,
    weekNumber: 12,
    blockNumber: 8,
    cefrLevel: 'A1',
    title: "Lição 78 — Verbos de Lazer e Descanso: \"Listen to\" e \"Read\"",
    subtitle: "Lição 78 do nível A1",
    grammarFocus: "O verbo *listen* exige a preposição *to* antes do seu obj...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(78, 1, {
        "type": "word",
        "english": "Read",
        "portuguese": "Ler"
      }),
      makeCard(78, 2, {
        "type": "word",
        "english": "Listen to",
        "portuguese": "Ouvir, escutar (sempre com a partícula to)"
      }),
      makeCard(78, 3, {
        "type": "phrase",
        "english": "I read a book in the evening.",
        "portuguese": "Eu leio um livro à noite."
      }),
      makeCard(78, 4, {
        "type": "word",
        "english": "Music",
        "portuguese": "Música"
      }),
      makeCard(78, 5, {
        "type": "phrase",
        "english": "We listen to music.",
        "portuguese": "Nós ouvimos música."
      }),
      makeCard(78, 6, {
        "type": "phrase",
        "english": "They listen to music in the car.",
        "portuguese": "Eles escutam música no carro."
      }),
      makeCard(78, 7, {
        "type": "phrase",
        "english": "You read English books.",
        "portuguese": "Você lê livros em inglês."
      }),
      makeCard(78, 8, {
        "type": "phrase",
        "english": "In the evening, I read and listen to music.",
        "portuguese": "À noite, eu leio e ouço música."
      }),
      makeCard(78, 9, {
        "type": "phrase",
        "english": "We sleep early at night.",
        "portuguese": "Nós dormimos cedo à noite."
      }),
      makeCard(78, 10, {
        "type": "phrase",
        "english": "I listen to music in my room.",
        "portuguese": "Eu escuto música no meu quarto."
      }),
      makeCard(78, 11, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "O verbo *listen* exige a preposição *to* antes do seu objeto sonoro: *listen to music* (nunca *listen music*).",
        "grammarRule": {
          "title": "Gramática — Lição 78",
          "explanation": "O verbo *listen* exige a preposição *to* antes do seu objeto sonoro: *listen to music* (nunca *listen music*).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 79,
    weekNumber: 12,
    blockNumber: 8,
    cefrLevel: 'A1',
    title: "Lição 79 — Revisão: Hábitos Saudáveis e Convivência *(4 palavras novas)*",
    subtitle: "Novas: **Walk** (verbo com I/you/we/they), **Together** (advérbio), **Relax** (verbo com I/you/we/they), **Every day** (locução adverbial).",
    grammarFocus: "Revisão: Hábitos Saudáveis e Convivência *(4 palavras novas)*",
    isDialogueDay: false,
    isReviewLesson: true,
    cards: [
      makeCard(79, 1, {
        "type": "word",
        "english": "Walk",
        "portuguese": "Caminhar, andar"
      }),
      makeCard(79, 2, {
        "type": "word",
        "english": "Together",
        "portuguese": "Juntos, juntas"
      }),
      makeCard(79, 3, {
        "type": "phrase",
        "english": "We walk in the park together.",
        "portuguese": "Nós caminhamos no parque juntos."
      }),
      makeCard(79, 4, {
        "type": "word",
        "english": "Relax",
        "portuguese": "Relaxar"
      }),
      makeCard(79, 5, {
        "type": "word",
        "english": "Every day",
        "portuguese": "Todo dia, todos os dias"
      }),
      makeCard(79, 6, {
        "type": "phrase",
        "english": "I walk every day in the morning.",
        "portuguese": "Eu caminho todos os dias de manhã."
      }),
      makeCard(79, 7, {
        "type": "phrase",
        "english": "In the evening, we relax on the sofa.",
        "portuguese": "À noite, nós relaxamos no sofá."
      }),
      makeCard(79, 8, {
        "type": "phrase",
        "english": "They eat fruit and salad every day.",
        "portuguese": "Eles comem fruta e salada todos os dias."
      }),
      makeCard(79, 9, {
        "type": "phrase",
        "english": "My brother and I study together.",
        "portuguese": "Meu irmão e eu estudamos juntos."
      }),
      makeCard(79, 10, {
        "type": "phrase",
        "english": "You walk to the office in the morning.",
        "portuguese": "Você caminha para o escritório de manhã."
      }),
      makeCard(79, 11, {
        "type": "phrase",
        "english": "We listen to music and relax.",
        "portuguese": "Nós escutamos música e relaxamos."
      }),
      makeCard(79, 12, {
        "type": "phrase",
        "english": "A quiet night at home to relax.",
        "portuguese": "Uma noite calma em casa para relaxar."
      })
    ]
  },
  {
    dayNumber: 80,
    weekNumber: 12,
    blockNumber: 8,
    cefrLevel: 'A1',
    title: "Lição 80 — Relato 3 (A Minha Rotina Diária)",
    subtitle: "Lição 80 do nível A1",
    grammarFocus: "Relato 3 (A Minha Rotina Diária)",
    isDialogueDay: true,
    isReviewLesson: false,
    cards: [
      makeCard(80, 1, {
        "type": "phrase",
        "english": "I wake up early in the morning, at home.",
        "portuguese": "Eu acordo cedo de manhã, em casa."
      }),
      makeCard(80, 2, {
        "type": "phrase",
        "english": "I get up and drink hot coffee with milk.",
        "portuguese": "Eu me levanto e bebo café quente com leite."
      }),
      makeCard(80, 3, {
        "type": "phrase",
        "english": "For breakfast, I eat bread, cheese and fruit.",
        "portuguese": "No café da manhã, eu como pão, queijo e fruta."
      }),
      makeCard(80, 4, {
        "type": "phrase",
        "english": "In the morning, I work at the office in the city.",
        "portuguese": "De manhã, eu trabalho no escritório na cidade."
      }),
      makeCard(80, 5, {
        "type": "phrase",
        "english": "In the afternoon, I eat lunch with my friends.",
        "portuguese": "À tarde, eu almoço com meus amigos."
      }),
      makeCard(80, 6, {
        "type": "phrase",
        "english": "We eat rice, meat and a green salad.",
        "portuguese": "Nós comemos arroz, carne e uma salada verde."
      }),
      makeCard(80, 7, {
        "type": "phrase",
        "english": "I study English at the university.",
        "portuguese": "Eu estudo inglês na universidade."
      }),
      makeCard(80, 8, {
        "type": "phrase",
        "english": "In the evening, I cook dinner for my family.",
        "portuguese": "À noite, eu cozinho o jantar para a minha família."
      }),
      makeCard(80, 9, {
        "type": "phrase",
        "english": "We eat dinner, listen to music and relax on the sofa.",
        "portuguese": "Nós jantamos, escutamos música e relaxamos no sofá."
      }),
      makeCard(80, 10, {
        "type": "phrase",
        "english": "At night, I read a book and sleep early.",
        "portuguese": "À noite, eu leio um livro e durmo cedo."
      })
    ]
  },
  {
    dayNumber: 81,
    weekNumber: 12,
    blockNumber: 9,
    cefrLevel: 'A1',
    title: "Lição 81 — A Regra Geral do \"+s\" na 3ª Pessoa (He, She, It)",
    subtitle: "Lição 81 do nível A1",
    grammarFocus: "Regra Geral da 3ª Pessoa do Singular: no Simple Present a...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(81, 1, {
        "type": "word",
        "english": "Speaks",
        "portuguese": "Fala (forma 3ª pessoa de *speak*)"
      }),
      makeCard(81, 2, {
        "type": "word",
        "english": "Works",
        "portuguese": "Trabalha (forma 3ª pessoa de *work*)"
      }),
      makeCard(81, 3, {
        "type": "phrase",
        "english": "She speaks English.",
        "portuguese": "Ela fala inglês."
      }),
      makeCard(81, 4, {
        "type": "phrase",
        "english": "He works at the hospital.",
        "portuguese": "Ele trabalha no hospital."
      }),
      makeCard(81, 5, {
        "type": "word",
        "english": "Lives",
        "portuguese": "Mora, vive (forma 3ª pessoa de *live*)"
      }),
      makeCard(81, 6, {
        "type": "word",
        "english": "Cooks",
        "portuguese": "Cozinha (forma 3ª pessoa de *cook*)"
      }),
      makeCard(81, 7, {
        "type": "phrase",
        "english": "My sister lives in Brazil.",
        "portuguese": "Minha irmã mora no Brasil."
      }),
      makeCard(81, 8, {
        "type": "phrase",
        "english": "He cooks dinner for his family.",
        "portuguese": "Ele cozinha o jantar para a família dele."
      }),
      makeCard(81, 9, {
        "type": "phrase",
        "english": "Julia works at the office.",
        "portuguese": "Julia trabalha no escritório."
      }),
      makeCard(81, 10, {
        "type": "phrase",
        "english": "She reads a book in the evening.",
        "portuguese": "Ela lê um livro à noite."
      }),
      makeCard(81, 11, {
        "type": "phrase",
        "english": "The dog sleeps on the sofa.",
        "portuguese": "O cachorro dorme no sofá."
      }),
      makeCard(81, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Regra Geral da 3ª Pessoa do Singular: no Simple Present afirmativo com *he, she, it*, acrescenta-se **-s** à maioria dos verbos (*work $\\rightarrow$ works*, *live $\\rightarrow$ lives*, *speak $\\rightarrow$ speaks*, *read $\\rightarrow$ reads*, *sleep $\\rightarrow$ sleeps*).",
        "grammarRule": {
          "title": "Gramática — Lição 81",
          "explanation": "Regra Geral da 3ª Pessoa do Singular: no Simple Present afirmativo com *he, she, it*, acrescenta-se **-s** à maioria dos verbos (*work $\\rightarrow$ works*, *live $\\rightarrow$ lives*, *speak $\\rightarrow$ speaks*, *read $\\rightarrow$ reads*, *sleep $\\rightarrow$ sleeps*).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 82,
    weekNumber: 12,
    blockNumber: 9,
    cefrLevel: 'A1',
    title: "Lição 82 — 3ª Pessoa com \"+es\" e os Verbos \"Goes\" e \"Does\"",
    subtitle: "Lição 82 do nível A1",
    grammarFocus: "Verbos terminados em som sibilante ou na vogal \"o\" (**-o,...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(82, 1, {
        "type": "word",
        "english": "Goes",
        "portuguese": "Vai (3ª pessoa de *go*)"
      }),
      makeCard(82, 2, {
        "type": "word",
        "english": "Watches",
        "portuguese": "Assiste a (3ª pessoa de *watch*)"
      }),
      makeCard(82, 3, {
        "type": "phrase",
        "english": "She goes to the university.",
        "portuguese": "Ela vai para a universidade."
      }),
      makeCard(82, 4, {
        "type": "phrase",
        "english": "He watches videos on his computer.",
        "portuguese": "Ele assiste a vídeos no computador dele."
      }),
      makeCard(82, 5, {
        "type": "word",
        "english": "Does",
        "portuguese": "Faz (3ª pessoa do verbo *do*)"
      }),
      makeCard(82, 6, {
        "type": "word",
        "english": "Washes",
        "portuguese": "Lava (3ª pessoa de *wash*)"
      }),
      makeCard(82, 7, {
        "type": "phrase",
        "english": "She does her job very well.",
        "portuguese": "Ela faz o trabalho dela muito bem."
      }),
      makeCard(82, 8, {
        "type": "phrase",
        "english": "He washes the dishes in the kitchen.",
        "portuguese": "Ele lava a louça na cozinha."
      }),
      makeCard(82, 9, {
        "type": "phrase",
        "english": "My brother goes to school by bus.",
        "portuguese": "Meu irmão vai para a escola de ônibus."
      }),
      makeCard(82, 10, {
        "type": "phrase",
        "english": "She washes the salad for dinner.",
        "portuguese": "Ela lava a salada para o jantar."
      }),
      makeCard(82, 11, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Verbos terminados em som sibilante ou na vogal \"o\" (**-o, -ch, -sh, -ss, -x, -z**) recebem **-es** na 3ª pessoa do singular (*go $\\rightarrow$ goes*, *do $\\rightarrow$ does*, *watch $\\rightarrow$ watches*, *wash $\\rightarrow$ washes*).",
        "grammarRule": {
          "title": "Gramática — Lição 82",
          "explanation": "Verbos terminados em som sibilante ou na vogal \"o\" (**-o, -ch, -sh, -ss, -x, -z**) recebem **-es** na 3ª pessoa do singular (*go $\\rightarrow$ goes*, *do $\\rightarrow$ does*, *watch $\\rightarrow$ watches*, *wash $\\rightarrow$ washes*).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 83,
    weekNumber: 12,
    blockNumber: 9,
    cefrLevel: 'A1',
    title: "Lição 83 — Revisão: Dias da Semana (Parte 1: Segunda a Quarta) *(4 palavras novas)*",
    subtitle: "Novas: **Monday** (substantivo próprio), **Tuesday** (substantivo próprio), **Wednesday** (substantivo próprio), **Gym** (substantivo).",
    grammarFocus: "Revisão: Dias da Semana (Parte 1: Segunda a Quarta) *(4 palavras novas)*",
    isDialogueDay: false,
    isReviewLesson: true,
    cards: [
      makeCard(83, 1, {
        "type": "word",
        "english": "Monday",
        "portuguese": "Segunda-feira"
      }),
      makeCard(83, 2, {
        "type": "word",
        "english": "Tuesday",
        "portuguese": "Terça-feira"
      }),
      makeCard(83, 3, {
        "type": "phrase",
        "english": "She works on Monday.",
        "portuguese": "Ela trabalha na segunda-feira."
      }),
      makeCard(83, 4, {
        "type": "phrase",
        "english": "He goes to the office on Tuesday.",
        "portuguese": "Ele vai para o escritório na terça-feira."
      }),
      makeCard(83, 5, {
        "type": "word",
        "english": "Wednesday",
        "portuguese": "Quarta-feira"
      }),
      makeCard(83, 6, {
        "type": "word",
        "english": "Gym",
        "portuguese": "Academia"
      }),
      makeCard(83, 7, {
        "type": "phrase",
        "english": "I go to the gym on Wednesday.",
        "portuguese": "Eu vou para a academia na quarta-feira."
      }),
      makeCard(83, 8, {
        "type": "phrase",
        "english": "On Monday, she wakes up early.",
        "portuguese": "Na segunda-feira, ela acorda cedo."
      }),
      makeCard(83, 9, {
        "type": "phrase",
        "english": "My brother studies on Tuesday.",
        "portuguese": "Meu irmão estuda na terça-feira."
      }),
      makeCard(83, 10, {
        "type": "phrase",
        "english": "He works from Monday to Wednesday.",
        "portuguese": "Ele trabalha de segunda a quarta."
      }),
      makeCard(83, 11, {
        "type": "phrase",
        "english": "She goes to the gym in the evening.",
        "portuguese": "Ela vai para a academia à noite."
      }),
      makeCard(83, 12, {
        "type": "phrase",
        "english": "The doctor works at the hospital on Wednesday.",
        "portuguese": "O médico trabalha no hospital na quarta-feira."
      })
    ]
  },
  {
    dayNumber: 84,
    weekNumber: 12,
    blockNumber: 9,
    cefrLevel: 'A1',
    title: "Lição 84 — 3ª Pessoa com \"-ies\" (Consoante + Y: \"Studies\")",
    subtitle: "Lição 84 do nível A1",
    grammarFocus: "Verbos terminados em **consoante + y** eliminam o *y* e r...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(84, 1, {
        "type": "word",
        "english": "Studies",
        "portuguese": "Estuda (3ª pessoa de *study*)"
      }),
      makeCard(84, 2, {
        "type": "word",
        "english": "Carries",
        "portuguese": "Carrega, leva (3ª pessoa de *carry*)"
      }),
      makeCard(84, 3, {
        "type": "phrase",
        "english": "He studies English at the university.",
        "portuguese": "Ele estuda inglês na universidade."
      }),
      makeCard(84, 4, {
        "type": "phrase",
        "english": "She carries a big backpack.",
        "portuguese": "Ela carrega uma mochila grande."
      }),
      makeCard(84, 5, {
        "type": "word",
        "english": "Tries",
        "portuguese": "Tenta (3ª pessoa de *try*)"
      }),
      makeCard(84, 6, {
        "type": "phrase",
        "english": "He tries to study every day.",
        "portuguese": "Ele tenta estudar todos os dias."
      }),
      makeCard(84, 7, {
        "type": "phrase",
        "english": "She studies medicine at the university.",
        "portuguese": "Ela estuda medicina na universidade."
      }),
      makeCard(84, 8, {
        "type": "phrase",
        "english": "The boy carries his books to school.",
        "portuguese": "O menino carrega os livros dele para a escola."
      }),
      makeCard(84, 9, {
        "type": "phrase",
        "english": "Julia plays in the park.",
        "portuguese": "Julia brinca no parque."
      }),
      makeCard(84, 10, {
        "type": "phrase",
        "english": "She studies and plays on Tuesday.",
        "portuguese": "Ela estuda e brinca na terça-feira."
      }),
      makeCard(84, 11, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Verbos terminados em **consoante + y** eliminam o *y* e recebem **-ies** na 3ª pessoa (*study $\\rightarrow$ studies*, *carry $\\rightarrow$ carries*, *try $\\rightarrow$ tries*). Se for precedido de vogal (**vogal + y**), acrescenta-se apenas **-s** (*play $\\rightarrow$ plays*).",
        "grammarRule": {
          "title": "Gramática — Lição 84",
          "explanation": "Verbos terminados em **consoante + y** eliminam o *y* e recebem **-ies** na 3ª pessoa (*study $\\rightarrow$ studies*, *carry $\\rightarrow$ carries*, *try $\\rightarrow$ tries*). Se for precedido de vogal (**vogal + y**), acrescenta-se apenas **-s** (*play $\\rightarrow$ plays*).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 85,
    weekNumber: 13,
    blockNumber: 9,
    cefrLevel: 'A1',
    title: "Lição 85 — Dias da Semana (Parte 2: Quinta a Domingo)",
    subtitle: "Lição 85 do nível A1",
    grammarFocus: "Os dias da semana em inglês são **sempre iniciados com le...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(85, 1, {
        "type": "word",
        "english": "Thursday",
        "portuguese": "Quinta-feira"
      }),
      makeCard(85, 2, {
        "type": "word",
        "english": "Friday",
        "portuguese": "Sexta-feira"
      }),
      makeCard(85, 3, {
        "type": "phrase",
        "english": "We study on Thursday.",
        "portuguese": "Nós estudamos na quinta-feira."
      }),
      makeCard(85, 4, {
        "type": "phrase",
        "english": "I relax on Friday evening.",
        "portuguese": "Eu relaxo na sexta-feira à noite."
      }),
      makeCard(85, 5, {
        "type": "word",
        "english": "Saturday",
        "portuguese": "Sábado"
      }),
      makeCard(85, 6, {
        "type": "word",
        "english": "Sunday",
        "portuguese": "Domingo"
      }),
      makeCard(85, 7, {
        "type": "phrase",
        "english": "She goes to the park on Saturday.",
        "portuguese": "Ela vai ao parque no sábado."
      }),
      makeCard(85, 8, {
        "type": "phrase",
        "english": "He cooks for his family on Sunday.",
        "portuguese": "Ele cozinha para a família dele no domingo."
      }),
      makeCard(85, 9, {
        "type": "phrase",
        "english": "On Friday, we eat dinner at the restaurant.",
        "portuguese": "Na sexta-feira, nós jantamos no restaurante."
      }),
      makeCard(85, 10, {
        "type": "phrase",
        "english": "The supermarket is open on Saturday and Sunday.",
        "portuguese": "O supermercado está aberto no sábado e no domingo."
      }),
      makeCard(85, 11, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Os dias da semana em inglês são **sempre iniciados com letra maiúscula** e utilizam a preposição **on** (*on Thursday*, *on Friday*).",
        "grammarRule": {
          "title": "Gramática — Lição 85",
          "explanation": "Os dias da semana em inglês são **sempre iniciados com letra maiúscula** e utilizam a preposição **on** (*on Thursday*, *on Friday*).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 86,
    weekNumber: 13,
    blockNumber: 9,
    cefrLevel: 'A1',
    title: "Lição 86 — Revisão: O Fim de Semana e Lazer *(4 palavras novas)*",
    subtitle: "Novas: **Weekend** (substantivo), **Stay** (verbo com I/you/we/they), **Beach** (substantivo com plural *beaches*), **Rest** (verbo de descanso).",
    grammarFocus: "Revisão: O Fim de Semana e Lazer *(4 palavras novas)*",
    isDialogueDay: false,
    isReviewLesson: true,
    cards: [
      makeCard(86, 1, {
        "type": "word",
        "english": "Weekend",
        "portuguese": "Fim de semana (on weekends = nos fins de semana)"
      }),
      makeCard(86, 2, {
        "type": "word",
        "english": "Stay",
        "portuguese": "Ficar, permanecer"
      }),
      makeCard(86, 3, {
        "type": "phrase",
        "english": "On the weekend, I stay at home.",
        "portuguese": "No fim de semana, eu fico em casa."
      }),
      makeCard(86, 4, {
        "type": "word",
        "english": "Beach",
        "portuguese": "Praia (plural: beaches)"
      }),
      makeCard(86, 5, {
        "type": "word",
        "english": "Rest",
        "portuguese": "Descansar"
      }),
      makeCard(86, 6, {
        "type": "phrase",
        "english": "She goes to the beach on Saturday.",
        "portuguese": "Ela vai à praia no sábado."
      }),
      makeCard(86, 7, {
        "type": "phrase",
        "english": "We rest on Sunday.",
        "portuguese": "Nós descansamos no domingo."
      }),
      makeCard(86, 8, {
        "type": "phrase",
        "english": "He stays at the hotel on the weekend.",
        "portuguese": "Ele fica no hotel no fim de semana."
      }),
      makeCard(86, 9, {
        "type": "phrase",
        "english": "On weekends, they walk near the beach.",
        "portuguese": "Nos fins de semana, eles caminham perto da praia."
      }),
      makeCard(86, 10, {
        "type": "phrase",
        "english": "My sister stays with our mother on Friday.",
        "portuguese": "Minha irmã fica com a nossa mãe na sexta-feira."
      }),
      makeCard(86, 11, {
        "type": "phrase",
        "english": "She loves to rest and read on Sunday.",
        "portuguese": "Ela ama descansar e ler no domingo."
      }),
      makeCard(86, 12, {
        "type": "phrase",
        "english": "A quiet weekend to relax.",
        "portuguese": "Um fim de semana tranquilo para relaxar."
      })
    ]
  },
  {
    dayNumber: 87,
    weekNumber: 13,
    blockNumber: 9,
    cefrLevel: 'A1',
    title: "Lição 87 — Expressões de Rotina e Frequência",
    subtitle: "Lição 87 do nível A1",
    grammarFocus: "Os advérbios de frequência (*always, never, sometimes*) p...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(87, 1, {
        "type": "word",
        "english": "Always",
        "portuguese": "Sempre"
      }),
      makeCard(87, 2, {
        "type": "word",
        "english": "Never",
        "portuguese": "Nunca"
      }),
      makeCard(87, 3, {
        "type": "phrase",
        "english": "She always wakes up early.",
        "portuguese": "Ela sempre acorda cedo."
      }),
      makeCard(87, 4, {
        "type": "phrase",
        "english": "He never drinks coffee at night.",
        "portuguese": "Ele nunca bebe café à noite."
      }),
      makeCard(87, 5, {
        "type": "word",
        "english": "Sometimes",
        "portuguese": "Às vezes"
      }),
      makeCard(87, 6, {
        "type": "phrase",
        "english": "He sometimes walks to work.",
        "portuguese": "Ele às vezes caminha para o trabalho."
      }),
      makeCard(87, 7, {
        "type": "phrase",
        "english": "She always studies on Monday.",
        "portuguese": "Ela sempre estuda na segunda-feira."
      }),
      makeCard(87, 8, {
        "type": "phrase",
        "english": "They never eat meat on Friday.",
        "portuguese": "Eles nunca comem carne na sexta-feira."
      }),
      makeCard(87, 9, {
        "type": "phrase",
        "english": "Julia sometimes cooks dinner.",
        "portuguese": "Julia às vezes cozinha o jantar."
      }),
      makeCard(87, 10, {
        "type": "phrase",
        "english": "My brother always listens to music.",
        "portuguese": "Meu irmão sempre escuta música."
      }),
      makeCard(87, 11, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Os advérbios de frequência (*always, never, sometimes*) posicionam-se comumente **antes do verbo principal** de ação no Simple Present (*she always wakes up*, *he never drinks*).",
        "grammarRule": {
          "title": "Gramática — Lição 87",
          "explanation": "Os advérbios de frequência (*always, never, sometimes*) posicionam-se comumente **antes do verbo principal** de ação no Simple Present (*she always wakes up*, *he never drinks*).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 88,
    weekNumber: 13,
    blockNumber: 9,
    cefrLevel: 'A1',
    title: "Lição 88 — Atividades da Família e Rotina de Terceiros",
    subtitle: "Lição 88 do nível A1",
    grammarFocus: "Consolidação morfológica da 3ª pessoa do singular em verb...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(88, 1, {
        "type": "word",
        "english": "Cleans",
        "portuguese": "Limpa (3ª pessoa de *clean*)"
      }),
      makeCard(88, 2, {
        "type": "word",
        "english": "Visits",
        "portuguese": "Visita (3ª pessoa de *visit*)"
      }),
      makeCard(88, 3, {
        "type": "phrase",
        "english": "He cleans the house on Saturday.",
        "portuguese": "Ele limpa a casa no sábado."
      }),
      makeCard(88, 4, {
        "type": "phrase",
        "english": "She visits her mother on Sunday.",
        "portuguese": "Ela visita a mãe dela no domingo."
      }),
      makeCard(88, 5, {
        "type": "word",
        "english": "Drinks",
        "portuguese": "Bebe (3ª pessoa de *drink*)"
      }),
      makeCard(88, 6, {
        "type": "word",
        "english": "Eats",
        "portuguese": "Come (3ª pessoa de *eat*)"
      }),
      makeCard(88, 7, {
        "type": "phrase",
        "english": "She drinks hot tea with milk.",
        "portuguese": "Ela bebe chá quente com leite."
      }),
      makeCard(88, 8, {
        "type": "phrase",
        "english": "He eats bread and cheese for breakfast.",
        "portuguese": "Ele come pão e queijo no café da manhã."
      }),
      makeCard(88, 9, {
        "type": "phrase",
        "english": "My father cleans his car on the weekend.",
        "portuguese": "Meu pai limpa o carro dele no fim de semana."
      }),
      makeCard(88, 10, {
        "type": "phrase",
        "english": "She visits her family from Thursday to Sunday.",
        "portuguese": "Ela visita a família dela de quinta a domingo."
      }),
      makeCard(88, 11, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Consolidação morfológica da 3ª pessoa do singular em verbos do dia a dia: *cleans, visits, drinks, eats*.",
        "grammarRule": {
          "title": "Gramática — Lição 88",
          "explanation": "Consolidação morfológica da 3ª pessoa do singular em verbos do dia a dia: *cleans, visits, drinks, eats*.",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 89,
    weekNumber: 13,
    blockNumber: 9,
    cefrLevel: 'A1',
    title: "Lição 89 — Revisão: A Vida de Outras Pessoas *(4 palavras novas)*",
    subtitle: "Novas: **Usually** (advérbio), **Busy** (adjetivo), **Often** (advérbio), **Life** (substantivo).",
    grammarFocus: "Revisão: A Vida de Outras Pessoas *(4 palavras novas)*",
    isDialogueDay: false,
    isReviewLesson: true,
    cards: [
      makeCard(89, 1, {
        "type": "word",
        "english": "Usually",
        "portuguese": "Geralmente, habitualmente"
      }),
      makeCard(89, 2, {
        "type": "word",
        "english": "Busy",
        "portuguese": "Ocupado, ocupada"
      }),
      makeCard(89, 3, {
        "type": "phrase",
        "english": "She is usually very busy.",
        "portuguese": "Ela geralmente é muito ocupada."
      }),
      makeCard(89, 4, {
        "type": "word",
        "english": "Often",
        "portuguese": "Frequentemente, com frequência"
      }),
      makeCard(89, 5, {
        "type": "word",
        "english": "Life",
        "portuguese": "Vida"
      }),
      makeCard(89, 6, {
        "type": "phrase",
        "english": "He often visits the city.",
        "portuguese": "Ele frequentemente visita a cidade."
      }),
      makeCard(89, 7, {
        "type": "phrase",
        "english": "She loves her life in Brazil.",
        "portuguese": "Ela ama a vida dela no Brasil."
      }),
      makeCard(89, 8, {
        "type": "phrase",
        "english": "The doctor is often busy at the hospital.",
        "portuguese": "O médico frequentemente está ocupado no hospital."
      }),
      makeCard(89, 9, {
        "type": "phrase",
        "english": "On Monday, my sister is very busy with her job.",
        "portuguese": "Na segunda-feira, minha irmã fica muito ocupada com o trabalho dela."
      }),
      makeCard(89, 10, {
        "type": "phrase",
        "english": "He usually walks in the park in the morning.",
        "portuguese": "Ele geralmente caminha no parque de manhã."
      }),
      makeCard(89, 11, {
        "type": "phrase",
        "english": "She often cooks rice and salad for dinner.",
        "portuguese": "Ela frequentemente cozinha arroz e salada para o jantar."
      }),
      makeCard(89, 12, {
        "type": "phrase",
        "english": "They usually stay at home on the weekend.",
        "portuguese": "Eles geralmente ficam em casa no fim de semana."
      })
    ]
  },
  {
    dayNumber: 90,
    weekNumber: 13,
    blockNumber: 9,
    cefrLevel: 'A1',
    title: "Lição 90 — História 1 (A Vida e a Rotina de Sarah)",
    subtitle: "Lição 90 do nível A1",
    grammarFocus: "História 1 (A Vida e a Rotina de Sarah)",
    isDialogueDay: true,
    isReviewLesson: false,
    cards: [
      makeCard(90, 1, {
        "type": "phrase",
        "english": "Sarah is a doctor, and she lives in a big city.",
        "portuguese": "Sarah é médica, e ela mora em uma grande cidade."
      }),
      makeCard(90, 2, {
        "type": "phrase",
        "english": "She is usually very busy with her job at the hospital.",
        "portuguese": "Ela geralmente é muito ocupada com o trabalho dela no hospital."
      }),
      makeCard(90, 3, {
        "type": "phrase",
        "english": "From Monday to Friday, Sarah wakes up early.",
        "portuguese": "De segunda a sexta, Sarah acorda cedo."
      }),
      makeCard(90, 4, {
        "type": "phrase",
        "english": "She drinks a cup of coffee and eats bread with cheese.",
        "portuguese": "Ela bebe uma xícara de café e come pão com queijo."
      }),
      makeCard(90, 5, {
        "type": "phrase",
        "english": "She goes to work by bus and starts her day.",
        "portuguese": "Ela vai para o trabalho de ônibus e começa o dia dela."
      }),
      makeCard(90, 6, {
        "type": "phrase",
        "english": "In the afternoon, she eats lunch at the hospital.",
        "portuguese": "À tarde, ela almoça no hospital."
      }),
      makeCard(90, 7, {
        "type": "phrase",
        "english": "In the evening, Sarah cooks dinner and relaxes on her sofa.",
        "portuguese": "À noite, Sarah cozinha o jantar e relaxa no sofá dela."
      }),
      makeCard(90, 8, {
        "type": "phrase",
        "english": "On the weekend, she stays with her family.",
        "portuguese": "No fim de semana, ela fica com a família dela."
      }),
      makeCard(90, 9, {
        "type": "phrase",
        "english": "On Saturday, she walks on the beach with her dog.",
        "portuguese": "No sábado, ela caminha na praia com o cachorro dela."
      }),
      makeCard(90, 10, {
        "type": "phrase",
        "english": "On Sunday, she visits her mother and reads a good book.",
        "portuguese": "No domingo, ela visita a mãe dela e lê um bom livro."
      }),
      makeCard(90, 11, {
        "type": "phrase",
        "english": "Sarah loves her life and her family.",
        "portuguese": "Sarah ama a vida dela e a família dela."
      })
    ]
  },
  {
    dayNumber: 91,
    weekNumber: 13,
    blockNumber: 10,
    cefrLevel: 'A1',
    title: "Lição 91 — Negação no Simple Present com \"Don't\" *(4 palavras novas)*",
    subtitle: "Novas: **Don't** (verbo auxiliar negativo), **Know** (verbo de conhecimento/cognição), **Understand** (verbo de compreensão), **But** (conjunção adversativa).",
    grammarFocus: "Negação no Simple Present: em inglês, verbos comuns de aç...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(91, 1, {
        "type": "word",
        "english": "Don't",
        "portuguese": "Não (verbo auxiliar negativo para *I, you, we, they*)"
      }),
      makeCard(91, 2, {
        "type": "word",
        "english": "Know",
        "portuguese": "Saber, conhecer"
      }),
      makeCard(91, 3, {
        "type": "phrase",
        "english": "I don't know.",
        "portuguese": "Eu não sei."
      }),
      makeCard(91, 4, {
        "type": "phrase",
        "english": "We don't know that doctor.",
        "portuguese": "Nós não conhecemos aquele médico."
      }),
      makeCard(91, 5, {
        "type": "word",
        "english": "Understand",
        "portuguese": "Entender, compreender"
      }),
      makeCard(91, 6, {
        "type": "word",
        "english": "But",
        "portuguese": "Mas, porém"
      }),
      makeCard(91, 7, {
        "type": "phrase",
        "english": "I don't understand.",
        "portuguese": "Eu não entendo."
      }),
      makeCard(91, 8, {
        "type": "phrase",
        "english": "I speak English, but I don't speak French.",
        "portuguese": "Eu falo inglês, mas não falo francês."
      }),
      makeCard(91, 9, {
        "type": "phrase",
        "english": "I know the teacher, but I don't understand his English.",
        "portuguese": "Eu conheço o professor, mas não entendo o inglês dele."
      }),
      makeCard(91, 10, {
        "type": "phrase",
        "english": "They live in Brazil, but they don't work in the city.",
        "portuguese": "Eles moram no Brasil, mas não trabalham na cidade."
      }),
      makeCard(91, 11, {
        "type": "phrase",
        "english": "You don't understand, but we have time.",
        "portuguese": "Você não compreende, mas nós temos tempo."
      }),
      makeCard(91, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Negação no Simple Present: em inglês, verbos comuns de ação não aceitam apenas a palavra *not* diretamente após si. Para os sujeitos **I, you, we, they**, inserimos o auxiliar negativo **don't** (contração de *do not*) antes do verbo principal (*I don't know*, *They don't understand*). A conjunção **but** introduz um contraste direto entre ideias (*I know, but I don't understand*).",
        "grammarRule": {
          "title": "Gramática — Lição 91",
          "explanation": "Negação no Simple Present: em inglês, verbos comuns de ação não aceitam apenas a palavra *not* diretamente após si. Para os sujeitos **I, you, we, they**, inserimos o auxiliar negativo **don't** (contração de *do not*) antes do verbo principal (*I don't know*, *They don't understand*). A conjunção **but** introduz um contraste direto entre ideias (*I know, but I don't understand*).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 92,
    weekNumber: 14,
    blockNumber: 10,
    cefrLevel: 'A1',
    title: "Lição 92 — Perguntas com \"Do\" e Respostas Curtas *(2 palavras novas)*",
    subtitle: "Novas: **Do** (verbo auxiliar interrogativo com I/you/we/they), **Remember** (verbo de memória).",
    grammarFocus: "Perguntas e Respostas Curtas (*Short Answers*): Para form...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(92, 1, {
        "type": "word",
        "english": "Do",
        "portuguese": "Verbo auxiliar para perguntas no presente (com *I, you, we, they*)"
      }),
      makeCard(92, 2, {
        "type": "word",
        "english": "Remember",
        "portuguese": "Lembrar, lembrar-se de, recordar"
      }),
      makeCard(92, 3, {
        "type": "phrase",
        "english": "Do you remember my name?",
        "portuguese": "Você se lembra do meu nome? / Você lembra do meu nome?"
      }),
      makeCard(92, 4, {
        "type": "phrase",
        "english": "Yes, I do.",
        "portuguese": "Sim, lembro. / Sim, eu me lembro."
      }),
      makeCard(92, 5, {
        "type": "phrase",
        "english": "No, I don't.",
        "portuguese": "Não, não lembro."
      }),
      makeCard(92, 6, {
        "type": "phrase",
        "english": "Do you speak English?",
        "portuguese": "Você fala inglês?"
      }),
      makeCard(92, 7, {
        "type": "phrase",
        "english": "Yes, I do. I speak English.",
        "portuguese": "Sim, falo. Eu falo inglês."
      }),
      makeCard(92, 8, {
        "type": "phrase",
        "english": "Do they work at the hospital?",
        "portuguese": "Eles trabalham no hospital?"
      }),
      makeCard(92, 9, {
        "type": "phrase",
        "english": "No, they don't.",
        "portuguese": "Não, não trabalham."
      }),
      makeCard(92, 10, {
        "type": "phrase",
        "english": "Do you live in this city?",
        "portuguese": "Vocês moram nesta cidade?"
      }),
      makeCard(92, 11, {
        "type": "phrase",
        "english": "Yes, we do.",
        "portuguese": "Sim, moramos."
      }),
      makeCard(92, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Perguntas e Respostas Curtas (*Short Answers*): Para formular perguntas no presente com *you, they, we*, iniciamos a frase com **Do** (*Do you live here?*). Nas respostas de \"Sim/Não\", o padrão natural em inglês repete o auxiliar, e não o verbo principal: afirmação: **Yes, I do** / **Yes, we do**; negação: **No, I don't** / **No, they don't**.",
        "grammarRule": {
          "title": "Gramática — Lição 92",
          "explanation": "Perguntas e Respostas Curtas (*Short Answers*): Para formular perguntas no presente com *you, they, we*, iniciamos a frase com **Do** (*Do you live here?*). Nas respostas de \"Sim/Não\", o padrão natural em inglês repete o auxiliar, e não o verbo principal: afirmação: **Yes, I do** / **Yes, we do**; negação: **No, I don't** / **No, they don't**.",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 93,
    weekNumber: 14,
    blockNumber: 10,
    cefrLevel: 'A1',
    title: "Lição 93 — Revisão: Hobbies e Esportes *(4 palavras novas)*",
    subtitle: "Novas: **Soccer** (substantivo de esporte), **Tennis** (substantivo de esporte), **Guitar** (substantivo de instrumento musical), **Game** (substantivo de lazer/esporte).",
    grammarFocus: "O verbo **play** possui duplo sentido fundamental: com es...",
    isDialogueDay: false,
    isReviewLesson: true,
    cards: [
      makeCard(93, 1, {
        "type": "word",
        "english": "Soccer",
        "portuguese": "Futebol"
      }),
      makeCard(93, 2, {
        "type": "word",
        "english": "Tennis",
        "portuguese": "Tênis (esporte)"
      }),
      makeCard(93, 3, {
        "type": "phrase",
        "english": "Do you play soccer?",
        "portuguese": "Você joga futebol?"
      }),
      makeCard(93, 4, {
        "type": "phrase",
        "english": "No, I don't. I play tennis.",
        "portuguese": "Não jogo. Eu jogo tênis."
      }),
      makeCard(93, 5, {
        "type": "word",
        "english": "Guitar",
        "portuguese": "Violão, guitarra"
      }),
      makeCard(93, 6, {
        "type": "word",
        "english": "Game",
        "portuguese": "Jogo, partida"
      }),
      makeCard(93, 7, {
        "type": "phrase",
        "english": "Do you play the guitar?",
        "portuguese": "Você toca violão?"
      }),
      makeCard(93, 8, {
        "type": "phrase",
        "english": "Yes, I do. I love music.",
        "portuguese": "Sim, toco. Eu amo música."
      }),
      makeCard(93, 9, {
        "type": "phrase",
        "english": "They watch a soccer game on Sunday.",
        "portuguese": "Eles assistem a um jogo de futebol no domingo."
      }),
      makeCard(93, 10, {
        "type": "phrase",
        "english": "We don't play games in the morning.",
        "portuguese": "Nós não jogamos jogos de manhã."
      }),
      makeCard(93, 11, {
        "type": "phrase",
        "english": "I play the guitar, but I don't play tennis.",
        "portuguese": "Eu toco violão, mas não jogo tênis."
      }),
      makeCard(93, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "O verbo **play** possui duplo sentido fundamental: com esportes e jogos significa *jogar* (*play soccer, play a game*); com instrumentos musicais significa *tocar*, exigindo o artigo definido *the* (*play the guitar*).",
        "grammarRule": {
          "title": "Gramática — Lição 93",
          "explanation": "O verbo **play** possui duplo sentido fundamental: com esportes e jogos significa *jogar* (*play soccer, play a game*); com instrumentos musicais significa *tocar*, exigindo o artigo definido *the* (*play the guitar*).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 94,
    weekNumber: 14,
    blockNumber: 10,
    cefrLevel: 'A1',
    title: "Lição 94 — Negação na 3ª Pessoa com \"Doesn't\" *(2 palavras novas)*",
    subtitle: "Novas: **Doesn't** (verbo auxiliar negativo de 3ª pessoa), **Drive** (verbo de locomoção).",
    grammarFocus: "Regra de Ouro da Negação com 3ª Pessoa: para *he, she, it...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(94, 1, {
        "type": "word",
        "english": "Doesn't",
        "portuguese": "Não (verbo auxiliar negativo para *he, she, it*)"
      }),
      makeCard(94, 2, {
        "type": "word",
        "english": "Drive",
        "portuguese": "Dirigir, guiar"
      }),
      makeCard(94, 3, {
        "type": "phrase",
        "english": "He doesn't drive.",
        "portuguese": "Ele não dirige."
      }),
      makeCard(94, 4, {
        "type": "phrase",
        "english": "She doesn't drive a car to work.",
        "portuguese": "Ela não dirige carro para o trabalho."
      }),
      makeCard(94, 5, {
        "type": "phrase",
        "english": "My brother doesn't work on Saturday.",
        "portuguese": "Meu irmão não trabalha no sábado."
      }),
      makeCard(94, 6, {
        "type": "phrase",
        "english": "She doesn't speak French.",
        "portuguese": "Ela não fala francês."
      }),
      makeCard(94, 7, {
        "type": "phrase",
        "english": "He doesn't live in this city.",
        "portuguese": "Ele não mora nesta cidade."
      }),
      makeCard(94, 8, {
        "type": "phrase",
        "english": "Julia doesn't eat meat.",
        "portuguese": "Julia não come carne."
      }),
      makeCard(94, 9, {
        "type": "phrase",
        "english": "The dog doesn't sleep in the house.",
        "portuguese": "O cachorro não dorme dentro de casa."
      }),
      makeCard(94, 10, {
        "type": "phrase",
        "english": "He doesn't understand the teacher.",
        "portuguese": "Ele não entende o professor."
      }),
      makeCard(94, 11, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Regra de Ouro da Negação com 3ª Pessoa: para *he, she, it*, usamos **doesn't** (contração de *does not*). Como a marca de 3ª pessoa (*-es*) já está no auxiliar *does*, o verbo principal **retorna obrigatoriamente à forma base infinita** sem flexão: *He works $\\rightarrow$ He doesn't work* (errado: *He doesn't works*); *She speaks $\\rightarrow$ She doesn't speak* (errado: *She doesn't speaks*).",
        "grammarRule": {
          "title": "Gramática — Lição 94",
          "explanation": "Regra de Ouro da Negação com 3ª Pessoa: para *he, she, it*, usamos **doesn't** (contração de *does not*). Como a marca de 3ª pessoa (*-es*) já está no auxiliar *does*, o verbo principal **retorna obrigatoriamente à forma base infinita** sem flexão: *He works $\\rightarrow$ He doesn't work* (errado: *He doesn't works*); *She speaks $\\rightarrow$ She doesn't speak* (errado: *She doesn't speaks*).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 95,
    weekNumber: 14,
    blockNumber: 10,
    cefrLevel: 'A1',
    title: "Lição 95 — Perguntas com \"Does\" e Respostas Curtas *(1 palavra nova)*",
    subtitle: "Novas: **Teach** (verbo de educação), e função auxiliar de **Does** em perguntas.",
    grammarFocus: "Perguntas com *Does*: para formular perguntas com *he, sh...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(95, 1, {
        "type": "word",
        "english": "Teach",
        "portuguese": "Ensinar"
      }),
      makeCard(95, 2, {
        "type": "phrase",
        "english": "Does he teach English?",
        "portuguese": "Ele ensina inglês?"
      }),
      makeCard(95, 3, {
        "type": "phrase",
        "english": "Yes, he does.",
        "portuguese": "Sim, ele ensina."
      }),
      makeCard(95, 4, {
        "type": "phrase",
        "english": "No, he doesn't.",
        "portuguese": "Não, ele não ensina."
      }),
      makeCard(95, 5, {
        "type": "phrase",
        "english": "Does she work at the hospital?",
        "portuguese": "Ela trabalha no hospital?"
      }),
      makeCard(95, 6, {
        "type": "phrase",
        "english": "Yes, she does. She is a doctor.",
        "portuguese": "Sim, trabalha. Ela é médica."
      }),
      makeCard(95, 7, {
        "type": "phrase",
        "english": "Does your father drive to work?",
        "portuguese": "O seu pai dirige para o trabalho?"
      }),
      makeCard(95, 8, {
        "type": "phrase",
        "english": "No, he doesn't. He walks.",
        "portuguese": "Não, não dirige. Ele caminha."
      }),
      makeCard(95, 9, {
        "type": "phrase",
        "english": "Does Julia play tennis?",
        "portuguese": "Julia joga tênis?"
      }),
      makeCard(95, 10, {
        "type": "phrase",
        "english": "Yes, she does. She plays tennis on Friday.",
        "portuguese": "Sim, joga. Ela joga tênis na sexta-feira."
      }),
      makeCard(95, 11, {
        "type": "phrase",
        "english": "Does the cat sleep on the bed?",
        "portuguese": "O gato dorme na cama?"
      }),
      makeCard(95, 12, {
        "type": "phrase",
        "english": "No, it doesn't.",
        "portuguese": "Não, não dorme."
      }),
      makeCard(95, 13, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Perguntas com *Does*: para formular perguntas com *he, she, it*, iniciamos com o auxiliar **Does**. O verbo de ação volta para a sua **forma base**: *Does she work?* (e nunca *Does she works?*). Nas respostas curtas: afirmativa: **Yes, he does** / **Yes, she does**; negativa: **No, he doesn't** / **No, she doesn't**.",
        "grammarRule": {
          "title": "Gramática — Lição 95",
          "explanation": "Perguntas com *Does*: para formular perguntas com *he, she, it*, iniciamos com o auxiliar **Does**. O verbo de ação volta para a sua **forma base**: *Does she work?* (e nunca *Does she works?*). Nas respostas curtas: afirmativa: **Yes, he does** / **Yes, she does**; negativa: **No, he doesn't** / **No, she doesn't**.",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 96,
    weekNumber: 14,
    blockNumber: 10,
    cefrLevel: 'A1',
    title: "Lição 96 — Revisão: Preferências e Tempo Livre *(4 palavras novas)*",
    subtitle: "Novas: **Prefer** (verbo de preferência), **Swim** (verbo de ação aquática), **Pool** (substantivo de instalação esportiva), **Free time** (expressão de lazer).",
    grammarFocus: "O verbo **prefer** expressa preferências pessoais (*I pre...",
    isDialogueDay: false,
    isReviewLesson: true,
    cards: [
      makeCard(96, 1, {
        "type": "word",
        "english": "Prefer",
        "portuguese": "Preferir"
      }),
      makeCard(96, 2, {
        "type": "word",
        "english": "Swim",
        "portuguese": "Nadar"
      }),
      makeCard(96, 3, {
        "type": "phrase",
        "english": "Do you prefer to swim?",
        "portuguese": "Você prefere nadar?"
      }),
      makeCard(96, 4, {
        "type": "phrase",
        "english": "Yes, I prefer to swim in the morning.",
        "portuguese": "Sim, eu prefiro nadar de manhã."
      }),
      makeCard(96, 5, {
        "type": "word",
        "english": "Pool",
        "portuguese": "Piscina"
      }),
      makeCard(96, 6, {
        "type": "word",
        "english": "Free time",
        "portuguese": "Tempo livre"
      }),
      makeCard(96, 7, {
        "type": "phrase",
        "english": "There is a big pool at the hotel.",
        "portuguese": "Há uma piscina grande no hotel."
      }),
      makeCard(96, 8, {
        "type": "phrase",
        "english": "Does she swim in the pool?",
        "portuguese": "Ela nada na piscina?"
      }),
      makeCard(96, 9, {
        "type": "phrase",
        "english": "Yes, she swims in her free time.",
        "portuguese": "Sim, ela nada no tempo livre dela."
      }),
      makeCard(96, 10, {
        "type": "phrase",
        "english": "In my free time, I play the guitar.",
        "portuguese": "No meu tempo livre, eu toco violão."
      }),
      makeCard(96, 11, {
        "type": "phrase",
        "english": "He prefers soccer, and I prefer tennis.",
        "portuguese": "Ele prefere futebol, e eu prefiro tênis."
      }),
      makeCard(96, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "O verbo **prefer** expressa preferências pessoais (*I prefer soccer* ou *I prefer to swim*). O verbo **swim** recebe *-s* na 3ª pessoa afirmativa (*she swims*), mas na pergunta e negação permanece em sua forma base (*Does she swim? / She doesn't swim*). A expressão **free time** é usualmente acompanhada da preposição *in* (*in my free time* = no meu tempo livre).",
        "grammarRule": {
          "title": "Gramática — Lição 96",
          "explanation": "O verbo **prefer** expressa preferências pessoais (*I prefer soccer* ou *I prefer to swim*). O verbo **swim** recebe *-s* na 3ª pessoa afirmativa (*she swims*), mas na pergunta e negação permanece em sua forma base (*Does she swim? / She doesn't swim*). A expressão **free time** é usualmente acompanhada da preposição *in* (*in my free time* = no meu tempo livre).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 97,
    weekNumber: 14,
    blockNumber: 10,
    cefrLevel: 'A1',
    title: "Lição 97 — Perguntas Abertas (Question Words com Do / Does) *(2 palavras novas)*",
    subtitle: "Novas: **Why** (advérbio interrogativo de causa), **Because** (conjunção explicativa/causal).",
    grammarFocus: "Estrutura de Perguntas Abertas: **Question Word + Do/Does...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(97, 1, {
        "type": "word",
        "english": "Why",
        "portuguese": "Por que (em perguntas)"
      }),
      makeCard(97, 2, {
        "type": "word",
        "english": "Because",
        "portuguese": "Porque, pois (em respostas e justificativas)"
      }),
      makeCard(97, 3, {
        "type": "phrase",
        "english": "Why do you study English?",
        "portuguese": "Por que você estuda inglês?"
      }),
      makeCard(97, 4, {
        "type": "phrase",
        "english": "Because I want to travel.",
        "portuguese": "Porque eu quero viajar."
      }),
      makeCard(97, 5, {
        "type": "phrase",
        "english": "Where do you live?",
        "portuguese": "Onde você mora?"
      }),
      makeCard(97, 6, {
        "type": "phrase",
        "english": "I live in a small apartment.",
        "portuguese": "Eu moro em um apartamento pequeno."
      }),
      makeCard(97, 7, {
        "type": "phrase",
        "english": "What does he study at the university?",
        "portuguese": "O que ele estuda na universidade?"
      }),
      makeCard(97, 8, {
        "type": "phrase",
        "english": "He studies medicine.",
        "portuguese": "Ele estuda medicina."
      }),
      makeCard(97, 9, {
        "type": "phrase",
        "english": "When do you wake up?",
        "portuguese": "Quando você acorda?"
      }),
      makeCard(97, 10, {
        "type": "phrase",
        "english": "I wake up early in the morning.",
        "portuguese": "Eu acordo cedo de manhã."
      }),
      makeCard(97, 11, {
        "type": "phrase",
        "english": "Why does she walk to work?",
        "portuguese": "Por que ela caminha para o trabalho?"
      }),
      makeCard(97, 12, {
        "type": "phrase",
        "english": "Because she doesn't drive a car.",
        "portuguese": "Porque ela não dirige carro."
      }),
      makeCard(97, 13, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Estrutura de Perguntas Abertas: **Question Word + Do/Does + Sujeito + Verbo Base**. A palavra **Why** é usada exclusivamente para questionar motivos (\"por que?\"), enquanto **Because** é empregada para fornecer a razão na resposta (\"porque...\").",
        "grammarRule": {
          "title": "Gramática — Lição 97",
          "explanation": "Estrutura de Perguntas Abertas: **Question Word + Do/Does + Sujeito + Verbo Base**. A palavra **Why** é usada exclusivamente para questionar motivos (\"por que?\"), enquanto **Because** é empregada para fornecer a razão na resposta (\"porque...\").",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 98,
    weekNumber: 14,
    blockNumber: 10,
    cefrLevel: 'A1',
    title: "Lição 98 — Gostos, Preferências e Alimentos *(3 palavras novas)*",
    subtitle: "Novas: **Pizza** (substantivo culinário), **Pasta** (substantivo culinário), **Delicious** (adjetivo qualificativo).",
    grammarFocus: "*Pizza* e *pasta* são amplamente utilizados no vocabulári...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(98, 1, {
        "type": "word",
        "english": "Pizza",
        "portuguese": "Pizza"
      }),
      makeCard(98, 2, {
        "type": "word",
        "english": "Pasta",
        "portuguese": "Massa, macarrão"
      }),
      makeCard(98, 3, {
        "type": "phrase",
        "english": "Do you like pizza?",
        "portuguese": "Você gosta de pizza?"
      }),
      makeCard(98, 4, {
        "type": "phrase",
        "english": "Yes, I love pizza.",
        "portuguese": "Sim, eu amo pizza."
      }),
      makeCard(98, 5, {
        "type": "word",
        "english": "Delicious",
        "portuguese": "Delicioso, deliciosa"
      }),
      makeCard(98, 6, {
        "type": "phrase",
        "english": "This pasta is delicious.",
        "portuguese": "Esta massa está deliciosa."
      }),
      makeCard(98, 7, {
        "type": "phrase",
        "english": "Does he eat pasta for dinner?",
        "portuguese": "Ele come massa no jantar?"
      }),
      makeCard(98, 8, {
        "type": "phrase",
        "english": "No, he doesn't. He prefers rice and meat.",
        "portuguese": "Não, ele não come. Ele prefere arroz e carne."
      }),
      makeCard(98, 9, {
        "type": "phrase",
        "english": "We don't eat pizza on Monday.",
        "portuguese": "Nós não comemos pizza na segunda-feira."
      }),
      makeCard(98, 10, {
        "type": "phrase",
        "english": "She cooks delicious food for her family.",
        "portuguese": "Ela cozinha comida deliciosa para a família dela."
      }),
      makeCard(98, 11, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "*Pizza* e *pasta* são amplamente utilizados no vocabulário internacional de alimentação. O adjetivo *delicious* segue a ordem dos adjetivos em inglês: posiciona-se após verbos de ligação (*The pasta is delicious*) ou imediatamente antes do substantivo que qualifica (*delicious food*).",
        "grammarRule": {
          "title": "Gramática — Lição 98",
          "explanation": "*Pizza* e *pasta* são amplamente utilizados no vocabulário internacional de alimentação. O adjetivo *delicious* segue a ordem dos adjetivos em inglês: posiciona-se após verbos de ligação (*The pasta is delicious*) ou imediatamente antes do substantivo que qualifica (*delicious food*).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 99,
    weekNumber: 15,
    blockNumber: 10,
    cefrLevel: 'A1',
    title: "Lição 99 — Revisão: Saúde e Estilo de Vida *(4 palavras novas)*",
    subtitle: "Novas: **Healthy** (adjetivo de bem-estar), **Fast food** (substantivo culinário composto), **Run** (verbo de atividade física), **Smoke** (verbo de hábito/saúde).",
    grammarFocus: "O adjetivo **healthy** caracteriza hábitos, estilos de vi...",
    isDialogueDay: false,
    isReviewLesson: true,
    cards: [
      makeCard(99, 1, {
        "type": "word",
        "english": "Healthy",
        "portuguese": "Saudável"
      }),
      makeCard(99, 2, {
        "type": "word",
        "english": "Fast food",
        "portuguese": "Fast food, comida rápida"
      }),
      makeCard(99, 3, {
        "type": "phrase",
        "english": "Do you eat healthy food?",
        "portuguese": "Você come comida saudável?"
      }),
      makeCard(99, 4, {
        "type": "phrase",
        "english": "Yes, I eat fruit and salad every day.",
        "portuguese": "Sim, eu como fruta e salada todos os dias."
      }),
      makeCard(99, 5, {
        "type": "phrase",
        "english": "I don't eat fast food.",
        "portuguese": "Eu não como fast food."
      }),
      makeCard(99, 6, {
        "type": "word",
        "english": "Run",
        "portuguese": "Correr"
      }),
      makeCard(99, 7, {
        "type": "word",
        "english": "Smoke",
        "portuguese": "Fumar"
      }),
      makeCard(99, 8, {
        "type": "phrase",
        "english": "Do you run in the park?",
        "portuguese": "Você corre no parque?"
      }),
      makeCard(99, 9, {
        "type": "phrase",
        "english": "Yes, I run on Saturday morning.",
        "portuguese": "Sim, eu corro no sábado de manhã."
      }),
      makeCard(99, 10, {
        "type": "phrase",
        "english": "He doesn't smoke.",
        "portuguese": "Ele não fuma."
      }),
      makeCard(99, 11, {
        "type": "phrase",
        "english": "Does your father smoke?",
        "portuguese": "O seu pai fuma?"
      }),
      makeCard(99, 12, {
        "type": "phrase",
        "english": "No, he doesn't. He has a healthy life.",
        "portuguese": "Não, ele não fuma. Ele tem uma vida saudável."
      }),
      makeCard(99, 13, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "O adjetivo **healthy** caracteriza hábitos, estilos de vida e alimentos benéficos à saúde (*healthy food, healthy routine, healthy life*). Os verbos **run** e **smoke** seguem a flexão do Simple Present: afirmativa (*he runs, he smokes*), negação (*he doesn't run, he doesn't smoke*) e pergunta (*does he run? does he smoke?*).",
        "grammarRule": {
          "title": "Gramática — Lição 99",
          "explanation": "O adjetivo **healthy** caracteriza hábitos, estilos de vida e alimentos benéficos à saúde (*healthy food, healthy routine, healthy life*). Os verbos **run** e **smoke** seguem a flexão do Simple Present: afirmativa (*he runs, he smokes*), negação (*he doesn't run, he doesn't smoke*) e pergunta (*does he run? does he smoke?*).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 100,
    weekNumber: 15,
    blockNumber: 10,
    cefrLevel: 'A1',
    title: "Lição 100 — Fechamento do Bloco 10: Diálogo 4 — Entrevista sobre Estilo de Vida e Hábitos",
    subtitle: "Lição 100 do nível A1",
    grammarFocus: "Fechamento do Bloco 10: Diálogo 4 — Entrevista sobre Estilo de Vida e Hábitos",
    isDialogueDay: true,
    isReviewLesson: false,
    cards: [
      makeCard(100, 1, {
        "type": "dialogue",
        "english": "Good morning, Daniel! Welcome.",
        "portuguese": "Bom dia, Daniel! Seja bem-vindo.",
        "dialogueSpeaker": "Interviewer"
      }),
      makeCard(100, 2, {
        "type": "dialogue",
        "english": "Good morning! Thank you very much.",
        "portuguese": "Bom dia! Muito obrigado.",
        "dialogueSpeaker": "Daniel"
      }),
      makeCard(100, 3, {
        "type": "dialogue",
        "english": "Where do you live?",
        "portuguese": "Onde você mora?",
        "dialogueSpeaker": "Interviewer"
      }),
      makeCard(100, 4, {
        "type": "dialogue",
        "english": "I live in an apartment near the park.",
        "portuguese": "Eu moro em um apartamento perto do parque.",
        "dialogueSpeaker": "Daniel"
      }),
      makeCard(100, 5, {
        "type": "dialogue",
        "english": "Do you work near here?",
        "portuguese": "Você trabalha perto daqui?",
        "dialogueSpeaker": "Interviewer"
      }),
      makeCard(100, 6, {
        "type": "dialogue",
        "english": "Yes, I do. I work in an office from Monday to Friday.",
        "portuguese": "Sim, trabalho. Eu trabalho em um escritório de segunda a sexta-feira.",
        "dialogueSpeaker": "Daniel"
      }),
      makeCard(100, 7, {
        "type": "dialogue",
        "english": "Do you drive to work?",
        "portuguese": "Você dirige para o trabalho?",
        "dialogueSpeaker": "Interviewer"
      }),
      makeCard(100, 8, {
        "type": "dialogue",
        "english": "No, I don't. I don't drive. I walk to work every morning.",
        "portuguese": "Não. Eu não dirijo. Eu caminho para o trabalho todas as manhãs.",
        "dialogueSpeaker": "Daniel"
      }),
      makeCard(100, 9, {
        "type": "dialogue",
        "english": "What do you do in your free time?",
        "portuguese": "O que você faz no seu tempo livre?",
        "dialogueSpeaker": "Interviewer"
      }),
      makeCard(100, 10, {
        "type": "dialogue",
        "english": "In my free time, I play soccer with my friends.",
        "portuguese": "No meu tempo livre, eu jogo futebol com os meus amigos.",
        "dialogueSpeaker": "Daniel"
      }),
      makeCard(100, 11, {
        "type": "dialogue",
        "english": "Do you play tennis, too?",
        "portuguese": "Você joga tênis também?",
        "dialogueSpeaker": "Interviewer"
      }),
      makeCard(100, 12, {
        "type": "dialogue",
        "english": "No, I don't play tennis, but I swim in the pool on Saturday.",
        "portuguese": "Não, eu não jogo tênis, mas eu nado na piscina no sábado.",
        "dialogueSpeaker": "Daniel"
      }),
      makeCard(100, 13, {
        "type": "dialogue",
        "english": "Why do you swim on Saturday?",
        "portuguese": "Por que você nada no sábado?",
        "dialogueSpeaker": "Interviewer"
      }),
      makeCard(100, 14, {
        "type": "dialogue",
        "english": "Because I want to have a healthy life.",
        "portuguese": "Porque eu quero ter uma vida saudável.",
        "dialogueSpeaker": "Daniel"
      }),
      makeCard(100, 15, {
        "type": "dialogue",
        "english": "Do you eat fast food?",
        "portuguese": "Você come fast food?",
        "dialogueSpeaker": "Interviewer"
      }),
      makeCard(100, 16, {
        "type": "dialogue",
        "english": "No, I never eat fast food. I eat fruit, salad and pasta.",
        "portuguese": "Não, eu nunca como fast food. Eu como fruta, salada e massa.",
        "dialogueSpeaker": "Daniel"
      }),
      makeCard(100, 17, {
        "type": "dialogue",
        "english": "Does your brother have a healthy routine, too?",
        "portuguese": "O seu irmão tem uma rotina saudável também?",
        "dialogueSpeaker": "Interviewer"
      }),
      makeCard(100, 18, {
        "type": "dialogue",
        "english": "Yes, he does! He runs in the park and plays the guitar.",
        "portuguese": "Sim, tem! Ele corre no parque e toca violão.",
        "dialogueSpeaker": "Daniel"
      }),
      makeCard(100, 19, {
        "type": "dialogue",
        "english": "That is great! Thank you for your time, Daniel.",
        "portuguese": "Isso é ótimo! Obrigado pelo seu tempo, Daniel.",
        "dialogueSpeaker": "Interviewer"
      }),
      makeCard(100, 20, {
        "type": "dialogue",
        "english": "You are welcome! Have a good day.",
        "portuguese": "De nada! Tenha um bom dia.",
        "dialogueSpeaker": "Daniel"
      })
    ]
  },
  {
    dayNumber: 101,
    weekNumber: 15,
    blockNumber: 11,
    cefrLevel: 'A1',
    title: "Lição 101 — Perguntando e Dizendo as Horas (Horas Exatas) *(4 palavras novas)*",
    subtitle: "Novas: **O'clock** (marcador exclusivo de hora cheia), **Eleven** (número 11), **Twelve** (número 12), **Noon** (substantivo meio-dia).",
    grammarFocus: "Perguntar e Informar as Horas: Para perguntar que horas s...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(101, 1, {
        "type": "word",
        "english": "O'clock",
        "portuguese": "Em ponto (usado estritamente com horas cheias)"
      }),
      makeCard(101, 2, {
        "type": "word",
        "english": "Eleven",
        "portuguese": "Onze (número 11)"
      }),
      makeCard(101, 3, {
        "type": "phrase",
        "english": "It is eleven o'clock.",
        "portuguese": "São onze horas em ponto."
      }),
      makeCard(101, 4, {
        "type": "phrase",
        "english": "What time is it?",
        "portuguese": "Que horas são?"
      }),
      makeCard(101, 5, {
        "type": "word",
        "english": "Twelve",
        "portuguese": "Doze (número 12)"
      }),
      makeCard(101, 6, {
        "type": "word",
        "english": "Noon",
        "portuguese": "Meio-dia (12:00 PM)"
      }),
      makeCard(101, 7, {
        "type": "phrase",
        "english": "It is twelve o'clock.",
        "portuguese": "São doze horas em ponto."
      }),
      makeCard(101, 8, {
        "type": "phrase",
        "english": "It is noon.",
        "portuguese": "É meio-dia."
      }),
      makeCard(101, 9, {
        "type": "phrase",
        "english": "What time is it now?",
        "portuguese": "Que horas são agora?"
      }),
      makeCard(101, 10, {
        "type": "phrase",
        "english": "It is eight o'clock in the morning.",
        "portuguese": "São oito horas da manhã."
      }),
      makeCard(101, 11, {
        "type": "phrase",
        "english": "It is ten o'clock at night.",
        "portuguese": "São dez horas da noite."
      }),
      makeCard(101, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Perguntar e Informar as Horas: Para perguntar que horas são, usamos a expressão **What time is it?**. Para responder, empregamos sempre o pronome neutro **It is** (ou contraído *It's*). O termo **o'clock** (originário de *of the clock*) aplica-se **exclusivamente a horas exatas/cheias** (*It is seven o'clock*). Para as 12:00 do dia, o termo natural mais comum é **noon** (*It is noon*).",
        "grammarRule": {
          "title": "Gramática — Lição 101",
          "explanation": "Perguntar e Informar as Horas: Para perguntar que horas são, usamos a expressão **What time is it?**. Para responder, empregamos sempre o pronome neutro **It is** (ou contraído *It's*). O termo **o'clock** (originário de *of the clock*) aplica-se **exclusivamente a horas exatas/cheias** (*It is seven o'clock*). Para as 12:00 do dia, o termo natural mais comum é **noon** (*It is noon*).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 102,
    weekNumber: 15,
    blockNumber: 11,
    cefrLevel: 'A1',
    title: "Lição 102 — Minutos, Meia Hora e Frações de Hora *(4 palavras novas)*",
    subtitle: "Novas: **Half** (substantivo metade/meia), **Past** (preposição depois de/passado de), **Quarter** (substantivo um quarto/15 minutos), **Midnight** (substantivo meia-noite).",
    grammarFocus: "Estruturas Tradicionais de Horas: Em inglês formal e coti...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(102, 1, {
        "type": "word",
        "english": "Half",
        "portuguese": "Metade, meia"
      }),
      makeCard(102, 2, {
        "type": "word",
        "english": "Past",
        "portuguese": "Passado de, depois de (usado em horários)"
      }),
      makeCard(102, 3, {
        "type": "phrase",
        "english": "It is half past seven.",
        "portuguese": "São sete e meia. (Literalmente: metade passada das sete)."
      }),
      makeCard(102, 4, {
        "type": "phrase",
        "english": "It is half past eight in the morning.",
        "portuguese": "São oito e meia da manhã."
      }),
      makeCard(102, 5, {
        "type": "word",
        "english": "Quarter",
        "portuguese": "Um quarto (15 minutos)"
      }),
      makeCard(102, 6, {
        "type": "word",
        "english": "Midnight",
        "portuguese": "Meia-noite (12:00 AM)"
      }),
      makeCard(102, 7, {
        "type": "phrase",
        "english": "It is a quarter past ten.",
        "portuguese": "São dez e quinze."
      }),
      makeCard(102, 8, {
        "type": "phrase",
        "english": "It is a quarter to five.",
        "portuguese": "São quinze para as cinco."
      }),
      makeCard(102, 9, {
        "type": "phrase",
        "english": "It is midnight.",
        "portuguese": "É meia-noite."
      }),
      makeCard(102, 10, {
        "type": "phrase",
        "english": "We eat lunch at half past twelve.",
        "portuguese": "Nós almoçamos ao meio-dia e meia."
      }),
      makeCard(102, 11, {
        "type": "phrase",
        "english": "She sleeps at midnight.",
        "portuguese": "Ela dorme à meia-noite."
      }),
      makeCard(102, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Estruturas Tradicionais de Horas: Em inglês formal e cotidiano, expressamos frações de hora usando **half past** para 30 minutos (*half past six* = 6:30) e **a quarter** para 15 minutos (*a quarter past seven* = 7:15; *a quarter to eight* = 7:45, ou quinze para as oito). Para as 00:00, usamos **midnight** (*It is midnight*).",
        "grammarRule": {
          "title": "Gramática — Lição 102",
          "explanation": "Estruturas Tradicionais de Horas: Em inglês formal e cotidiano, expressamos frações de hora usando **half past** para 30 minutos (*half past six* = 6:30) e **a quarter** para 15 minutos (*a quarter past seven* = 7:15; *a quarter to eight* = 7:45, ou quinze para as oito). Para as 00:00, usamos **midnight** (*It is midnight*).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 103,
    weekNumber: 15,
    blockNumber: 11,
    cefrLevel: 'A1',
    title: "Lição 103 — Revisão: Números de 13 a 30 e Horas Digitais *(4 palavras novas)*",
    subtitle: "Novas: **Thirteen** (número 13), **Fifteen** (número 15), **Twenty** (número 20), **Thirty** (número 30).",
    grammarFocus: "Leitura Digital das Horas: Paralelamente às formas com *p...",
    isDialogueDay: false,
    isReviewLesson: true,
    cards: [
      makeCard(103, 1, {
        "type": "word",
        "english": "Thirteen",
        "portuguese": "Treze (número 13)"
      }),
      makeCard(103, 2, {
        "type": "word",
        "english": "Fifteen",
        "portuguese": "Quinze (número 15)"
      }),
      makeCard(103, 3, {
        "type": "phrase",
        "english": "It is seven fifteen.",
        "portuguese": "São sete e quinze."
      }),
      makeCard(103, 4, {
        "type": "phrase",
        "english": "The flight is at eight fifteen.",
        "portuguese": "O voo é às oito e quinze."
      }),
      makeCard(103, 5, {
        "type": "word",
        "english": "Twenty",
        "portuguese": "Vinte (número 20)"
      }),
      makeCard(103, 6, {
        "type": "word",
        "english": "Thirty",
        "portuguese": "Trinta (número 30)"
      }),
      makeCard(103, 7, {
        "type": "phrase",
        "english": "It is two twenty.",
        "portuguese": "São duas e vinte."
      }),
      makeCard(103, 8, {
        "type": "phrase",
        "english": "The meeting is at ten thirty.",
        "portuguese": "A reunião é às dez e trinta."
      }),
      makeCard(103, 9, {
        "type": "phrase",
        "english": "There are twenty students in the room.",
        "portuguese": "Há vinte estudantes na sala."
      }),
      makeCard(103, 10, {
        "type": "phrase",
        "english": "She has thirteen books.",
        "portuguese": "Ela tem treze livros."
      }),
      makeCard(103, 11, {
        "type": "phrase",
        "english": "We eat dinner at eight thirty.",
        "portuguese": "Nós jantamos às oito e trinta."
      }),
      makeCard(103, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Leitura Digital das Horas: Paralelamente às formas com *past* e *to*, o inglês contemporâneo utiliza intensamente o formato digital direto: diz-se o número da hora seguido imediatamente pelos minutos (*7:15 = seven fifteen*, *8:30 = eight thirty*, *2:20 = two twenty*). Ambas as modalidades são naturais e corretas.",
        "grammarRule": {
          "title": "Gramática — Lição 103",
          "explanation": "Leitura Digital das Horas: Paralelamente às formas com *past* e *to*, o inglês contemporâneo utiliza intensamente o formato digital direto: diz-se o número da hora seguido imediatamente pelos minutos (*7:15 = seven fifteen*, *8:30 = eight thirty*, *2:20 = two twenty*). Ambas as modalidades são naturais e corretas.",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 104,
    weekNumber: 15,
    blockNumber: 11,
    cefrLevel: 'A1',
    title: "Lição 104 — Preposições de Tempo: \"At\", \"On\" e \"In\" *(2 palavras novas)*",
    subtitle: "Novas: **Hour** (substantivo hora de duração/relógio), **Minute** (substantivo minuto de tempo).",
    grammarFocus: "O Triângulo das Preposições de Tempo (*At, On, In*):",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(104, 1, {
        "type": "word",
        "english": "Hour",
        "portuguese": "Hora (plural: *hours*)"
      }),
      makeCard(104, 2, {
        "type": "word",
        "english": "Minute",
        "portuguese": "Minuto (plural: *minutes*)"
      }),
      makeCard(104, 3, {
        "type": "phrase",
        "english": "The meeting is in one hour.",
        "portuguese": "A reunião é em uma hora."
      }),
      makeCard(104, 4, {
        "type": "phrase",
        "english": "We have thirty minutes.",
        "portuguese": "Nós temos trinta minutos."
      }),
      makeCard(104, 5, {
        "type": "phrase",
        "english": "I wake up at six o'clock.",
        "portuguese": "Eu acordo às seis horas em ponto."
      }),
      makeCard(104, 6, {
        "type": "phrase",
        "english": "She works on Monday.",
        "portuguese": "Ela trabalha na segunda-feira."
      }),
      makeCard(104, 7, {
        "type": "phrase",
        "english": "He studies in the afternoon.",
        "portuguese": "Ele estuda à tarde."
      }),
      makeCard(104, 8, {
        "type": "phrase",
        "english": "We eat dinner at eight at night.",
        "portuguese": "Nós jantamos às oito da noite."
      }),
      makeCard(104, 9, {
        "type": "phrase",
        "english": "The doctor arrives in fifteen minutes.",
        "portuguese": "O médico chega em quinze minutos."
      }),
      makeCard(104, 10, {
        "type": "phrase",
        "english": "They rest on the weekend.",
        "portuguese": "Eles descansam no fim de semana."
      }),
      makeCard(104, 11, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "O Triângulo das Preposições de Tempo (*At, On, In*):",
        "grammarRule": {
          "title": "Gramática — Lição 104",
          "explanation": "O Triângulo das Preposições de Tempo (*At, On, In*):",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 105,
    weekNumber: 15,
    blockNumber: 11,
    cefrLevel: 'A1',
    title: "Lição 105 — Marcadores de Sequência e Rotina *(3 palavras novas)*",
    subtitle: "Novas: **After** (preposição depois de/após), **Finish** (verbo terminar/encerrar), **Then** (advérbio então/em seguida).",
    grammarFocus: "Marcadores Temporais de Sequência: **After** introduz açõ...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(105, 1, {
        "type": "word",
        "english": "After",
        "portuguese": "Depois de, após"
      }),
      makeCard(105, 2, {
        "type": "word",
        "english": "Finish",
        "portuguese": "Terminar, finalizar, encerrar"
      }),
      makeCard(105, 3, {
        "type": "phrase",
        "english": "After breakfast, I go to work.",
        "portuguese": "Depois do café da manhã, eu vou para o trabalho."
      }),
      makeCard(105, 4, {
        "type": "phrase",
        "english": "We finish work at five o'clock.",
        "portuguese": "Nós terminamos o trabalho às cinco horas."
      }),
      makeCard(105, 5, {
        "type": "word",
        "english": "Then",
        "portuguese": "Então, depois, em seguida"
      }),
      makeCard(105, 6, {
        "type": "phrase",
        "english": "I wake up early, and then I drink coffee.",
        "portuguese": "Eu acordo cedo e, em seguida, bebo café."
      }),
      makeCard(105, 7, {
        "type": "phrase",
        "english": "She finishes her class at noon.",
        "portuguese": "Ela termina a aula dela ao meio-dia."
      }),
      makeCard(105, 8, {
        "type": "phrase",
        "english": "After lunch, he reads a book.",
        "portuguese": "Depois do almoço, ele lê um livro."
      }),
      makeCard(105, 9, {
        "type": "phrase",
        "english": "We study, and then we walk in the park.",
        "portuguese": "Nós estudamos e, depois, caminhamos no parque."
      }),
      makeCard(105, 10, {
        "type": "phrase",
        "english": "He finishes his job and goes home.",
        "portuguese": "Ele termina o trabalho dele e vai para casa."
      }),
      makeCard(105, 11, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Marcadores Temporais de Sequência: **After** introduz ações antecedentes (*After lunch* = após o almoço). **Then** encadeia ações cronológicas sucessivas (*I study, and then I rest*). O verbo **finish** termina em *-sh*, flexionando para **finishes** na 3ª pessoa afirmativa (*he finishes, she finishes*).",
        "grammarRule": {
          "title": "Gramática — Lição 105",
          "explanation": "Marcadores Temporais de Sequência: **After** introduz ações antecedentes (*After lunch* = após o almoço). **Then** encadeia ações cronológicas sucessivas (*I study, and then I rest*). O verbo **finish** termina em *-sh*, flexionando para **finishes** na 3ª pessoa afirmativa (*he finishes, she finishes*).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 106,
    weekNumber: 16,
    blockNumber: 11,
    cefrLevel: 'A1',
    title: "Lição 106 — Revisão: Transporte Coletivo *(4 palavras novas)*",
    subtitle: "Novas: **Train** (substantivo trem), **Station** (substantivo estação), **Subway** (substantivo metrô), **Take** (verbo tomar/pegar transporte ou levar tempo).",
    grammarFocus: "O verbo **take** possui dois usos centrais em mobilidade:...",
    isDialogueDay: false,
    isReviewLesson: true,
    cards: [
      makeCard(106, 1, {
        "type": "word",
        "english": "Train",
        "portuguese": "Trem"
      }),
      makeCard(106, 2, {
        "type": "word",
        "english": "Station",
        "portuguese": "Estação"
      }),
      makeCard(106, 3, {
        "type": "phrase",
        "english": "The train is at the station.",
        "portuguese": "O trem está na estação."
      }),
      makeCard(106, 4, {
        "type": "phrase",
        "english": "Where is the train station?",
        "portuguese": "Onde fica a estação de trem?"
      }),
      makeCard(106, 5, {
        "type": "word",
        "english": "Subway",
        "portuguese": "Metrô"
      }),
      makeCard(106, 6, {
        "type": "word",
        "english": "Take",
        "portuguese": "Pegar, tomar (transporte) / Levar (tempo)"
      }),
      makeCard(106, 7, {
        "type": "phrase",
        "english": "Do you take the subway to work?",
        "portuguese": "Você pega o metrô para o trabalho?"
      }),
      makeCard(106, 8, {
        "type": "phrase",
        "english": "Yes, I take the subway every day.",
        "portuguese": "Sim, eu pego o metrô todos os dias."
      }),
      makeCard(106, 9, {
        "type": "phrase",
        "english": "She takes the bus at the station.",
        "portuguese": "Ela pega o ônibus na estação."
      }),
      makeCard(106, 10, {
        "type": "phrase",
        "english": "We take the train at eight fifteen.",
        "portuguese": "Nós pegamos o trem às oito e quinze."
      }),
      makeCard(106, 11, {
        "type": "phrase",
        "english": "He doesn't take the car; he takes the train.",
        "portuguese": "Ele não pega o carro; ele pega o trem."
      }),
      makeCard(106, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "O verbo **take** possui dois usos centrais em mobilidade: 1) pegar ou utilizar condução coletiva (*take the bus, take the train, take the subway*); 2) indicar tempo de duração (*The trip takes ten minutes* = A viagem leva dez minutos). Na 3ª pessoa afirmativa: *he takes, she takes*.",
        "grammarRule": {
          "title": "Gramática — Lição 106",
          "explanation": "O verbo **take** possui dois usos centrais em mobilidade: 1) pegar ou utilizar condução coletiva (*take the bus, take the train, take the subway*); 2) indicar tempo de duração (*The trip takes ten minutes* = A viagem leva dez minutos). Na 3ª pessoa afirmativa: *he takes, she takes*.",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 107,
    weekNumber: 16,
    blockNumber: 11,
    cefrLevel: 'A1',
    title: "Lição 107 — Transporte Individual e a Preposição \"By\" *(3 palavras novas)*",
    subtitle: "Novas: **Bike** (substantivo bicicleta), **Ride** (verbo pedalar/andar de), **By** (preposição de meio de transporte). Expressão fixa: **On foot** (a pé).",
    grammarFocus: "Meios de Transporte com **By** vs. **On foot**: Em inglês...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(107, 1, {
        "type": "word",
        "english": "Bike",
        "portuguese": "Bicicleta, bike"
      }),
      makeCard(107, 2, {
        "type": "word",
        "english": "Ride",
        "portuguese": "Andar de (bicicleta), pedalar"
      }),
      makeCard(107, 3, {
        "type": "phrase",
        "english": "I ride my bike to school.",
        "portuguese": "Eu ando de bicicleta para a escola."
      }),
      makeCard(107, 4, {
        "type": "phrase",
        "english": "He rides his bike in the park.",
        "portuguese": "Ele anda de bicicleta no parque."
      }),
      makeCard(107, 5, {
        "type": "word",
        "english": "By",
        "portuguese": "De, por (preposição de meio de transporte)"
      }),
      makeCard(107, 6, {
        "type": "phrase",
        "english": "She goes to work by car.",
        "portuguese": "Ela vai para o trabalho de carro."
      }),
      makeCard(107, 7, {
        "type": "phrase",
        "english": "We travel by train.",
        "portuguese": "Nós viajamos de trem."
      }),
      makeCard(107, 8, {
        "type": "phrase",
        "english": "Do you go by bus or by subway?",
        "portuguese": "Você vai de ônibus ou de metrô?"
      }),
      makeCard(107, 9, {
        "type": "phrase",
        "english": "I go on foot.",
        "portuguese": "Eu vou a pé."
      }),
      makeCard(107, 10, {
        "type": "phrase",
        "english": "Do you go to the gym on foot?",
        "portuguese": "Você vai para a academia a pé?"
      }),
      makeCard(107, 11, {
        "type": "phrase",
        "english": "Yes, I do. It is near my house.",
        "portuguese": "Sim, vou. Fica perto da minha casa."
      }),
      makeCard(107, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Meios de Transporte com **By** vs. **On foot**: Em inglês, utilizamos a preposição **by** diretamente antes de veículos de transporte sem artigo (*by car, by bus, by train, by subway, by bike*). A grande e fundamental exceção é deslocamento a pé, onde a norma culta exige exclusivamente a expressão **on foot** (*I go on foot*, nunca *by foot*).",
        "grammarRule": {
          "title": "Gramática — Lição 107",
          "explanation": "Meios de Transporte com **By** vs. **On foot**: Em inglês, utilizamos a preposição **by** diretamente antes de veículos de transporte sem artigo (*by car, by bus, by train, by subway, by bike*). A grande e fundamental exceção é deslocamento a pé, onde a norma culta exige exclusivamente a expressão **on foot** (*I go on foot*, nunca *by foot*).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 108,
    weekNumber: 16,
    blockNumber: 11,
    cefrLevel: 'A1',
    title: "Lição 108 — Deslocamento e Movimento: \"Leave\" e \"Arrive\" *(3 palavras novas)*",
    subtitle: "Novas: **Leave** (verbo sair de/partir de), **Arrive** (verbo chegar), **Trip** (substantivo viagem/trajeto).",
    grammarFocus: "Dinâmica de Deslocamento: **leave** marca a saída de um l...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(108, 1, {
        "type": "word",
        "english": "Leave",
        "portuguese": "Sair de, partir de, deixar"
      }),
      makeCard(108, 2, {
        "type": "word",
        "english": "Arrive",
        "portuguese": "Chegar"
      }),
      makeCard(108, 3, {
        "type": "phrase",
        "english": "I leave home at seven thirty.",
        "portuguese": "Eu saio de casa às sete e trinta."
      }),
      makeCard(108, 4, {
        "type": "phrase",
        "english": "She arrives at work at eight o'clock.",
        "portuguese": "Ela chega ao trabalho às oito horas em ponto."
      }),
      makeCard(108, 5, {
        "type": "word",
        "english": "Trip",
        "portuguese": "Viagem, trajeto"
      }),
      makeCard(108, 6, {
        "type": "phrase",
        "english": "The trip is thirty minutes.",
        "portuguese": "O trajeto é de trinta minutos."
      }),
      makeCard(108, 7, {
        "type": "phrase",
        "english": "What time do you leave home?",
        "portuguese": "A que horas você sai de casa?"
      }),
      makeCard(108, 8, {
        "type": "phrase",
        "english": "When does the train arrive?",
        "portuguese": "Quando o trem chega?"
      }),
      makeCard(108, 9, {
        "type": "phrase",
        "english": "The train arrives at nine o'clock.",
        "portuguese": "O trem chega às nove horas."
      }),
      makeCard(108, 10, {
        "type": "phrase",
        "english": "He leaves the office at six in the evening.",
        "portuguese": "Ele sai do escritório às seis da tarde."
      }),
      makeCard(108, 11, {
        "type": "phrase",
        "english": "We arrive at the airport on time.",
        "portuguese": "Nós chegamos ao aeroporto a tempo."
      }),
      makeCard(108, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Dinâmica de Deslocamento: **leave** marca a saída de um local de partida (*leave home, leave the office*). **Arrive** indica o alcance de um destino, regendo a preposição **at** para locais específicos e prédios (*arrive at work, arrive at the station, arrive at the airport*). Na 3ª pessoa afirmativa: *he leaves*, *she arrives*.",
        "grammarRule": {
          "title": "Gramática — Lição 108",
          "explanation": "Dinâmica de Deslocamento: **leave** marca a saída de um local de partida (*leave home, leave the office*). **Arrive** indica o alcance de um destino, regendo a preposição **at** para locais específicos e prédios (*arrive at work, arrive at the station, arrive at the airport*). Na 3ª pessoa afirmativa: *he leaves*, *she arrives*.",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 109,
    weekNumber: 16,
    blockNumber: 11,
    cefrLevel: 'A1',
    title: "Lição 109 — Revisão: Trânsito, Velocidade e Distância *(4 palavras novas)*",
    subtitle: "Novas: **Traffic** (substantivo trânsito/tráfego), **Fast** (adjetivo rápido/veloz), **Slow** (adjetivo lento/devagar), **Far** (advérbio/adjetivo longe/distante).",
    grammarFocus: "Opostos de Mobilidade e Distância: **Fast** (rápido) $\\le...",
    isDialogueDay: false,
    isReviewLesson: true,
    cards: [
      makeCard(109, 1, {
        "type": "word",
        "english": "Traffic",
        "portuguese": "Trânsito, tráfego"
      }),
      makeCard(109, 2, {
        "type": "word",
        "english": "Fast",
        "portuguese": "Rápido, veloz"
      }),
      makeCard(109, 3, {
        "type": "phrase",
        "english": "The subway is fast.",
        "portuguese": "O metrô é rápido."
      }),
      makeCard(109, 4, {
        "type": "phrase",
        "english": "There is traffic in the morning.",
        "portuguese": "Há trânsito de manhã."
      }),
      makeCard(109, 5, {
        "type": "word",
        "english": "Slow",
        "portuguese": "Lento, devagar"
      }),
      makeCard(109, 6, {
        "type": "word",
        "english": "Far",
        "portuguese": "Longe, distante"
      }),
      makeCard(109, 7, {
        "type": "phrase",
        "english": "The bus is slow because there is traffic.",
        "portuguese": "O ônibus é lento porque há trânsito."
      }),
      makeCard(109, 8, {
        "type": "phrase",
        "english": "My office is far from my house.",
        "portuguese": "Meu escritório fica longe da minha casa."
      }),
      makeCard(109, 9, {
        "type": "phrase",
        "english": "Is the station far from here?",
        "portuguese": "A estação fica longe daqui?"
      }),
      makeCard(109, 10, {
        "type": "phrase",
        "english": "No, it is not far. It is very near.",
        "portuguese": "Não, não fica longe. Fica muito perto."
      }),
      makeCard(109, 11, {
        "type": "phrase",
        "english": "He drives fast, but there is traffic.",
        "portuguese": "Ele dirige rápido, mas há trânsito."
      }),
      makeCard(109, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Opostos de Mobilidade e Distância: **Fast** (rápido) $\\leftrightarrow$ **Slow** (lento); **Far** (longe) $\\leftrightarrow$ **Near** (perto). Atenção à preposição: dizemos *far from* (longe de) e *near* (perto de, sem necessidade de *from* ou *of*).",
        "grammarRule": {
          "title": "Gramática — Lição 109",
          "explanation": "Opostos de Mobilidade e Distância: **Fast** (rápido) $\\leftrightarrow$ **Slow** (lento); **Far** (longe) $\\leftrightarrow$ **Near** (perto). Atenção à preposição: dizemos *far from* (longe de) e *near* (perto de, sem necessidade de *from* ou *of*).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 110,
    weekNumber: 16,
    blockNumber: 11,
    cefrLevel: 'A1',
    title: "Lição 110 — Fechamento do Bloco 11: Relato 4 — Meu Deslocamento Diário e Rotina de Transporte",
    subtitle: "Lição 110 do nível A1",
    grammarFocus: "Fechamento do Bloco 11: Relato 4 — Meu Deslocamento Diário e Rotina de Transporte",
    isDialogueDay: true,
    isReviewLesson: false,
    cards: [
      makeCard(110, 1, {
        "type": "phrase",
        "english": "My name is Tiago, and I live in a big city.",
        "portuguese": "Meu nome é Tiago, e eu moro em uma cidade grande."
      }),
      makeCard(110, 2, {
        "type": "phrase",
        "english": "From Monday to Friday, I wake up at six o'clock in the morning.",
        "portuguese": "De segunda a sexta-feira, eu acordo às seis horas da manhã."
      }),
      makeCard(110, 3, {
        "type": "phrase",
        "english": "I eat breakfast with my wife, and then I leave home at seven o'clock.",
        "portuguese": "Eu tomo café da manhã com a minha esposa, e depois saio de casa às sete horas."
      }),
      makeCard(110, 4, {
        "type": "phrase",
        "english": "My office is far from my apartment.",
        "portuguese": "Meu escritório fica longe do meu apartamento."
      }),
      makeCard(110, 5, {
        "type": "phrase",
        "english": "I don't go to work by car because there is traffic every morning.",
        "portuguese": "Eu não vou para o trabalho de carro porque há trânsito todas as manhãs."
      }),
      makeCard(110, 6, {
        "type": "phrase",
        "english": "I walk on foot for fifteen minutes to the train station.",
        "portuguese": "Eu caminho a pé por quinze minutos até a estação de trem."
      }),
      makeCard(110, 7, {
        "type": "phrase",
        "english": "At seven twenty, I take the train.",
        "portuguese": "Às sete e vinte, eu pego o trem."
      }),
      makeCard(110, 8, {
        "type": "phrase",
        "english": "The train is fast and clean.",
        "portuguese": "O trem é rápido e limpo."
      }),
      makeCard(110, 9, {
        "type": "phrase",
        "english": "At half past seven, I arrive at the station near the park.",
        "portuguese": "Às sete e meia, eu chego à estação perto do parque."
      }),
      makeCard(110, 10, {
        "type": "phrase",
        "english": "Then, I take the subway to my office.",
        "portuguese": "Depois, eu pego o metrô para o meu escritório."
      }),
      makeCard(110, 11, {
        "type": "phrase",
        "english": "The trip by subway takes ten minutes.",
        "portuguese": "O trajeto de metrô leva dez minutos."
      }),
      makeCard(110, 12, {
        "type": "phrase",
        "english": "I arrive at work at a quarter to eight.",
        "portuguese": "Eu chego ao trabalho às quinze para as oito."
      }),
      makeCard(110, 13, {
        "type": "phrase",
        "english": "I start my job at eight o'clock on time.",
        "portuguese": "Eu começo o meu trabalho às oito horas em ponto."
      }),
      makeCard(110, 14, {
        "type": "phrase",
        "english": "In the evening, I finish work at five o'clock and go home.",
        "portuguese": "No final da tarde, eu termino o trabalho às cinco horas e vou para casa."
      }),
      makeCard(110, 15, {
        "type": "phrase",
        "english": "I love my job, but I love my home and my family, too.",
        "portuguese": "Eu amo o meu trabalho, mas amo a minha casa e a minha família também."
      })
    ]
  },
  {
    dayNumber: 111,
    weekNumber: 16,
    blockNumber: 12,
    cefrLevel: 'A1',
    title: "Lição 111 — O Verbo Modal \"Can\" (Habilidade e Capacidade) *(3 palavras novas)*",
    subtitle: "Novas: **Can** (verbo modal poder/saber/conseguir), **Sing** (verbo cantar), **Dance** (verbo dançar).",
    grammarFocus: "O Verbo Modal **Can**: É um dos verbos mais fundamentais ...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(111, 1, {
        "type": "word",
        "english": "Can",
        "portuguese": "Poder, conseguir, saber (verbo modal invariável)"
      }),
      makeCard(111, 2, {
        "type": "word",
        "english": "Sing",
        "portuguese": "Cantar"
      }),
      makeCard(111, 3, {
        "type": "phrase",
        "english": "I can sing.",
        "portuguese": "Eu sei cantar. / Eu posso cantar."
      }),
      makeCard(111, 4, {
        "type": "phrase",
        "english": "He can sing very well.",
        "portuguese": "Ele sabe cantar muito bem."
      }),
      makeCard(111, 5, {
        "type": "word",
        "english": "Dance",
        "portuguese": "Dançar"
      }),
      makeCard(111, 6, {
        "type": "phrase",
        "english": "She can dance.",
        "portuguese": "Ela sabe dançar."
      }),
      makeCard(111, 7, {
        "type": "phrase",
        "english": "They can sing and dance.",
        "portuguese": "Eles sabem cantar e dançar."
      }),
      makeCard(111, 8, {
        "type": "phrase",
        "english": "I can speak English and Portuguese.",
        "portuguese": "Eu sei falar inglês e português."
      }),
      makeCard(111, 9, {
        "type": "phrase",
        "english": "My sister can play the guitar.",
        "portuguese": "Minha irmã sabe tocar violão."
      }),
      makeCard(111, 10, {
        "type": "phrase",
        "english": "He can drive a car.",
        "portuguese": "Ele sabe dirigir carro."
      }),
      makeCard(111, 11, {
        "type": "phrase",
        "english": "We can work together.",
        "portuguese": "Nós podemos trabalhar juntos."
      }),
      makeCard(111, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "O Verbo Modal **Can**: É um dos verbos mais fundamentais do inglês. Expressa capacidade, habilidade (*saber fazer algo*) ou possibilidade/permissão (*poder*). Duas regras essenciais:",
        "grammarRule": {
          "title": "Gramática — Lição 111",
          "explanation": "O Verbo Modal **Can**: É um dos verbos mais fundamentais do inglês. Expressa capacidade, habilidade (*saber fazer algo*) ou possibilidade/permissão (*poder*). Duas regras essenciais:",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 112,
    weekNumber: 16,
    blockNumber: 12,
    cefrLevel: 'A1',
    title: "Lição 112 — Negação com \"Can't\" (Incapacidade e Impossibilidade) *(2 palavras novas)*",
    subtitle: "Novas: **Can't** (verbo modal negativo não poder/não saber/não conseguir), **Hear** (verbo ouvir/escutar).",
    grammarFocus: "Negação com **Can't**: É a contração de *cannot*. Aplica-...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(112, 1, {
        "type": "word",
        "english": "Can't",
        "portuguese": "Não poder, não conseguir, não saber (contração de *cannot*)"
      }),
      makeCard(112, 2, {
        "type": "word",
        "english": "Hear",
        "portuguese": "Ouvir, escutar"
      }),
      makeCard(112, 3, {
        "type": "phrase",
        "english": "I can't hear you.",
        "portuguese": "Eu não consigo ouvir você. / Eu não estou ouvindo você."
      }),
      makeCard(112, 4, {
        "type": "phrase",
        "english": "She can't hear the music.",
        "portuguese": "Ela não consegue ouvir a música."
      }),
      makeCard(112, 5, {
        "type": "phrase",
        "english": "He can't drive a car.",
        "portuguese": "Ele não sabe dirigir carro."
      }),
      makeCard(112, 6, {
        "type": "phrase",
        "english": "My brother can't swim in the pool.",
        "portuguese": "Meu irmão não sabe nadar na piscina."
      }),
      makeCard(112, 7, {
        "type": "phrase",
        "english": "We can't see the hotel from here.",
        "portuguese": "Nós não conseguimos ver o hotel daqui."
      }),
      makeCard(112, 8, {
        "type": "phrase",
        "english": "I can't speak French.",
        "portuguese": "Eu não sei falar francês."
      }),
      makeCard(112, 9, {
        "type": "phrase",
        "english": "She can't work today because she is tired.",
        "portuguese": "Ela não pode trabalhar hoje porque está cansada."
      }),
      makeCard(112, 10, {
        "type": "phrase",
        "english": "They can't travel on Monday.",
        "portuguese": "Eles não podem viajar na segunda-feira."
      }),
      makeCard(112, 11, {
        "type": "phrase",
        "english": "The cat can't sleep in the bedroom.",
        "portuguese": "O gato não pode dormir no quarto."
      }),
      makeCard(112, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Negação com **Can't**: É a contração de *cannot*. Aplica-se identicamente a todos os sujeitos (*I can't, he can't, we can't*). Assim como na forma afirmativa, o verbo principal seguinte permanece na sua forma base sem *to* (*She can't swim*).",
        "grammarRule": {
          "title": "Gramática — Lição 112",
          "explanation": "Negação com **Can't**: É a contração de *cannot*. Aplica-se identicamente a todos os sujeitos (*I can't, he can't, we can't*). Assim como na forma afirmativa, o verbo principal seguinte permanece na sua forma base sem *to* (*She can't swim*).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 113,
    weekNumber: 17,
    blockNumber: 12,
    cefrLevel: 'A1',
    title: "Lição 113 — Revisão: Perguntas com \"Can\", Pedidos e Cortesia *(2 palavras novas)*",
    subtitle: "Novas: **Repeat** (verbo repetir), **Slowly** (advérbio devagar/lentamente).",
    grammarFocus: "Perguntas com **Can**: Formulamos perguntas invertendo o ...",
    isDialogueDay: false,
    isReviewLesson: true,
    cards: [
      makeCard(113, 1, {
        "type": "word",
        "english": "Repeat",
        "portuguese": "Repetir"
      }),
      makeCard(113, 2, {
        "type": "word",
        "english": "Slowly",
        "portuguese": "Devagar, lentamente"
      }),
      makeCard(113, 3, {
        "type": "phrase",
        "english": "Can you repeat, please?",
        "portuguese": "Você pode repetir, por favor?"
      }),
      makeCard(113, 4, {
        "type": "phrase",
        "english": "Can you speak slowly?",
        "portuguese": "Você pode falar devagar?"
      }),
      makeCard(113, 5, {
        "type": "phrase",
        "english": "Can you help me?",
        "portuguese": "Você pode me ajudar?"
      }),
      makeCard(113, 6, {
        "type": "phrase",
        "english": "Yes, I can.",
        "portuguese": "Sim, posso."
      }),
      makeCard(113, 7, {
        "type": "phrase",
        "english": "No, I can't.",
        "portuguese": "Não, não posso."
      }),
      makeCard(113, 8, {
        "type": "phrase",
        "english": "Can he cook?",
        "portuguese": "Ele sabe cozinhar?"
      }),
      makeCard(113, 9, {
        "type": "phrase",
        "english": "Yes, he can. He cooks delicious food.",
        "portuguese": "Sim, sabe. Ele cozinha comida deliciosa."
      }),
      makeCard(113, 10, {
        "type": "phrase",
        "english": "Can she play tennis?",
        "portuguese": "Ela sabe jogar tênis?"
      }),
      makeCard(113, 11, {
        "type": "phrase",
        "english": "No, she can't, but she can swim.",
        "portuguese": "Não, não sabe, mas sabe nadar."
      }),
      makeCard(113, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Perguntas com **Can**: Formulamos perguntas invertendo o modal com o sujeito: **Can + Sujeito + Verbo Base** (*Can you help me?*). Em respostas curtas (*Short Answers*): afirmativa: **Yes, I can** / **Yes, he can**; negativa: **No, I can't** / **No, he can't**. O modal *can* é amplamente usado para pedidos cordiais de auxílio no cotidiano.",
        "grammarRule": {
          "title": "Gramática — Lição 113",
          "explanation": "Perguntas com **Can**: Formulamos perguntas invertendo o modal com o sujeito: **Can + Sujeito + Verbo Base** (*Can you help me?*). Em respostas curtas (*Short Answers*): afirmativa: **Yes, I can** / **Yes, he can**; negativa: **No, I can't** / **No, he can't**. O modal *can* é amplamente usado para pedidos cordiais de auxílio no cotidiano.",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 114,
    weekNumber: 17,
    blockNumber: 12,
    cefrLevel: 'A1',
    title: "Lição 114 — O Tempo e o Clima *(4 palavras novas)*",
    subtitle: "Novas: **Weather** (substantivo tempo/clima), **Sunny** (adjetivo ensolarado), **Rain** (substantivo/verbo chuva/chover), **Rainy** (adjetivo chuvoso).",
    grammarFocus: "Falando sobre o Clima: Para perguntar sobre as condições ...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(114, 1, {
        "type": "word",
        "english": "Weather",
        "portuguese": "Tempo, clima"
      }),
      makeCard(114, 2, {
        "type": "word",
        "english": "Sunny",
        "portuguese": "Ensolarado"
      }),
      makeCard(114, 3, {
        "type": "phrase",
        "english": "How is the weather today?",
        "portuguese": "Como está o tempo hoje?"
      }),
      makeCard(114, 4, {
        "type": "phrase",
        "english": "The weather is sunny.",
        "portuguese": "O tempo está ensolarado."
      }),
      makeCard(114, 5, {
        "type": "word",
        "english": "Rain",
        "portuguese": "Chuva (substantivo), chover (verbo)"
      }),
      makeCard(114, 6, {
        "type": "word",
        "english": "Rainy",
        "portuguese": "Chuvoso"
      }),
      makeCard(114, 7, {
        "type": "phrase",
        "english": "It is rainy today.",
        "portuguese": "Está chuvoso hoje."
      }),
      makeCard(114, 8, {
        "type": "phrase",
        "english": "I don't like rain.",
        "portuguese": "Eu não gosto de chuva."
      }),
      makeCard(114, 9, {
        "type": "phrase",
        "english": "Does it rain in this city?",
        "portuguese": "Chove nesta cidade?"
      }),
      makeCard(114, 10, {
        "type": "phrase",
        "english": "Yes, it rains on Saturday and Sunday.",
        "portuguese": "Sim, chove no sábado e no domingo."
      }),
      makeCard(114, 11, {
        "type": "phrase",
        "english": "The weather is sunny and nice.",
        "portuguese": "O tempo está ensolarado e agradável."
      }),
      makeCard(114, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Falando sobre o Clima: Para perguntar sobre as condições climáticas, usamos a pergunta padrão **How is the weather?**. Para responder, empregamos o pronome impessoal **It is** seguido do adjetivo de clima (*It is sunny*, *It is rainy*). A palavra **rain** pode funcionar tanto como substantivo (*cold rain*) quanto como verbo de ação impessoal (*it rains*).",
        "grammarRule": {
          "title": "Gramática — Lição 114",
          "explanation": "Falando sobre o Clima: Para perguntar sobre as condições climáticas, usamos a pergunta padrão **How is the weather?**. Para responder, empregamos o pronome impessoal **It is** seguido do adjetivo de clima (*It is sunny*, *It is rainy*). A palavra **rain** pode funcionar tanto como substantivo (*cold rain*) quanto como verbo de ação impessoal (*it rains*).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 115,
    weekNumber: 17,
    blockNumber: 12,
    cefrLevel: 'A1',
    title: "Lição 115 — Temperaturas e Sensações Térmicas *(4 palavras novas)*",
    subtitle: "Novas: **Hot** (adjetivo quente), **Warm** (adjetivo agradável/ameno/morno), **Cool** (adjetivo fresco), **Temperature** (substantivo temperatura).",
    grammarFocus: "Escala de Temperaturas:",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(115, 1, {
        "type": "word",
        "english": "Hot",
        "portuguese": "Quente"
      }),
      makeCard(115, 2, {
        "type": "word",
        "english": "Warm",
        "portuguese": "Agradável, ameno, morno"
      }),
      makeCard(115, 3, {
        "type": "phrase",
        "english": "It is very hot today.",
        "portuguese": "Está muito quente hoje."
      }),
      makeCard(115, 4, {
        "type": "phrase",
        "english": "The weather is warm and sunny.",
        "portuguese": "O tempo está agradável e ensolarado."
      }),
      makeCard(115, 5, {
        "type": "word",
        "english": "Cool",
        "portuguese": "Fresco"
      }),
      makeCard(115, 6, {
        "type": "word",
        "english": "Temperature",
        "portuguese": "Temperatura"
      }),
      makeCard(115, 7, {
        "type": "phrase",
        "english": "The temperature is good.",
        "portuguese": "A temperatura está boa."
      }),
      makeCard(115, 8, {
        "type": "phrase",
        "english": "It is cool in the evening.",
        "portuguese": "Fica fresco no final da tarde."
      }),
      makeCard(115, 9, {
        "type": "phrase",
        "english": "In the afternoon, it is hot.",
        "portuguese": "À tarde, é quente."
      }),
      makeCard(115, 10, {
        "type": "phrase",
        "english": "The water in the pool is cool.",
        "portuguese": "A água na piscina está fresca."
      }),
      makeCard(115, 11, {
        "type": "phrase",
        "english": "I drink hot coffee when it is cold.",
        "portuguese": "Eu bebo café quente quando está frio."
      }),
      makeCard(115, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Escala de Temperaturas:",
        "grammarRule": {
          "title": "Gramática — Lição 115",
          "explanation": "Escala de Temperaturas:",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 116,
    weekNumber: 17,
    blockNumber: 12,
    cefrLevel: 'A1',
    title: "Lição 116 — Revisão: Fenômenos Climáticos e o Ar Livre *(4 palavras novas)*",
    subtitle: "Novas: **Cloudy** (adjetivo nublado), **Windy** (adjetivo com vento/ventoso), **Snow** (substantivo/verbo neve/nevar), **Outside** (advérbio lá fora/ao ar livre).",
    grammarFocus: "Sufixo **-y** em Clima: Muitos adjetivos descritivos de t...",
    isDialogueDay: false,
    isReviewLesson: true,
    cards: [
      makeCard(116, 1, {
        "type": "word",
        "english": "Cloudy",
        "portuguese": "Nublado"
      }),
      makeCard(116, 2, {
        "type": "word",
        "english": "Windy",
        "portuguese": "Com vento, ventoso"
      }),
      makeCard(116, 3, {
        "type": "phrase",
        "english": "It is cloudy today.",
        "portuguese": "Está nublado hoje."
      }),
      makeCard(116, 4, {
        "type": "phrase",
        "english": "It is cold and windy outside.",
        "portuguese": "Está frio e com vento lá fora."
      }),
      makeCard(116, 5, {
        "type": "word",
        "english": "Snow",
        "portuguese": "Neve (substantivo), nevar (verbo)"
      }),
      makeCard(116, 6, {
        "type": "word",
        "english": "Outside",
        "portuguese": "Lá fora, do lado de fora, ao ar livre"
      }),
      makeCard(116, 7, {
        "type": "phrase",
        "english": "It doesn't snow in Brazil.",
        "portuguese": "Não neva no Brasil."
      }),
      makeCard(116, 8, {
        "type": "phrase",
        "english": "Does it snow in Canada in the winter?",
        "portuguese": "Neva no Canadá no inverno?"
      }),
      makeCard(116, 9, {
        "type": "phrase",
        "english": "The children play outside.",
        "portuguese": "As crianças brincam lá fora."
      }),
      makeCard(116, 10, {
        "type": "phrase",
        "english": "We can't walk outside because it is rainy.",
        "portuguese": "Nós não podemos caminhar lá fora porque está chuvoso."
      }),
      makeCard(116, 11, {
        "type": "phrase",
        "english": "How is the weather outside?",
        "portuguese": "Como está o tempo lá fora?"
      }),
      makeCard(116, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Sufixo **-y** em Clima: Muitos adjetivos descritivos de tempo formam-se acrescentando *-y* ao substantivo (*sun $\\rightarrow$ sunny*, *rain $\\rightarrow$ rainy*, *cloud $\\rightarrow$ cloudy*, *wind $\\rightarrow$ windy*). O advérbio **outside** posiciona-se ao final da oração para indicar localização ao ar livre (*play outside, cold outside*).",
        "grammarRule": {
          "title": "Gramática — Lição 116",
          "explanation": "Sufixo **-y** em Clima: Muitos adjetivos descritivos de tempo formam-se acrescentando *-y* ao substantivo (*sun $\\rightarrow$ sunny*, *rain $\\rightarrow$ rainy*, *cloud $\\rightarrow$ cloudy*, *wind $\\rightarrow$ windy*). O advérbio **outside** posiciona-se ao final da oração para indicar localização ao ar livre (*play outside, cold outside*).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 117,
    weekNumber: 17,
    blockNumber: 12,
    cefrLevel: 'A1',
    title: "Lição 117 — As Estações do Ano (Parte 1: Verão e Inverno) *(4 palavras novas)*",
    subtitle: "Novas: **Season** (substantivo estação do ano), **Favorite** (adjetivo favorito/preferido), **Summer** (substantivo verão), **Winter** (substantivo inverno).",
    grammarFocus: "Estações do Ano e a Preposição **In**: Para expressar oco...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(117, 1, {
        "type": "word",
        "english": "Season",
        "portuguese": "Estação do ano (plural: *seasons*)"
      }),
      makeCard(117, 2, {
        "type": "word",
        "english": "Favorite",
        "portuguese": "Favorito, favorita, preferido"
      }),
      makeCard(117, 3, {
        "type": "phrase",
        "english": "What is your favorite season?",
        "portuguese": "Qual é a sua estação favorita?"
      }),
      makeCard(117, 4, {
        "type": "phrase",
        "english": "There are four seasons.",
        "portuguese": "Há quatro estações."
      }),
      makeCard(117, 5, {
        "type": "word",
        "english": "Summer",
        "portuguese": "Verão"
      }),
      makeCard(117, 6, {
        "type": "word",
        "english": "Winter",
        "portuguese": "Inverno"
      }),
      makeCard(117, 7, {
        "type": "phrase",
        "english": "My favorite season is summer.",
        "portuguese": "Minha estação favorita é o verão."
      }),
      makeCard(117, 8, {
        "type": "phrase",
        "english": "In the summer, it is hot and sunny.",
        "portuguese": "No verão, é quente e ensolarado."
      }),
      makeCard(117, 9, {
        "type": "phrase",
        "english": "We travel to the beach in the summer.",
        "portuguese": "Nós viajamos para a praia no verão."
      }),
      makeCard(117, 10, {
        "type": "phrase",
        "english": "In the winter, it is cold and windy.",
        "portuguese": "No inverno, faz frio e venta."
      }),
      makeCard(117, 11, {
        "type": "phrase",
        "english": "He doesn't like winter.",
        "portuguese": "Ele não gosta do inverno."
      }),
      makeCard(117, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Estações do Ano e a Preposição **In**: Para expressar ocorrência durante uma estação do ano, usamos a preposição **in** acompanhada usualmente do artigo definido (*in the summer, in the winter*). O adjetivo **favorite** antecede o substantivo (*my favorite season, my favorite sport*).",
        "grammarRule": {
          "title": "Gramática — Lição 117",
          "explanation": "Estações do Ano e a Preposição **In**: Para expressar ocorrência durante uma estação do ano, usamos a preposição **in** acompanhada usualmente do artigo definido (*in the summer, in the winter*). O adjetivo **favorite** antecede o substantivo (*my favorite season, my favorite sport*).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 118,
    weekNumber: 17,
    blockNumber: 12,
    cefrLevel: 'A1',
    title: "Lição 118 — As Estações do Ano (Parte 2: Primavera e Outono) *(3 palavras novas)*",
    subtitle: "Novas: **Spring** (substantivo primavera), **Fall** (substantivo outono / *Autumn*), **Flower** (substantivo flor).",
    grammarFocus: "As Quatro Estações do Ano: *Spring* (primavera), *Summer*...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(118, 1, {
        "type": "word",
        "english": "Spring",
        "portuguese": "Primavera"
      }),
      makeCard(118, 2, {
        "type": "word",
        "english": "Fall",
        "portuguese": "Outono (inglês americano; também conhecido como *Autumn*)"
      }),
      makeCard(118, 3, {
        "type": "phrase",
        "english": "Spring is a beautiful season.",
        "portuguese": "A primavera é uma estação linda."
      }),
      makeCard(118, 4, {
        "type": "phrase",
        "english": "In the fall, the weather is cool.",
        "portuguese": "No outono, o tempo é fresco."
      }),
      makeCard(118, 5, {
        "type": "word",
        "english": "Flower",
        "portuguese": "Flor (plural: *flowers*)"
      }),
      makeCard(118, 6, {
        "type": "phrase",
        "english": "There are many flowers in the spring.",
        "portuguese": "Há muitas flores na primavera."
      }),
      makeCard(118, 7, {
        "type": "phrase",
        "english": "The flowers in our garden are red and yellow.",
        "portuguese": "As flores no nosso jardim são vermelhas e amarelas."
      }),
      makeCard(118, 8, {
        "type": "phrase",
        "english": "Do you prefer spring or summer?",
        "portuguese": "Você prefere a primavera ou o verão?"
      }),
      makeCard(118, 9, {
        "type": "phrase",
        "english": "I prefer spring because it is not too hot.",
        "portuguese": "Eu prefiro a primavera porque não é quente demais."
      }),
      makeCard(118, 10, {
        "type": "phrase",
        "english": "In the fall, we walk in the park.",
        "portuguese": "No outono, nós caminhamos no parque."
      }),
      makeCard(118, 11, {
        "type": "phrase",
        "english": "She loves the flowers in her house.",
        "portuguese": "Ela ama as flores na casa dela."
      }),
      makeCard(118, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "As Quatro Estações do Ano: *Spring* (primavera), *Summer* (verão), *Fall* ou *Autumn* (outono) e *Winter* (inverno). No inglês americano, o termo mais usual é *Fall* (em alusão à queda das folhas). O substantivo *flower* forma plural regular com acréscimo de *-s* (*flowers*).",
        "grammarRule": {
          "title": "Gramática — Lição 118",
          "explanation": "As Quatro Estações do Ano: *Spring* (primavera), *Summer* (verão), *Fall* ou *Autumn* (outono) e *Winter* (inverno). No inglês americano, o termo mais usual é *Fall* (em alusão à queda das folhas). O substantivo *flower* forma plural regular com acréscimo de *-s* (*flowers*).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 119,
    weekNumber: 17,
    blockNumber: 12,
    cefrLevel: 'A1',
    title: "Lição 119 — Revisão: Planos e Atividades ao Ar Livre *(3 palavras novas)*",
    subtitle: "Novas: **Sun** (substantivo sol), **Picnic** (substantivo piquenique), **Inside** (advérbio do lado de dentro/em local fechado).",
    grammarFocus: "Contraste de Ambientes: **Outside** (lá fora, ao ar livre...",
    isDialogueDay: false,
    isReviewLesson: true,
    cards: [
      makeCard(119, 1, {
        "type": "word",
        "english": "Sun",
        "portuguese": "Sol"
      }),
      makeCard(119, 2, {
        "type": "word",
        "english": "Picnic",
        "portuguese": "Piquenique"
      }),
      makeCard(119, 3, {
        "type": "phrase",
        "english": "The sun is hot today.",
        "portuguese": "O sol está quente hoje."
      }),
      makeCard(119, 4, {
        "type": "phrase",
        "english": "We can have a picnic in the park.",
        "portuguese": "Nós podemos fazer um piquenique no parque."
      }),
      makeCard(119, 5, {
        "type": "word",
        "english": "Inside",
        "portuguese": "Do lado de dentro, dentro de casa, em local coberto"
      }),
      makeCard(119, 6, {
        "type": "phrase",
        "english": "It is rainy, and we stay inside.",
        "portuguese": "Está chuvoso, e nós ficamos do lado de dentro."
      }),
      makeCard(119, 7, {
        "type": "phrase",
        "english": "Can we go to the beach today?",
        "portuguese": "Nós podemos ir à praia hoje?"
      }),
      makeCard(119, 8, {
        "type": "phrase",
        "english": "Yes, we can! The weather is sunny and warm.",
        "portuguese": "Sim, podemos! O tempo está ensolarado e agradável."
      }),
      makeCard(119, 9, {
        "type": "phrase",
        "english": "The children eat sandwiches on their picnic.",
        "portuguese": "As crianças comem sanduíches no piquenique delas."
      }),
      makeCard(119, 10, {
        "type": "phrase",
        "english": "When it is cold, I prefer to stay inside.",
        "portuguese": "Quando está frio, eu prefiro ficar dentro de casa."
      }),
      makeCard(119, 11, {
        "type": "phrase",
        "english": "We can drink cold juice in the sun.",
        "portuguese": "Nós podemos beber suco gelado ao sol."
      }),
      makeCard(119, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Contraste de Ambientes: **Outside** (lá fora, ao ar livre) $\\leftrightarrow$ **Inside** (do lado de dentro, em casa/recinto coberto). Para realizar um piquenique, a expressão fixa idiomática é **have a picnic** (*We can have a picnic*).",
        "grammarRule": {
          "title": "Gramática — Lição 119",
          "explanation": "Contraste de Ambientes: **Outside** (lá fora, ao ar livre) $\\leftrightarrow$ **Inside** (do lado de dentro, em casa/recinto coberto). Para realizar um piquenique, a expressão fixa idiomática é **have a picnic** (*We can have a picnic*).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 120,
    weekNumber: 18,
    blockNumber: 12,
    cefrLevel: 'A1',
    title: "Lição 120 — Fechamento do Bloco 12: Diálogo 5 — Planejando um Passeio ao Ar Livre",
    subtitle: "Lição 120 do nível A1",
    grammarFocus: "Fechamento do Bloco 12: Diálogo 5 — Planejando um Passeio ao Ar Livre",
    isDialogueDay: true,
    isReviewLesson: false,
    cards: [
      makeCard(120, 1, {
        "type": "dialogue",
        "english": "Good morning, Camila! How are you today?",
        "portuguese": "Bom dia, Camila! Como você está hoje?",
        "dialogueSpeaker": "Bruno"
      }),
      makeCard(120, 2, {
        "type": "dialogue",
        "english": "Good morning, Bruno! I am very well, thank you.",
        "portuguese": "Bom dia, Bruno! Eu estou muito bem, obrigada.",
        "dialogueSpeaker": "Camila"
      }),
      makeCard(120, 3, {
        "type": "dialogue",
        "english": "How is the weather outside today?",
        "portuguese": "Como está o tempo lá fora hoje?",
        "dialogueSpeaker": "Bruno"
      }),
      makeCard(120, 4, {
        "type": "dialogue",
        "english": "The weather is very good! It is warm and sunny.",
        "portuguese": "O tempo está muito bom! Está agradável e ensolarado.",
        "dialogueSpeaker": "Camila"
      }),
      makeCard(120, 5, {
        "type": "dialogue",
        "english": "Is it hot or cool?",
        "portuguese": "Está quente ou fresco?",
        "dialogueSpeaker": "Bruno"
      }),
      makeCard(120, 6, {
        "type": "dialogue",
        "english": "It is not hot. The temperature is nice, and it is not windy.",
        "portuguese": "Não está quente. A temperatura está boa, e não está ventando.",
        "dialogueSpeaker": "Camila"
      }),
      makeCard(120, 7, {
        "type": "dialogue",
        "english": "That is great! Can we go to the park this afternoon?",
        "portuguese": "Isso é ótimo! Nós podemos ir ao parque hoje à tarde?",
        "dialogueSpeaker": "Bruno"
      }),
      makeCard(120, 8, {
        "type": "dialogue",
        "english": "Yes, we can! We can have a picnic under the green trees.",
        "portuguese": "Sim, podemos! Nós podemos fazer um piquenique sob as árvores verdes.",
        "dialogueSpeaker": "Camila"
      }),
      makeCard(120, 9, {
        "type": "dialogue",
        "english": "Can we take fruit, sandwiches and cold juice?",
        "portuguese": "Nós podemos levar fruta, sanduíches e suco gelado?",
        "dialogueSpeaker": "Bruno"
      }),
      makeCard(120, 10, {
        "type": "dialogue",
        "english": "Yes! I have bread, cheese and fruit at home.",
        "portuguese": "Sim! Eu tenho pão, queijo e fruta em casa.",
        "dialogueSpeaker": "Camila"
      }),
      makeCard(120, 11, {
        "type": "dialogue",
        "english": "And I can take cold juice and water.",
        "portuguese": "E eu posso levar suco gelado e água.",
        "dialogueSpeaker": "Bruno"
      }),
      makeCard(120, 12, {
        "type": "dialogue",
        "english": "Can you ride your bike to the park?",
        "portuguese": "Você pode ir de bicicleta até o parque?",
        "dialogueSpeaker": "Camila"
      }),
      makeCard(120, 13, {
        "type": "dialogue",
        "english": "Yes, I can ride my bike. Can we meet at the park at two o'clock?",
        "portuguese": "Sim, eu posso ir de bicicleta. Nós podemos nos encontrar no parque às duas horas?",
        "dialogueSpeaker": "Bruno"
      }),
      makeCard(120, 14, {
        "type": "dialogue",
        "english": "Two o'clock is great! See you at the park.",
        "portuguese": "Duas horas está ótimo! Vejo você no parque.",
        "dialogueSpeaker": "Camila"
      }),
      makeCard(120, 15, {
        "type": "dialogue",
        "english": "See you then! Have a good morning.",
        "portuguese": "Até lá! Tenha uma boa manhã.",
        "dialogueSpeaker": "Bruno"
      })
    ]
  },
  {
    dayNumber: 121,
    weekNumber: 18,
    blockNumber: 13,
    cefrLevel: 'A1',
    title: "Lição 121 — Substantivos Contáveis vs. Incontáveis (Countable & Uncountable) *(3 palavras novas)*",
    subtitle: "Novas: **Sugar** (substantivo incontável açúcar), **Salt** (substantivo incontável sal), **Plate** (substantivo contável prato).",
    grammarFocus: "Substantivos Contáveis (*Countable*) vs. Incontáveis (*Un...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(121, 1, {
        "type": "word",
        "english": "Sugar",
        "portuguese": "Açúcar (substantivo incontável)"
      }),
      makeCard(121, 2, {
        "type": "word",
        "english": "Salt",
        "portuguese": "Sal (substantivo incontável)"
      }),
      makeCard(121, 3, {
        "type": "phrase",
        "english": "Coffee with sugar, please.",
        "portuguese": "Café com açúcar, por favor."
      }),
      makeCard(121, 4, {
        "type": "phrase",
        "english": "There is salt on the table.",
        "portuguese": "Há sal sobre a mesa."
      }),
      makeCard(121, 5, {
        "type": "word",
        "english": "Plate",
        "portuguese": "Prato (substantivo contável, plural: *plates*)"
      }),
      makeCard(121, 6, {
        "type": "phrase",
        "english": "A clean plate on the table.",
        "portuguese": "Um prato limpo sobre a mesa."
      }),
      makeCard(121, 7, {
        "type": "phrase",
        "english": "There are three plates in the kitchen.",
        "portuguese": "Há três pratos na cozinha."
      }),
      makeCard(121, 8, {
        "type": "phrase",
        "english": "I drink tea with milk and sugar.",
        "portuguese": "Eu tomo chá com leite e açúcar."
      }),
      makeCard(121, 9, {
        "type": "phrase",
        "english": "I don't like sugar in my coffee.",
        "portuguese": "Eu não gosto de açúcar no meu café."
      }),
      makeCard(121, 10, {
        "type": "phrase",
        "english": "He doesn't eat salt.",
        "portuguese": "Ele não come sal."
      }),
      makeCard(121, 11, {
        "type": "phrase",
        "english": "She has a plate on the table.",
        "portuguese": "Ela tem um prato sobre a mesa."
      }),
      makeCard(121, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Substantivos Contáveis (*Countable*) vs. Incontáveis (*Uncountable*):",
        "grammarRule": {
          "title": "Gramática — Lição 121",
          "explanation": "Substantivos Contáveis (*Countable*) vs. Incontáveis (*Uncountable*):",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 122,
    weekNumber: 18,
    blockNumber: 13,
    cefrLevel: 'A1',
    title: "Lição 122 — O Quantificador \"Some\" (Afirmações e Pedidos) *(3 palavras novas)*",
    subtitle: "Novas: **Some** (quantificador algum/alguma/alguns/algumas/um pouco de), **Soup** (substantivo incontável sopa), **Chicken** (substantivo carne de frango/frango).",
    grammarFocus: "O Uso de **Some**:",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(122, 1, {
        "type": "word",
        "english": "Some",
        "portuguese": "Algum, alguma, alguns, algumas, um pouco de (usado em afirmativas e ofertas)"
      }),
      makeCard(122, 2, {
        "type": "word",
        "english": "Soup",
        "portuguese": "Sopa (substantivo incontável)"
      }),
      makeCard(122, 3, {
        "type": "phrase",
        "english": "I want some soup, please.",
        "portuguese": "Eu quero um pouco de sopa, por favor."
      }),
      makeCard(122, 4, {
        "type": "phrase",
        "english": "There is some hot soup on the table.",
        "portuguese": "Há um pouco de sopa quente sobre a mesa."
      }),
      makeCard(122, 5, {
        "type": "word",
        "english": "Chicken",
        "portuguese": "Frango (substantivo/alimento)"
      }),
      makeCard(122, 6, {
        "type": "phrase",
        "english": "We eat chicken and rice for dinner.",
        "portuguese": "Nós comemos frango e arroz no jantar."
      }),
      makeCard(122, 7, {
        "type": "phrase",
        "english": "I have some apples in my bag.",
        "portuguese": "Eu tenho algumas maçãs na minha bolsa."
      }),
      makeCard(122, 8, {
        "type": "phrase",
        "english": "She drinks some water.",
        "portuguese": "Ela bebe um pouco de água."
      }),
      makeCard(122, 9, {
        "type": "phrase",
        "english": "Can I have some water, please?",
        "portuguese": "Você pode me dar um pouco de água, por favor?"
      }),
      makeCard(122, 10, {
        "type": "phrase",
        "english": "We have some bread and cheese.",
        "portuguese": "Nós temos um pouco de pão e queijo."
      }),
      makeCard(122, 11, {
        "type": "phrase",
        "english": "There are some clean plates in the kitchen.",
        "portuguese": "Há alguns pratos limpos na cozinha."
      }),
      makeCard(122, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "O Uso de **Some**:",
        "grammarRule": {
          "title": "Gramática — Lição 122",
          "explanation": "O Uso de **Some**:",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 123,
    weekNumber: 18,
    blockNumber: 13,
    cefrLevel: 'A1',
    title: "Lição 123 — Revisão: O Quantificador \"Any\" (Negativas e Perguntas) *(3 palavras novas)*",
    subtitle: "Novas: **Any** (quantificador nenhum/algum em negativas e perguntas), **Waitress** (substantivo garçonete), **Fork** (substantivo contável garfo).",
    grammarFocus: "Contraste Essencial entre **Some** e **Any**:",
    isDialogueDay: false,
    isReviewLesson: true,
    cards: [
      makeCard(123, 1, {
        "type": "word",
        "english": "Any",
        "portuguese": "Nenhum, nenhuma (em negativas); algum, alguma, qualquer (em perguntas)"
      }),
      makeCard(123, 2, {
        "type": "word",
        "english": "Waitress",
        "portuguese": "Garçonete"
      }),
      makeCard(123, 3, {
        "type": "phrase",
        "english": "The waitress is very polite.",
        "portuguese": "A garçonete é muito educada."
      }),
      makeCard(123, 4, {
        "type": "phrase",
        "english": "Do you have any sugar?",
        "portuguese": "Você tem algum açúcar?"
      }),
      makeCard(123, 5, {
        "type": "phrase",
        "english": "No, I don't have any sugar.",
        "portuguese": "Não, eu não tenho nenhum açúcar."
      }),
      makeCard(123, 6, {
        "type": "word",
        "english": "Fork",
        "portuguese": "Garfo (plural: *forks*)"
      }),
      makeCard(123, 7, {
        "type": "phrase",
        "english": "Are there any forks on the table?",
        "portuguese": "Há algum garfo na mesa?"
      }),
      makeCard(123, 8, {
        "type": "phrase",
        "english": "There aren't any forks here.",
        "portuguese": "Não há nenhum garfo aqui."
      }),
      makeCard(123, 9, {
        "type": "phrase",
        "english": "Do you want any soup?",
        "portuguese": "Você quer alguma sopa?"
      }),
      makeCard(123, 10, {
        "type": "phrase",
        "english": "She doesn't eat any meat.",
        "portuguese": "Ela não come nenhuma carne."
      }),
      makeCard(123, 11, {
        "type": "phrase",
        "english": "We don't have any money today.",
        "portuguese": "Nós não temos nenhum dinheiro hoje."
      }),
      makeCard(123, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Contraste Essencial entre **Some** e **Any**:",
        "grammarRule": {
          "title": "Gramática — Lição 123",
          "explanation": "Contraste Essencial entre **Some** e **Any**:",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 124,
    weekNumber: 18,
    blockNumber: 13,
    cefrLevel: 'A1',
    title: "Lição 124 — Quantidade com Contáveis: \"How Many\" *(3 palavras novas)*",
    subtitle: "Novas: **How many** (expressão interrogativa quantos/quantas), **Knife** (substantivo faca, plural irregular: *knives*), **Spoon** (substantivo colher).",
    grammarFocus: "A Expressão **How Many**: É empregada estritamente para p...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(124, 1, {
        "type": "word",
        "english": "How many",
        "portuguese": "Quantos, quantas (usado exclusivamente com substantivos contáveis no plural)"
      }),
      makeCard(124, 2, {
        "type": "word",
        "english": "Knife (Plural: Knives)",
        "portuguese": "Faca, facas (plural irregular com terminação *-ves*)"
      }),
      makeCard(124, 3, {
        "type": "phrase",
        "english": "How many knives are on the table?",
        "portuguese": "Quantas facas estão sobre a mesa?"
      }),
      makeCard(124, 4, {
        "type": "phrase",
        "english": "There are two knives and two forks.",
        "portuguese": "Há duas facas e dois garfos."
      }),
      makeCard(124, 5, {
        "type": "word",
        "english": "Spoon",
        "portuguese": "Colher (plural: *spoons*)"
      }),
      makeCard(124, 6, {
        "type": "phrase",
        "english": "I need a spoon for the soup.",
        "portuguese": "Eu preciso de uma colher para a sopa."
      }),
      makeCard(124, 7, {
        "type": "phrase",
        "english": "How many spoons do you need?",
        "portuguese": "De quantas colheres você precisa?"
      }),
      makeCard(124, 8, {
        "type": "phrase",
        "english": "How many brothers do you have?",
        "portuguese": "Quantos irmãos você tem?"
      }),
      makeCard(124, 9, {
        "type": "phrase",
        "english": "I have two brothers.",
        "portuguese": "Eu tenho dois irmãos."
      }),
      makeCard(124, 10, {
        "type": "phrase",
        "english": "How many students are in the room?",
        "portuguese": "Quantos estudantes estão na sala?"
      }),
      makeCard(124, 11, {
        "type": "phrase",
        "english": "There are ten students here.",
        "portuguese": "Há dez estudantes aqui."
      }),
      makeCard(124, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "A Expressão **How Many**: É empregada estritamente para perguntar quantidades de **substantivos contáveis**. O substantivo que a sucede deve vir **obrigatoriamente no plural** (*How many spoons...? How many students...?*). Plural irregular de *knife*: substantivos terminados em *-fe* trocam essa terminação por **-ves** (*one knife $\\rightarrow$ two knives*).",
        "grammarRule": {
          "title": "Gramática — Lição 124",
          "explanation": "A Expressão **How Many**: É empregada estritamente para perguntar quantidades de **substantivos contáveis**. O substantivo que a sucede deve vir **obrigatoriamente no plural** (*How many spoons...? How many students...?*). Plural irregular de *knife*: substantivos terminados em *-fe* trocam essa terminação por **-ves** (*one knife $\\rightarrow$ two knives*).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 125,
    weekNumber: 18,
    blockNumber: 13,
    cefrLevel: 'A1',
    title: "Lição 125 — Quantidade e Preço: \"How Much\" *(3 palavras novas)*",
    subtitle: "Novas: **How much** (expressão interrogativa quanto/quanta com incontáveis; quanto custa para preços), **Dollar** (substantivo moeda dólar), **Cost** (verbo custar).",
    grammarFocus: "Os Dois Usos Centrais de **How Much**:",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(125, 1, {
        "type": "word",
        "english": "How much",
        "portuguese": "Quanto, quanta (com incontáveis); quanto custa (para preços)"
      }),
      makeCard(125, 2, {
        "type": "word",
        "english": "Dollar",
        "portuguese": "Dólar (plural: *dollars*)"
      }),
      makeCard(125, 3, {
        "type": "phrase",
        "english": "How much is this book?",
        "portuguese": "Quanto custa este livro?"
      }),
      makeCard(125, 4, {
        "type": "phrase",
        "english": "It is ten dollars.",
        "portuguese": "São dez dólares. / Custa dez dólares."
      }),
      makeCard(125, 5, {
        "type": "word",
        "english": "Cost",
        "portuguese": "Custar (3ª pessoa: *costs*)"
      }),
      makeCard(125, 6, {
        "type": "phrase",
        "english": "How much does the soup cost?",
        "portuguese": "Quanto custa a sopa?"
      }),
      makeCard(125, 7, {
        "type": "phrase",
        "english": "It costs eight dollars.",
        "portuguese": "Custa oito dólares."
      }),
      makeCard(125, 8, {
        "type": "phrase",
        "english": "How much water do you drink every day?",
        "portuguese": "Quanta água você bebe todos os dias?"
      }),
      makeCard(125, 9, {
        "type": "phrase",
        "english": "I drink two bottles of water.",
        "portuguese": "Eu bebo duas garrafas de água."
      }),
      makeCard(125, 10, {
        "type": "phrase",
        "english": "How much money do you have?",
        "portuguese": "Quanto dinheiro você tem?"
      }),
      makeCard(125, 11, {
        "type": "phrase",
        "english": "I have twenty dollars.",
        "portuguese": "Eu tenho vinte dólares."
      }),
      makeCard(125, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Os Dois Usos Centrais de **How Much**:",
        "grammarRule": {
          "title": "Gramática — Lição 125",
          "explanation": "Os Dois Usos Centrais de **How Much**:",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 126,
    weekNumber: 18,
    blockNumber: 13,
    cefrLevel: 'A1',
    title: "Lição 126 — Revisão: O Quantificador Universal \"A lot of\" *(3 palavras novas)*",
    subtitle: "Novas: **A lot of** (locução quantificadora muito/muita/muitos/muitas), **Menu** (substantivo cardápio/menu), **Vegetable** (substantivo vegetal/legume, plural: *vegetables*).",
    grammarFocus: "O Superquantificador **A lot of**: É extremamente prático...",
    isDialogueDay: false,
    isReviewLesson: true,
    cards: [
      makeCard(126, 1, {
        "type": "word",
        "english": "A lot of",
        "portuguese": "Muito, muita, muitos, muitas (quantificador universal)"
      }),
      makeCard(126, 2, {
        "type": "word",
        "english": "Menu",
        "portuguese": "Cardápio, menu"
      }),
      makeCard(126, 3, {
        "type": "phrase",
        "english": "There is a lot of food on the menu.",
        "portuguese": "Há muita comida no cardápio."
      }),
      makeCard(126, 4, {
        "type": "phrase",
        "english": "Can I see the menu, please?",
        "portuguese": "Posso ver o cardápio, por favor?"
      }),
      makeCard(126, 5, {
        "type": "word",
        "english": "Vegetable (Plural: Vegetables)",
        "portuguese": "Legume, vegetal, legumes"
      }),
      makeCard(126, 6, {
        "type": "phrase",
        "english": "I eat a lot of vegetables.",
        "portuguese": "Eu como muitos legumes."
      }),
      makeCard(126, 7, {
        "type": "phrase",
        "english": "She drinks a lot of water.",
        "portuguese": "Ela bebe muita água."
      }),
      makeCard(126, 8, {
        "type": "phrase",
        "english": "There are a lot of people in the restaurant.",
        "portuguese": "Há muitas pessoas no restaurante."
      }),
      makeCard(126, 9, {
        "type": "phrase",
        "english": "We have a lot of time before dinner.",
        "portuguese": "Nós temos muito tempo antes do jantar."
      }),
      makeCard(126, 10, {
        "type": "phrase",
        "english": "He eats a lot of rice and chicken.",
        "portuguese": "Ele come muito arroz e frango."
      }),
      makeCard(126, 11, {
        "type": "phrase",
        "english": "There are fresh vegetables in this soup.",
        "portuguese": "Há legumes frescos nesta sopa."
      }),
      makeCard(126, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "O Superquantificador **A lot of**: É extremamente prático e versátil na comunicação diária. Funciona perfeitamente tanto com **substantivos contáveis no plural** (*a lot of vegetables, a lot of plates*) quanto com **substantivos incontáveis** (*a lot of water, a lot of food, a lot of time*).",
        "grammarRule": {
          "title": "Gramática — Lição 126",
          "explanation": "O Superquantificador **A lot of**: É extremamente prático e versátil na comunicação diária. Funciona perfeitamente tanto com **substantivos contáveis no plural** (*a lot of vegetables, a lot of plates*) quanto com **substantivos incontáveis** (*a lot of water, a lot of food, a lot of time*).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 127,
    weekNumber: 19,
    blockNumber: 13,
    cefrLevel: 'A1',
    title: "Lição 127 — Fazendo Pedidos com \"Would like\" *(3 palavras novas)*",
    subtitle: "Novas: **Would like** (locução verbal de cortesia gostaria de), **Order** (verbo pedir/fazer pedido em restaurante; substantivo pedido), **Bring** (verbo trazer).",
    grammarFocus: "Pedidos com **Would Like**: No ambiente de restaurantes, ...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(127, 1, {
        "type": "word",
        "english": "Would like",
        "portuguese": "Gostaria, gostaria de (expressão polida equivalente a *want*)"
      }),
      makeCard(127, 2, {
        "type": "word",
        "english": "Order",
        "portuguese": "Fazer o pedido, pedir (em restaurante); pedido (substantivo)"
      }),
      makeCard(127, 3, {
        "type": "phrase",
        "english": "Are you ready to order?",
        "portuguese": "Vocês estão prontos para pedir?"
      }),
      makeCard(127, 4, {
        "type": "phrase",
        "english": "Yes, we are ready to order.",
        "portuguese": "Sim, nós estamos prontos para pedir."
      }),
      makeCard(127, 5, {
        "type": "word",
        "english": "Bring",
        "portuguese": "Trazer"
      }),
      makeCard(127, 6, {
        "type": "phrase",
        "english": "Can you bring the menu, please?",
        "portuguese": "Você pode trazer o cardápio, por favor?"
      }),
      makeCard(127, 7, {
        "type": "phrase",
        "english": "I would like a glass of water.",
        "portuguese": "Eu gostaria de um copo de água."
      }),
      makeCard(127, 8, {
        "type": "phrase",
        "english": "She would like some soup and a salad.",
        "portuguese": "Ela gostaria de um pouco de sopa e de uma salada."
      }),
      makeCard(127, 9, {
        "type": "phrase",
        "english": "What would you like to drink?",
        "portuguese": "O que você gostaria de beber?"
      }),
      makeCard(127, 10, {
        "type": "phrase",
        "english": "We would like chicken with rice and vegetables.",
        "portuguese": "Nós gostaríamos de frango com arroz e legumes."
      }),
      makeCard(127, 11, {
        "type": "phrase",
        "english": "The waiter brings the food to our table.",
        "portuguese": "O garçom traz a comida para a nossa mesa."
      }),
      makeCard(127, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Pedidos com **Would Like**: No ambiente de restaurantes, a fórmula de máxima cortesia para fazer pedidos é **I would like** (frequentemente contraído na oralidade como *I'd like*). Soa muito mais refinado e respeitoso do que o imperativo direto ou *I want*. Estrutura: *I would like + substantivo* (*I would like water*) ou *I would like to + verbo* (*I would like to order*).",
        "grammarRule": {
          "title": "Gramática — Lição 127",
          "explanation": "Pedidos com **Would Like**: No ambiente de restaurantes, a fórmula de máxima cortesia para fazer pedidos é **I would like** (frequentemente contraído na oralidade como *I'd like*). Soa muito mais refinado e respeitoso do que o imperativo direto ou *I want*. Estrutura: *I would like + substantivo* (*I would like water*) ou *I would like to + verbo* (*I would like to order*).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 128,
    weekNumber: 19,
    blockNumber: 13,
    cefrLevel: 'A1',
    title: "Lição 128 — Sobremesa, Conta e Gorjeta *(4 palavras novas)*",
    subtitle: "Novas: **Dessert** (substantivo sobremesa), **Cake** (substantivo bolo), **Bill** (substantivo conta de consumo/restaurante), **Tip** (substantivo gorjeta).",
    grammarFocus: "Vocabulário de Fechamento de Refeição:",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(128, 1, {
        "type": "word",
        "english": "Dessert",
        "portuguese": "Sobremesa"
      }),
      makeCard(128, 2, {
        "type": "word",
        "english": "Cake",
        "portuguese": "Bolo"
      }),
      makeCard(128, 3, {
        "type": "phrase",
        "english": "I would like cake for dessert.",
        "portuguese": "Eu gostaria de bolo de sobremesa."
      }),
      makeCard(128, 4, {
        "type": "phrase",
        "english": "Would you like any dessert?",
        "portuguese": "Vocês gostariam de alguma sobremesa?"
      }),
      makeCard(128, 5, {
        "type": "word",
        "english": "Bill",
        "portuguese": "Conta (de consumo em restaurante)"
      }),
      makeCard(128, 6, {
        "type": "word",
        "english": "Tip",
        "portuguese": "Gorjeta"
      }),
      makeCard(128, 7, {
        "type": "phrase",
        "english": "Can we have the bill, please?",
        "portuguese": "O senhor pode trazer a conta, por favor?"
      }),
      makeCard(128, 8, {
        "type": "phrase",
        "english": "The bill is thirty dollars.",
        "portuguese": "A conta deu trinta dólares."
      }),
      makeCard(128, 9, {
        "type": "phrase",
        "english": "We leave a tip for the waiter.",
        "portuguese": "Nós deixamos uma gorjeta para o garçom."
      }),
      makeCard(128, 10, {
        "type": "phrase",
        "english": "How much is the tip?",
        "portuguese": "De quanto é a gorjeta?"
      }),
      makeCard(128, 11, {
        "type": "phrase",
        "english": "The tip is five dollars.",
        "portuguese": "A gorjeta é de cinco dólares."
      }),
      makeCard(128, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Vocabulário de Fechamento de Refeição:",
        "grammarRule": {
          "title": "Gramática — Lição 128",
          "explanation": "Vocabulário de Fechamento de Refeição:",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 129,
    weekNumber: 19,
    blockNumber: 13,
    cefrLevel: 'A1',
    title: "Lição 129 — Revisão: Bebidas e Sabores em Refeições *(3 palavras novas)*",
    subtitle: "Novas: **Wine** (substantivo incontável vinho), **Sweet** (adjetivo doce), **Beer** (substantivo cerveja).",
    grammarFocus: "Bebidas e Medidas: Bebidas como *wine, beer, coffee, wate...",
    isDialogueDay: false,
    isReviewLesson: true,
    cards: [
      makeCard(129, 1, {
        "type": "word",
        "english": "Wine",
        "portuguese": "Vinho (substantivo incontável)"
      }),
      makeCard(129, 2, {
        "type": "word",
        "english": "Sweet",
        "portuguese": "Doce (adjetivo)"
      }),
      makeCard(129, 3, {
        "type": "phrase",
        "english": "A glass of red wine, please.",
        "portuguese": "Uma taça de vinho tinto, por favor."
      }),
      makeCard(129, 4, {
        "type": "phrase",
        "english": "This white wine is cold and sweet.",
        "portuguese": "Este vinho branco está gelado e doce."
      }),
      makeCard(129, 5, {
        "type": "word",
        "english": "Beer",
        "portuguese": "Cerveja (substantivo)"
      }),
      makeCard(129, 6, {
        "type": "phrase",
        "english": "Do you prefer beer or wine?",
        "portuguese": "Você prefere cerveja ou vinho?"
      }),
      makeCard(129, 7, {
        "type": "phrase",
        "english": "I would like a cold beer, please.",
        "portuguese": "Eu gostaria de uma cerveja gelada, por favor."
      }),
      makeCard(129, 8, {
        "type": "phrase",
        "english": "She doesn't drink wine.",
        "portuguese": "Ela não bebe vinho."
      }),
      makeCard(129, 9, {
        "type": "phrase",
        "english": "This cake is very sweet and delicious.",
        "portuguese": "Este bolo é muito doce e delicioso."
      }),
      makeCard(129, 10, {
        "type": "phrase",
        "english": "We drink wine with our dinner.",
        "portuguese": "Nós bebemos vinho com o nosso jantar."
      }),
      makeCard(129, 11, {
        "type": "phrase",
        "english": "He drinks a glass of cold water before the beer.",
        "portuguese": "Ele bebe um copo de água gelada antes da cerveja."
      }),
      makeCard(129, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Bebidas e Medidas: Bebidas como *wine, beer, coffee, water* são gramaticalmente incontáveis. No contexto comercial de restaurantes, é aceito pedir *a beer* (uma cerveja) ou especificar a embalagem/recipiente exato: *a glass of wine* (uma taça de vinho), *a bottle of water* (uma garrafa de água).",
        "grammarRule": {
          "title": "Gramática — Lição 129",
          "explanation": "Bebidas e Medidas: Bebidas como *wine, beer, coffee, water* são gramaticalmente incontáveis. No contexto comercial de restaurantes, é aceito pedir *a beer* (uma cerveja) ou especificar a embalagem/recipiente exato: *a glass of wine* (uma taça de vinho), *a bottle of water* (uma garrafa de água).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 130,
    weekNumber: 19,
    blockNumber: 13,
    cefrLevel: 'A1',
    title: "Lição 130 — Fechamento do Bloco 13: Diálogo 6 — Jantar Completo no Restaurante",
    subtitle: "Lição 130 do nível A1",
    grammarFocus: "Fechamento do Bloco 13: Diálogo 6 — Jantar Completo no Restaurante",
    isDialogueDay: true,
    isReviewLesson: false,
    cards: [
      makeCard(130, 1, {
        "type": "dialogue",
        "english": "Good evening! Welcome to our restaurant. A table for two?",
        "portuguese": "Boa noite! Bem-vindos ao nosso restaurante. Uma mesa para dois?",
        "dialogueSpeaker": "Waiter"
      }),
      makeCard(130, 2, {
        "type": "dialogue",
        "english": "Good evening! Yes, please. A table near the window.",
        "portuguese": "Boa noite! Sim, por favor. Uma mesa perto da janela.",
        "dialogueSpeaker": "Rodrigo"
      }),
      makeCard(130, 3, {
        "type": "dialogue",
        "english": "Please, sit here. Here is the menu.",
        "portuguese": "Por favor, sentem-se aqui. Aqui está o cardápio.",
        "dialogueSpeaker": "Waiter"
      }),
      makeCard(130, 4, {
        "type": "dialogue",
        "english": "Thank you very much. What would you like to drink, Rodrigo?",
        "portuguese": "Muito obrigada. O que você gostaria de beber, Rodrigo?",
        "dialogueSpeaker": "Mariana"
      }),
      makeCard(130, 5, {
        "type": "dialogue",
        "english": "I would like a glass of red wine, please.",
        "portuguese": "Eu gostaria de uma taça de vinho tinto, por favor.",
        "dialogueSpeaker": "Rodrigo"
      }),
      makeCard(130, 6, {
        "type": "dialogue",
        "english": "And I would like a bottle of cold water with two glasses.",
        "portuguese": "E eu gostaria de uma garrafa de água gelada com dois copos.",
        "dialogueSpeaker": "Mariana"
      }),
      makeCard(130, 7, {
        "type": "dialogue",
        "english": "Very good. Are you ready to order dinner?",
        "portuguese": "Muito bem. Vocês estão prontos para pedir o jantar?",
        "dialogueSpeaker": "Waiter"
      }),
      makeCard(130, 8, {
        "type": "dialogue",
        "english": "Yes. I would like the chicken with rice and fresh vegetables.",
        "portuguese": "Sim. Eu gostaria do frango com arroz e legumes frescos.",
        "dialogueSpeaker": "Rodrigo"
      }),
      makeCard(130, 9, {
        "type": "dialogue",
        "english": "And for me, pasta with cheese and some soup, please.",
        "portuguese": "E para mim, massa com queijo e um pouco de sopa, por favor.",
        "dialogueSpeaker": "Mariana"
      }),
      makeCard(130, 10, {
        "type": "dialogue",
        "english": "Very good! Two forks, two knives and a spoon for the soup.",
        "portuguese": "Muito bem! Dois garfos, duas facas e uma colher para a sopa.",
        "dialogueSpeaker": "Waiter"
      }),
      makeCard(130, 11, {
        "type": "dialogue",
        "english": "Excuse me, can you bring some salt, too?",
        "portuguese": "Com licença, você pode trazer um pouco de sal também?",
        "dialogueSpeaker": "Rodrigo"
      }),
      makeCard(130, 12, {
        "type": "dialogue",
        "english": "Yes, I can bring the salt to your table.",
        "portuguese": "Sim, eu posso trazer o sal para a sua mesa.",
        "dialogueSpeaker": "Waiter"
      }),
      makeCard(130, 13, {
        "type": "dialogue",
        "english": "The food is very delicious! Would you like any dessert?",
        "portuguese": "A comida está muito deliciosa! Você gostaria de alguma sobremesa?",
        "dialogueSpeaker": "Mariana"
      }),
      makeCard(130, 14, {
        "type": "dialogue",
        "english": "Yes! I would like some sweet cake, please.",
        "portuguese": "Sim! Eu gostaria de um pouco de bolo doce, por favor.",
        "dialogueSpeaker": "Rodrigo"
      }),
      makeCard(130, 15, {
        "type": "dialogue",
        "english": "Excuse me, waiter! Can we have the bill, please?",
        "portuguese": "Com licença, garçom! Pode nos trazer a conta, por favor?",
        "dialogueSpeaker": "Mariana"
      }),
      makeCard(130, 16, {
        "type": "dialogue",
        "english": "Here is the bill. It is thirty dollars.",
        "portuguese": "Aqui está a conta. Deu trinta dólares.",
        "dialogueSpeaker": "Waiter"
      }),
      makeCard(130, 17, {
        "type": "dialogue",
        "english": "Here is thirty-five dollars: thirty dollars for the bill and five dollars for your tip.",
        "portuguese": "Aqui estão trinta e cinco dólares: trinta dólares para a conta e cinco dólares para a sua gorjeta.",
        "dialogueSpeaker": "Rodrigo"
      }),
      makeCard(130, 18, {
        "type": "dialogue",
        "english": "Thank you very much! Have a good night.",
        "portuguese": "Muito obrigado! Tenham uma boa noite.",
        "dialogueSpeaker": "Waiter"
      }),
      makeCard(130, 19, {
        "type": "dialogue",
        "english": "Thank you! Good night.",
        "portuguese": "Obrigada! Boa noite.",
        "dialogueSpeaker": "Mariana"
      })
    ]
  },
  {
    dayNumber: 131,
    weekNumber: 19,
    blockNumber: 14,
    cefrLevel: 'A1',
    title: "Lição 131 — O Caso Genitivo Saxão (\"'s\" de Posse) *(2 palavras novas)*",
    subtitle: "Novas: **Whose** (pronome interrogativo de posse), e o marcador morfológico **'s** (Genitivo Saxão).",
    grammarFocus: "O Genitivo Saxão (`'s`): Em inglês, a relação de posse en...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(131, 1, {
        "type": "word",
        "english": "Whose",
        "portuguese": "De quem (pronome interrogativo de posse)"
      }),
      makeCard(131, 2, {
        "type": "word",
        "english": "'s (Genitivo Saxão)",
        "portuguese": "De (marcador de posse apostrofado aposto ao possuidor)"
      }),
      makeCard(131, 3, {
        "type": "phrase",
        "english": "Whose car is this?",
        "portuguese": "De quem é este carro?"
      }),
      makeCard(131, 4, {
        "type": "phrase",
        "english": "This is Gabriel's car.",
        "portuguese": "Este é o carro do Gabriel."
      }),
      makeCard(131, 5, {
        "type": "phrase",
        "english": "Sarah's mother is a doctor.",
        "portuguese": "A mãe da Sarah é médica."
      }),
      makeCard(131, 6, {
        "type": "phrase",
        "english": "Where are my father's keys?",
        "portuguese": "Onde estão as chaves do meu pai?"
      }),
      makeCard(131, 7, {
        "type": "phrase",
        "english": "Whose phone is on the table?",
        "portuguese": "De quem é o telefone sobre a mesa?"
      }),
      makeCard(131, 8, {
        "type": "phrase",
        "english": "It is my sister's phone.",
        "portuguese": "É o telefone da minha irmã."
      }),
      makeCard(131, 9, {
        "type": "phrase",
        "english": "John's house is near the park.",
        "portuguese": "A casa do John fica perto do parque."
      }),
      makeCard(131, 10, {
        "type": "phrase",
        "english": "The teacher's desk is clean.",
        "portuguese": "A escrivaninha do professor está limpa."
      }),
      makeCard(131, 11, {
        "type": "phrase",
        "english": "Is that Daniel's bicycle?",
        "portuguese": "Aquela é a bicicleta do Daniel?"
      }),
      makeCard(131, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "O Genitivo Saxão (`'s`): Em inglês, a relação de posse entre pessoas e coisas expressa-se antepondo o possuidor com **'s** ao objeto possuído: **Possuidor + 's + Coisa possuída** (*Gabriel's car* = o carro de Gabriel; *my sister's house* = a casa da minha irmã). Não confunda com a contração de *is* (*David's tall = David is tall*; *David's dog = o cachorro de David*). O pronome **Whose** questiona especificamente a quem pertence algo (*Whose phone is this?*).",
        "grammarRule": {
          "title": "Gramática — Lição 131",
          "explanation": "O Genitivo Saxão (`'s`): Em inglês, a relação de posse entre pessoas e coisas expressa-se antepondo o possuidor com **'s** ao objeto possuído: **Possuidor + 's + Coisa possuída** (*Gabriel's car* = o carro de Gabriel; *my sister's house* = a casa da minha irmã). Não confunda com a contração de *is* (*David's tall = David is tall*; *David's dog = o cachorro de David*). O pronome **Whose** questiona especificamente a quem pertence algo (*Whose phone is this?*).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 132,
    weekNumber: 19,
    blockNumber: 14,
    cefrLevel: 'A1',
    title: "Lição 132 — Descrição Física: Cabelo, Olhos e Traços *(4 palavras novas)*",
    subtitle: "Novas: **Hair** (substantivo incontável cabelo), **Eye** (substantivo olho, plural: *eyes*), **Dark** (adjetivo escuro/moreno), **Blonde** (adjetivo loiro/loira).",
    grammarFocus: "Descrições Físicas com **Have/Has**: Usamos o verbo *have...",
    isDialogueDay: true,
    isReviewLesson: false,
    cards: [
      makeCard(132, 1, {
        "type": "word",
        "english": "Hair",
        "portuguese": "Cabelo (substantivo incontável em inglês)"
      }),
      makeCard(132, 2, {
        "type": "word",
        "english": "Eye (Plural: Eyes)",
        "portuguese": "Olho, olhos"
      }),
      makeCard(132, 3, {
        "type": "phrase",
        "english": "She has blue eyes.",
        "portuguese": "Ela tem olhos azuis."
      }),
      makeCard(132, 4, {
        "type": "phrase",
        "english": "He has dark hair.",
        "portuguese": "Ele tem cabelo escuro."
      }),
      makeCard(132, 5, {
        "type": "word",
        "english": "Dark",
        "portuguese": "Escuro, moreno (adjetivo)"
      }),
      makeCard(132, 6, {
        "type": "word",
        "english": "Blonde",
        "portuguese": "Loiro, loira (adjetivo)"
      }),
      makeCard(132, 7, {
        "type": "phrase",
        "english": "Julia has blonde hair and green eyes.",
        "portuguese": "Julia tem cabelo loiro e olhos verdes."
      }),
      makeCard(132, 8, {
        "type": "phrase",
        "english": "My brother has brown eyes and short dark hair.",
        "portuguese": "Meu irmão tem olhos castanhos e cabelo escuro curto."
      }),
      makeCard(132, 9, {
        "type": "phrase",
        "english": "Her eyes are brown, and her hair is blonde.",
        "portuguese": "Os olhos dela são castanhos, e o cabelo dela é loiro."
      }),
      makeCard(132, 10, {
        "type": "phrase",
        "english": "Gabriel is tall and has dark hair.",
        "portuguese": "Gabriel é alto e tem cabelo escuro."
      }),
      makeCard(132, 11, {
        "type": "phrase",
        "english": "The boy with green eyes is my son.",
        "portuguese": "O menino de olhos verdes é meu filho."
      }),
      makeCard(132, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Descrições Físicas com **Have/Has**: Usamos o verbo *have/has* para indicar características físicas permanentes (*She has blue eyes; He has blonde hair*). Atenção: a palavra **hair** é tratada quase sempre como substantivo incontável no singular quando nos referimos ao conjunto capilar (*Her hair is dark*, nunca *Her hairs are dark*).",
        "grammarRule": {
          "title": "Gramática — Lição 132",
          "explanation": "Descrições Físicas com **Have/Has**: Usamos o verbo *have/has* para indicar características físicas permanentes (*She has blue eyes; He has blonde hair*). Atenção: a palavra **hair** é tratada quase sempre como substantivo incontável no singular quando nos referimos ao conjunto capilar (*Her hair is dark*, nunca *Her hairs are dark*).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 133,
    weekNumber: 19,
    blockNumber: 14,
    cefrLevel: 'A1',
    title: "Lição 133 — Revisão: Idade e Estágios da Vida *(3 palavras novas)*",
    subtitle: "Novas: **Year** (substantivo ano, plural: *years*), **Young** (adjetivo jovem/novo), **How old** (locução interrogativa de idade).",
    grammarFocus: "Expressando Idade em Inglês: Diferentemente do português ...",
    isDialogueDay: false,
    isReviewLesson: true,
    cards: [
      makeCard(133, 1, {
        "type": "word",
        "english": "Year",
        "portuguese": "Ano (plural: *years*)"
      }),
      makeCard(133, 2, {
        "type": "word",
        "english": "Young",
        "portuguese": "Jovem, novo (adjetivo)"
      }),
      makeCard(133, 3, {
        "type": "phrase",
        "english": "My son is very young.",
        "portuguese": "Meu filho é muito jovem."
      }),
      makeCard(133, 4, {
        "type": "phrase",
        "english": "He is eight years old.",
        "portuguese": "Ele tem oito anos de idade."
      }),
      makeCard(133, 5, {
        "type": "word",
        "english": "How old",
        "portuguese": "Que idade, quantos anos (fórmula interrogativa com o verbo *To Be*)"
      }),
      makeCard(133, 6, {
        "type": "phrase",
        "english": "How old are you?",
        "portuguese": "Quantos anos você tem?"
      }),
      makeCard(133, 7, {
        "type": "phrase",
        "english": "I am twenty years old.",
        "portuguese": "Eu tenho vinte anos de idade."
      }),
      makeCard(133, 8, {
        "type": "phrase",
        "english": "How old is your sister?",
        "portuguese": "Quantos anos tem a sua irmã?"
      }),
      makeCard(133, 9, {
        "type": "phrase",
        "english": "She is thirty years old.",
        "portuguese": "Ela tem trinta anos de idade."
      }),
      makeCard(133, 10, {
        "type": "phrase",
        "english": "My father is old, but my brother is young.",
        "portuguese": "Meu pai é idoso, mas meu irmão é jovem."
      }),
      makeCard(133, 11, {
        "type": "phrase",
        "english": "She is young, but she is a doctor.",
        "portuguese": "Ela é jovem, mas é médica."
      }),
      makeCard(133, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Expressando Idade em Inglês: Diferentemente do português (onde usamos o verbo \"ter\"), a idade em inglês é concebida como um estado, sendo formulada obrigatoriamente com o verbo **To Be**: **Sujeito + To Be + [número] + years old** (*I am twenty years old*; incorreto usar *have*). A pergunta para saber a idade de alguém é sempre **How old are you?** ou **How old is he/she?**.",
        "grammarRule": {
          "title": "Gramática — Lição 133",
          "explanation": "Expressando Idade em Inglês: Diferentemente do português (onde usamos o verbo \"ter\"), a idade em inglês é concebida como um estado, sendo formulada obrigatoriamente com o verbo **To Be**: **Sujeito + To Be + [número] + years old** (*I am twenty years old*; incorreto usar *have*). A pergunta para saber a idade de alguém é sempre **How old are you?** ou **How old is he/she?**.",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 134,
    weekNumber: 20,
    blockNumber: 14,
    cefrLevel: 'A1',
    title: "Lição 134 — Descrição de Personalidade *(3 palavras novas)*",
    subtitle: "Novas: **Kind** (adjetivo gentil/bondoso), **Smart** (adjetivo inteligente/esperto), **Funny** (adjetivo engraçado/divertido).",
    grammarFocus: "Adjetivos de Personalidade: Qualificam o temperamento e a...",
    isDialogueDay: true,
    isReviewLesson: false,
    cards: [
      makeCard(134, 1, {
        "type": "word",
        "english": "Kind",
        "portuguese": "Gentil, bondoso, atencioso (adjetivo)"
      }),
      makeCard(134, 2, {
        "type": "word",
        "english": "Smart",
        "portuguese": "Esperto, inteligente (adjetivo)"
      }),
      makeCard(134, 3, {
        "type": "phrase",
        "english": "Our teacher is very kind.",
        "portuguese": "Nosso professor é muito gentil."
      }),
      makeCard(134, 4, {
        "type": "phrase",
        "english": "She is a smart student.",
        "portuguese": "Ela é uma aluna inteligente."
      }),
      makeCard(134, 5, {
        "type": "word",
        "english": "Funny",
        "portuguese": "Engraçado, divertido (adjetivo)"
      }),
      makeCard(134, 6, {
        "type": "phrase",
        "english": "My brother is very funny.",
        "portuguese": "Meu irmão é muito engraçado."
      }),
      makeCard(134, 7, {
        "type": "phrase",
        "english": "David is kind and smart.",
        "portuguese": "David é gentil e inteligente."
      }),
      makeCard(134, 8, {
        "type": "phrase",
        "english": "She has a funny dog.",
        "portuguese": "Ela tem um cachorro engraçado."
      }),
      makeCard(134, 9, {
        "type": "phrase",
        "english": "They are kind people.",
        "portuguese": "Eles são pessoas gentis."
      }),
      makeCard(134, 10, {
        "type": "phrase",
        "english": "The doctor is polite and kind.",
        "portuguese": "O médico é educado e atencioso."
      }),
      makeCard(134, 11, {
        "type": "phrase",
        "english": "He is funny, and we play together.",
        "portuguese": "Ele é engraçado, e nós brincamos juntos."
      }),
      makeCard(134, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Adjetivos de Personalidade: Qualificam o temperamento e a inteligência das pessoas. Posicionam-se após o verbo *To Be* (*She is smart; He is kind*) ou antes do substantivo que qualificam (*a funny boy; kind people*). Em inglês, os adjetivos são invariáveis em gênero e número (a mesma forma serve para homem, mulher, singular e plural).",
        "grammarRule": {
          "title": "Gramática — Lição 134",
          "explanation": "Adjetivos de Personalidade: Qualificam o temperamento e a inteligência das pessoas. Posicionam-se após o verbo *To Be* (*She is smart; He is kind*) ou antes do substantivo que qualificam (*a funny boy; kind people*). Em inglês, os adjetivos são invariáveis em gênero e número (a mesma forma serve para homem, mulher, singular e plural).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 135,
    weekNumber: 20,
    blockNumber: 14,
    cefrLevel: 'A1',
    title: "Lição 135 — Comparativos de Superioridade: A Regra do \"-er than\" *(2 palavras novas)*",
    subtitle: "Novas: **Than** (conjunção comparativa do que/que), **Taller** (forma comparativa mais alto/mais alta que).",
    grammarFocus: "O Comparativo de Superioridade Regular: Para comparar doi...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(135, 1, {
        "type": "word",
        "english": "Than",
        "portuguese": "Do que, que (conjunção comparativa usada após adjetivos)"
      }),
      makeCard(135, 2, {
        "type": "word",
        "english": "Taller",
        "portuguese": "Mais alto, mais alta (comparativo regular de *tall*)"
      }),
      makeCard(135, 3, {
        "type": "phrase",
        "english": "Gabriel is taller than Leo.",
        "portuguese": "Gabriel é mais alto do que Leo."
      }),
      makeCard(135, 4, {
        "type": "phrase",
        "english": "My father is taller than my mother.",
        "portuguese": "Meu pai é mais alto do que minha mãe."
      }),
      makeCard(135, 5, {
        "type": "phrase",
        "english": "I am older than my sister.",
        "portuguese": "Eu sou mais velho do que minha irmã."
      }),
      makeCard(135, 6, {
        "type": "phrase",
        "english": "The train is faster than the bus.",
        "portuguese": "O trem é mais rápido do que o ônibus."
      }),
      makeCard(135, 7, {
        "type": "phrase",
        "english": "Winter is colder than autumn.",
        "portuguese": "O inverno é mais frio do que o outono."
      }),
      makeCard(135, 8, {
        "type": "phrase",
        "english": "He is younger than his brother.",
        "portuguese": "Ele é mais jovem do que o irmão dele."
      }),
      makeCard(135, 9, {
        "type": "phrase",
        "english": "She is taller than her teacher.",
        "portuguese": "Ela é mais alta do que a professora dela."
      }),
      makeCard(135, 10, {
        "type": "phrase",
        "english": "Canada is colder than Brazil.",
        "portuguese": "O Canadá é mais frio do que o Brasil."
      }),
      makeCard(135, 11, {
        "type": "phrase",
        "english": "The subway is faster than walking on foot.",
        "portuguese": "O metrô é mais rápido do que caminhar a pé."
      }),
      makeCard(135, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "O Comparativo de Superioridade Regular: Para comparar dois elementos usando adjetivos curtos (de uma sílaba), acrescentamos o sufixo **-er** ao adjetivo, acompanhado da conjunção **than** (*do que*):",
        "grammarRule": {
          "title": "Gramática — Lição 135",
          "explanation": "O Comparativo de Superioridade Regular: Para comparar dois elementos usando adjetivos curtos (de uma sílaba), acrescentamos o sufixo **-er** ao adjetivo, acompanhado da conjunção **than** (*do que*):",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 136,
    weekNumber: 20,
    blockNumber: 14,
    cefrLevel: 'A1',
    title: "Lição 136 — Variações Ortográficas do Comparativo (-ier e Consoante Dupla) *(3 palavras novas)*",
    subtitle: "Novas: **Easy** (adjetivo fácil), **Town** (substantivo cidade pequena/município), **Cleaner** (comparativo mais limpo/mais limpa).",
    grammarFocus: "Regras Ortográficas do Comparativo:",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(136, 1, {
        "type": "word",
        "english": "Easy",
        "portuguese": "Fácil (adjetivo)"
      }),
      makeCard(136, 2, {
        "type": "word",
        "english": "Town",
        "portuguese": "Cidade pequena, cidade do interior (substantivo)"
      }),
      makeCard(136, 3, {
        "type": "phrase",
        "english": "English is easy.",
        "portuguese": "Inglês é fácil."
      }),
      makeCard(136, 4, {
        "type": "phrase",
        "english": "This test is easier than the first test.",
        "portuguese": "Este teste é mais fácil do que o primeiro teste."
      }),
      makeCard(136, 5, {
        "type": "word",
        "english": "Cleaner",
        "portuguese": "Mais limpo, mais limpa (comparativo de *clean*)"
      }),
      makeCard(136, 6, {
        "type": "phrase",
        "english": "Our house is cleaner than the office.",
        "portuguese": "Nossa casa está mais limpa do que o escritório."
      }),
      makeCard(136, 7, {
        "type": "phrase",
        "english": "This city is bigger than that town.",
        "portuguese": "Esta cidade é maior do que aquela cidade pequena."
      }),
      makeCard(136, 8, {
        "type": "phrase",
        "english": "The summer in Brazil is hotter than in Canada.",
        "portuguese": "O verão no Brasil é mais quente do que no Canadá."
      }),
      makeCard(136, 9, {
        "type": "phrase",
        "english": "My brother is funnier than my father.",
        "portuguese": "Meu irmão é mais engraçado do que meu pai."
      }),
      makeCard(136, 10, {
        "type": "phrase",
        "english": "The doctor is busier on Monday than on Friday.",
        "portuguese": "O médico é mais ocupado na segunda do que na sexta-feira."
      }),
      makeCard(136, 11, {
        "type": "phrase",
        "english": "A big city is busier than a quiet town.",
        "portuguese": "Uma cidade grande é mais agitada do que uma cidadezinha tranquila."
      }),
      makeCard(136, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Regras Ortográficas do Comparativo:",
        "grammarRule": {
          "title": "Gramática — Lição 136",
          "explanation": "Regras Ortográficas do Comparativo:",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 137,
    weekNumber: 20,
    blockNumber: 14,
    cefrLevel: 'A1',
    title: "Lição 137 — Comparativos Irregulares: \"Better than\" e \"Worse than\" *(2 palavras novas)*",
    subtitle: "Novas: **Better** (comparativo irregular de *good*: melhor do que), **Worse** (comparativo irregular de *bad*: pior do que).",
    grammarFocus: "Comparativos Irregulares (*Good* e *Bad*): Os dois adjeti...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(137, 1, {
        "type": "word",
        "english": "Better",
        "portuguese": "Melhor, melhor do que (comparativo irregular de *good*)"
      }),
      makeCard(137, 2, {
        "type": "word",
        "english": "Worse",
        "portuguese": "Pior, pior do que (comparativo irregular de *bad*)"
      }),
      makeCard(137, 3, {
        "type": "phrase",
        "english": "This pizza is better than that pasta.",
        "portuguese": "Esta pizza é melhor do que aquela massa."
      }),
      makeCard(137, 4, {
        "type": "phrase",
        "english": "His English is better than my English.",
        "portuguese": "O inglês dele é melhor do que o meu inglês."
      }),
      makeCard(137, 5, {
        "type": "phrase",
        "english": "Traffic today is worse than on Monday.",
        "portuguese": "O trânsito hoje está pior do que na segunda-feira."
      }),
      makeCard(137, 6, {
        "type": "phrase",
        "english": "This coffee is better than that tea.",
        "portuguese": "Este café é melhor do que aquele chá."
      }),
      makeCard(137, 7, {
        "type": "phrase",
        "english": "The cold weather is worse for my health.",
        "portuguese": "O tempo frio é pior para a minha saúde."
      }),
      makeCard(137, 8, {
        "type": "phrase",
        "english": "He plays soccer better than his brother.",
        "portuguese": "Ele joga futebol melhor do que o irmão dele."
      }),
      makeCard(137, 9, {
        "type": "phrase",
        "english": "A sunny day is better than a rainy day.",
        "portuguese": "Um dia ensolarado é melhor do que um dia chuvoso."
      }),
      makeCard(137, 10, {
        "type": "phrase",
        "english": "The new hotel is better than the old hotel.",
        "portuguese": "O hotel novo é melhor do que o hotel antigo."
      }),
      makeCard(137, 11, {
        "type": "phrase",
        "english": "The food here is not worse; it is better.",
        "portuguese": "A comida aqui não é pior; é melhor."
      }),
      makeCard(137, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Comparativos Irregulares (*Good* e *Bad*): Os dois adjetivos mais universais do inglês possuem formas comparativas próprias, que não seguem a terminação *-er*:",
        "grammarRule": {
          "title": "Gramática — Lição 137",
          "explanation": "Comparativos Irregulares (*Good* e *Bad*): Os dois adjetivos mais universais do inglês possuem formas comparativas próprias, que não seguem a terminação *-er*:",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 138,
    weekNumber: 20,
    blockNumber: 14,
    cefrLevel: 'A1',
    title: "Lição 138 — Comparando Cidades, Lugares e Ambientes *(3 palavras novas)*",
    subtitle: "Novas: **Quieter** (comparativo mais silencioso que), **Cheaper** (comparativo mais barato que), **Strong** (adjetivo forte).",
    grammarFocus: "Flexões Comparativas Adicionais: Adjetivos monossilábicos...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(138, 1, {
        "type": "word",
        "english": "Quieter",
        "portuguese": "Mais silencioso, mais quieto (comparativo de *quiet*)"
      }),
      makeCard(138, 2, {
        "type": "word",
        "english": "Cheaper",
        "portuguese": "Mais barato, mais econômica (comparativo de *cheap*)"
      }),
      makeCard(138, 3, {
        "type": "phrase",
        "english": "This small apartment is cheaper than that big house.",
        "portuguese": "Este apartamento pequeno é mais barato do que aquela casa grande."
      }),
      makeCard(138, 4, {
        "type": "phrase",
        "english": "Our bedroom is quieter than the street.",
        "portuguese": "Nosso quarto é mais silencioso do que a rua."
      }),
      makeCard(138, 5, {
        "type": "word",
        "english": "Strong",
        "portuguese": "Forte (adjetivo)"
      }),
      makeCard(138, 6, {
        "type": "phrase",
        "english": "He drinks strong black coffee.",
        "portuguese": "Ele bebe café preto forte."
      }),
      makeCard(138, 7, {
        "type": "phrase",
        "english": "The wind is stronger today.",
        "portuguese": "O vento está mais forte hoje."
      }),
      makeCard(138, 8, {
        "type": "phrase",
        "english": "The bus is cheaper than the train.",
        "portuguese": "O ônibus é mais barato do que o trem."
      }),
      makeCard(138, 9, {
        "type": "phrase",
        "english": "A small town is quieter than a big city.",
        "portuguese": "Uma cidadezinha é mais tranquila do que uma cidade grande."
      }),
      makeCard(138, 10, {
        "type": "phrase",
        "english": "My brother is stronger than me.",
        "portuguese": "Meu irmão é mais forte do que eu."
      }),
      makeCard(138, 11, {
        "type": "phrase",
        "english": "This hotel room is cleaner and quieter.",
        "portuguese": "Este quarto de hotel é mais limpo e silencioso."
      }),
      makeCard(138, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Flexões Comparativas Adicionais: Adjetivos monossilábicos e dissilábicos regulares recebem *-er*: *quiet $\\rightarrow$ quieter than*; *cheap $\\rightarrow$ cheaper than*; *strong $\\rightarrow$ stronger than*. Na linguagem oral cotidiana, após a conjunção *than* emprega-se o pronome objeto (*stronger than me*).",
        "grammarRule": {
          "title": "Gramática — Lição 138",
          "explanation": "Flexões Comparativas Adicionais: Adjetivos monossilábicos e dissilábicos regulares recebem *-er*: *quiet $\\rightarrow$ quieter than*; *cheap $\\rightarrow$ cheaper than*; *strong $\\rightarrow$ stronger than*. Na linguagem oral cotidiana, após a conjunção *than* emprega-se o pronome objeto (*stronger than me*).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 139,
    weekNumber: 20,
    blockNumber: 14,
    cefrLevel: 'A1',
    title: "Lição 139 — Revisão: Comparações Pessoais e Preferências *(2 palavras novas)*",
    subtitle: "Novas: **Friendly** (adjetivo simpático/amigável), **Friendlier** (comparativo mais simpático/mais amigável).",
    grammarFocus: "Padrões de Comparação Direta:",
    isDialogueDay: false,
    isReviewLesson: true,
    cards: [
      makeCard(139, 1, {
        "type": "word",
        "english": "Friendly",
        "portuguese": "Amigável, simpático, amável (adjetivo)"
      }),
      makeCard(139, 2, {
        "type": "word",
        "english": "Friendlier",
        "portuguese": "Mais amigável, mais simpático (comparativo de *friendly*)"
      }),
      makeCard(139, 3, {
        "type": "phrase",
        "english": "The people in this town are very friendly.",
        "portuguese": "As pessoas nesta cidade pequena são muito simpáticas."
      }),
      makeCard(139, 4, {
        "type": "phrase",
        "english": "She is friendlier than her brother.",
        "portuguese": "Ela é mais simpática do que o irmão dela."
      }),
      makeCard(139, 5, {
        "type": "phrase",
        "english": "Gabriel is smarter than Leo, but Leo is funnier.",
        "portuguese": "Gabriel é mais inteligente do que Leo, mas Leo é mais engraçado."
      }),
      makeCard(139, 6, {
        "type": "phrase",
        "english": "My car is newer than your car.",
        "portuguese": "Meu carro é mais novo do que o seu carro."
      }),
      makeCard(139, 7, {
        "type": "phrase",
        "english": "His house is bigger and warmer.",
        "portuguese": "A casa dele é maior e mais aquecida."
      }),
      makeCard(139, 8, {
        "type": "phrase",
        "english": "Who is taller: David or Daniel?",
        "portuguese": "Quem é mais alto: David ou Daniel?"
      }),
      makeCard(139, 9, {
        "type": "phrase",
        "english": "David is taller than Daniel.",
        "portuguese": "David é mais alto do que Daniel."
      }),
      makeCard(139, 10, {
        "type": "phrase",
        "english": "Our new teacher is friendlier and kinder.",
        "portuguese": "Nosso novo professor é mais simpático e mais gentil."
      }),
      makeCard(139, 11, {
        "type": "phrase",
        "english": "Life in a small town is quieter and cheaper.",
        "portuguese": "A vida em uma cidade pequena é mais tranquila e mais barata."
      }),
      makeCard(139, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Padrões de Comparação Direta:",
        "grammarRule": {
          "title": "Gramática — Lição 139",
          "explanation": "Padrões de Comparação Direta:",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 140,
    weekNumber: 20,
    blockNumber: 14,
    cefrLevel: 'A1',
    title: "Lição 140 — Fechamento do Bloco 14: História 2 — Dois Amigos e Duas Vidas",
    subtitle: "Lição 140 do nível A1",
    grammarFocus: "Fechamento do Bloco 14: História 2 — Dois Amigos e Duas Vidas",
    isDialogueDay: true,
    isReviewLesson: false,
    cards: [
      makeCard(140, 1, {
        "type": "phrase",
        "english": "Gabriel and Leo are two good friends from Brazil.",
        "portuguese": "Gabriel e Leo são dois bons amigos do Brasil."
      }),
      makeCard(140, 2, {
        "type": "phrase",
        "english": "Gabriel is twenty-eight years old, and Leo is twenty-five.",
        "portuguese": "Gabriel tem vinte e oito anos de idade, e Leo tem vinte e cinco."
      }),
      makeCard(140, 3, {
        "type": "phrase",
        "english": "Gabriel is three years older than Leo.",
        "portuguese": "Gabriel é três anos mais velho do que Leo."
      }),
      makeCard(140, 4, {
        "type": "phrase",
        "english": "Gabriel is very tall, and he has short dark hair and brown eyes.",
        "portuguese": "Gabriel é muito alto, e tem cabelo escuro curto e olhos castanhos."
      }),
      makeCard(140, 5, {
        "type": "phrase",
        "english": "Leo is shorter than Gabriel, and he has blonde hair and green eyes.",
        "portuguese": "Leo é mais baixo do que Gabriel, e tem cabelo loiro e olhos verdes."
      }),
      makeCard(140, 6, {
        "type": "phrase",
        "english": "Gabriel is an engineer, and he is very smart and kind.",
        "portuguese": "Gabriel é engenheiro, e ele é muito inteligente e gentil."
      }),
      makeCard(140, 7, {
        "type": "phrase",
        "english": "Leo is a chef, and he is funnier and friendlier.",
        "portuguese": "Leo é chef de cozinha, e ele é mais engraçado e mais simpático."
      }),
      makeCard(140, 8, {
        "type": "phrase",
        "english": "Gabriel's apartment is in a big city near his office.",
        "portuguese": "O apartamento do Gabriel fica em uma cidade grande perto do escritório dele."
      }),
      makeCard(140, 9, {
        "type": "phrase",
        "english": "Leo's house is in a quiet town near the beach.",
        "portuguese": "A casa do Leo fica em uma cidadezinha tranquila perto da praia."
      }),
      makeCard(140, 10, {
        "type": "phrase",
        "english": "Gabriel's apartment is smaller, but it is near his office.",
        "portuguese": "O apartamento do Gabriel é menor, mas fica perto do escritório dele."
      }),
      makeCard(140, 11, {
        "type": "phrase",
        "english": "Leo's house is bigger, quieter and cheaper than Gabriel's apartment.",
        "portuguese": "A casa do Leo é maior, mais silenciosa e mais barata do que o apartamento do Gabriel."
      }),
      makeCard(140, 12, {
        "type": "phrase",
        "english": "In the summer, Gabriel drives his car to Leo's house on the weekend.",
        "portuguese": "No verão, Gabriel dirige o carro dele até a casa do Leo no fim de semana."
      }),
      makeCard(140, 13, {
        "type": "phrase",
        "english": "Leo cooks delicious pasta and chicken for his friend.",
        "portuguese": "Leo cozinha massa e frango deliciosos para o amigo dele."
      }),
      makeCard(140, 14, {
        "type": "phrase",
        "english": "Gabriel's life is busier, but Leo's life is quieter and healthier.",
        "portuguese": "A vida do Gabriel é mais agitada, mas a vida do Leo é mais tranquila e saudável."
      }),
      makeCard(140, 15, {
        "type": "phrase",
        "english": "They love their lives, and they are very good friends.",
        "portuguese": "Eles amam as suas vidas, e são muito bons amigos."
      })
    ]
  },
  {
    dayNumber: 141,
    weekNumber: 21,
    blockNumber: 15,
    cefrLevel: 'A1',
    title: "Lição 141 — Passado do Verbo To Be: \"Was\" e \"Were\" (Afirmativa) *(3 palavras novas)*",
    subtitle: "Novas: **Was** (passado de *am/is* para *I, he, she, it*), **Were** (passado de *are* para *you, we, they*), **Yesterday** (advérbio temporal ontem).",
    grammarFocus: "O Passado do Verbo To Be: No Simple Past afirmativo, o ve...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(141, 1, {
        "type": "word",
        "english": "Was",
        "portuguese": "Era, estava, foi (passado de *am* e *is* para *I, he, she, it*)"
      }),
      makeCard(141, 2, {
        "type": "word",
        "english": "Yesterday",
        "portuguese": "Ontem (advérbio temporal)"
      }),
      makeCard(141, 3, {
        "type": "phrase",
        "english": "I was at home yesterday.",
        "portuguese": "Eu estava em casa ontem."
      }),
      makeCard(141, 4, {
        "type": "phrase",
        "english": "He was tired yesterday evening.",
        "portuguese": "Ele estava cansado ontem à noite."
      }),
      makeCard(141, 5, {
        "type": "word",
        "english": "Were",
        "portuguese": "Eram, estavam, fomos, foram, era, estava (passado de *are* para *you, we, they*)"
      }),
      makeCard(141, 6, {
        "type": "phrase",
        "english": "We were very happy.",
        "portuguese": "Nós estávamos muito felizes."
      }),
      makeCard(141, 7, {
        "type": "phrase",
        "english": "They were at the restaurant yesterday.",
        "portuguese": "Eles estavam no restaurante ontem."
      }),
      makeCard(141, 8, {
        "type": "phrase",
        "english": "You were in the office yesterday.",
        "portuguese": "Você estava no escritório ontem."
      }),
      makeCard(141, 9, {
        "type": "phrase",
        "english": "She was a student in Canada.",
        "portuguese": "Ela era estudante no Canadá."
      }),
      makeCard(141, 10, {
        "type": "phrase",
        "english": "The weather was hot and sunny yesterday.",
        "portuguese": "O tempo estava quente e ensolarado ontem."
      }),
      makeCard(141, 11, {
        "type": "phrase",
        "english": "The train was on time.",
        "portuguese": "O trem estava no horário."
      }),
      makeCard(141, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "O Passado do Verbo To Be: No Simple Past afirmativo, o verbo *To Be* possui apenas duas formas:",
        "grammarRule": {
          "title": "Gramática — Lição 141",
          "explanation": "O Passado do Verbo To Be: No Simple Past afirmativo, o verbo *To Be* possui apenas duas formas:",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 142,
    weekNumber: 21,
    blockNumber: 15,
    cefrLevel: 'A1',
    title: "Lição 142 — Passado do Verbo To Be: Negação (\"Wasn't\" e \"Weren't\") e Perguntas *(3 palavras novas)*",
    subtitle: "Novas: **Wasn't** (forma negativa de *was*), **Weren't** (forma negativa de *were*), **Last** (adjetivo temporal passado/último).",
    grammarFocus: "Negações e Perguntas com Was/Were:",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(142, 1, {
        "type": "word",
        "english": "Wasn't",
        "portuguese": "Não era, não estava (contração de *was not*)"
      }),
      makeCard(142, 2, {
        "type": "word",
        "english": "Last",
        "portuguese": "Passado, passada, último, última (marcador temporal)"
      }),
      makeCard(142, 3, {
        "type": "phrase",
        "english": "I wasn't at work yesterday.",
        "portuguese": "Eu não estava no trabalho ontem."
      }),
      makeCard(142, 4, {
        "type": "phrase",
        "english": "He was not at home last night.",
        "portuguese": "Ele não estava em casa ontem à noite."
      }),
      makeCard(142, 5, {
        "type": "word",
        "english": "Weren't",
        "portuguese": "Não eram, não estavam (contração de *were not*)"
      }),
      makeCard(142, 6, {
        "type": "phrase",
        "english": "We weren't hungry.",
        "portuguese": "Nós não estávamos com fome."
      }),
      makeCard(142, 7, {
        "type": "phrase",
        "english": "Were you at the hotel last weekend?",
        "portuguese": "Você estava no hotel no último fim de semana?"
      }),
      makeCard(142, 8, {
        "type": "phrase",
        "english": "Yes, I was.",
        "portuguese": "Sim, eu estava."
      }),
      makeCard(142, 9, {
        "type": "phrase",
        "english": "No, I wasn't.",
        "portuguese": "Não, eu não estava."
      }),
      makeCard(142, 10, {
        "type": "phrase",
        "english": "Was she tired after work?",
        "portuguese": "Ela estava cansada depois do trabalho?"
      }),
      makeCard(142, 11, {
        "type": "phrase",
        "english": "Yes, she was.",
        "portuguese": "Sim, ela estava."
      }),
      makeCard(142, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Negações e Perguntas com Was/Were:",
        "grammarRule": {
          "title": "Gramática — Lição 142",
          "explanation": "Negações e Perguntas com Was/Were:",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 143,
    weekNumber: 21,
    blockNumber: 15,
    cefrLevel: 'A1',
    title: "Lição 143 — Revisão: Marcadores Temporais do Passado e \"Ago\" *(2 palavras novas)*",
    subtitle: "Novas: **Ago** (advérbio temporal atrás/faz tempo), **Month** (substantivo mês, plural: *months*).",
    grammarFocus: "O Advérbio **Ago**: Posiciona-se **obrigatoriamente após*...",
    isDialogueDay: false,
    isReviewLesson: true,
    cards: [
      makeCard(143, 1, {
        "type": "word",
        "english": "Ago",
        "portuguese": "Atrás, faz (advérbio pós-posto de tempo decorrido)"
      }),
      makeCard(143, 2, {
        "type": "word",
        "english": "Month",
        "portuguese": "Mês (plural: *months*)"
      }),
      makeCard(143, 3, {
        "type": "phrase",
        "english": "I was in Brazil two months ago.",
        "portuguese": "Eu estava no Brasil dois meses atrás."
      }),
      makeCard(143, 4, {
        "type": "phrase",
        "english": "She was here ten minutes ago.",
        "portuguese": "Ela estava aqui dez minutos atrás."
      }),
      makeCard(143, 5, {
        "type": "phrase",
        "english": "We were at the airport three hours ago.",
        "portuguese": "Nós estávamos no aeroporto três horas atrás."
      }),
      makeCard(143, 6, {
        "type": "phrase",
        "english": "He was in England last month.",
        "portuguese": "Ele estava na Inglaterra no mês passado."
      }),
      makeCard(143, 7, {
        "type": "phrase",
        "english": "Were you at school yesterday morning?",
        "portuguese": "Você estava na escola ontem de manhã?"
      }),
      makeCard(143, 8, {
        "type": "phrase",
        "english": "No, I wasn't. I was at home.",
        "portuguese": "Não, não estava. Eu estava em casa."
      }),
      makeCard(143, 9, {
        "type": "phrase",
        "english": "My brother was in New York last year.",
        "portuguese": "Meu irmão estava em Nova York no ano passado."
      }),
      makeCard(143, 10, {
        "type": "phrase",
        "english": "The food was delicious, but the bill was expensive.",
        "portuguese": "A comida estava deliciosa, mas a conta foi cara."
      }),
      makeCard(143, 11, {
        "type": "phrase",
        "english": "They were busy two days ago.",
        "portuguese": "Eles estavam ocupados dois dias atrás."
      }),
      makeCard(143, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "O Advérbio **Ago**: Posiciona-se **obrigatoriamente após** o período de tempo decorrido (*two days ago* = dois dias atrás; *three months ago* = há três meses; *ten minutes ago* = dez minutos atrás). O substantivo *month* forma plural regular com acréscimo de *-s* (*months*).",
        "grammarRule": {
          "title": "Gramática — Lição 143",
          "explanation": "O Advérbio **Ago**: Posiciona-se **obrigatoriamente após** o período de tempo decorrido (*two days ago* = dois dias atrás; *three months ago* = há três meses; *ten minutes ago* = dez minutos atrás). O substantivo *month* forma plural regular com acréscimo de *-s* (*months*).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 144,
    weekNumber: 21,
    blockNumber: 15,
    cefrLevel: 'A1',
    title: "Lição 144 — Passado Simples Regular: A Regra Geral do \"-ed\" *(Ativação Morfológica)*",
    subtitle: "Novas: Ativação das formas de passado regular com sufixo **-ed** no contador morfológico. Verbos de prática: **Worked**, **Walked**, **Cooked**, **Cleaned**.",
    grammarFocus: "A Regra Geral do **-ed**: No Simple Past, a grande maiori...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(144, 1, {
        "type": "word",
        "english": "Worked",
        "portuguese": "Trabalhou, trabalhei, trabalhamos, trabalharam (passado de *work*)"
      }),
      makeCard(144, 2, {
        "type": "word",
        "english": "Walked",
        "portuguese": "Caminhou, caminhei, caminhamos, caminharam (passado de *walk*)"
      }),
      makeCard(144, 3, {
        "type": "phrase",
        "english": "I worked yesterday.",
        "portuguese": "Eu trabalhei ontem."
      }),
      makeCard(144, 4, {
        "type": "phrase",
        "english": "He walked to work this morning.",
        "portuguese": "Ele caminhou para o trabalho hoje de manhã."
      }),
      makeCard(144, 5, {
        "type": "word",
        "english": "Cooked",
        "portuguese": "Cozinhou, cozinhei, cozinhamos (passado de *cook*)"
      }),
      makeCard(144, 6, {
        "type": "word",
        "english": "Cleaned",
        "portuguese": "Limpou, limpei, limpamos (passado de *clean*)"
      }),
      makeCard(144, 7, {
        "type": "phrase",
        "english": "She cooked dinner for her family.",
        "portuguese": "Ela cozinhou o jantar para a família dela."
      }),
      makeCard(144, 8, {
        "type": "phrase",
        "english": "My brother cleaned the house last Saturday.",
        "portuguese": "Meu irmão limpou a casa no sábado passado."
      }),
      makeCard(144, 9, {
        "type": "phrase",
        "english": "We played soccer yesterday afternoon.",
        "portuguese": "Nós jogamos futebol ontem à tarde."
      }),
      makeCard(144, 10, {
        "type": "phrase",
        "english": "They watched videos on the computer.",
        "portuguese": "Eles assistiram a vídeos no computador."
      }),
      makeCard(144, 11, {
        "type": "phrase",
        "english": "She visited her mother two days ago.",
        "portuguese": "Ela visitou a mãe dela dois dias atrás."
      }),
      makeCard(144, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "A Regra Geral do **-ed**: No Simple Past, a grande maioria dos verbos regulares em inglês recebe o sufixo **-ed** (*work $\\rightarrow$ worked, walk $\\rightarrow$ walked, cook $\\rightarrow$ cooked, clean $\\rightarrow$ cleaned, play $\\rightarrow$ played, visit $\\rightarrow$ visited*). A mesma forma verbal serve para todos os sujeitos sem exceção (*I worked, she worked, they worked*).",
        "grammarRule": {
          "title": "Gramática — Lição 144",
          "explanation": "A Regra Geral do **-ed**: No Simple Past, a grande maioria dos verbos regulares em inglês recebe o sufixo **-ed** (*work $\\rightarrow$ worked, walk $\\rightarrow$ walked, cook $\\rightarrow$ cooked, clean $\\rightarrow$ cleaned, play $\\rightarrow$ played, visit $\\rightarrow$ visited*). A mesma forma verbal serve para todos os sujeitos sem exceção (*I worked, she worked, they worked*).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 145,
    weekNumber: 21,
    blockNumber: 15,
    cefrLevel: 'A1',
    title: "Lição 145 — Variações Ortográficas do Passado Regular (-d e -ied) *(2 palavras novas)*",
    subtitle: "Novas: Verbos regulares em passado com variações: **Lived** (passado de *live*), **Studied** (passado de *study*).",
    grammarFocus: "Variações Ortográficas do Passado Regular:",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(145, 1, {
        "type": "word",
        "english": "Lived",
        "portuguese": "Morou, morei, moramos, moraram (passado de *live*)"
      }),
      makeCard(145, 2, {
        "type": "word",
        "english": "Studied",
        "portuguese": "Estudou, estudei, estudamos (passado de *study*)"
      }),
      makeCard(145, 3, {
        "type": "phrase",
        "english": "I lived in Canada for two years.",
        "portuguese": "Eu morei no Canadá por dois anos."
      }),
      makeCard(145, 4, {
        "type": "phrase",
        "english": "She studied English at the university.",
        "portuguese": "Ela estudou inglês na universidade."
      }),
      makeCard(145, 5, {
        "type": "phrase",
        "english": "The train arrived on time yesterday.",
        "portuguese": "O trem chegou no horário ontem."
      }),
      makeCard(145, 6, {
        "type": "phrase",
        "english": "We danced to the music.",
        "portuguese": "Nós dançamos com a música."
      }),
      makeCard(145, 7, {
        "type": "phrase",
        "english": "He liked the food at the restaurant.",
        "portuguese": "Ele gostou da comida no restaurante."
      }),
      makeCard(145, 8, {
        "type": "phrase",
        "english": "My sister arrived at the airport two hours ago.",
        "portuguese": "Minha irmã chegou ao aeroporto duas horas atrás."
      }),
      makeCard(145, 9, {
        "type": "phrase",
        "english": "They studied medicine together.",
        "portuguese": "Eles estudaram medicina juntos."
      }),
      makeCard(145, 10, {
        "type": "phrase",
        "english": "I loved the city of New York.",
        "portuguese": "Eu amei a cidade de Nova York."
      }),
      makeCard(145, 11, {
        "type": "phrase",
        "english": "He carried a big backpack to school.",
        "portuguese": "Ele carregou uma mochila grande para a escola."
      }),
      makeCard(145, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Variações Ortográficas do Passado Regular:",
        "grammarRule": {
          "title": "Gramática — Lição 145",
          "explanation": "Variações Ortográficas do Passado Regular:",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 146,
    weekNumber: 21,
    blockNumber: 15,
    cefrLevel: 'A1',
    title: "Lição 146 — Revisão: Negação no Passado com \"Didn't\" *(1 palavra nova)*",
    subtitle: "Novas: **Didn't** (verbo auxiliar negativo do passado simples para todas as pessoas).",
    grammarFocus: "A Regra de Ouro da Negação com **Didn't**: Para formar fr...",
    isDialogueDay: false,
    isReviewLesson: true,
    cards: [
      makeCard(146, 1, {
        "type": "word",
        "english": "Didn't",
        "portuguese": "Não (verbo auxiliar negativo do passado, contração de *did not*)"
      }),
      makeCard(146, 2, {
        "type": "phrase",
        "english": "I didn't work yesterday.",
        "portuguese": "Eu não trabalhei ontem."
      }),
      makeCard(146, 3, {
        "type": "phrase",
        "english": "She didn't study for the test.",
        "portuguese": "Ela não estudou para o teste."
      }),
      makeCard(146, 4, {
        "type": "phrase",
        "english": "He didn't clean his room last weekend.",
        "portuguese": "Ele não limpou o quarto dele no último fim de semana."
      }),
      makeCard(146, 5, {
        "type": "phrase",
        "english": "We didn't live in England; we lived in Brazil.",
        "portuguese": "Nós não moramos na Inglaterra; nós moramos no Brasil."
      }),
      makeCard(146, 6, {
        "type": "phrase",
        "english": "They didn't arrive on time.",
        "portuguese": "Eles não chegaram no horário."
      }),
      makeCard(146, 7, {
        "type": "phrase",
        "english": "I didn't like the cold soup.",
        "portuguese": "Eu não gostei da sopa fria."
      }),
      makeCard(146, 8, {
        "type": "phrase",
        "english": "My father didn't drive to work yesterday.",
        "portuguese": "Meu pai não dirigiu para o trabalho ontem."
      }),
      makeCard(146, 9, {
        "type": "phrase",
        "english": "She didn't visit her doctor last week.",
        "portuguese": "Ela não visitou o médico dela na semana passada."
      }),
      makeCard(146, 10, {
        "type": "phrase",
        "english": "We didn't play soccer because it was rainy.",
        "portuguese": "Nós não jogamos futebol porque estava chuvoso."
      }),
      makeCard(146, 11, {
        "type": "phrase",
        "english": "I didn't hear the phone.",
        "portuguese": "Eu não ouvi o telefone."
      }),
      makeCard(146, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "A Regra de Ouro da Negação com **Didn't**: Para formar frases negativas no passado, empregamos o auxiliar **didn't** (*did not*) antes do verbo. Como o auxiliar *didn't* já carrega a flexão do passado, o verbo principal **retorna compulsoriamente à forma base de infinitivo sem \"to\"**: *I worked $\\rightarrow$ I didn't work* (errado: *I didn't worked*); *She arrived $\\rightarrow$ She didn't arrive* (errado: *She didn't arrived*).",
        "grammarRule": {
          "title": "Gramática — Lição 146",
          "explanation": "A Regra de Ouro da Negação com **Didn't**: Para formar frases negativas no passado, empregamos o auxiliar **didn't** (*did not*) antes do verbo. Como o auxiliar *didn't* já carrega a flexão do passado, o verbo principal **retorna compulsoriamente à forma base de infinitivo sem \"to\"**: *I worked $\\rightarrow$ I didn't work* (errado: *I didn't worked*); *She arrived $\\rightarrow$ She didn't arrive* (errado: *She didn't arrived*).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 147,
    weekNumber: 21,
    blockNumber: 15,
    cefrLevel: 'A1',
    title: "Lição 147 — Perguntas no Passado com \"Did\" e Respostas Curtas *(1 palavra nova)*",
    subtitle: "Novas: **Did** (verbo auxiliar interrogativo do passado simples).",
    grammarFocus: "Perguntas e Respostas Curtas no Passado com **Did**:",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(147, 1, {
        "type": "word",
        "english": "Did",
        "portuguese": "Verbo auxiliar para formular perguntas no passado (com todos os sujeitos)"
      }),
      makeCard(147, 2, {
        "type": "phrase",
        "english": "Did you work yesterday?",
        "portuguese": "Você trabalhou ontem?"
      }),
      makeCard(147, 3, {
        "type": "phrase",
        "english": "Yes, I did.",
        "portuguese": "Sim, trabalhei."
      }),
      makeCard(147, 4, {
        "type": "phrase",
        "english": "No, I didn't.",
        "portuguese": "Não, não trabalhei."
      }),
      makeCard(147, 5, {
        "type": "phrase",
        "english": "Did he study English at the school?",
        "portuguese": "Ele estudou inglês na escola?"
      }),
      makeCard(147, 6, {
        "type": "phrase",
        "english": "Yes, he did.",
        "portuguese": "Sim, estudou."
      }),
      makeCard(147, 7, {
        "type": "phrase",
        "english": "No, he didn't.",
        "portuguese": "Não, não estudou."
      }),
      makeCard(147, 8, {
        "type": "phrase",
        "english": "Did they arrive at the station on time?",
        "portuguese": "Eles chegaram à estação no horário?"
      }),
      makeCard(147, 9, {
        "type": "phrase",
        "english": "Yes, they did. The train was fast.",
        "portuguese": "Sim, chegaram. O trem foi rápido."
      }),
      makeCard(147, 10, {
        "type": "phrase",
        "english": "Did she cook dinner yesterday evening?",
        "portuguese": "Ela cozinhou o jantar ontem à noite?"
      }),
      makeCard(147, 11, {
        "type": "phrase",
        "english": "No, she didn't. She was tired.",
        "portuguese": "Não, não cozinhou. Ela estava cansada."
      }),
      makeCard(147, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Perguntas e Respostas Curtas no Passado com **Did**:",
        "grammarRule": {
          "title": "Gramática — Lição 147",
          "explanation": "Perguntas e Respostas Curtas no Passado com **Did**:",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 148,
    weekNumber: 22,
    blockNumber: 15,
    cefrLevel: 'A1',
    title: "Lição 148 — Perguntas Abertas no Passado (Wh- + Did) *(Prática Integrada)*",
    subtitle: "Lição 148 do nível A1",
    grammarFocus: "Estrutura de Perguntas Abertas no Passado: **Question Wor...",
    isDialogueDay: false,
    isReviewLesson: false,
    cards: [
      makeCard(148, 1, {
        "type": "phrase",
        "english": "Where did you live two years ago?",
        "portuguese": "Onde você morava dois anos atrás?"
      }),
      makeCard(148, 2, {
        "type": "phrase",
        "english": "I lived in a small town in Brazil.",
        "portuguese": "Eu morava em uma cidade pequena no Brasil."
      }),
      makeCard(148, 3, {
        "type": "phrase",
        "english": "What did you study at the university?",
        "portuguese": "O que você estudou na universidade?"
      }),
      makeCard(148, 4, {
        "type": "phrase",
        "english": "I studied medicine.",
        "portuguese": "Eu estudei medicina."
      }),
      makeCard(148, 5, {
        "type": "phrase",
        "english": "When did the flight arrive?",
        "portuguese": "Quando o voo chegou?"
      }),
      makeCard(148, 6, {
        "type": "phrase",
        "english": "It arrived at eight o'clock in the morning.",
        "portuguese": "Ele chegou às oito horas da manhã."
      }),
      makeCard(148, 7, {
        "type": "phrase",
        "english": "Why did you stay at home yesterday?",
        "portuguese": "Por que você ficou em casa ontem?"
      }),
      makeCard(148, 8, {
        "type": "phrase",
        "english": "Because I was very tired.",
        "portuguese": "Porque eu estava muito cansado."
      }),
      makeCard(148, 9, {
        "type": "phrase",
        "english": "How did you travel to the beach?",
        "portuguese": "Como vocês viajaram para a praia?"
      }),
      makeCard(148, 10, {
        "type": "phrase",
        "english": "We traveled by car.",
        "portuguese": "Nós viajamos de carro."
      }),
      makeCard(148, 11, {
        "type": "phrase",
        "english": "Why did she leave the office early?",
        "portuguese": "Por que ela saiu do escritório cedo?"
      }),
      makeCard(148, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "Estrutura de Perguntas Abertas no Passado: **Question Word + Did + Sujeito + Verbo Base...?** (*Where did you live? When did they arrive?*). Na resposta completa afirmativa, o verbo assume a forma flexionada regular de passado (*I lived, It arrived, We traveled*).",
        "grammarRule": {
          "title": "Gramática — Lição 148",
          "explanation": "Estrutura de Perguntas Abertas no Passado: **Question Word + Did + Sujeito + Verbo Base...?** (*Where did you live? When did they arrive?*). Na resposta completa afirmativa, o verbo assume a forma flexionada regular de passado (*I lived, It arrived, We traveled*).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 149,
    weekNumber: 22,
    blockNumber: 15,
    cefrLevel: 'A1',
    title: "Lição 149 — Revisão: O Verbo \"Call\" e Conexões Narrativas de Passado *(2 palavras novas)*",
    subtitle: "Novas: **Call** (verbo ligar/telefonar/chamar), **Called** (passado regular ligou/liguei/chamou).",
    grammarFocus: "O Verbo **Call** e Cadeias de Ações no Passado: O verbo *...",
    isDialogueDay: false,
    isReviewLesson: true,
    cards: [
      makeCard(149, 1, {
        "type": "word",
        "english": "Call",
        "portuguese": "Ligar, telefonar, chamar"
      }),
      makeCard(149, 2, {
        "type": "word",
        "english": "Called",
        "portuguese": "Ligou, telefonei, chamamos, chamaram (passado regular de *call*)"
      }),
      makeCard(149, 3, {
        "type": "phrase",
        "english": "I called my mother yesterday.",
        "portuguese": "Eu liguei para a minha mãe ontem."
      }),
      makeCard(149, 4, {
        "type": "phrase",
        "english": "She called the hotel two days ago.",
        "portuguese": "Ela ligou para o hotel dois dias atrás."
      }),
      makeCard(149, 5, {
        "type": "phrase",
        "english": "Did you call the doctor?",
        "portuguese": "Você ligou para o médico?"
      }),
      makeCard(149, 6, {
        "type": "phrase",
        "english": "Yes, I called his office this morning.",
        "portuguese": "Sim, eu liguei para o consultório dele esta manhã."
      }),
      makeCard(149, 7, {
        "type": "phrase",
        "english": "He didn't call his brother last week.",
        "portuguese": "Ele não ligou para o irmão dele na semana passada."
      }),
      makeCard(149, 8, {
        "type": "phrase",
        "english": "We stayed at the hotel and called our family.",
        "portuguese": "Nós ficamos no hotel e ligamos para a nossa família."
      }),
      makeCard(149, 9, {
        "type": "phrase",
        "english": "First, we arrived at the airport, and then we took the subway.",
        "portuguese": "Primeiro, nós chegamos ao aeroporto e, depois, pegamos o metrô."
      }),
      makeCard(149, 10, {
        "type": "phrase",
        "english": "She called my name in the street.",
        "portuguese": "Ela chamou o meu nome na rua."
      }),
      makeCard(149, 11, {
        "type": "phrase",
        "english": "The trip was very good, and we relaxed.",
        "portuguese": "A viagem foi muito boa, e nós relaxamos."
      }),
      makeCard(149, 12, {
        "type": "grammar",
        "english": "Gramática — Regra",
        "portuguese": "O Verbo **Call** e Cadeias de Ações no Passado: O verbo *call* segue a regra geral acrescentando **-ed** (*call $\\rightarrow$ called*). Para narrar acontecimentos em ordem cronológica no passado, conectamos as frases com marcadores de sequência como *first* (primeiro), *then* (então/depois) e *and* (e), mantendo todos os verbos no tempo passado (*We arrived, took the subway, and called our family*).",
        "grammarRule": {
          "title": "Gramática — Lição 149",
          "explanation": "O Verbo **Call** e Cadeias de Ações no Passado: O verbo *call* segue a regra geral acrescentando **-ed** (*call $\\rightarrow$ called*). Para narrar acontecimentos em ordem cronológica no passado, conectamos as frases com marcadores de sequência como *first* (primeiro), *then* (então/depois) e *and* (e), mantendo todos os verbos no tempo passado (*We arrived, took the subway, and called our family*).",
          "examples": []
        }
      })
    ]
  },
  {
    dayNumber: 150,
    weekNumber: 22,
    blockNumber: 15,
    cefrLevel: 'A1',
    title: "Lição 150 — Fechamento do Bloco 15 & Grande Fechamento do Nível A1: Grande História 3 — A Viagem Inesquecível a Nova York",
    subtitle: "Lição 150 do nível A1",
    grammarFocus: "Fechamento do Bloco 15 & Grande Fechamento do Nível A1: Grande História 3 — A Viagem Inesquecível a Nova York",
    isDialogueDay: true,
    isReviewLesson: false,
    cards: [
      makeCard(150, 1, {
        "type": "phrase",
        "english": "Last month, Lucas traveled to New York with his sister, Mariana.",
        "portuguese": "No mês passado, Lucas viajou para Nova York com a irmã dele, Mariana."
      }),
      makeCard(150, 2, {
        "type": "phrase",
        "english": "Lucas is twenty-six years old, and Mariana is twenty-four.",
        "portuguese": "Lucas tem vinte e seis anos de idade, e Mariana tem vinte e quatro."
      }),
      makeCard(150, 3, {
        "type": "phrase",
        "english": "They were very happy because it was their big trip to the United States.",
        "portuguese": "Eles estavam muito felizes porque era a grande viagem deles aos Estados Unidos."
      }),
      makeCard(150, 4, {
        "type": "phrase",
        "english": "They arrived at the airport at eight o'clock in the morning.",
        "portuguese": "Eles chegaram ao aeroporto às oito horas da manhã."
      }),
      makeCard(150, 5, {
        "type": "phrase",
        "english": "The weather in New York was cool, sunny and beautiful.",
        "portuguese": "O tempo em Nova York estava fresco, ensolarado e lindo."
      }),
      makeCard(150, 6, {
        "type": "phrase",
        "english": "Lucas carried their big suitcases, and Mariana had their tickets and passports.",
        "portuguese": "Lucas carregou as malas grandes deles, e Mariana estava com as passagens e passaportes."
      }),
      makeCard(150, 7, {
        "type": "phrase",
        "english": "First, they took the train from the airport to the city station.",
        "portuguese": "Primeiro, eles pegaram o trem do aeroporto para a estação da cidade."
      }),
      makeCard(150, 8, {
        "type": "phrase",
        "english": "Then, they walked on foot for ten minutes to their hotel.",
        "portuguese": "Depois, eles caminharam a pé por dez minutos até o hotel deles."
      }),
      makeCard(150, 9, {
        "type": "phrase",
        "english": "Their hotel room was clean, quiet and warm.",
        "portuguese": "O quarto de hotel deles era limpo, silencioso e acolhedor."
      }),
      makeCard(150, 10, {
        "type": "phrase",
        "english": "In the afternoon, they walked in the park and watched the children play.",
        "portuguese": "À tarde, eles caminharam no parque e observaram as crianças brincar."
      }),
      makeCard(150, 11, {
        "type": "phrase",
        "english": "Mariana loved the red flowers and green trees.",
        "portuguese": "Mariana amou as flores vermelhas e as árvores verdes."
      }),
      makeCard(150, 12, {
        "type": "phrase",
        "english": "In the evening, they visited an Italian restaurant near the hotel.",
        "portuguese": "À noite, eles visitaram um restaurante italiano perto do hotel."
      }),
      makeCard(150, 13, {
        "type": "phrase",
        "english": "The waiter was very polite, and Lucas ordered chicken with rice and fresh vegetables.",
        "portuguese": "O garçom foi muito educado, e Lucas pediu frango com arroz e legumes frescos."
      }),
      makeCard(150, 14, {
        "type": "phrase",
        "english": "Mariana would like delicious pasta with a glass of red wine.",
        "portuguese": "Mariana pediu uma massa deliciosa com uma taça de vinho tinto."
      }),
      makeCard(150, 15, {
        "type": "phrase",
        "english": "They didn't eat fast food because they prefer healthy food.",
        "portuguese": "Eles não comeram fast food porque preferem comida saudável."
      }),
      makeCard(150, 16, {
        "type": "phrase",
        "english": "After dinner, they ordered sweet cake for dessert and the bill was forty dollars.",
        "portuguese": "Depois do jantar, eles pediram bolo doce de sobremesa e a conta deu quarenta dólares."
      }),
      makeCard(150, 17, {
        "type": "phrase",
        "english": "Lucas left a five-dollar tip for the waiter.",
        "portuguese": "Lucas deixou uma gorjeta de cinco dólares para o garçom."
      }),
      makeCard(150, 18, {
        "type": "phrase",
        "english": "Yesterday, they called their parents in Brazil and spoke about the trip.",
        "portuguese": "Ontem, eles ligaram para os pais deles no Brasil e falaram sobre a viagem."
      }),
      makeCard(150, 19, {
        "type": "phrase",
        "english": "Lucas and Mariana studied English, practiced every day and now speak English very well.",
        "portuguese": "Lucas e Mariana estudaram inglês, praticaram todos os dias e agora falam inglês muito bem."
      }),
      makeCard(150, 20, {
        "type": "phrase",
        "english": "Now, they speak English, understand people and love their life.",
        "portuguese": "Agora, eles falam inglês, entendem as pessoas e amam a vida deles."
      }),
      makeCard(150, 21, {
        "type": "phrase",
        "english": "Congratulations! You completed the Level A1 curriculum with fluency!",
        "portuguese": "Parabéns! Você concluiu o currículo do Nível A1 com fluência!"
      })
    ]
  }
];

export const INITIAL_STUDY_DAYS: StudyDayLesson[] = [
  ...BLOCK_ONE_LESSONS,
  ...ORIGINAL_STUDY_DAYS.filter((lesson) => lesson.dayNumber >= 11).map((original) => {
    const lesson = REVIEWED_A1_LESSONS.find((reviewed) => reviewed.dayNumber === original.dayNumber) ?? original;
    const dayNumber = lesson.dayNumber + 2;
    return {
      ...lesson,
      dayNumber,
      weekNumber: Math.ceil(dayNumber / 7),
      title: lesson.title.replace(/^(?:Dia|Lição) \d+/, `Lição ${dayNumber}`),
      cards: lesson.cards.map((card) => ({ ...card, dayNumber })),
    };
  }),
];
