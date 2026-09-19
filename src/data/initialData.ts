import { Project, Experience, Skill, Education, Certification, Wallpaper, DesktopIconItem, NotificationItem } from '../types';

export const INITIAL_PROJECTS: Project[] = [
   {
id: 'proj-1',
title: 'Abhishek OS',
slug: 'abhishek-os',
number: '01',
short_description: 'A browser-based developer workstation and interactive portfolio designed as a fully functional web operating system.',
long_description: 'Abhishek OS is an interactive Windows/macOS-inspired web operating system that transforms a traditional developer portfolio into an immersive desktop experience. It combines portfolio content with a virtual desktop, window management, application launcher, universal search, file explorer, browser, AI developer assistant, developer tools, media applications, games, productivity utilities, authentication, persistent state, and backend-powered services. The project demonstrates advanced frontend architecture, state management, API integration, authentication, database connectivity, UX engineering, and full-stack application development.',
technologies: [
'React.js',
'TypeScript',
'Vite',
'Tailwind CSS',
'Node.js',
'Express.js',
'Supabase',
'Gemini AI',
'REST APIs',
'GitHub',
'Vercel',
'Render'
],
category: 'Full-Stack & AI',
year: '2026',
thumbnail_url: '/abhisheknewport-3.webp',
gallery: [
'/abhisheknewport-3.webp','/abhisheknewport-2.webp','/abhisheknewport-1.webp',

],
live_url: 'https://abhishek-os-seven.vercel.app/',
github_url: 'https://github.com/Abhishekkuntare/abhishek-os',
featured: true,
status: 'Completed',
challenges: 'Building a browser-based operating-system experience with independent applications, multi-window interactions, persistent desktop state, application lifecycle management, AI capabilities, authentication, backend services, and responsive behavior while maintaining a consistent and performant user experience.',
solution: 'Designed a modular application architecture where desktop applications operate as independent modules within a centralized window-management and state-management system. Implemented reusable UI components, application registration, persistent state, backend API services, authentication, Supabase integration, AI-powered functionality, controlled developer tools, and deployment-ready frontend and server configurations.',
results: 'Created an immersive browser-based developer workstation that combines an interactive desktop, portfolio, productivity tools, AI features, developer utilities, media applications, games, and system controls in a single web application. The architecture is extensible, allowing new applications and experiences to be added without rebuilding the core desktop environment.',
sort_order: 2,
created_at: '2026-09-13'
   },
  {
    id: 'proj-2',
    title: 'KrishiMitra AI',
    slug: 'krishimitra-ai',
    number: '01',
    short_description: 'AI-powered agricultural platform for intelligent crop recommendations and disease diagnosis.',
    long_description: 'KrishiMitra AI is an AI-powered agricultural web application engineered to empower farmers with data-driven agronomic intelligence. It provides localized crop recommendations, real-time disease identification assistance using image analysis, voice-activated interactions, and context-aware advice driven by LLM pipelines.',
    technologies: ['Python', 'Next.js', 'OpenAI APIs', 'React.js', 'GitHub', 'Vercel'],
    category: 'AI & Full-Stack',
    year: '2024',
    thumbnail_url: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&auto=format&fit=crop&q=80'
    ],
    live_url: 'https://krishimitra-ai.vercel.app',
    github_url: 'https://github.com/abhishekkuntare/krishimitra-ai',
    featured: true,
    status: 'Completed',
    challenges: 'Designing multilingual voice and image-based diagnosis workflows accessible to non-technical users under constrained network conditions.',
    solution: 'Implemented asynchronous LLM streaming with client-side image compression and adaptive speech synthesis with fallback caching.',
    results: 'Enabled instant crop recommendations and high-accuracy diagnostic feedback with sub-second API round-trips.',
    sort_order: 1,
    created_at: '2024-05-15'
  },
  {
    id: 'proj-3',
    title: 'Amba Motors - Garage',
    slug: 'amba-motors',
    number: '02',
    short_description: 'Automobile garage information portal with service booking, interactive maps, and WhatsApp chatbot.',
    long_description: 'Comprehensive digital portal for Amba Motors automotive workshop. Features modern responsive service catalogs, Google Maps location guidance, one-tap WhatsApp appointment scheduling, interactive garage chatbot, and transparent pricing cards.',
    technologies: ['React.js', 'Next.js', 'TypeScript', 'HTML5', 'CSS3', 'Google Maps API'],
    category: 'Client Web Platform',
    year: '2023 - 2024',
    thumbnail_url: 'https://media.licdn.com/dms/image/v2/D562DAQHi_BQEMPjMvQ/profile-treasury-image-shrink_1280_1280/B56aBSDG7iGsAY-/0/1788082941929?e=1789959600&v=beta&t=Zuyayhzfxe-ZEC9cxXe6bLTvFLqAh064sx1wfIx0J7E',
    gallery: [
      'https://media.licdn.com/dms/image/v2/D562DAQHi_BQEMPjMvQ/profile-treasury-image-shrink_1280_1280/B56aBSDG7iGsAY-/0/1788082941929?e=1789959600&v=beta&t=Zuyayhzfxe-ZEC9cxXe6bLTvFLqAh064sx1wfIx0J7E',
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80'
    ],
    live_url: 'https://ambamotors.vercel.app',
    github_url: 'https://github.com/abhishekkuntare/amba-motors',
    featured: true,
    status: 'Completed',
    challenges: 'Structuring service listings and inquiry flows for rapid mobile interaction without friction for drivers on the road.',
    solution: 'Designed an intuitive mobile-first interface with direct WhatsApp deep-linking and dynamic Google Maps location tracking.',
    results: 'Streamlined garage appointment inquiries by 60% with high customer satisfaction.',
    sort_order: 2,
    created_at: '2024-02-10'
  },
  {
    id: 'proj-4',
    title: 'CraveVerse – Food Discovery & Marketplace',
    slug: 'craveverse',
    number: '03',
    short_description: 'Dynamic food discovery platform with dish exploration, reels, smart cart, and live order tracking.',
    long_description: 'Interactive culinary marketplace designed for modern food discovery. Features engaging short-form video reels for popular dishes, localized restaurant search, real-time cart and checkout flow, Gemini AI dish recommendations, and mock delivery tracking telemetry.',
    technologies: ['React.js', 'TypeScript', 'Tailwind CSS', 'Vercel', 'GitHub', 'Gemini AI'],
    category: 'FoodTech / E-Commerce',
    year: '2024',
    thumbnail_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'
    ],
    live_url: 'https://craveverse.vercel.app',
    github_url: 'https://github.com/abhishekkuntare/craveverse',
    featured: true,
    status: 'Completed',
    challenges: 'Handling smooth media playback in video reels alongside responsive cart updates and dish filter operations.',
    solution: 'Engineered optimistic state management, lazy video preloading, and AI-driven cuisine matching algorithms.',
    results: 'Delivered an engaging food exploration feed with 60fps scrolling and instantaneous filter transitions.',
    sort_order: 3,
    created_at: '2024-07-20'
  },
  {
  id: 'proj-5',
  title: 'ABHISHEK OS',
  slug: 'abhishek-os',
  number: '05',
  short_description: 'A Windows desktop application delivering a modern macOS-inspired developer workstation with AI tools, productivity apps, workspaces, widgets, and interactive window management.',
  long_description: 'ABHISHEK OS is an independent installable desktop application built with Electron, React, and TypeScript. It provides a highly interactive desktop environment with a custom application launcher, dock, draggable and resizable windows, Spotlight-style search, workspaces, widgets, developer tools, productivity applications, AI capabilities, personalization, glassmorphism, 3D depth, and smooth spatial animations. Designed as a personal developer workstation, the project combines desktop interaction patterns, productivity workflows, and modern UI engineering into a unified Windows experience.',
  technologies: [
    'Electron',
    'React.js',
    'TypeScript',
    'JavaScript',
    'HTML5',
    'CSS3',
    'Tailwind CSS',
    'Framer Motion',
    'Node.js',
    'REST APIs',
    'AI Integration'
  ],
  category: 'Desktop Application',
  year: '2025 - 2026',
  thumbnail_url: '/abhishekosweb1.png',
  gallery: [
    '/abhishekosweb1.png',
    '/abhishekosweb2.png',
    '/abhishekosweb3.png',
    '/abhishekosweb4.png',
    '/abhishekosweb5.png',
  ],
  live_url: 'https://abhishek-operating-system.netlify.app/',
  github_url: 'https://github.com/Abhishekkuntare',
  featured: true,
  status: 'Completed',
  challenges: 'Creating a fluid desktop-like environment inside a single application while managing multiple interactive windows, focus states, dragging, resizing, workspaces, widgets, application state, responsive layouts, and complex UI interactions without sacrificing performance.',
  solution: 'Built a modular Electron and React desktop architecture with reusable application windows, centralized OS state management, spatial desktop interactions, dynamic application launching, dock and search systems, workspace management, customizable widgets, animated glass interfaces, and integrated productivity and AI capabilities.',
  results: 'Created a fully interactive personal developer workstation experience that combines desktop computing patterns, developer utilities, AI-powered workflows, productivity applications, and modern spatial UI into a unified Windows application.',
  sort_order: 3,
  created_at: '2026-09-18'
},
{
  id: 'proj-15',
  title: 'Abhishek Digital Solutions & Technology',
  slug: 'abhishek-digital-solutions-technology',
  number: '15',
  short_description: 'Modern digital solutions platform offering websites, web applications, AI solutions, automation, and technology services for businesses.',
  long_description: 'Abhishek Digital Solutions & Technology is a modern digital solutions platform designed to present technology services, web development, AI solutions, automation, and digital experiences for businesses across multiple industries. The platform combines a premium agency-style interface with service discovery, industry-focused solutions, modern visual sections, responsive layouts, and conversion-oriented presentation. It demonstrates how a technology service brand can communicate a broad range of digital capabilities through a polished and scalable web experience.',
  technologies: [
    'React.js',
    'JavaScript',
    'HTML5',
    'CSS3',
    'Responsive Web Design',
    'UI/UX',
    'AI Integration',
    'Web Development',
    'Git',
    'GitHub',
    'Vercel'
  ],
  category: 'Technology & Business',
  year: '2026',
  thumbnail_url: '/abhishekbusiness-1.webp',
  gallery: [
    '/abhishekbusiness-1.webp',
    '/abhishekbusiness-2.webp',
    '/abhishekbusiness-3.png'
  ],
  live_url: 'https://abhishek-digital-solutions-tech.vercel.app/',
  github_url: 'https://github.com/Abhishekkuntare/Abhishek-Digital-Solutions-Technology',
  featured: true,
  status: 'Completed',
  challenges: 'Presenting a broad range of digital services and technology capabilities in a single professional platform while keeping the experience visually engaging, easy to navigate, responsive, and focused on different business and industry requirements.',
  solution: 'Designed and developed a modern agency-style web experience with structured service and industry sections, reusable UI components, responsive layouts, strong visual hierarchy, interactive elements, and technology-focused content to clearly communicate digital solutions and capabilities.',
  results: 'Created a professional digital technology platform that showcases web development, AI, automation, and digital solution capabilities through a modern business-focused interface. The project demonstrates frontend development, responsive UI/UX, service presentation, personal branding, and the ability to build technology platforms around real-world business use cases.',
  sort_order: 15,
  created_at: '2026-09-1'
},
  {
id: 'proj-14',
title: 'Homebuilders',
slug: 'homebuilders',
number: '05',
short_description: 'Modern real-estate and homebuilder platform for showcasing premium properties, residential projects, and construction services.',
long_description: 'Homebuilders is a modern, responsive real-estate and homebuilding web application designed to create a premium digital presence for residential property businesses. The platform presents properties, residential projects, locations, and construction services through an immersive and intuitive interface. Built with React, TypeScript, and Vite, the application focuses on reusable components, responsive layouts, polished visual design, smooth interactions, and production-ready frontend architecture across desktop, tablet, and mobile devices.',
technologies: [
'React.js',
'TypeScript',
'Vite',
'HTML5',
'CSS3',
'Node.js',
'npm',
'Git',
'GitHub'
],
category: 'Real Estate & Web',
year: '2026',
thumbnail_url: '/house-1.webp',
gallery: [
'/house-1.webp',
'/house-2.webp',
'/house-3.webp'
],
live_url: 'https://homebuilders-neon.vercel.app/',
github_url: 'https://github.com/Abhishekkuntare/homebuilders',
featured: true,
status: 'Completed',
challenges: 'Creating a premium real-estate experience that effectively presents properties, residential projects, locations, and construction services while maintaining visual consistency, responsive behavior, and smooth interactions across different screen sizes.',
solution: 'Developed a component-driven React architecture with TypeScript and Vite, using reusable UI sections, responsive layouts, structured property and project content, location-focused information, and optimized frontend interactions to deliver a consistent experience across desktop, tablet, and mobile devices.',
results: 'Delivered a polished and responsive real-estate platform that provides an intuitive way to explore residential projects, properties, and homebuilding services while demonstrating modern frontend architecture, reusable React components, responsive UI development, and production-ready web development practices.',
sort_order: 14,
created_at: '2026-09-03'
},
{
id: 'proj-6',
title: 'PULSE — Premium Fitness Club',
slug: 'pulse-fitness-club',
number: '06',
short_description: 'Premium fitness club platform featuring training programs, fitness reels, trainer workflows, member experiences, and administrative dashboards.',
long_description: 'PULSE is a modern, premium fitness club web application designed around high-performance training, personal coaching, fitness programs, community engagement, and member management. The platform combines a futuristic athletic visual identity with responsive UI, animated statistics, interactive fitness reels, training programs, trainer workflows, member experiences, and an administrative management portal. Built with React, TypeScript, Vite, and Tailwind CSS, PULSE demonstrates advanced UI engineering, responsive design, component architecture, animation, interactive dashboards, and scalable frontend application development.',
technologies: [
'React.js',
'TypeScript',
'Vite',
'Tailwind CSS',
'Motion',
'Lucide React',
'JavaScript',
'HTML5',
'CSS3',
'Git',
'GitHub'
],
category: 'Fitness & Web',
year: '2026',
thumbnail_url: 'pulse-1.webp',
gallery: [
'pulse-1.webp',
'pulse-2.png',
'pulse-3.webp'
],
live_url: 'https://pulse-fitness-club-three.vercel.app/',
github_url: 'https://github.com/Abhishekkuntare/pulse-fitness-club',
featured: true,
status: 'Completed',
challenges: 'Creating a premium fitness experience that combines a visually demanding athletic design with interactive dashboards, animated statistics, fitness video content, trainer workflows, and administrative functionality while maintaining responsive performance across mobile, tablet, and desktop devices.',
solution: 'Built a modular React and TypeScript architecture using reusable components, responsive Tailwind utilities, Motion animations, Intersection Observer, requestAnimationFrame-based statistics, interactive modals, fitness video integration, trainer and admin portals, and structured application state to create a scalable fitness platform experience.',
results: 'Delivered a high-end responsive fitness platform with animated statistics, workout reels, structured training programs, trainer management workflows, member-focused experiences, and an administrative maintenance system. The project demonstrates advanced frontend development, responsive UX engineering, animation, dashboard development, and scalable React architecture.',
sort_order: 6,
created_at: '2026-09-06'
},

