import { PresetSize } from '../types/design';

export const PRESET_SIZES: PresetSize[] = [
  // Social Media
  {
    id: 'instagram-post',
    name: 'Instagram Post',
    width: 1080,
    height: 1080,
    category: 'social',
    icon: 'Instagram'
  },
  {
    id: 'instagram-story',
    name: 'Instagram Story',
    width: 1080,
    height: 1920,
    category: 'social',
    icon: 'Instagram'
  },
  {
    id: 'instagram-reel',
    name: 'Instagram Reel',
    width: 1080,
    height: 1920,
    category: 'social',
    icon: 'Instagram'
  },
  {
    id: 'youtube-thumbnail',
    name: 'YouTube Thumbnail',
    width: 1280,
    height: 720,
    category: 'social',
    icon: 'Youtube'
  },
  {
    id: 'youtube-banner',
    name: 'YouTube Banner',
    width: 2560,
    height: 1440,
    category: 'social',
    icon: 'Youtube'
  },
  {
    id: 'facebook-post',
    name: 'Facebook Post',
    width: 1200,
    height: 630,
    category: 'social',
    icon: 'Facebook'
  },
  {
    id: 'linkedin-post',
    name: 'LinkedIn Post',
    width: 1200,
    height: 627,
    category: 'social',
    icon: 'Linkedin'
  },
  {
    id: 'x-post',
    name: 'X Post',
    width: 1200,
    height: 675,
    category: 'social',
    icon: 'Twitter'
  },
  {
    id: 'pinterest-pin',
    name: 'Pinterest Pin',
    width: 1000,
    height: 1500,
    category: 'social',
    icon: 'Image'
  },
  
  // Presentations
  {
    id: 'presentation-16-9',
    name: '16:9 Presentation',
    width: 1920,
    height: 1080,
    category: 'presentation',
    icon: 'Presentation'
  },
  {
    id: 'presentation-4-3',
    name: '4:3 Presentation',
    width: 1600,
    height: 1200,
    category: 'presentation',
    icon: 'Presentation'
  },
  {
    id: 'pitch-deck',
    name: 'Pitch Deck',
    width: 1920,
    height: 1080,
    category: 'presentation',
    icon: 'Presentation'
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    width: 1920,
    height: 1080,
    category: 'presentation',
    icon: 'FolderKanban'
  },
  
  // Documents
  {
    id: 'a4',
    name: 'A4',
    width: 2480,
    height: 3508,
    category: 'document',
    icon: 'FileText'
  },
  {
    id: 'letter',
    name: 'Letter',
    width: 2550,
    height: 3300,
    category: 'document',
    icon: 'FileText'
  },
  {
    id: 'resume',
    name: 'Resume',
    width: 2480,
    height: 3508,
    category: 'document',
    icon: 'FileText'
  },
  {
    id: 'report',
    name: 'Report',
    width: 2480,
    height: 3508,
    category: 'document',
    icon: 'FileText'
  },
  {
    id: 'proposal',
    name: 'Proposal',
    width: 2480,
    height: 3508,
    category: 'document',
    icon: 'FileText'
  },
  {
    id: 'brochure',
    name: 'Brochure',
    width: 2480,
    height: 3508,
    category: 'document',
    icon: 'FileText'
  },
  
  // Marketing
  {
    id: 'poster',
    name: 'Poster',
    width: 2480,
    height: 3508,
    category: 'marketing',
    icon: 'Image'
  },
  {
    id: 'flyer',
    name: 'Flyer',
    width: 2480,
    height: 3508,
    category: 'marketing',
    icon: 'FileText'
  },
  {
    id: 'business-card',
    name: 'Business Card',
    width: 1050,
    height: 600,
    category: 'marketing',
    icon: 'CreditCard'
  },
  {
    id: 'menu',
    name: 'Menu',
    width: 2480,
    height: 3508,
    category: 'marketing',
    icon: 'Utensils'
  },
  {
    id: 'certificate',
    name: 'Certificate',
    width: 2480,
    height: 3508,
    category: 'marketing',
    icon: 'Award'
  },
  {
    id: 'invitation',
    name: 'Invitation',
    width: 2480,
    height: 3508,
    category: 'marketing',
    icon: 'Mail'
  },
  
  // Video
  {
    id: 'youtube-video',
    name: 'YouTube Video',
    width: 1920,
    height: 1080,
    category: 'video',
    icon: 'Youtube'
  },
  {
    id: 'reel',
    name: 'Reel',
    width: 1080,
    height: 1920,
    category: 'video',
    icon: 'Video'
  },
  {
    id: 'short',
    name: 'Short',
    width: 1080,
    height: 1920,
    category: 'video',
    icon: 'Video'
  },
  {
    id: 'story',
    name: 'Story',
    width: 1080,
    height: 1920,
    category: 'video',
    icon: 'Video'
  },
  {
    id: 'presentation-video',
    name: 'Presentation Video',
    width: 1920,
    height: 1080,
    category: 'video',
    icon: 'Presentation'
  },
  
  // Web
  {
    id: 'website',
    name: 'Website',
    width: 1920,
    height: 1080,
    category: 'web',
    icon: 'Globe'
  },
  {
    id: 'landing-page',
    name: 'Landing Page',
    width: 1920,
    height: 1080,
    category: 'web',
    icon: 'Globe'
  },
  {
    id: 'social-link-page',
    name: 'Social Link Page',
    width: 1080,
    height: 1920,
    category: 'web',
    icon: 'Link'
  },
  
  // Custom
  {
    id: 'custom',
    name: 'Custom Size',
    width: 1920,
    height: 1080,
    category: 'custom',
    icon: 'Maximize'
  }
];

