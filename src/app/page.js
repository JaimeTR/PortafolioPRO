'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FiArrowRight, FiStar, FiShield, FiZap, FiUsers, FiGlobe, FiMessageCircle, FiLayers, FiCheck, FiChevronDown, FiPenTool } from 'react-icons/fi'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.7, ease: [0.25, 0.4, 0.25, 1] } })
}

const stagger = { visible: { transition: { staggerChildren: 0.12 } } }

const professions = [
  { icon: '🏥', name: 'Medicina', color: 'from-emerald-500/20 to-teal-500/20' },
  { icon: '💻', name: 'Ing. Sistemas', color: 'from-blue-500/20 to-indigo-500/20' },
  { icon: '⚖️', name: 'Derecho', color: 'from-amber-500/20 to-yellow-500/20' },
  { icon: '🏛️', name: 'Arquitectura', color: 'from-stone-500/20 to-orange-500/20' },
  { icon: '📊', name: 'Economía', color: 'from-green-500/20 to-emerald-500/20' },
  { icon: '💼', name: 'Admin. Empresas', color: 'from-violet-500/20 to-purple-500/20' },
  { icon: '🧠', name: 'Psicología', color: 'from-pink-500/20 to-rose-500/20' },
  { icon: '📚', name: 'Educación', color: 'from-sky-500/20 to-blue-500/20' },
]

const features = [
  { icon: <FiZap size={22} />, title: 'En Minutos', desc: 'Crea tu portafolio profesional en menos de 5 minutos sin escribir una línea de código.' },
  { icon: <FiPenTool size={22} />, title: '18+ Templates', desc: 'Dark, light, femeninos, personalizados. Diseños para cada profesión y estilo.' },
  { icon: <FiGlobe size={22} />, title: 'Link Personalizado', desc: 'Tu propio dominio: portafoliopro.com/tunombre. Comparte en un click.' },
  { icon: <FiMessageCircle size={22} />, title: 'Chatbot IA Premium', desc: 'Asistente virtual que responde sobre ti automáticamente a tus visitantes.' },
  { icon: <FiLayers size={22} />, title: 'Secciones Flexibles', desc: 'Experiencia, proyectos, habilidades, blog. Activa solo lo que necesites.' },
  { icon: <FiShield size={22} />, title: 'Seguro y Escalable', desc: 'JWT, cookies httpOnly, rate limiting. Tu información siempre protegida.' },
]

const plans = [
  { name: 'Gratis', price: '$0', period: 'siempre', icon: <FiStar size={20} />, features: ['3 Proyectos', '5 Secciones', 'Link personalizado', 'Dark/Light mode'], cta: 'Comenzar', href: '/register', popular: false },
  { name: 'Premium', price: '$29', period: 'mes', icon: <FiZap size={20} />, features: ['Proyectos ilimitados', 'Blog ilimitado', 'Chatbot IA', 'Dominio personalizado', '200 MB almacenamiento', 'Soporte prioritario'], cta: 'Empezar Premium', href: '/register', popular: true },
]

