-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  email text NOT NULL,
  phone text,
  payment_method text NOT NULL DEFAULT 'atm',
  status text NOT NULL DEFAULT 'pending',
  subtotal int4 NOT NULL DEFAULT 0,
  fee int4 NOT NULL DEFAULT 0,
  total int4 NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  product_name text NOT NULL,
  denomination int4 NOT NULL,
  quantity int4 NOT NULL DEFAULT 1,
  subtotal int4 NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Trigger for updated_at
CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Orders: anon can insert (create orders), authenticated can read all
CREATE POLICY "orders_insert_anon" ON orders FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "orders_select_authenticated" ON orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "orders_update_authenticated" ON orders FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Order items: anon can insert, authenticated can read
CREATE POLICY "order_items_insert_anon" ON order_items FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "order_items_select_authenticated" ON order_items FOR SELECT TO authenticated USING (true);
