-- =========================================
-- 1. Roles enum + user_roles table
-- =========================================
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- =========================================
-- 2. Shared timestamp trigger
-- =========================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =========================================
-- 3. Bikes table
-- =========================================
CREATE TYPE public.bike_badge AS ENUM ('lancamento', 'mais_vendida', 'oferta', 'novidade');

CREATE TABLE public.bikes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tag TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  parcel TEXT,
  autonomia TEXT,
  motor TEXT,
  velocidade TEXT,
  video_url TEXT,
  badge bike_badge,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.bikes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active bikes"
  ON public.bikes FOR SELECT
  USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert bikes"
  ON public.bikes FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update bikes"
  ON public.bikes FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete bikes"
  ON public.bikes FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_bikes_updated_at
  BEFORE UPDATE ON public.bikes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- 4. Bike images
-- =========================================
CREATE TABLE public.bike_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bike_id UUID NOT NULL REFERENCES public.bikes(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_cover BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.bike_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view bike images"
  ON public.bike_images FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert bike images"
  ON public.bike_images FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update bike images"
  ON public.bike_images FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete bike images"
  ON public.bike_images FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_bike_images_bike_id ON public.bike_images(bike_id);

-- =========================================
-- 5. Offers / pop-ups
-- =========================================
CREATE TYPE public.offer_mode AS ENUM ('on_enter', 'on_exit', 'top_banner');

CREATE TABLE public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_url TEXT,
  cta_label TEXT,
  cta_url TEXT,
  mode offer_mode NOT NULL DEFAULT 'on_enter',
  delay_seconds INTEGER NOT NULL DEFAULT 3,
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active offers"
  ON public.offers FOR SELECT
  USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert offers"
  ON public.offers FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update offers"
  ON public.offers FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete offers"
  ON public.offers FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_offers_updated_at
  BEFORE UPDATE ON public.offers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- 6. Storage bucket: bike-media
-- =========================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('bike-media', 'bike-media', true);

CREATE POLICY "Public can view bike media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'bike-media');

CREATE POLICY "Admins can upload bike media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'bike-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update bike media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'bike-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete bike media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'bike-media' AND public.has_role(auth.uid(), 'admin'));