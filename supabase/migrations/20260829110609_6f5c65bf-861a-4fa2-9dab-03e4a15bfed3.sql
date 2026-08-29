-- 1. Schema additions
ALTER TABLE public.trainers ADD COLUMN IF NOT EXISTS person_type text NOT NULL DEFAULT 'Trainer';
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE public.training_topics ADD COLUMN IF NOT EXISTS topic_group text;

CREATE TABLE IF NOT EXISTS public.impact_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  value text NOT NULL,
  label text NOT NULL,
  description text,
  icon text,
  display_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.impact_stats TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.impact_stats TO authenticated;
GRANT ALL ON public.impact_stats TO service_role;

ALTER TABLE public.impact_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published impact stats" ON public.impact_stats;
CREATE POLICY "Public can view published impact stats" ON public.impact_stats
  FOR SELECT USING (published = true AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Staff can view all impact stats" ON public.impact_stats;
CREATE POLICY "Staff can view all impact stats" ON public.impact_stats
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Staff can manage impact stats" ON public.impact_stats;
CREATE POLICY "Staff can manage impact stats" ON public.impact_stats
  FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

DROP TRIGGER IF EXISTS t_impact_stats ON public.impact_stats;
CREATE TRIGGER t_impact_stats BEFORE UPDATE ON public.impact_stats
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.impact_stats (value, label, description, icon, display_order)
SELECT v.value, v.label, v.description, v.icon, v.ord
FROM (VALUES
  ('60,500+', 'Employees & Managers', 'Trained through corporate and professional development workshops.', 'briefcase', 1),
  ('2 Lakh+', 'University Students', 'Reached through college and university training programs.', 'graduation-cap', 2),
  ('26 Lakh+', 'School Students', 'Reached through Train the Brain and student development workshops.', 'users', 3)
) AS v(value, label, description, icon, ord)
WHERE NOT EXISTS (SELECT 1 FROM public.impact_stats i WHERE i.label = v.label);

-- 2. Countries: add Singapore
INSERT INTO public.countries (name, code, flag_emoji, description, display_order, published)
SELECT 'Singapore', 'SG', '🇸🇬', 'International training experience in Singapore.', 3, true
WHERE NOT EXISTS (SELECT 1 FROM public.countries WHERE name = 'Singapore');

-- 3. People
UPDATE public.trainers
SET person_type = 'Director – Training',
    position = 'Director – Training',
    qualification = 'PhD Psychology, Psychotherapy',
    professional_title = 'International Trainer & Human Development Specialist',
    training_areas = ARRAY['Super Memory','Brain Gym','Concentration Techniques','Scientific Study Methods','Attitudes','Communication Skills','Body Language','Leadership Skills','NLP','Lateral Thinking','Placement Support Training','Effective Teaching Skills','TESOL / TKT'],
    regions = ARRAY['India','Malaysia','Indonesia','UAE','Vietnam','Sri Lanka']
WHERE name = 'Dr. K. Akbar Hussain';

INSERT INTO public.trainers (name, person_type, position, qualification, professional_title, short_bio, training_areas, regions, display_order, featured, published)
SELECT p.name, p.ptype, p.ptype, p.qual, 'Professional Trainer', 'Professional Trainer', ARRAY[]::text[], ARRAY[]::text[], p.ord, false, true
FROM (VALUES
  ('Dr. J. Lazarus', 'Senior Trainer', 'PhD Psychology', 2),
  ('Dr. A. Sendhil Kumar', 'Senior Trainer', 'PhD Psychology', 3),
  ('Dr. Magdalena', 'Senior Trainer', 'PhD Psychology', 4),
  ('Mr. Akif Hussain', 'Senior Trainer', 'MSc', 5),
  ('Ms. Mekala', 'Trainer', 'MSc', 6)
) AS p(name, ptype, qual, ord)
WHERE NOT EXISTS (SELECT 1 FROM public.trainers t WHERE t.name = p.name);

-- 4. Training topics (supplied lists, grouped)
INSERT INTO public.training_topics (name, category, topic_group, display_order, published)
SELECT t.name, t.cat, t.grp, t.ord, true
FROM (VALUES
  ('Concentration Techniques','Student Development','Focus & Concentration',1),
  ('Alertness & Goal Activation','Student Development','Focus & Concentration',2),
  ('How to be Fresh in the Class','Student Development','Focus & Concentration',3),
  ('Brain Activation Techniques – Left & Right','Cognitive & Memory Training','Memory & Brain',5),
  ('Brain Gym Techniques','Cognitive & Memory Training','Memory & Brain',6),
  ('Scientific Study Method','Student Development','Study & Academic Skills',7),
  ('How to Make the Tough Subject Easy','Student Development','Study & Academic Skills',8),
  ('How to Score More Marks','Student Development','Study & Academic Skills',9),
  ('Magic with Maths','Student Development','Study & Academic Skills',10),
  ('Tips for Beautiful Handwriting','Student Development','Study & Academic Skills',11),
  ('Building Self Confidence','Personal Effectiveness','Personal Development',12),
  ('Attitudes & Mental Blocks','Personal Effectiveness','Personal Development',13),
  ('Stress Management','Personal Effectiveness','Personal Development',14),
  ('How to Wake Up Early in the Morning','Personal Effectiveness','Personal Development',15),
  ('Career Guidance','Student Development','Future & Career',16),
  ('Effective Communication Techniques','Teaching & Education Skills','Teaching & Communication',17),
  ('Effective Teaching Methods','Teaching & Education Skills','Teaching & Communication',18),
  ('Effective Teaching Techniques','Teaching & Education Skills','Teaching & Communication',19),
  ('Body Language','Communication & Leadership','Communication',20),
  ('How to Inspire the Students','Teaching & Education Skills','Engagement & Motivation',21),
  ('How to Grab the Attention of Students','Teaching & Education Skills','Engagement & Motivation',22),
  ('Learning Patterns / Student Psychology','Teaching & Education Skills','Engagement & Motivation',23),
  ('Social Emotional Learning','Teaching & Education Skills','Engagement & Motivation',24),
  ('Classroom Management Techniques','Teaching & Education Skills','Classroom Management',25),
  ('Inclusive Classroom Management','Teaching & Education Skills','Classroom Management',26),
  ('Effective Classroom Control','Teaching & Education Skills','Classroom Management',27),
  ('How to Handle Challenging Students','Teaching & Education Skills','Classroom Management',28),
  ('Innovative Assessment Methods','Teaching & Education Skills','Assessment & Curriculum',29),
  ('Competency Based Teaching','Teaching & Education Skills','Assessment & Curriculum',30),
  ('Mental Blocks','Teacher Development','Professional Skills',31),
  ('Team Building Activities','Teacher Development','Professional Skills',32),
  ('Creative Thinking','Teacher Development','Professional Skills',33),
  ('Work Ethics','Corporate & Professional Development','Leadership & People',34),
  ('NLP Communication & Observation Techniques','Teacher Development','Professional Skills',35),
  ('Super Memory','Cognitive & Memory Training','Cognitive Skills',36),
  ('Brain Gym','Cognitive & Memory Training','Cognitive Skills',37),
  ('Scientific Study Methods','Cognitive & Memory Training','Cognitive Skills',38),
  ('Leadership Skills','Communication & Leadership','Leadership & People',40),
  ('Attitudes','Corporate & Professional Development','Leadership & People',42),
  ('Teamwork','Corporate & Professional Development','Leadership & People',43),
  ('NLP & Lateral Thinking','Corporate & Professional Development','Thinking',44),
  ('Placement Support Training','Other Professional Training','Professional Development',45),
  ('Effective Teaching Skills','Teaching & Education Skills','Professional Development',46),
  ('TESOL / TKT','Other Professional Training','Professional Development',47),
  ('Graphology','Other Professional Training','Other',48),
  ('Personal Effectiveness','Personal Effectiveness','Leadership & People',49)
) AS t(name, cat, grp, ord)
WHERE NOT EXISTS (SELECT 1 FROM public.training_topics x WHERE x.name = t.name);

UPDATE public.training_topics SET category = 'Cognitive & Memory Training', topic_group = 'Memory & Brain', display_order = 4
WHERE name = 'Super Memory Techniques';
UPDATE public.training_topics SET category = 'Communication & Leadership', topic_group = 'Communication', display_order = 39
WHERE name = 'Communication Skills';
UPDATE public.training_topics SET category = 'Corporate & Professional Development', topic_group = 'Leadership & People', display_order = 41
WHERE name = 'Personality Development';

UPDATE public.training_topics SET published = false
WHERE name IN ('Concentration & Brain Gym','Effective Study Skills','Leadership & Team Building','Teaching Effectiveness','Time & Stress Management');

-- 5. Programs
UPDATE public.programs SET
  category = 'Student Development',
  target_audience = 'School Students – Classes VII to XII',
  duration = '5 Hours',
  workshop_format = 'One Full-Day Workshop',
  short_description = 'Not a lecture — a practical, technique-oriented and activity-oriented workshop where students learn techniques and practice them immediately.',
  featured = true,
  published = true
WHERE slug = 'train-the-brain';

UPDATE public.programs SET
  name = 'Workshop for Teachers on Effective Teaching Skills',
  slug = 'effective-teaching-skills',
  category = 'Teacher Development',
  target_audience = 'Teachers & Educators',
  duration = '8 Hours – two continuous days, 4 hours per day',
  workshop_format = 'On-campus workshop, typical batch size 30–35 teachers',
  short_description = 'Helping teachers communicate, engage and manage the classroom more effectively.',
  published = true
WHERE slug = 'teacher-training-program';

UPDATE public.programs SET
  name = 'Corporate & Professional Training',
  slug = 'corporate-training',
  category = 'Corporate & Professional Development',
  target_audience = 'Employees, Managers & Professionals',
  short_description = 'Psychology-based, technique-oriented training in memory, communication, leadership, teamwork and personal effectiveness.',
  published = true
WHERE slug = 'corporate-skill-workshop';

UPDATE public.programs SET published = false WHERE slug = 'student-excellence-program';

-- Link topics to programs by group
INSERT INTO public.program_topics (program_id, topic_id)
SELECT p.id, t.id FROM public.programs p, public.training_topics t
WHERE p.slug = 'train-the-brain'
  AND t.topic_group IN ('Focus & Concentration','Memory & Brain','Study & Academic Skills','Personal Development','Future & Career')
  AND t.published
  AND NOT EXISTS (SELECT 1 FROM public.program_topics pt WHERE pt.program_id = p.id AND pt.topic_id = t.id);

INSERT INTO public.program_topics (program_id, topic_id)
SELECT p.id, t.id FROM public.programs p, public.training_topics t
WHERE p.slug = 'effective-teaching-skills'
  AND (t.topic_group IN ('Teaching & Communication','Engagement & Motivation','Classroom Management','Assessment & Curriculum','Professional Skills')
       OR t.name IN ('Body Language','Work Ethics'))
  AND t.published
  AND NOT EXISTS (SELECT 1 FROM public.program_topics pt WHERE pt.program_id = p.id AND pt.topic_id = t.id);

INSERT INTO public.program_topics (program_id, topic_id)
SELECT p.id, t.id FROM public.programs p, public.training_topics t
WHERE p.slug = 'corporate-training'
  AND t.topic_group IN ('Cognitive Skills','Communication','Leadership & People','Thinking','Professional Development','Other')
  AND t.published
  AND NOT EXISTS (SELECT 1 FROM public.program_topics pt WHERE pt.program_id = p.id AND pt.topic_id = t.id);

-- 6. Institutions (supplied list)
INSERT INTO public.institutions (name, institution_type, country_name, state_region, city, display_order, published, country_id)
SELECT i.name, i.itype, i.country, i.region, i.city, i.ord, true,
       (SELECT c.id FROM public.countries c WHERE c.name = i.country LIMIT 1)
FROM (VALUES
  ('SDA Mat. Hr. Sec. School','School','India','Puducherry','Pondicherry',1),
  ('Cheran Mat. Hr. Sec. School','School','India','Tamil Nadu','Karur',2),
  ('St. James Mat. Hr. Sec. School','School','India','Tamil Nadu','Trichy',3),
  ('Sacred Heart Sr. Sec. School (CBSE)','School','India','Tamil Nadu','Trichy',4),
  ('Thamarai International School','School','India','Tamil Nadu','Kumbakonam',5),
  ('Sri Vijay Vidyalaya (CBSE)','School','India','Tamil Nadu','Dharmapuri',6),
  ('St. Joseph''s (CBSE)','School','India','Tamil Nadu','Chennai',7),
  ('Sacred Heart A.I. Convent','School','India','Tamil Nadu','Villupuram',8),
  ('Leo Sr. Sec. School','School','India','Tamil Nadu','Chennai',9),
  ('Little Flower Convent','School','India','Tamil Nadu','Tirupur',10),
  ('Avila Convent','School','India','Tamil Nadu','Coimbatore',11),
  ('Kongu Vellalar','School','India','Tamil Nadu','Chennimalai, Erode',12),
  ('CEOA Group of Schools','School','India','Tamil Nadu','Madurai',13),
  ('Nobel Public School (CBSE)','School','India','Kerala','Manjeri',14),
  ('Kanikkamatha Girls Convent','School','India','Kerala','Palakkad',15),
  ('Bharath Matha Public School','School','India','Kerala','Palakkad',16),
  ('Bharat International School','School','India','Kerala','Thiruvananthapuram',17),
  ('Poorna Vikas Vidyalaya','School','India','Karnataka','Bangalore',18),
  ('Ashwin Vidyalaya','School','India','Karnataka','Bangalore',19),
  ('Sri Maruthi School (CBSE)','School','India','Karnataka','Bangalore',20),
  ('Rockwell International School','School','India','Telangana','Hyderabad',21),
  ('St. Ann''s Public School','School','India','Telangana','Hyderabad',22),
  ('DRS International School','School','India','Telangana','Hyderabad',23),
  ('Gitanjali Devashray Sr. School','School','India','Telangana','Begumpet, Hyderabad',24),
  ('Pallavi Model School (CBSE)','School','India','Telangana','Bowenpally, Secunderabad',25),
  ('Green View International School','School','Malaysia','Kuala Lumpur','Kuala Lumpur',26),
  ('NAZ International School','School','Malaysia','Kuala Lumpur','Kuala Lumpur',27),
  ('UCSI University','University','Malaysia',NULL,NULL,28),
  ('STARS International School','School','Malaysia',NULL,NULL,29),
  ('Wise Oaks','School','Singapore','Bukit Timah','Bukit Timah',30),
  ('XCL World Academy','School','Singapore','Yishun','Yishun',31),
  ('Tanglin International School','School','Singapore','Portsdown','Portsdown',32),
  ('Asian International School','School','UAE','Abu Dhabi','Abu Dhabi',33),
  ('New Model School','School','UAE','Abu Dhabi','Ruwais',34),
  ('UIPS International School','School','UAE','Dubai','Dubai',35),
  ('Happy Home School','School','UAE','Sharjah','Sharjah',36),
  ('Progressive English School','School','UAE','Sharjah','Sharjah',37),
  ('IDB College','College','Indonesia','Bali','Bali',38),
  ('UMM University','University','Indonesia','East Java','Malang',39),
  ('YPI Pandak','School','Indonesia','West Java','Bandung',40),
  ('UNIKOM University','University','Indonesia','West Java','Bandung',41),
  ('UEH University','University','Vietnam','Ho Chi Minh City','Ho Chi Minh City',42)
) AS i(name, itype, country, region, city, ord)
WHERE NOT EXISTS (SELECT 1 FROM public.institutions x WHERE x.name = i.name);

UPDATE public.institutions SET published = false, featured = false
WHERE name IN ('Ho Chi Minh City Open University','Hue University','Nalanda College of Agriculture','Radiant School');

-- 7. Homepage sections
INSERT INTO public.homepage_sections (section_key, label, heading, subheading, body, enabled, display_order)
SELECT s.k, s.l, s.h, s.sh, s.b, true, s.ord
FROM (VALUES
  ('who_we_serve','Who We Serve','Who We Serve','Three clear training journeys','Schools & Students, Teachers & Educators, Corporates & Professionals.',15),
  ('teacher_training','Teacher Training','Workshop for Teachers on Effective Teaching Skills','Helping teachers communicate, engage and manage the classroom more effectively.',NULL,35),
  ('corporate_training','Corporate Training','Corporate & Professional Training','Practical development for employees, managers and professionals.',NULL,45),
  ('approach','Our Approach','Our Approach','Psychology-Based · Technique-Oriented · Activity-Oriented · Practical','It is not a lecture but a technique-oriented, psychology-based and activity-oriented workshop.',55)
) AS s(k, l, h, sh, b, ord)
WHERE NOT EXISTS (SELECT 1 FROM public.homepage_sections x WHERE x.section_key = s.k);

UPDATE public.homepage_sections
SET heading = 'Train the Brain. Transform Potential.'
WHERE section_key = 'hero' AND (heading IS NULL OR heading = '');