export const QUICK_DESIGNS = [
  {
    id: 'instagram-post',
    name: 'Instagram Post',
    icon: 'Instagram',
    description: '1080 × 1080',
    size: { width: 1080, height: 1080 }
  },
  {
    id: 'instagram-story',
    name: 'Instagram Story',
    icon: 'Instagram',
    description: '1080 × 1920',
    size: { width: 1080, height: 1920 }
  },
  {
    id: 'youtube-thumbnail',
    name: 'YouTube Thumbnail',
    icon: 'Youtube',
    description: '1280 × 720',
    size: { width: 1280, height: 720 }
  },
  {
    id: 'presentation',
    name: 'Presentation',
    icon: 'Presentation',
    description: '1920 × 1080',
    size: { width: 1920, height: 1080 }
  },
  {
    id: 'poster',
    name: 'Poster',
    icon: 'Image',
    description: '2480 × 3508',
    size: { width: 2480, height: 3508 }
  },
  {
    id: 'resume',
    name: 'Resume',
    icon: 'FileText',
    description: '2480 × 3508',
    size: { width: 2480, height: 3508 }
  },
  {
    id: 'logo',
    name: 'Logo',
    icon: 'PenTool',
    description: '500 × 500',
    size: { width: 500, height: 500 }
  },
  {
    id: 'business-card',
    name: 'Business Card',
    icon: 'CreditCard',
    description: '1050 × 600',
    size: { width: 1050, height: 600 }
  },
  {
    id: 'website',
    name: 'Website',
    icon: 'Globe',
    description: '1920 × 1080',
    size: { width: 1920, height: 1080 }
  },
  {
    id: 'flyer',
    name: 'Flyer',
    icon: 'FileText',
    description: '2480 × 3508',
    size: { width: 2480, height: 3508 }
  },
  {
    id: 'invitation',
    name: 'Invitation',
    icon: 'Mail',
    description: '2480 × 3508',
    size: { width: 2480, height: 3508 }
  },
  {
    id: 'a4-document',
    name: 'A4 Document',
    icon: 'FileText',
    description: '2480 × 3508',
    size: { width: 2480, height: 3508 }
  }
];

