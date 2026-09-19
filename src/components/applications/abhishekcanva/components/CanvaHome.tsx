import React from 'react';
import { motion } from 'motion/react';
import { Plus, Sparkles, Clock, Star, LayoutGrid, Image as ImageIcon, Type, Square, Video, Music, FileText, Globe, Instagram, Youtube, Facebook, Linkedin, Twitter, Mail, CreditCard, Award, FolderKanban, MoreHorizontal } from 'lucide-react';
import { DesignDocument } from '../types/design';
import { QUICK_DESIGNS } from '../constants/presets';

interface CanvaHomeProps {
  recentDesigns: DesignDocument[];
  onCreateDesign: () => void;
  onOpenDesign: (designId: string) => void;
}

export const CanvaHome: React.FC<CanvaHomeProps> = ({
  recentDesigns,
  onCreateDesign,
  onOpenDesign
}) => {
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-8 rounded-3xl bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-white/10 relative overflow-hidden"
        >
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl" />
          
          <div className="relative">
            <h1 className="text-4xl font-black text-white mb-2">Create something amazing</h1>
            <p className="text-slate-300 mb-6 max-w-xl">
              Design stunning visuals, presentations, and marketing materials with our professional creative studio.
            </p>
            
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onCreateDesign}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg shadow-purple-500/25"
              >
                <Plus className="w-5 h-5" />
                Create a design
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/20"
              >
                <Sparkles className="w-5 h-5" />
                Create with AI
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Quick Designs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Quick Designs</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {QUICK_DESIGNS.map((design, index) => (
              <motion.button
                key={design.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCreateDesign}
                className="group relative aspect-square rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative h-full flex flex-col items-center justify-center p-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    {design.id === 'instagram-post' && <Instagram className="w-6 h-6 text-pink-400" />}
                    {design.id === 'instagram-story' && <Instagram className="w-6 h-6 text-pink-400" />}
                    {design.id === 'youtube-thumbnail' && <Youtube className="w-6 h-6 text-red-400" />}
                    {design.id === 'presentation' && <LayoutGrid className="w-6 h-6 text-blue-400" />}
                    {design.id === 'poster' && <ImageIcon className="w-6 h-6 text-green-400" />}
                    {design.id === 'resume' && <FileText className="w-6 h-6 text-amber-400" />}
                    {design.id === 'logo' && <Type className="w-6 h-6 text-purple-400" />}
                    {design.id === 'business-card' && <CreditCard className="w-6 h-6 text-cyan-400" />}
                    {design.id === 'website' && <Globe className="w-6 h-6 text-emerald-400" />}
                    {design.id === 'flyer' && <FileText className="w-6 h-6 text-orange-400" />}
                    {design.id === 'invitation' && <Mail className="w-6 h-6 text-rose-400" />}
                    {design.id === 'a4-document' && <FileText className="w-6 h-6 text-slate-400" />}
                  </div>
                  
                  <span className="text-sm font-medium text-white text-center">{design.name}</span>
                  <span className="text-xs text-slate-500">{design.description}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Recent Designs */}
        {recentDesigns.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Recent Designs</h2>
              <button className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                View all
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {recentDesigns.map((design, index) => (
                <motion.button
                  key={design.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onOpenDesign(design.id)}
                  className="group relative aspect-[design.width/design.height] rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {design.thumbnail ? (
                    <img
                      src={design.thumbnail}
                      alt={design.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <LayoutGrid className="w-12 h-12 text-slate-600" />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-sm font-medium text-white truncate">{design.name}</p>
                    <p className="text-xs text-slate-300">
                      {design.width} × {design.height}
                    </p>
                  </div>
                  
                  <button className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70">
                    <MoreHorizontal className="w-4 h-4 text-white" />
                  </button>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {recentDesigns.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
              <FolderKanban className="w-10 h-10 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No designs yet</h3>
            <p className="text-slate-400 mb-6">Create your first design to get started</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCreateDesign}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg shadow-purple-500/25"
            >
              <Plus className="w-5 h-5" />
              Create your first design
            </motion.button>
          </motion.div>
        )}

        {/* Template Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-white mb-4">Explore Templates</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[
              { name: 'Social Media', icon: Instagram, color: 'from-pink-500 to-rose-600' },
              { name: 'Presentations', icon: LayoutGrid, color: 'from-blue-500 to-cyan-600' },
              { name: 'Marketing', icon: ImageIcon, color: 'from-green-500 to-emerald-600' },
              { name: 'Business', icon: CreditCard, color: 'from-amber-500 to-orange-600' },
              { name: 'Education', icon: Award, color: 'from-purple-500 to-violet-600' },
              { name: 'Events', icon: Mail, color: 'from-red-500 to-pink-600' },
              { name: 'Fashion', icon: Star, color: 'from-fuchsia-500 to-pink-600' },
              { name: 'Food', icon: Type, color: 'from-orange-500 to-amber-600' },
            ].map((category, index) => (
              <motion.button
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative h-32 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-20 transition-opacity`} />
                
                <div className="relative h-full flex flex-col items-center justify-center p-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <category.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-white">{category.name}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};