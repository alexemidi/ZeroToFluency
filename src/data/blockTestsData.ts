import { BlockTestQuestion, BlockTestSkill } from '../types';
import { BLOCK_ONE_LESSONS } from './blockOneLessons';

export interface BlockMeta {
  blockNumber: number;
  title: string;
  theme: string;
  lessonRange: [number, number];
  grammarTopics: string;
}

export const A1_BLOCKS_METADATA: BlockMeta[] = [
  {
    blockNumber: 1,
    title: "Bloco 1 — Fundamentos da Frase",
    theme: "Artigos, Substantivos e To Be Afirmativo",
    lessonRange: [1, 11],
    grammarTopics: "Artigos definidos e indefinidos, substantivos singulares, preposições de lugar simples e To Be afirmativo.",
  },
  {
    blockNumber: 2,
    title: "Bloco 2 — Negação e Interrogação Básica",
    theme: "Negação, Preposições e Perguntas com To Be",
    lessonRange: [11, 20],
    grammarTopics: "To Be negativo (not), contrações (isn't, aren't), preposições (with, from, at, for) e inversão interrogativa.",
  },
  {
    blockNumber: 3,
    title: "Bloco 3 — Posse e Descrição do Lar",
    theme: "Adjetivos Possessivos e Ambientes do Lar",
    lessonRange: [21, 30],
    grammarTopics: "Possessivos (my, your, his, her, our, their) e qualificadores do lar.",
  },
  {
    blockNumber: 4,
    title: "Bloco 4 — Plural e Quantidades",
    theme: "Plural dos Substantivos (+s, -es, -ies) e Números",
    lessonRange: [31, 40],
    grammarTopics: "Regras morfológicas do plural regular (+s, -es, -ies) e quantificadores numéricos.",
  },
  {
    blockNumber: 5,
    title: "Bloco 5 — Demonstração e Vínculos Familiares",
    theme: "Pronomes Demonstrativos e Família",
    lessonRange: [41, 50],
    grammarTopics: "Demonstrativos singulares e plurais (this, that, these, those) com relações familiares.",
  },
  {
    blockNumber: 6,
    title: "Bloco 6 — Existência e Localização",
    theme: "There is / There are e Cômodos",
    lessonRange: [51, 60],
    grammarTopics: "Estruturas existenciais afirmativas, negativas e interrogativas em espaços físicos.",
  },
  {
    blockNumber: 7,
    title: "Bloco 7 — Perguntas Essenciais",
    theme: "Question Words (What, Where, Who, When, Why, How)",
    lessonRange: [61, 70],
    grammarTopics: "Pronomes interrogativos fundamentais aplicados a diálogos do cotidiano.",
  },
  {
    blockNumber: 8,
    title: "Bloco 8 — Posse Ativa com Have",
    theme: "Verbo To Have no Presente",
    lessonRange: [71, 80],
    grammarTopics: "Have (I, you, we, they) e Has (he, she, it) para posse concreta e relacionamentos.",
  },
  {
    blockNumber: 9,
    title: "Bloco 9 — Rotina no Presente",
    theme: "Simple Present Afirmativo e Rotina",
    lessonRange: [81, 90],
    grammarTopics: "Verbos de ação no presente e regra da 3ª pessoa do singular (-s, -es, -ies).",
  },
  {
    blockNumber: 10,
    title: "Bloco 10 — Auxiliares no Presente",
    theme: "Simple Present Negativo e Interrogativo (Do / Does)",
    lessonRange: [91, 100],
    grammarTopics: "Uso de auxiliares do/does, don't/doesn't e desativação da flexão verbal na 3ª pessoa.",
  },
  {
    blockNumber: 11,
    title: "Bloco 11 — Comandos e Horários",
    theme: "Imperativos, Rotina e Horários",
    lessonRange: [101, 110],
    grammarTopics: "Imperativos afirmativos e negativos, horários e rotinas estruturadas.",
  },
  {
    blockNumber: 12,
    title: "Bloco 12 — Tempo e Posse Nominal",
    theme: "Preposições de Tempo e Caso Genitivo ('s)",
    lessonRange: [111, 120],
    grammarTopics: "Preposições temporais (at, on, in, before, after) e genitivo possessivo com apóstrofo.",
  },
  {
    blockNumber: 13,
    title: "Bloco 13 — Habilidades e Possibilidades",
    theme: "Verbos Modais: Can / Can't e Habilidades",
    lessonRange: [121, 130],
    grammarTopics: "Can e can't invariáveis para expressar habilidades físicas e permissão.",
  },
  {
    blockNumber: 14,
    title: "Bloco 14 — Preferências e Quantidades",
    theme: "Substantivos Contáveis / Incontáveis e Gostos",
    lessonRange: [131, 140],
    grammarTopics: "Much, many, some, any, like e don't like com alimentos e preferências.",
  },
  {
    blockNumber: 15,
    title: "Bloco 15 — Passado Simples e Conclusão A1",
    theme: "Passado Simples Regular (-ed) e Viagens",
    lessonRange: [141, 150],
    grammarTopics: "Morfologia do passado regular (-ed, -d, -ied) e fechamento narrativo do Nível A1.",
  },
];

// Os blocos legados ainda não seguem o roteiro novo; a etapa 12 pertence ao exame.
for (const block of A1_BLOCKS_METADATA.slice(1)) {
  block.lessonRange = [block.lessonRange[0] + 2, block.lessonRange[1] + 2];
}

/**
 * Banco Completo de Testes de Bloco do Nível A1 (15 Blocos x 20 Itens = 300 Questões).
 * Avalia as 5 habilidades fundamentais:
 * 1. Listening + Writing (Áudio -> Digitação em Inglês)
 * 2. Listening + Tradução (Áudio -> Tradução em Português)
 * 3. Reading + Speaking (Texto -> Leitura em voz alta via Web Speech API)
 * 4. Reading + Tradução (Texto -> Tradução escrita em Português)
 */