{
id: 'proj-7',
title: 'Aura Atelier — AI Fashion Studio',
slug: 'aura-atelier-ai',
number: '07',
short_description: 'AI-powered fashion studio for virtual try-on, intelligent styling, digital wardrobes, and immersive outfit discovery.',
long_description: 'Aura Atelier is a next-generation AI-powered fashion platform designed to reimagine the online fashion experience through virtual try-on, AI-assisted styling, outfit discovery, digital wardrobes, and interactive fashion interfaces. The application combines a futuristic luxury-fashion aesthetic with responsive UI/UX, allowing users to explore garments, create personalized looks, manage wardrobes and wishlists, experiment with outfit combinations, and interact with an AI-inspired fashion stylist across desktop, tablet, and mobile devices.',
technologies: [
'React.js',
'TypeScript',
'Vite',
'Tailwind CSS',
'JavaScript',
'AI Integration',
'REST APIs',
'Lucide React',
'Motion',
'HTML5',
'CSS3',
'Git',
'GitHub'
],
category: 'AI & Fashion',
year: '2026',
thumbnail_url: '/auraweb-1.png',
gallery: [
'/auraweb-1.png',
'/auraweb2.webp',
'aura-3.webp'
],
live_url: 'https://aura-atelier-ai.vercel.app/',
github_url: 'https://github.com/Abhishekkuntare/aura-atelier-ai',
featured: true,
status: 'Completed',
challenges: 'Designing an immersive luxury-fashion experience that combines AI-powered interactions, virtual try-on concepts, digital wardrobe management, outfit discovery, shopping workflows, and responsive navigation without compromising the premium visual identity across different devices.',
solution: 'Built a modular React and TypeScript architecture with responsive Tailwind layouts, reusable fashion components, interactive styling workflows, virtual try-on interfaces, digital wardrobe and wishlist experiences, multi-currency preferences, keyboard-driven garment search, animated interactions, and tactile audio feedback.',
results: 'Created an immersive AI-fashion studio that combines virtual try-on, AI-inspired styling, outfit creation, wardrobe management, garment discovery, wishlist and shopping experiences, and personalized aesthetic preferences into a unified responsive fashion platform.',
sort_order: 7,
created_at: '2026-09-08'
},
{
  id: 'proj-8',
  title: 'SOLEVA — Future Wear',
  slug: 'soleva-future-wear',
  number: '08',
  short_description: 'Premium futuristic footwear e-commerce experience with immersive product discovery, shopping interactions, and AI-inspired fashion experiences.',
  long_description: 'SOLEVA — Future Wear is a premium futuristic footwear e-commerce web experience designed around cinematic product presentation and modern digital shopping. The platform showcases shoes, sneakers, sliders, chappals, sandals, sports footwear, collections, deals, trending products, and new arrivals through a responsive and visually immersive interface. It combines glassmorphism, futuristic typography, gradient effects, smooth animations, wishlist and cart interactions, product search, responsive navigation, and AI-inspired style recommendations to create a next-generation footwear shopping experience.',
  technologies: [
    'React.js',
    'TypeScript',
    'Vite',
    'Tailwind CSS',
    'Lucide React',
    'Google Fonts',
    'Plus Jakarta Sans',
    'Space Grotesk',
    'Syne',
    'HTML5',
    'CSS3',
    'Git',
    'GitHub'
  ],
  category: 'E-Commerce & Fashion',
  year: '2026',
  thumbnail_url: '/shoes-1.png',
  gallery: [
    '/shoes-1.png',
    '/shoes-2.webp',
    '/shoes-3.png'
  ],
  live_url: 'https://soleva-premium-futuristic-footwear.vercel.app/',
  github_url: 'https://github.com/Abhishekkuntare/SOLEVA-premium-futuristic-footwear.-',
  featured: true,
  status: 'Completed',
  challenges: 'Creating a premium footwear shopping experience that feels cinematic and futuristic while supporting multiple product categories, responsive layouts, product discovery, cart and wishlist interactions, promotional sections, accessibility, and smooth performance across mobile, tablet, and desktop devices.',
  solution: 'Developed a component-driven React and TypeScript architecture using Vite and Tailwind CSS, with reusable product sections, responsive navigation, shopping interactions, search interfaces, wishlist and cart functionality, futuristic visual effects, responsive breakpoints, accessible controls, smooth animations, and structured product presentation.',
  results: 'Delivered a polished futuristic footwear e-commerce experience that combines premium visual design with practical shopping interactions. SOLEVA demonstrates modern React development, responsive UI engineering, e-commerce UX, reusable component architecture, accessibility-conscious design, and an extensible foundation for future AI recommendations, payments, inventory, authentication, and order management.',
  sort_order: 8,
  created_at: '2026-09-12'
},