export const FONT_FAMILIES = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Verdana',
  'Courier New',
  'Impact',
  'Comic Sans MS',
  'Trebuchet MS',
  'Arial Black',
  'Palatino Linotype',
  'Lucida Console',
  'Tahoma',
  'Geneva',
  'MS Sans Serif',
  'MS Serif',
  'Times',
  'Courier',
  'System',
  'Monaco',
  'Apple System',
  'Segoe UI',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Oswald',
  'Raleway',
  'Poppins',
  'Playfair Display',
  'Merriweather',
  'Source Sans Pro',
  'Nunito',
  'Ubuntu',
  'PT Sans',
  'Rubik',
  'Work Sans'
];

export const DEFAULT_COLORS = [
  '#000000',
  '#FFFFFF',
  '#FF0000',
  '#00FF00',
  '#0000FF',
  '#FFFF00',
  '#FF00FF',
  '#00FFFF',
  '#FFA500',
  '#800080',
  '#008000',
  '#000080',
  '#800000',
  '#008080',
  '#FFC0CB',
  '#FFD700',
  '#C0C0C0',
  '#808080',
  '#FF6347',
  '#4682B4',
  '#32CD32',
  '#FFD700',
  '#DA70D6',
  '#40E0D0',
  '#EE82EE',
  '#F5DEB3',
  '#FFFFFF',
  '#FF69B4',
  '#CD5C5C',
  '#F08080',
  '#E6E6FA',
  '#FFF0F5',
  '#7FFFD4',
  '#FFE4E1',
  '#FFE4B5',
  '#FFDEAD',
  '#0000CD',
  '#8A2BE2',
  '#A52A2A',
  '#DEB887',
  '#5F9EA0',
  '#7FFF00',
  '#D2691E',
  '#FF7F50',
  '#6495ED',
  '#FFF8DC',
  '#DC143C',
  '#00FFFF',
  '#00008B',
  '#008B8B',
  '#B8860B',
  '#A9A9A9',
  '#006400',
  '#BDB76B',
  '#8B008B',
  '#556B2F',
  '#FF8C00',
  '#9932CC',
  '#8B0000',
  '#E9967A',
  '#8FBC8F',
  '#483D8B',
  '#2F4F4F',
  '#00CED1',
  '#9400D3',
  '#FF1493',
  '#00BFFF',
  '#696969',
  '#1E90FF',
  '#B22222',
  '#FAFAD2',
  '#228B22',
  '#FF00FF',
  '#DCDCDC',
  '#F8F8FF',
  '#FFDAB9',
  '#4B0082',
  '#F0FFF0',
  '#FFFAF0',
  '#F0FFFF',
  '#FFFFE0'
];

export const GRADIENT_PRESETS = [
  {
    name: 'Sunset',
    colors: ['#FF6B6B', '#FFE66D'],
    angle: 135
  },
  {
    name: 'Ocean',
    colors: ['#667eea', '#764ba2'],
    angle: 135
  },
  {
    name: 'Forest',
    colors: ['#11998e', '#38ef7d'],
    angle: 135
  },
  {
    name: 'Fire',
    colors: ['#f12711', '#f5af19'],
    angle: 135
  },
  {
    name: 'Sky',
    colors: ['#2193b0', '#6dd5ed'],
    angle: 135
  },
  {
    name: 'Purple',
    colors: ['#834d9b', '#d04ed6'],
    angle: 135
  },
  {
    name: 'Blue',
    colors: ['#00c6ff', '#0072ff'],
    angle: 135
  },
  {
    name: 'Green',
    colors: ['#56ab2f', '#a8e063'],
    angle: 135
  },
  {
    name: 'Pink',
    colors: ['#ec008c', '#fc6767'],
    angle: 135
  },
  {
    name: 'Orange',
    colors: ['#f857a6', '#ff5858'],
    angle: 135
  }
];