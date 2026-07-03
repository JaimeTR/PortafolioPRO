export const PROJECTS = [
    {
        title: 'Portal Vitrina Colombia',
        title_en: 'Vitrina Colombia Portal',
        slug: 'portal-vitrina-colombia',
        category: 'Fullstack',
        category_en: 'Fullstack',
        date: '2022-06-15',
        content: {
            abstract:
                'Mediante el uso de tecnologías de Backend se construye un servicio API Rest con el propósito de permitir el consumo de los recursos en diferentes servicios, además se construye una interfáz del lado del cliente que permite la gestión de los recursos y otra para el usuario final con fin permitirle acceso a un portal inmobiliaro donde puede navegar por los diferentes tipos de inmuebles.',
            abstract_en:
                'Using backend technologies, a REST API service was built to allow resource consumption across different services. Additionally, client-side interfaces were created for admin resource management and for end users to access a real estate portal to browse different property types.',
            description:
                'Proyecto web fullstack que suple la necesidad de crear un gestor de contenidos autoadministrable y servir el contenido mediante servicios API los cuales son consumidos del lado del cliente, donde se construye una interfaz amigable para que el usuario final pueda navegar y visualizar los diferentes tipos de inmuebles. El sitio web tiene la funcionalidad de guardar en la sesión del usuario los inmuebles marcados como favoritos además de permitirle hacer búsquedas mediante filtro avanzado.',
            description_en:
                'Fullstack web project that provides a self‑managed CMS and serves content via API services consumed on the client side. A friendly interface lets end users browse and view different property types. The site supports saving favorite properties in the user session and offers advanced search filters.',
            technologies: [
                { name: 'MySQL', use: 'Usado para la gestión de base de datos', use_en: 'Used for database management' },
                { name: 'PHP', use: 'Enfocado en el lado del servidor', use_en: 'Server‑side focus' },
                { name: 'Laravel', use: 'Usado como Framework para trabajar con PHP', use_en: 'Framework for PHP development' },
                { name: 'JavaScript', use: 'Tecnología del lado del cliente', use_en: 'Client‑side technology' },
                { name: 'ReactJS', use: 'Librería usada para trabajar con JavaScript (Frontend)', use_en: 'JavaScript library (Frontend)' },
            ],
            features: {
                intro: '',
                intro_en: '',
                list: [
                    'Sisema de favoritos: Permite al usuario guardar inmueble en una sección de favoritos.',
                    'Filtro básico: Permite al usuario realizar búsquedas mediante filtro básico de precio, ciudad y estado.',
                    'Filtro avanzado: Permite al usuario realizar búsquedas mediante filtro avanzado de precio, ciudad, estado, tipo de inmueble, área y número de baños.',
                    'Detalles de inmueble: Permite al usuario visualizar los detalles de un inmueble',
                ],
                list_en: [
                    'Favorites system: Allows users to save properties in a favorites section.',
                    'Basic filter: Search by price, city, and status.',
                    'Advanced filter: Search by price, city, status, property type, area, and number of bathrooms.',
                    'Property details: View full details of a property.',
                ],
            },
            images: {
                cover: '/images/vitrina/cover.webp',
                mockup: '/images/vitrina/mockup.webp',
                responsive: '/images/vitrina/responsive.webp',
                screenshot: '/images/vitrina/screenshot.webp',
            },
        },
        link: 'https://colraices.com/vitrina-colombia',
        repo: '',
    },
    {
        title: 'Sitio web Colraices',
        title_en: 'Colraices Website',
        slug: 'sitio-web-colraices',
        category: 'Frontend',
        category_en: 'Frontend',
        date: '2022-05-30',
        content: {
            abstract:
                'Colraices es una empresa con más de 17 años en el mercado Colombiano, tras la pandemía, los directivos deciden hacer un cambio de la identidad corporativa e imagen de marca, a partir de allí se empieza la planeación del cambio del imagen del sitio web de la empresa.',
            abstract_en:
                'Colraices is a company with over 17 years in the Colombian market. After the pandemic, leadership decided to refresh the corporate identity and brand image, which led to planning a redesign of the company website.',
            description:
                'El equipo de diseño de la empresa construye todo el diseño del sitio web teniendo en cuenta las diferentes estrategías de UX/UI pensando siempre en la experiencia del usuario, aplicando desde luego toda la identidad de marca en cuanto a los colores de la compañia y empleando formas redondeadas y sombras, dando así un diseño novedoso pero simple. \nPara la construcción del sitio se emplean tecnologías como React principalmente, brindado así grandes facilidades al momento de construir las interacciones del usuario final, este sitio web tiene la particularidad de detectar el país de donde se conecta el usuario y dependiendo de esto, mostrar diferentes bloques de información. Mediante la construcción de componentes, se reduce en gran medida la escritura de código, pudiendo reutilizar estas piezas gráficas en las diferentes secciones donde se requieran, de este modo se hace más fácil la manipulación de eventos.',
            description_en:
                'The design team built the entire website with UX/UI strategies focused on user experience, applying brand identity through company colors, rounded shapes, and shadows—resulting in a fresh yet simple design.\nFor development, React was primarily used to simplify building user interactions. The site detects the user’s country via IP and shows different information blocks accordingly. Component‑based construction significantly reduces code duplication and makes event handling easier through reuse.',
            technologies: [
                {
                    name: 'PHP',
                    use: 'Utilizado del lado del servidor, encargado de detectar la ubicación del usuario.',
                    use_en: 'Server‑side; detects user location.',
                },
                { name: 'Laravel', use: 'Usado como Framework para trabajar con PHP', use_en: 'Framework for PHP' },
                { name: 'SASS', use: 'Aplica el diseño visual y responsive del sitio web.', use_en: 'Applies visual and responsive design.' },
                {
                    name: 'ReactJS',
                    use: 'Construcción de la interfaz gráfica del usuario, modularización mediante componentes.',
                    use_en: 'UI construction via components.',
                },
                { name: 'JavaScript', use: 'Tecnología del lado del cliente', use_en: 'Client‑side technology' },
            ],
            features: {
                intro: 'Principales característias y funcionalidades del proyecto.',
                intro_en: 'Main features and functionalities of the project.',
                list: [
                    'Imagen corporativa: Muestra al público objetivo una identidad de marca que se evidencia en logos y colores.',
                    'Geolocalización: Mediante la IP del cliente detecta su país de origen y en base a el, muestra información relevante.',
                    'Simulación de crédito: Permite al usuario generar una simulación de crédito para poder realizar una compra de un inmueble.',
                ],
                list_en: [
                    'Corporate image: Displays brand identity evident in logos and colors.',
                    'Geolocation: Detects the client IP to identify country and shows relevant information.',
                    'Credit simulation: Allows users to simulate financing for property purchase.',
                ],
            },
            images: {
                cover: '/images/colraices/cover.webp',
                mockup: '/images/colraices/mockup.webp',
                responsive: '/images/colraices/responsive.webp',
                screenshot: '/images/colraices/screenshot.webp',
            },
        },
        link: 'https://colraices.com',
        repo: '',
    },
    {
        title: 'momentum-app',
        title_en: 'Momentum App',
        slug: 'momentum-app',
        category: 'Fullstack',
        category_en: 'Fullstack',
        date: '2023-02-17',
        content: {
            abstract:
                'Agencia Momentum es una empresa que se dedica al brindar soluciones de marketing digital, en su proceso de innovación se decide crear una aplicación web cutyo principal objetivo es el de crear una interfaz gráfica que le permita a sus usuarios hacer uso de herramientas de IA como GPT-3, Dall-E-2 o Codex.',
            abstract_en:
                'Momentum Agency provides digital marketing solutions. As part of innovation, a web app was created to offer an interface for users to leverage AI tools like GPT‑3, DALL·E 2, and Codex.',
            description:
                'La aplicación está pensada para que los usuarios puedan generar textos de copys, ilustraciones y piezas de código haciendo uso de herramientas de la inteligencia artificial, para ello se diseña y construye una interfaz que le permite al usuario tener las 3 herramientas en un mismo lugar y permitiendole tener un historial de sus consultas. \nEl proyecto está construido bajo el stack MERN usando ReactJS para el desarrollo de la inerfaz y NodeJS para la construcción del backend. Se emplean algunos de las herramientas principales de ReactJS como Context API, los hooks y enrutamiento  por medio de React Router, dispone de secciones como perfil de usuario, historial, generar textos e imágenes. La comunicación con el backend es mediante tecnología API.',
            description_en:
                'The app lets users generate copy text, illustrations, and code using AI. A single interface provides access to all three tools and maintains a history of user queries.\nBuilt on the MERN stack — ReactJS for the UI and NodeJS for the backend. It uses React Context API, hooks, and routing via React Router, and includes sections like user profile, history, and generators for text and images. Backend communication is via APIs.',
            technologies: [
                {
                    name: 'MongoDB',
                    use: 'Usado para la adminitración de bases de datos.',
                    use_en: 'Used for database administration.',
                },
                { name: 'Express.js', use: 'Implementación de construcción de API.', use_en: 'API implementation.' },
                {
                    name: 'ReactJS',
                    use: 'Construcción de la interfaz gráfica del usuario, modularización mediante componentes.',
                    use_en: 'UI construction via components.',
                },
                { name: 'NodeJS', use: 'Configuración del servidor web.', use_en: 'Web server configuration.' },
            ],
            features: {
                intro: 'Esta aplicación consiste en un login sencillo mediante el cual accede a las principales de funciones que le permiten hacer consultas a modelos de inteligencia articial.',
                intro_en: 'A simple login grants access to the main functions to query AI models.',
                list: [
                    'Autenticación: Sistema que permite al usuario crear una nueva cuenta o inciar sesión con una cuenta existente.',
                    'Generar textos: Se conecta al modelo GPT-3.5 para generar textos de acuerdo con un input.',
                    'Generar imágenes: Permite generar ilustraciones de acuerdo a un input dado.',
                    'Filtro por precio',
                    'Generar código: Genera código de acuerdo a las instrucciones dadas.',
                ],
                list_en: [
                    'Authentication: Allows users to create an account or sign in.',
                    'Generate texts: Connects to GPT‑3.5 to generate text from a given input.',
                    'Generate images: Creates illustrations based on a given input.',
                    'Price filter.',
                    'Generate code: Produces code according to given instructions.',
                ],
            },
            images: {
                cover: '/images/momentum/cover.webp',
                mockup: '/images/momentum/mockup.webp',
                responsive: '/images/momentum/responsive.webp',
                screenshot: '/images/momentum/screenshot.webp',
            },
        },
        link: 'https://agenciamomentum.co',
        repo: 'https://github.com/JaimeTR',
    },
    {
        title: 'Instapets PWA',
        title_en: 'Instapets PWA',
        slug: 'instapets-pwa',
        category: 'Frontend',
        category_en: 'Frontend',
        date: '2022-02-30',
        content: {
            abstract:
                'Aplicación Web Progresiva inspirada en instagram pero enfocada en mascotas, como lo indica el tipo de aplicación web, esta se puede instalar en el teléfono móvil y simular el funcionamiento de una App Móvil, cuenta con tecnologías de backend y frontend.',
            abstract_en:
                'Progressive Web App inspired by Instagram but focused on pets. As a PWA, it can be installed on a mobile phone and behaves like a mobile app, using both backend and frontend technologies.',
            description:
                'El proyecto consiste en mostrar imágenes de mascotas las cuales el usuario podrá visualizar sin necesidad de estar autenticado, podrá dar like siempre y cuando esté registrado y haya iniciado sesión. Está aplicación tiene la particularidad de ser una PWA (Progressive Web Application) lo cual le otorga la funcionalidad de instalarse en un dispositivo móvil conservando la funcionalidad pero funcionando casi como una aplicación móvil nativa. \nEste proyecto en particular incluye una estructura mediante componentes agrupando el componente y sus estilos en la misma carpeta haciendo uso de Styled Components, además por medio de contenedores se crea la funcionalidad de realizar las peticiones al backend gracias a GraphQL. El proyecto tambien cuenta el uso de Hooks y Custom Hooks para le manejo de estado global de la aplicación y manipular la sesión de usuario. Por último los componentes se agrupan en páginas que son las que finalmente se renderizan indicando cada sección de la aplicación.',
            description_en:
                'The project displays pet images that users can view without authentication; liking requires registration and sign‑in. As a PWA, it can be installed on a mobile device, maintaining functionality while behaving almost like a native mobile app.\nThe project uses a component structure with component code and styles grouped via Styled Components. Containers handle backend requests through GraphQL. It uses Hooks and Custom Hooks to manage global state and user session. Finally, components are grouped into pages representing each app section.',
            technologies: [
                {
                    name: 'ReactJS',
                    use: 'Desarrollo del frontend (parte visual)',
                    use_en: 'Frontend development (visual part).',
                },
                { name: 'NodeJS', use: 'Desarrollo del backend (Lógica de la aplicación)', use_en: 'Backend development (application logic).' },
                {
                    name: 'Express.JS',
                    use: 'Configuración de API ',
                    use_en: 'API configuration.',
                },
                { name: 'GraphQL', use: 'Para la interacción con los datos de la API', use_en: 'API data interaction.' },
            ],
            features: {
                intro: 'La apllicación al estar conectada con un backend cuenta con diferentes funcones, listaré a continuación algunas de ellas.',
                intro_en: 'Connected to a backend, the app offers various functions; here are some.',
                list: [
                    'Autenticvación: Sistema que permite al usuario crear una nueva cuenta o inciar sesión con una cuenta existente.',
                    'Favoritos: Permite al usuario darle like a una foto y guardarle en una sección de favortios.',
                    'Filtro: Permite al usuario filtrar las publicaciónes por categorías.',
                ],
                list_en: [
                    'Authentication: Allows users to create a new account or sign in with an existing account.',
                    'Favorites: Lets users like a photo and save it to a favorites section.',
                    'Filter: Enables users to filter posts by categories.',
                ],
            },
            images: {
                cover: '/images/instapets/cover.webp',
                mockup: '/images/instapets/mockup.webp',
                responsive: '/images/instapets/responsive.webp',
                screenshot: '/images/instapets/screenshot.webp',
            },
        },
        link: 'https://instapets-mu.vercel.app/',
        repo: 'https://github.com/JaimeTR',
    },
    {
        title: 'CMS de inmuebles',
        title_en: 'Real Estate CMS',
        slug: 'cms-inmuebles',
        category: 'Backend',
        category_en: 'Backend',
        date: '2021-07-23',
        content: {
            abstract:
                'Este proyecto tiene como objetivo brindar a los usuarios, ya sean desarrolladores externos o administradores de contenidos, una solución completa y eficiente para la gestión de inmuebles. A través de la combinación de Laravel y MySQL, se logra desarrollar un sistema de alta calidad que potenciará la administración y promoción de propiedades de manera efectiva.',
            abstract_en:
                'This project aims to provide users—whether external developers or content admins—with a complete and efficient solution for managing properties. By combining Laravel and MySQL, it delivers a high‑quality system to effectively enhance property administration and promotion.',
            description:
                'En este emocionante proyecto, me embarqué en la creación de un sistema integral de gestión de inmuebles. La misión es desarrollar un sólido API REST y un potente Sistema de Gestión de Contenidos (CMS) que permitan a los usuarios listar, buscar y administrar propiedades de manera eficiente y efectiva.',
            description_en:
                'In this project, I built an integral property management system. The goal is to develop a robust REST API and a powerful Content Management System (CMS) that allow users to list, search, and manage properties efficiently and effectively.',
            technologies: [
                {
                    name: 'Laravel',
                    use: 'Framework de desarrollo de aplicaciones web',
                    use_en: 'Web application framework',
                },
                { name: 'MySQL', use: 'Gestion de base de datos', use_en: 'Database management' },
                {
                    name: 'Blade',
                    use: 'Motor de plantillas HTML',
                    use_en: 'HTML templating engine',
                },
                { name: 'PHP', use: 'Lenguaje de programación del lado del servidor', use_en: 'Server‑side programming language' },
            ],
            features: {
                intro: 'Estas son algunas de las principales caracerísticas y funcionaldiad del proyecto.',
                intro_en: 'Here are some of the main features and functionality of the project.',
                list: [
                    'API REST de Inmuebles: Desarrollaremos un API REST robusto basado en Laravel que permitirá acceder y gestionar datos de inmuebles de manera sencilla.',
                    'CMS de Inmuebles: El sistema gestión de contenidos personalizado utilizando Laravel, ofrecerá una interfaz intuitiva para que los administradores puedan agregar, editar y eliminar listados de propiedades.',
                    'Base de Datos MySQL: Se garantiza un rendimiento óptimo y la capacidad de almacenar grandes volúmenes de información sobre propiedades.',
                    'Autenticación y Seguridad: Medidas de seguridad sólidas, incluyendo autenticación de usuarios y autorizaciones, para garantizar que los datos de inmuebles estén protegidos y accesibles solo para usuarios autorizados.',
                ],
                list_en: [
                    'Properties REST API: A robust Laravel‑based REST API to access and manage property data easily.',
                    'Real Estate CMS: A customized content management system with an intuitive interface to add, edit, and delete listings.',
                    'MySQL Database: Ensures optimal performance and the ability to store large volumes of property information.',
                    'Authentication and Security: Strong security measures including user authentication and authorization to protect data.',
                ],
            },
            images: {
                cover: '/images/cms-vc/cover.webp',
                mockup: '/images/cms-vc/mockup.webp',
                responsive: '/images/cms-vc/responsive.webp',
                screenshot: '/images/cms-vc/screenshot.webp',
            },
        },
        link: '',
        repo: '',
    },
]
