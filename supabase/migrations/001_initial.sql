-- ============================================================
-- 001_initial.sql  --  Initial schema for 名將數位
-- ============================================================

-- 1. Products table
CREATE TABLE products (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text        NOT NULL,
  slug         text        UNIQUE NOT NULL,
  category     text,
  short_desc   text,
  description  text,
  denominations int4[]     DEFAULT '{}',
  images       text[]      DEFAULT '{}',
  buy_url      text,
  instructions text,
  notice       text,
  is_active    bool        DEFAULT true,
  is_featured  bool        DEFAULT false,
  sort_order   int4        DEFAULT 0,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

-- 2. Site settings table
CREATE TABLE site_settings (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_email text,
  contact_phone text,
  tax_id        text,
  updated_at    timestamptz DEFAULT now()
);

-- 3. updated_at trigger function + triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 4. Row-Level Security
ALTER TABLE products      ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- products: anon can read active rows
CREATE POLICY "products_select_anon"
  ON products FOR SELECT
  TO anon
  USING (is_active = true);

-- products: authenticated can read all rows
CREATE POLICY "products_select_authenticated"
  ON products FOR SELECT
  TO authenticated
  USING (true);

-- products: authenticated can insert
CREATE POLICY "products_insert_authenticated"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- products: authenticated can update
CREATE POLICY "products_update_authenticated"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- products: authenticated can delete
CREATE POLICY "products_delete_authenticated"
  ON products FOR DELETE
  TO authenticated
  USING (true);

-- site_settings: anyone can read
CREATE POLICY "site_settings_select_anon"
  ON site_settings FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "site_settings_select_authenticated"
  ON site_settings FOR SELECT
  TO authenticated
  USING (true);

-- site_settings: authenticated can update
CREATE POLICY "site_settings_update_authenticated"
  ON site_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 5. Storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('product-images', 'product-images', true),
  ('site-assets',    'site-assets',    true);

-- 6. Storage policies

-- Public read for product-images
CREATE POLICY "product_images_public_read"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'product-images');

-- Authenticated upload/update/delete for product-images
CREATE POLICY "product_images_auth_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "product_images_auth_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images')
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "product_images_auth_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images');

-- Public read for site-assets
CREATE POLICY "site_assets_public_read"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'site-assets');

-- Authenticated upload/update/delete for site-assets
CREATE POLICY "site_assets_auth_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'site-assets');

CREATE POLICY "site_assets_auth_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'site-assets')
  WITH CHECK (bucket_id = 'site-assets');

CREATE POLICY "site_assets_auth_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'site-assets');

-- 7. Seed default site_settings row
INSERT INTO site_settings (contact_email, contact_phone, tax_id)
VALUES ('contact@example.com', '02-1234-5678', '12345678');
