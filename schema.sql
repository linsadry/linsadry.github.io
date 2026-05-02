-- RASTRO — Schema Supabase
-- Execute no SQL Editor do Supabase Dashboard

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ================================
-- TABELA: trips
-- ================================
CREATE TABLE IF NOT EXISTS trips (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  location     TEXT,
  dates        TEXT,
  date_start   DATE,
  date_end     DATE,
  cover        TEXT DEFAULT 'cliffs',
  cover_custom TEXT,     -- base64 de imagem personalizada
  map_img      TEXT,     -- base64 do mapa personalizado
  budget       NUMERIC DEFAULT 0,
  participants TEXT[] DEFAULT ARRAY['Você'],
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow all trips" ON trips FOR ALL USING (true) WITH CHECK (true);

-- ================================
-- TABELA: expenses
-- ================================
CREATE TABLE IF NOT EXISTS expenses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id     UUID REFERENCES trips(id) ON DELETE CASCADE,
  description TEXT,
  amount      NUMERIC DEFAULT 0,
  category    TEXT DEFAULT 'Outros',
  payment     TEXT DEFAULT 'Cartão',
  paid_by     TEXT DEFAULT 'Você',
  with_whom   TEXT[] DEFAULT ARRAY['Você'],
  date        TEXT,
  note        TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow all expenses" ON expenses FOR ALL USING (true) WITH CHECK (true);

-- ================================
-- TABELA: map_points
-- ================================
CREATE TABLE IF NOT EXISTS map_points (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id    UUID REFERENCES trips(id) ON DELETE CASCADE,
  label      TEXT,
  x          NUMERIC,   -- posição em % (0-100)
  y          NUMERIC,   -- posição em % (0-100)
  date       TEXT,
  sort_order INT DEFAULT 0
);

ALTER TABLE map_points ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow all map_points" ON map_points FOR ALL USING (true) WITH CHECK (true);

-- ================================
-- TABELA: memories
-- ================================
CREATE TABLE IF NOT EXISTS memories (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id    UUID REFERENCES trips(id) ON DELETE CASCADE,
  src        TEXT,      -- base64 da foto
  sort_order INT DEFAULT 0
);

ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow all memories" ON memories FOR ALL USING (true) WITH CHECK (true);

-- ================================
-- ÍNDICES para performance
-- ================================
CREATE INDEX IF NOT EXISTS idx_expenses_trip_id ON expenses(trip_id);
CREATE INDEX IF NOT EXISTS idx_map_points_trip_id ON map_points(trip_id);
CREATE INDEX IF NOT EXISTS idx_memories_trip_id ON memories(trip_id);
