import { LetterDiffItem, WordCorrespondenceItem } from '../types';

export interface AnkiSpanSegment {
  text: string;
  status: 'correct' | 'wrong' | 'missing';
}

export interface AnkiStyleDiffResult {
  isSubmitted: boolean;
  accuracyPercent: number;
  bestExpectedVariant: string;
  userSegments: AnkiSpanSegment[];
  targetSegments: AnkiSpanSegment[];
  letters: LetterDiffItem[]; // Mantido para retrocompatibilidade
}

/**
 * Grupos de expressões e palavras equivalentes (sinônimos de tradução) para que
 * o aluno tenha sua resposta considerada verde (correta) mesmo usando um sinônimo!
 * Ex: "novamente" <-> "de novo" <-> "outra vez"
 */
const SYNONYM_GROUPS: string[][] = [
  ['novamente', 'de novo', 'outra vez'],
  ['menino', 'garoto'],
  ['meninos', 'garotos'],
  ['menina', 'garota'],
  ['meninas', 'garotas'],
  ['casa', 'lar', 'residencia', 'residência'],
  ['carro', 'automovel', 'automóvel'],
  ['cachorro', 'cao', 'cão'],
  ['olá', 'ola', 'oi'],
  ['obrigado', 'obrigada'],
  ['por favor', 'favor'],
  ['dinheiro', 'grana'],
  ['bonito', 'lindo', 'belo'],
  ['bonita', 'linda', 'bela'],
  ['rápido', 'rapido', 'veloz'],
  ['devagar', 'lentamente', 'lento'],
  ['difícil', 'dificil', 'duro'],
  ['fácil', 'facil', 'tranquilo'],
  ['começar', 'comecar', 'iniciar'],
  ['terminar', 'acabar', 'finalizar'],
  ['feliz', 'alegre', 'contente'],
  ['triste', 'melancólico', 'melancolico'],
  ['bravo', 'zangado', 'irritado'],
  ['empolgado', 'animado'],
  ['professor', 'professora'],
  ['amigo', 'amiga'],
  ['amigos', 'amigas'],
  ['estudante', 'aluno', 'aluna'],
  ['médico', 'medico', 'doutor', 'doutora'],
  ['banheiro', 'toalete', 'sanitário'],
  ['celular', 'telefone celular', 'telefone'],
  ['computador', 'pc'],
  ['ônibus', 'onibus'],
  ['trem', 'comboio'],
  ['caminhar', 'andar'],
  ['correr', 'executar'],
  ['olhar', 'ver', 'observar'],
  ['ouvir', 'escutar'],
  ['falar', 'dizer', 'conversar'],
  ['querer', 'desejar'],
  ['precisar', 'necessitar'],
  ['ajudar', 'socorrer'],
  ['esperar', 'aguardar'],
  ['tentar', 'experimentar'],
  ['morar', 'viver'],
  ['pequeno', 'reduzido', 'pouco'],
  ['grande', 'amplo', 'enorme'],
  ['apenas', 'só', 'somente'],
  ['também', 'tambem', 'além disso'],
  ['talvez', 'quem sabe', 'porventura'],
  ['sempre', 'toda vez'],
  ['nunca', 'jamais'],
  ['agora', 'neste momento', 'já'],
  ['cedo', 'adiantado'],
  ['tarde', 'atrasado'],
  ['certo', 'correto'],
  ['errado', 'incorreto'],
  ['perto', 'próximo', 'proximo'],
  ['longe', 'distante'],
  ['dentro', 'no interior'],
  ['fora', 'para fora'],
  ['em cima', 'sobre', 'acima'],
  ['embaixo', 'sob', 'abaixo'],
];

/**
 * Normaliza uma string mantendo letras, números, acentos e apóstrofos internos,
 * mas limpando pontuação de borda e espaços duplicados.
 */
export function normalizeText(input: string): string {
  return input
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/^[.,!?;:"“”]+|[.,!?;:"“”]+$/g, '');
}

