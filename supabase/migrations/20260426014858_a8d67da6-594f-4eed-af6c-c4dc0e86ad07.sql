ALTER TABLE public.bikes
  ADD COLUMN IF NOT EXISTS weight_capacity text,
  ADD COLUMN IF NOT EXISTS colors jsonb NOT NULL DEFAULT '[]'::jsonb;