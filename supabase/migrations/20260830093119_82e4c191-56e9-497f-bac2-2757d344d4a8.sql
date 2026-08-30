CREATE TABLE public.credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  description text,
  image_url text NOT NULL,
  media_id uuid REFERENCES public.media_assets(id) ON DELETE SET NULL,
  issuing_organization text,
  certificate_date date,
  year integer,
  category text,
  alt_text text,
  featured boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  show_on_homepage boolean NOT NULL DEFAULT true,
  show_on_credentials_page boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.credentials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.credentials TO authenticated;
GRANT ALL ON public.credentials TO service_role;

ALTER TABLE public.credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published credentials are public"
  ON public.credentials FOR SELECT
  USING (published = true AND deleted_at IS NULL);

CREATE POLICY "Staff can read all credentials"
  ON public.credentials FOR SELECT
  TO authenticated
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Staff can manage credentials"
  ON public.credentials FOR ALL
  TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE TRIGGER t_credentials BEFORE UPDATE ON public.credentials
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE INDEX credentials_display_order_idx ON public.credentials (display_order);