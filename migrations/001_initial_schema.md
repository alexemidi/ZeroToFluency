# Arquitetura de Banco de Dados e Migrations Versionadas (ZeroToFluency)

Este documento define o esquema de dados multi-tenant (por professor/escola `tenantId`) e as migrações versionadas tanto para **PostgreSQL (Supabase)** quanto para **Firestore (Firebase)** e o banco local versionado.

## Migration `001_initial_schema.sql` (Compatível com Supabase / PostgreSQL)

```sql
-- Migration: 001_initial_schema
-- Created at: 2026-11-06
-- Description: Multi-tenant schema for ZeroToFluency SRS, Curriculum, and Access Control

CREATE TABLE IF NOT EXISTS tenants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    owner_email TEXT NOT NULL,
    max_days_per_week INT NOT NULL DEFAULT 7,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS authorized_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('teacher', 'student')),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    weekly_limit_override INT,
    unlocked_weeks INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, email)
);

CREATE TABLE IF NOT EXISTS study_days (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    day_number INT NOT NULL,
    title TEXT NOT NULL,
    grammar_topic TEXT NOT NULL,
    is_dialogue_day BOOLEAN NOT NULL DEFAULT FALSE,
    description TEXT,
    UNIQUE(tenant_id, day_number)
);

CREATE TABLE IF NOT EXISTS flashcards (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    day_number INT NOT NULL,
    order_in_day INT NOT NULL,
    card_type TEXT NOT NULL CHECK (card_type IN ('word', 'phrase', 'grammar', 'dialogue')),
    english TEXT NOT NULL,
    portuguese TEXT NOT NULL,
    auxiliary_note TEXT,
    grammar_explanation TEXT,
    grammar_examples JSONB,
    audio_url TEXT,
    created_by_email TEXT,
    is_custom BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS srs_progress (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    card_id TEXT NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE,
    phase TEXT NOT NULL CHECK (phase IN ('new', 'learning_step_1', 'learning_step_2', 'review')),
    interval_days INT NOT NULL DEFAULT 0,
    ease_factor NUMERIC(4,2) NOT NULL DEFAULT 2.50,
    repetitions INT NOT NULL DEFAULT 0,
    next_review_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_reviewed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(tenant_id, user_email, card_id)
);

CREATE TABLE IF NOT EXISTS user_daily_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    date_iso DATE NOT NULL,
    days_completed INT[] NOT NULL DEFAULT '{}',
    cards_studied_count INT NOT NULL DEFAULT 0,
    reviews_completed_count INT NOT NULL DEFAULT 0,
    UNIQUE(tenant_id, user_email, date_iso)
);
```
