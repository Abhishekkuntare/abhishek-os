// Core design document model for AbhishekCanva

export type ElementType = 
  | 'text'
  | 'image'
  | 'shape'
  | 'icon'
  | 'video'
  | 'audio'
  | 'group'
  | 'chart'
  | 'table'
  | 'line'
  | 'arrow'
  | 'sticker'
  | 'frame'
  | 'gradient'
  | 'pattern';

export type ShapeType = 
  | 'rectangle'
  | 'rounded-rectangle'
  | 'circle'
  | 'ellipse'
  | 'triangle'
  | 'star'
  | 'polygon'
  | 'line'
  | 'arrow'
  | 'speech-bubble'
  | 'heart'
  | 'custom';

export type ChartType = 
  | 'bar'
  | 'line'
  | 'pie'
  | 'donut'
  | 'area'
  | 'radar'
  | 'scatter';

export type AnimationType = 
  | 'fade'
  | 'slide'
  | 'rise'
  | 'pop'
  | 'zoom'
  | 'bounce'
  | 'wipe'
  | 'pulse'
  | 'shake'
  | 'rotate';

export type AnimationTiming = 'entrance' | 'exit' | 'emphasis';

export type PageTransition = 
  | 'fade'
  | 'slide'
  | 'zoom'
  | 'dissolve'
  | 'none';

export type TextAlignment = 'left' | 'center' | 'right' | 'justify';
export type VerticalAlignment = 'top' | 'middle' | 'bottom';

export interface DesignDocument {
  id: string;
  name: string;
  description?: string;
  
  // Canvas dimensions
  width: number;
  height: number;
  
  // Canvas background
  background: string;
  
  // Pages
  pages: DesignPage[];
  activePageId: string;
  
  // Metadata
  thumbnail?: string;
  tags: string[];
  folderId?: string;
  isFavorite: boolean;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  
  // Version
  version: number;
  format: 'abhishekcanva';
}

export interface DesignPage {
  id: string;
  name: string;
  order: number;
  
  // Page-specific background (overrides document background)
  background?: string;
  
  // Elements on this page
  elements: DesignElement[];
  
  // Page-specific settings
  isHidden: boolean;
  transition?: PageTransition;
  transitionDuration?: number;
  
  // Animation settings
  defaultAnimation?: {
    type: AnimationType;
    timing: AnimationTiming;
    duration: number;
    delay: number;
    easing: string;
  };
}

export interface DesignElement {
  id: string;
  type: ElementType;
  
  // Position and size
  x: number;
  y: number;
  width: number;
  height: number;
  
  // Rotation and transformation
  rotation: number;
  scaleX: number;
  scaleY: number;
  
  // Appearance
  opacity: number;
  visible: boolean;
  locked: boolean;
  
  // Layer management
  zIndex: number;
  groupId?: string;
  
  // Element-specific data
  data: ElementData;
  
  // Animation
  animation?: ElementAnimation;
  
  // Effects
  effects?: ElementEffects;
  
  // Accessibility
  altText?: string;
  ariaLabel?: string;
}

export interface ElementData {
  // Text-specific
  text?: TextData;
  
  // Image-specific
  image?: ImageData;
  
  // Shape-specific
  shape?: ShapeData;
  
  // Icon-specific
  icon?: IconData;
  
  // Video-specific
  video?: VideoData;
  
  // Audio-specific
  audio?: AudioData;
  
  // Chart-specific
  chart?: ChartData;
  
  // Table-specific
  table?: TableData;
  
  // Line/Arrow-specific
  line?: LineData;
  
  // Sticker-specific
  sticker?: StickerData;
  
  // Frame-specific
  frame?: FrameData;
  
  // Gradient-specific
  gradient?: GradientData;
  
  // Pattern-specific
  pattern?: PatternData;
}

export interface TextData {
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline' | 'line-through' | 'underline line-through';
  textAlignment: TextAlignment;
  verticalAlignment: VerticalAlignment;
  lineHeight: number;
  letterSpacing: number;
  paragraphSpacing: number;
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  color: string;
  backgroundColor?: string;
  textShadow?: TextShadow;
  textOutline?: TextOutline;
  textGradient?: TextGradient;
}

export interface TextShadow {
  color: string;
  offsetX: number;
  offsetY: number;
  blur: number;
}

export interface TextOutline {
  color: string;
  width: number;
}

export interface TextGradient {
  type: 'linear' | 'radial';
  colors: string[];
  angle?: number;
}

export interface ImageData {
  src: string;
  alt?: string;
  originalWidth?: number;
  originalHeight?: number;
  crop?: CropData;
  filters?: ImageFilters;
  fit: 'contain' | 'cover' | 'fill' | 'none';
}

export interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ImageFilters {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  grayscale: number;
  sepia: number;
  hueRotate: number;
  invert: number;
}

export interface ShapeData {
  shapeType: ShapeType;
  fill: string | GradientData;
  stroke?: string;
  strokeWidth?: number;
  cornerRadius?: number;
  sides?: number; // for polygons
  points?: Array<{ x: number; y: number }>; // for custom shapes
}

export interface IconData {
  name: string;
  svg: string;
  size: number;
  color: string;
}

export interface VideoData {
  src: string;
  poster?: string;
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
  controls: boolean;
  startTime?: number;
  endTime?: number;
  volume: number;
}

