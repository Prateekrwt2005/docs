import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';

function DocModal({ isOpen, onClose, onSave, initialData = null }) {
  const [desc, setDesc] = useState('');
  const [filesize, setFilesize] = useState('');
  const [isCloseIcon, setIsCloseIcon] = useState(false);
  const [hasTag, setHasTag] = useState(false);
  const [tagTitle, setTagTitle] = useState('Download Now');
  const [tagColor, setTagColor] = useState('green');

  useEffect(() => {
    if (initialData) {
      setDesc(initialData.desc || '');
      setFilesize(initialData.filesize || '');
      setIsCloseIcon(!!initialData.close);
      setHasTag(!!initialData.tag?.isOpen);
      setTagTitle(initialData.tag?.tagTitle || 'Download Now');
      setTagColor(initialData.tag?.color || 'green');
    } else {
      setDesc('');
      setFilesize('');
      setIsCloseIcon(false);
      setHasTag(false);
      setTagTitle('Download Now');
      setTagColor('green');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!desc.trim()) return;

    // Auto-generate file size if not provided
    const finalFilesize = filesize.trim() || `${(Math.random() * 9.8 + 0.2).toFixed(1)}mb`;

    const docData = {
      desc: desc.trim(),
      filesize: finalFilesize,
      close: isCloseIcon,
      tag: {
        isOpen: hasTag,
        tagTitle: tagTitle.trim() || 'Download Now',
        color: tagColor,
      },
    };

    onSave(docData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-white/10 bg-zinc-900/95 text-white p-8 shadow-2xl shadow-black/50 z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold tracking-tight">
                {initialData ? 'Edit Document' : 'Create Document'}
              </h2>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <IoClose size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Description</label>
                <textarea
                  required
                  placeholder="Enter document text..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full h-24 px-4 py-3 rounded-2xl bg-zinc-800/80 border border-white/5 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 text-white placeholder-zinc-500 text-sm outline-none resize-none transition-all"
                />
              </div>

              {/* Filesize & Close Style */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">File Size</label>
                  <input
                    type="text"
                    placeholder="e.g. 2.4mb"
                    value={filesize}
                    onChange={(e) => setFilesize(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-800/80 border border-white/5 focus:border-emerald-500/50 text-white placeholder-zinc-500 text-sm outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5 justify-end">
                  <label className="flex items-center gap-2 cursor-pointer py-3 select-none">
                    <input
                      type="checkbox"
                      checked={isCloseIcon}
                      onChange={(e) => setIsCloseIcon(e.target.checked)}
                      className="w-4 h-4 accent-emerald-500 rounded border-white/10"
                    />
                    <span className="text-sm text-zinc-300">Show Close Icon</span>
                  </label>
                </div>
              </div>

              {/* Tag Section */}
              <div className="border-t border-white/5 pt-4 flex flex-col gap-4">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={hasTag}
                    onChange={(e) => setHasTag(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded border-white/10"
                  />
                  <span className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Enable Bottom Tag</span>
                </label>

                <AnimatePresence>
                  {hasTag && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden flex flex-col gap-4"
                    >
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-zinc-500">Tag Title</label>
                        <input
                          type="text"
                          placeholder="e.g. Download Now"
                          value={tagTitle}
                          onChange={(e) => setTagTitle(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg bg-zinc-800/80 border border-white/5 focus:border-emerald-500/50 text-white text-sm outline-none transition-all"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-zinc-500">Tag Color</label>
                        <div className="flex gap-3 px-1.5 py-1.5 items-center">
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
                                type="button"
                                onClick={() => setTagColor(color)}
                                className={`w-8 h-8 rounded-full cursor-pointer transition-all ${colorClasses[color]} ${
                                  tagColor === color ? 'ring-2 ring-offset-2 ring-offset-zinc-900 scale-110' : 'opacity-80 hover:opacity-100'
                                }`}
                                title={color.charAt(0).toUpperCase() + color.slice(1)}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 border-t border-white/5 pt-5 mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-sm font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-semibold text-sm transition-colors cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default DocModal;
