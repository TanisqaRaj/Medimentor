-- ============================================================
-- Medimentor Pharmacy Schema
-- DB: PostgreSQL (separate from MongoDB, shares userId as TEXT)
-- All IDs are SERIAL (auto-increment). userId = MongoDB ObjectId string.
-- ============================================================

-- ── Categories ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  CONSTRAINT categories_name_unique UNIQUE (name)
);

-- ── Medicines ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS medicines (
  id                    SERIAL PRIMARY KEY,
  name                  VARCHAR(200)    NOT NULL,
  description           TEXT,
  price                 NUMERIC(10,2)   NOT NULL CHECK (price >= 0),
  stock                 INTEGER         NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_url             TEXT,
  manufacturer          VARCHAR(200),
  dosage                VARCHAR(100),
  requires_prescription BOOLEAN         NOT NULL DEFAULT FALSE,
  category_id           INTEGER         REFERENCES categories(id) ON DELETE SET NULL,
  created_at            TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ── Cart Items ────────────────────────────────────────────────
-- One row per (user, medicine). Upsert pattern for add-to-cart.
CREATE TABLE IF NOT EXISTS cart_items (
  id          SERIAL PRIMARY KEY,
  user_id     TEXT    NOT NULL,                  -- MongoDB ObjectId as string
  medicine_id INTEGER NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
  quantity    INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 1),
  CONSTRAINT  cart_items_user_medicine_unique UNIQUE (user_id, medicine_id)
);

-- ── Prescriptions ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS prescriptions (
  id         SERIAL PRIMARY KEY,
  user_id    TEXT         NOT NULL,
  file_url   TEXT         NOT NULL,
  public_id  TEXT         NOT NULL,              -- Cloudinary public_id for deletion
  status     VARCHAR(20)  NOT NULL DEFAULT 'PENDING'
               CHECK (status IN ('PENDING','APPROVED','REJECTED')),
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Orders ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id               SERIAL PRIMARY KEY,
  order_number     VARCHAR(30)   NOT NULL,
  user_id          TEXT          NOT NULL,
  total_amount     NUMERIC(10,2) NOT NULL CHECK (total_amount >= 0),
  shipping_address TEXT          NOT NULL,
  payment_method   VARCHAR(10)   NOT NULL CHECK (payment_method IN ('COD','UPI','CARD')),
  status           VARCHAR(20)   NOT NULL DEFAULT 'PENDING'
                     CHECK (status IN ('PENDING','PROCESSING','SHIPPED','DELIVERED','CANCELLED')),
  prescription_id  INTEGER       REFERENCES prescriptions(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  CONSTRAINT orders_order_number_unique UNIQUE (order_number)
);

-- ── Order Items (price snapshot — immutable after insert) ─────
CREATE TABLE IF NOT EXISTS order_items (
  id                SERIAL PRIMARY KEY,
  order_id          INTEGER       NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  medicine_id       INTEGER       REFERENCES medicines(id) ON DELETE SET NULL,
  medicine_name     VARCHAR(200)  NOT NULL,      -- denormalized snapshot
  price_at_purchase NUMERIC(10,2) NOT NULL CHECK (price_at_purchase >= 0),
  quantity          INTEGER       NOT NULL CHECK (quantity >= 1)
);

-- ── Indexes ───────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_medicines_category    ON medicines(category_id);
CREATE INDEX IF NOT EXISTS idx_medicines_name        ON medicines(name);
CREATE INDEX IF NOT EXISTS idx_cart_user             ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user           ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status         ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order     ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_user    ON prescriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_status  ON prescriptions(status);

-- ── Trigger: auto-update updated_at on medicines ──────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_medicines_updated_at ON medicines;
CREATE TRIGGER trg_medicines_updated_at
  BEFORE UPDATE ON medicines
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_orders_updated_at ON orders;
CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
