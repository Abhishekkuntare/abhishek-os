import React, { useEffect, useMemo, useState } from 'react';
import { useOS } from '../../context/OSContext';
import { AppId, VFSFile } from '../../types';
import {
  createVFSFile, createVFSFolder, deleteVFSFile, emptyVFSRecycleBin,
  getAllVFSFiles, getAppForFile, getFilesInFolder, moveVFSFile,
  restoreVFSFile, saveVFSFile, subscribeVFS,
} from '../../lib/vfs';
import {
  ArrowLeft, ArrowRight, ChevronRight, Columns3, Copy, Download, Eye,
  File, FileCode2, FileImage, FileText, Folder, FolderOpen, FolderPlus,
  Grid2X2, HardDrive, Info, LayoutList, List, MoreHorizontal, Pencil,
  Plus, RefreshCw, Search, Star, Tag, Trash2, Upload, X,
} from 'lucide-react';

type ViewMode = 'list' | 'grid' | 'gallery' | 'columns';
const TAGS = [
  { name: 'Important', color: '#fb7185', emoji: '🔴' },
  { name: 'Work', color: '#fb923c', emoji: '🟠' },
  { name: 'Resume', color: '#facc15', emoji: '🟡' },
  { name: 'Projects', color: '#4ade80', emoji: '🟢' },
  { name: 'Personal', color: '#38bdf8', emoji: '🔵' },
  { name: 'AI', color: '#c084fc', emoji: '🟣' },
];
const NAV = [
  { label: 'Recents', path: '__recents' }, { label: 'Desktop', path: '/Desktop' },
  { label: 'Documents', path: '/Documents' }, { label: 'Downloads', path: '/Downloads' },
  { label: 'Applications', path: '/Applications' }, { label: 'Projects', path: '/Projects' },
];

const iconFor = (file: VFSFile, large = false) => {
  const c = large ? 'w-10 h-10' : 'w-4 h-4';
  const extension = String(file.extension || '').toLowerCase();
  if (file.type === 'folder') return <Folder className={`${c} text-sky-400 fill-sky-400/15`} />;
  if (/^(jpg|jpeg|png|gif|webp|svg|abkphoto)$/i.test(extension)) return <FileImage className={`${c} text-fuchsia-400`} />;
  if (/^(ts|tsx|js|jsx|json|css|html|py|sql|md)$/i.test(extension)) return <FileCode2 className={`${c} text-amber-300`} />;
  if (/^(abkdoc|txt|doc|pdf|rtf)$/i.test(extension)) return <FileText className={`${c} text-blue-300`} />;
  return <File className={`${c} text-slate-400`} />;
};

