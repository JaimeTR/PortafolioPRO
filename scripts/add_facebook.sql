ALTER TABLE public.profile 
ADD COLUMN facebook_url TEXT,
ADD COLUMN is_facebook_visible BOOLEAN DEFAULT false;
