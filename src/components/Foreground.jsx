import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuSearch, LuPlus, LuDownload, LuUpload, LuChevronDown } from 'react-icons/lu';
import { IoClose } from 'react-icons/io5';
import { FaRegFileAlt } from 'react-icons/fa';
import Card from './Card';
import DocModal from './DocModal';

const defaultDocs = [
  {
    id: '1',
    desc: "I'm gonna make him an offer he can't refuse. It's not about what he wants, it's about what he can't say no to.",
    filesize: "9.2mb",
    close: false,
    tag: { isOpen: true, tagTitle: "Watch Movie", color: "green" },
    createdAt: Date.now() - 3000
  },
  {
    id: '2',
    desc: "Not all treasure is silver and gold, mate. Some things are worth more than money.",
    filesize: "0.4mb",
    close: true,
    tag: { isOpen: true, tagTitle: "Read Quote", color: "blue" },
    createdAt: Date.now() - 2000
  },
  {
    id: '3',
    desc: "I’m just your friendly neighborhood Spider-Man.",
    filesize: "3mb",
    close: true,
    tag: { isOpen: true, tagTitle: "View Profile", color: "purple" },
    createdAt: Date.now() - 1000
  },
];

const sortByLabels = {
  newest: 'Newest',
  oldest: 'Oldest',
  az: 'A-Z',
  za: 'Z-A'
};