const LEGACY_BLOCK_TEST_QUESTIONS: BlockTestQuestion[] = [
  {
    "id": "block-1-q-1",
    "blockNumber": 1,
    "qNum": 1,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "A big book on the table.",
    "acceptedAnswers": [
      "A big book on the table."
    ]
  },
  {
    "id": "block-1-q-2",
    "blockNumber": 1,
    "qNum": 2,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "I am a happy student.",
    "acceptedAnswers": [
      "I'm a happy student."
    ]
  },
  {
    "id": "block-1-q-3",
    "blockNumber": 1,
    "qNum": 3,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "The cat is under the big table.",
    "acceptedAnswers": [
      "The cat is under the big table."
    ]
  },
  {
    "id": "block-1-q-4",
    "blockNumber": 1,
    "qNum": 4,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "I am tired, and you are here.",
    "acceptedAnswers": [
      "I'm tired, and you're here. / I am tired and you are here."
    ]
  },
  {
    "id": "block-1-q-5",
    "blockNumber": 1,
    "qNum": 5,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "I like the old house.",
    "acceptedAnswers": [
      "I like the old house."
    ]
  },
  {
    "id": "block-1-q-6",
    "blockNumber": 1,
    "qNum": 6,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "She is a doctor in the school.",
    "acceptedAnswers": [
      "Ela é médica na escola.",
      "Ela é uma médica na escola."
    ]
  },
  {
    "id": "block-1-q-7",
    "blockNumber": 1,
    "qNum": 7,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "He is in the car, and she is in the house.",
    "acceptedAnswers": [
      "Ele está no carro, e ela está em casa.",
      "Ele está no carro e ela está na casa."
    ]
  },
  {
    "id": "block-1-q-8",
    "blockNumber": 1,
    "qNum": 8,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "You are a student in the school.",
    "acceptedAnswers": [
      "Você é estudante na escola.",
      "Você é um estudante na escola.",
      "Você é aluno na escola."
    ]
  },
  {
    "id": "block-1-q-9",
    "blockNumber": 1,
    "qNum": 9,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "We are in the park, and we are happy.",
    "acceptedAnswers": [
      "Nós estamos no parque, e nós estamos felizes.",
      "Estamos no parque e estamos felizes."
    ]
  },
  {
    "id": "block-1-q-10",
    "blockNumber": 1,
    "qNum": 10,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "An old doctor is in the school.",
    "acceptedAnswers": [
      "Um médico idoso está na escola.",
      "Um médico velho está na escola."
    ]
  },
  {
    "id": "block-1-q-11",
    "blockNumber": 1,
    "qNum": 11,
    "skill": "reading_speaking",
    "prompt": "The old man and the woman are here.",
    "acceptedAnswers": [
      "The old man and the woman are here."
    ]
  },
  {
    "id": "block-1-q-12",
    "blockNumber": 1,
    "qNum": 12,
    "skill": "reading_speaking",
    "prompt": "We like the dog.",
    "acceptedAnswers": [
      "We like the dog."
    ]
  },
  {
    "id": "block-1-q-13",
    "blockNumber": 1,
    "qNum": 13,
    "skill": "reading_speaking",
    "prompt": "You are a friend, and I like you.",
    "acceptedAnswers": [
      "You are a friend, and I like you."
    ]
  },
  {
    "id": "block-1-q-14",
    "blockNumber": 1,
    "qNum": 14,
    "skill": "reading_speaking",
    "prompt": "The phone is in the box.",
    "acceptedAnswers": [
      "The phone is in the box."
    ]
  },
  {
    "id": "block-1-q-15",
    "blockNumber": 1,
    "qNum": 15,
    "skill": "reading_speaking",
    "prompt": "They play here, and we play in the park.",
    "acceptedAnswers": [
      "They play here, and we play in the park."
    ]
  },
  {
    "id": "block-1-q-16",
    "blockNumber": 1,
    "qNum": 16,
    "skill": "reading_translation",
    "prompt": "They are happy in the park.",
    "acceptedAnswers": [
      "Eles estão felizes no parque.",
      "Elas estão felizes no parque."
    ]
  },
  {
    "id": "block-1-q-17",
    "blockNumber": 1,
    "qNum": 17,
    "skill": "reading_translation",
    "prompt": "A big coffee and water, please.",
    "acceptedAnswers": [
      "Um café grande e água, por favor.",
      "Um café grande e uma água, por favor."
    ]
  },
  {
    "id": "block-1-q-18",
    "blockNumber": 1,
    "qNum": 18,
    "skill": "reading_translation",
    "prompt": "He is a boy, and she is a girl.",
    "acceptedAnswers": [
      "Ele é um menino, e ela é uma menina.",
      "Ele é menino e ela é menina."
    ]
  },
  {
    "id": "block-1-q-19",
    "blockNumber": 1,
    "qNum": 19,
    "skill": "reading_translation",
    "prompt": "The boy and the girl are in the park.",
    "acceptedAnswers": [
      "O menino e a menina estão no parque."
    ]
  },
  {
    "id": "block-1-q-20",
    "blockNumber": 1,
    "qNum": 20,
    "skill": "reading_translation",
    "prompt": "The cat is in the house.",
    "acceptedAnswers": [
      "O gato está na casa.",
      "O gato está em casa.",
      "A gata está em casa."
    ]
  },
  {
    "id": "block-2-q-1",
    "blockNumber": 2,
    "qNum": 1,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "She is not at the bank today.",
    "acceptedAnswers": [
      "She isn't at the bank today."
    ]
  },
  {
    "id": "block-2-q-2",
    "blockNumber": 2,
    "qNum": 2,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "We are at the hotel now.",
    "acceptedAnswers": [
      "We're at the hotel now."
    ]
  },
  {
    "id": "block-2-q-3",
    "blockNumber": 2,
    "qNum": 3,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "Is the key in the room?",
    "acceptedAnswers": [
      "Is the key in the room?"
    ]
  },
  {
    "id": "block-2-q-4",
    "blockNumber": 2,
    "qNum": 4,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "I am not with the teacher today.",
    "acceptedAnswers": [
      "I'm not with the teacher today."
    ]
  },
  {
    "id": "block-2-q-5",
    "blockNumber": 2,
    "qNum": 5,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "The door of the hotel is open.",
    "acceptedAnswers": [
      "The door of the hotel is open."
    ]
  },
  {
    "id": "block-2-q-6",
    "blockNumber": 2,
    "qNum": 6,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "He is not a teacher, he is a doctor.",
    "acceptedAnswers": [
      "Ele não é professor, ele é médico.",
      "Ele não é professor, é médico."
    ]
  },
  {
    "id": "block-2-q-7",
    "blockNumber": 2,
    "qNum": 7,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "Are you hungry now?",
    "acceptedAnswers": [
      "Você está com fome agora?",
      "Está com fome agora?"
    ]
  },
  {
    "id": "block-2-q-8",
    "blockNumber": 2,
    "qNum": 8,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "The new bus is near the school.",
    "acceptedAnswers": [
      "O ônibus novo fica perto da escola.",
      "O ônibus novo está perto da escola."
    ]
  },
  {
    "id": "block-2-q-9",
    "blockNumber": 2,
    "qNum": 9,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "Sorry, I am wrong.",
    "acceptedAnswers": [
      "Desculpe, eu estou errado.",
      "Desculpa, eu errei.",
      "Desculpe, estou errado."
    ]
  },
  {
    "id": "block-2-q-10",
    "blockNumber": 2,
    "qNum": 10,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "The ticket is in the car.",
    "acceptedAnswers": [
      "O bilhete está no carro.",
      "A passagem está no carro."
    ]
  },
  {
    "id": "block-2-q-11",
    "blockNumber": 2,
    "qNum": 11,
    "skill": "reading_speaking",
    "prompt": "Excuse me, are you a student?",
    "acceptedAnswers": [
      "Excuse me, are you a student?"
    ]
  },
  {
    "id": "block-2-q-12",
    "blockNumber": 2,
    "qNum": 12,
    "skill": "reading_speaking",
    "prompt": "I see a big dog near the car.",
    "acceptedAnswers": [
      "I see a big dog near the car."
    ]
  },
  {
    "id": "block-2-q-13",
    "blockNumber": 2,
    "qNum": 13,
    "skill": "reading_speaking",
    "prompt": "The man is at the bank, and he is tired.",
    "acceptedAnswers": [
      "The man is at the bank, and he is tired."
    ]
  },
  {
    "id": "block-2-q-14",
    "blockNumber": 2,
    "qNum": 14,
    "skill": "reading_speaking",
    "prompt": "Good morning! Is the school open today?",
    "acceptedAnswers": [
      "Good morning! Is the school open today?"
    ]
  },
  {
    "id": "block-2-q-15",
    "blockNumber": 2,
    "qNum": 15,
    "skill": "reading_speaking",
    "prompt": "Are they at the hotel or at the hospital?",
    "acceptedAnswers": [
      "Are they at the hotel or at the hospital?"
    ]
  },
  {
    "id": "block-2-q-16",
    "blockNumber": 2,
    "qNum": 16,
    "skill": "reading_translation",
    "prompt": "The phone is for the doctor.",
    "acceptedAnswers": [
      "O celular é para o médico.",
      "O telefone é para o médico."
    ]
  },
  {
    "id": "block-2-q-17",
    "blockNumber": 2,
    "qNum": 17,
    "skill": "reading_translation",
    "prompt": "We eat at the hotel today.",
    "acceptedAnswers": [
      "Nós comemos no hotel hoje.",
      "Comemos no hotel hoje."
    ]
  },
  {
    "id": "block-2-q-18",
    "blockNumber": 2,
    "qNum": 18,
    "skill": "reading_translation",
    "prompt": "Are they at the office or at the bank?",
    "acceptedAnswers": [
      "Eles estão no escritório ou no banco?"
    ]
  },
  {
    "id": "block-2-q-19",
    "blockNumber": 2,
    "qNum": 19,
    "skill": "reading_translation",
    "prompt": "No, I am not tired. I am very happy.",
    "acceptedAnswers": [
      "Não, eu não estou cansado. Eu estou muito feliz.",
      "Não, não estou cansado. Estou muito feliz."
    ]
  },
  {
    "id": "block-2-q-20",
    "blockNumber": 2,
    "qNum": 20,
    "skill": "reading_translation",
    "prompt": "The old hotel is near the park.",
    "acceptedAnswers": [
      "O hotel antigo fica perto do parque.",
      "O hotel velho fica perto do parque."
    ]
  },
  {
    "id": "block-3-q-1",
    "blockNumber": 3,
    "qNum": 1,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "My brother is at home with his wife.",
    "acceptedAnswers": [
      "My brother is at home with his wife."
    ]
  },
  {
    "id": "block-3-q-2",
    "blockNumber": 3,
    "qNum": 2,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "Her son is behind the tree.",
    "acceptedAnswers": [
      "Her son is behind the tree."
    ]
  },
  {
    "id": "block-3-q-3",
    "blockNumber": 3,
    "qNum": 3,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "Our door is open, and the room is clean.",
    "acceptedAnswers": [
      "Our door is open, and the room is clean."
    ]
  },
  {
    "id": "block-3-q-4",
    "blockNumber": 3,
    "qNum": 4,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "I love their garden.",
    "acceptedAnswers": [
      "I love their garden."
    ]
  },
  {
    "id": "block-3-q-5",
    "blockNumber": 3,
    "qNum": 5,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "The key is under the sofa.",
    "acceptedAnswers": [
      "The key is under the sofa."
    ]
  },
  {
    "id": "block-3-q-6",
    "blockNumber": 3,
    "qNum": 6,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "Your father is not at the office today.",
    "acceptedAnswers": [
      "Seu pai não está no escritório hoje.",
      "O seu pai não está no escritório hoje."
    ]
  },
  {
    "id": "block-3-q-7",
    "blockNumber": 3,
    "qNum": 7,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "The hospital is between the bank and the hotel.",
    "acceptedAnswers": [
      "O hospital fica entre o banco e o hotel.",
      "O hospital está entre o banco e o hotel."
    ]
  },
  {
    "id": "block-3-q-8",
    "blockNumber": 3,
    "qNum": 8,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "She loves her daughter.",
    "acceptedAnswers": [
      "Ela ama a filha dela.",
      "Ela ama a sua filha."
    ]
  },
  {
    "id": "block-3-q-9",
    "blockNumber": 3,
    "qNum": 9,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "The cat is inside, and the dog is outside.",
    "acceptedAnswers": [
      "O gato está dentro, e o cachorro está fora.",
      "O gato está do lado de dentro e o cachorro está lá fora."
    ]
  },
  {
    "id": "block-3-q-10",
    "blockNumber": 3,
    "qNum": 10,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "Their sister is very tall.",
    "acceptedAnswers": [
      "A irmã deles é muito alta.",
      "A irmã delas é muito alta."
    ]
  },
  {
    "id": "block-3-q-11",
    "blockNumber": 3,
    "qNum": 11,
    "skill": "reading_speaking",
    "prompt": "Is your mother at home?",
    "acceptedAnswers": [
      "Is your mother at home?"
    ]
  },
  {
    "id": "block-3-q-12",
    "blockNumber": 3,
    "qNum": 12,
    "skill": "reading_speaking",
    "prompt": "We speak English at home.",
    "acceptedAnswers": [
      "We speak English at home."
    ]
  },
  {
    "id": "block-3-q-13",
    "blockNumber": 3,
    "qNum": 13,
    "skill": "reading_speaking",
    "prompt": "The bag is next to the chair.",
    "acceptedAnswers": [
      "The bag is next to the chair."
    ]
  },
  {
    "id": "block-3-q-14",
    "blockNumber": 3,
    "qNum": 14,
    "skill": "reading_speaking",
    "prompt": "Excuse me, is the bank near the hospital?",
    "acceptedAnswers": [
      "Excuse me, is the bank near the hospital?"
    ]
  },
  {
    "id": "block-3-q-15",
    "blockNumber": 3,
    "qNum": 15,
    "skill": "reading_speaking",
    "prompt": "I sit on the sofa, and you sit near the window.",
    "acceptedAnswers": [
      "I sit on the sofa, and you sit near the window."
    ]
  },
  {
    "id": "block-3-q-16",
    "blockNumber": 3,
    "qNum": 16,
    "skill": "reading_translation",
    "prompt": "His daughter is a student, and his son is a doctor.",
    "acceptedAnswers": [
      "A filha dele é estudante, e o filho dele é médico.",
      "A filha dele é aluna, e o filho dele é médico."
    ]
  },
  {
    "id": "block-3-q-17",
    "blockNumber": 3,
    "qNum": 17,
    "skill": "reading_translation",
    "prompt": "We are in the kitchen, and the family is in the garden.",
    "acceptedAnswers": [
      "Nós estamos na cozinha, e a família está no jardim.",
      "Estamos na cozinha e a família está no jardim."
    ]
  },
  {
    "id": "block-3-q-18",
    "blockNumber": 3,
    "qNum": 18,
    "skill": "reading_translation",
    "prompt": "Is the ticket for your brother?",
    "acceptedAnswers": [
      "O ingresso é para o seu irmão?",
      "A passagem é para o seu irmão?"
    ]
  },
  {
    "id": "block-3-q-19",
    "blockNumber": 3,
    "qNum": 19,
    "skill": "reading_translation",
    "prompt": "The phone is on the floor, and my bag is on the bed.",
    "acceptedAnswers": [
      "O celular está no chão, e minha bolsa está na cama.",
      "O telefone está no chão, e a minha bolsa está na cama."
    ]
  },
  {
    "id": "block-3-q-20",
    "blockNumber": 3,
    "qNum": 20,
    "skill": "reading_translation",
    "prompt": "Sorry, her husband is not here.",
    "acceptedAnswers": [
      "Desculpe, o marido dela não está aqui.",
      "Desculpa, o marido dela não está aqui."
    ]
  },
  {
    "id": "block-4-q-1",
    "blockNumber": 4,
    "qNum": 1,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "Two boys and three girls are here.",
    "acceptedAnswers": [
      "Two boys and three girls are here."
    ]
  },
  {
    "id": "block-4-q-2",
    "blockNumber": 4,
    "qNum": 2,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "Five clean boxes are in the room.",
    "acceptedAnswers": [
      "Five clean boxes are in the room."
    ]
  },
  {
    "id": "block-4-q-3",
    "blockNumber": 4,
    "qNum": 3,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "Many people love big cities.",
    "acceptedAnswers": [
      "Many people love big cities."
    ]
  },
  {
    "id": "block-4-q-4",
    "blockNumber": 4,
    "qNum": 4,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "Four blue pens and six red books.",
    "acceptedAnswers": [
      "Four blue pens and six red books."
    ]
  },
  {
    "id": "block-4-q-5",
    "blockNumber": 4,
    "qNum": 5,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "The children are in the park today.",
    "acceptedAnswers": [
      "The children are in the park today."
    ]
  },
  {
    "id": "block-4-q-6",
    "blockNumber": 4,
    "qNum": 6,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "Two black cats are on the sofa.",
    "acceptedAnswers": [
      "Dois gatos pretos estão no sofá."
    ]
  },
  {
    "id": "block-4-q-7",
    "blockNumber": 4,
    "qNum": 7,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "Three women are at the new hospital.",
    "acceptedAnswers": [
      "Três mulheres estão no novo hospital.",
      "Três mulheres estão no hospital novo."
    ]
  },
  {
    "id": "block-4-q-8",
    "blockNumber": 4,
    "qNum": 8,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "Five buses are on the street.",
    "acceptedAnswers": [
      "Cinco ônibus estão na rua."
    ]
  },
  {
    "id": "block-4-q-9",
    "blockNumber": 4,
    "qNum": 9,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "Many families are in the quiet garden.",
    "acceptedAnswers": [
      "Muitas famílias estão no jardim calmo.",
      "Muitas famílias estão no jardim silencioso."
    ]
  },
  {
    "id": "block-4-q-10",
    "blockNumber": 4,
    "qNum": 10,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "Two small fish are in the water.",
    "acceptedAnswers": [
      "Dois peixes pequenos estão na água."
    ]
  },
  {
    "id": "block-4-q-11",
    "blockNumber": 4,
    "qNum": 11,
    "skill": "reading_speaking",
    "prompt": "Seven green apples are on the table.",
    "acceptedAnswers": [
      "Seven green apples are on the table."
    ]
  },
  {
    "id": "block-4-q-12",
    "blockNumber": 4,
    "qNum": 12,
    "skill": "reading_speaking",
    "prompt": "The men and the women speak English.",
    "acceptedAnswers": [
      "The men and the women speak English."
    ]
  },
  {
    "id": "block-4-q-13",
    "blockNumber": 4,
    "qNum": 13,
    "skill": "reading_speaking",
    "prompt": "Four white chairs are in the kitchen.",
    "acceptedAnswers": [
      "Four white chairs are in the kitchen."
    ]
  },
  {
    "id": "block-4-q-14",
    "blockNumber": 4,
    "qNum": 14,
    "skill": "reading_speaking",
    "prompt": "Two doctors and ten students are in the room.",
    "acceptedAnswers": [
      "Two doctors and ten students are in the room."
    ]
  },
  {
    "id": "block-4-q-15",
    "blockNumber": 4,
    "qNum": 15,
    "skill": "reading_speaking",
    "prompt": "Three families love our quiet city.",
    "acceptedAnswers": [
      "Three families love our quiet city."
    ]
  },
  {
    "id": "block-4-q-16",
    "blockNumber": 4,
    "qNum": 16,
    "skill": "reading_translation",
    "prompt": "Eight small fish are in the water.",
    "acceptedAnswers": [
      "Oito peixes pequenos estão na água."
    ]
  },
  {
    "id": "block-4-q-17",
    "blockNumber": 4,
    "qNum": 17,
    "skill": "reading_translation",
    "prompt": "My two feet are very tired today.",
    "acceptedAnswers": [
      "Meus dois pés estão muito cansados hoje."
    ]
  },
  {
    "id": "block-4-q-18",
    "blockNumber": 4,
    "qNum": 18,
    "skill": "reading_translation",
    "prompt": "Six yellow watches are on the table.",
    "acceptedAnswers": [
      "Seis relógios amarelos estão sobre a mesa."
    ]
  },
  {
    "id": "block-4-q-19",
    "blockNumber": 4,
    "qNum": 19,
    "skill": "reading_translation",
    "prompt": "Many children play with the brown dog.",
    "acceptedAnswers": [
      "Muitas crianças brincam com o cachorro marrom."
    ]
  },
  {
    "id": "block-4-q-20",
    "blockNumber": 4,
    "qNum": 20,
    "skill": "reading_translation",
    "prompt": "Four red cars and five black buses are here.",
    "acceptedAnswers": [
      "Quatro carros vermelhos e cinco ônibus pretos estão aqui."
    ]
  },
  {
    "id": "block-5-q-1",
    "blockNumber": 5,
    "qNum": 1,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "This black shirt is very nice.",
    "acceptedAnswers": [
      "This black shirt is very nice."
    ]
  },
  {
    "id": "block-5-q-2",
    "blockNumber": 5,
    "qNum": 2,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "There is a supermarket near the park.",
    "acceptedAnswers": [
      "There is a supermarket near the park."
    ]
  },
  {
    "id": "block-5-q-3",
    "blockNumber": 5,
    "qNum": 3,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "Those shoes are under the bed.",
    "acceptedAnswers": [
      "Those shoes are under the bed."
    ]
  },
  {
    "id": "block-5-q-4",
    "blockNumber": 5,
    "qNum": 4,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "There are two clean cups on the table.",
    "acceptedAnswers": [
      "There are two clean cups on the table."
    ]
  },
  {
    "id": "block-5-q-5",
    "blockNumber": 5,
    "qNum": 5,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "Is there a pharmacy on this street?",
    "acceptedAnswers": [
      "Is there a pharmacy on this street?"
    ]
  },
  {
    "id": "block-5-q-6",
    "blockNumber": 5,
    "qNum": 6,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "These pants are black and cheap.",
    "acceptedAnswers": [
      "Estas calças são pretas e baratas."
    ]
  },
  {
    "id": "block-5-q-7",
    "blockNumber": 5,
    "qNum": 7,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "There is a doctor at the hospital now.",
    "acceptedAnswers": [
      "Há um médico no hospital agora.",
      "Tem um médico no hospital agora."
    ]
  },
  {
    "id": "block-5-q-8",
    "blockNumber": 5,
    "qNum": 8,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "That brown coat is very expensive.",
    "acceptedAnswers": [
      "Aquele casaco marrom é muito caro."
    ]
  },
  {
    "id": "block-5-q-9",
    "blockNumber": 5,
    "qNum": 9,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "There aren't any chairs in the room.",
    "acceptedAnswers": [
      "Não há nenhuma cadeira na sala.",
      "Não há cadeiras no quarto."
    ]
  },
  {
    "id": "block-5-q-10",
    "blockNumber": 5,
    "qNum": 10,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "Are there any restaurants around here?",
    "acceptedAnswers": [
      "Há algum restaurante por aqui?",
      "Há restaurantes por aqui?"
    ]
  },
  {
    "id": "block-5-q-11",
    "blockNumber": 5,
    "qNum": 11,
    "skill": "reading_speaking",
    "prompt": "This red dress is very beautiful.",
    "acceptedAnswers": [
      "This red dress is very beautiful."
    ]
  },
  {
    "id": "block-5-q-12",
    "blockNumber": 5,
    "qNum": 12,
    "skill": "reading_speaking",
    "prompt": "Is there a bus stop near the school?",
    "acceptedAnswers": [
      "Is there a bus stop near the school?"
    ]
  },
  {
    "id": "block-5-q-13",
    "blockNumber": 5,
    "qNum": 13,
    "skill": "reading_speaking",
    "prompt": "Those jackets are clean and new.",
    "acceptedAnswers": [
      "Those jackets are clean and new."
    ]
  },
  {
    "id": "block-5-q-14",
    "blockNumber": 5,
    "qNum": 14,
    "skill": "reading_speaking",
    "prompt": "There are many trees in our garden.",
    "acceptedAnswers": [
      "There are many trees in our garden."
    ]
  },
  {
    "id": "block-5-q-15",
    "blockNumber": 5,
    "qNum": 15,
    "skill": "reading_speaking",
    "prompt": "Are these your keys on the table?",
    "acceptedAnswers": [
      "Are these your keys on the table?"
    ]
  },
  {
    "id": "block-5-q-16",
    "blockNumber": 5,
    "qNum": 16,
    "skill": "reading_translation",
    "prompt": "There is a post office next to the bank.",
    "acceptedAnswers": [
      "Há uma agência de correios ao lado do banco.",
      "Há um correio ao lado do banco."
    ]
  },
  {
    "id": "block-5-q-17",
    "blockNumber": 5,
    "qNum": 17,
    "skill": "reading_translation",
    "prompt": "These black shoes are not expensive.",
    "acceptedAnswers": [
      "Estes sapatos pretos não são caros."
    ]
  },
  {
    "id": "block-5-q-18",
    "blockNumber": 5,
    "qNum": 18,
    "skill": "reading_translation",
    "prompt": "There isn't a problem with our car.",
    "acceptedAnswers": [
      "Não há um problema com o nosso carro.",
      "Não tem problema com o nosso carro."
    ]
  },
  {
    "id": "block-5-q-19",
    "blockNumber": 5,
    "qNum": 19,
    "skill": "reading_translation",
    "prompt": "Are there any clean glasses in the kitchen?",
    "acceptedAnswers": [
      "Há algum copo limpo na cozinha?",
      "Há copos limpos na cozinha?"
    ]
  },
  {
    "id": "block-5-q-20",
    "blockNumber": 5,
    "qNum": 20,
    "skill": "reading_translation",
    "prompt": "That umbrella is behind the door.",
    "acceptedAnswers": [
      "Aquele guarda-chuva está atrás da porta."
    ]
  },
  {
    "id": "block-6-q-1",
    "blockNumber": 6,
    "qNum": 1,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "What is your name?",
    "acceptedAnswers": [
      "What is your name?"
    ]
  },
  {
    "id": "block-6-q-2",
    "blockNumber": 6,
    "qNum": 2,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "She is a nurse at the hospital.",
    "acceptedAnswers": [
      "She is a nurse at the hospital."
    ]
  },
  {
    "id": "block-6-q-3",
    "blockNumber": 6,
    "qNum": 3,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "Where are you from?",
    "acceptedAnswers": [
      "Where are you from?"
    ]
  },
  {
    "id": "block-6-q-4",
    "blockNumber": 6,
    "qNum": 4,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "My brother is an engineer.",
    "acceptedAnswers": [
      "My brother is an engineer."
    ]
  },
  {
    "id": "block-6-q-5",
    "blockNumber": 6,
    "qNum": 5,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "When is the meeting?",
    "acceptedAnswers": [
      "When is the meeting?"
    ]
  },
  {
    "id": "block-6-q-6",
    "blockNumber": 6,
    "qNum": 6,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "Who is that tall man?",
    "acceptedAnswers": [
      "Quem é aquele homem alto?"
    ]
  },
  {
    "id": "block-6-q-7",
    "blockNumber": 6,
    "qNum": 7,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "He is a bus driver in our city.",
    "acceptedAnswers": [
      "Ele é motorista de ônibus na nossa cidade."
    ]
  },
  {
    "id": "block-6-q-8",
    "blockNumber": 6,
    "qNum": 8,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "That manager is from France.",
    "acceptedAnswers": [
      "Aquele gerente é da França."
    ]
  },
  {
    "id": "block-6-q-9",
    "blockNumber": 6,
    "qNum": 9,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "What is your phone number?",
    "acceptedAnswers": [
      "Qual é o seu número de telefone?"
    ]
  },
  {
    "id": "block-6-q-10",
    "blockNumber": 6,
    "qNum": 10,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "The nurses help the doctors.",
    "acceptedAnswers": [
      "As enfermeiras ajudam os médicos.",
      "Os enfermeiros ajudam os médicos."
    ]
  },
  {
    "id": "block-6-q-11",
    "blockNumber": 6,
    "qNum": 11,
    "skill": "reading_speaking",
    "prompt": "Nice to meet you!",
    "acceptedAnswers": [
      "Nice to meet you!"
    ]
  },
  {
    "id": "block-6-q-12",
    "blockNumber": 6,
    "qNum": 12,
    "skill": "reading_speaking",
    "prompt": "Which bus is for the hospital?",
    "acceptedAnswers": [
      "Which bus is for the hospital?"
    ]
  },
  {
    "id": "block-6-q-13",
    "blockNumber": 6,
    "qNum": 13,
    "skill": "reading_speaking",
    "prompt": "She is French, and he is Spanish.",
    "acceptedAnswers": [
      "She is French, and he is Spanish."
    ]
  },
  {
    "id": "block-6-q-14",
    "blockNumber": 6,
    "qNum": 14,
    "skill": "reading_speaking",
    "prompt": "How are you today?",
    "acceptedAnswers": [
      "How are you today?"
    ]
  },
  {
    "id": "block-6-q-15",
    "blockNumber": 6,
    "qNum": 15,
    "skill": "reading_speaking",
    "prompt": "That waiter is very nice.",
    "acceptedAnswers": [
      "That waiter is very nice."
    ]
  },
  {
    "id": "block-6-q-16",
    "blockNumber": 6,
    "qNum": 16,
    "skill": "reading_translation",
    "prompt": "Who is the manager of the store?",
    "acceptedAnswers": [
      "Quem é o gerente da loja?"
    ]
  },
  {
    "id": "block-6-q-17",
    "blockNumber": 6,
    "qNum": 17,
    "skill": "reading_translation",
    "prompt": "My email is on the form.",
    "acceptedAnswers": [
      "Meu e-mail está no formulário.",
      "O meu e-mail está na ficha."
    ]
  },
  {
    "id": "block-6-q-18",
    "blockNumber": 6,
    "qNum": 18,
    "skill": "reading_translation",
    "prompt": "He is an American doctor.",
    "acceptedAnswers": [
      "Ele é um médico americano.",
      "Ele é médico americano."
    ]
  },
  {
    "id": "block-6-q-19",
    "blockNumber": 6,
    "qNum": 19,
    "skill": "reading_translation",
    "prompt": "What country is she from?",
    "acceptedAnswers": [
      "De que país ela é?",
      "De qual país ela é?"
    ]
  },
  {
    "id": "block-6-q-20",
    "blockNumber": 6,
    "qNum": 20,
    "skill": "reading_translation",
    "prompt": "The meeting is today at the office.",
    "acceptedAnswers": [
      "A reunião é hoje no escritório."
    ]
  },
  {
    "id": "block-7-q-1",
    "blockNumber": 7,
    "qNum": 1,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "I have my passport and my ticket.",
    "acceptedAnswers": [
      "I have my passport and my ticket."
    ]
  },
  {
    "id": "block-7-q-2",
    "blockNumber": 7,
    "qNum": 2,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "She has a black backpack.",
    "acceptedAnswers": [
      "She has a black backpack."
    ]
  },
  {
    "id": "block-7-q-3",
    "blockNumber": 7,
    "qNum": 3,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "We need a taxi now.",
    "acceptedAnswers": [
      "We need a taxi now."
    ]
  },
  {
    "id": "block-7-q-4",
    "blockNumber": 7,
    "qNum": 4,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "I want to buy a bottle of water.",
    "acceptedAnswers": [
      "I want to buy a bottle of water."
    ]
  },
  {
    "id": "block-7-q-5",
    "blockNumber": 7,
    "qNum": 5,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "Our flight is late today.",
    "acceptedAnswers": [
      "Our flight is late today."
    ]
  },
  {
    "id": "block-7-q-6",
    "blockNumber": 7,
    "qNum": 6,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "My luggage is ready for the flight.",
    "acceptedAnswers": [
      "Minha bagagem está pronta para o voo."
    ]
  },
  {
    "id": "block-7-q-7",
    "blockNumber": 7,
    "qNum": 7,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "He has cash and a credit card in his wallet.",
    "acceptedAnswers": [
      "Ele tem dinheiro vivo e um cartão de crédito na carteira dele."
    ]
  },
  {
    "id": "block-7-q-8",
    "blockNumber": 7,
    "qNum": 8,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "I am tired, and I want to sleep.",
    "acceptedAnswers": [
      "Eu estou cansado, e eu quero dormir.",
      "Estou cansado e quero dormir."
    ]
  },
  {
    "id": "block-7-q-9",
    "blockNumber": 7,
    "qNum": 9,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "What is the price of this charger?",
    "acceptedAnswers": [
      "Qual é o preço deste carregador?"
    ]
  },
  {
    "id": "block-7-q-10",
    "blockNumber": 7,
    "qNum": 10,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "We have time for a coffee before the meeting.",
    "acceptedAnswers": [
      "Nós temos tempo para um café antes da reunião."
    ]
  },
  {
    "id": "block-7-q-11",
    "blockNumber": 7,
    "qNum": 11,
    "skill": "reading_speaking",
    "prompt": "I need to go to the airport now.",
    "acceptedAnswers": [
      "I need to go to the airport now."
    ]
  },
  {
    "id": "block-7-q-12",
    "blockNumber": 7,
    "qNum": 12,
    "skill": "reading_speaking",
    "prompt": "She wants to drink cold juice.",
    "acceptedAnswers": [
      "She wants to drink cold juice."
    ]
  },
  {
    "id": "block-7-q-13",
    "blockNumber": 7,
    "qNum": 13,
    "skill": "reading_speaking",
    "prompt": "The teacher has two computers on the desk.",
    "acceptedAnswers": [
      "The teacher has two computers on the desk."
    ]
  },
  {
    "id": "block-7-q-14",
    "blockNumber": 7,
    "qNum": 14,
    "skill": "reading_speaking",
    "prompt": "Are you ready for the flight?",
    "acceptedAnswers": [
      "Are you ready for the flight?"
    ]
  },
  {
    "id": "block-7-q-15",
    "blockNumber": 7,
    "qNum": 15,
    "skill": "reading_speaking",
    "prompt": "We want a sandwich and a bottle of water.",
    "acceptedAnswers": [
      "We want a sandwich and a bottle of water."
    ]
  },
  {
    "id": "block-7-q-16",
    "blockNumber": 7,
    "qNum": 16,
    "skill": "reading_translation",
    "prompt": "The passport is very important for the flight.",
    "acceptedAnswers": [
      "O passaporte é muito importante para o voo."
    ]
  },
  {
    "id": "block-7-q-17",
    "blockNumber": 7,
    "qNum": 17,
    "skill": "reading_translation",
    "prompt": "I need a phone charger, please.",
    "acceptedAnswers": [
      "Eu preciso de um carregador de celular, por favor."
    ]
  },
  {
    "id": "block-7-q-18",
    "blockNumber": 7,
    "qNum": 18,
    "skill": "reading_translation",
    "prompt": "He has a new job in the United States.",
    "acceptedAnswers": [
      "Ele tem um novo emprego nos Estados Unidos."
    ]
  },
  {
    "id": "block-7-q-19",
    "blockNumber": 7,
    "qNum": 19,
    "skill": "reading_translation",
    "prompt": "We need medicine from the pharmacy.",
    "acceptedAnswers": [
      "Nós precisamos de remédio da farmácia."
    ]
  },
  {
    "id": "block-7-q-20",
    "blockNumber": 7,
    "qNum": 20,
    "skill": "reading_translation",
    "prompt": "My brother has a big suitcase.",
    "acceptedAnswers": [
      "Meu irmão tem uma mala grande."
    ]
  },
  {
    "id": "block-8-q-1",
    "blockNumber": 8,
    "qNum": 1,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "I wake up early in the morning.",
    "acceptedAnswers": [
      "I wake up early in the morning."
    ]
  },
  {
    "id": "block-8-q-2",
    "blockNumber": 8,
    "qNum": 2,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "We eat bread and cheese for breakfast.",
    "acceptedAnswers": [
      "We eat bread and cheese for breakfast."
    ]
  },
  {
    "id": "block-8-q-3",
    "blockNumber": 8,
    "qNum": 3,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "They study English at the university.",
    "acceptedAnswers": [
      "They study English at the university."
    ]
  },
  {
    "id": "block-8-q-4",
    "blockNumber": 8,
    "qNum": 4,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "In the evening, we cook dinner at home.",
    "acceptedAnswers": [
      "In the evening, we cook dinner at home."
    ]
  },
  {
    "id": "block-8-q-5",
    "blockNumber": 8,
    "qNum": 5,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "I listen to music and relax.",
    "acceptedAnswers": [
      "I listen to music and relax."
    ]
  },
  {
    "id": "block-8-q-6",
    "blockNumber": 8,
    "qNum": 6,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "I get up and drink hot tea with milk.",
    "acceptedAnswers": [
      "Eu me levanto e bebo chá quente com leite."
    ]
  },
  {
    "id": "block-8-q-7",
    "blockNumber": 8,
    "qNum": 7,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "We eat rice, meat and salad for lunch.",
    "acceptedAnswers": [
      "Nós comemos arroz, carne e salada no almoço."
    ]
  },
  {
    "id": "block-8-q-8",
    "blockNumber": 8,
    "qNum": 8,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "They live in a small apartment near the park.",
    "acceptedAnswers": [
      "Eles moram em um apartamento pequeno perto do parque."
    ]
  },
  {
    "id": "block-8-q-9",
    "blockNumber": 8,
    "qNum": 9,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "My brother and I walk in the park together.",
    "acceptedAnswers": [
      "Meu irmão e eu caminhamos no parque juntos."
    ]
  },
  {
    "id": "block-8-q-10",
    "blockNumber": 8,
    "qNum": 10,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "I read a book and sleep early at night.",
    "acceptedAnswers": [
      "Eu leio um livro e durmo cedo à noite."
    ]
  },
  {
    "id": "block-8-q-11",
    "blockNumber": 8,
    "qNum": 11,
    "skill": "reading_speaking",
    "prompt": "We start the day early with a good coffee.",
    "acceptedAnswers": [
      "We start the day early with a good coffee."
    ]
  },
  {
    "id": "block-8-q-12",
    "blockNumber": 8,
    "qNum": 12,
    "skill": "reading_speaking",
    "prompt": "The engineers work at the office in the morning.",
    "acceptedAnswers": [
      "The engineers work at the office in the morning."
    ]
  },
  {
    "id": "block-8-q-13",
    "blockNumber": 8,
    "qNum": 13,
    "skill": "reading_speaking",
    "prompt": "They eat lunch at the restaurant together.",
    "acceptedAnswers": [
      "They eat lunch at the restaurant together."
    ]
  },
  {
    "id": "block-8-q-14",
    "blockNumber": 8,
    "qNum": 14,
    "skill": "reading_speaking",
    "prompt": "In the afternoon, I study in my room.",
    "acceptedAnswers": [
      "In the afternoon, I study in my room."
    ]
  },
  {
    "id": "block-8-q-15",
    "blockNumber": 8,
    "qNum": 15,
    "skill": "reading_speaking",
    "prompt": "We walk every day in the morning.",
    "acceptedAnswers": [
      "We walk every day in the morning."
    ]
  },
  {
    "id": "block-8-q-16",
    "blockNumber": 8,
    "qNum": 16,
    "skill": "reading_translation",
    "prompt": "I eat eggs and fruit for breakfast.",
    "acceptedAnswers": [
      "Eu como ovos e fruta no café da manhã."
    ]
  },
  {
    "id": "block-8-q-17",
    "blockNumber": 8,
    "qNum": 17,
    "skill": "reading_translation",
    "prompt": "You work in a big hospital in the city.",
    "acceptedAnswers": [
      "Você trabalha em um grande hospital na cidade."
    ]
  },
  {
    "id": "block-8-q-18",
    "blockNumber": 8,
    "qNum": 18,
    "skill": "reading_translation",
    "prompt": "We cook dinner for the family in the evening.",
    "acceptedAnswers": [
      "Nós cozinhamos o jantar para a família à noite."
    ]
  },
  {
    "id": "block-8-q-19",
    "blockNumber": 8,
    "qNum": 19,
    "skill": "reading_translation",
    "prompt": "They listen to music in the car.",
    "acceptedAnswers": [
      "Eles escutam música no carro."
    ]
  },
  {
    "id": "block-8-q-20",
    "blockNumber": 8,
    "qNum": 20,
    "skill": "reading_translation",
    "prompt": "The street is very quiet at night.",
    "acceptedAnswers": [
      "A rua é muito silenciosa à noite."
    ]
  },
  {
    "id": "block-9-q-1",
    "blockNumber": 9,
    "qNum": 1,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "She speaks English and works at the hospital.",
    "acceptedAnswers": [
      "She speaks English and works at the hospital."
    ]
  },
  {
    "id": "block-9-q-2",
    "blockNumber": 9,
    "qNum": 2,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "He goes to the university on Monday.",
    "acceptedAnswers": [
      "He goes to the university on Monday."
    ]
  },
  {
    "id": "block-9-q-3",
    "blockNumber": 9,
    "qNum": 3,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "My sister studies medicine in Brazil.",
    "acceptedAnswers": [
      "My sister studies medicine in Brazil."
    ]
  },
  {
    "id": "block-9-q-4",
    "blockNumber": 9,
    "qNum": 4,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "She always wakes up early in the morning.",
    "acceptedAnswers": [
      "She always wakes up early in the morning."
    ]
  },
  {
    "id": "block-9-q-5",
    "blockNumber": 9,
    "qNum": 5,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "He cleans the house on Saturday.",
    "acceptedAnswers": [
      "He cleans the house on Saturday."
    ]
  },
  {
    "id": "block-9-q-6",
    "blockNumber": 9,
    "qNum": 6,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "Julia lives in a small apartment in the city.",
    "acceptedAnswers": [
      "Julia mora em um apartamento pequeno na cidade."
    ]
  },
  {
    "id": "block-9-q-7",
    "blockNumber": 9,
    "qNum": 7,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "He carries a big backpack to school.",
    "acceptedAnswers": [
      "Ele carrega uma mochila grande para a escola."
    ]
  },
  {
    "id": "block-9-q-8",
    "blockNumber": 9,
    "qNum": 8,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "She visits her mother on Sunday.",
    "acceptedAnswers": [
      "Ela visita a mãe dela no domingo."
    ]
  },
  {
    "id": "block-9-q-9",
    "blockNumber": 9,
    "qNum": 9,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "My brother never drinks coffee at night.",
    "acceptedAnswers": [
      "Meu irmão nunca bebe café à noite."
    ]
  },
  {
    "id": "block-9-q-10",
    "blockNumber": 9,
    "qNum": 10,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "On Friday, we eat dinner at the restaurant.",
    "acceptedAnswers": [
      "Na sexta-feira, nós jantamos no restaurante."
    ]
  },
  {
    "id": "block-9-q-11",
    "blockNumber": 9,
    "qNum": 11,
    "skill": "reading_speaking",
    "prompt": "She goes to the gym on Wednesday evening.",
    "acceptedAnswers": [
      "She goes to the gym on Wednesday evening."
    ]
  },
  {
    "id": "block-9-q-12",
    "blockNumber": 9,
    "qNum": 12,
    "skill": "reading_speaking",
    "prompt": "He washes the dishes in the kitchen.",
    "acceptedAnswers": [
      "He washes the dishes in the kitchen."
    ]
  },
  {
    "id": "block-9-q-13",
    "blockNumber": 9,
    "qNum": 13,
    "skill": "reading_speaking",
    "prompt": "On the weekend, I stay at home to rest.",
    "acceptedAnswers": [
      "On the weekend, I stay at home to rest."
    ]
  },
  {
    "id": "block-9-q-14",
    "blockNumber": 9,
    "qNum": 14,
    "skill": "reading_speaking",
    "prompt": "She often cooks rice and salad for dinner.",
    "acceptedAnswers": [
      "She often cooks rice and salad for dinner."
    ]
  },
  {
    "id": "block-9-q-15",
    "blockNumber": 9,
    "qNum": 15,
    "skill": "reading_speaking",
    "prompt": "Sarah loves her life and her family.",
    "acceptedAnswers": [
      "Sarah loves her life and her family."
    ]
  },
  {
    "id": "block-9-q-16",
    "blockNumber": 9,
    "qNum": 16,
    "skill": "reading_translation",
    "prompt": "The doctor is usually very busy on Tuesday.",
    "acceptedAnswers": [
      "O médico geralmente é muito ocupado na terça-feira.",
      "O médico costuma ser muito ocupado na terça-feira."
    ]
  },
  {
    "id": "block-9-q-17",
    "blockNumber": 9,
    "qNum": 17,
    "skill": "reading_translation",
    "prompt": "He sometimes walks on the beach with his dog.",
    "acceptedAnswers": [
      "Ele às vezes caminha na praia com o cachorro dele."
    ]
  },
  {
    "id": "block-9-q-18",
    "blockNumber": 9,
    "qNum": 18,
    "skill": "reading_translation",
    "prompt": "She reads a book and sleeps early on Thursday.",
    "acceptedAnswers": [
      "Ela lê um livro e dorme cedo na quinta-feira."
    ]
  },
  {
    "id": "block-9-q-19",
    "blockNumber": 9,
    "qNum": 19,
    "skill": "reading_translation",
    "prompt": "My father cleans his car on Saturday morning.",
    "acceptedAnswers": [
      "Meu pai limpa o carro dele no sábado de manhã."
    ]
  },
  {
    "id": "block-9-q-20",
    "blockNumber": 9,
    "qNum": 20,
    "skill": "reading_translation",
    "prompt": "They never work on Saturday and Sunday.",
    "acceptedAnswers": [
      "Eles nunca trabalham no sábado e no domingo."
    ]
  },
  {
    "id": "block-10-q-1",
    "blockNumber": 10,
    "qNum": 1,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "Do you speak English and Portuguese?",
    "acceptedAnswers": [
      "Do you speak English and Portuguese?"
    ]
  },
  {
    "id": "block-10-q-2",
    "blockNumber": 10,
    "qNum": 2,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "He doesn't drive a car to work.",
    "acceptedAnswers": [
      "He doesn't drive a car to work."
    ]
  },
  {
    "id": "block-10-q-3",
    "blockNumber": 10,
    "qNum": 3,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "Why do you wake up early in the morning?",
    "acceptedAnswers": [
      "Why do you wake up early in the morning?"
    ]
  },
  {
    "id": "block-10-q-4",
    "blockNumber": 10,
    "qNum": 4,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "She doesn't eat fast food.",
    "acceptedAnswers": [
      "She doesn't eat fast food."
    ]
  },
  {
    "id": "block-10-q-5",
    "blockNumber": 10,
    "qNum": 5,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "In my free time, I play tennis.",
    "acceptedAnswers": [
      "In my free time, I play tennis."
    ]
  },
  {
    "id": "block-10-q-6",
    "blockNumber": 10,
    "qNum": 6,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "Do you remember that teacher from England?",
    "acceptedAnswers": [
      "Você se lembra daquele professor da Inglaterra?",
      "Você lembra daquele professor da Inglaterra?"
    ]
  },
  {
    "id": "block-10-q-7",
    "blockNumber": 10,
    "qNum": 7,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "He doesn't smoke because he wants to be healthy.",
    "acceptedAnswers": [
      "Ele não fuma porque quer ser saudável.",
      "Ele não fuma porque ele quer ter saúde."
    ]
  },
  {
    "id": "block-10-q-8",
    "blockNumber": 10,
    "qNum": 8,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "Does your sister play tennis on the weekend?",
    "acceptedAnswers": [
      "A sua irmã joga tênis no fim de semana?"
    ]
  },
  {
    "id": "block-10-q-9",
    "blockNumber": 10,
    "qNum": 9,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "We don't understand French, but we speak English.",
    "acceptedAnswers": [
      "Nós não entendemos francês, mas falamos inglês."
    ]
  },
  {
    "id": "block-10-q-10",
    "blockNumber": 10,
    "qNum": 10,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "Why does he run in the park every morning?",
    "acceptedAnswers": [
      "Por que ele corre no parque todas as manhãs?",
      "Por que ele corre no parque toda manhã?"
    ]
  },
  {
    "id": "block-10-q-11",
    "blockNumber": 10,
    "qNum": 11,
    "skill": "reading_speaking",
    "prompt": "I don't know, but I want to understand.",
    "acceptedAnswers": [
      "I don't know, but I want to understand."
    ]
  },
  {
    "id": "block-10-q-12",
    "blockNumber": 10,
    "qNum": 12,
    "skill": "reading_speaking",
    "prompt": "Do you play soccer or tennis with your friends?",
    "acceptedAnswers": [
      "Do you play soccer or tennis with your friends?"
    ]
  },
  {
    "id": "block-10-q-13",
    "blockNumber": 10,
    "qNum": 13,
    "skill": "reading_speaking",
    "prompt": "She doesn't drive to work from Monday to Friday.",
    "acceptedAnswers": [
      "She doesn't drive to work from Monday to Friday."
    ]
  },
  {
    "id": "block-10-q-14",
    "blockNumber": 10,
    "qNum": 14,
    "skill": "reading_speaking",
    "prompt": "Does he swim in the pool in his free time?",
    "acceptedAnswers": [
      "Does he swim in the pool in his free time?"
    ]
  },
  {
    "id": "block-10-q-15",
    "blockNumber": 10,
    "qNum": 15,
    "skill": "reading_speaking",
    "prompt": "This pasta with cheese is very delicious.",
    "acceptedAnswers": [
      "This pasta with cheese is very delicious."
    ]
  },
  {
    "id": "block-10-q-16",
    "blockNumber": 10,
    "qNum": 16,
    "skill": "reading_translation",
    "prompt": "Do you eat pizza or pasta on Saturday night?",
    "acceptedAnswers": [
      "Você come pizza ou macarrão no sábado à noite?",
      "Você come pizza ou massa no sábado de noite?"
    ]
  },
  {
    "id": "block-10-q-17",
    "blockNumber": 10,
    "qNum": 17,
    "skill": "reading_translation",
    "prompt": "My mother doesn't eat fast food because she prefers healthy food.",
    "acceptedAnswers": [
      "Minha mãe não come fast food porque prefere comida saudável.",
      "Minha mãe não come comida rápida porque prefere comida saudável."
    ]
  },
  {
    "id": "block-10-q-18",
    "blockNumber": 10,
    "qNum": 18,
    "skill": "reading_translation",
    "prompt": "Where do they play soccer on Sunday morning?",
    "acceptedAnswers": [
      "Onde eles jogam futebol no domingo de manhã?"
    ]
  },
  {
    "id": "block-10-q-19",
    "blockNumber": 10,
    "qNum": 19,
    "skill": "reading_translation",
    "prompt": "He plays the guitar, but he doesn't play games on his computer.",
    "acceptedAnswers": [
      "Ele toca violão, mas não joga jogos no computador dele."
    ]
  },
  {
    "id": "block-10-q-20",
    "blockNumber": 10,
    "qNum": 20,
    "skill": "reading_translation",
    "prompt": "Does she teach English at the university?",
    "acceptedAnswers": [
      "Ela ensina inglês na universidade?"
    ]
  },
  {
    "id": "block-11-q-1",
    "blockNumber": 11,
    "qNum": 1,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "What time is it now?",
    "acceptedAnswers": [
      "What time is it now?"
    ]
  },
  {
    "id": "block-11-q-2",
    "blockNumber": 11,
    "qNum": 2,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "I leave home at half past seven.",
    "acceptedAnswers": [
      "I leave home at half past seven."
    ]
  },
  {
    "id": "block-11-q-3",
    "blockNumber": 11,
    "qNum": 3,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "She takes the subway to work.",
    "acceptedAnswers": [
      "She takes the subway to work."
    ]
  },
  {
    "id": "block-11-q-4",
    "blockNumber": 11,
    "qNum": 4,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "The train arrives at eight fifteen.",
    "acceptedAnswers": [
      "The train arrives at eight fifteen."
    ]
  },
  {
    "id": "block-11-q-5",
    "blockNumber": 11,
    "qNum": 5,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "We finish our work at five o'clock.",
    "acceptedAnswers": [
      "We finish our work at five o'clock."
    ]
  },
  {
    "id": "block-11-q-6",
    "blockNumber": 11,
    "qNum": 6,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "It is a quarter to nine in the morning.",
    "acceptedAnswers": [
      "São quinze para as nove da manhã."
    ]
  },
  {
    "id": "block-11-q-7",
    "blockNumber": 11,
    "qNum": 7,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "Do you go to school by bus or on foot?",
    "acceptedAnswers": [
      "Você vai para a escola de ônibus ou a pé?"
    ]
  },
  {
    "id": "block-11-q-8",
    "blockNumber": 11,
    "qNum": 8,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "My office is far, but the train is fast.",
    "acceptedAnswers": [
      "Meu escritório fica longe, mas o trem é rápido."
    ]
  },
  {
    "id": "block-11-q-9",
    "blockNumber": 11,
    "qNum": 9,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "He rides his bike to the park on Saturday.",
    "acceptedAnswers": [
      "Ele anda de bicicleta para o parque no sábado.",
      "Ele pedala até o parque no sábado."
    ]
  },
  {
    "id": "block-11-q-10",
    "blockNumber": 11,
    "qNum": 10,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "There is traffic in the city in the morning.",
    "acceptedAnswers": [
      "Há trânsito na cidade de manhã."
    ]
  },
  {
    "id": "block-11-q-11",
    "blockNumber": 11,
    "qNum": 11,
    "skill": "reading_speaking",
    "prompt": "It is twelve o'clock, and it is time for lunch.",
    "acceptedAnswers": [
      "It is twelve o'clock, and it is time for lunch."
    ]
  },
  {
    "id": "block-11-q-12",
    "blockNumber": 11,
    "qNum": 12,
    "skill": "reading_speaking",
    "prompt": "Does she arrive at the station at noon?",
    "acceptedAnswers": [
      "Does she arrive at the station at noon?"
    ]
  },
  {
    "id": "block-11-q-13",
    "blockNumber": 11,
    "qNum": 13,
    "skill": "reading_speaking",
    "prompt": "I don't drive my car because there is traffic.",
    "acceptedAnswers": [
      "I don't drive my car because there is traffic."
    ]
  },
  {
    "id": "block-11-q-14",
    "blockNumber": 11,
    "qNum": 14,
    "skill": "reading_speaking",
    "prompt": "We take the train at half past eight.",
    "acceptedAnswers": [
      "We take the train at half past eight."
    ]
  },
  {
    "id": "block-11-q-15",
    "blockNumber": 11,
    "qNum": 15,
    "skill": "reading_speaking",
    "prompt": "The trip by subway takes twenty minutes.",
    "acceptedAnswers": [
      "The trip by subway takes twenty minutes."
    ]
  },
  {
    "id": "block-11-q-16",
    "blockNumber": 11,
    "qNum": 16,
    "skill": "reading_translation",
    "prompt": "What time do you finish work on Friday?",
    "acceptedAnswers": [
      "A que horas você termina o trabalho na sexta-feira?",
      "Que horas você termina o trabalho na sexta-feira?"
    ]
  },
  {
    "id": "block-11-q-17",
    "blockNumber": 11,
    "qNum": 17,
    "skill": "reading_translation",
    "prompt": "She leaves the house at seven and arrives at eight.",
    "acceptedAnswers": [
      "Ela sai de casa às sete e chega às oito."
    ]
  },
  {
    "id": "block-11-q-18",
    "blockNumber": 11,
    "qNum": 18,
    "skill": "reading_translation",
    "prompt": "Is the subway station far from your apartment?",
    "acceptedAnswers": [
      "A estação de metrô fica longe do seu apartamento?"
    ]
  },
  {
    "id": "block-11-q-19",
    "blockNumber": 11,
    "qNum": 19,
    "skill": "reading_translation",
    "prompt": "We eat breakfast, and then we walk to the school.",
    "acceptedAnswers": [
      "Nós tomamos café da manhã e, depois, caminhamos para a escola."
    ]
  },
  {
    "id": "block-11-q-20",
    "blockNumber": 11,
    "qNum": 20,
    "skill": "reading_translation",
    "prompt": "He doesn't take the bus; he goes to work by bike.",
    "acceptedAnswers": [
      "Ele não pega o ônibus; ele vai para o trabalho de bicicleta."
    ]
  },
  {
    "id": "block-12-q-1",
    "blockNumber": 12,
    "qNum": 1,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "How is the weather outside today?",
    "acceptedAnswers": [
      "How is the weather outside today?"
    ]
  },
  {
    "id": "block-12-q-2",
    "blockNumber": 12,
    "qNum": 2,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "She can speak English very well.",
    "acceptedAnswers": [
      "She can speak English very well."
    ]
  },
  {
    "id": "block-12-q-3",
    "blockNumber": 12,
    "qNum": 3,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "I can't hear you.",
    "acceptedAnswers": [
      "I can't hear you."
    ]
  },
  {
    "id": "block-12-q-4",
    "blockNumber": 12,
    "qNum": 4,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "We can have a picnic in the park.",
    "acceptedAnswers": [
      "We can have a picnic in the park."
    ]
  },
  {
    "id": "block-12-q-5",
    "blockNumber": 12,
    "qNum": 5,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "In the winter, it is cold and windy.",
    "acceptedAnswers": [
      "In the winter, it is cold and windy."
    ]
  },
  {
    "id": "block-12-q-6",
    "blockNumber": 12,
    "qNum": 6,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "Can you repeat the question slowly, please?",
    "acceptedAnswers": [
      "Você pode repetir a pergunta devagar, por favor?"
    ]
  },
  {
    "id": "block-12-q-7",
    "blockNumber": 12,
    "qNum": 7,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "My brother can't swim in the pool.",
    "acceptedAnswers": [
      "Meu irmão não sabe nadar na piscina.",
      "Meu irmão não consegue nadar na piscina."
    ]
  },
  {
    "id": "block-12-q-8",
    "blockNumber": 12,
    "qNum": 8,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "Summer is my favorite season.",
    "acceptedAnswers": [
      "O verão é a minha estação favorita."
    ]
  },
  {
    "id": "block-12-q-9",
    "blockNumber": 12,
    "qNum": 9,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "It is raining, and we want to stay inside.",
    "acceptedAnswers": [
      "Está chovendo, e nós queremos ficar do lado de dentro.",
      "Está chovendo, e nós queremos ficar em casa."
    ]
  },
  {
    "id": "block-12-q-10",
    "blockNumber": 12,
    "qNum": 10,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "The weather in the spring is warm and sunny.",
    "acceptedAnswers": [
      "O clima na primavera é agradável e ensolarado.",
      "O tempo na primavera é ameno e ensolarado."
    ]
  },
  {
    "id": "block-12-q-11",
    "blockNumber": 12,
    "qNum": 11,
    "skill": "reading_speaking",
    "prompt": "Can you help me with this big suitcase?",
    "acceptedAnswers": [
      "Can you help me with this big suitcase?"
    ]
  },
  {
    "id": "block-12-q-12",
    "blockNumber": 12,
    "qNum": 12,
    "skill": "reading_speaking",
    "prompt": "It doesn't snow in Brazil in the winter.",
    "acceptedAnswers": [
      "It doesn't snow in Brazil in the winter."
    ]
  },
  {
    "id": "block-12-q-13",
    "blockNumber": 12,
    "qNum": 13,
    "skill": "reading_speaking",
    "prompt": "The temperature is cool in the evening.",
    "acceptedAnswers": [
      "The temperature is cool in the evening."
    ]
  },
  {
    "id": "block-12-q-14",
    "blockNumber": 12,
    "qNum": 14,
    "skill": "reading_speaking",
    "prompt": "She can sing, but she can't play the guitar.",
    "acceptedAnswers": [
      "She can sing, but she can't play the guitar."
    ]
  },
  {
    "id": "block-12-q-15",
    "blockNumber": 12,
    "qNum": 15,
    "skill": "reading_speaking",
    "prompt": "We can ride our bikes to the beach on Saturday.",
    "acceptedAnswers": [
      "We can ride our bikes to the beach on Saturday."
    ]
  },
  {
    "id": "block-12-q-16",
    "blockNumber": 12,
    "qNum": 16,
    "skill": "reading_translation",
    "prompt": "What is your favorite season: summer or winter?",
    "acceptedAnswers": [
      "Qual é a sua estação favorita: verão ou inverno?"
    ]
  },
  {
    "id": "block-12-q-17",
    "blockNumber": 12,
    "qNum": 17,
    "skill": "reading_translation",
    "prompt": "I can't see the train station from here.",
    "acceptedAnswers": [
      "Eu não consigo ver a estação de trem daqui.",
      "Eu não vejo a estação de trem daqui."
    ]
  },
  {
    "id": "block-12-q-18",
    "blockNumber": 12,
    "qNum": 18,
    "skill": "reading_translation",
    "prompt": "There are many beautiful flowers in the garden in the spring.",
    "acceptedAnswers": [
      "Há muitas flores bonitas no jardim na primavera."
    ]
  },
  {
    "id": "block-12-q-19",
    "blockNumber": 12,
    "qNum": 19,
    "skill": "reading_translation",
    "prompt": "It is very hot and sunny outside today.",
    "acceptedAnswers": [
      "Está muito quente e ensolarado lá fora hoje."
    ]
  },
  {
    "id": "block-12-q-20",
    "blockNumber": 12,
    "qNum": 20,
    "skill": "reading_translation",
    "prompt": "Can he drive a car to work every day?",
    "acceptedAnswers": [
      "Ele sabe dirigir carro para o trabalho todos os dias?",
      "Ele pode dirigir carro para o trabalho todo dia?"
    ]
  },
  {
    "id": "block-13-q-1",
    "blockNumber": 13,
    "qNum": 1,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "Can I see the menu, please?",
    "acceptedAnswers": [
      "Can I see the menu, please?"
    ]
  },
  {
    "id": "block-13-q-2",
    "blockNumber": 13,
    "qNum": 2,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "I would like a glass of water.",
    "acceptedAnswers": [
      "I would like a glass of water."
    ]
  },
  {
    "id": "block-13-q-3",
    "blockNumber": 13,
    "qNum": 3,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "How much does this soup cost?",
    "acceptedAnswers": [
      "How much does this soup cost?"
    ]
  },
  {
    "id": "block-13-q-4",
    "blockNumber": 13,
    "qNum": 4,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "We don't have any sugar at home.",
    "acceptedAnswers": [
      "We don't have any sugar at home."
    ]
  },
  {
    "id": "block-13-q-5",
    "blockNumber": 13,
    "qNum": 5,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "Can we have the bill, please?",
    "acceptedAnswers": [
      "Can we have the bill, please?"
    ]
  },
  {
    "id": "block-13-q-6",
    "blockNumber": 13,
    "qNum": 6,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "How many forks and knives are on the table?",
    "acceptedAnswers": [
      "Quantos garfos e facas estão sobre a mesa?"
    ]
  },
  {
    "id": "block-13-q-7",
    "blockNumber": 13,
    "qNum": 7,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "She eats a lot of vegetables and fruit.",
    "acceptedAnswers": [
      "Ela come muitos legumes e frutas."
    ]
  },
  {
    "id": "block-13-q-8",
    "blockNumber": 13,
    "qNum": 8,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "Would you like any dessert after dinner?",
    "acceptedAnswers": [
      "Você gostaria de alguma sobremesa depois do jantar?"
    ]
  },
  {
    "id": "block-13-q-9",
    "blockNumber": 13,
    "qNum": 9,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "The bill is thirty dollars, and we leave a tip.",
    "acceptedAnswers": [
      "A conta deu trinta dólares, e nós deixamos uma gorjeta."
    ]
  },
  {
    "id": "block-13-q-10",
    "blockNumber": 13,
    "qNum": 10,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "I would like chicken with rice and fresh salad.",
    "acceptedAnswers": [
      "Eu gostaria de frango com arroz e salada fresca."
    ]
  },
  {
    "id": "block-13-q-11",
    "blockNumber": 13,
    "qNum": 11,
    "skill": "reading_speaking",
    "prompt": "Are you ready to order your dinner?",
    "acceptedAnswers": [
      "Are you ready to order your dinner?"
    ]
  },
  {
    "id": "block-13-q-12",
    "blockNumber": 13,
    "qNum": 12,
    "skill": "reading_speaking",
    "prompt": "How much money do you have in your bag?",
    "acceptedAnswers": [
      "How much money do you have in your bag?"
    ]
  },
  {
    "id": "block-13-q-13",
    "blockNumber": 13,
    "qNum": 13,
    "skill": "reading_speaking",
    "prompt": "There are some clean plates in the kitchen.",
    "acceptedAnswers": [
      "There are some clean plates in the kitchen."
    ]
  },
  {
    "id": "block-13-q-14",
    "blockNumber": 13,
    "qNum": 14,
    "skill": "reading_speaking",
    "prompt": "He drinks a glass of red wine in the evening.",
    "acceptedAnswers": [
      "He drinks a glass of red wine in the evening."
    ]
  },
  {
    "id": "block-13-q-15",
    "blockNumber": 13,
    "qNum": 15,
    "skill": "reading_speaking",
    "prompt": "There isn't any salt in this soup.",
    "acceptedAnswers": [
      "There isn't any salt in this soup."
    ]
  },
  {
    "id": "block-13-q-16",
    "blockNumber": 13,
    "qNum": 16,
    "skill": "reading_translation",
    "prompt": "How many students are in the room today?",
    "acceptedAnswers": [
      "Quantos estudantes estão na sala hoje?"
    ]
  },
  {
    "id": "block-13-q-17",
    "blockNumber": 13,
    "qNum": 17,
    "skill": "reading_translation",
    "prompt": "Can you bring some water and two glasses, please?",
    "acceptedAnswers": [
      "Você pode trazer um pouco de água e dois copos, por favor?"
    ]
  },
  {
    "id": "block-13-q-18",
    "blockNumber": 13,
    "qNum": 18,
    "skill": "reading_translation",
    "prompt": "This sweet cake with tea is very delicious.",
    "acceptedAnswers": [
      "Este bolo doce com chá está muito delicioso."
    ]
  },
  {
    "id": "block-13-q-19",
    "blockNumber": 13,
    "qNum": 19,
    "skill": "reading_translation",
    "prompt": "The waiter brings the menu to our table.",
    "acceptedAnswers": [
      "O garçom traz o cardápio para a nossa mesa."
    ]
  },
  {
    "id": "block-13-q-20",
    "blockNumber": 13,
    "qNum": 20,
    "skill": "reading_translation",
    "prompt": "Does this plate cost ten or twelve dollars?",
    "acceptedAnswers": [
      "Este prato custa dez ou doze dólares?"
    ]
  },
  {
    "id": "block-14-q-1",
    "blockNumber": 14,
    "qNum": 1,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "Gabriel is taller than his brother.",
    "acceptedAnswers": [
      "Gabriel is taller than his brother."
    ]
  },
  {
    "id": "block-14-q-2",
    "blockNumber": 14,
    "qNum": 2,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "Whose phone is on the table?",
    "acceptedAnswers": [
      "Whose phone is on the table?"
    ]
  },
  {
    "id": "block-14-q-3",
    "blockNumber": 14,
    "qNum": 3,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "She has blonde hair and blue eyes.",
    "acceptedAnswers": [
      "She has blonde hair and blue eyes."
    ]
  },
  {
    "id": "block-14-q-4",
    "blockNumber": 14,
    "qNum": 4,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "This test is easier than the first test.",
    "acceptedAnswers": [
      "This test is easier than the first test."
    ]
  },
  {
    "id": "block-14-q-5",
    "blockNumber": 14,
    "qNum": 5,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "A small town is quieter than a big city.",
    "acceptedAnswers": [
      "A small town is quieter than a big city."
    ]
  },
  {
    "id": "block-14-q-6",
    "blockNumber": 14,
    "qNum": 6,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "How old is your sister? She is twenty years old.",
    "acceptedAnswers": [
      "Quantos anos tem a sua irmã? Ela tem vinte anos de idade."
    ]
  },
  {
    "id": "block-14-q-7",
    "blockNumber": 14,
    "qNum": 7,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "Leo's house is bigger and cheaper than my apartment.",
    "acceptedAnswers": [
      "A casa do Leo é maior e mais barata do que o meu apartamento."
    ]
  },
  {
    "id": "block-14-q-8",
    "blockNumber": 14,
    "qNum": 8,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "My brother's dog is very funny and smart.",
    "acceptedAnswers": [
      "O cachorro do meu irmão é muito engraçado e esperto."
    ]
  },
  {
    "id": "block-14-q-9",
    "blockNumber": 14,
    "qNum": 9,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "Winter in Canada is colder than in Brazil.",
    "acceptedAnswers": [
      "O inverno no Canadá é mais frio do que no Brasil."
    ]
  },
  {
    "id": "block-14-q-10",
    "blockNumber": 14,
    "qNum": 10,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "The coffee here is better than the coffee at the airport.",
    "acceptedAnswers": [
      "O café aqui é melhor do que o café no aeroporto."
    ]
  },
  {
    "id": "block-14-q-11",
    "blockNumber": 14,
    "qNum": 11,
    "skill": "reading_speaking",
    "prompt": "He has dark hair, and he is very kind.",
    "acceptedAnswers": [
      "He has dark hair, and he is very kind."
    ]
  },
  {
    "id": "block-14-q-12",
    "blockNumber": 14,
    "qNum": 12,
    "skill": "reading_speaking",
    "prompt": "The train is faster than the bus in the morning.",
    "acceptedAnswers": [
      "The train is faster than the bus in the morning."
    ]
  },
  {
    "id": "block-14-q-13",
    "blockNumber": 14,
    "qNum": 13,
    "skill": "reading_speaking",
    "prompt": "She is three years older than her friend.",
    "acceptedAnswers": [
      "She is three years older than her friend."
    ]
  },
  {
    "id": "block-14-q-14",
    "blockNumber": 14,
    "qNum": 14,
    "skill": "reading_speaking",
    "prompt": "Is your mother's car newer than your car?",
    "acceptedAnswers": [
      "Is your mother's car newer than your car?"
    ]
  },
  {
    "id": "block-14-q-15",
    "blockNumber": 14,
    "qNum": 15,
    "skill": "reading_speaking",
    "prompt": "This small town is very quiet and friendly.",
    "acceptedAnswers": [
      "This small town is very quiet and friendly."
    ]
  },
  {
    "id": "block-14-q-16",
    "blockNumber": 14,
    "qNum": 16,
    "skill": "reading_translation",
    "prompt": "Who is taller: your father or your brother?",
    "acceptedAnswers": [
      "Quem é mais alto: seu pai ou seu irmão?"
    ]
  },
  {
    "id": "block-14-q-17",
    "blockNumber": 14,
    "qNum": 17,
    "skill": "reading_translation",
    "prompt": "Traffic in the city is worse on Monday morning.",
    "acceptedAnswers": [
      "O trânsito na cidade é pior na segunda-feira de manhã."
    ]
  },
  {
    "id": "block-14-q-18",
    "blockNumber": 14,
    "qNum": 18,
    "skill": "reading_translation",
    "prompt": "Where are Daniel's keys? They are in his backpack.",
    "acceptedAnswers": [
      "Onde estão as chaves do Daniel? Elas estão na mochila dele."
    ]
  },
  {
    "id": "block-14-q-19",
    "blockNumber": 14,
    "qNum": 19,
    "skill": "reading_translation",
    "prompt": "She has green eyes and short brown hair.",
    "acceptedAnswers": [
      "Ela tem olhos verdes e cabelo castanho curto."
    ]
  },
  {
    "id": "block-14-q-20",
    "blockNumber": 14,
    "qNum": 20,
    "skill": "reading_translation",
    "prompt": "English is easier than French, and I like it.",
    "acceptedAnswers": [
      "Inglês é mais fácil do que francês, e eu gosto."
    ]
  },
  {
    "id": "block-15-q-1",
    "blockNumber": 15,
    "qNum": 1,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "I was at home yesterday evening.",
    "acceptedAnswers": [
      "I was at home yesterday evening."
    ]
  },
  {
    "id": "block-15-q-2",
    "blockNumber": 15,
    "qNum": 2,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "She worked at the hospital last week.",
    "acceptedAnswers": [
      "She worked at the hospital last week."
    ]
  },
  {
    "id": "block-15-q-3",
    "blockNumber": 15,
    "qNum": 3,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "Did you call your mother this morning?",
    "acceptedAnswers": [
      "Did you call your mother this morning?"
    ]
  },
  {
    "id": "block-15-q-4",
    "blockNumber": 15,
    "qNum": 4,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "We didn't arrive on time because there was traffic.",
    "acceptedAnswers": [
      "We didn't arrive on time because there was traffic."
    ]
  },
  {
    "id": "block-15-q-5",
    "blockNumber": 15,
    "qNum": 5,
    "skill": "listening_writing",
    "prompt": "Ouça o áudio e digite a frase exata em inglês.",
    "audioText": "He lived in Canada two years ago.",
    "acceptedAnswers": [
      "He lived in Canada two years ago."
    ]
  },
  {
    "id": "block-15-q-6",
    "blockNumber": 15,
    "qNum": 6,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "Were you at the hotel with your family yesterday?",
    "acceptedAnswers": [
      "Você estava no hotel com a sua família ontem?"
    ]
  },
  {
    "id": "block-15-q-7",
    "blockNumber": 15,
    "qNum": 7,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "My brother cleaned the house and cooked dinner.",
    "acceptedAnswers": [
      "Meu irmão limpou a casa e cozinhou o jantar."
    ]
  },
  {
    "id": "block-15-q-8",
    "blockNumber": 15,
    "qNum": 8,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "What did you study at the university last year?",
    "acceptedAnswers": [
      "O que você estudou na universidade no ano passado?"
    ]
  },
  {
    "id": "block-15-q-9",
    "blockNumber": 15,
    "qNum": 9,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "She didn't visit her doctor three days ago.",
    "acceptedAnswers": [
      "Ela não visitou o médico dela três dias atrás."
    ]
  },
  {
    "id": "block-15-q-10",
    "blockNumber": 15,
    "qNum": 10,
    "skill": "listening_translation",
    "prompt": "Ouça o áudio e digite a tradução em português.",
    "audioText": "The weather was cold and rainy last Sunday.",
    "acceptedAnswers": [
      "O tempo estava frio e chuvoso no domingo passado."
    ]
  },
  {
    "id": "block-15-q-11",
    "blockNumber": 15,
    "qNum": 11,
    "skill": "reading_speaking",
    "prompt": "They were very happy at the restaurant.",
    "acceptedAnswers": [
      "They were very happy at the restaurant."
    ]
  },
  {
    "id": "block-15-q-12",
    "blockNumber": 15,
    "qNum": 12,
    "skill": "reading_speaking",
    "prompt": "Did she study English yesterday afternoon?",
    "acceptedAnswers": [
      "Did she study English yesterday afternoon?"
    ]
  },
  {
    "id": "block-15-q-13",
    "blockNumber": 15,
    "qNum": 13,
    "skill": "reading_speaking",
    "prompt": "I didn't drive my car because I walked on foot.",
    "acceptedAnswers": [
      "I didn't drive my car because I walked on foot."
    ]
  },
  {
    "id": "block-15-q-14",
    "blockNumber": 15,
    "qNum": 14,
    "skill": "reading_speaking",
    "prompt": "The train arrived at the station ten minutes ago.",
    "acceptedAnswers": [
      "The train arrived at the station ten minutes ago."
    ]
  },
  {
    "id": "block-15-q-15",
    "blockNumber": 15,
    "qNum": 15,
    "skill": "reading_speaking",
    "prompt": "We stayed at the hotel and called our friends.",
    "acceptedAnswers": [
      "We stayed at the hotel and called our friends."
    ]
  },
  {
    "id": "block-15-q-16",
    "blockNumber": 15,
    "qNum": 16,
    "skill": "reading_translation",
    "prompt": "Where did you live two years ago?",
    "acceptedAnswers": [
      "Onde você morava dois anos atrás?",
      "Onde você viveu dois anos atrás?"
    ]
  },
  {
    "id": "block-15-q-17",
    "blockNumber": 15,
    "qNum": 17,
    "skill": "reading_translation",
    "prompt": "Was your sister at the office yesterday morning?",
    "acceptedAnswers": [
      "A sua irmã estava no escritório ontem de manhã?"
    ]
  },
  {
    "id": "block-15-q-18",
    "blockNumber": 15,
    "qNum": 18,
    "skill": "reading_translation",
    "prompt": "He didn't eat meat because he prefers vegetables.",
    "acceptedAnswers": [
      "Ele não comeu carne porque prefere legumes."
    ]
  },
  {
    "id": "block-15-q-19",
    "blockNumber": 15,
    "qNum": 19,
    "skill": "reading_translation",
    "prompt": "Did they take the subway or the bus yesterday?",
    "acceptedAnswers": [
      "Eles pegaram o metrô ou o ônibus ontem?"
    ]
  },
  {
    "id": "block-15-q-20",
    "blockNumber": 15,
    "qNum": 20,
    "skill": "reading_translation",
    "prompt": "I loved this trip because the people were very friendly.",
    "acceptedAnswers": [
      "Eu amei esta viagem porque as pessoas foram muito simpáticas."
    ]
  }
];

