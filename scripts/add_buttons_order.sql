ALTER TABLE public.profile 
ADD COLUMN hero_buttons_order JSONB DEFAULT '["cv", "linkedin", "github", "email", "tiktok", "instagram", "button1", "button2"]';