{
  id: 'proj-9',
  title: 'RakhiVerse',
  slug: 'rakhiverse',
  number: '09',
  short_description: 'Interactive digital memory experience celebrating the sibling bond through photos, games, music, poetry, and emotional storytelling.',
  long_description: 'RakhiVerse is an interactive digital experience created to celebrate the special bond between siblings through memories, emotions, laughter, music, games, photographs, poetry, and personalized surprises. Designed like a digital memory book rather than a traditional website, the experience guides users through interactive chapters featuring a memory gallery, photo puzzle, emotional soundtrack, sibling quotes, random memory machine, and a final video gift. The journey concludes with an animated Raksha Bandhan celebration and an emotional personalized reveal.',
  technologies: [
    'Next.js',
    'React',
    'TypeScript',
    'CSS',
    'Lucide React',
    'Vercel Analytics',
    'HTML5',
    'Git',
    'GitHub'
  ],
  category: 'Interactive Experience',
  year: '2026',
  thumbnail_url: '/rakhi-1.png',
  gallery: [
    '/rakhi-1.png',
    '/rakhi-3.webp',
    '/rakhi-2.png'
  ],
  live_url: 'https://rakhi-verse.vercel.app/',
  github_url: 'https://github.com/Abhishekkuntare/RakhiVerse',
  featured: true,
  status: 'Completed',
  challenges: 'Creating an emotionally engaging digital experience that feels like a personal memory book while combining photographs, interactive puzzles, music, animations, video, celebrations, and personalized storytelling into one smooth and responsive journey.',
  solution: 'Built the experience using Next.js, React, and TypeScript with a chapter-based interactive structure, reusable components, responsive layouts, smooth transitions, interactive memory puzzles, multimedia integration, animated celebrations, emotional reveals, and carefully designed micro-interactions to create a cohesive storytelling experience.',
  results: 'Created a memorable interactive sibling experience that transforms personal photographs, music, games, poetry, video, and celebration effects into a digital journey. RakhiVerse demonstrates creative frontend development, interactive storytelling, responsive UI/UX, multimedia integration, animation, and experience-focused web design.',
  sort_order: 9,
  created_at: '2026-08-26'
},
{
  id: 'proj-10',
  title: 'Clacko — How Fast Can You Go?',
  slug: 'clacko',
  number: '10',
  short_description: 'Modern interactive typing platform for improving typing speed, accuracy, consistency, and performance through customizable practice sessions.',
  long_description: 'Clacko is a modern and interactive typing practice platform inspired by fast-paced typing experiences, designed to help users improve speed, accuracy, consistency, and typing flow. The platform provides real-time WPM and accuracy tracking, multiple test modes, customizable typing sessions, performance statistics, typing history, profiles, notifications, and interactive visual effects. With features such as themes, punctuation and numbers modes, Zen mode, typing combos, keyboard animations, particles, and the CLACK! easter egg, Clacko transforms traditional typing practice into an engaging and personalized experience.',
  technologies: [
    'Next.js',
    'React',
    'TypeScript',
    'Tailwind CSS',
    'CSS Animations',
    'Lucide React',
    'JavaScript',
    'ESLint',
    'PostCSS',
    'Vercel',
    'Vercel Analytics',
    'Git',
    'GitHub'
  ],
  category: 'Productivity & Web',
  year: '2026',
  thumbnail_url: '/clacko-1.png',
  gallery: [
    '/clacko-1.png',
    '/clacko-2.webp',
    '/clacko-3.webp'
  ],
  live_url: 'https://clacko.vercel.app/',
  github_url: 'https://github.com/Abhishekkuntare/Clacko',
  featured: true,
  status: 'Completed',
  challenges: 'Building a responsive real-time typing experience that accurately tracks WPM, accuracy, errors, consistency, progress, and test completion while supporting multiple modes, customization options, history tracking, and highly interactive visual feedback.',
  solution: 'Developed a component-driven Next.js and React architecture with TypeScript and Tailwind CSS, implementing real-time typing metrics, configurable time and word-based tests, custom typing modes, performance history, profile statistics, notifications, responsive layouts, and animated visual feedback including typing particles, keyboard bursts, ripples, and combo interactions.',
  results: 'Created an engaging typing practice platform that combines accurate performance tracking with extensive customization and interactive feedback. Clacko demonstrates modern Next.js development, real-time application logic, responsive UI engineering, animation, state-driven interactions, performance visualization, and user-focused product design.',
  sort_order: 10,
  created_at: '2026-08-10'
},
{
  id: 'proj-11',
  title: 'FIFA Pixar Universe',
  slug: 'fifa-pixar-universe',
  number: '11',
  short_description: 'Cinematic 3D FIFA World Cup experience blending immersive football storytelling, Pixar-inspired visuals, interactive players, and stadium environments.',
  long_description: 'FIFA Pixar Universe is a cinematic AAA-inspired FIFA World Cup web experience that combines football, 3D visuals, immersive storytelling, and interactive digital experiences into a single platform. Built with Next.js, React, TypeScript, and modern web technologies, the experience presents football players, stadiums, World Cup-inspired environments, cinematic hero sections, and interactive visual content through a highly polished interface. The project focuses on creating a game-like, immersive experience rather than a traditional informational sports website, demonstrating advanced frontend development, visual engineering, responsive design, and 3D web experience development.',
  technologies: [
    'Next.js',
    'React',
    'TypeScript',
    'JavaScript',
    '3D Web Experiences',
    'CSS',
    'Tailwind CSS',
    'Lucide React',
    'Responsive Design',
    'Animation',
    'Git',
    'GitHub',
    'Vercel'
  ],
  category: '3D & Interactive Web',
  year: '2026',
  thumbnail_url: '/fifa-3.webp',
  gallery: [
    '/fifa-4.webp',
    '/fifa-2.png',
    '/fifa-1.webp'
  ],
  live_url: 'https://fifa-black-eta.vercel.app/',
  github_url: 'https://github.com/Abhishekkuntare/FIFA',
  featured: true,
  status: 'Completed',
  challenges: 'Creating a cinematic football experience that feels closer to an interactive AAA game interface than a conventional website while combining 3D environments, player-focused visuals, stadium experiences, cinematic sections, animations, and responsive behavior across different devices.',
  solution: 'Built a modular Next.js and React architecture with TypeScript, reusable components, responsive layouts, animated interfaces, cinematic visual sections, 3D-inspired presentation, optimized media assets, and structured player and stadium experiences to create an immersive FIFA World Cup-inspired digital universe.',
  results: 'Delivered a cinematic interactive football experience combining 3D visual presentation, player showcases, stadium environments, immersive storytelling, animations, and responsive UI. The project demonstrates advanced frontend engineering, Next.js development, interactive visual design, responsive experiences, and the ability to transform a traditional web application into an immersive digital experience.',
  sort_order: 11,
  created_at: '2026-07-17'
},
{
  id: 'proj-12',
  title: 'Cosmic Abhishek Kuntare',
  slug: 'cosmic-abhishek-kuntare',
  number: '12',
  short_description: 'Creative artist portfolio showcasing sketches, caricatures, illustrations, digital artwork, reels, and commissioned creative work.',
  long_description: 'Cosmic Abhishek Kuntare is a visually expressive personal artist portfolio designed to showcase original creative work including hand-drawn sketches, caricatures, illustrations, digital artwork, character designs, art reels, and commission projects. The platform combines an immersive artistic visual identity with interactive galleries, artwork categories, dedicated artwork detail pages, social integrations, sharing interactions, and responsive layouts. Built with Next.js, React, TypeScript, Tailwind CSS, and Framer Motion, the experience transforms a traditional portfolio into an engaging digital art gallery focused on creativity, storytelling, and visual exploration.',
  technologies: [
    'Next.js',
    'React',
    'TypeScript',
    'Tailwind CSS',
    'Framer Motion',
    'Vercel Analytics',
    'JavaScript',
    'HTML5',
    'CSS3',
    'Git',
    'GitHub'
  ],
  category: 'Creative & Portfolio',
  year: '2026',
  thumbnail_url: '/abhishekart-1.png',
  gallery: [
    '/abhishekart-1.png',
    '/abhishekart-2.png',
    '/abhishekart-3.webp'
  ],
  live_url: 'https://cosmicabhishekkuntare.vercel.app/',
  github_url: 'https://github.com/Abhishekkuntare/cosmicabhishekkuntare',
  featured: true,
  status: 'Completed',
  challenges: 'Creating an artist-focused portfolio that presents different forms of artwork in an immersive and visually expressive way while supporting gallery filtering, individual artwork pages, social integrations, sharing, responsive layouts, and smooth animations across devices.',
  solution: 'Developed a modern Next.js architecture with reusable gallery and artwork components, dynamic artwork detail routes, category-based content organization, Tailwind CSS styling, Framer Motion animations, responsive layouts, social media integrations, artwork sharing interactions, and structured creative content management.',
  results: 'Created a modern digital art gallery that provides an engaging way to discover, explore, and share artwork across sketches, caricatures, illustrations, digital art, reels, character designs, and commission work. The project demonstrates strong frontend architecture, creative UI/UX design, animation, responsive development, dynamic routing, and visually driven product presentation.',
  sort_order: 12,
  created_at: '2026-07-07'
},

