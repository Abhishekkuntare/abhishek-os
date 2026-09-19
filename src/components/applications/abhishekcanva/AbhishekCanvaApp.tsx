import React, { useState, useEffect, useCallback } from 'react';
import { useOS } from '../../../context/OSContext';
import { Palette, Home, Clock, FolderKanban, Trash2, Star, Settings, Search, Plus, Sparkles, X, LayoutGrid, Image as ImageIcon, Type, Square, Video, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DesignDocument } from './types/design';
import { designStorage } from './services/designStorage';
import { CanvaHome } from './components/CanvaHome';
import { DesignEditor } from './components/DesignEditor';
import { CreateDesignModal } from './components/CreateDesignModal';

type AppView = 'home' | 'editor' | 'templates' | 'projects' | 'assets' | 'settings';

export const AbhishekCanvaApp: React.FC = () => {
  const { addNotification } = useOS();
  const [view, setView] = useState<AppView>('home');
  const [currentDesign, setCurrentDesign] = useState<DesignDocument | null>(null);
  const [recentDesigns, setRecentDesigns] = useState<DesignDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Initialize storage and load recent designs
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await designStorage.initialize();
        const recent = await designStorage.getRecentDesignDocuments();
        setRecentDesigns(recent);
      } catch (error) {
        console.error('Failed to initialize AbhishekCanva:', error);
        addNotification({
          title: 'Storage Error',
          message: 'Failed to initialize design storage. Some features may be limited.',
          type: 'alert',
          time: new Date().toLocaleTimeString(),
          read: false
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [addNotification]);

  const handleCreateDesign = async (design: DesignDocument) => {
    try {
      await designStorage.saveDesign(design);
      setCurrentDesign(design);
      setView('editor');
      setShowCreateModal(false);
      
      addNotification({
        title: 'Design Created',
        message: `"${design.name}" has been created successfully.`,
        type: 'success',
        time: new Date().toLocaleTimeString(),
        read: false
      });
    } catch (error) {
      console.error('Failed to create design:', error);
      addNotification({
        title: 'Creation Failed',
        message: 'Failed to create design. Please try again.',
        type: 'alert',
        time: new Date().toLocaleTimeString(),
        read: false
      });
    }
  };

  const handleOpenDesign = async (designId: string) => {
    try {
      const design = await designStorage.loadDesign(designId);
      if (design) {
        setCurrentDesign(design);
        setView('editor');
      }
    } catch (error) {
      console.error('Failed to open design:', error);
      addNotification({
        title: 'Open Failed',
        message: 'Failed to open design. Please try again.',
        type: 'alert',
        time: new Date().toLocaleTimeString(),
        read: false
      });
    }
  };

  const handleSaveDesign = async (design: DesignDocument) => {
    try {
      await designStorage.saveDesign(design);
      setCurrentDesign(design);
      
      // Update recent designs
      const recent = await designStorage.getRecentDesignDocuments();
      setRecentDesigns(recent);
      
      addNotification({
        title: 'Design Saved',
        message: `"${design.name}" has been saved successfully.`,
        type: 'success',
        time: new Date().toLocaleTimeString(),
        read: false
      });
    } catch (error) {
      console.error('Failed to save design:', error);
      addNotification({
        title: 'Save Failed',
        message: 'Failed to save design. Please try again.',
        type: 'alert',
        time: new Date().toLocaleTimeString(),
        read: false
      });
    }
  };

  const handleCloseEditor = () => {
    setCurrentDesign(null);
    setView('home');
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#0B0D12]">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"
          />
          <p className="text-slate-400">Loading Creative Studio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#0B0D12] text-slate-100">
      {/* Header */}
      <header className="h-14 px-4 border-b border-white/8 bg-[#11141B] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-white">AbhishekCanva</h1>
            <p className="text-xs text-slate-500">Design anything. Create everything.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <Search className="w-4 h-4 text-slate-400" />
          </button>
          <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <Sparkles className="w-4 h-4 text-slate-400" />
          </button>
          <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <Settings className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </header>

      {/* Navigation */}
      {view !== 'editor' && (
        <nav className="h-12 px-4 border-b border-white/8 bg-[#11141B] flex items-center gap-1 shrink-0">
          {[
            { id: 'home' as AppView, icon: Home, label: 'Home' },
            { id: 'recent' as AppView, icon: Clock, label: 'Recent' },
            { id: 'projects' as AppView, icon: FolderKanban, label: 'Projects' },
            { id: 'templates' as AppView, icon: LayoutGrid, label: 'Templates' },
            { id: 'assets' as AppView, icon: ImageIcon, label: 'Assets' },
            { id: 'trash' as AppView, icon: Trash2, label: 'Trash' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                view === item.id 
                  ? 'bg-purple-500/20 text-purple-300' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full"
            >
              <CanvaHome
                recentDesigns={recentDesigns}
                onCreateDesign={() => setShowCreateModal(true)}
                onOpenDesign={handleOpenDesign}
              />
            </motion.div>
          )}

          {view === 'editor' && currentDesign && (
            <motion.div
              key="editor"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="h-full"
            >
              <DesignEditor
                design={currentDesign}
                onSave={handleSaveDesign}
                onClose={handleCloseEditor}
              />
            </motion.div>
          )}

          {view !== 'home' && view !== 'editor' && (
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full flex items-center justify-center"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                  <LayoutGrid className="w-8 h-8 text-slate-600" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">Coming Soon</h2>
                <p className="text-slate-400">The {view} feature is under development.</p>
                <button
                  onClick={() => setView('home')}
                  className="mt-4 px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium transition-colors"
                >
                  Back to Home
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Create Design Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateDesignModal
            onClose={() => setShowCreateModal(false)}
            onCreateDesign={handleCreateDesign}
          />
        )}
      </AnimatePresence>
    </div>
  );
};