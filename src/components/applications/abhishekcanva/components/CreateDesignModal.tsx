import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Palette, LayoutGrid, Image as ImageIcon, Type, Video, Globe, FileText, CreditCard, Mail, Award, Instagram, Youtube, Facebook, Linkedin, Twitter } from 'lucide-react';
import { DesignDocument } from '../types/design';
import { PRESET_SIZES } from '../constants/presets';

interface CreateDesignModalProps {
  onClose: () => void;
  onCreateDesign: (design: DesignDocument) => void;
}

type Category = 'all' | 'social' | 'presentation' | 'document' | 'marketing' | 'video' | 'web' | 'custom';

export const CreateDesignModal: React.FC<CreateDesignModalProps> = ({ onClose, onCreateDesign }) => {
  const [category, setCategory] = useState<Category>('all');
  const [search, setSearch] = useState('');
  const [customSize, setCustomSize] = useState({ width: 1920, height: 1080 });
  const [selectedPreset, setSelectedPreset] = useState(PRESET_SIZES[0]);

  const filteredPresets = PRESET_SIZES.filter(preset => {
    const matchesCategory = category === 'all' || preset.category === category;
    const matchesSearch = preset.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreate = () => {
    const preset = category === 'custom' ? null : selectedPreset;
    const width = category === 'custom' ? customSize.width : preset?.width || 1920;
    const height = category === 'custom' ? customSize.height : preset?.height || 1080;
    const name = category === 'custom' ? 'Custom Design' : preset?.name || 'New Design';

    const newDesign: DesignDocument = {
      id: `design_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      width,
      height,
      background: '#ffffff',
      pages: [{
        id: `page_${Date.now()}`,
        name: 'Page 1',
        order: 0,
        elements: [],
        isHidden: false
      }],
      activePageId: '',
      tags: [],
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      format: 'abhishekcanva'
    };

    newDesign.activePageId = newDesign.pages[0].id;
    onCreateDesign(newDesign);
  };

  const categories: { id: Category; name: string; icon: any }[] = [
    { id: 'all', name: 'All', icon: LayoutGrid },
    { id: 'social', name: 'Social Media', icon: Instagram },
    { id: 'presentation', name: 'Presentation', icon: LayoutGrid },
    { id: 'document', name: 'Documents', icon: FileText },
    { id: 'marketing', name: 'Marketing', icon: ImageIcon },
    { id: 'video', name: 'Video', icon: Video },
    { id: 'web', name: 'Web', icon: Globe },
    { id: 'custom', name: 'Custom Size', icon: Type },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-4xl max-h-[90vh] bg-[#11141B] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div>
              <h2 className="text-xl font-bold text-white">Create a design</h2>
              <p className="text-sm text-slate-400">Choose a size to get started</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search sizes..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="p-4 border-b border-white/10">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                      category === cat.id
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {category === 'custom' ? (
              <div className="max-w-md mx-auto space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Width (px)</label>
                  <input
                    type="number"
                    value={customSize.width}
                    onChange={(e) => setCustomSize({ ...customSize, width: parseInt(e.target.value) || 1920 })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Height (px)</label>
                  <input
                    type="number"
                    value={customSize.height}
                    onChange={(e) => setCustomSize({ ...customSize, height: parseInt(e.target.value) || 1080 })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
                  />
                </div>
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <p className="text-sm text-purple-300">
                    Custom size: {customSize.width} × {customSize.height}px
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredPresets.map((preset) => (
                  <motion.button
                    key={preset.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPreset(preset)}
                    className={`group relative aspect-video rounded-xl border-2 transition-all ${
                      selectedPreset.id === preset.id
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-white/10 bg-white/5 hover:border-purple-500/50'
                    }`}
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        {preset.id.includes('instagram') && <Instagram className="w-5 h-5 text-pink-400" />}
                        {preset.id.includes('youtube') && <Youtube className="w-5 h-5 text-red-400" />}
                        {preset.id.includes('facebook') && <Facebook className="w-5 h-5 text-blue-400" />}
                        {preset.id.includes('linkedin') && <Linkedin className="w-5 h-5 text-cyan-400" />}
                        {preset.id.includes('twitter') && <Twitter className="w-5 h-5 text-slate-400" />}
                        {preset.id.includes('pinterest') && <ImageIcon className="w-5 h-5 text-red-400" />}
                        {preset.category === 'presentation' && <LayoutGrid className="w-5 h-5 text-blue-400" />}
                        {preset.category === 'document' && <FileText className="w-5 h-5 text-amber-400" />}
                        {preset.category === 'marketing' && <ImageIcon className="w-5 h-5 text-green-400" />}
                        {preset.category === 'video' && <Video className="w-5 h-5 text-purple-400" />}
                        {preset.category === 'web' && <Globe className="w-5 h-5 text-emerald-400" />}
                        {preset.category === 'custom' && <Type className="w-5 h-5 text-slate-400" />}
                      </div>
                      <span className="text-sm font-medium text-white text-center leading-tight">{preset.name}</span>
                      <span className="text-xs text-slate-500">{preset.width} × {preset.height}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-white/10">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/25"
            >
              Create Design
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};