{
  id: 'proj-13',
  title: 'Abhishek Kuntare — Portfolio',
  slug: 'abhishek-kuntare-portfolio',
  number: '13',
  short_description: 'Personal developer portfolio showcasing software projects, technical skills, experience, creative work, and professional profile.',
  long_description: 'Abhishek Kuntare Portfolio is an earlier personal developer portfolio created to present professional experience, technical skills, software projects, creative work, and development capabilities through a dedicated web experience. The portfolio brings together project showcases, developer information, skills, experience, and personal branding in a responsive interface. It represents an earlier stage of the portfolio journey while demonstrating the evolution of design, frontend development, and personal branding across subsequent projects.',
  technologies: [
    'React.js',
    'JavaScript',
    'HTML5',
    'CSS3',
    'Responsive Web Design',
    'Git',
    'GitHub',
    'Netlify'
  ],
  category: 'Portfolio & Web',
  year: '2024',
  thumbnail_url: '/abhishekoldport-1.png',
  gallery: [
    '/abhishekoldport-1.png',
    '/abhishekoldport-3.webp',
    'abhishekoldport-2.png'
  ],
  live_url: 'https://abhishekkuntare.netlify.app/',
  github_url: 'https://github.com/Abhishekkuntare',
  featured: true,
  status: 'Completed',
  challenges: 'Building a professional personal portfolio that effectively communicates technical skills, projects, experience, and personal branding while maintaining a responsive and accessible experience across different screen sizes.',
  solution: 'Created a responsive personal portfolio with structured sections for professional information, technical skills, projects, experience, and personal branding, using reusable frontend patterns and responsive web design principles.',
  results: 'Established an early professional web presence that brought technical projects, skills, experience, and personal branding into one accessible platform. The project also serves as a foundation for the evolution of the portfolio into more advanced interactive experiences such as Abhishek OS.',
  sort_order: 13,
  created_at: '2024-01-01'
}
];

