-- ============================================================
-- SITE SETTINGS (single row)
-- ============================================================
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp_number text,
  phone text,
  email text,
  address text,
  instagram_url text,
  facebook_url text,
  youtube_url text,
  tiktok_url text,
  seo_title text,
  seo_description text,
  og_image_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site settings"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert site settings"
  ON public.site_settings FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update site settings"
  ON public.site_settings FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete site settings"
  ON public.site_settings FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed: one default row so the admin form always has a record to edit
INSERT INTO public.site_settings (
  whatsapp_number, phone, email,
  instagram_url, facebook_url,
  seo_title, seo_description, og_image_url
) VALUES (
  '5511999999999', '(11) 99999-9999', 'contato@filadelfomotors.com.br',
  'https://instagram.com/filadelfomotors', 'https://facebook.com/filadelfomotors',
  'Filadelfo Motors | Bicicletas Elétricas Premium',
  'Bicicletas elétricas premium da Filadelfo Motors. Coleção 2026: urbanas, mopeds, mountain e dobráveis.',
  'https://filadelfomotors.com.br/og-image.jpg'
);

-- ============================================================
-- PAGE CONTENT (key/value blocks per page)
-- ============================================================
CREATE TABLE public.page_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text NOT NULL,           -- 'home' | 'sobre' | etc.
  block_key text NOT NULL,      -- 'hero_title', 'about_paragraph', etc.
  label text,                   -- friendly name for the admin UI
  text_value text,
  long_text_value text,
  image_url text,
  link_url text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (page, block_key)
);

ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view page content"
  ON public.page_content FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert page content"
  ON public.page_content FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update page content"
  ON public.page_content FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete page content"
  ON public.page_content FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_page_content_updated_at
  BEFORE UPDATE ON public.page_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_page_content_page ON public.page_content(page, display_order);

-- Seed home + sobre blocks with current hardcoded content as starting point
INSERT INTO public.page_content (page, block_key, label, text_value, long_text_value, display_order) VALUES
  ('home', 'hero_eyebrow', 'Hero — etiqueta', 'Coleção 2026', NULL, 10),
  ('home', 'hero_title', 'Hero — título', 'Movimento que pulsa.', NULL, 20),
  ('home', 'hero_subtitle', 'Hero — subtítulo', NULL, 'Bicicletas elétricas premium para quem leva a vida a sério. Engenharia silenciosa, design afiado.', 30),
  ('home', 'about_title', 'Sobre — título', 'Engenharia que respira a cidade.', NULL, 40),
  ('home', 'about_paragraph', 'Sobre — parágrafo', NULL, 'A Filadelfo Motors nasceu da convicção de que a mobilidade urbana merece elegância e potência na mesma medida.', 50),
  ('home', 'cta_title', 'CTA — título', 'Pronto para acelerar?', NULL, 60),
  ('home', 'cta_subtitle', 'CTA — subtítulo', NULL, 'Fale com nosso time de vendas e encontre a bike ideal para você.', 70),
  ('sobre', 'hero_eyebrow', 'Hero — etiqueta', 'Nossa história', NULL, 10),
  ('sobre', 'hero_title', 'Hero — título', 'Filadelfo Motors.', NULL, 20),
  ('sobre', 'hero_subtitle', 'Hero — subtítulo', NULL, 'Engenharia, estética e propósito andando juntos.', 30),
  ('sobre', 'mission_title', 'Missão — título', 'Nossa missão', NULL, 40),
  ('sobre', 'mission_text', 'Missão — texto', NULL, 'Transformar a mobilidade urbana com bicicletas elétricas que unem design refinado, performance silenciosa e engenharia confiável.', 50);

-- ============================================================
-- NAV LINKS (header / footer)
-- ============================================================
CREATE TABLE public.nav_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location text NOT NULL,       -- 'header' | 'footer'
  label text NOT NULL,
  url text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  open_in_new_tab boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.nav_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view nav links"
  ON public.nav_links FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert nav links"
  ON public.nav_links FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update nav links"
  ON public.nav_links FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete nav links"
  ON public.nav_links FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_nav_links_updated_at
  BEFORE UPDATE ON public.nav_links
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_nav_links_location ON public.nav_links(location, display_order);

-- Seed current header/footer links
INSERT INTO public.nav_links (location, label, url, display_order) VALUES
  ('header', 'Catálogo', '/catalogo', 10),
  ('header', 'Sobre nós', '/sobre', 20),
  ('header', 'Falar com o time de vendas', '#contato', 30),
  ('footer', 'Catálogo', '/catalogo', 10),
  ('footer', 'Sobre nós', '/sobre', 20),
  ('footer', 'Política de privacidade', '/privacidade', 30);