const testimonials = [
  { quote: 'Creé mi portafolio médico en 10 minutos. Mis pacientes ahora me encuentran más fácil.', author: 'Dra. María García', role: 'Cardióloga' },
  { quote: 'Como abogada necesitaba algo serio y profesional. PortafolioPRO lo logró.', author: 'Lic. Carmen Ruiz', role: 'Abogada Corporativa' },
  { quote: 'El chatbot IA es increíble. Responde consultas de clientes mientras duermo.', author: 'Ing. Pedro Sánchez', role: 'Desarrollador Senior' },
]

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0])
  const heroScale = useTransform(scrollY, [0, 600], [1, 0.95])
  const heroY = useTransform(scrollY, [0, 600], [0, 80])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#050510] text-white overflow-x-hidden" style={{ fontFamily: "'Poppins', 'Braze', sans-serif" }}>
      {/* NAV */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4 ${scrolled ? 'bg-[#050510]/80 backdrop-blur-xl border-b border-white/5' : ''}`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-black tracking-tight">
            Portafolio<span className="text-primary-500">PRO</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-white/60 hover:text-white transition hidden sm:block">Iniciar Sesión</Link>
            <Link href="/register"
              className="relative overflow-hidden group px-6 py-2.5 bg-primary-700 hover:bg-primary-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-primary-700/25 hover:shadow-primary-600/40">
              <span className="relative z-10">Crear Portafolio</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* HERO */}
      <motion.section style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="relative min-h-screen flex items-center justify-center px-4 pt-20 overflow-hidden">
        {/* Animated bg */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary-800/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '3s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-700/10 rounded-full blur-[150px]" />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 -z-5 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
            {/* Badge */}
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-5 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-sm text-white/70">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              +500 profesionales ya confían
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05]">
              Tu Portafolio{' '}
              <span className="bg-gradient-to-r from-primary-400 via-indigo-400 to-primary-300 bg-clip-text text-transparent animate-background-shine bg-[length:200%_100%]">
                Profesional
              </span>
              <br />en Minutos
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
              Crea un portafolio impactante con plantillas diseñadas para tu profesión.{' '}
              <span className="italic text-white/70">Sin código. Sin estrés. Solo resultados.</span>
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4 justify-center pt-4">
              <Link href="/register"
                className="group relative overflow-hidden px-8 py-4 bg-white text-primary-900 hover:text-white rounded-2xl font-bold text-lg transition-all shadow-2xl shadow-white/10 hover:shadow-primary-500/20">
                <span className="relative z-10 flex items-center gap-2">Crear Portafolio Gratis <FiArrowRight className="group-hover:translate-x-1 transition-transform" /></span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
              </Link>
              <a href="#features"
                className="px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-2xl font-semibold text-lg transition-all">
                Ver Features ↓
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30">
          <FiChevronDown size={28} />
        </motion.div>
      </motion.section>

      {/* PROFESSIONS */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={stagger} className="text-center mb-14">
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black">Templates para <span className="italic text-primary-400">cada profesión</span></motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-white/40 text-lg">Elige tu área y obtén plantillas diseñadas específicamente para ti.</motion.p>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {professions.map((p, i) => (
            <motion.div key={i} variants={fadeUp} custom={i}
              whileHover={{ scale: 1.03, y: -4 }}
              className={`group relative bg-gradient-to-br ${p.color} backdrop-blur-xl border border-white/5 rounded-3xl p-6 text-center cursor-pointer transition-all hover:border-white/20 hover:shadow-2xl`}>
              <span className="text-3xl">{p.icon}</span>
              <p className="mt-2 font-semibold text-white/80 group-hover:text-white transition-colors">{p.name}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FEATURES */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black">Todo lo que <span className="italic text-primary-400">necesitas</span></motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-white/40 text-lg">Herramientas profesionales para destacar en tu carrera.</motion.p>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div key={i} variants={fadeUp} custom={i}
              whileHover={{ y: -6 }}
              className="group bg-white/[0.03] backdrop-blur-xl border border-white/5 hover:border-primary-500/30 rounded-3xl p-7 transition-all hover:bg-white/[0.06] hover:shadow-2xl hover:shadow-primary-500/5">
              <div className="w-12 h-12 bg-primary-500/10 rounded-2xl flex items-center justify-center text-primary-400 mb-5 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black">Profesionales que <span className="italic text-primary-400">confían</span></motion.h2>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div key={i} variants={fadeUp} custom={i}
              className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-3xl p-7 relative">
              <div className="text-primary-400 text-4xl font-serif mb-4">&ldquo;</div>
              <p className="text-white/60 italic leading-relaxed mb-6">{t.quote}</p>
              <div className="border-t border-white/5 pt-4">
                <p className="font-bold text-white">{t.author}</p>
                <p className="text-sm text-white/40">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* PLANS */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black">Planes <span className="italic text-primary-400">simples</span></motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-white/40 text-lg">Empieza gratis. Sin tarjeta de crédito.</motion.p>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map((p, i) => (
            <motion.div key={i} variants={fadeUp} custom={i}
              whileHover={{ y: -4 }}
              className={`relative bg-white/[0.03] backdrop-blur-xl border rounded-3xl p-8 transition-all ${p.popular ? 'border-primary-500/40 shadow-2xl shadow-primary-500/10' : 'border-white/5 hover:border-white/20'}`}>
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-full text-xs font-bold">
                  Más Popular
                </div>
              )}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center text-primary-400">{p.icon}</div>
                <h3 className="text-xl font-bold">{p.name}</h3>
              </div>
              <div className="mb-6">
                <span className="text-5xl font-black">{p.price}</span>
                <span className="text-white/30 text-lg">/{p.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {p.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-white/50">
                    <FiCheck size={14} className="text-green-400 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link href={p.href}
                className={`block text-center py-3 rounded-xl font-semibold transition-all ${p.popular ? 'bg-gradient-to-r from-primary-700 to-indigo-700 hover:from-primary-600 hover:to-indigo-600 text-white shadow-lg' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
                {p.cta}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative overflow-hidden bg-gradient-to-br from-primary-800 via-indigo-900 to-violet-900 rounded-[3rem] p-12 md:p-20 text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-4">¿Listo para <span className="italic">destacar</span>?</h2>
            <p className="text-white/60 text-lg md:text-xl mb-8 max-w-xl mx-auto">Crea tu portafolio ahora. Sin código, sin complicaciones.</p>
            <Link href="/register"
              className="inline-flex items-center gap-2 px-10 py-4 bg-white text-primary-900 hover:bg-gray-100 rounded-2xl font-bold text-lg transition-all shadow-2xl hover:shadow-white/20">
              Crear Portafolio Gratis <FiArrowRight />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 px-4 py-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link href="/" className="text-xl font-black tracking-tight">
            Portafolio<span className="text-primary-400">PRO</span>
          </Link>
          <div className="flex gap-6 text-sm text-white/30">
            <Link href="/login" className="hover:text-white/60 transition">Iniciar Sesión</Link>
            <Link href="/register" className="hover:text-white/60 transition">Registrarse</Link>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