export interface AudioData {
  src: string;
  autoplay: boolean;
  loop: boolean;
  volume: number;
  fadeIn?: number;
  fadeOut?: number;
  trimStart?: number;
  trimEnd?: number;
}

export interface ChartData {
  chartType: ChartType;
  data: ChartDataPoint[];
  colors: string[];
  showLegend: boolean;
  showLabels: boolean;
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface TableData {
  rows: number;
  columns: number;
  cells: TableCell[];
  headerBackgroundColor?: string;
  headerTextColor?: string;
  borderColor?: string;
  borderWidth?: number;
}

export interface TableCell {
  row: number;
  column: number;
  content: string;
  backgroundColor?: string;
  textColor?: string;
  alignment?: TextAlignment;
  verticalAlignment?: VerticalAlignment;
  rowSpan?: number;
  columnSpan?: number;
}

export interface LineData {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  stroke: string;
  strokeWidth: number;
  strokeStyle: 'solid' | 'dashed' | 'dotted';
  arrowStart?: boolean;
  arrowEnd?: boolean;
  curvature?: number; // for curved lines
}

export interface StickerData {
  emoji: string;
  size: number;
}

export interface FrameData {
  frameType: 'simple' | 'ornate' | 'modern' | 'vintage' | 'polaroid';
  color: string;
  thickness: number;
  padding: number;
}

export interface GradientData {
  type: 'linear' | 'radial';
  colors: Array<{ color: string; position: number }>;
  angle?: number;
}

export interface PatternData {
  type: 'dots' | 'lines' | 'grid' | 'checkerboard' | 'custom';
  color: string;
  backgroundColor: string;
  size: number;
  spacing?: number;
}

export interface ElementAnimation {
  type: AnimationType;
  timing: AnimationTiming;
  duration: number;
  delay: number;
  easing: string;
  repeat?: 'none' | 'loop' | 'bounce';
}

export interface ElementEffects {
  shadow?: BoxShadow;
  blur?: number;
  brightness?: number;
  contrast?: number;
}

export interface BoxShadow {
  color: string;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
}

// History and operations
export interface DesignOperation {
  type: 'add' | 'update' | 'delete' | 'move' | 'resize' | 'rotate' | 'group' | 'ungroup' | 'reorder' | 'style';
  elementId?: string;
  pageId?: string;
  data?: any;
  previousData?: any;
  timestamp: number;
}

export interface HistoryEntry {
  id: string;
  operations: DesignOperation[];
  timestamp: number;
  description: string;
}

// Template system
export interface Template {
  id: string;
  title: string;
  description: string;
  category: TemplateCategory;
  thumbnail: string;
  document: DesignDocument;
  tags: string[];
  isPremium: boolean;
  createdBy: string;
  createdAt: string;
  usageCount: number;
}

export type TemplateCategory = 
  | 'social-media'
  | 'presentation'
  | 'marketing'
  | 'business'
  | 'education'
  | 'events'
  | 'fashion'
  | 'food'
  | 'real-estate'
  | 'fitness'
  | 'automotive'
  | 'technology'
  | 'portfolio'
  | 'youtube'
  | 'minimal'
  | 'modern'
  | 'luxury'
  | 'gradient'
  | '3d';

// Preset sizes
export interface PresetSize {
  id: string;
  name: string;
  width: number;
  height: number;
  category: 'social' | 'presentation' | 'document' | 'marketing' | 'video' | 'web' | 'custom';
  icon: string;
}

// Brand kit
export interface BrandKit {
  id: string;
  name: string;
  logo?: string;
  colors: BrandColor[];
  fonts: BrandFont[];
  templates: string[];
  assets: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BrandColor {
  name: string;
  color: string;
  isPrimary: boolean;
}

export interface BrandFont {
  name: string;
  fontFamily: string;
  category: 'heading' | 'body' | 'accent';
}

// AI design commands
export interface DesignCommand {
  type: 'addText' | 'addShape' | 'addImage' | 'changeColor' | 'align' | 'resize' | 'delete' | 'reorder' | 'style' | 'generate';
  data?: any;
  target?: string;
}

// Collaboration
export interface Comment {
  id: string;
  elementId?: string;
  x: number;
  y: number;
  content: string;
  author: string;
  createdAt: string;
  resolved: boolean;
  replies?: Comment[];
}

export interface CollaborationUser {
  id: string;
  name: string;
  avatar?: string;
  color: string;
  cursor?: { x: number; y: number };
  selection?: string[];
}

// Export options
export interface ExportOptions {
  format: 'png' | 'jpg' | 'webp' | 'svg' | 'pdf' | 'json';
  quality: 'standard' | 'high' | 'maximum';
  transparent: boolean;
  pageSelection: 'current' | 'all' | 'range';
  pageRange?: [number, number];
  scale: number;
  dpi?: number;
}

// Asset management
export interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'font' | 'template' | 'color' | 'gradient';
  url: string;
  thumbnail?: string;
  size: number;
  format: string;
  tags: string[];
  folderId?: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface AssetFolder {
  id: string;
  name: string;
  parentId?: string;
  type: 'uploads' | 'images' | 'videos' | 'audio' | 'brand' | 'projects';
  createdAt: string;
}