export const INITIAL_EXPERIENCES: Experience[] = [
  {
    id: 'exp-1',
    company: 'Videoit.io',
    role: 'Software Developer',
    location: 'Bengaluru, India',
    start_date: 'Jun 2024',
    end_date: 'Aug 2026',
    description: [
      'Architected and implemented high-performance frontend interfaces using React.js, TypeScript, Redux, and REST APIs for scalable video commerce.',
      'Developed and optimized core modules including Stories, promotional Banners, and interactive Video Gallery components.',
      'Executed performance engineering initiatives: implemented code splitting, lazy asset loading, and eliminated severe API bottlenecks.',
      'Integrated responsive web components with Shopify backend services and synchronized REST endpoints reliably.'
    ],
    achievements: [
      'Achieved 40%+ faster page load speeds through aggressive asset optimization and bottleneck reduction',
      'Built reusable, high-volume video delivery UI modules adopted across multiple e-commerce storefronts',
      'Engineered clean REST state synchronization preventing UI glitches during checkout flows'
    ],
    technologies: ['React.js', 'Redux', 'JavaScript', 'TypeScript', 'REST APIs', 'Shopify Integration'],
    sort_order: 1
  },
  {
    id: 'exp-2',
    company: 'Fitness Fuel 360',
    role: 'React.js Development Intern',
    location: 'Navi Mumbai, India',
    start_date: 'Sept 2021',
    end_date: 'Dec 2021',
    description: [
      'Developed 5+ production-ready, reusable React components utilizing Material UI design standards.',
      'Collaborated on client-side performance auditing and streamlined complex UI component trees.',
      'Integrated RESTful APIs to maintain synchronized user nutrition and workout tracking records.'
    ],
    achievements: [
      'Delivered a 30% page load time reduction by streamlining React component render cycles',
      'Constructed modular Material UI component patterns that increased team delivery velocity',
      'Enhanced reliability of asynchronous data synchronization across web sessions'
    ],
    technologies: ['React.js', 'Material UI', 'REST APIs', 'JavaScript', 'HTML5/CSS3'],
    sort_order: 2
  },
  {
    id: 'exp-3',
    company: 'Edsquare Ventures Private Limited',
    role: 'Web Development Intern',
    location: 'Mumbai, India',
    start_date: 'Jan 2022',
    end_date: 'Mar 2022',
    description: [
      'Built component-based user interfaces utilizing React.js and Redux for an educational portal.',
      'Implemented predictable global state management pipelines ensuring cohesive multi-step workflows.',
      'Refactored legacy UI components to deliver smoother visual feedback and responsive ergonomics.'
    ],
    achievements: [
      'Reduced initial page load latency by 30% through bundle splitting and image asset caching',
      'Established disciplined Redux store conventions reducing state desynchronization bugs',
      'Improved cross-device responsiveness across mobile and desktop browser engines'
    ],
    technologies: ['React.js', 'Redux', 'JavaScript', 'REST APIs', 'CSS3'],
    sort_order: 3
  }
];

