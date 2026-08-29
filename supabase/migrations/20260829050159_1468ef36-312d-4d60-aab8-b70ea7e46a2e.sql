-- ============ ROLES ============
CREATE TYPE public.app_role AS ENUM ('super_admin', 'content_manager');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id)
$$;

CREATE POLICY "Staff can view profiles" ON public.profiles FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

CREATE POLICY "Staff can view roles" ON public.user_roles FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email)
  ON CONFLICT (id) DO NOTHING;
  -- first ever user becomes super admin, later users become content managers
  IF NOT EXISTS (SELECT 1 FROM public.user_roles) THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'super_admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'content_manager');
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER t_profiles BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ SETTINGS ============
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Super admin manage settings" ON public.site_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin')) WITH CHECK (public.has_role(auth.uid(), 'super_admin'));
CREATE TRIGGER t_site_settings BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ MEDIA ============
CREATE TABLE public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  title TEXT,
  alt_text TEXT,
  caption TEXT,
  category TEXT NOT NULL DEFAULT 'General',
  folder TEXT,
  mime_type TEXT,
  file_size INTEGER,
  width INTEGER,
  height INTEGER,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.media_assets TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_assets TO authenticated;
GRANT ALL ON public.media_assets TO service_role;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read media" ON public.media_assets FOR SELECT TO anon, authenticated USING (deleted_at IS NULL);
CREATE POLICY "Staff manage media" ON public.media_assets FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER t_media BEFORE UPDATE ON public.media_assets FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ HOMEPAGE SECTIONS ============
CREATE TABLE public.homepage_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  heading TEXT,
  subheading TEXT,
  body TEXT,
  image_url TEXT,
  cta_text TEXT,
  cta_link TEXT,
  secondary_cta_text TEXT,
  secondary_cta_link TEXT,
  extra JSONB NOT NULL DEFAULT '{}'::jsonb,
  enabled BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.homepage_sections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.homepage_sections TO authenticated;
GRANT ALL ON public.homepage_sections TO service_role;
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read homepage" ON public.homepage_sections FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Staff manage homepage" ON public.homepage_sections FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER t_homepage BEFORE UPDATE ON public.homepage_sections FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ COUNTRIES ============
CREATE TABLE public.countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT,
  flag_emoji TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  description TEXT,
  training_count INTEGER,
  featured_image_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.countries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.countries TO authenticated;
GRANT ALL ON public.countries TO service_role;
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read countries" ON public.countries FOR SELECT TO anon USING (published = true AND deleted_at IS NULL);
CREATE POLICY "Staff read countries" ON public.countries FOR SELECT TO authenticated USING (public.is_staff(auth.uid()) OR (published = true AND deleted_at IS NULL));
CREATE POLICY "Staff manage countries" ON public.countries FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER t_countries BEFORE UPDATE ON public.countries FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ TRAINING TOPICS ============
CREATE TABLE public.training_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  category TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.training_topics TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.training_topics TO authenticated;
GRANT ALL ON public.training_topics TO service_role;
ALTER TABLE public.training_topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read topics" ON public.training_topics FOR SELECT TO anon USING (published = true AND deleted_at IS NULL);
CREATE POLICY "Staff read topics" ON public.training_topics FOR SELECT TO authenticated USING (public.is_staff(auth.uid()) OR (published = true AND deleted_at IS NULL));
CREATE POLICY "Staff manage topics" ON public.training_topics FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER t_topics BEFORE UPDATE ON public.training_topics FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ TRAINERS ============
CREATE TABLE public.trainers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE,
  name TEXT NOT NULL,
  professional_title TEXT,
  qualification TEXT,
  position TEXT,
  short_bio TEXT,
  full_bio TEXT,
  photo_url TEXT,
  additional_photos JSONB NOT NULL DEFAULT '[]'::jsonb,
  training_areas TEXT[] NOT NULL DEFAULT '{}',
  regions TEXT[] NOT NULL DEFAULT '{}',
  email TEXT,
  phone TEXT,
  linkedin_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT false,
  published BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.trainers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trainers TO authenticated;
