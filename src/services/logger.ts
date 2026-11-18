/**
 * Serviço estruturado de Logs e Monitoramento (Multi-tenant).
 * Registra eventos de autenticação, estudo de flashcards, revisões SRS e erros de áudio/rede.
 */

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'METRIC';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  event: string;
  tenantId: string;
  userEmail?: string;
  metadata?: Record<string, unknown>;
}

class LoggerService {
  private logs: LogEntry[] = [];
  private readonly MAX_LOGS = 200;

  public log(
    level: LogLevel,
    event: string,
    metadata?: Record<string, unknown>,
    tenantId = 'default-teacher-tenant',
    userEmail?: string
  ): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      event,
      tenantId,
      userEmail,
      metadata,
    };

    this.logs.unshift(entry);
    if (this.logs.length > this.MAX_LOGS) {
      this.logs.pop();
    }

    if (level === 'ERROR') {
      console.error(`[ZeroToFluency][${level}] ${event}`, metadata ?? '');
    } else if (level === 'WARN') {
      console.warn(`[ZeroToFluency][${level}] ${event}`, metadata ?? '');
    }
  }

  public info(event: string, metadata?: Record<string, unknown>, userEmail?: string): void {
    this.log('INFO', event, metadata, 'default-teacher-tenant', userEmail);
  }

  public warn(event: string, metadata?: Record<string, unknown>, userEmail?: string): void {
    this.log('WARN', event, metadata, 'default-teacher-tenant', userEmail);
  }

  public error(event: string, metadata?: Record<string, unknown>, userEmail?: string): void {
    this.log('ERROR', event, metadata, 'default-teacher-tenant', userEmail);
  }

  public metric(event: string, metadata?: Record<string, unknown>, userEmail?: string): void {
    this.log('METRIC', event, metadata, 'default-teacher-tenant', userEmail);
  }

  public getRecentLogs(): LogEntry[] {
    return [...this.logs];
  }
}

export const logger = new LoggerService();
