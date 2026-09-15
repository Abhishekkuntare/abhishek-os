import { VFSFile, AppId } from '../types';

const DB_NAME = 'AbhishekOS_VFS_v1';
const STORE_NAME = 'files';
const DB_VERSION = 1;

// Standard root OS folders
export const VFS_FOLDERS = [
  '/Desktop',
  '/Documents',
  '/Downloads',
  '/Pictures',
  '/Videos',
  '/Music',
  '/Projects',
  '/Applications',
  '/Games',
  '/Recycle Bin',
];

// Initial pre-populated demo files showcasing real portfolio content
const INITIAL_VFS_FILES: VFSFile[] = [
  // Documents
  {
    id: 'doc-1',
    name: 'Abhishek_Profile.abkdoc',
    path: '/Documents/Abhishek_Profile.abkdoc',
    type: 'file',
    extension: 'abkdoc',
    mimeType: 'application/json',
    size: 2048,
    updatedAt: Date.now() - 86400000 * 2,
    content: JSON.stringify({
      title: 'Abhishek Kuntare — Engineering Profile & Technical Overview',
      author: 'Abhishek Kuntare',
      category: 'Professional Overview',
      content: `<h1>Abhishek Kuntare — Full-Stack & AI Systems Developer</h1>
<p>Software engineer specializing in modern React 19, Next.js 15, TypeScript, Node.js, and Google Gemini AI systems integration. Experienced in architecting low-latency web platforms, reactive virtual operating systems, and distributed backend pipelines.</p>

<h2>Academic Credentials</h2>
<p>Bachelor of Engineering (Information Technology) with an academic CGPA of <strong>8.50 / 10.00</strong>. Recognized for algorithmic efficiency, system design, and practical software craftsmanship.</p>

<h2>Production Competencies</h2>
<ul>
  <li><strong>Frontend Architecture:</strong> React 19, Next.js App Router, TypeScript, Tailwind CSS, Motion/GSAP animations, State Orchestration.</li>
  <li><strong>Backend & APIs:</strong> Node.js, Express, FastAPI, PostgreSQL, Supabase, IndexedDB Virtual Filesystems.</li>
  <li><strong>Cloud & AI:</strong> Google Gemini Multimodal APIs, Function Calling, Prompt Engineering, Docker, AWS Core.</li>
</ul>

<h2>Featured Flagship: KrishiMitra AI</h2>
<p>An intelligent agricultural intelligence ecosystem providing farmers with precision soil diagnostics, crop disease detection via visual inference, and real-time multilingual voice advisory. Built with Next.js, FastAPI, and Google Gemini API.</p>`,
    }),
  },
  {
    id: 'doc-2',
    name: 'Project_Case_Study.abkdoc',
    path: '/Documents/Project_Case_Study.abkdoc',
    type: 'file',
    extension: 'abkdoc',
    mimeType: 'application/json',
    size: 3120,
    updatedAt: Date.now() - 86400000 * 5,
    content: JSON.stringify({
      title: 'Case Study: Designing and Engineering Abhishek OS',
      author: 'Abhishek Kuntare',
      category: 'System Architecture',
      content: `<h1>Architectural Breakdown: Abhishek OS 2.0</h1>
<p>Abhishek OS represents a complete miniature web operating system built inside the browser, transforming a conventional developer portfolio into a responsive, cohesive developer workstation.</p>

<h2>Key Engineering Challenges & Solutions</h2>
<h3>1. Unified Virtual File System (VFS)</h3>
<p>Rather than isolated demo apps, all applications interface with a central IndexedDB-backed Virtual File System. Taking a photo in Camera stores it in <code>/Pictures/</code>, saving a document in Writer puts it in <code>/Documents/</code>, and Code Editor reads from <code>/Projects/</code>.</p>

<h3>2. Memory & Performance Isolation</h3>
<p>Applications are lazy-loaded on demand. Media streams from the Camera API are strictly closed upon window exit to ensure zero memory leaks and user privacy compliance.</p>

<h3>3. Real Formula Processing without eval()</h3>
<p>Abhishek Sheets implements mathematical parsing for <code>=SUM</code>, <code>=AVERAGE</code>, <code>=MIN</code>, <code>=MAX</code>, <code>=COUNT</code>, and <code>=IF</code> without using dangerous <code>eval()</code>, upholding strict browser sandboxing.</p>`,
    }),
  },

  // Spreadsheets
  {
    id: 'sheet-1',
    name: 'Portfolio_Projects.abkxlsx',
    path: '/Documents/Portfolio_Projects.abkxlsx',
    type: 'file',
    extension: 'abkxlsx',
    mimeType: 'application/json',
    size: 4096,
    updatedAt: Date.now() - 86400000 * 3,
    content: JSON.stringify({
      activeSheet: 'Projects',
      sheets: {
        Projects: {
          A1: { value: 'Project Title', bold: true, bg: '#0284c7', color: '#ffffff' },
          B1: { value: 'Category', bold: true, bg: '#0284c7', color: '#ffffff' },
          C1: { value: 'Core Technologies', bold: true, bg: '#0284c7', color: '#ffffff' },
          D1: { value: 'Production Status', bold: true, bg: '#0284c7', color: '#ffffff' },
          E1: { value: 'Impact Score', bold: true, bg: '#0284c7', color: '#ffffff' },

          A2: { value: 'KrishiMitra AI' },
          B2: { value: 'AI / Full Stack' },
          C2: { value: 'Next.js 15, FastAPI, Gemini API' },
          D2: { value: 'Deployed' },
          E2: { value: '98' },

          A3: { value: 'CraveVerse' },
          B3: { value: 'Food Tech' },
          C3: { value: 'React, Node.js, Express, PostgreSQL' },
          D3: { value: 'Maintained' },
          E3: { value: '94' },

          A4: { value: 'Amba Motors' },
          B4: { value: 'Enterprise ERP' },
          C4: { value: 'React, Tailwind, Supabase' },
          D4: { value: 'Deployed' },
          E4: { value: '91' },

          A5: { value: 'Abhishek OS 2.0' },
          B5: { value: 'Web Desktop OS' },
          C5: { value: 'React 19, TypeScript, IndexedDB' },
          D5: { value: 'Production' },
          E5: { value: '99' },

          A6: { value: 'Total Verified Projects', bold: true },
          B6: { value: '=COUNTA(A2:A5)' },
          C6: { value: '' },
          D6: { value: 'Average Score:', bold: true },
          E6: { value: '=AVERAGE(E2:E5)' },
        },
        'KPI Metrics': {
          A1: { value: 'Metric', bold: true, bg: '#10b981', color: '#ffffff' },
          B1: { value: 'Value', bold: true, bg: '#10b981', color: '#ffffff' },
          A2: { value: 'Uptime' },
          B2: { value: '99.98%' },
          A3: { value: 'Code Coverage' },
          B3: { value: '92%' },
          A4: { value: 'Client Satisfaction' },
          B4: { value: '100%' },
        },
      },
    }),
  },
  {
    id: 'sheet-2',
    name: 'Skills_Matrix.abkxlsx',
    path: '/Documents/Skills_Matrix.abkxlsx',
    type: 'file',
    extension: 'abkxlsx',
    mimeType: 'application/json',
    size: 2400,
    updatedAt: Date.now() - 86400000 * 4,
    content: JSON.stringify({
      activeSheet: 'Technical Skills',
      sheets: {
        'Technical Skills': {
          A1: { value: 'Skill Area', bold: true, bg: '#6366f1', color: '#ffffff' },
          B1: { value: 'Framework / Tool', bold: true, bg: '#6366f1', color: '#ffffff' },
          C1: { value: 'Proficiency (%)', bold: true, bg: '#6366f1', color: '#ffffff' },
          D1: { value: 'Years Experience', bold: true, bg: '#6366f1', color: '#ffffff' },

          A2: { value: 'Frontend' },
          B2: { value: 'React 19 / Next.js 15' },
          C2: { value: '95' },
          D2: { value: '2.5' },

          A3: { value: 'Language' },
          B3: { value: 'TypeScript' },
          C3: { value: '92' },
          D3: { value: '2.5' },

          A4: { value: 'Styling' },
          B4: { value: 'Tailwind CSS 4' },
          C4: { value: '96' },
          D4: { value: '2.5' },

          A5: { value: 'Backend' },
          B5: { value: 'Node.js & Express' },
          C5: { value: '88' },
          D5: { value: '2.0' },

          A6: { value: 'Database' },
          B6: { value: 'PostgreSQL & Supabase' },
          C6: { value: '86' },
          D6: { value: '2.0' },

          A7: { value: 'AI Engineering' },
          B7: { value: 'Gemini Multimodal API' },
          C7: { value: '90' },
          D7: { value: '1.5' },

          A8: { value: 'Average Proficiency', bold: true },
          B8: { value: '' },
          C8: { value: '=AVERAGE(C2:C7)' },
          D8: { value: '=SUM(D2:D7)' },
        },
      },
    }),
  },

  // Code files
  {
    id: 'code-1',
    name: 'hello.ts',
    path: '/Projects/hello.ts',
    type: 'file',
    extension: 'ts',
    mimeType: 'text/typescript',
    size: 512,
    updatedAt: Date.now() - 86400000,
    content: `// Welcome to Abhishek OS Developer Workspace!
export interface DeveloperProfile {
  name: string;
  role: string;
  experienceYears: number;
  availableForHire: boolean;
  contactEmail: string;
}

export const abhishek: DeveloperProfile = {
  name: "Abhishek Kuntare",
  role: "Software Developer & AI Systems Engineer",
  experienceYears: 2.5,
  availableForHire: true,
  contactEmail: "abhishekkuntare02@gmail.com",
};

export function welcomeMessage(): string {
  return \`Initialized Abhishek OS for \${abhishek.name}. Status: Ready for recruitment and collaboration.\`;
}

console.log(welcomeMessage());
`,
  },
  {
    id: 'code-2',
    name: 'portfolio.tsx',
    path: '/Projects/portfolio.tsx',
    type: 'file',
    extension: 'tsx',
    mimeType: 'text/typescript',
    size: 1420,
    updatedAt: Date.now() - 86400000 * 2,
    content: `import React, { useState } from 'react';

export const DeveloperPortfolioShowcase: React.FC = () => {
  const [activeModule, setActiveModule] = useState<'About' | 'Projects' | 'Architecture'>('About');

  return (
    <div className="p-6 bg-slate-950 text-slate-100 rounded-2xl border border-white/10 font-sans">
      <header className="pb-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-sky-400">Abhishek Kuntare</h1>
          <p className="text-xs text-slate-400">Software Developer • React & Next.js Specialist</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
          ● Open to Opportunities
        </span>
      </header>

      <div className="mt-4 space-y-2 text-sm text-slate-300">
        <p>
          Welcome to the Code Editor application inside Abhishek OS. You can create, edit,
          and save real files directly within this virtual development environment.
        </p>
      </div>
    </div>
  );
};
`,
  },
  {
    id: 'code-3',
    name: 'projects.json',
    path: '/Projects/projects.json',
    type: 'file',
    extension: 'json',
    mimeType: 'application/json',
    size: 1800,
    updatedAt: Date.now() - 86400000 * 3,
    content: JSON.stringify(
      [
        {
          id: 'krishimitra-ai',
          name: 'KrishiMitra AI',
          category: 'AI & Agriculture',
          technologies: ['Next.js 15', 'FastAPI', 'Gemini API', 'Tailwind'],
          status: 'Deployed',
        },
        {
          id: 'craveverse',
          name: 'CraveVerse Food Network',
          category: 'Full-Stack Delivery',
          technologies: ['React 19', 'Node.js', 'PostgreSQL', 'Express'],
          status: 'Maintained',
        },
        {
          id: 'amba-motors',
          name: 'Amba Motors Dealership ERP',
          category: 'Enterprise SaaS',
          technologies: ['React', 'Supabase', 'PostgreSQL'],
          status: 'Production',
        },
      ],
      null,
      2
    ),
  },

  // Pictures
  {
    id: 'pic-1',
    name: 'KrishiMitra_UI.jpg',
    path: '/Pictures/KrishiMitra_UI.jpg',
    type: 'file',
    extension: 'jpg',
    mimeType: 'image/jpeg',
    size: 145000,
    updatedAt: Date.now() - 86400000 * 6,
    content: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400&q=80',
  },
  {
    id: 'pic-2',
    name: 'Developer_Workspace.jpg',
    path: '/Pictures/Developer_Workspace.jpg',
    type: 'file',
    extension: 'jpg',
    mimeType: 'image/jpeg',
    size: 185000,
    updatedAt: Date.now() - 86400000 * 7,
    content: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&q=80',
  },
  {
    id: 'pic-3',
    name: 'System_Architecture.png',
    path: '/Pictures/System_Architecture.png',
    type: 'file',
    extension: 'png',
    mimeType: 'image/png',
    size: 125000,
    updatedAt: Date.now() - 86400000 * 8,
    content: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80',
  },

  // Downloads
  {
    id: 'dl-1',
    name: 'Abhishek_Kuntare_Resume.pdf',
    path: '/Downloads/Abhishek_Kuntare_Resume.pdf',
    type: 'file',
    extension: 'pdf',
    mimeType: 'application/pdf',
    size: 152000,
    updatedAt: Date.now() - 86400000 * 1,
    content: 'pdf_representation_abhishek_kuntare',
  },

  // Videos
  {
    id: 'vid-1',
    name: 'Workstation_Demo.mp4',
    path: '/Videos/Workstation_Demo.mp4',
    type: 'file',
    extension: 'mp4',
    mimeType: 'video/mp4',
    size: 1240000,
    updatedAt: Date.now() - 86400000 * 2,
    content: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80',
  },
];

