import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Error: Falta SUPABASE_URL o SUPABASE_SERVICE_KEY en las variables de entorno.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

const experienceInfo = [
  { "role": "Web Developer | Wordpress", "company": "MeM Tecnologia | España", "date_string": "Marzo 2024 - Actualidad", "description": "Encargado del desarrollo y mantenimiento de sitios web informativos, eCommerce y plataformas personalizadas para clientes internacionales. Trabajo con WordPress, PHP y JavaScript para crear soluciones adaptadas, priorizando la experiencia del usuario, el rendimiento y la escalabilidad. Además, gestiono la comunicación con clientes, documentación técnica y mejoras continuas en cada proyecto.", "role_en": "Web Developer | WordPress", "company_en": "MeM Tecnologia | Spain", "date_en_string": "March 2024 - Present", "description_en": "Responsible for developing and maintaining informative websites, eCommerce, and custom platforms for international clients. I work with WordPress, PHP, and JavaScript to build tailored solutions, prioritizing user experience, performance, and scalability. I also handle client communication, technical documentation, and continuous improvements for each project.", "start_date": "2024-03-01", "end_date": null, "is_active": true, "is_featured": true },
  { "role": "Web Developer | Web Designer", "company": "Impulso Digital - Taklab", "date_string": "Septiembre 2023 – Febrero 2024", "description": "Responsable del diseño y desarrollo de proyectos web, incluyendo eCommerce, sitios informativos y landing pages. Trabajo con HTML, CSS, JavaScript y WordPress para crear soluciones personalizadas, dinámicas y seguras. Encargado también del mantenimiento técnico y optimización continua de los sitios.", "role_en": "Web Developer | Web Designer", "company_en": "Impulso Digital - Taklab", "date_en_string": "September 2023 – February 2024", "description_en": "Responsible for designing and developing web projects, including eCommerce, informational sites, and landing pages. I work with HTML, CSS, JavaScript, and WordPress to deliver customized, dynamic, and secure solutions. Also in charge of technical maintenance and ongoing optimization.", "start_date": "2023-09-01", "end_date": "2024-02-01", "is_active": true, "is_featured": true },
  { "role": "Desarrollador Full Stack | Proyecto", "company": "Universidad Cesar Vallejo", "date_string": "Enero 2023 - Diciembre 2023", "description": "Diseño e implementación de un sistema web para la gestión de productos de investigación, Depuración y pruebas de las funcionalidades desarrolladas de cada módulo del sistema y la documentación de proyectos y lider de un equipo de alumnos en practicas profesionales.", "role_en": "Full Stack Developer | Project", "company_en": "Universidad Cesar Vallejo", "date_en_string": "January 2023 - December 2023", "description_en": "Design and implementation of a web system for managing research outputs. Debugging and testing features across each system module, project documentation, and leadership of a team of interns during professional practice.", "start_date": "2023-01-01", "end_date": "2023-12-01", "is_active": true, "is_featured": true },
  { "role": "Full Stack Developer | Web Designer", "company": "Devmark | Autonomo", "date_string": "Febrero 2020 - Actualidad", "description": "Encargado de desarrollar soluciones web para distintos rubros, especialmente en empresas B2B e inmobiliarias. Desarrollo y mantenimiento de sitios web personalizados, gestión de bases de datos y creación de funcionalidades a medida. Establecimiento de convenciones de código y liderazgo del equipo de desarrollo web.", "role_en": "Full Stack Developer | Web Designer", "company_en": "Devmark | Self-employed", "date_en_string": "February 2020 - Present", "description_en": "Responsible for building web solutions for various industries, especially B2B and real estate. Development and maintenance of custom websites, database management, and creation of tailored features. Established coding conventions and led the web development team.", "start_date": "2020-02-01", "end_date": null, "is_active": true, "is_featured": true },
  { "role": "Desarrollador Web | Autonomo", "company": "Fiver | Freelancer | Upwork | Frilea", "date_string": "Abril 2019 - Actualidad", "description": "Diseñar, rediseñar y desarrollar páginas web responsiva según la necesidad del cliente de  la plataforma, también realice SEO, Campañas en metads, google ads y automatización de procesos y diseño de banners, logos, post, etc", "role_en": "Web Developer | Self-employed", "company_en": "Fiverr | Freelancer | Upwork | Frilea", "date_en_string": "April 2019 - Present", "description_en": "Design, redesign, and develop responsive websites according to client needs across platforms. Also worked on SEO, Meta Ads, Google Ads, process automation, and design of banners, logos, posts, etc.", "start_date": "2019-04-01", "end_date": null, "is_active": true, "is_featured": true },
  { "role": "Mas Experiencias", "company": "Externa BPO | Muni de Huaral | Hamul | Carlei Telecomunicaciones", "date_string": "Experiencias previa como soporte tecnico, soporte de software , tecnico en redes fibra optica", "description": "", "role_en": "More Experiences", "company_en": "Externa BPO | Municipality of Huaral | Hamul | Carlei Telecommunications", "date_en_string": "Previous experiences such as technical support, software support, fiber optics network technician", "description_en": "", "start_date": null, "end_date": null, "is_active": true, "is_featured": true }
].map((e, i) => ({ ...e, sort_order: i }));