export const INITIAL_SKILLS: Skill[] = [
  // Programming Languages
  { id: 'sk-1', name: 'JavaScript (ES6+)', category: 'Programming Languages', sort_order: 1 },
  { id: 'sk-2', name: 'TypeScript', category: 'Programming Languages', sort_order: 2 },
  { id: 'sk-3', name: 'SQL', category: 'Programming Languages', sort_order: 3 },
  { id: 'sk-4', name: 'Python', category: 'Programming Languages', sort_order: 4 },

  // Frontend
  { id: 'sk-5', name: 'React.js', category: 'Frontend', sort_order: 5 },
  { id: 'sk-6', name: 'Next.js', category: 'Frontend', sort_order: 6 },
  { id: 'sk-7', name: 'Redux / Toolkit', category: 'Frontend', sort_order: 7 },
  { id: 'sk-8', name: 'HTML5', category: 'Frontend', sort_order: 8 },
  { id: 'sk-9', name: 'CSS3 / SCSS', category: 'Frontend', sort_order: 9 },
  { id: 'sk-10', name: 'Tailwind CSS', category: 'Frontend', sort_order: 10 },
  { id: 'sk-11', name: 'Bootstrap', category: 'Frontend', sort_order: 11 },
  { id: 'sk-12', name: 'Material UI', category: 'Frontend', sort_order: 12 },

  // Backend & Database
  { id: 'sk-13', name: 'Node.js', category: 'Backend & Database', sort_order: 13 },
  { id: 'sk-14', name: 'Express.js', category: 'Backend & Database', sort_order: 14 },
  { id: 'sk-15', name: 'MongoDB', category: 'Backend & Database', sort_order: 15 },
  { id: 'sk-16', name: 'Firebase', category: 'Backend & Database', sort_order: 16 },
  { id: 'sk-17', name: 'GraphQL', category: 'Backend & Database', sort_order: 17 },
  { id: 'sk-18', name: 'Flask', category: 'Backend & Database', sort_order: 18 },

  // AI / API
  { id: 'sk-19', name: 'OpenAI APIs', category: 'AI / API', sort_order: 19 },
  { id: 'sk-20', name: 'LLM Integration', category: 'AI / API', sort_order: 20 },
  { id: 'sk-21', name: 'AI Application Development', category: 'AI / API', sort_order: 21 },
  { id: 'sk-22', name: 'Image-Based AI Workflows', category: 'AI / API', sort_order: 22 },
  { id: 'sk-23', name: 'REST APIs & JSON', category: 'AI / API', sort_order: 23 },

  // Tools & Engineering
  { id: 'sk-24', name: 'Git & GitHub', category: 'Tools / Engineering', sort_order: 24 },
  { id: 'sk-25', name: 'VS Code', category: 'Tools / Engineering', sort_order: 25 },
  { id: 'sk-26', name: 'Postman', category: 'Tools / Engineering', sort_order: 26 },
  { id: 'sk-27', name: 'Vercel Deployment', category: 'Tools / Engineering', sort_order: 27 },
  { id: 'sk-28', name: 'Object-Oriented Programming', category: 'Tools / Engineering', sort_order: 28 },
  { id: 'sk-29', name: 'Reusable Component Architecture', category: 'Tools / Engineering', sort_order: 29 },
  { id: 'sk-30', name: 'Performance Optimization', category: 'Tools / Engineering', sort_order: 30 },
  { id: 'sk-31', name: 'Responsive Web Design', category: 'Tools / Engineering', sort_order: 31 }
];