GRANT ALL ON public.trainers TO service_role;
ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read trainers" ON public.trainers FOR SELECT TO anon USING (published = true AND deleted_at IS NULL);
CREATE POLICY "Staff read trainers" ON public.trainers FOR SELECT TO authenticated USING (public.is_staff(auth.uid()) OR (published = true AND deleted_at IS NULL));
CREATE POLICY "Staff manage trainers" ON public.trainers FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER t_trainers BEFORE UPDATE ON public.trainers FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ PROGRAMS ============
CREATE TABLE public.programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE,
  name TEXT NOT NULL,
  short_description TEXT,
  full_description TEXT,
  target_audience TEXT,
  duration TEXT,
  workshop_format TEXT,
  image_url TEXT,
  gallery_images JSONB NOT NULL DEFAULT '[]'::jsonb,
  cta_text TEXT,
  cta_link TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT false,
  published BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.programs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.programs TO authenticated;
GRANT ALL ON public.programs TO service_role;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read programs" ON public.programs FOR SELECT TO anon USING (published = true AND deleted_at IS NULL);
CREATE POLICY "Staff read programs" ON public.programs FOR SELECT TO authenticated USING (public.is_staff(auth.uid()) OR (published = true AND deleted_at IS NULL));
CREATE POLICY "Staff manage programs" ON public.programs FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER t_programs BEFORE UPDATE ON public.programs FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.program_trainers (
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  trainer_id UUID NOT NULL REFERENCES public.trainers(id) ON DELETE CASCADE,
  PRIMARY KEY (program_id, trainer_id)
);
CREATE TABLE public.program_topics (
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES public.training_topics(id) ON DELETE CASCADE,
  PRIMARY KEY (program_id, topic_id)
);
CREATE TABLE public.program_countries (
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  country_id UUID NOT NULL REFERENCES public.countries(id) ON DELETE CASCADE,
  PRIMARY KEY (program_id, country_id)
);
GRANT SELECT ON public.program_trainers, public.program_topics, public.program_countries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.program_trainers, public.program_topics, public.program_countries TO authenticated;
GRANT ALL ON public.program_trainers, public.program_topics, public.program_countries TO service_role;
ALTER TABLE public.program_trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_countries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read program_trainers" ON public.program_trainers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Staff manage program_trainers" ON public.program_trainers FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Public read program_topics" ON public.program_topics FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Staff manage program_topics" ON public.program_topics FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Public read program_countries" ON public.program_countries FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Staff manage program_countries" ON public.program_countries FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- ============ INSTITUTIONS ============
CREATE TABLE public.institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  institution_type TEXT NOT NULL DEFAULT 'School',
  country_id UUID REFERENCES public.countries(id) ON DELETE SET NULL,
  country_name TEXT,
  state_region TEXT,
  city TEXT,
  address TEXT,
  website_url TEXT,
  logo_url TEXT,
  cover_image_url TEXT,
  gallery_images JSONB NOT NULL DEFAULT '[]'::jsonb,
  training_conducted TEXT,
  training_category TEXT,
  year INTEGER,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT false,
  published BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.institutions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.institutions TO authenticated;
GRANT ALL ON public.institutions TO service_role;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read institutions" ON public.institutions FOR SELECT TO anon USING (published = true AND deleted_at IS NULL);
CREATE POLICY "Staff read institutions" ON public.institutions FOR SELECT TO authenticated USING (public.is_staff(auth.uid()) OR (published = true AND deleted_at IS NULL));
CREATE POLICY "Staff manage institutions" ON public.institutions FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER t_institutions BEFORE UPDATE ON public.institutions FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ GALLERY ============
CREATE TABLE public.gallery_albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  cover_image_url TEXT,
  category TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id UUID REFERENCES public.gallery_albums(id) ON DELETE SET NULL,
  media_id UUID REFERENCES public.media_assets(id) ON DELETE SET NULL,
  image_url TEXT NOT NULL,
  title TEXT,
  caption TEXT,
  alt_text TEXT,
  taken_on DATE,
  country TEXT,
  city TEXT,
  category TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT false,
  published BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_albums, public.gallery_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_albums, public.gallery_images TO authenticated;