const MY_STACK = {
    "frontend": [
        { "name": "HTML", "icon_name": "HtmlIcon" },
        { "name": "CSS", "icon_name": "CSSIcon" },
        { "name": "JavaScript", "icon_name": "JavaScriptIcon" },
        { "name": "ReactJS", "icon_name": "ReactJSIcon" },
        { "name": "TailwindCSS", "icon_name": "TailwindIcon" },
        { "name": "SASS", "icon_name": "SassIcon" },
        { "name": "Figma", "icon_name": "FigmaIcon" }
    ],
    "backend": [
        { "name": "PHP", "icon_name": "PHPIcon" },
        { "name": "NodeJS", "icon_name": "NodeJSIcon" },
        { "name": "Laravel", "icon_name": "LaravelIcon" },
        { "name": "ExpressJS", "icon_name": "ExpressIcon" },
        { "name": "MySQL", "icon_name": "MySQLIcon" },
        { "name": "MongoDB", "icon_name": "MongoDBIcon" },
        { "name": "Next.js", "icon_name": "NextJSIcon" },
        { "name": "Nginx", "icon_name": "NginxIcon" },
        { "name": "Apache", "icon_name": "ApacheIcon" }
    ],
    "learning": [
        { "name": "Python", "icon_name": "PythonIcon" },
        { "name": "Astro", "icon_name": "AstroIcon" },
        { "name": "Docker", "icon_name": "DockerIcon" },
        { "name": "TypeScript", "icon_name": "TypeScriptIcon" }
    ],
    "tools": [
        { "name": "Git", "icon_name": "GitIcon" },
        { "name": "GitHub", "icon_name": "GitHubIcon" },
        { "name": "Terminal", "icon_name": "TerminalIcon" },
        { "name": "VSCode", "icon_name": "VSCodeIcon" },
        { "name": "npm", "icon_name": "NpmIcon" },
        { "name": "WordPress", "icon_name": "WordPressIcon" }
    ]
};

async function migrateExperience() {
    console.log("Migrando experiencia...");
    await supabase.from('experience').delete().neq('id', 0); // clear existing
    const { error } = await supabase.from('experience').insert(experienceInfo);
    if (error) console.error("Error al migrar experiencia:", error);
    else console.log(`✅ ${experienceInfo.length} Experiencias migradas exitosamente.`);
}

async function migrateSkills() {
    console.log("Migrando skills...");
    await supabase.from('skills').delete().neq('id', 0); // clear existing
    const skillsToInsert = [];
    Object.keys(MY_STACK).forEach(category => {
        MY_STACK[category].forEach((s, idx) => {
            skillsToInsert.push({
                name: s.name,
                category: category,
                icon_name: s.icon_name,
                sort_order: idx
            });
        });
    });
    const { error } = await supabase.from('skills').insert(skillsToInsert);
    if (error) console.error("Error al migrar skills:", error);
    else console.log(`✅ ${skillsToInsert.length} Skills migrados exitosamente.`);
}

async function migrateProjects() {
    console.log("Migrando proyectos...");
    const projectsPath = path.join(process.cwd(), 'src/data/projects.json');
    if (!fs.existsSync(projectsPath)) {
        console.log("No se encontró projects.json");
        return;
    }
    await supabase.from('projects').delete().neq('id', 0); // clear existing
    const projectsData = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));

    const formattedProjects = projectsData.map((p, index) => ({
        title: p.title,
        description: p.description,
        image_url: p.image,
        category: p.category || 'Otros',
        rubro: p.rubro || '',
        technologies: p.technologies || [],
        link_url: p.url,
        github_url: p.github || '',
        is_featured: index < 5, 
        is_visible: true,
        sort_order: index
    }));

    const { error } = await supabase.from('projects').insert(formattedProjects);
    if (error) console.error("Error al migrar proyectos:", error);
    else console.log(`✅ ${formattedProjects.length} Proyectos migrados exitosamente.`);
}

async function run() {
    await migrateProjects();
    await migrateExperience();
    await migrateSkills();
    console.log("¡Migración completada!");
}

run();