// Open IndexedDB database
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not available in this environment'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = event => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'path' });
        store.createIndex('id', 'id', { unique: true });
        store.createIndex('path', 'path', { unique: true });
        store.createIndex('extension', 'extension', { unique: false });
        store.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Global subscribers for real-time reactivity across OS apps
type VFSEventListener = () => void;
const subscribers: Set<VFSEventListener> = new Set();

export function subscribeVFS(callback: VFSEventListener): () => void {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}

function notifySubscribers() {
  subscribers.forEach(cb => {
    try {
      cb();
    } catch (e) {
      console.error('VFS subscriber error:', e);
    }
  });
}

// Initialize VFS and seed initial files if empty
export async function initVFS(): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const countReq = store.count();

    countReq.onsuccess = async () => {
      if (countReq.result === 0) {
        // Seed initial files
        const writeTx = db.transaction(STORE_NAME, 'readwrite');
        const writeStore = writeTx.objectStore(STORE_NAME);
        INITIAL_VFS_FILES.forEach(file => {
          writeStore.put(file);
        });
        writeTx.oncomplete = () => {
          notifySubscribers();
        };
      }
    };
  } catch (err) {
    console.warn('VFS initialization fallback:', err);
  }
}

// Get all files in VFS
export async function getAllVFSFiles(): Promise<VFSFile[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => {
        const list = (req.result as VFSFile[]) || [];
        resolve(list.length > 0 ? list : INITIAL_VFS_FILES);
      };
      req.onerror = () => resolve(INITIAL_VFS_FILES);
    });
  } catch {
    return INITIAL_VFS_FILES;
  }
}