const prettySize = (n: number) => n < 1024 ? `${n} B` : n < 1048576 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / 1048576).toFixed(1)} MB`;
const date = (n: number) => new Date(n).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

export const FileExplorerApp: React.FC = () => {
  const { openApp } = useOS();
  const [folder, setFolder] = useState('/Documents');
  const [all, setAll] = useState<VFSFile[]>([]);
  const [query, setQuery] = useState('');
  const [view, setView] = useState<ViewMode>('list');
  const [selected, setSelected] = useState<VFSFile | null>(null);
  const [activeTag, setActiveTag] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [infoOpen, setInfoOpen] = useState(true);
  const [dragged, setDragged] = useState<VFSFile | null>(null);

  const refresh = async () => setAll(await getAllVFSFiles());
  useEffect(() => { refresh(); return subscribeVFS(refresh); }, []);

  const files = useMemo(() => {
    const base = folder === '__recents' ? all.filter(f => !f.deletedAt).sort((a, b) => b.updatedAt - a.updatedAt)
      : folder === '__tag' ? all.filter(f => !f.deletedAt && (f.tags || []).includes(activeTag))
      : folder === '/Recycle Bin' ? all.filter(f => f.deletedAt)
      : all.filter(f => !f.deletedAt && (f.path.substring(0, f.path.lastIndexOf('/')) || '/') === folder);
    const q = query.trim().toLowerCase();
    return base.filter(f => !q || f.name.toLowerCase().includes(q) || f.path.toLowerCase().includes(q));
  }, [all, folder, query, activeTag]);

  const navigate = (path: string) => { setFolder(path); setSelected(null); setQuery(''); };
  const openFile = (file: VFSFile) => file.type === 'folder' ? navigate(file.path) : openApp(getAppForFile(file) as AppId, { filePath: file.path, fileName: file.name });
  const createFile = async () => {
    const name = window.prompt('New file name', 'Untitled.txt')?.trim();
    if (!name || folder.startsWith('__') || folder === '/Recycle Bin') return;
    const ext = name.includes('.') ? name.split('.').pop() || 'txt' : 'txt';
    await createVFSFile(folder, name, '', ext); refresh();
  };
  const createFolder = async () => {
    const name = window.prompt('New folder name', 'New Folder')?.trim();
    if (name && !folder.startsWith('__') && folder !== '/Recycle Bin') await createVFSFolder(folder, name);
  };
  const rename = async (file: VFSFile) => {
    const name = window.prompt('Rename item', file.name)?.trim();
    if (!name || name === file.name) return;
    const parent = file.path.substring(0, file.path.lastIndexOf('/')) || '/';
    await moveVFSFile(file.path, `${parent}/${name}`); setSelected(null); refresh();
  };
  const duplicate = async (file: VFSFile) => {
    const ext = file.extension ? `.${file.extension}` : '';
    await createVFSFile(folder, `${file.name.replace(new RegExp(`${ext.replace('.', '\\.')}$`), '')} copy${ext}`, file.content, file.extension, file.mimeType);
  };
  const remove = async (file: VFSFile) => { await deleteVFSFile(file.path, folder === '/Recycle Bin'); setSelected(null); refresh(); };
  const toggleTag = async (tag: string) => {
    if (!selected) return;
    const tags = selected.tags || [];
    const next = tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag];
    const updated = { ...selected, tags };
    updated.tags = next; await saveVFSFile(updated); setSelected(updated);
  };
  const onDrop = async (target: VFSFile) => {
    if (!dragged || target.type !== 'folder' || dragged.path === target.path) return;
    await moveVFSFile(dragged.path, `${target.path}/${dragged.name}`); setDragged(null); refresh();
  };

  return (
    <div className="h-full flex flex-col bg-[#111318] text-slate-100 text-xs overflow-hidden" onClick={() => {}}>
      <header className="h-14 border-b border-white/10 bg-[#191c23]/95 flex items-center gap-3 px-4 shrink-0">
        <div className="flex gap-1">
          <button className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30" disabled><ArrowLeft className="w-4 h-4" /></button>
          <button className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30" disabled><ArrowRight className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 min-w-0 flex items-center gap-1 bg-black/20 border border-white/10 rounded-xl px-3 py-2">
          <HardDrive className="w-4 h-4 text-sky-400 shrink-0" /><span className="text-slate-400">Macintosh HD</span><ChevronRight className="w-3 h-3 text-slate-600" />
          <span className="font-medium truncate">{folder === '__recents' ? 'Recents' : folder === '__tag' ? activeTag : folder.replace('/', '')}</span>
        </div>
        <div className="relative w-36 sm:w-52">
          <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-500" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search" className="w-full bg-black/20 border border-white/10 rounded-xl pl-8 pr-3 py-2 outline-none focus:border-sky-400/60" />
        </div>
        <button onClick={() => setInfoOpen(v => !v)} className={`p-2 rounded-lg ${infoOpen ? 'bg-sky-500/20 text-sky-300' : 'hover:bg-white/10 text-slate-400'}`} title="Info"><Info className="w-4 h-4" /></button>
      </header>
      <div className="h-11 border-b border-white/10 bg-[#15181e] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-1">
          <button onClick={createFolder} className="p-2 rounded-lg hover:bg-white/10 text-slate-300" title="New folder"><FolderPlus className="w-4 h-4" /></button>
          <button onClick={createFile} className="p-2 rounded-lg hover:bg-white/10 text-slate-300" title="New file"><Plus className="w-4 h-4" /></button>
          <label className="p-2 rounded-lg hover:bg-white/10 text-slate-300 cursor-pointer" title="Upload"><Upload className="w-4 h-4" /><input className="hidden" type="file" onChange={e => { const f = e.target.files?.[0]; if (!f || folder.startsWith('__')) return; const r = new FileReader(); r.onload = () => createVFSFile(folder, f.name, String(r.result || ''), f.name.split('.').pop() || 'txt', f.type); r.readAsText(f); }} /></label>
          {folder === '/Recycle Bin' && <button onClick={() => { emptyVFSRecycleBin(); refresh(); }} className="p-2 rounded-lg hover:bg-red-500/20 text-red-300" title="Empty trash"><Trash2 className="w-4 h-4" /></button>}
          <button onClick={refresh} className="p-2 rounded-lg hover:bg-white/10 text-slate-400" title="Refresh"><RefreshCw className="w-3.5 h-3.5" /></button>
        </div>
        <div className="flex items-center gap-1 bg-black/20 rounded-lg p-1 border border-white/10">
          {([[LayoutList, 'list'], [Grid2X2, 'grid'], [FileImage, 'gallery'], [Columns3, 'columns']] as const).map(([Icon, mode]) => <button key={mode} onClick={() => setView(mode)} className={`p-1.5 rounded ${view === mode ? 'bg-sky-500/25 text-sky-300' : 'text-slate-500 hover:text-slate-200'}`} title={`${mode} view`}><Icon className="w-3.5 h-3.5" /></button>)}
        </div>
      </div>
      <div className="flex flex-1 min-h-0">
        {sidebarOpen && <aside className="w-52 shrink-0 border-r border-white/10 bg-[#15181e] p-3 overflow-y-auto">
          <button onClick={() => setSidebarOpen(false)} className="float-right text-slate-600 hover:text-slate-300"><X className="w-3.5 h-3.5" /></button>
          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-2">Favorites</div>
          <div className="space-y-0.5">{NAV.map((n, i) => <button key={n.path} onClick={() => navigate(n.path)} className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left ${folder === n.path ? 'bg-sky-500/15 text-sky-300' : 'text-slate-300 hover:bg-white/5'}`}><span className="text-slate-500">{i === 0 ? <Star className="w-3.5 h-3.5" /> : <Folder className="w-3.5 h-3.5" />}</span>{n.label}<span className="ml-auto text-[10px] text-slate-600">{n.path === '__recents' ? all.filter(f => !f.deletedAt).length : ''}</span></button>)}</div>
          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mt-5 mb-2">Locations</div>
          <button onClick={() => navigate('/Recycle Bin')} className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left ${folder === '/Recycle Bin' ? 'bg-red-500/15 text-red-300' : 'text-slate-300 hover:bg-white/5'}`}><Trash2 className="w-3.5 h-3.5 text-slate-500" />Trash</button>
          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mt-5 mb-2">Tags</div>
          {TAGS.map(tag => <button key={tag.name} onClick={() => { setActiveTag(tag.name); navigate('__tag'); }} className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left ${folder === '__tag' && activeTag === tag.name ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5'}`}><span className="w-3 text-center">{tag.emoji}</span><span>{tag.name}</span></button>)}
        </aside>}
        <main className="flex-1 overflow-auto p-4" onDragOver={e => e.preventDefault()}>
          {!sidebarOpen && <button onClick={() => setSidebarOpen(true)} className="mb-3 p-2 rounded-lg hover:bg-white/10"><List className="w-4 h-4" /></button>}
          <div className="flex items-center justify-between mb-3"><div className="text-slate-400">{files.length} item{files.length === 1 ? '' : 's'}</div><div className="text-slate-600">{folder === '__recents' ? 'Recently modified' : 'Synced with Virtual File System'}</div></div>
          {files.length === 0 ? <div className="h-2/3 flex flex-col items-center justify-center text-slate-600"><FolderOpen className="w-12 h-12 mb-3 opacity-40" /><p>{query ? 'No matching files' : 'This folder is empty'}</p></div> :
            view === 'list' ? <div className="rounded-xl border border-white/10 overflow-hidden">{files.map(f => <Row key={f.path} file={f} selected={selected?.path === f.path} onSelect={setSelected} onOpen={openFile} onRename={rename} onDrag={setDragged} onDrop={onDrop} />)}</div> :
            view === 'gallery' ? <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">{files.map(f => <Card key={f.path} file={f} selected={selected?.path === f.path} onSelect={setSelected} onOpen={openFile} onDrop={onDrop} onDrag={setDragged} gallery />)}</div> :
            view === 'columns' ? <div className="flex gap-2">{[folder, ...files.filter(f => f.type === 'folder').map(f => f.path)].map((p, i) => <div key={p} className="min-w-48 flex-1 rounded-xl border border-white/10 p-2"><div className="text-[10px] text-slate-500 px-2 pb-2">{p.replace('/', '') || 'Root'}</div>{(i === 0 ? files : all.filter(f => f.path.startsWith(`${p}/`) && f.path.split('/').length === p.split('/').length + 2)).map(f => <button key={f.path} onClick={() => f.type === 'folder' ? navigate(f.path) : setSelected(f)} className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-white/10 text-left truncate">{iconFor(f)}<span className="truncate">{f.name}</span></button>)}</div>)}</div> :
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">{files.map(f => <Card key={f.path} file={f} selected={selected?.path === f.path} onSelect={setSelected} onOpen={openFile} onDrop={onDrop} onDrag={setDragged} />)}</div>}
        </main>
        {infoOpen && selected && <aside className="w-56 shrink-0 border-l border-white/10 bg-[#15181e] p-4 overflow-y-auto"><button onClick={() => setSelected(null)} className="float-right text-slate-500"><X className="w-3.5 h-3.5" /></button><div className="pt-5 flex justify-center">{iconFor(selected, true)}</div><h3 className="font-semibold text-center mt-3 break-words">{selected.name}</h3><p className="text-center text-[10px] text-slate-500 mt-1">{selected.type === 'folder' ? 'Folder' : `${String(selected.extension || 'file').toUpperCase()} • ${prettySize(selected.size || 0)}`}</p><div className="border-t border-white/10 mt-4 pt-3 space-y-2 text-[11px]"><p className="text-slate-500">Modified <span className="text-slate-300 float-right">{date(selected.updatedAt)}</span></p><p className="text-slate-500">Location <span className="text-slate-300 float-right max-w-24 truncate">{selected.path.split('/').slice(1, -1).join('/') || 'Home'}</span></p></div><div className="flex gap-1 mt-4"><button onClick={() => rename(selected)} className="flex-1 p-2 rounded-lg bg-white/5 hover:bg-white/10"><Pencil className="w-3.5 h-3.5 mx-auto" /></button><button onClick={() => duplicate(selected)} className="flex-1 p-2 rounded-lg bg-white/5 hover:bg-white/10"><Copy className="w-3.5 h-3.5 mx-auto" /></button><button onClick={() => remove(selected)} className="flex-1 p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300"><Trash2 className="w-3.5 h-3.5 mx-auto" /></button></div><div className="mt-5"><div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Tags</div><div className="flex flex-wrap gap-1">{TAGS.map(t => <button key={t.name} onClick={() => toggleTag(t.name)} className={`px-2 py-1 rounded-full text-[10px] ${selected.tags?.includes(t.name) ? 'bg-sky-500/25 text-sky-300' : 'bg-white/5 text-slate-500 hover:text-slate-300'}`}>{t.emoji} {t.name}</button>)}</div></div></aside>}
      </div>
    </div>
  );
};

function Row({ file, selected, onSelect, onOpen, onRename, onDrag, onDrop }: { file: VFSFile; selected: boolean; onSelect: (f: VFSFile) => void; onOpen: (f: VFSFile) => void; onRename: (f: VFSFile) => void; onDrag: (f: VFSFile) => void; onDrop: (f: VFSFile) => void }) {
  return <div draggable onDragStart={() => onDrag(file)} onDragOver={e => e.preventDefault()} onDrop={() => onDrop(file)} onClick={() => onSelect(file)} onDoubleClick={() => onOpen(file)} className={`group relative grid grid-cols-[minmax(0,1fr)_120px_100px_70px] items-center gap-3 px-3 py-2.5 border-b border-white/5 last:border-0 cursor-pointer ${selected ? 'bg-sky-500/15' : 'hover:bg-white/5'}`}><div className="flex items-center gap-3 min-w-0">{iconFor(file)}<span className="truncate">{file.name}</span>{file.tags?.map(t => <span key={t} className="hidden sm:inline-block rounded-full bg-sky-400/10 text-sky-300 px-1.5 text-[9px]">{t}</span>)}</div><span className="text-slate-500 truncate">{file.type === 'folder' ? 'Folder' : String(file.extension || 'FILE').toUpperCase()}</span><span className="text-slate-500">{date(file.updatedAt)}</span><span className="text-slate-500 text-right">{file.type === 'folder' ? '—' : prettySize(file.size || 0)}</span><button onClick={e => { e.stopPropagation(); onRename(file); }} className="absolute right-2 hidden group-hover:block p-1 rounded hover:bg-white/10"><MoreHorizontal className="w-3.5 h-3.5" /></button></div>;
}

function Card({ file, selected, onSelect, onOpen, onDrop, onDrag, gallery = false }: { file: VFSFile; selected: boolean; onSelect: (f: VFSFile) => void; onOpen: (f: VFSFile) => void; onDrop: (f: VFSFile) => void; onDrag: (f: VFSFile) => void; gallery?: boolean }) {
  const image = file.thumbnail || (file.mimeType?.startsWith('image/') ? file.content : '');
  return <div draggable onDragStart={() => onDrag(file)} onDragOver={e => e.preventDefault()} onDrop={() => onDrop(file)} onClick={() => onSelect(file)} onDoubleClick={() => onOpen(file)} className={`group rounded-xl border p-3 cursor-pointer transition-all hover:-translate-y-0.5 hover:border-white/20 ${selected ? 'border-sky-400 bg-sky-500/15 shadow-lg shadow-sky-500/10' : 'border-white/10 bg-white/[.02]'}`}><div className={`rounded-lg bg-black/20 flex items-center justify-center overflow-hidden ${gallery ? 'h-32' : 'h-20'}`}>{image ? <img src={image} alt="" className="h-full w-full object-cover" /> : iconFor(file, true)}</div><div className="mt-2 truncate font-medium">{file.name}</div><div className="text-[10px] text-slate-500 mt-1">{file.type === 'folder' ? 'Folder' : prettySize(file.size)}</div></div>;
}
