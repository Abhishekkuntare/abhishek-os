import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useOS } from '../../context/OSContext';

import {
  Trash2,
  RotateCcw,
  Search,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  List,
  Grid3X3,
  Check,
  X,
  AlertTriangle,
  File,
  FileCode2,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Folder,
  Archive,
  FileSpreadsheet,
  FileType,
  HardDrive,
  Clock3,
  CalendarDays,
  ShieldCheck,
  Info,
  ArrowUpDown,
  CheckSquare,
  Square,
  Undo2,
  Trash,
  Loader2,
} from 'lucide-react';

/* =========================================================
   TYPES
========================================================= */

type RecycleBinItem = {
  id: string;
  name: string;
  deletedAt: string | number | Date;
  originalType?: string;
  type?: string;
  size?: number;
  originalPath?: string;
  path?: string;
  extension?: string;
  isFolder?: boolean;
};

type ViewMode = 'list' | 'grid';

type SortField = 'name' | 'deletedAt' | 'type' | 'size';

type SortDirection = 'asc' | 'desc';

type ConfirmAction =
  | {
      type: 'delete';
      ids: string[];
      title: string;
      message: string;
    }
  | {
      type: 'empty';
      ids: string[];
      title: string;
      message: string;
    }
  | null;

/* =========================================================
   HELPERS
========================================================= */

const getFileExtension = (item: RecycleBinItem) => {
  if (item.extension) {
    return item.extension.toLowerCase().replace('.', '');
  }

  const name = item.name || '';

  if (!name.includes('.')) {
    return '';
  }

  return name.split('.').pop()?.toLowerCase() || '';
};

const getItemType = (item: RecycleBinItem) => {
  if (item.isFolder) return 'Folder';

  if (item.originalType) {
    return item.originalType;
  }

  const extension = getFileExtension(item);

  if (!extension) return 'File';

  const imageExtensions = [
    'png',
    'jpg',
    'jpeg',
    'gif',
    'webp',
    'svg',
    'bmp',
    'ico',
  ];

  const videoExtensions = [
    'mp4',
    'mov',
    'avi',
    'mkv',
    'webm',
  ];

  const audioExtensions = [
    'mp3',
    'wav',
    'ogg',
    'aac',
    'flac',
  ];

  const documentExtensions = [
    'txt',
    'doc',
    'docx',
    'pdf',
    'rtf',
  ];

  const spreadsheetExtensions = [
    'xls',
    'xlsx',
    'csv',
  ];

  const archiveExtensions = [
    'zip',
    'rar',
    '7z',
    'tar',
    'gz',
  ];

  const codeExtensions = [
    'js',
    'jsx',
    'ts',
    'tsx',
    'html',
    'css',
    'scss',
    'json',
    'py',
    'java',
    'cpp',
    'c',
  ];

  if (imageExtensions.includes(extension)) return 'Image';
  if (videoExtensions.includes(extension)) return 'Video';
  if (audioExtensions.includes(extension)) return 'Audio';
  if (documentExtensions.includes(extension)) return 'Document';
  if (spreadsheetExtensions.includes(extension)) return 'Spreadsheet';
  if (archiveExtensions.includes(extension)) return 'Archive';
  if (codeExtensions.includes(extension)) return 'Code';

  return extension.toUpperCase() + ' File';
};

const getItemIcon = (item: RecycleBinItem, large = false) => {
  const type = getItemType(item);

  const size = large ? 'w-10 h-10' : 'w-5 h-5';

  if (type === 'Folder') {
    return <Folder className={`${size} text-yellow-400`} />;
  }

  switch (type) {
    case 'Image':
      return <ImageIcon className={`${size} text-purple-400`} />;

    case 'Video':
      return <Video className={`${size} text-pink-400`} />;

    case 'Audio':
      return <Music className={`${size} text-cyan-400`} />;

    case 'Document':
      return <FileText className={`${size} text-blue-400`} />;

    case 'Spreadsheet':
      return <FileSpreadsheet className={`${size} text-emerald-400`} />;

    case 'Archive':
      return <Archive className={`${size} text-orange-400`} />;

    case 'Code':
      return <FileCode2 className={`${size} text-sky-400`} />;

    default:
      return <File className={`${size} text-slate-400`} />;
  }
};

const formatDate = (value: string | number | Date) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Unknown date';
  }

  return date.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatTime = (value: string | number | Date) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDateTime = (value: string | number | Date) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Unknown';
  }

  return `${formatDate(value)} at ${formatTime(value)}`;
};

const formatBytes = (bytes?: number) => {
  if (!bytes || bytes <= 0) {
    return 'Unknown size';
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];

  const index = Math.floor(
    Math.log(bytes) / Math.log(1024)
  );

  const safeIndex = Math.min(index, units.length - 1);

  return `${(bytes / Math.pow(1024, safeIndex)).toFixed(
    safeIndex === 0 ? 0 : 1
  )} ${units[safeIndex]}`;
};

