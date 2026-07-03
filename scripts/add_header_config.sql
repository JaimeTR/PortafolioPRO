ALTER TABLE public.profile 
ADD COLUMN header_logo_url TEXT,
ADD COLUMN is_theme_switch_visible BOOLEAN DEFAULT true,
ADD COLUMN is_language_switch_visible BOOLEAN DEFAULT true,
ADD COLUMN header_show_linkedin BOOLEAN DEFAULT true,
ADD COLUMN header_show_github BOOLEAN DEFAULT true,
ADD COLUMN header_show_facebook BOOLEAN DEFAULT false,
ADD COLUMN header_show_tiktok BOOLEAN DEFAULT false,
ADD COLUMN header_show_instagram BOOLEAN DEFAULT false,
ADD COLUMN header_links JSONB DEFAULT '[
  {"id": "link1", "label_es": "Proyectos", "label_en": "Projects", "url_es": "/{lang}/#projects", "url_en": "/{lang}/#projects", "visible": true},
  {"id": "link2", "label_es": "Experiencia", "label_en": "Experience", "url_es": "/{lang}/#experience", "url_en": "/{lang}/#experience", "visible": true},
  {"id": "link3", "label_es": "Blog", "label_en": "Blog", "url_es": "/{lang}/articulos", "url_en": "/{lang}/posts", "visible": true},
  {"id": "link4", "label_es": "Servicios", "label_en": "Services", "url_es": "https://www.devmarkpe.com/", "url_en": "https://www.devmarkpe.com/", "visible": true}
]';
