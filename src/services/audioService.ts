import { logger } from './logger';

/**
 * Mapa fonético/ortográfico para palavras isoladas que motores TTS (Windows SAPI / Chrome Web Speech)
 * costumam pronunciar de forma truncada ou como siglas quando faladas sozinhas.
 * Exemplo crítico relatado pelo professor:
 * - "An" isolado é frequentemente lido como "a" (sem o som nasal do 'n') quando não há palavra seguinte;
 *   enviar "ann." força a articulação nítida da consoante final /æn/.
 * - Palavras curtas como "Us", "In", "On", "It", "Am" em maiúsculas podem ser lidas como siglas se não
 *   forem convertidas para minúsculas com ponto final.
 */
const ISOLATED_WORD_PRONUNCIATION_MAP: Record<string, string> = {
  an: 'ann.',
  a: 'a.',
  the: 'the.',
  in: 'in.',
  on: 'on.',
  at: 'at.',
  am: 'am.',
  is: 'is.',
  it: 'it.',
  us: 'us.',
  to: 'to.',
  do: 'do.',
  no: 'no.',
  so: 'so.',
  or: 'or.',
  and: 'and.',
  not: 'not.',
};

/**
 * Normaliza o texto em inglês antes de enviar ao sintetizador de voz (Web Speech API)
 * para garantir pronúncia natural tanto em palavras isoladas quanto em frases.
 */
export function prepareEnglishTextForSpeech(rawText: string): string {
  const cleanEnglish = rawText
    .replace(/\([^)]*\)/g, '')
    .replace(/\s*\/\s*/g, '. ')
    .replace(/\s*→\s*/g, '. ')
    .replace(/\s*—\s*/g, '. ')
    .trim();

  if (!cleanEnglish) return '';

  // Verifica se é uma palavra única isolada (sem espaços)
  const bareToken = cleanEnglish.replace(/[^a-zA-Z']/g, '').toLowerCase();
  const isSingleWord = !cleanEnglish.includes(' ') && bareToken.length > 0;

  if (isSingleWord) {
    if (ISOLATED_WORD_PRONUNCIATION_MAP[bareToken]) {
      return ISOLATED_WORD_PRONUNCIATION_MAP[bareToken];
    }
    // Preserva "I" maiúsculo para o pronome "Eu", mas coloca demais palavras isoladas em minúsculo com ponto
    // para evitar que o sintetizador soletre siglas e para evitar corte do buffer final de áudio
    if (bareToken === 'i') {
      return 'I.';
    }
    return `${bareToken}.`;
  }

  return cleanEnglish;
}

/**
 * Serviço de Áudio Otimizado para Zero Latência (Instantâneo!).
 * Prioriza vozes locais (`localService === true`) instaladas no sistema operacional
 * para evitar o atraso de 1 a 2 segundos das vozes remotas em nuvem do navegador.
 */
class AudioService {
  private preferredVoice: SpeechSynthesisVoice | null = null;
  private currentHtmlAudio: HTMLAudioElement | null = null;
  private isWarmedUp = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      window.speechSynthesis.onvoiceschanged = () => this.initVoices();
    }
  }

  private initVoices(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return;

    // 1º Prioridade: Vozes em Inglês LOCAIS (localService === true) -> Latência ZERO (instantâneas!)
    const localEnUs = voices.find(
      (v) => v.localService && (v.lang === 'en-US' || v.lang === 'en_US')
    );
    const localEnAny = voices.find((v) => v.localService && v.lang.startsWith('en'));

    // 2º Fallback: Qualquer voz em Inglês disponível
    const remoteEnUs = voices.find((v) => v.lang.startsWith('en-US'));
    const remoteEnAny = voices.find((v) => v.lang.startsWith('en'));

    this.preferredVoice = localEnUs ?? localEnAny ?? remoteEnUs ?? remoteEnAny ?? null;

    // Pré-aquece o sintetizador na primeira carga com volume 0 para destravar o motor de áudio
    if (!this.isWarmedUp && this.preferredVoice) {
      this.isWarmedUp = true;
      try {
        const silent = new SpeechSynthesisUtterance('');
        silent.volume = 0;
        silent.voice = this.preferredVoice;
        window.speechSynthesis.speak(silent);
      } catch {
        // Ignora caso o navegador exija gesto do usuário primeiro
      }
    }
  }

  public speak(englishText: string, customAudioUrl?: string, rate = 0.96): void {
    try {
      if (customAudioUrl && customAudioUrl.trim().length > 0) {
        if (this.currentHtmlAudio) {
          this.currentHtmlAudio.pause();
        }
        this.currentHtmlAudio = new Audio(customAudioUrl);
        this.currentHtmlAudio.playbackRate = Math.max(0.4, Math.min(2.0, rate));
        this.currentHtmlAudio.play().catch((err) => {
          logger.warn('Falha ao tocar MP3 customizado, usando síntese de voz.', {
            err: String(err),
          });
          this.speakWithWebSpeech(englishText, rate);
        });
        return;
      }

      this.speakWithWebSpeech(englishText, rate);
    } catch (error) {
      logger.error('Erro ao reproduzir áudio do flashcard', { error: String(error) });
    }
  }

  private speakWithWebSpeech(text: string, rate: number): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    const synth = window.speechSynthesis;
    const preparedText = prepareEnglishTextForSpeech(text);
    if (!preparedText) return;

    // Evita chamar synth.cancel() desnecessariamente quando não está falando (pois cancel() adiciona ~300ms de delay no Windows/Chrome)
    if (synth.speaking || synth.pending) {
      synth.cancel();
    }
    if (synth.paused) {
      synth.resume();
    }

    const utterance = new SpeechSynthesisUtterance(preparedText);
    utterance.lang = 'en-US';
    utterance.rate = rate;
    utterance.pitch = 1.0;

    if (!this.preferredVoice) {
      this.initVoices();
    }
    if (this.preferredVoice) {
      utterance.voice = this.preferredVoice;
    }

    synth.speak(utterance);
  }
}

export const audioService = new AudioService();