export const INITIAL_EDUCATION: Education = {
  id: 'edu-1',
  institution: 'Prof Ram Meghe Institute of Technology and Research',
  degree: 'Bachelor of Technology',
  field: 'Information Technology',
  cgpa: '8.50 / 10',
  start_date: 'Jan 2021',
  end_date: 'Aug 2024',
  location: 'Maharashtra, India',
  description: [
    'Comprehensive coursework in Data Structures, Algorithms, Object-Oriented Software Design, Database Management Systems, and Web Technologies.',
    'Graduated with strong academic standing (8.50/10 CGPA).',
    'Active participant in tech symposiums, project exhibitions, and developer hackathons.'
  ]
};

export const INITIAL_WALLPAPERS: Wallpaper[] = [
  {
    id: 'wall-aurora',
    name: 'Midnight Aurora',
    thumbnailColor: '#0c4a6e',
    style: 'radial-gradient(circle at 50% 20%, #0369a1 0%, #0c4a6e 35%, #020b14 100%)',
    type: 'aurora',
    description: 'Fluctuating northern lights simulation with iridescent chromatic waves'
  },
  {
    id: 'wall-deep-space',
    name: 'Deep Space',
    thumbnailColor: '#020617',
    style: 'radial-gradient(circle at 75% 30%, #1e1b4b 0%, #030712 60%, #000000 100%)',
    type: 'starfield',
    description: 'Twinkling celestial starfield with subtle cursor parallax'
  },
  {
    id: 'wall-dev-grid',
    name: 'Developer Grid',
    thumbnailColor: '#064e3b',
    style: 'linear-gradient(to bottom, #022c22 0%, #020617 80%)',
    type: 'developer-grid',
    description: 'Cybernetic matrix perspective grid with scanning laser lines'
  },
  {
    id: 'wall-cosmic-flow',
    name: 'Cosmic Flow',
    thumbnailColor: '#3b0764',
    style: 'radial-gradient(circle at 30% 70%, #581c87 0%, #180828 50%, #030712 100%)',
    type: 'cosmic-flow',
    description: 'Dynamic flowing particles ribbons moving like cosmic dust'
  },
  {
    id: 'wall-liquid-glass',
    name: 'Liquid Glass',
    thumbnailColor: '#1e293b',
    style: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 60%, #020617 100%)',
    type: 'liquid-glass',
    description: 'Optical glass refractions with smooth chromatic motion'
  },
  {
    id: 'wall-neural',
    name: 'Neural Network',
    thumbnailColor: '#0f172a',
    style: 'radial-gradient(circle at 60% 40%, #0284c7 0%, #032034 30%, #020617 100%)',
    type: 'neural',
    description: 'Interconnected neural nodes and firing synaptic signals'
  },
  {
    id: 'wall-black-hole',
    name: 'Black Hole',
    thumbnailColor: '#ea580c',
    style: 'radial-gradient(circle at 50% 50%, #000000 0%, #1c0a00 30%, #000000 85%)',
    type: 'black-hole',
    description: 'Gravitational accretion disk swirling around an event horizon'
  },
  {
    id: 'wall-minimal-dark',
    name: 'Minimal Dark',
    thumbnailColor: '#18181b',
    style: 'radial-gradient(circle at 50% 50%, #18181b 0%, #09090b 70%, #000000 100%)',
    type: 'static',
    description: 'Sleek carbon-weave matte finish optimized for pure focus'
  }
];