const BLOCK_ONE_APPENDIX: Array<[string, string]> = [
  ['The teacher and the principal are in the school.', 'A professora e a diretora estão na escola.'],
  ['I am ready.', 'Eu estou pronto.'],
  ['He is hungry.', 'Ele está com fome.'],
  ['It is an orange.', 'É uma laranja.'],
  ['The eraser and the pencil are on the table.', 'A borracha e o lápis estão sobre a mesa.'],
  ['She is in the library.', 'Ela está na biblioteca.'],
  ['We are tired.', 'Nós estamos cansados.'],
  ['The lunchbox is under the table.', 'A lancheira está embaixo da mesa.'],
  ['A sandwich and an apple.', 'Um sanduíche e uma maçã.'],
  ['The janitor is in the classroom.', 'O zelador está na sala de aula.'],
];

const shuffle = <T>(items: T[]): T[] => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

function drawBlockOneQuestions(): BlockTestQuestion[] {
  const known = new Map<string, [string, string]>();
  for (const card of BLOCK_ONE_LESSONS.flatMap((lesson) => lesson.cards)) {
    if (card.type === 'phrase' || card.type === 'dialogue') {
      known.set(card.english.toLowerCase(), [card.english, card.portuguese]);
    }
  }
  const sentences = shuffle([...shuffle([...known.values()]).slice(0, 5), ...shuffle(BLOCK_ONE_APPENDIX).slice(0, 5)]);
  const skills: BlockTestSkill[] = ['listening_writing', 'listening_translation', 'reading_speaking', 'reading_translation'];
  const formats = shuffle([...skills, ...skills, ...shuffle(skills).slice(0, 2)]);
  return sentences.map(([english, portuguese], index) => {
    const skill = formats[index];
    const isTranslation = skill === 'listening_translation' || skill === 'reading_translation';
    const answers: string[] = [];
    if (isTranslation) {
      answers.push(portuguese);
      if (portuguese.startsWith('Ela é a ')) {
        answers.push(portuguese.replace('Ela é a ', 'Ela é '));
      } else if (portuguese.startsWith('Ele é o ')) {
        answers.push(portuguese.replace('Ele é o ', 'Ele é '));
      }
    } else {
      answers.push(english);
    }
    return {
      id: `block-1-revised-${english}`,
      blockNumber: 1,
      qNum: index + 1,
      skill,
      prompt: skill === 'listening_writing' ? 'Ouça e escreva em inglês.'
        : skill === 'listening_translation' ? 'Ouça e traduza para o português.'
        : skill === 'reading_speaking' ? 'Leia a frase em voz alta.'
        : 'Leia e traduza para o português.',
      audioText: english,
      acceptedAnswers: answers,
    };
  });
}

