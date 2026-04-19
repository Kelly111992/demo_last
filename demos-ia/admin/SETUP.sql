-- ═══════════════════════════════════════════════════════════════════════════════
-- ClaveAI Admin Panel — Migración Supabase
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query → Run
-- ═══════════════════════════════════════════════════════════════════════════════

-- 1) Añadir sesion_id a pedidos y reservaciones
-- (conversaciones ya la tiene)
ALTER TABLE pedidos        ADD COLUMN IF NOT EXISTS sesion_id uuid;
ALTER TABLE reservaciones  ADD COLUMN IF NOT EXISTS sesion_id uuid;

-- 2) Índices para que el admin panel filtre rápido por sesión
CREATE INDEX IF NOT EXISTS idx_conversaciones_sesion ON conversaciones (sesion_id, creado_en);
CREATE INDEX IF NOT EXISTS idx_pedidos_sesion        ON pedidos (sesion_id);
CREATE INDEX IF NOT EXISTS idx_reservaciones_sesion  ON reservaciones (sesion_id);

-- 3) Row Level Security
-- Permite INSERT anónimo (demos públicos) y SELECT solo para usuarios autenticados (admin)

ALTER TABLE conversaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos        ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedido_items   ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservaciones  ENABLE ROW LEVEL SECURITY;

-- conversaciones
DROP POLICY IF EXISTS "anon insert conversaciones"      ON conversaciones;
DROP POLICY IF EXISTS "authenticated read conversaciones" ON conversaciones;
CREATE POLICY "anon insert conversaciones"
  ON conversaciones FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "authenticated read conversaciones"
  ON conversaciones FOR SELECT TO authenticated USING (true);

-- pedidos
DROP POLICY IF EXISTS "anon insert pedidos"      ON pedidos;
DROP POLICY IF EXISTS "authenticated read pedidos" ON pedidos;
CREATE POLICY "anon insert pedidos"
  ON pedidos FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "authenticated read pedidos"
  ON pedidos FOR SELECT TO authenticated USING (true);

-- pedido_items
DROP POLICY IF EXISTS "anon insert pedido_items"      ON pedido_items;
DROP POLICY IF EXISTS "authenticated read pedido_items" ON pedido_items;
CREATE POLICY "anon insert pedido_items"
  ON pedido_items FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "authenticated read pedido_items"
  ON pedido_items FOR SELECT TO authenticated USING (true);

-- reservaciones
DROP POLICY IF EXISTS "anon insert reservaciones"      ON reservaciones;
DROP POLICY IF EXISTS "authenticated read reservaciones" ON reservaciones;
CREATE POLICY "anon insert reservaciones"
  ON reservaciones FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "authenticated read reservaciones"
  ON reservaciones FOR SELECT TO authenticated USING (true);

-- ═══════════════════════════════════════════════════════════════════════════════
-- PASOS MANUALES EN EL DASHBOARD DE SUPABASE
-- ═══════════════════════════════════════════════════════════════════════════════
--
-- A) ACTIVAR REALTIME
--    Dashboard → Database → Replication → supabase_realtime
--    Marcar: conversaciones, pedidos, reservaciones
--
-- B) CREAR USUARIO ADMIN
--    Dashboard → Authentication → Users → Add user → Create new user
--    Email:      admin@clave.ai
--    Password:   (elige una segura)
--    "Auto Confirm User": ON
--
-- C) (OPCIONAL) DESACTIVAR SIGN-UPS PÚBLICOS
--    Dashboard → Authentication → Providers → Email
--    Desactivar "Enable signups"  (solo tú creas usuarios)
--
-- ═══════════════════════════════════════════════════════════════════════════════
