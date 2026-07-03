ALTER TABLE public.profile 
ADD COLUMN years_experience_es TEXT DEFAULT '+4 años de experiencia.',
ADD COLUMN years_experience_en TEXT DEFAULT '+4 years of experience.',
ADD COLUMN role_description_es TEXT DEFAULT 'Ingeniero de Sistemas | Desarrollador Full-Stack | Web Developer WP',
ADD COLUMN role_description_en TEXT DEFAULT 'Systems Engineer | Full-Stack Developer | Web Developer WP',
ADD COLUMN specialization_es TEXT DEFAULT 'Especializado en crear soluciones Web profesionales y eficaces',
ADD COLUMN specialization_en TEXT DEFAULT 'Specialized in creating professional and efficient Web solutions',
ADD COLUMN availability_es TEXT DEFAULT 'Dispuesto a trabajar en tu proyecto y aportar mis habilidades.',
ADD COLUMN availability_en TEXT DEFAULT 'Ready to work on your project and contribute my skills.',
ADD COLUMN is_github_visible BOOLEAN DEFAULT true,
ADD COLUMN is_linkedin_visible BOOLEAN DEFAULT true,
ADD COLUMN is_email_visible BOOLEAN DEFAULT true,
ADD COLUMN is_cv_visible BOOLEAN DEFAULT true;