export const DESKTOP_ICONS: DesktopIconItem[] = [
  { id: 'icon-this-pc', appId: 'this-pc', title: 'This PC', iconName: 'Monitor' },
  { id: 'icon-store', appId: 'store', title: 'Abhishek Store', iconName: 'Store' },
  { id: 'icon-browser', appId: 'browser', title: 'Abhishek Browser', iconName: 'Globe' },
  { id: 'icon-projects', appId: 'projects', title: 'Projects', iconName: 'FolderKanban' },
  { id: 'icon-code-editor', appId: 'code-editor', title: 'Abhishek Code', iconName: 'Code2' },
  { id: 'icon-writer', appId: 'writer', title: 'Abhishek Writer', iconName: 'FileText' },
  { id: 'icon-sheets', appId: 'sheets', title: 'Abhishek Sheets', iconName: 'Table' },
  { id: 'icon-terminal', appId: 'terminal', title: 'Terminal', iconName: 'Terminal' },
  { id: 'icon-camera', appId: 'camera', title: 'Camera Studio', iconName: 'Camera' },
  { id: 'icon-arcade', appId: 'arcade', title: 'Arcade Center', iconName: 'Gamepad2' },
  { id: 'icon-achievements', appId: 'achievements', title: 'Achievements', iconName: 'Trophy' },
  { id: 'icon-video-player', appId: 'video-player', title: 'Media Player', iconName: 'Video' },
  { id: 'icon-youtube', appId: 'youtube', title: 'YouTube', iconName: 'Youtube' },
  { id: 'icon-spotify', appId: 'spotify', title: 'Spotify Music', iconName: 'Music' },
  { id: 'icon-widgets', appId: 'widgets', title: 'Widgets Panel', iconName: 'LayoutDashboard' },
  { id: 'icon-system-monitor', appId: 'system-monitor', title: 'Task Manager', iconName: 'Activity' },
  { id: 'icon-git', appId: 'git', title: 'Git Studio', iconName: 'GitBranch' },
  { id: 'icon-performance', appId: 'performance', title: 'Performance Center', iconName: 'Activity' },
  { id: 'icon-api-tester', appId: 'api-tester', title: 'API Lab', iconName: 'Send' },
  { id: 'icon-gallery', appId: 'gallery', title: 'Gallery', iconName: 'Images' },
  { id: 'icon-notes', appId: 'notes', title: 'Quick Notes', iconName: 'StickyNote' },
  { id: 'icon-weather', appId: 'weather', title: 'Weather', iconName: 'CloudSun' },
  { id: 'icon-calculator', appId: 'calculator', title: 'Calculator', iconName: 'Calculator' },
  { id: 'icon-calendar', appId: 'calendar', title: 'Calendar', iconName: 'Calendar' },
  { id: 'icon-about', appId: 'about', title: 'About Abhishek', iconName: 'UserCheck' },
  { id: 'icon-experience', appId: 'experience', title: 'Experience', iconName: 'Briefcase' },
  { id: 'icon-skills', appId: 'skills', title: 'Skills Specs', iconName: 'Cpu' },
  { id: 'icon-education', appId: 'education', title: 'Education', iconName: 'GraduationCap' },
  { id: 'icon-certifications', appId: 'certifications', title: 'Certifications', iconName: 'Award' },
  { id: 'icon-resume', appId: 'resume', title: 'Resume.pdf', iconName: 'FileText' },
  { id: 'icon-contact', appId: 'contact', title: 'Contact', iconName: 'Mail' },
  { id: 'icon-settings', appId: 'settings', title: 'Settings', iconName: 'Settings' },
  { id: 'icon-control-panel', appId: 'control-panel', title: 'Control Panel', iconName: 'SlidersHorizontal' },
  { id: 'icon-abhishek-canva', appId: 'abhishek-canva', title: 'Abhishek Canva', iconName: 'Palette' },
  { id: 'icon-recycle-bin', appId: 'recycle-bin', title: 'Recycle Bin', iconName: 'Trash2' }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: "Welcome to Abhishek's Workstation",
    message: "Operating system loaded. Feel free to explore projects, files, experience, and the terminal.",
    time: 'Just now',
    type: 'info',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Featured Project: KrishiMitra AI',
    message: 'AI-powered crop recommendation & disease assistance platform is ready for review.',
    time: '5m ago',
    type: 'success',
    read: false
  },
  {
    id: 'notif-3',
    title: 'Portfolio Control Center',
    message: 'Press Ctrl + K anytime to activate instant global portfolio search.',
    time: '12m ago',
    type: 'info',
    read: true
  }
];

export const PROFILE_INFO = {
  name: 'Abhishek Kuntare',
  role: 'Software Developer',
  tagline: 'Building Scalable Web Applications & AI-Powered Workflows',
  bio: 'Software Developer with 2+ years of experience building scalable web applications using React.js, TypeScript, JavaScript, Node.js, and REST APIs. Experienced in full-stack development, AI API integration, performance optimization, and reusable UI development.',
  email: 'abhishekkuntare7@gmail.com',
  phone: '+91 9156075536',
  location: 'Bengaluru / Maharashtra, India',
  github: 'https://github.com/abhishekkuntare',
  linkedin: 'https://linkedin.com/in/abhishekkuntare',
  portfolio: 'https://abhishekkuntare.dev',
  technologiesHighlight: [
    'React.js', 'Next.js', 'TypeScript', 'Node.js',
    'OpenAI APIs', 'Tailwind CSS', 'Redux', 'Python'
  ]
};