GRANT ALL ON public.gallery_albums, public.gallery_images TO service_role;
ALTER TABLE public.gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read albums" ON public.gallery_albums FOR SELECT TO anon USING (published = true AND deleted_at IS NULL);
CREATE POLICY "Staff read albums" ON public.gallery_albums FOR SELECT TO authenticated USING (public.is_staff(auth.uid()) OR (published = true AND deleted_at IS NULL));
CREATE POLICY "Staff manage albums" ON public.gallery_albums FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Public read gallery images" ON public.gallery_images FOR SELECT TO anon USING (published = true AND deleted_at IS NULL);
CREATE POLICY "Staff read gallery images" ON public.gallery_images FOR SELECT TO authenticated USING (public.is_staff(auth.uid()) OR (published = true AND deleted_at IS NULL));
CREATE POLICY "Staff manage gallery images" ON public.gallery_images FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER t_albums BEFORE UPDATE ON public.gallery_albums FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER t_gallery BEFORE UPDATE ON public.gallery_images FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ TESTIMONIALS ============
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  designation TEXT,
  organization TEXT,
  country TEXT,
  photo_url TEXT,
  quote TEXT NOT NULL,
  rating INTEGER,
  program_id UUID REFERENCES public.programs(id) ON DELETE SET NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT false,
  published BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read testimonials" ON public.testimonials FOR SELECT TO anon USING (published = true AND deleted_at IS NULL);
CREATE POLICY "Staff read testimonials" ON public.testimonials FOR SELECT TO authenticated USING (public.is_staff(auth.uid()) OR (published = true AND deleted_at IS NULL));
CREATE POLICY "Staff manage testimonials" ON public.testimonials FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER t_testimonials BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ WORKSHOPS ============
CREATE TABLE public.workshops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  program_id UUID REFERENCES public.programs(id) ON DELETE SET NULL,
  event_date DATE,
  start_time TIME,
  end_time TIME,
  location TEXT,
  country TEXT,
  city TEXT,
  institution_id UUID REFERENCES public.institutions(id) ON DELETE SET NULL,
  trainer_id UUID REFERENCES public.trainers(id) ON DELETE SET NULL,
  description TEXT,
  image_url TEXT,
  gallery_images JSONB NOT NULL DEFAULT '[]'::jsonb,
  registration_link TEXT,
  status TEXT NOT NULL DEFAULT 'Draft',
  display_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.workshops TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workshops TO authenticated;
GRANT ALL ON public.workshops TO service_role;
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read workshops" ON public.workshops FOR SELECT TO anon USING (published = true AND deleted_at IS NULL);
CREATE POLICY "Staff read workshops" ON public.workshops FOR SELECT TO authenticated USING (public.is_staff(auth.uid()) OR (published = true AND deleted_at IS NULL));
CREATE POLICY "Staff manage workshops" ON public.workshops FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER t_workshops BEFORE UPDATE ON public.workshops FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ ENQUIRIES ============
CREATE TABLE public.enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  organization TEXT,
  designation TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  country TEXT,
  training_requirement TEXT,
  preferred_date DATE,
  participants INTEGER,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'New',
  internal_notes TEXT,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.enquiries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.enquiries TO authenticated;