export const ALL_BLOCK_TEST_QUESTIONS = LEGACY_BLOCK_TEST_QUESTIONS.filter((q) => q.blockNumber !== 1);

export const BLOCK_TESTS_MAP: Record<number, BlockTestQuestion[]> = {};
for (let b = 1; b <= 15; b++) {
  BLOCK_TESTS_MAP[b] = b === 1 ? drawBlockOneQuestions() : ALL_BLOCK_TEST_QUESTIONS.filter((q) => q.blockNumber === b);
}

/**
 * Sorteia 10 questões aleatórias do banco de 20 itens de um bloco,
 * garantindo uma distribuição equilibrada das 4 habilidades (no mínimo 2 de cada tipo).
 */
export function drawBlockTestQuestions(blockNumber: number): BlockTestQuestion[] {
  if (blockNumber === 1) return drawBlockOneQuestions();
  const blockPool = ALL_BLOCK_TEST_QUESTIONS.filter((q) => q.blockNumber === blockNumber);
  if (blockPool.length === 0) return [];

  const bySkill: Record<BlockTestSkill, BlockTestQuestion[]> = {
    listening_writing: [],
    listening_translation: [],
    reading_speaking: [],
    reading_translation: [],
  };

  for (const q of blockPool) {
    if (bySkill[q.skill]) {
      bySkill[q.skill].push(q);
    }
  }

  // Embaralha cada grupo
  const selected: BlockTestQuestion[] = [];
  const remainingPool: BlockTestQuestion[] = [];

  // Pega 2 de cada habilidade obrigatórias (2 * 4 = 8 questões)
  for (const skill of Object.keys(bySkill) as BlockTestSkill[]) {
    const shuffled = shuffle(bySkill[skill]);
    selected.push(...shuffled.slice(0, 2));
    remainingPool.push(...shuffled.slice(2));
  }

  // Pega mais 2 aleatórias do restante para completar as 10 questões do exame
  const extraShuffled = shuffle(remainingPool);
  selected.push(...extraShuffled.slice(0, 2));

  // Embaralha as 10 questões finais para que a ordem da prova seja dinâmica
  return shuffle(selected);
}

