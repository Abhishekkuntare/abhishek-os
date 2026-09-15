import React from 'react';
import { useOS } from '../../context/OSContext';
import {
  Trash2,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Folder,
  FileCode,
} from 'lucide-react';

export const RecycleBinApp: React.FC = () => {
  const { recycleBinItems, emptyRecycleBin, restoreRecycleBinItem, permanentlyDeleteRecycleBinItem } = useOS();

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 select-none overflow-hidden">
      {/* Top action toolbar */}
      <div className="h-11 px-4 border-b border-white/10 bg-slate-900/80 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Trash2 className="w-4 h-4 text-sky-400" />
          <span className="font-semibold">Recycle Bin</span>
          <span className="text-slate-500">• {recycleBinItems.length} items</span>
        </div>

        {recycleBinItems.length > 0 && (
          <button
            type="button"
            onClick={emptyRecycleBin}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-600/30 hover:bg-red-600/50 text-red-300 border border-red-500/30 text-xs font-medium transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Empty Recycle Bin</span>
          </button>
        )}
      </div>

      {/* Main container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {recycleBinItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3 py-12 text-slate-400">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/8 flex items-center justify-center">
              <Trash2 className="w-8 h-8 opacity-40 text-slate-500" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-200">
                Recycle Bin is empty.
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                No archived or deleted project files found. Items deleted from the Portfolio Control Center will reside here safely until purged.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
              Archived Items ({recycleBinItems.length})
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden divide-y divide-white/5 text-xs">
              {recycleBinItems.map(item => (
                <div
                  key={item.id}
                  className="p-3.5 flex items-center justify-between hover:bg-white/5 transition-colors gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center shrink-0">
                      <FileCode className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="truncate">
                      <div className="font-semibold text-slate-200 truncate">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Deleted on {new Date(item.deletedAt).toLocaleDateString()} ({item.originalType})
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => restoreRecycleBinItem(item.id)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs border border-white/10 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restore</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Permanently delete "${item.name}"?`)) {
                          permanentlyDeleteRecycleBinItem(item.id);
                        }
                      }}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-950/50 hover:bg-red-900/70 text-red-300 text-xs border border-red-500/20 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete permanently</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
