import { Project, Experience, Skill, Education, Certification, Wallpaper, DesktopIconItem, NotificationItem } from '../types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
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
    id: 'proj-2',
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
    id: 'proj-3',
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
