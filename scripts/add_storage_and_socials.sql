-- Añadir nuevas columnas sociales y configuración de visibilidad
ALTER TABLE public.profile 
ADD COLUMN tiktok_url TEXT,
ADD COLUMN is_tiktok_visible BOOLEAN DEFAULT false,
ADD COLUMN instagram_url TEXT,
ADD COLUMN is_instagram_visible BOOLEAN DEFAULT false,
ADD COLUMN is_button1_visible BOOLEAN DEFAULT true,
ADD COLUMN is_button2_visible BOOLEAN DEFAULT true;

-- Crear el bucket de almacenamiento para documentos (como el CV)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', true) 
ON CONFLICT (id) DO NOTHING;

-- Política para acceso público de lectura
CREATE POLICY "Public Access to Documents" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'documents' );

-- NOTA: Las políticas de inserción/actualización las manejaremos 
-- del lado del servidor de Next.js usando la clave Service Role.