GRANT ALL ON public.enquiries TO service_role;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit enquiry" ON public.enquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Staff read enquiries" ON public.enquiries FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff update enquiries" ON public.enquiries FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff delete enquiries" ON public.enquiries FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));
CREATE TRIGGER t_enquiries BEFORE UPDATE ON public.enquiries FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ NAVIGATION ============
CREATE TABLE public.navigation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  url TEXT NOT NULL DEFAULT '/',
  parent_id UUID REFERENCES public.navigation(id) ON DELETE CASCADE,
  location TEXT NOT NULL DEFAULT 'header',
  display_order INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.navigation TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.navigation TO authenticated;
GRANT ALL ON public.navigation TO service_role;
ALTER TABLE public.navigation ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read navigation" ON public.navigation FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Super admin manage navigation" ON public.navigation FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin')) WITH CHECK (public.has_role(auth.uid(), 'super_admin'));
CREATE TRIGGER t_navigation BEFORE UPDATE ON public.navigation FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ SEO ============
CREATE TABLE public.seo_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key TEXT NOT NULL UNIQUE,
  page_label TEXT NOT NULL,
  seo_title TEXT,
  meta_description TEXT,
  focus_keyword TEXT,
  og_image_url TEXT,
  canonical_url TEXT,
  robots_index BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.seo_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seo_settings TO authenticated;
GRANT ALL ON public.seo_settings TO service_role;
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read seo" ON public.seo_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Super admin manage seo" ON public.seo_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin')) WITH CHECK (public.has_role(auth.uid(), 'super_admin'));
CREATE TRIGGER t_seo BEFORE UPDATE ON public.seo_settings FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ SEED STRUCTURAL DEFAULTS ============
INSERT INTO public.site_settings (key, value) VALUES
  ('contact', '{"phone":"","whatsapp":"","email":"","address":"","business_hours":"","countries_served":"India, Malaysia, Indonesia, UAE, Vietnam, Sri Lanka"}'),
  ('social', '{"facebook":"","instagram":"","linkedin":"","youtube":"","twitter":""}'),
  ('footer', '{"logo_url":"","description":"","copyright":"© Limra Academy for Excellence. All rights reserved."}'),
  ('branding', '{"site_name":"Limra Academy for Excellence","tagline":"Training minds across borders"}');

INSERT INTO public.homepage_sections (section_key, label, heading, subheading, body, cta_text, cta_link, enabled, display_order) VALUES
  ('hero','Hero','Limra Academy for Excellence','Training students, teachers and corporate teams across the world','', 'Book a Workshop','/contact', true, 1),
  ('about','About','About Limra Academy','','', 'Learn more','/about', true, 2),
  ('impact','Impact Statistics','Our Impact','','', '','', true, 3),
  ('programs','Programs','Our Programs','','', 'View all programs','/programs', true, 4),
  ('why_limra','Why Limra','Why Limra','','', '','', true, 5),
  ('international','International Reach','Global Reach','','', 'Explore countries','/global-reach', true, 6),
  ('trainers','Featured Trainers','Our Trainers','','', 'Meet all trainers','/trainers', true, 7),
  ('institutions','Featured Institutions','Institutions We Have Trained','','', 'View institutions','/institutions', true, 8),
  ('gallery','Gallery','Moments from Our Workshops','','', 'View gallery','/gallery', true, 9),
  ('testimonials','Testimonials','What They Say','','', '','', true, 10),
  ('final_cta','Final CTA','Bring Limra to your institution','','', 'Enquire now','/contact', true, 11);

INSERT INTO public.navigation (label, url, location, display_order) VALUES
  ('Home','/','header',1),
  ('About','/about','header',2),
  ('Programs','/programs','header',3),
  ('Trainers','/trainers','header',4),
  ('Institutions','/institutions','header',5),
  ('Global Reach','/global-reach','header',6),
  ('Gallery','/gallery','header',7),
  ('Contact','/contact','header',8);

INSERT INTO public.seo_settings (page_key, page_label) VALUES
  ('home','Homepage'),('about','About'),('programs','Programs'),('trainers','Trainers'),
  ('institutions','Institutions'),('global-reach','Global Reach'),('gallery','Gallery'),
  ('workshops','Workshops'),('contact','Contact');