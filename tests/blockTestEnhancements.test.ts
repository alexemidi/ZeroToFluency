import { describe, expect, it } from 'vitest';
import { detectWrongLanguageAttempt } from '../src/main';
import { evaluateBlockTestResponse } from '../src/data/blockTestsData';

describe('Aprimoramentos do Teste de Bloco (5 Habilidades)', () => {
  it('detecta tentativa em português quando o teste exigia inglês (listening_writing)', () => {
    // Aluno digitou em português com acento ou palavras típicas
    expect(detectWrongLanguageAttempt('ela é a diretora', 'listening_writing')).toBe('should_be_en');
    expect(detectWrongLanguageAttempt('o livro está na mesa', 'listening_writing')).toBe('should_be_en');
    expect(detectWrongLanguageAttempt('eu sou um estudante', 'listening_writing')).toBe('should_be_en');

    // Aluno digitou em inglês corretamente
    expect(detectWrongLanguageAttempt('She is the principal.', 'listening_writing')).toBeNull();
    expect(detectWrongLanguageAttempt('The book is on the table.', 'listening_writing')).toBeNull();
  });

  it('detecta tentativa em inglês quando o teste exigia português (listening_translation ou reading_translation)', () => {
    // Aluno digitou em inglês
    expect(detectWrongLanguageAttempt('She is the principal.', 'listening_translation')).toBe('should_be_pt');
    expect(detectWrongLanguageAttempt('The book is on the table.', 'reading_translation')).toBe('should_be_pt');

    // Aluno digitou em português corretamente
    expect(detectWrongLanguageAttempt('Ela é a diretora.', 'listening_translation')).toBeNull();
    expect(detectWrongLanguageAttempt('O livro está sobre a mesa.', 'reading_translation')).toBeNull();
  });

  it('avalia estritamente a frase "She is the principal." com "Ela é a diretora."', () => {
    const question = {
      id: 'block-1-principal-test',
      blockNumber: 1,
      qNum: 1,
      skill: 'listening_translation' as const,
      prompt: 'Ouça e traduza para o português.',
      audioText: 'She is the principal.',
      acceptedAnswers: ['Ela é a diretora.', 'Ela é diretora.'],
    };

    // Aceita a tradução exata
    expect(evaluateBlockTestResponse(question, 'Ela é a diretora.').isCorrect).toBe(true);
    expect(evaluateBlockTestResponse(question, 'ela é a diretora').isCorrect).toBe(true);

    // Aceita com omissão do artigo
    expect(evaluateBlockTestResponse(question, 'Ela é diretora.').isCorrect).toBe(true);

    // Não aceita invenção de palavras não mencionadas como "escola"
    expect(evaluateBlockTestResponse(question, 'Ela é a diretora da escola.').isCorrect).toBe(false);
  });
});