function Foreground() {
  const dragBoundaryRef = useRef(null);
  const sortDropdownRef = useRef(null);
  
  // Load initial documents from local storage or use defaults
  const [docs, setDocs] = useState(() => {
    const savedDocs = localStorage.getItem('docs');
    return savedDocs ? JSON.parse(savedDocs) : defaultDocs;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterColor, setFilterColor] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  // Modal, Dropdown & Toast states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('docs', JSON.stringify(docs));
  }, [docs]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper for launching toasts
  const addToast = (message, type = 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Open modal for creating a new card
  const handleOpenAdd = () => {
    setEditingDoc(null);
    setIsModalOpen(true);
  };

  // Open modal for editing an existing card
  const handleOpenEdit = (doc) => {
    setEditingDoc(doc);
    setIsModalOpen(true);
  };

  // Save new or edited card
  const handleSaveDoc = (docData) => {
    if (editingDoc) {
      setDocs(prevDocs => {
        const updated = prevDocs.map(d => (d.id === editingDoc.id ? { ...d, ...docData } : d));
        addToast('Document updated successfully!', 'success');
        return updated;
      });
    } else {
      const newDoc = {
        ...docData,
        id: Date.now().toString(),
        createdAt: Date.now(),
      };
      setDocs(prevDocs => {
        const updated = [newDoc, ...prevDocs];
        addToast('New document created!', 'success');
        return updated;
      });
    }
  };

  // Delete card
  const handleDeleteDoc = (id) => {
    setDocs(prevDocs => {
      const updated = prevDocs.filter(d => d.id !== id);
      addToast('Document deleted!', 'danger');
      return updated;
    });
  };

  // Export JSON backup
  const handleExportJSON = () => {
    try {
      const dataStr = JSON.stringify(docs, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `docs-backup-${new Date().toISOString().slice(0, 10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      addToast('Backup exported successfully!', 'success');
    } catch (error) {
      addToast('Failed to export backup', 'danger');
    }
  };

  // Import JSON backup
  const handleImportJSON = (e) => {
    const fileReader = new FileReader();
    const file = e.target.files[0];
    if (!file) return;

    fileReader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        
        if (Array.isArray(importedData)) {
          const isValid = importedData.every(item => item && typeof item.desc === 'string');
          if (isValid) {
            const preparedData = importedData.map(item => ({
              ...item,
              id: item.id || Date.now().toString() + Math.random().toString(),
              createdAt: item.createdAt || Date.now()
            }));
            
            setDocs(preparedData);
            addToast('Backup restored successfully!', 'success');
          } else {
            addToast('Invalid backup file format', 'danger');
          }
        } else {
          addToast('Invalid backup file format', 'danger');
        }
      } catch (error) {
        addToast('Failed to parse backup file', 'danger');
      }
    };
    
    fileReader.readAsText(file);
    e.target.value = ''; // reset target
  };

  // Filter logic
  const filteredDocs = docs.filter(doc => {
    const matchesSearch = doc.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterColor === 'all' || (doc.tag?.isOpen && doc.tag?.color === filterColor);
    return matchesSearch && matchesFilter;
  });

  // Sort logic
  const sortedDocs = [...filteredDocs].sort((a, b) => {
    const timeA = a.createdAt || 0;
    const timeB = b.createdAt || 0;
    const descA = a.desc || '';
    const descB = b.desc || '';

    if (sortBy === 'newest') return timeB - timeA;
    if (sortBy === 'oldest') return timeA - timeB;
    if (sortBy === 'az') return descA.localeCompare(descB);
    if (sortBy === 'za') return descB.localeCompare(descA);
    return 0;
  });

  return (
    <div ref={dragBoundaryRef} className="fixed top-0 left-0 z-[3] w-full h-full overflow-hidden flex flex-col pt-24 p-5">
      {/* Header bar (Search & Filter & Sort & Backup) - z-[100] elevated, horizontal side-by-side flexbox */}
      <div className="absolute top-6 left-0 right-0 z-[100] flex flex-row flex-wrap items-center justify-center gap-4 w-full px-5 pointer-events-none">
        
        {/* Bar 1: Search Input */}
        <div className="relative flex items-center bg-zinc-900/60 backdrop-blur-xl border border-white/5 rounded-2xl px-4 py-2 w-full max-w-[280px] focus-within:border-emerald-500/30 transition-all shadow-lg pointer-events-auto">
          <LuSearch className="text-zinc-500 mr-2.5" size={18} />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-white text-sm outline-none w-full placeholder-zinc-500"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-zinc-400 hover:text-white cursor-pointer">
              <IoClose size={16} />
            </button>
          )}
        </div>

        {/* Bar 2: Controls Bar */}
        <div className="flex flex-wrap items-center gap-4 bg-zinc-900/60 backdrop-blur-xl border border-white/5 rounded-2xl px-4 py-2 pointer-events-auto shadow-lg max-w-full">
          
          {/* Color Filters */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mr-1 whitespace-nowrap">Filter:</span>
            <button
              onClick={() => setFilterColor('all')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                filterColor === 'all'
                  ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-500/25'
                  : 'bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              All
            </button>
            {['green', 'blue', 'red', 'yellow', 'purple'].map((color) => {
              const colorClasses = {
                green: 'bg-emerald-600 ring-emerald-400',
                blue: 'bg-sky-600 ring-sky-400',
                red: 'bg-rose-600 ring-rose-400',
                yellow: 'bg-amber-500 ring-amber-300',
                purple: 'bg-violet-600 ring-violet-400',
              };
              return (
                <button
                  key={color}
                  onClick={() => setFilterColor(color)}
                  className={`w-6 h-6 rounded-full cursor-pointer transition-all ${colorClasses[color]} ${
                    filterColor === color ? 'ring-2 ring-offset-2 ring-offset-zinc-900 scale-110' : 'opacity-60 hover:opacity-100'
                  }`}
                  title={color.charAt(0).toUpperCase() + color.slice(1)}
                />
              );
            })}
          </div>

          {/* Divider */}
          <div className="w-[1px] h-5 bg-white/10 mx-0.5 hidden sm:block" />

          {/* Custom Sort Dropdown */}
          <div ref={sortDropdownRef} className="relative flex items-center gap-1.5">
            <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider whitespace-nowrap select-none">Sort:</span>
            <button
              type="button"
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 bg-zinc-800/60 border border-white/5 text-xs text-zinc-300 rounded-xl px-3 py-1 hover:bg-zinc-700/80 hover:text-white transition-all cursor-pointer select-none"
            >
              <span>{sortByLabels[sortBy]}</span>
              <LuChevronDown size={14} className={`transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {isSortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-32 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1 z-[200] pointer-events-auto"
                >
                  {Object.entries(sortByLabels).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setSortBy(key);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs transition-colors cursor-pointer flex items-center justify-between ${
                        sortBy === key 
                          ? 'bg-emerald-500/10 text-emerald-400 font-semibold' 
                          : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span>{label}</span>
                      {sortBy === key && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Divider */}
          <div className="w-[1px] h-5 bg-white/10 mx-0.5 hidden sm:block" />

          {/* Export & Import JSON Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportJSON}
              className="p-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white cursor-pointer transition-all border border-white/5 flex items-center justify-center"
              title="Backup Documents"
            >
              <LuDownload size={14} />
            </button>
            <label
              className="p-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white cursor-pointer transition-all border border-white/5 flex items-center justify-center"
              title="Restore Backup"
            >
              <input
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                className="hidden"
              />
              <LuUpload size={14} />
            </label>
          </div>
        </div>
      </div>

      {/* Grid container (overflow-visible to prevent clipping during drags) */}
      <div className="w-full flex-grow relative px-6 select-none overflow-visible">
        <div className="w-full h-full flex items-start justify-start gap-6 flex-wrap pb-24 overflow-visible">
          <AnimatePresence mode="popLayout">
            {sortedDocs.map((item) => (
              <Card
                key={item.id}
                data={item}
                reference={dragBoundaryRef}
                onEdit={() => handleOpenEdit(item)}
                onDelete={() => handleDeleteDoc(item.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Empty State message */}
      {filteredDocs.length === 0 && (
        <div className="absolute top-36 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center gap-2 text-zinc-500 pointer-events-none z-[1]">
          <FaRegFileAlt size={36} className="opacity-25 animate-pulse" />
          <p className="text-sm font-semibold tracking-wide text-zinc-500/80">No documents found matching filters</p>
        </div>
      )}

      {/* Floating Action Button (FAB) - z-[100] elevated & flat theme */}
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={handleOpenAdd}
        className="fixed bottom-8 right-8 w-14 h-14 bg-zinc-700/90 hover:bg-zinc-600/90 text-zinc-200 hover:text-white rounded-full flex justify-center items-center active:scale-95 transition-all cursor-pointer z-[100] border border-white/10"
        title="Add New Document"
      >
        <LuPlus size={24} strokeWidth={2.5} />
      </button>

      {/* Toast Notifications Panel */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-2.5 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="bg-zinc-900/95 border border-white/10 backdrop-blur-xl text-white text-xs px-4.5 py-3 rounded-2xl flex items-center gap-3 shadow-2xl pointer-events-auto min-w-[200px]"
            >
              <div className={`w-2 h-2 rounded-full ${
                toast.type === 'success' ? 'bg-emerald-500' : toast.type === 'danger' ? 'bg-rose-500' : 'bg-sky-500'
              }`} />
              <span className="font-semibold text-zinc-300">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Edit/Add Modal */}
      <DocModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDoc}
        initialData={editingDoc}
      />
    </div>
  );
}

export default Foreground;
