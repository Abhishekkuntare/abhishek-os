import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Save, Download, Share2, Undo, Redo, ZoomIn, ZoomOut, Maximize2, 
  Type, Square, Image as ImageIcon, Layers, Settings, Plus, Trash2, Lock, Unlock,
  Copy, Palette, AlignLeft, AlignCenter, AlignRight, RotateCw, Move, MousePointer2
} from 'lucide-react';
import { DesignDocument, DesignElement, ElementType } from '../types/design';

interface DesignEditorProps {
  design: DesignDocument;
  onSave: (design: DesignDocument) => void;
  onClose: () => void;
}

export const DesignEditor: React.FC<DesignEditorProps> = ({ design, onSave, onClose }) => {
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [zoom, setZoom] = useState(100);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState<DesignDocument[]>([design]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'templates' | 'elements' | 'text' | 'uploads' | 'background'>('elements');
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const activePage = design.pages.find(p => p.id === design.activePageId) || design.pages[0];

  // Handle element selection
  const handleElementClick = useCallback((e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    if (e.shiftKey || e.ctrlKey) {
      setSelectedElements(prev => 
        prev.includes(elementId) 
          ? prev.filter(id => id !== elementId)
          : [...prev, elementId]
      );
    } else {
      setSelectedElements([elementId]);
    }
  }, []);

  // Handle canvas click for deselection
  const handleCanvasClick = useCallback(() => {
    setSelectedElements([]);
  }, []);

  // Handle drag start
  const handleDragStart = useCallback((e: React.MouseEvent, elementId: string) => {
    if (selectedElements.length === 0 || !selectedElements.includes(elementId)) {
      setSelectedElements([elementId]);
    }
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, [selectedElements]);

  // Handle drag move
  const handleDragMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || selectedElements.length === 0) return;

    const dx = (e.clientX - dragStart.x) / (zoom / 100);
    const dy = (e.clientY - dragStart.y) / (zoom / 100);

    setDragStart({ x: e.clientX, y: e.clientY });

    setDesign(prev => {
      const updated = { ...prev };
      updated.pages = updated.pages.map(page => {
        if (page.id !== design.activePageId) return page;
        
        return {
          ...page,
          elements: page.elements.map(element => {
            if (!selectedElements.includes(element.id)) return element;
            
            return {
              ...element,
              x: element.x + dx,
              y: element.y + dy
            };
          })
        };
      });
      return updated;
    });
  }, [isDragging, selectedElements, dragStart, zoom, design.activePageId]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      // Add to history
      setHistory(prev => [...prev.slice(0, historyIndex + 1), design]);
      setHistoryIndex(prev => prev + 1);
    }
  }, [isDragging, design, historyIndex]);

  // Add text element
  const addTextElement = () => {
    const newElement: DesignElement = {
      id: `element_${Date.now()}`,
      type: 'text',
      x: 100,
      y: 100,
      width: 200,
      height: 50,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      visible: true,
      locked: false,
      zIndex: activePage.elements.length + 1,
      data: {
        text: {
          content: 'Double-click to edit',
          fontFamily: 'Arial',
          fontSize: 24,
          fontWeight: 'normal',
          fontStyle: 'normal',
          textDecoration: 'none',
          textAlignment: 'left',
          verticalAlignment: 'top',
          lineHeight: 1.5,
          letterSpacing: 0,
          paragraphSpacing: 0,
          textTransform: 'none',
          color: '#000000'
        }
      }
    };

    setDesign(prev => {
      const updated = { ...prev };
      updated.pages = updated.pages.map(page => {
        if (page.id !== design.activePageId) return page;
        return {
          ...page,
          elements: [...page.elements, newElement]
        };
      });
      return updated;
    });

    setSelectedElements([newElement.id]);
  };

  // Add shape element
  const addShapeElement = (shapeType: 'rectangle' | 'circle') => {
    const newElement: DesignElement = {
      id: `element_${Date.now()}`,
      type: 'shape',
      x: 150,
      y: 150,
      width: 200,
      height: 200,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      visible: true,
      locked: false,
      zIndex: activePage.elements.length + 1,
      data: {
        shape: {
          shapeType,
          fill: '#6366f1',
          stroke: '#4f46e5',
          strokeWidth: 2,
          cornerRadius: shapeType === 'rectangle' ? 8 : 0
        }
      }
    };

    setDesign(prev => {
      const updated = { ...prev };
      updated.pages = updated.pages.map(page => {
        if (page.id !== design.activePageId) return page;
        return {
          ...page,
          elements: [...page.elements, newElement]
        };
      });
      return updated;
    });

    setSelectedElements([newElement.id]);
  };

  // Delete selected elements
  const deleteSelectedElements = () => {
    if (selectedElements.length === 0) return;

    setDesign(prev => {
      const updated = { ...prev };
      updated.pages = updated.pages.map(page => {
        if (page.id !== design.activePageId) return page;
        return {
          ...page,
          elements: page.elements.filter(el => !selectedElements.includes(el.id))
        };
      });
      return updated;
    });

    setSelectedElements([]);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElements.length > 0) {
          e.preventDefault();
          deleteSelectedElements();
        }
      }
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 's') {
          e.preventDefault();
          onSave(design);
        }
        if (e.key === 'z') {
          e.preventDefault();
          if (e.shiftKey && historyIndex < history.length - 1) {
            setHistoryIndex(prev => prev + 1);
            setDesign(history[historyIndex + 1]);
          } else if (historyIndex > 0) {
            setHistoryIndex(prev => prev - 1);
            setDesign(history[historyIndex - 1]);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElements, design, history, historyIndex, onSave, deleteSelectedElements]);

  // Update design when it changes
  const [currentDesign, setDesign] = useState(design);
  useEffect(() => {
    setDesign(design);
  }, [design]);

  // Render element
  const renderElement = (element: DesignElement) => {
    const isSelected = selectedElements.includes(element.id);
    const style = {
      position: 'absolute' as const,
      left: `${element.x}px`,
      top: `${element.y}px`,
      width: `${element.width}px`,
      height: `${element.height}px`,
      transform: `rotate(${element.rotation}deg) scale(${element.scaleX}, ${element.scaleY})`,
      opacity: element.opacity,
      zIndex: element.zIndex,
      cursor: element.locked ? 'not-allowed' : 'move',
      pointerEvents: element.locked ? 'none' : 'auto'
    };

    switch (element.type) {
      case 'text':
        return (
          <div
            key={element.id}
            style={{
              ...style,
              fontFamily: element.data.text?.fontFamily,
              fontSize: `${element.data.text?.fontSize}px`,
              fontWeight: element.data.text?.fontWeight,
              fontStyle: element.data.text?.fontStyle,
              textDecoration: element.data.text?.textDecoration,
              textAlign: element.data.text?.textAlignment as any,
              lineHeight: element.data.text?.lineHeight,
              letterSpacing: `${element.data.text?.letterSpacing}px`,
              color: element.data.text?.color,
              backgroundColor: element.data.text?.backgroundColor,
              textShadow: element.data.text?.textShadow 
                ? `${element.data.text.textShadow.offsetX}px ${element.data.text.textShadow.offsetY}px ${element.data.text.textShadow.blur}px ${element.data.text.textShadow.color}`
                : undefined
            }}
            onClick={(e) => handleElementClick(e, element.id)}
            onMouseDown={(e) => handleDragStart(e, element.id)}
            onDoubleClick={() => {
              // Text editing would go here
              console.log('Edit text:', element.id);
            }}
          >
            {element.data.text?.content}
          </div>
        );

      case 'shape':
        const shapeData = element.data.shape;
        const shapeStyle = {
          ...style,
          backgroundColor: typeof shapeData?.fill === 'string' ? shapeData.fill : undefined,
          border: shapeData?.stroke ? `${shapeData.strokeWidth}px solid ${shapeData.stroke}` : undefined,
          borderRadius: shapeData?.shapeType === 'circle' ? '50%' : shapeData?.cornerRadius ? `${shapeData.cornerRadius}px` : undefined
        };

        return (
          <div
            key={element.id}
            style={shapeStyle}
            onClick={(e) => handleElementClick(e, element.id)}
            onMouseDown={(e) => handleDragStart(e, element.id)}
          />
        );

      case 'image':
        return (
          <div
            key={element.id}
            style={style}
            onClick={(e) => handleElementClick(e, element.id)}
            onMouseDown={(e) => handleDragStart(e, element.id)}
          >
            {element.data.image?.src && (
              <img
                src={element.data.image.src}
                alt={element.data.image.alt || ''}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: element.data.image.fit || 'cover'
                }}
                draggable={false}
              />
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Selection box
  const renderSelectionBox = () => {
    if (selectedElements.length === 0) return null;

    const selected = activePage.elements.filter(el => selectedElements.includes(el.id));
    if (selected.length === 0) return null;

    return selected.map(element => (
      <div
        key={`selection-${element.id}`}
        style={{
          position: 'absolute',
          left: `${element.x - 2}px`,
          top: `${element.y - 2}px`,
          width: `${element.width + 4}px`,
          height: `${element.height + 4}px`,
          border: '2px solid #6366f1',
          borderRadius: '4px',
          pointerEvents: 'none',
          zIndex: 9999
        }}
      >
        {/* Resize handles */}
        <div style={{ position: 'absolute', top: '-4px', left: '-4px', width: '8px', height: '8px', background: '#6366f1', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', background: '#6366f1', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-4px', left: '-4px', width: '8px', height: '8px', background: '#6366f1', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '8px', height: '8px', background: '#6366f1', borderRadius: '50%' }} />
        
        {/* Rotation handle */}
        <div style={{ 
          position: 'absolute', 
          top: '-20px', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          width: '12px', 
          height: '12px', 
          background: '#6366f1', 
          borderRadius: '50%',
          cursor: 'grab'
        }} />
      </div>
    ));
  };

  return (
    <div className="h-full flex flex-col bg-[#0B0D12]">
      {/* Top Toolbar */}
      <div className="h-12 px-4 border-b border-white/8 bg-[#11141B] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-4 h-4 text-slate-400" />
          </button>
          <div className="h-6 w-px bg-white/10 mx-2" />
          <input
            type="text"
            value={currentDesign.name}
            onChange={(e) => setDesign(prev => ({ ...prev, name: e.target.value }))}
            className="bg-transparent text-white text-sm font-medium focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors" title="Undo">
            <Undo className="w-4 h-4 text-slate-400" />
          </button>
          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors" title="Redo">
            <Redo className="w-4 h-4 text-slate-400" />
          </button>
          <div className="h-6 w-px bg-white/10 mx-2" />
          <button 
            onClick={() => onSave(currentDesign)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span className="text-sm">Save</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <Download className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400">Export</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <Share2 className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400">Share</span>
          </button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 border-r border-white/8 bg-[#11141B] flex flex-col shrink-0">
          <div className="flex border-b border-white/8">
            {[
              { id: 'templates', icon: Layers, label: 'Templates' },
              { id: 'elements', icon: Square, label: 'Elements' },
              { id: 'text', icon: Type, label: 'Text' },
              { id: 'uploads', icon: ImageIcon, label: 'Uploads' },
              { id: 'background', icon: Palette, label: 'Background' },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors ${
                    activeTab === tab.id
                      ? 'text-purple-300 border-b-2 border-purple-500'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'elements' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 mb-3">SHAPES</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => addShapeElement('rectangle')}
                      className="aspect-square rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
                    >
                      <Square className="w-6 h-6 text-slate-400" />
                    </button>
                    <button
                      onClick={() => addShapeElement('circle')}
                      className="aspect-square rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
                    >
                      <div className="w-6 h-6 rounded-full border-2 border-slate-400" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-slate-400 mb-3">LINES</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="aspect-square rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors">
                      <div className="w-8 h-0.5 bg-slate-400" />
                    </button>
                    <button className="aspect-square rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors">
                      <div className="w-8 h-0.5 bg-slate-400 transform rotate-45" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'text' && (
              <div className="space-y-2">
                <button
                  onClick={addTextElement}
                  className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors"
                >
                  <p className="text-sm font-medium text-white">Add heading</p>
                  <p className="text-xs text-slate-500">Big bold text</p>
                </button>
                <button
                  onClick={addTextElement}
                  className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors"
                >
                  <p className="text-sm font-medium text-white">Add subheading</p>
                  <p className="text-xs text-slate-500">Medium text</p>
                </button>
                <button
                  onClick={addTextElement}
                  className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors"
                >
                  <p className="text-sm font-medium text-white">Add body text</p>
                  <p className="text-xs text-slate-500">Regular text</p>
                </button>
              </div>
            )}

            {activeTab === 'uploads' && (
              <div className="text-center py-8">
                <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-400 mb-4">Upload images and videos</p>
                <button className="px-4 py-2 rounded-lg bg-purple-500/20 text-purple-300 text-sm hover:bg-purple-500/30 transition-colors">
                  Upload files
                </button>
              </div>
            )}

            {activeTab === 'background' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 mb-3">SOLID COLORS</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {['#ffffff', '#f3f4f6', '#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280', '#4b5563', '#374151', '#1f2937', '#111827'].map(color => (
                      <button
                        key={color}
                        onClick={() => setDesign(prev => ({ ...prev, background: color }))}
                        className="aspect-square rounded-lg border border-white/10 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'templates' && (
              <div className="text-center py-8">
                <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-400">Templates coming soon</p>
              </div>
            )}
          </div>
        </div>

        {/* Canvas Area */}
        <div 
          ref={containerRef}
          className="flex-1 bg-[#0a0c10] overflow-hidden relative"
          onClick={handleCanvasClick}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              ref={canvasRef}
              className="relative bg-white shadow-2xl"
              style={{
                width: `${currentDesign.width}px`,
                height: `${currentDesign.height}px`,
                transform: `scale(${zoom / 100}) translate(${pan.x}px, ${pan.y}px)`,
                backgroundColor: currentDesign.background
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {activePage.elements.map(renderElement)}
              {renderSelectionBox()}
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-[#11141B] rounded-lg border border-white/10 p-1">
            <button
              onClick={() => setZoom(prev => Math.max(25, prev - 25))}
              className="p-2 rounded hover:bg-white/10 transition-colors"
            >
              <ZoomOut className="w-4 h-4 text-slate-400" />
            </button>
            <span className="text-sm text-slate-400 w-12 text-center">{zoom}%</span>
            <button
              onClick={() => setZoom(prev => Math.min(200, prev + 25))}
              className="p-2 rounded hover:bg-white/10 transition-colors"
            >
              <ZoomIn className="w-4 h-4 text-slate-400" />
            </button>
            <div className="w-px h-6 bg-white/10 mx-1" />
            <button
              onClick={() => setZoom(100)}
              className="p-2 rounded hover:bg-white/10 transition-colors"
              title="Fit to screen"
            >
              <Maximize2 className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Right Properties Panel */}
        <div className="w-72 border-l border-white/8 bg-[#11141B] flex flex-col shrink-0">
          <div className="p-4 border-b border-white/8">
            <h3 className="text-sm font-semibold text-white">Properties</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {selectedElements.length === 0 ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Canvas Size</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Width</label>
                      <input
                        type="number"
                        value={currentDesign.width}
                        onChange={(e) => setDesign(prev => ({ ...prev, width: parseInt(e.target.value) || 1920 }))}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Height</label>
                      <input
                        type="number"
                        value={currentDesign.height}
                        onChange={(e) => setDesign(prev => ({ ...prev, height: parseInt(e.target.value) || 1080 }))}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Background</label>
                  <input
                    type="color"
                    value={currentDesign.background}
                    onChange={(e) => setDesign(prev => ({ ...prev, background: e.target.value }))}
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-white">Selected Elements</h4>
                  <span className="text-xs text-slate-500">{selectedElements.length} selected</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">X</label>
                    <input
                      type="number"
                      value={activePage.elements.find(el => el.id === selectedElements[0])?.x || 0}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        setDesign(prev => {
                          const updated = { ...prev };
                          updated.pages = updated.pages.map(page => {
                            if (page.id !== design.activePageId) return page;
                            return {
                              ...page,
                              elements: page.elements.map(el => 
                                selectedElements.includes(el.id) ? { ...el, x: value } : el
                              )
                            };
                          });
                          return updated;
                        });
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Y</label>
                    <input
                      type="number"
                      value={activePage.elements.find(el => el.id === selectedElements[0])?.y || 0}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        setDesign(prev => {
                          const updated = { ...prev };
                          updated.pages = updated.pages.map(page => {
                            if (page.id !== design.activePageId) return page;
                            return {
                              ...page,
                              elements: page.elements.map(el => 
                                selectedElements.includes(el.id) ? { ...el, y: value } : el
                              )
                            };
                          });
                          return updated;
                        });
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Width</label>
                    <input
                      type="number"
                      value={activePage.elements.find(el => el.id === selectedElements[0])?.width || 0}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        setDesign(prev => {
                          const updated = { ...prev };
                          updated.pages = updated.pages.map(page => {
                            if (page.id !== design.activePageId) return page;
                            return {
                              ...page,
                              elements: page.elements.map(el => 
                                selectedElements.includes(el.id) ? { ...el, width: value } : el
                              )
                            };
                          });
                          return updated;
                        });
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Height</label>
                    <input
                      type="number"
                      value={activePage.elements.find(el => el.id === selectedElements[0])?.height || 0}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        setDesign(prev => {
                          const updated = { ...prev };
                          updated.pages = updated.pages.map(page => {
                            if (page.id !== design.activePageId) return page;
                            return {
                              ...page,
                              elements: page.elements.map(el => 
                                selectedElements.includes(el.id) ? { ...el, height: value } : el
                              )
                            };
                          });
                          return updated;
                        });
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-500 mb-1">Rotation</label>
                  <input
                    type="number"
                    value={activePage.elements.find(el => el.id === selectedElements[0])?.rotation || 0}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      setDesign(prev => {
                        const updated = { ...prev };
                        updated.pages = updated.pages.map(page => {
                          if (page.id !== design.activePageId) return page;
                          return {
                            ...page,
                            elements: page.elements.map(el => 
                              selectedElements.includes(el.id) ? { ...el, rotation: value } : el
                            )
                          };
                        });
                        return updated;
                      });
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-500 mb-1">Opacity</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={activePage.elements.find(el => el.id === selectedElements[0])?.opacity || 1}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setDesign(prev => {
                        const updated = { ...prev };
                        updated.pages = updated.pages.map(page => {
                          if (page.id !== design.activePageId) return page;
                          return {
                            ...page,
                            elements: page.elements.map(el => 
                              selectedElements.includes(el.id) ? { ...el, opacity: value } : el
                            )
                          };
                        });
                        return updated;
                      });
                    }}
                    className="w-full"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setDesign(prev => {
                        const updated = { ...prev };
                        updated.pages = updated.pages.map(page => {
                          if (page.id !== design.activePageId) return page;
                          return {
                            ...page,
                            elements: page.elements.map(el => 
                              selectedElements.includes(el.id) ? { ...el, locked: !el.locked } : el
                            )
                          };
                        });
                        return updated;
                      });
                    }}
                    className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  >
                    {activePage.elements.find(el => el.id === selectedElements[0])?.locked ? (
                      <Unlock className="w-4 h-4 text-slate-400" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-400" />
                    )}
                    <span className="text-xs text-slate-400">
                      {activePage.elements.find(el => el.id === selectedElements[0])?.locked ? 'Unlock' : 'Lock'}
                    </span>
                  </button>
                  <button
                    onClick={deleteSelectedElements}
                    className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                    <span className="text-xs text-red-400">Delete</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    const element = activePage.elements.find(el => el.id === selectedElements[0]);
                    if (!element) return;
                    
                    const newElement: DesignElement = {
                      ...element,
                      id: `element_${Date.now()}`,
                      x: element.x + 20,
                      y: element.y + 20
                    };
                    
                    setDesign(prev => {
                      const updated = { ...prev };
                      updated.pages = updated.pages.map(page => {
                        if (page.id !== design.activePageId) return page;
                        return {
                          ...page,
                          elements: [...page.elements, newElement]
                        };
                      });
                      return updated;
                    });
                    
                    setSelectedElements([newElement.id]);
                  }}
                  className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span className="text-xs text-slate-400">Duplicate</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="h-10 px-4 border-t border-white/8 bg-[#11141B] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-500">
            {currentDesign.width} × {currentDesign.height}px
          </span>
          <span className="text-xs text-slate-500">
            Page {design.pages.findIndex(p => p.id === design.activePageId) + 1} of {design.pages.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded hover:bg-white/10 transition-colors">
            <Layers className="w-4 h-4 text-slate-400" />
          </button>
          <button className="p-1.5 rounded hover:bg-white/10 transition-colors">
            <Settings className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
};