const getItemPath = (item: RecycleBinItem) => {
  return item.originalPath || item.path || 'Original location unavailable';
};

/* =========================================================
   COMPONENT
========================================================= */

export const RecycleBinApp: React.FC = () => {
  const {
    recycleBinItems,
    emptyRecycleBin,
    restoreRecycleBinItem,
    permanentlyDeleteRecycleBinItem,
  } = useOS();

  const items = (recycleBinItems || []) as RecycleBinItem[];

  /* =======================================================
     STATE
  ======================================================= */

  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set()
  );

  const [searchQuery, setSearchQuery] = useState('');

  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const [sortField, setSortField] =
    useState<SortField>('deletedAt');

  const [sortDirection, setSortDirection] =
    useState<SortDirection>('desc');

  const [showSortMenu, setShowSortMenu] = useState(false);

  const [showViewMenu, setShowViewMenu] = useState(false);

  const [showDetails, setShowDetails] = useState(false);

  const [detailsItem, setDetailsItem] =
    useState<RecycleBinItem | null>(null);

  const [confirmAction, setConfirmAction] =
    useState<ConfirmAction>(null);

  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'danger' | 'info';
  } | null>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);

  /* =======================================================
     TOAST
  ======================================================= */

  const showToast = useCallback(
    (
      message: string,
      type: 'success' | 'danger' | 'info' = 'info'
    ) => {
      setToast({
        message,
        type,
      });

      window.setTimeout(() => {
        setToast(null);
      }, 2600);
    },
    []
  );

  /* =======================================================
     FILTER + SORT
  ======================================================= */

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = items.filter(item => {
      if (!query) return true;

      const name = item.name?.toLowerCase() || '';
      const type = getItemType(item).toLowerCase();
      const path = getItemPath(item).toLowerCase();

      return (
        name.includes(query) ||
        type.includes(query) ||
        path.includes(query)
      );
    });

    filtered.sort((a, b) => {
      let result = 0;

      if (sortField === 'name') {
        result = a.name.localeCompare(b.name);
      }

      if (sortField === 'deletedAt') {
        result =
          new Date(a.deletedAt).getTime() -
          new Date(b.deletedAt).getTime();
      }

      if (sortField === 'type') {
        result = getItemType(a).localeCompare(
          getItemType(b)
        );
      }

      if (sortField === 'size') {
        result = (a.size || 0) - (b.size || 0);
      }

      return sortDirection === 'asc' ? result : -result;
    });

    return filtered;
  }, [
    items,
    searchQuery,
    sortField,
    sortDirection,
  ]);

  /* =======================================================
     SELECTED ITEMS
  ======================================================= */

  const selectedItems = useMemo(() => {
    return items.filter(item =>
      selectedIds.has(item.id)
    );
  }, [items, selectedIds]);

  const allVisibleSelected =
    filteredItems.length > 0 &&
    filteredItems.every(item =>
      selectedIds.has(item.id)
    );

  const someVisibleSelected =
    filteredItems.some(item =>
      selectedIds.has(item.id)
    ) && !allVisibleSelected;

  /* =======================================================
     KEEP SELECTION VALID
  ======================================================= */

  useEffect(() => {
    setSelectedIds(previous => {
      const validIds = new Set(items.map(item => item.id));

      const next = new Set(
        [...previous].filter(id => validIds.has(id))
      );

      if (next.size === previous.size) {
        return previous;
      }

      return next;
    });

    if (
      detailsItem &&
      !items.some(item => item.id === detailsItem.id)
    ) {
      setDetailsItem(null);
    }
  }, [items, detailsItem]);

  /* =======================================================
     KEYBOARD SHORTCUTS
  ======================================================= */

  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;

      const isTyping =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable;

      if (isTyping) {
        return;
      }

      /* Ctrl + A */
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === 'a'
      ) {
        event.preventDefault();

        setSelectedIds(
          new Set(filteredItems.map(item => item.id))
        );

        return;
      }

      /* Escape */
      if (event.key === 'Escape') {
        setSelectedIds(new Set());
        setShowSortMenu(false);
        setShowViewMenu(false);
        return;
      }

      /* Delete */
      if (
        event.key === 'Delete' &&
        selectedIds.size > 0
      ) {
        event.preventDefault();

        setConfirmAction({
          type: 'delete',
          ids: [...selectedIds],
          title: 'Delete permanently?',
          message:
            selectedIds.size === 1
              ? 'This item will be permanently deleted. This action cannot be undone.'
              : `${selectedIds.size} items will be permanently deleted. This action cannot be undone.`,
        });

        return;
      }

      /* R = Restore */
      if (
        event.key.toLowerCase() === 'r' &&
        selectedIds.size > 0
      ) {
        event.preventDefault();

        handleRestoreSelected();
      }
    };

    window.addEventListener(
      'keydown',
      handleKeyboard
    );

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyboard
      );
    };
  }, [filteredItems, selectedIds]);

  /* =======================================================
     SELECT ITEM
  ======================================================= */

  const toggleItemSelection = (
    id: string,
    multi = true
  ) => {
    setSelectedIds(previous => {
      const next = multi
        ? new Set(previous)
        : new Set<string>();

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  const selectItem = (
    item: RecycleBinItem,
    event?: React.MouseEvent
  ) => {
    if (event?.shiftKey) {
      toggleItemSelection(item.id, true);
      return;
    }

    if (event?.ctrlKey || event?.metaKey) {
      toggleItemSelection(item.id, true);
      return;
    }

    setSelectedIds(new Set([item.id]));
  };

  /* =======================================================
     SELECT ALL
  ======================================================= */

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      setSelectedIds(previous => {
        const next = new Set(previous);

        filteredItems.forEach(item => {
          next.delete(item.id);
        });

        return next;
      });
    } else {
      setSelectedIds(previous => {
        const next = new Set(previous);

        filteredItems.forEach(item => {
          next.add(item.id);
        });

        return next;
      });
    }
  };

  /* =======================================================
     RESTORE
  ======================================================= */

  const handleRestoreSelected = useCallback(() => {
    if (selectedIds.size === 0) {
      return;
    }

    const ids = [...selectedIds];

    ids.forEach(id => {
      restoreRecycleBinItem(id);
    });

    setSelectedIds(new Set());

    showToast(
      ids.length === 1
        ? 'Item restored successfully'
        : `${ids.length} items restored successfully`,
      'success'
    );
  }, [
    selectedIds,
    restoreRecycleBinItem,
    showToast,
  ]);

  const handleRestoreSingle = (
    item: RecycleBinItem
  ) => {
    restoreRecycleBinItem(item.id);

    setSelectedIds(previous => {
      const next = new Set(previous);
      next.delete(item.id);
      return next;
    });

    if (detailsItem?.id === item.id) {
      setDetailsItem(null);
    }

    showToast(
      `"${item.name}" restored successfully`,
      'success'
    );
  };

  /* =======================================================
     PERMANENT DELETE
  ======================================================= */

  const openDeleteSelected = () => {
    if (selectedIds.size === 0) {
      return;
    }

    setConfirmAction({
      type: 'delete',
      ids: [...selectedIds],
      title:
        selectedIds.size === 1
          ? 'Delete permanently?'
          : `Delete ${selectedIds.size} items permanently?`,
      message:
        selectedIds.size === 1
          ? 'The selected item will be permanently deleted. This action cannot be undone.'
          : `${selectedIds.size} selected items will be permanently deleted. This action cannot be undone.`,
    });
  };

  const openDeleteSingle = (
    item: RecycleBinItem
  ) => {
    setConfirmAction({
      type: 'delete',
      ids: [item.id],
      title: 'Delete permanently?',
      message: `"${item.name}" will be permanently deleted. This action cannot be undone.`,
    });
  };

  /* =======================================================
     EMPTY BIN
  ======================================================= */

  const openEmptyBin = () => {
    if (items.length === 0) {
      return;
    }

    setConfirmAction({
      type: 'empty',
      ids: items.map(item => item.id),
      title: 'Empty Recycle Bin?',
      message:
        'All items in the Recycle Bin will be permanently deleted. This action cannot be undone.',
    });
  };

  /* =======================================================
     CONFIRM ACTION
  ======================================================= */

  const executeConfirmAction = () => {
    if (!confirmAction) {
      return;
    }

    if (confirmAction.type === 'delete') {
      confirmAction.ids.forEach(id => {
        permanentlyDeleteRecycleBinItem(id);
      });

      const count = confirmAction.ids.length;

      setSelectedIds(new Set());

      setConfirmAction(null);

      showToast(
        count === 1
          ? 'Item permanently deleted'
          : `${count} items permanently deleted`,
        'danger'
      );

      return;
    }

    if (confirmAction.type === 'empty') {
      emptyRecycleBin();

      setSelectedIds(new Set());

      setConfirmAction(null);

      showToast(
        'Recycle Bin emptied successfully',
        'danger'
      );
    }
  };

  /* =======================================================
     REFRESH
  ======================================================= */

  const handleRefresh = () => {
    setIsRefreshing(true);

    window.setTimeout(() => {
      setIsRefreshing(false);

      showToast(
        'Recycle Bin refreshed',
        'info'
      );
    }, 500);
  };

  /* =======================================================
     SORT
  ======================================================= */

  const changeSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(previous =>
        previous === 'asc' ? 'desc' : 'asc'
      );
    } else {
      setSortField(field);
      setSortDirection(
        field === 'name' ? 'asc' : 'desc'
      );
    }

    setShowSortMenu(false);
  };

  /* =======================================================
     OPEN DETAILS
  ======================================================= */

  const openDetails = (item: RecycleBinItem) => {
    setDetailsItem(item);
    setShowDetails(true);
    setSelectedIds(new Set([item.id]));
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#111111] text-white select-none">
      {/* =====================================================
          ANIMATION STYLES
      ===================================================== */}

      <style>
        {`
          @keyframes recycleFadeIn {
            from {
              opacity: 0;
              transform: translateY(6px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes recycleScaleIn {
            from {
              opacity: 0;
              transform: scale(.96);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes recycleSlideUp {
            from {
              opacity: 0;
              transform: translateY(14px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes recycleToast {
            from {
              opacity: 0;
              transform: translate(-50%, 10px) scale(.97);
            }
            to {
              opacity: 1;
              transform: translate(-50%, 0) scale(1);
            }
          }

          @keyframes recycleSpin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          .recycle-fade-in {
            animation: recycleFadeIn .22s ease-out both;
          }

          .recycle-scale-in {
            animation: recycleScaleIn .18s ease-out both;
          }

          .recycle-slide-up {
            animation: recycleSlideUp .24s ease-out both;
          }

          .recycle-toast {
            animation: recycleToast .25s ease-out both;
          }

          .recycle-spin {
            animation: recycleSpin .8s linear infinite;
          }

          .recycle-scroll::-webkit-scrollbar {
            width: 9px;
            height: 9px;
          }

          .recycle-scroll::-webkit-scrollbar-track {
            background: transparent;
          }

          .recycle-scroll::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,.13);
            border-radius: 999px;
          }

          .recycle-scroll::-webkit-scrollbar-thumb:hover {
            background: rgba(255,255,255,.22);
          }
        `}
      </style>

      {/* =====================================================
          TOP COMMAND BAR
      ===================================================== */}

      <div className="relative z-20 flex min-h-[52px] shrink-0 items-center gap-2 border-b border-white/[0.07] bg-[#181818]/95 px-3 backdrop-blur-xl sm:px-4">
        {/* Bin icon */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400/15 to-blue-500/10 ring-1 ring-white/10">
          <Trash2 className="h-4 w-4 text-cyan-300" />
        </div>

        {/* Title */}
        <div className="hidden min-w-0 sm:block">
          <div className="text-[13px] font-semibold leading-4 text-white">
            Recycle Bin
          </div>

          <div className="text-[10px] text-white/40">
            {items.length}{' '}
            {items.length === 1
              ? 'item'
              : 'items'}
          </div>
        </div>

        {/* Separator */}
        <div className="mx-1 hidden h-6 w-px bg-white/10 md:block" />

        {/* Restore */}
        <button
          type="button"
          disabled={selectedIds.size === 0}
          onClick={handleRestoreSelected}
          title="Restore selected"
          className={`
            group flex h-8 items-center gap-2 rounded-lg px-2.5
            text-xs transition-all duration-200
            ${
              selectedIds.size > 0
                ? 'text-white hover:bg-white/10 active:scale-95'
                : 'cursor-not-allowed text-white/25'
            }
          `}
        >
          <RotateCcw className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-45" />

          <span className="hidden lg:inline">
            Restore
          </span>
        </button>

        {/* Delete */}
        <button
          type="button"
          disabled={selectedIds.size === 0}
          onClick={openDeleteSelected}
          title="Delete permanently"
          className={`
            group flex h-8 items-center gap-2 rounded-lg px-2.5
            text-xs transition-all duration-200
            ${
              selectedIds.size > 0
                ? 'text-red-300 hover:bg-red-500/10 active:scale-95'
                : 'cursor-not-allowed text-white/25'
            }
          `}
        >
          <Trash className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />

          <span className="hidden lg:inline">
            Delete
          </span>
        </button>

        {/* Select all */}
        <button
          type="button"
          onClick={toggleSelectAll}
          disabled={filteredItems.length === 0}
          title={
            allVisibleSelected
              ? 'Deselect all'
              : 'Select all'
          }
          className={`
            flex h-8 items-center gap-2 rounded-lg px-2.5
            text-xs transition-all
            ${
              filteredItems.length > 0
                ? 'text-white/75 hover:bg-white/10 hover:text-white'
                : 'cursor-not-allowed text-white/20'
            }
          `}
        >
          {allVisibleSelected ? (
            <CheckSquare className="h-4 w-4" />
          ) : someVisibleSelected ? (
            <CheckSquare className="h-4 w-4 text-cyan-300" />
          ) : (
            <Square className="h-4 w-4" />
          )}

          <span className="hidden xl:inline">
            {allVisibleSelected
              ? 'Deselect all'
              : 'Select all'}
          </span>
        </button>

        <div className="mx-1 hidden h-6 w-px bg-white/10 md:block" />

        {/* Empty */}
        <button
          type="button"
          disabled={items.length === 0}
          onClick={openEmptyBin}
          title="Empty Recycle Bin"
          className={`
            flex h-8 items-center gap-2 rounded-lg px-2.5
            text-xs transition-all
            ${
              items.length > 0
                ? 'text-red-300 hover:bg-red-500/10 active:scale-95'
                : 'cursor-not-allowed text-white/20'
            }
          `}
        >
          <Trash2 className="h-4 w-4" />

          <span className="hidden md:inline">
            Empty
          </span>
        </button>

        {/* Refresh */}
        <button
          type="button"
          onClick={handleRefresh}
          title="Refresh"
          className="group flex h-8 w-8 items-center justify-center rounded-lg text-white/60 transition-all hover:bg-white/10 hover:text-white active:scale-90"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              isRefreshing
                ? 'recycle-spin'
                : 'transition-transform duration-300 group-hover:rotate-90'
            }`}
          />
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* View */}
        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setShowViewMenu(value => !value)
            }
            title="View"
            className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-white/70 transition-all hover:bg-white/10 hover:text-white"
          >
            {viewMode === 'list' ? (
              <List className="h-4 w-4" />
            ) : (
              <Grid3X3 className="h-4 w-4" />
            )}

            <span className="hidden lg:inline text-xs">
              View
            </span>

            <ChevronDown className="h-3 w-3 opacity-50" />
          </button>

          {showViewMenu && (
            <div className="absolute right-0 top-10 z-50 w-44 overflow-hidden rounded-xl border border-white/10 bg-[#202020]/95 p-1.5 shadow-2xl backdrop-blur-xl recycle-scale-in">
              <button
                type="button"
                onClick={() => {
                  setViewMode('list');
                  setShowViewMenu(false);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs text-white/80 hover:bg-white/10"
              >
                <List className="h-4 w-4" />
                List view

                {viewMode === 'list' && (
                  <Check className="ml-auto h-4 w-4 text-cyan-300" />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setViewMode('grid');
                  setShowViewMenu(false);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs text-white/80 hover:bg-white/10"
              >
                <Grid3X3 className="h-4 w-4" />
                Grid view

                {viewMode === 'grid' && (
                  <Check className="ml-auto h-4 w-4 text-cyan-300" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Sort */}
        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setShowSortMenu(value => !value)
            }
            title="Sort"
            className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-white/70 transition-all hover:bg-white/10 hover:text-white"
          >
            <ArrowUpDown className="h-4 w-4" />

            <span className="hidden lg:inline text-xs">
              Sort
            </span>

            <ChevronDown className="h-3 w-3 opacity-50" />
          </button>

          {showSortMenu && (
            <div className="absolute right-0 top-10 z-50 w-48 overflow-hidden rounded-xl border border-white/10 bg-[#202020]/95 p-1.5 shadow-2xl backdrop-blur-xl recycle-scale-in">
              <div className="px-3 pb-1.5 pt-2 text-[9px] font-bold uppercase tracking-wider text-white/30">
                Sort by
              </div>

              {[
                ['name', 'Name'],
                ['deletedAt', 'Date deleted'],
                ['type', 'Type'],
                ['size', 'Size'],
              ].map(([field, label]) => (
                <button
                  key={field}
                  type="button"
                  onClick={() =>
                    changeSort(field as SortField)
                  }
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs text-white/80 hover:bg-white/10"
                >
                  <span>{label}</span>

                  {sortField === field && (
                    <span className="ml-auto text-cyan-300">
                      {sortDirection === 'asc'
                        ? '↑'
                        : '↓'}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* More */}
        <button
          type="button"
          title="More options"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/60 transition hover:bg-white/10 hover:text-white"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* =====================================================
          SEARCH BAR
      ===================================================== */}

      <div className="flex shrink-0 items-center gap-3 border-b border-white/[0.06] bg-[#151515] px-3 py-2.5 sm:px-4">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

          <input
            value={searchQuery}
            onChange={event =>
              setSearchQuery(event.target.value)
            }
            placeholder="Search Recycle Bin"
            className="h-9 w-full rounded-lg border border-white/[0.08] bg-white/[0.045] pl-9 pr-9 text-xs text-white outline-none transition placeholder:text-white/30 focus:border-cyan-400/30 focus:bg-white/[0.065] focus:ring-2 focus:ring-cyan-400/10"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-white/40 hover:bg-white/10 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Selection counter */}
        {selectedIds.size > 0 && (
          <div className="hidden shrink-0 items-center gap-1.5 rounded-lg border border-cyan-400/10 bg-cyan-400/[0.06] px-2.5 py-2 text-[10px] text-cyan-200 sm:flex">
            <CheckSquare className="h-3.5 w-3.5" />

            {selectedIds.size} selected
          </div>
        )}
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="flex min-h-0 flex-1">
        <main
          className={`recycle-scroll min-w-0 flex-1 overflow-auto ${
            showDetails ? 'border-r border-white/[0.07]' : ''
          }`}
        >
          {/* Column header */}
          {items.length > 0 && viewMode === 'list' && (
            <div className="sticky top-0 z-10 grid grid-cols-[minmax(220px,1.8fr)_minmax(100px,0.8fr)_minmax(130px,1fr)_40px] border-b border-white/[0.06] bg-[#151515]/95 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-white/35 backdrop-blur-xl">
              <div>Name</div>
              <div>Original location</div>
              <div>Date deleted</div>
              <div />
            </div>
          )}

          {/* Empty */}
          {filteredItems.length === 0 ? (
            <div className="flex min-h-full items-center justify-center p-6">
              <div className="recycle-fade-in flex max-w-md flex-col items-center text-center">
                <div className="relative mb-5 flex h-24 w-24 items-center justify-center rounded-[28px] border border-white/[0.08] bg-white/[0.025] shadow-2xl">
                  <div className="absolute inset-2 rounded-[22px] bg-gradient-to-br from-cyan-400/[0.07] to-transparent" />

                  <Trash2 className="relative h-10 w-10 text-white/20" />
                </div>

                <h2 className="text-sm font-semibold text-white/85">
                  {searchQuery
                    ? 'No items found'
                    : 'Recycle Bin is empty'}
                </h2>

                <p className="mt-2 max-w-sm text-xs leading-5 text-white/35">
                  {searchQuery
                    ? `No deleted items match "${searchQuery}". Try a different search.`
                    : 'Items you delete from your workspace will appear here. You can restore them or permanently remove them.'}
                </p>

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="mt-4 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-white/70 transition hover:bg-white/[0.08] hover:text-white"
                  >
                    Clear search
                  </button>
                )}
              </div>
            </div>
          ) : viewMode === 'list' ? (
            /* =================================================
               LIST VIEW
            ================================================= */

            <div className="divide-y divide-white/[0.045]">
              {filteredItems.map((item, index) => {
                const isSelected =
                  selectedIds.has(item.id);

                return (
                  <div
                    key={item.id}
                    onClick={event =>
                      selectItem(item, event)
                    }
                    onDoubleClick={() =>
                      openDetails(item)
                    }
                    className={`
                      group relative grid cursor-pointer
                      grid-cols-[minmax(220px,1.8fr)_minmax(100px,0.8fr)_minmax(130px,1fr)_40px]
                      items-center gap-0 px-4 py-3
                      transition-all duration-150
                      recycle-fade-in
                      ${
                        isSelected
                          ? 'bg-cyan-400/[0.08]'
                          : 'hover:bg-white/[0.035]'
                      }
                    `}
                    style={{
                      animationDelay: `${Math.min(
                        index * 18,
                        220
                      )}ms`,
                    }}
                  >
                    {/* selection indicator */}
                    <div
                      className={`
                        absolute left-0 top-0 h-full w-0.5
                        transition-all duration-150
                        ${
                          isSelected
                            ? 'bg-cyan-300'
                            : 'bg-transparent'
                        }
                      `}
                    />

                    {/* NAME */}
                    <div className="flex min-w-0 items-center gap-3 pr-3">
                      <div
                        className={`
                          flex h-9 w-9 shrink-0 items-center justify-center rounded-lg
                          border transition-all duration-200
                          ${
                            isSelected
                              ? 'border-cyan-300/20 bg-cyan-300/10'
                              : 'border-white/[0.07] bg-white/[0.035] group-hover:border-white/10 group-hover:bg-white/[0.06]'
                          }
                        `}
                      >
                        {getItemIcon(item)}
                      </div>

                      <div className="min-w-0">
                        <div
                          className={`truncate text-xs font-medium ${
                            isSelected
                              ? 'text-cyan-100'
                              : 'text-white/85'
                          }`}
                        >
                          {item.name}
                        </div>

                        <div className="mt-0.5 truncate text-[10px] text-white/30">
                          {getItemType(item)}
                          {item.size
                            ? ` • ${formatBytes(
                                item.size
                              )}`
                            : ''}
                        </div>
                      </div>
                    </div>

                    {/* LOCATION */}
                    <div className="min-w-0 pr-3">
                      <div className="truncate text-[11px] text-white/45">
                        {getItemPath(item)}
                      </div>
                    </div>

                    {/* DATE */}
                    <div className="min-w-0">
                      <div className="text-[11px] text-white/55">
                        {formatDate(item.deletedAt)}
                      </div>

                      <div className="mt-0.5 text-[10px] text-white/25">
                        {formatTime(item.deletedAt)}
                      </div>
                    </div>

                    {/* MORE */}
                    <button
                      type="button"
                      onClick={event => {
                        event.stopPropagation();
                        openDetails(item);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-white/20 opacity-0 transition-all hover:bg-white/10 hover:text-white group-hover:opacity-100"
                      title="Details"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            /* =================================================
               GRID VIEW
            ================================================= */

            <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredItems.map((item, index) => {
                const isSelected =
                  selectedIds.has(item.id);

                return (
                  <div
                    key={item.id}
                    onClick={event =>
                      selectItem(item, event)
                    }
                    onDoubleClick={() =>
                      openDetails(item)
                    }
                    className={`
                      group relative cursor-pointer overflow-hidden rounded-2xl
                      border p-4 transition-all duration-200
                      recycle-slide-up
                      ${
                        isSelected
                          ? 'border-cyan-300/25 bg-cyan-300/[0.08] shadow-lg shadow-cyan-500/[0.05]'
                          : 'border-white/[0.07] bg-white/[0.025] hover:-translate-y-0.5 hover:border-white/[0.13] hover:bg-white/[0.05]'
                      }
                    `}
                    style={{
                      animationDelay: `${Math.min(
                        index * 25,
                        300
                      )}ms`,
                    }}
                  >
                    {/* Selection */}
                    <div className="absolute right-2 top-2">
                      <div
                        className={`
                          flex h-5 w-5 items-center justify-center rounded-md border
                          transition-all
                          ${
                            isSelected
                              ? 'border-cyan-300/50 bg-cyan-300 text-black'
                              : 'border-white/10 bg-black/10 opacity-0 group-hover:opacity-100'
                          }
                        `}
                      >
                        {isSelected && (
                          <Check className="h-3 w-3" />
                        )}
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="flex h-28 items-center justify-center">
                      <div
                        className={`
                          flex h-20 w-20 items-center justify-center rounded-2xl
                          border transition-all duration-300
                          ${
                            isSelected
                              ? 'border-cyan-300/15 bg-cyan-300/[0.08] scale-105'
                              : 'border-white/[0.06] bg-white/[0.025] group-hover:scale-105 group-hover:bg-white/[0.045]'
                          }
                        `}
                      >
                        {getItemIcon(item, true)}
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="truncate text-xs font-semibold text-white/85">
                        {item.name}
                      </div>

                      <div className="mt-1 truncate text-[10px] text-white/30">
                        {getItemType(item)}
                      </div>

                      <div className="mt-2 flex items-center gap-1.5 text-[9px] text-white/25">
                        <Clock3 className="h-3 w-3" />

                        {formatDate(item.deletedAt)}
                      </div>
                    </div>

                    <div className="mt-3 flex gap-1.5">
                      <button
                        type="button"
                        onClick={event => {
                          event.stopPropagation();
                          handleRestoreSingle(item);
                        }}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-cyan-400/10 bg-cyan-400/[0.05] py-1.5 text-[10px] text-cyan-200 transition hover:bg-cyan-400/10"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Restore
                      </button>

                      <button
                        type="button"
                        onClick={event => {
                          event.stopPropagation();
                          openDeleteSingle(item);
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-400/10 bg-red-400/[0.04] text-red-300 transition hover:bg-red-400/10"
                        title="Delete permanently"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        {/* ===================================================
            DETAILS PANEL
        =================================================== */}

        {showDetails && detailsItem && (
          <aside className="hidden w-[300px] shrink-0 bg-[#151515] lg:block recycle-slide-up">
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex h-12 shrink-0 items-center justify-between border-b border-white/[0.07] px-4">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-cyan-300" />

                  <span className="text-xs font-semibold text-white/80">
                    Details
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowDetails(false);
                    setDetailsItem(null);
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-white/35 hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Details content */}
              <div className="recycle-scroll flex-1 overflow-auto p-5">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-white/[0.08] bg-white/[0.03]">
                    {getItemIcon(
                      detailsItem,
                      true
                    )}
                  </div>

                  <h3 className="mt-4 max-w-full break-words text-sm font-semibold text-white/90">
                    {detailsItem.name}
                  </h3>

                  <div className="mt-1 text-[10px] text-white/30">
                    {getItemType(detailsItem)}
                  </div>
                </div>

                <div className="mt-7 space-y-4">
                  <DetailRow
                    icon={
                      <CalendarDays className="h-3.5 w-3.5" />
                    }
                    label="Deleted"
                    value={formatDateTime(
                      detailsItem.deletedAt
                    )}
                  />

                  <DetailRow
                    icon={
                      <HardDrive className="h-3.5 w-3.5" />
                    }
                    label="Original location"
                    value={getItemPath(
                      detailsItem
                    )}
                  />

                  <DetailRow
                    icon={
                      <FileType className="h-3.5 w-3.5" />
                    }
                    label="Type"
                    value={getItemType(
                      detailsItem
                    )}
                  />

                  <DetailRow
                    icon={
                      <Archive className="h-3.5 w-3.5" />
                    }
                    label="Size"
                    value={formatBytes(
                      detailsItem.size
                    )}
                  />
                </div>

                {/* Safety message */}
                <div className="mt-7 rounded-xl border border-cyan-400/10 bg-cyan-400/[0.035] p-3">
                  <div className="flex gap-2">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />

                    <div>
                      <div className="text-[10px] font-semibold text-cyan-200">
                        Recycle Bin protection
                      </div>

                      <p className="mt-1 text-[9px] leading-4 text-white/35">
                        Restore keeps the item available.
                        Permanent deletion cannot be
                        undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="shrink-0 border-t border-white/[0.07] p-3">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleRestoreSingle(
                        detailsItem
                      )
                    }
                    className="flex h-9 items-center justify-center gap-2 rounded-lg border border-cyan-400/15 bg-cyan-400/[0.06] text-[10px] font-medium text-cyan-200 transition hover:bg-cyan-400/10 active:scale-[.98]"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Restore
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      openDeleteSingle(
                        detailsItem
                      )
                    }
                    className="flex h-9 items-center justify-center gap-2 rounded-lg border border-red-400/15 bg-red-400/[0.05] text-[10px] font-medium text-red-300 transition hover:bg-red-400/10 active:scale-[.98]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* =====================================================
          BOTTOM STATUS BAR
      ===================================================== */}

      <div className="flex min-h-[30px] shrink-0 items-center justify-between border-t border-white/[0.06] bg-[#151515] px-3 text-[9px] text-white/30 sm:px-4">
        <div className="flex min-w-0 items-center gap-3">
          <span>
            {filteredItems.length}{' '}
            {filteredItems.length === 1
              ? 'item'
              : 'items'}
          </span>

          {selectedIds.size > 0 && (
            <>
              <span className="h-3 w-px bg-white/10" />

              <span className="text-cyan-300/70">
                {selectedIds.size} selected
              </span>
            </>
          )}
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <span>
            Ctrl+A Select all
          </span>

          <span>
            Esc Clear
          </span>

          <span>
            Delete Permanently delete
          </span>
        </div>
      </div>

      {/* =====================================================
          TOAST
      ===================================================== */}

      {toast && (
        <div
          className={`
            recycle-toast fixed bottom-12 left-1/2 z-[100]
            flex -translate-x-1/2 items-center gap-3
            rounded-xl border px-4 py-2.5
            shadow-2xl backdrop-blur-xl
            ${
              toast.type === 'success'
                ? 'border-emerald-400/15 bg-[#17231e]/95 text-emerald-200'
                : toast.type === 'danger'
                  ? 'border-red-400/15 bg-[#281717]/95 text-red-200'
                  : 'border-cyan-400/15 bg-[#172126]/95 text-cyan-200'
            }
          `}
        >
          {toast.type === 'success' ? (
            <Check className="h-4 w-4" />
          ) : toast.type === 'danger' ? (
            <Trash2 className="h-4 w-4" />
          ) : (
            <Info className="h-4 w-4" />
          )}

          <span className="text-xs font-medium">
            {toast.message}
          </span>
        </div>
      )}

      {/* =====================================================
          CONFIRMATION MODAL
      ===================================================== */}

      {confirmAction && (
        <div
          className="absolute inset-0 z-[90] flex items-center justify-center bg-black/50 p-4 backdrop-blur-[3px]"
          onMouseDown={event => {
            if (event.target === event.currentTarget) {
              setConfirmAction(null);
            }
          }}
        >
          <div className="w-full max-w-[420px] overflow-hidden rounded-2xl border border-white/10 bg-[#202020] shadow-[0_30px_100px_rgba(0,0,0,.55)] recycle-scale-in">
            {/* Modal top */}
            <div className="flex gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-400/15 bg-red-400/[0.07]">
                <AlertTriangle className="h-5 w-5 text-red-300" />
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-white">
                  {confirmAction.title}
                </h3>

                <p className="mt-2 text-xs leading-5 text-white/45">
                  {confirmAction.message}
                </p>
              </div>
            </div>

            {/* Warning */}
            <div className="mx-5 rounded-xl border border-red-400/10 bg-red-400/[0.035] p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-300/70" />

                <span className="text-[10px] leading-4 text-red-200/60">
                  Permanently deleted items cannot be
                  restored.
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex justify-end gap-2 border-t border-white/[0.07] bg-white/[0.015] p-3">
              <button
                type="button"
                onClick={() =>
                  setConfirmAction(null)
                }
                className="h-9 rounded-lg border border-white/10 bg-white/[0.04] px-4 text-xs text-white/65 transition hover:bg-white/[0.08] hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={executeConfirmAction}
                className="flex h-9 items-center gap-2 rounded-lg border border-red-400/20 bg-red-500/15 px-4 text-xs font-medium text-red-200 transition hover:bg-red-500/25 active:scale-[.98]"
              >
                <Trash2 className="h-3.5 w-3.5" />

                {confirmAction.type === 'empty'
                  ? 'Empty Recycle Bin'
                  : 'Delete permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================
   DETAIL ROW
========================================================= */

const DetailRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/[0.04] text-white/35">
        {icon}
      </div>

      <div className="min-w-0">
        <div className="text-[9px] font-semibold uppercase tracking-wider text-white/25">
          {label}
        </div>

        <div className="mt-1 break-words text-[10px] leading-4 text-white/60">
          {value}
        </div>
      </div>
    </div>
  );
};

export default RecycleBinApp;