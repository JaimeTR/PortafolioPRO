import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Minimal .env parser
try {
    const envFile = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf-8');
    envFile.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w\.\-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
            let val = match[2] || '';
            val = val.replace(/^['"](.*)['"]$/, '$1'); // remove quotes
            process.env[match[1]] = val;
        }
    });
} catch(e) {
    console.error("No .env.local found");
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
    const { data: projects, error } = await supabase.from('projects').select('*');
    if (error) {
        console.error('Error fetching projects:', error);
        return;
    }

    for (const project of projects) {
        if (project.image_url && project.image_url.startsWith('/projects/')) {
            const localPath = path.join(process.cwd(), 'public', project.image_url);
            if (fs.existsSync(localPath)) {
                console.log(`Migrating ${project.image_url} for project ${project.title}...`);
                const fileBuffer = fs.readFileSync(localPath);
                const ext = path.extname(localPath);
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}${ext}`;
                
                let bucket = 'portfolio';
                let { error: uploadError } = await supabase.storage
                    .from(bucket)
                    .upload(fileName, fileBuffer, {
                        contentType: `image/${ext.replace('.', '') || 'png'}`
                    });
                
                if (uploadError) {
                    console.log(`Failed to upload to portfolio, trying documents... (${uploadError.message})`);
                    bucket = 'documents';
                    const { error: uploadError2 } = await supabase.storage
                        .from(bucket)
                        .upload(fileName, fileBuffer, {
                            contentType: `image/${ext.replace('.', '') || 'png'}`
                        });
                    if (uploadError2) {
                         console.error(`Failed to upload to documents too. ${uploadError2.message}`);
                         continue;
                    }
                } 

                const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
                await supabase.from('projects').update({ image_url: publicUrlData.publicUrl }).eq('id', project.id);
                console.log(`Updated project "${project.title}" -> ${publicUrlData.publicUrl}`);
            } else {
                console.log(`File not found locally: ${localPath}`);
            }
        }
    }
    console.log("Migration complete!");
}

migrate();
