import { createServiceRoleClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export async function generateMetadata({ params }) {
  const { username } = await params
  try {
    const supabase = createServiceRoleClient()
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .eq('is_active', true)
      .single()

    if (!user) return { title: 'Portafolio no encontrado' }

    const { data: profile } = await supabase
      .from('profiles')
      .select('name_es')
      .eq('user_id', user.id)
      .single()

    const name = profile?.name_es || username
    return {
      title: `${name} | Portafolio Profesional`,
      description: `Portafolio profesional de ${name}. Conoce su experiencia, proyectos y más.`,
    }
  } catch {
    return { title: 'Portafolio' }
  }
}

export default async function PortfolioPage({ params }) {
  const { username } = await params
  const supabase = createServiceRoleClient()

  // Buscar usuario por username
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .eq('is_active', true)
    .single()

  if (userError || !user) {
    notFound()
  }

  // Cargar todos los datos del portafolio en paralelo
  const [profileRes, projectsRes, experiencesRes, skillsRes, sectionsRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('user_id', user.id).single(),
    supabase.from('projects').select('*').eq('user_id', user.id).eq('is_visible', true).order('sort_order'),
    supabase.from('experiences').select('*').eq('user_id', user.id).eq('is_active', true).eq('is_featured', true).order('sort_order'),
    supabase.from('skills').select('*').eq('user_id', user.id).order('sort_order'),
    supabase.from('sections_config').select('*').eq('user_id', user.id).eq('is_hidden', false).order('sort_order'),
  ])

  const profile = profileRes.data
  const projects = projectsRes.data || []
  const experiences = experiencesRes.data || []
  const skills = skillsRes.data || []
  const sections = sectionsRes.data || []

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950">
      {/* Background */}
      <div className="absolute top-0 z-[-2] h-screen w-full bg-dark-50 dark:bg-dark-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,153,255,0.25),rgba(255,255,255,0))]"></div>

      <div className="max-w-5xl mx-auto px-4">
        {/* HERO SECTION */}
        <section id="hero" className="min-h-[90vh] flex flex-col justify-center items-center text-center py-20">
          {profile?.hero_image_url && (
            <Image
              src={profile.hero_image_url}
              alt={profile?.name_es || username}
              width={192}
              height={192}
              className="rounded-full object-cover border-4 border-primary-500/30 shadow-xl mb-6"
            />
          )}
          <h1 className="text-4xl md:text-6xl font-bold text-dark-800 dark:text-dark-100">
            {profile?.greeting_es || 'Hola'},{' '}
            <span className="text-primary-600 dark:text-primary-400">
              {profile?.name_es || username}
            </span>
          </h1>
          {profile?.hero_title_es && (
            <p className="mt-4 text-lg md:text-xl text-dark-500 dark:text-dark-400 font-medium">
              {profile.hero_title_es}
            </p>
          )}
          {profile?.hero_subtitle_es && (
            <p className="mt-2 text-base text-dark-400 dark:text-dark-500 max-w-2xl">
              {profile.hero_subtitle_es}
            </p>
          )}

          {/* Social Links */}
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            {profile?.linkedin_url && profile?.is_linkedin_visible !== false && (
              <a href={profile.linkedin_url} target="_blank" rel="noopener" className="px-5 py-2.5 bg-dark-100 dark:bg-dark-800 hover:bg-dark-200 dark:hover:bg-dark-700 rounded-full text-sm font-medium transition">
                LinkedIn
              </a>
            )}
            {profile?.github_url && profile?.is_github_visible !== false && (
              <a href={profile.github_url} target="_blank" rel="noopener" className="px-5 py-2.5 bg-dark-100 dark:bg-dark-800 hover:bg-dark-200 dark:hover:bg-dark-700 rounded-full text-sm font-medium transition">
                GitHub
              </a>
            )}
            {profile?.email && (
              <a href={`mailto:${profile.email}`} className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-full text-sm font-medium transition">
                Contacto
              </a>
            )}
          </div>
        </section>

        {/* ABOUT SECTION */}
        {profile?.about_me_paragraphs?.length > 0 && (
          <section id="about" className="py-16 border-t border-dark-200 dark:border-dark-800">
            <h2 className="text-3xl font-bold text-dark-800 dark:text-dark-100 mb-8 text-center">Sobre Mí</h2>
            <div className="max-w-3xl mx-auto space-y-4 text-dark-600 dark:text-dark-300 text-lg leading-relaxed">
              {profile.about_me_paragraphs.map((p, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: p.es || p.en || '' }} />
              ))}
            </div>
          </section>
        )}

        {/* EXPERIENCE SECTION */}
        {experiences.length > 0 && (
          <section id="experience" className="py-16 border-t border-dark-200 dark:border-dark-800">
            <h2 className="text-3xl font-bold text-dark-800 dark:text-dark-100 mb-10 text-center">Experiencia</h2>
            <div className="max-w-3xl mx-auto space-y-8">
              {experiences.map((exp, i) => (
                <div key={i} className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-dark-800 dark:text-dark-100">{exp.role_es}</h3>
                  <p className="text-primary-600 dark:text-primary-400 font-medium">{exp.company_es}</p>
                  {exp.date_es && <p className="text-sm text-dark-400 dark:text-dark-500 mt-1">{exp.date_es}</p>}
                  {exp.description_es && <p className="mt-3 text-dark-600 dark:text-dark-300">{exp.description_es}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS SECTION */}
        {projects.length > 0 && (
          <section id="projects" className="py-16 border-t border-dark-200 dark:border-dark-800">
            <h2 className="text-3xl font-bold text-dark-800 dark:text-dark-100 mb-10 text-center">
              {profile?.hero_button1_text_es || 'Proyectos'}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project, i) => (
                <Link
                  key={i}
                  href={project.link_url || `/${username}/projects/${project.slug || project.id}`}
                  target={project.link_url ? '_blank' : '_self'}
                  className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-xl overflow-hidden hover:shadow-lg transition group"
                >
                  {project.image_url && (
                    <Image src={project.image_url} alt={project.title_es} width={400} height={200} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-dark-800 dark:text-dark-100 group-hover:text-primary-600 transition">
                      {project.title_es}
                    </h3>
                    {project.description_es && (
                      <p className="mt-2 text-sm text-dark-500 dark:text-dark-400 line-clamp-2">{project.description_es}</p>
                    )}
                    {project.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {project.technologies.map((tech, j) => (
                          <span key={j} className="px-2 py-0.5 text-xs bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* SKILLS SECTION - solo si tiene skills */}
        {skills.length > 0 && (
          <section id="skills" className="py-16 border-t border-dark-200 dark:border-dark-800">
            <h2 className="text-3xl font-bold text-dark-800 dark:text-dark-100 mb-10 text-center">Habilidades</h2>
            <div className="max-w-3xl mx-auto">
              {Object.entries(
                skills.reduce((acc, skill) => {
                  if (!acc[skill.category]) acc[skill.category] = []
                  acc[skill.category].push(skill)
                  return acc
                }, {})
              ).map(([category, categorySkills]) => (
                <div key={category} className="mb-6">
                  <h3 className="text-lg font-semibold text-dark-700 dark:text-dark-200 mb-3">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map((skill) => (
                      <span key={skill.id} className="px-4 py-2 bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-lg text-sm text-dark-700 dark:text-dark-300">
                        {skill.name}
                        {skill.proficiency && (
                          <span className="ml-2 text-xs text-dark-400">({skill.proficiency}%)</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FOOTER */}
        <footer className="py-10 border-t border-dark-200 dark:border-dark-800 text-center">
          <p className="text-sm text-dark-400 dark:text-dark-500">
            © {new Date().getFullYear()} {profile?.name_es || username}. Powered by{' '}
            <Link href="/" className="text-primary-600 hover:underline">PortafolioPRO</Link>
          </p>
        </footer>
      </div>
    </div>
  )
}