function cleanWordForComparison(word: string): string {
  return word
    .toLowerCase()
    .replace(/[.,!?;:"“”()]/g, '')
    .trim();
}

/**
 * Substitui expressões equivalentes na frase alvo para se alinhar ao sinônimo válido
 * que o aluno escolheu escrever!
 * Exemplo: Se o gabarito tem "novamente" e o aluno escreveu "de novo", adapta o gabarito
 * para "de novo" antes de comparar, marcando tudo em verde!
 */
function harmonizeSynonymsInTarget(userStr: string, targetStr: string): string {
  let adaptedTarget = targetStr;
  const userLower = userStr.toLowerCase();

  for (const group of SYNONYM_GROUPS) {
    // Verifica qual termo do grupo aparece no texto do aluno (priorizando expressões mais longas como "de novo")
    const sortedGroup = [...group].sort((a, b) => b.length - a.length);
    const userUsedSynonym = sortedGroup.find((syn) => {
      const escaped = syn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(^|\\s|[.,!?;:])${escaped}($|\\s|[.,!?;:])`, 'i');
      return regex.test(userLower);
    });

    if (!userUsedSynonym) continue;

    for (const targetSyn of sortedGroup) {
      if (targetSyn.toLowerCase() === userUsedSynonym.toLowerCase()) continue;
      const escapedTarget = targetSyn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regexTarget = new RegExp(
        `(^|\\s)([A-Za-zÀ-ÿ\\s]*?\\b${escapedTarget}\\b)([.,!?;:]?)(?=\\s|$)`,
        'i'
      );

      const directRegex = new RegExp(
        `(^|\\s)(${escapedTarget})([.,!?;:]?)(?=\\s|$)`,
        'gi'
      );
      if (directRegex.test(adaptedTarget)) {
        adaptedTarget = adaptedTarget.replace(
          directRegex,
          (_match, prefix: string, originalWord: string, punct: string) => {
            // Preserva letra maiúscula inicial se houver
            const isCapitalized =
              originalWord.length > 0 &&
              originalWord[0] === originalWord[0].toUpperCase() &&
              originalWord[0] !== originalWord[0].toLowerCase();
            const replacement = isCapitalized
              ? userUsedSynonym.charAt(0).toUpperCase() + userUsedSynonym.slice(1)
              : userUsedSynonym;
            return `${prefix}${replacement}${punct}`;
          }
        );
      } else if (regexTarget.test(adaptedTarget)) {
        // Caso geral seguro
      }
    }
  }

  return adaptedTarget;
}

/**
 * Verifica se duas palavras são iguais (ignorando maiúsculas/minúsculas e pontuação final)
 * ou se pertencem ao mesmo grupo de sinônimos.
 */
function areWordsEquivalent(wordA: string, wordB: string): boolean {
  const a = cleanWordForComparison(wordA);
  const b = cleanWordForComparison(wordB);
  if (!a || !b) return a === b;
  if (a === b) return true;

  for (const group of SYNONYM_GROUPS) {
    const normalizedGroup = group.map((g) => g.toLowerCase());
    if (normalizedGroup.includes(a) && normalizedGroup.includes(b)) {
      return true;
    }
  }
  return false;
}

/**
 * Algoritmo de alinhamento por PALAVRA INTEIRA no estilo Anki:
 * - Nunca quebra uma palavra incorreta no meio (ex: "ele" vs "ela" marca a palavra "ele" inteira em vermelho
 *   e "ela" inteira como esperada na linha de baixo, sem misturar "el--e" ou juntar com "novamente").
 * - Quando falta uma palavra (ex: o aluno omitiu "dela"), insere "-----" na linha do aluno
 *   e destaca "dela" em cinza na linha do gabarito, idêntico ao Anki!
 * - Reconhece sinônimos e expressões equivalentes (ex: "de novo" = "novamente").
 */
function computeWordLevelAnkiDiff(
  userRaw: string,
  targetRaw: string
): {
  accuracyPercent: number;
  userSegments: AnkiSpanSegment[];
  targetSegments: AnkiSpanSegment[];
} {
  const harmonizedTarget = harmonizeSynonymsInTarget(userRaw, targetRaw);

  const userWords = userRaw.trim().split(/\s+/).filter(Boolean);
  const targetWords = harmonizedTarget.trim().split(/\s+/).filter(Boolean);

  const n = userWords.length;
  const m = targetWords.length;

  // Matriz de Programação Dinâmica (LCS por palavra inteira)
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    Array(m + 1).fill(0)
  );

  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      if (areWordsEquivalent(userWords[i], targetWords[j])) {
        dp[i][j] = 1 + dp[i + 1][j + 1];
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  const userSegments: AnkiSpanSegment[] = [];
  const targetSegments: AnkiSpanSegment[] = [];

  let i = 0;
  let j = 0;
  let matchedWords = 0;

  while (i < n || j < m) {
    // 1. Palavra idêntica ou sinônimo direto: ambos ficam verdes!
    if (i < n && j < m && areWordsEquivalent(userWords[i], targetWords[j])) {
      userSegments.push({ text: userWords[i], status: 'correct' });
      targetSegments.push({ text: targetWords[j], status: 'correct' });
      matchedWords++;
      i++;
      j++;
      continue;
    }

    // Coleta o bloco de palavras divergentes até o próximo ponto de ancoragem (match)
    const unmatchedUser: string[] = [];
    const unmatchedTarget: string[] = [];

    while (
      i < n &&
      j < m &&
      !areWordsEquivalent(userWords[i], targetWords[j])
    ) {
      if (dp[i + 1][j] > dp[i][j + 1]) {
        unmatchedUser.push(userWords[i]);
        i++;
      } else if (dp[i][j + 1] > dp[i + 1][j]) {
        unmatchedTarget.push(targetWords[j]);
        j++;
      } else {
        // Empate no LCS: substituição 1 para 1 de palavra inteira (ex: "ele" vs "ela", "casado" vs "casada")
        unmatchedUser.push(userWords[i]);
        unmatchedTarget.push(targetWords[j]);
        i++;
        j++;
      }
    }

    while (i < n && (j >= m || dp[i + 1][j] === dp[i][j])) {
      if (j < m && areWordsEquivalent(userWords[i], targetWords[j])) break;
      unmatchedUser.push(userWords[i]);
      i++;
    }

    while (j < m && (i >= n || dp[i][j + 1] === dp[i][j])) {
      if (i < n && areWordsEquivalent(userWords[i], targetWords[j])) break;
      unmatchedTarget.push(targetWords[j]);
      j++;
    }

    const pairCount = Math.max(unmatchedUser.length, unmatchedTarget.length);
    for (let k = 0; k < pairCount; k++) {
      const uWord = unmatchedUser[k];
      const tWord = unmatchedTarget[k];

      if (uWord !== undefined && tWord !== undefined) {
        // Substituição de palavra: linha superior marca em vermelho ('wrong'), linha inferior destaca a palavra esperada ('missing')
        userSegments.push({ text: uWord, status: 'wrong' });
        targetSegments.push({ text: tWord, status: 'missing' });
      } else if (uWord === undefined && tWord !== undefined) {
        // Palavra faltando na resposta do aluno: coloca traços "-----" na linha superior e destaca a palavra na inferior
        const dashes = '-'.repeat(Math.max(3, tWord.length));
        userSegments.push({ text: dashes, status: 'missing' });
        targetSegments.push({ text: tWord, status: 'missing' });
      } else if (uWord !== undefined && tWord === undefined) {
        // Palavra extra digitada pelo aluno
        userSegments.push({ text: uWord, status: 'wrong' });
      }
    }
  }

  // Agrupa segmentos adjacentes de mesmo status separados por espaço para criar a faixa contínua limpa do Anki!
  const mergedUser = mergeAdjacentSegments(userSegments);
  const mergedTarget = mergeAdjacentSegments(targetSegments);

  const totalWords = Math.max(n, m, 1);
  const accuracyPercent = Math.round((matchedWords / totalWords) * 100);

  return {
    accuracyPercent,
    userSegments: mergedUser,
    targetSegments: mergedTarget,
  };
}

function mergeAdjacentSegments(segments: AnkiSpanSegment[]): AnkiSpanSegment[] {
  const result: AnkiSpanSegment[] = [];
  for (const seg of segments) {
    const prev = result[result.length - 1];
    if (prev && prev.status === seg.status) {
      prev.text = `${prev.text} ${seg.text}`;
    } else {
      result.push({ ...seg });
    }
  }
  return result;
}

/**
 * Avalia a resposta do aluno em comparação com o gabarito (suportando múltiplas traduções
 * separadas por "/" como "O / A / Os / As" ou "Menino / Garoto", além de sinônimos como "de novo" = "novamente").
 */
export function evaluateLetterCorrespondence(
  userInput: string,
  expectedRaw: string
): AnkiStyleDiffResult {
  const cleanedUser = normalizeText(userInput);
  if (!cleanedUser) {
    return {
      isSubmitted: false,
      accuracyPercent: 0,
      bestExpectedVariant: expectedRaw,
      userSegments: [],
      targetSegments: [],
      letters: [],
    };
  }

  // Remove notas entre parênteses para não cobrar explicações metalinguísticas do aluno
  const rawWithoutParens = expectedRaw.replace(/\([^)]*\)/g, '').trim();

  // Separa variantes por "/" ou ";" (ex: "O / A / Os / As" ou "Menino / Garoto")
  const baseVariants = rawWithoutParens
    .split(/[/;]/)
    .map((v) => normalizeText(v))
    .filter((v) => v.length > 0);

  // Se houver múltiplas traduções (ex: ["O", "A", "Os", "As"]), o aluno pode digitar:
  // - Apenas uma delas ("o")
  // - Duas ou mais separadas por espaço ou vírgula ("o a", "o a os as", "menino garoto")
  // Nunca cobramos a barra "/" como parte da resposta!
  if (baseVariants.length > 1) {
    // Limpa barras ou vírgulas caso o próprio aluno tenha digitado ou apenas espaços
    const userTokens = cleanedUser
      .replace(/[/,;]+/g, ' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    // Verifica se o que o aluno digitou é uma combinação de 2 ou mais traduções válidas da lista
    if (userTokens.length > 1) {
      const matchedTargetParts: string[] = [];
      let allUserTokensMatchSomeVariant = true;
      let cursor = 0;

      while (cursor < userTokens.length) {
        let matchedHere = false;
        // Tenta casar variantes de múltiplas palavras primeiro, depois de 1 palavra
        const sortedVariants = [...baseVariants].sort(
          (a, b) => b.split(/\s+/).length - a.split(/\s+/).length
        );

        for (const variant of sortedVariants) {
          const vWords = variant.split(/\s+/).filter(Boolean);
          const slice = userTokens.slice(cursor, cursor + vWords.length);
          if (
            slice.length === vWords.length &&
            slice.every((w, idx) => areWordsEquivalent(w, vWords[idx]))
          ) {
            matchedTargetParts.push(variant);
            cursor += vWords.length;
            matchedHere = true;
            break;
          }
        }

        if (!matchedHere) {
          allUserTokensMatchSomeVariant = false;
          break;
        }
      }

      if (allUserTokensMatchSomeVariant && matchedTargetParts.length > 0) {
        const joinedUser = userTokens.join(' ');
        const joinedTarget = matchedTargetParts.join(' ');
        return {
          isSubmitted: true,
          accuracyPercent: 100,
          bestExpectedVariant: joinedTarget,
          userSegments: [{ text: joinedUser, status: 'correct' }],
          targetSegments: [{ text: joinedTarget, status: 'correct' }],
          letters: [{ char: joinedUser, expectedChar: joinedTarget, status: 'correct' }],
        };
      }
    }
  }

  const variants = [...baseVariants];
  // Adiciona também a versão de todas as variantes separadas apenas por espaço (sem a barra "/")
  if (baseVariants.length > 1) {
    const spaceJoinedVariants = baseVariants.join(' ');
    if (!variants.includes(spaceJoinedVariants)) {
      variants.push(spaceJoinedVariants);
    }
  } else {
    const fullNormalized = normalizeText(rawWithoutParens);
    if (fullNormalized && !variants.includes(fullNormalized)) {
      variants.unshift(fullNormalized);
    }
  }

  if (variants.length === 0) {
    variants.push(normalizeText(expectedRaw));
  }

  let bestVariant = variants[0];
  let bestDiff = computeWordLevelAnkiDiff(cleanedUser, variants[0]);

  for (const variant of variants) {
    const diff = computeWordLevelAnkiDiff(cleanedUser, variant);
    if (diff.accuracyPercent > bestDiff.accuracyPercent) {
      bestDiff = diff;
      bestVariant = harmonizeSynonymsInTarget(cleanedUser, variant);
    }
  }

  const letters: LetterDiffItem[] = bestDiff.userSegments.map((seg) => ({
    char: seg.text,
    expectedChar: seg.text,
    status: seg.status,
  }));

  return {
    isSubmitted: true,
    accuracyPercent: bestDiff.accuracyPercent,
    bestExpectedVariant: bestVariant,
    userSegments: bestDiff.userSegments,
    targetSegments: bestDiff.targetSegments,
    letters,
  };
}

/**
 * Gera a correspondência palavra por palavra entre a frase em inglês e a tradução em português.
 */
export function buildWordByWordCorrespondence(
  englishText: string,
  portugueseText: string,
  auxiliaryWord?: { english: string; portuguese: string }
): WordCorrespondenceItem[] {
  const enWords = englishText
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const ptWords = portugueseText
    .replace(/\([^)]*\)/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const dictionary: Record<string, { meanings: string; grammarClass: string }> = {
    the: { meanings: 'o, a, os, as', grammarClass: 'artigo definido' },
    of: { meanings: 'de, do, da', grammarClass: 'preposição' },
    to: { meanings: 'para, a', grammarClass: 'preposição' },
    and: { meanings: 'e', grammarClass: 'conjunção' },
    a: { meanings: 'um, uma', grammarClass: 'artigo indefinido' },
    an: { meanings: 'um, uma', grammarClass: 'artigo indefinido' },
    in: { meanings: 'em, no, na', grammarClass: 'preposição' },
    is: { meanings: 'é, está', grammarClass: 'verbo to be' },
    it: { meanings: 'isso, ele, ela', grammarClass: 'pronome' },
    you: { meanings: 'você, vocês', grammarClass: 'pronome' },
    that: { meanings: 'aquele, aquela, isso, que', grammarClass: 'pronome demonstrativo' },
    "that's": { meanings: 'isso é, aquilo é', grammarClass: 'contração' },
    he: { meanings: 'ele', grammarClass: 'pronome' },
    she: { meanings: 'ela', grammarClass: 'pronome' },
    was: { meanings: 'era, estava, foi', grammarClass: 'verbo no passado' },
    for: { meanings: 'para, por', grammarClass: 'preposição' },
    on: { meanings: 'em, no, na, sobre', grammarClass: 'preposição' },
    are: { meanings: 'são, estão, é, está', grammarClass: 'verbo to be' },
    with: { meanings: 'com', grammarClass: 'preposição' },
    as: { meanings: 'como, conforme', grammarClass: 'conjunção' },
    i: { meanings: 'eu', grammarClass: 'pronome' },
    "i'm": { meanings: 'eu sou, eu estou', grammarClass: 'contração' },
    am: { meanings: 'sou, estou', grammarClass: 'verbo to be' },
    his: { meanings: 'dele, seu', grammarClass: 'pronome possessivo' },
    her: { meanings: 'dela, sua', grammarClass: 'pronome possessivo' },
    they: { meanings: 'eles, elas', grammarClass: 'pronome' },
    be: { meanings: 'ser, estar', grammarClass: 'verbo' },
    at: { meanings: 'em, no, na', grammarClass: 'preposição' },
    one: { meanings: 'um, uma', grammarClass: 'numeral' },
    have: { meanings: 'ter, tenho', grammarClass: 'verbo' },
    this: { meanings: 'este, esta, isto', grammarClass: 'pronome demonstrativo' },
    from: { meanings: 'de, a partir de', grammarClass: 'preposição' },
    or: { meanings: 'ou', grammarClass: 'conjunção' },
    had: { meanings: 'tinha, teve', grammarClass: 'verbo no passado' },
    by: { meanings: 'por, de', grammarClass: 'preposição' },
    but: { meanings: 'mas, porém', grammarClass: 'conjunção' },
    yes: { meanings: 'sim', grammarClass: 'advérbio' },
    no: { meanings: 'não, nenhum', grammarClass: 'advérbio' },
    what: { meanings: 'o quê, qual', grammarClass: 'pronome interrogativo' },
    some: { meanings: 'algum, alguns', grammarClass: 'pronome indefinido' },
    we: { meanings: 'nós', grammarClass: 'pronome' },
    can: { meanings: 'poder, conseguir', grammarClass: 'verbo modal' },
    out: { meanings: 'fora, para fora', grammarClass: 'advérbio' },
    other: { meanings: 'outro, outra', grammarClass: 'adjetivo' },
    were: { meanings: 'eram, estavam', grammarClass: 'verbo no passado' },
    all: { meanings: 'todo, todos, tudo', grammarClass: 'pronome indefinido' },
    there: { meanings: 'lá, ali', grammarClass: 'advérbio' },
    when: { meanings: 'quando', grammarClass: 'advérbio' },
    where: { meanings: 'onde', grammarClass: 'advérbio' },
    who: { meanings: 'quem', grammarClass: 'pronome interrogativo' },
    why: { meanings: 'por que', grammarClass: 'advérbio' },
    how: { meanings: 'como, quão', grammarClass: 'advérbio' },
    good: { meanings: 'bom, boa, bem', grammarClass: 'adjetivo' },
    girl: { meanings: 'menina, garota', grammarClass: 'substantivo' },
    girls: { meanings: 'meninas, garotas', grammarClass: 'substantivo plural' },
    boy: { meanings: 'menino, garoto', grammarClass: 'substantivo' },
    boys: { meanings: 'meninos, garotos', grammarClass: 'substantivo plural' },
    house: { meanings: 'casa, residência', grammarClass: 'substantivo' },
    book: { meanings: 'livro', grammarClass: 'substantivo' },
    table: { meanings: 'mesa, tabela', grammarClass: 'substantivo' },
    garage: { meanings: 'garagem', grammarClass: 'substantivo' },
    dog: { meanings: 'cachorro, cão', grammarClass: 'substantivo' },
    apple: { meanings: 'maçã', grammarClass: 'substantivo' },
    egg: { meanings: 'ovo', grammarClass: 'substantivo' },
    box: { meanings: 'caixa', grammarClass: 'substantivo' },
    animal: { meanings: 'animal', grammarClass: 'substantivo' },
    idea: { meanings: 'ideia, opinião', grammarClass: 'substantivo' },
    orange: { meanings: 'laranja', grammarClass: 'substantivo' },
    airport: { meanings: 'aeroporto', grammarClass: 'substantivo' },
    event: { meanings: 'evento, acontecimento', grammarClass: 'substantivo' },
    city: { meanings: 'cidade', grammarClass: 'substantivo' },
    here: { meanings: 'aqui, cá', grammarClass: 'advérbio' },
    me: { meanings: 'mim, me', grammarClass: 'pronome objeto' },
    my: { meanings: 'meu, minha', grammarClass: 'pronome possessivo' },
    your: { meanings: 'seu, sua', grammarClass: 'pronome possessivo' },
    work: { meanings: 'trabalhar, trabalho', grammarClass: 'verbo / substantivo' },
    worked: { meanings: 'trabalhou, trabalhei', grammarClass: 'verbo no passado' },
    look: { meanings: 'olhar, observar', grammarClass: 'verbo' },
    looked: { meanings: 'olhou, olhei', grammarClass: 'verbo no passado' },
    like: { meanings: 'gostar, como', grammarClass: 'verbo' },
    liked: { meanings: 'gostou, gostei', grammarClass: 'verbo no passado' },
    study: { meanings: 'estudar, estudo', grammarClass: 'verbo' },
    studied: { meanings: 'estudou, estudei', grammarClass: 'verbo no passado' },
    try: { meanings: 'tentar, experimentar', grammarClass: 'verbo' },
    tried: { meanings: 'tentou, tentei', grammarClass: 'verbo no passado' },
    play: { meanings: 'jogar, brincar, tocar', grammarClass: 'verbo' },
    played: { meanings: 'jogou, brincou', grammarClass: 'verbo no passado' },
    wait: { meanings: 'esperar, aguardar', grammarClass: 'verbo' },
    waited: { meanings: 'esperou, esperei', grammarClass: 'verbo no passado' },
    help: { meanings: 'ajudar, ajuda', grammarClass: 'verbo / substantivo' },
    helped: { meanings: 'ajudou, ajudei', grammarClass: 'verbo no passado' },
    use: { meanings: 'usar', grammarClass: 'verbo' },
    used: { meanings: 'usou, usei', grammarClass: 'verbo no passado' },
    love: { meanings: 'amar, amor', grammarClass: 'verbo / substantivo' },
    loved: { meanings: 'amou, amei', grammarClass: 'verbo no passado' },
    arrive: { meanings: 'chegar', grammarClass: 'verbo' },
    arrived: { meanings: 'chegou, cheguei', grammarClass: 'verbo no passado' },
    close: { meanings: 'fechar, perto', grammarClass: 'verbo / adjetivo' },
    closed: { meanings: 'fechou, fechei', grammarClass: 'verbo no passado' },
    cry: { meanings: 'chorar, grito', grammarClass: 'verbo' },
    cried: { meanings: 'chorou, chorei', grammarClass: 'verbo no passado' },
    carry: { meanings: 'carregar, transportar', grammarClass: 'verbo' },
    carried: { meanings: 'carregou, carreguei', grammarClass: 'verbo no passado' },
    yesterday: { meanings: 'ontem', grammarClass: 'advérbio de tempo' },
    today: { meanings: 'hoje', grammarClass: 'advérbio de tempo' },
    tomorrow: { meanings: 'amanhã', grammarClass: 'advérbio de tempo' },
    early: { meanings: 'cedo, adiantado', grammarClass: 'advérbio' },
    ran: { meanings: 'correu, corri', grammarClass: 'verbo no passado' },
    run: { meanings: 'correr', grammarClass: 'verbo' },
    went: { meanings: 'foi, fui, foram', grammarClass: 'verbo no passado' },
    go: { meanings: 'ir', grammarClass: 'verbo' },
    saw: { meanings: 'viu, vi', grammarClass: 'verbo no passado' },
    see: { meanings: 'ver', grammarClass: 'verbo' },
    came: { meanings: 'veio, vim', grammarClass: 'verbo no passado' },
    come: { meanings: 'vir, chegar', grammarClass: 'verbo' },
    send: { meanings: 'enviar, mandar', grammarClass: 'verbo' },
    sent: { meanings: 'enviou, enviei', grammarClass: 'verbo no passado' },
    did: { meanings: 'fez, fiz', grammarClass: 'verbo / auxiliar no passado' },
    do: { meanings: 'fazer', grammarClass: 'verbo / auxiliar no presente' },
    "don't": { meanings: 'não', grammarClass: 'auxiliar negativo' },
    will: { meanings: 'vai, irá', grammarClass: 'auxiliar de futuro' },
    water: { meanings: 'água', grammarClass: 'substantivo' },
    coffee: { meanings: 'café', grammarClass: 'substantivo' },
    juice: { meanings: 'suco', grammarClass: 'substantivo' },
    money: { meanings: 'dinheiro, grana', grammarClass: 'substantivo' },
    need: { meanings: 'precisar, preciso', grammarClass: 'verbo' },
    want: { meanings: 'querer, desejar', grammarClass: 'verbo' },
    friend: { meanings: 'amigo, amiga', grammarClass: 'substantivo' },
    friends: { meanings: 'amigos, amigas', grammarClass: 'substantivo plural' },
    family: { meanings: 'família', grammarClass: 'substantivo' },
    school: { meanings: 'escola, colégio', grammarClass: 'substantivo' },
    car: { meanings: 'carro, automóvel', grammarClass: 'substantivo' },
    door: { meanings: 'porta', grammarClass: 'substantivo' },
    gift: { meanings: 'presente, dom', grammarClass: 'substantivo' },
    baby: { meanings: 'bebê', grammarClass: 'substantivo' },
    park: { meanings: 'parque', grammarClass: 'substantivo' },
    package: { meanings: 'pacote, encomenda', grammarClass: 'substantivo' },
    dream: { meanings: 'sonho, sonhar', grammarClass: 'substantivo / verbo' },
    busy: { meanings: 'ocupado, agitado', grammarClass: 'adjetivo' },
    morning: { meanings: 'manhã', grammarClass: 'substantivo' },
    night: { meanings: 'noite', grammarClass: 'substantivo' },
    time: { meanings: 'tempo, hora', grammarClass: 'substantivo' },
    day: { meanings: 'dia', grammarClass: 'substantivo' },
    please: { meanings: 'por favor', grammarClass: 'interjeição' },
    thank: { meanings: 'agradecer', grammarClass: 'verbo' },
    thanks: { meanings: 'obrigado, obrigada', grammarClass: 'interjeição' },
    again: { meanings: 'novamente, de novo', grammarClass: 'advérbio' },
    live: { meanings: 'viver, morar', grammarClass: 'verbo' },
    lived: { meanings: 'viveu, morou', grammarClass: 'verbo no passado' },
    call: { meanings: 'chamar, ligar', grammarClass: 'verbo' },
    man: { meanings: 'homem', grammarClass: 'substantivo' },
    men: { meanings: 'homens', grammarClass: 'substantivo plural' },
    woman: { meanings: 'mulher', grammarClass: 'substantivo' },
    women: { meanings: 'mulheres', grammarClass: 'substantivo plural' },
    arm: { meanings: 'braço', grammarClass: 'substantivo' },
    under: { meanings: 'sob, embaixo de', grammarClass: 'preposição' },
    student: { meanings: 'estudante, aluno, aluna', grammarClass: 'substantivo' },
    doctor: { meanings: 'médico, médica, doutor', grammarClass: 'substantivo' },
    room: { meanings: 'quarto, sala, espaço', grammarClass: 'substantivo' },
    'living room': { meanings: 'sala de estar, sala', grammarClass: 'substantivo composto' },
    'you guys': { meanings: 'vocês (informal / grupo)', grammarClass: 'pronome plural' },
    'good morning': { meanings: 'bom dia', grammarClass: 'saudação' },
    'thank you': { meanings: 'obrigado, obrigada', grammarClass: 'expressão' },
    'there is': { meanings: 'há, existe, tem', grammarClass: 'expressão de existência' },
    'there are': { meanings: 'há, existem, têm', grammarClass: 'expressão de existência' },
    'going to': { meanings: 'vai, irão (futuro planejado)', grammarClass: 'locução verbal' },
    'have to': { meanings: 'ter que, precisar', grammarClass: 'locução modal' },
    'used to': { meanings: 'costumava', grammarClass: 'estrutura de hábito passado' },
    'wake up': { meanings: 'acordar, despertar', grammarClass: 'phrasal verb' },
    'get up': { meanings: 'levantar-se', grammarClass: 'phrasal verb' },
    'look for': { meanings: 'procurar', grammarClass: 'phrasal verb' },
    'give up': { meanings: 'desistir', grammarClass: 'phrasal verb' },
    'find out': { meanings: 'descobrir', grammarClass: 'phrasal verb' },
    guys: { meanings: 'pessoal, galera (em you guys = vocês)', grammarClass: 'substantivo plural' },
    not: { meanings: 'não', grammarClass: 'advérbio de negação' },
    bad: { meanings: 'mau, ruim, mal', grammarClass: 'adjetivo' },
    happy: { meanings: 'feliz, alegre', grammarClass: 'adjetivo' },
    sad: { meanings: 'triste', grammarClass: 'adjetivo' },
    near: { meanings: 'perto de, próximo', grammarClass: 'preposição / adjetivo' },
    beside: { meanings: 'ao lado de', grammarClass: 'preposição' },
    window: { meanings: 'janela', grammarClass: 'substantivo' },
    chair: { meanings: 'cadeira', grammarClass: 'substantivo' },
    bed: { meanings: 'cama', grammarClass: 'substantivo' },
    pen: { meanings: 'caneta', grammarClass: 'substantivo' },
    name: { meanings: 'nome', grammarClass: 'substantivo' },
    teacher: { meanings: 'professor, professora', grammarClass: 'substantivo' },
    fine: { meanings: 'bem, ótimo', grammarClass: 'adjetivo' },
    new: { meanings: 'novo, nova', grammarClass: 'adjetivo' },
    old: { meanings: 'velho, antigo', grammarClass: 'adjetivo' },
  };

  const seenKeys = new Set<string>();
  const items: WordCorrespondenceItem[] = [];

  let index = 0;
  while (index < enWords.length) {
    // 1. Tenta reconhecer expressões compostas ou phrasal verbs de 2 palavras primeiro (ex: "Living room", "You guys", "Good morning")
    if (index + 1 < enWords.length) {
      const w1 = enWords[index].replace(/[.,!?;:"“”]/g, '') || enWords[index];
      const w2 = enWords[index + 1].replace(/[.,!?;:"“”]/g, '') || enWords[index + 1];
      const compoundDisplay = `${w1} ${w2}`;
      const compoundKey = compoundDisplay.toLowerCase();

      if (dictionary[compoundKey]) {
        if (!seenKeys.has(compoundKey)) {
          seenKeys.add(compoundKey);
          items.push({
            englishWord: compoundDisplay,
            portugueseEquivalent: dictionary[compoundKey].meanings,
            grammarClass: dictionary[compoundKey].grammarClass,
            isAuxiliary: false,
          });
        }
        index += 2;
        continue;
      }
    }

    const word = enWords[index];
    // Remove pontuação final da palavra em inglês (ex: "girl." -> "girl")
    const cleanEnglishWord = word.replace(/[.,!?;:"“”]/g, '') || word;
    const cleanKey = cleanEnglishWord.toLowerCase();

    // Evita repetir a mesma palavra na explicação da frase (ex: "The boy and the girl." mostra "The" só uma vez!)
    if (!cleanKey || seenKeys.has(cleanKey)) {
      index++;
      continue;
    }
    seenKeys.add(cleanKey);

    const entry = dictionary[cleanKey];
    const isAux =
      auxiliaryWord &&
      auxiliaryWord.english.toLowerCase().replace(/[.,!?;:]/g, '') === cleanKey;

    if (entry) {
      items.push({
        englishWord: cleanEnglishWord,
        portugueseEquivalent: entry.meanings,
        grammarClass: entry.grammarClass,
        isAuxiliary: Boolean(isAux),
      });
      index++;
      continue;
    }

    if (isAux && auxiliaryWord) {
      const cleanMeanings = auxiliaryWord.portuguese.replace(/\s*\/\s*/g, ', ');
      items.push({
        englishWord: cleanEnglishWord,
        portugueseEquivalent: cleanMeanings,
        grammarClass: 'substantivo',
        isAuxiliary: true,
      });
      index++;
      continue;
    }

    const fallbackMeaning = (ptWords[index] ?? '').replace(/[.,!?;:]/g, '');
    items.push({
      englishWord: cleanEnglishWord,
      portugueseEquivalent: fallbackMeaning,
      grammarClass: 'palavra',
      isAuxiliary: false,
    });
    index++;
  }

  return items;
}
