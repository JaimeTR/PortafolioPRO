const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Necesitarás proveer estas credenciales al ejecutar el script
// export SUPABASE_URL="tu-url"
// export SUPABASE_SERVICE_KEY="tu-service-key"
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Error: Falta SUPABASE_URL o SUPABASE_SERVICE_KEY en las variables de entorno.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function migrateProjects() {
    console.log("Migrando proyectos...");
    const projectsPath = path.join(__dirname, '../src/data/projects.json');
    if (!fs.existsSync(projectsPath)) {
        console.log("No se encontró projects.json");
        return;
    }
    const projectsData = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));

    const formattedProjects = projectsData.map((p, index) => ({
        title: p.title,
        description: p.description,
        image_url: p.image,
        category: p.category || 'Otros',
        rubro: p.rubro || '',
        technologies: p.technologies || [],
        link_url: p.url,
        is_featured: index < 5, // Destacamos los primeros 5 por defecto
        is_visible: true,
        sort_order: index
    }));

    const { data, error } = await supabase.from('projects').insert(formattedProjects);
    if (error) console.error("Error al migrar proyectos:", error);
    else console.log(`✅ ${formattedProjects.length} Proyectos migrados exitosamente.`);
}

// Extraemos datos de staticData.js parseando burdamente o requiriéndolo si es posible.
// Como staticData.js usa imports (ESM), vamos a tener que leerlo como texto o usar import().
async function migrateStaticData() {
    console.log("Para migrar experiencias y skills, por favor configura tus datos manualmente o adapta este script para importar ES modules.");
    // Aquí puedes agregar la importación dinámica de staticData si cambias tu script a .mjs
}

async function run() {
    await migrateProjects();
    await migrateStaticData();
    console.log("¡Migración completada!");
}

run();