/**
 * Avalia a resposta do aluno com tolerância inteligente de pontuação e contrações.
 */
export interface BlockAnswerWordFeedback {
  spoken: string;
  expected?: string;
  status: 'correct' | 'attention' | 'missing';
}

export interface BlockTestResponseEvaluation {
  isCorrect: boolean;
  matchedAnswer?: string;
  accuracyPercent?: number;
  feedback?: string;
  wordFeedback?: BlockAnswerWordFeedback[];
  requiresRetry?: boolean;
}

const PORTUGUESE_EQUIVALENTS = [
  ['aluno', 'aluna', 'estudante'],
  ['escola', 'colegio'],
  ['garoto', 'menino'],
  ['garota', 'menina'],
  ['carro', 'automovel'],
  ['casa', 'lar'],
];

function normalizedWords(text: string): string[] {
  return (text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function sourceUsesIndefiniteArticle(question: BlockTestQuestion): boolean {
  return normalizedWords(question.audioText || '').some((word) => word === 'a' || word === 'an');
}

function sourceStartsWithProperName(question: BlockTestQuestion, words: string[]): boolean {
  const source = (question.audioText || '').trim().match(/^([A-Za-zÀ-ÿ]+)/)?.[1] ?? '';
  const firstAnswerWord = words[0] === 'o' || words[0] === 'a' ? words[1] : words[0];
  return Boolean(
    source &&
    /^[A-Z]/.test(source) &&
    !['The', 'A', 'An'].includes(source) &&
    firstAnswerWord === normalizeForNameComparison(source)
  );
}

function normalizeForNameComparison(text: string): string {
  return normalizedWords(text)[0] ?? '';
}

function sameTranslation(question: BlockTestQuestion, left: string, right: string): boolean {
  const canonicalize = (text: string) => {
    const words = normalizedWords(text);
    // "Um/uma" é opcional somente quando corresponde ao a/an da frase em inglês.
    // "O/a" antes de nome próprio é aceito no português brasileiro, sem generalizar
    // essa remoção para artigos definidos em outros contextos.
    const contextualWords = words.filter((word, index) => {
      if ((word === 'um' || word === 'uma') && sourceUsesIndefiniteArticle(question)) return false;
      if (index === 0 && (word === 'o' || word === 'a') && sourceStartsWithProperName(question, words)) return false;
      return true;
    });
    return contextualWords.map((word) => PORTUGUESE_EQUIVALENTS.find((group) => group.includes(word))?.[0] ?? word);
  };
  const a = canonicalize(left);
  const b = canonicalize(right);
  return a.length === b.length && a.every((word, index) => word === b[index]);
}

function evaluateSpeechTranscript(transcript: string, expected: string): {
  matchedWords: number;
  accuracyPercent: number;
  wordFeedback: BlockAnswerWordFeedback[];
} {
  const heard = normalizedWords(transcript);
  const target = normalizedWords(expected);
  const wordFeedback: BlockAnswerWordFeedback[] = [];
  let heardIndex = 0;
  let targetIndex = 0;
  let matchedWords = 0;

  while (heardIndex < heard.length || targetIndex < target.length) {
    if (heardIndex < heard.length && targetIndex < target.length && heard[heardIndex] === target[targetIndex]) {
      wordFeedback.push({ spoken: heard[heardIndex], expected: target[targetIndex], status: 'correct' });
      matchedWords++;
      heardIndex++;
      targetIndex++;
    } else if (heardIndex < heard.length && targetIndex < target.length) {
      wordFeedback.push({ spoken: heard[heardIndex], expected: target[targetIndex], status: 'attention' });
      heardIndex++;
      targetIndex++;
    } else if (heardIndex < heard.length) {
      wordFeedback.push({ spoken: heard[heardIndex], status: 'attention' });
      heardIndex++;
    } else {
      wordFeedback.push({ spoken: '—', expected: target[targetIndex], status: 'missing' });
      targetIndex++;
    }
  }

  return {
    matchedWords,
    accuracyPercent: Math.round((matchedWords / Math.max(target.length, 1)) * 100),
    wordFeedback,
  };
}

function personalNameArticleTip(question: BlockTestQuestion, response: string): string | undefined {
  const responseWords = normalizedWords(response);
  const sourceWords = normalizedWords(question.audioText || '');
  const article = responseWords[0];
  const possibleName = responseWords[1];
  if (
    (article === 'o' || article === 'a') &&
    possibleName &&
    sourceWords[0] === possibleName &&
    sourceWords[0] !== 'the' && sourceWords[0] !== 'a' && sourceWords[0] !== 'an'
  ) {
    return `No português, “${article === 'o' ? 'O' : 'A'} ${possibleName}” é natural. Em inglês, porém, usamos apenas “${possibleName}”, sem “the”.`;
  }
  return undefined;
}

export function evaluateBlockTestResponse(
  arg1: BlockTestQuestion | string,
  arg2: string | BlockTestQuestion
): BlockTestResponseEvaluation {
  const question = (typeof arg1 === 'object' ? arg1 : arg2) as BlockTestQuestion;
  const userResponse = (typeof arg1 === 'string' ? arg1 : arg2) as string;

  const normalize = (text: string): string =>
    (text || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-zA-Z0-9À-ÿ\s]/g, '')
      .replace(/\s+/g, ' ');

  const normalizedUser = normalize(userResponse);
  if (!normalizedUser) return { isCorrect: false };

  const expectedSpeech = question.audioText || question.acceptedAnswers?.[0] || '';
  if (question.skill === 'reading_speaking' && expectedSpeech) {
    const speech = evaluateSpeechTranscript(userResponse, expectedSpeech);
    // A transcrição do navegador não é uma prova de pronúncia. Ela dá feedback por
    // palavra, mas só confirma a questão quando há correspondência reconhecida.
    const isCorrect = speech.matchedWords > 0;
    return {
      isCorrect,
      requiresRetry: !isCorrect,
      matchedAnswer: expectedSpeech,
      accuracyPercent: speech.accuracyPercent,
      wordFeedback: speech.wordFeedback,
      feedback: isCorrect
        ? speech.accuracyPercent === 100
          ? 'Pronúncia compreendida. Muito bem!'
          : 'A transcrição pode falhar. As palavras em verde foram compreendidas; ouça o modelo e pratique as destacadas.'
        : 'O microfone não encontrou palavras em comum desta vez. Ouça o modelo com calma e tente de novo.',
    };
  }

  if (Array.isArray(question.acceptedAnswers)) {
    for (const accepted of question.acceptedAnswers) {
      if (
        normalize(accepted) === normalizedUser ||
        ((question.skill === 'listening_translation' || question.skill === 'reading_translation') &&
          sameTranslation(question, accepted, userResponse))
      ) {
        return {
          isCorrect: true,
          matchedAnswer: accepted,
          feedback: personalNameArticleTip(question, userResponse),
        };
      }
    }
  }

  if ((question.skill === 'listening_writing' || question.skill === 'reading_speaking') &&
      question.audioText && normalize(question.audioText) === normalizedUser) {
    return { isCorrect: true, matchedAnswer: question.audioText };
  }

  return { isCorrect: false };
}
