'use client'
import { motion } from 'framer-motion'

export const SectionTitle = ({ children, className = '' }) => {
    const isCentered = className.includes('text-center')
    
    return (
        <div className={`flex flex-col ${isCentered ? 'items-center text-center' : 'items-start text-left'} mb-6 ${className.replace(/text-center|md:text-center/g, '')}`}>
            <div className="relative inline-block">
                <h2 className="text-3xl font-black lg:text-5xl pb-2 inline-flex animate-background-shine bg-[linear-gradient(110deg,#334155,45%,#94a3b8,55%,#334155)] dark:bg-[linear-gradient(110deg,#cbd5e1,45%,#ffffff,55%,#cbd5e1)] bg-[length:250%_100%] bg-clip-text text-transparent">
                    {children}
                </h2>
                <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="h-[3px] rounded-full bg-gradient-to-r from-sky-400 to-sky-600 dark:from-sky-300 dark:to-sky-500 absolute bottom-0 left-0"
                />
            </div>
        </div>
    )
}
