export const Container = ({ children, id = '', className = '' }) => {
    return (
        <section className={`flex flex-col justify-center pt-16 md:pt-24 pb-8 md:pb-12 container mx-auto px-4 sm:px-6 md:min-h-[80vh] lg:min-h-screen ${className || 'lg:max-w-[740px]'}`} id={id}>
            {children}
        </section>
    )
}