// Get files inside a specific folder (e.g. "/Documents" or "/Pictures")
export async function getFilesInFolder(folderPath: string): Promise<VFSFile[]> {
  const all = await getAllVFSFiles();
  const normalized = folderPath.endsWith('/') ? folderPath.slice(0, -1) : folderPath;

  if (normalized === '' || normalized === '/') {
    // Root: return folders
    return all.filter(f => !f.deletedAt);
  }

  if (normalized === '/Recycle Bin') {
    return all.filter(f => f.deletedAt != null);
  }

  return all.filter(f => {
    if (f.deletedAt) return false;
    const parent = f.path.substring(0, f.path.lastIndexOf('/')) || '/';
    return parent.toLowerCase() === normalized.toLowerCase();
  });
}

// Get a single file by path
export async function getVFSFile(path: string): Promise<VFSFile | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(path);

      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    const found = INITIAL_VFS_FILES.find(f => f.path === path);
    return found || null;
  }
}

// Save or create a file in VFS
export async function saveVFSFile(file: VFSFile): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put({
        ...file,
        updatedAt: Date.now(),
      });

      req.onsuccess = () => {
        notifySubscribers();
        resolve();
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Failed to save VFS file:', err);
  }
}

// Create a new file conveniently
export async function createVFSFile(
  folderPath: string,
  fileName: string,
  content: string,
  extension: string,
  mimeType?: string
): Promise<VFSFile> {
  const cleanFolder = folderPath.endsWith('/') ? folderPath.slice(0, -1) : folderPath;
  const path = `${cleanFolder}/${fileName}`;
  const file: VFSFile = {
    id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: fileName,
    path,
    type: 'file',
    extension,
    mimeType: mimeType || 'text/plain',
    size: content.length,
    updatedAt: Date.now(),
    content,
  };

  await saveVFSFile(file);
  return file;
}

