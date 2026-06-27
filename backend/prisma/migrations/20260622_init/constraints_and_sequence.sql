-- ── Sequence for race-condition-free order numbers ───────────────────────────
-- Used by orderController via prisma.$queryRaw`SELECT nextval('order_number_seq')`
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

-- ── CHECK constraints (Prisma doesn't emit these) ─────────────────────────────
ALTER TABLE medicines
  ADD CONSTRAINT medicines_price_non_negative CHECK (price >= 0),
  ADD CONSTRAINT medicines_stock_non_negative CHECK (stock >= 0);

ALTER TABLE order_items
  ADD CONSTRAINT order_items_price_non_negative CHECK (price_at_purchase >= 0),
  ADD CONSTRAINT order_items_quantity_positive   CHECK (quantity >= 1);

ALTER TABLE cart_items
  ADD CONSTRAINT cart_items_quantity_positive CHECK (quantity >= 1);

ALTER TABLE orders
  ADD CONSTRAINT orders_total_non_negative CHECK (total_amount >= 0);
