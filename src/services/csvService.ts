import Papa from 'papaparse';
import { Flashcard, FlashcardType } from '../types';
import { storageService } from './storageService';
import { logger } from './logger';

export interface CsvFlashcardRow {
  dayNumber?: string | number;
  type?: string;
  english?: string;
  portuguese?: string;
  auxiliaryEnglish?: string;
  auxiliaryPortuguese?: string;
  grammarTitle?: string;
  grammarExplanation?: string;
  dialogueSpeaker?: string;
}

/**
 * Importa uma string CSV e adiciona os flashcards aos respectivos Dias de Estudo.
 * Formato aceito de colunas (cabeçalho flexível em inglês ou português):
 * - dayNumber / dia
 * - type / tipo (word, phrase, grammar, dialogue)
 * - english / ingles
 * - portuguese / portugues / traducao
 * - auxiliaryEnglish / auxiliar_ingles
 * - auxiliaryPortuguese / auxiliar_portugues
 */
export function importFlashcardsFromCsv(csvText: string): {
  importedCount: number;
  errors: string[];
} {
  const parsed = Papa.parse<Record<string, string>>(csvText.trim(), {
    header: true,
    skipEmptyLines: true,
  });

  const errors: string[] = [];
  let importedCount = 0;

  if (parsed.errors && parsed.errors.length > 0) {
    parsed.errors.forEach((e) => errors.push(`Linha ${e.row ?? '?'}: ${e.message}`));
  }

  parsed.data.forEach((row, index) => {
    const rawDay = row.dayNumber ?? row.dia ?? row.day ?? '1';
    const dayNumber = Math.max(1, Number(rawDay) || 1);

    const rawType = (row.type ?? row.tipo ?? 'word').trim().toLowerCase();
    let cardType: FlashcardType = 'word';
    if (rawType === 'phrase' || rawType === 'frase') cardType = 'phrase';
    else if (rawType === 'grammar' || rawType === 'gramatica' || rawType === 'gramática')
      cardType = 'grammar';
    else if (rawType === 'dialogue' || rawType === 'dialogo' || rawType === 'diálogo')
      cardType = 'dialogue';

    const english = (row.english ?? row.ingles ?? row['inglês'] ?? '').trim();
    const portuguese = (
      row.portuguese ??
      row.portugues ??
      row['português'] ??
      row.traducao ??
      row['tradução'] ??
      ''
    ).trim();

    if (!english || !portuguese) {
      errors.push(
        `Linha ${index + 2}: Os campos 'english' e 'portuguese' são obrigatórios.`
      );
      return;
    }

    const auxEn = (row.auxiliaryEnglish ?? row.auxiliar_ingles ?? '').trim();
    const auxPt = (row.auxiliaryPortuguese ?? row.auxiliar_portugues ?? '').trim();
    const grammarTitle = (row.grammarTitle ?? row.titulo_gramatica ?? '').trim();
    const grammarExplanation = (
      row.grammarExplanation ??
      row.explicacao_gramatica ??
      ''
    ).trim();
    const dialogueSpeaker = (row.dialogueSpeaker ?? row.personagem ?? '').trim();

    const newCardData: Omit<Flashcard, 'id' | 'orderInDay'> = {
      tenantId: 'default-teacher-tenant',
      dayNumber,
      type: cardType,
      english,
      portuguese,
      auxiliaryWord:
        auxEn && auxPt ? { english: auxEn, portuguese: auxPt } : undefined,
      grammarRule:
        cardType === 'grammar' || grammarTitle
          ? {
              title: grammarTitle || `Gramática do Dia ${dayNumber}`,
              explanation: grammarExplanation || portuguese,
              examples: [{ english, portuguese }],
            }
          : undefined,
      dialogueSpeaker: dialogueSpeaker || undefined,
    };

    storageService.addCardToDay(dayNumber, newCardData);
    importedCount++;
  });

  logger.info('Importação CSV concluída', { importedCount, errorCount: errors.length });
  return { importedCount, errors };
}

export function getSampleCsvTemplate(): string {
  return `dayNumber,type,english,portuguese,auxiliaryEnglish,auxiliaryPortuguese,grammarTitle,grammarExplanation
22,word,Water,Água,,,,
22,phrase,I need water.,Eu preciso de água.,,,,
22,word,Coffee,Café,,,,
22,phrase,The coffee is very hot.,O café é muito quente.,hot,quente,,
22,grammar,I need water. / I want coffee.,Eu preciso de água. / Eu quero café.,,,Uso de Need vs Want,Usamos Need para necessidades essenciais e Want para desejos.`;
}