/** Create a virtual folder record so Explorer can persist user-created folders. */
export async function createVFSFolder(folderPath: string, folderName: string): Promise<VFSFile> {
  const cleanFolder = folderPath.endsWith('/') ? folderPath.slice(0, -1) : folderPath;
  const name = folderName.trim().replace(/[\\/]/g, '-');
  const path = `${cleanFolder}/${name}`;
  const folder: VFSFile = {
    id: `folder-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name,
    path,
    type: 'folder',
    extension: '',
    mimeType: 'inode/directory',
    size: 0,
    updatedAt: Date.now(),
    content: '',
    tags: [],
  };
  await saveVFSFile(folder);
  return folder;
}

// Delete a file (moves to Recycle Bin by setting deletedAt, or permanently deletes)
export async function deleteVFSFile(path: string, permanent: boolean = false): Promise<void> {
  try {
    const db = await openDB();
    if (permanent) {
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(path);
        req.onsuccess = () => {
          notifySubscribers();
          resolve();
        };
        req.onerror = () => reject(req.error);
      });
    } else {
      const existing = await getVFSFile(path);
      if (existing) {
        existing.deletedAt = Date.now();
        await saveVFSFile(existing);
      }
    }
  } catch (err) {
    console.error('Failed to delete VFS file:', err);
  }
}

// Restore a file from Recycle Bin
export async function restoreVFSFile(path: string): Promise<void> {
  const existing = await getVFSFile(path);
  if (existing) {
    existing.deletedAt = null;
    await saveVFSFile(existing);
  }
}

// Empty the entire Recycle Bin permanently
export async function emptyVFSRecycleBin(): Promise<void> {
  const all = await getAllVFSFiles();
  const deletedFiles = all.filter(f => f.deletedAt != null);
  for (const f of deletedFiles) {
    await deleteVFSFile(f.path, true);
  }
}

// Move or rename a file
export async function moveVFSFile(oldPath: string, newPath: string): Promise<void> {
  const file = await getVFSFile(oldPath);
  if (!file) return;

  const newName = newPath.substring(newPath.lastIndexOf('/') + 1);
  const newExt = newName.includes('.') ? newName.substring(newName.lastIndexOf('.') + 1) : file.extension;

  await deleteVFSFile(oldPath, true);
  await saveVFSFile({
    ...file,
    name: newName,
    path: newPath,
    extension: newExt,
    updatedAt: Date.now(),
  });
}

// Map file extension to standard OS application
export function getAppForFile(file: VFSFile): AppId {
  const ext = file.extension.toLowerCase();
  switch (ext) {
    case 'abkdoc':
    case 'doc':
    case 'docx':
    case 'txt':
    case 'rtf':
      return 'writer';
    case 'abkxlsx':
    case 'xls':
    case 'xlsx':
    case 'csv':
      return 'sheets';
    case 'ts':
    case 'tsx':
    case 'js':
    case 'jsx':
    case 'json':
    case 'md':
    case 'html':
    case 'css':
    case 'py':
    case 'sql':
      return 'code-editor';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'webp':
    case 'gif':
    case 'svg':
    case 'abkphoto':
      return 'gallery';
    case 'mp4':
    case 'webm':
    case 'mov':
    case 'mkv':
      return 'video-player';
    case 'pdf':
      return 'pdf-viewer';
    case 'mp3':
    case 'wav':
    case 'ogg':
      return 'music-player';
    default:
      return 'writer';
  }
}

// Export all VFS data as clean JSON backup
export async function exportVFSData(): Promise<string> {
  const files = await getAllVFSFiles();
  return JSON.stringify(
    {
      osVersion: '2.0',
      exportedAt: new Date().toISOString(),
      developer: 'Abhishek Kuntare',
      files,
    },
    null,
    2
  );
}

// Import VFS data from JSON backup
export async function importVFSData(jsonStr: string): Promise<number> {
  const parsed = JSON.parse(jsonStr);
  if (!parsed.files || !Array.isArray(parsed.files)) {
    throw new Error('Invalid Abhishek OS backup format.');
  }

  let count = 0;
  for (const f of parsed.files) {
    if (f.path && f.name) {
      await saveVFSFile(f);
      count++;
    }
  }
  return count;
}
