
import React from 'react';
import { FaRegFileAlt } from 'react-icons/fa';
import { LuDownload, LuPencil } from 'react-icons/lu';
import { IoClose } from 'react-icons/io5';
import { motion } from 'framer-motion';

const tagColorMap = {
  green: 'bg-emerald-600',
  blue: 'bg-sky-600',
  red: 'bg-rose-600',
  yellow: 'bg-amber-500',
  purple: 'bg-violet-600',
};

const glowStyles = {
  green: 'rgba(16, 185, 129, 0.08)',
  blue: 'rgba(14, 165, 233, 0.08)',
  red: 'rgba(244, 63, 94, 0.08)',
  yellow: 'rgba(245, 158, 11, 0.08)',
  purple: 'rgba(139, 92, 246, 0.08)'
};

const renderFormattedText = (text) => {
  if (!text) return '';
  
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    let content = line;
    let isListItem = false;
    
    if (line.startsWith('- ')) {
      content = line.slice(2);
      isListItem = true;
    }
    
    // Handle bold (**text**)
    const boldParts = content.split(/\*\*(.*?)\*\*/g);
    const elements = boldParts.map((part, index) => {
      if (index % 2 === 1) {
        const italicParts = part.split(/\*(.*?)\*/g);
        return (
          <strong key={index} className="font-bold text-white">
            {italicParts.map((p, i) => i % 2 === 1 ? <em key={i} className="italic">{p}</em> : p)}
          </strong>
        );
      }
      const italicParts = part.split(/\*(.*?)\*/g);
      return italicParts.map((p, i) => i % 2 === 1 ? <em key={i} className="italic" key={i}>{p}</em> : p);
    });
    
    if (isListItem) {
      return (
        <li key={idx} className="list-disc list-inside ml-1 text-zinc-300 mt-1 leading-snug text-sm">
          {elements}
        </li>
      );
    }
    
    return (
      <div key={idx} className="min-h-[1.25em] leading-snug">
        {elements}
      </div>
    );
  });
};

function Card({ data, reference, onEdit, onDelete }) {
  const tagColorClass = data.tag?.color ? (tagColorMap[data.tag.color] || 'bg-emerald-600') : 'bg-emerald-600';

  return (
    <motion.div
      drag
      dragConstraints={reference}
      whileDrag={{ scale: 1.05, zIndex: 50 }}
      dragElastic={0.1}
      dragTransition={{ bounceStiffness: 200, bounceDamping: 60 }}
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      className="relative flex-shrink-0 w-58 h-64 rounded-[42px] bg-zinc-900 text-white px-7 py-8 overflow-hidden flex flex-col justify-between shadow-xl border border-white/5 hover:border-white/10 transition-colors"
    >
      <div>
        {/* Top Header Section */}
        <div className="flex justify-between items-center text-zinc-400">
          <FaRegFileAlt className="text-white/70" size="1.1em" />
          <div className="flex gap-2 z-10">
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="w-7 h-7 rounded-full bg-zinc-800/80 hover:bg-zinc-700 flex justify-center items-center cursor-pointer transition-colors text-white/60 hover:text-white"
              title="Edit Card"
            >
              <LuPencil size=".8em" />
            </button>
          </div>
        </div>

        {/* Card Content Description */}
        <div className="text-sm mt-5 text-zinc-200 font-medium pr-1">
          {renderFormattedText(data.desc)}
        </div>
      </div>

      {/* Footer Area */}
      <div className="footer absolute bottom-0 w-full left-0">
        <div className="flex justify-between px-7 py-1.5 mb-3 items-center">
          <h5 className="text-xs font-semibold text-zinc-400">{data.filesize}</h5>
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="w-7 h-7 bg-zinc-800/80 rounded-full flex justify-center items-center hover:bg-white/20 cursor-pointer transition-all border border-white/5 text-white"
            title="Delete Card"
          >
            {data.close ? <IoClose size="1.1em" /> : <LuDownload size=".8em" />}
          </button>
        </div>

        {data.tag?.isOpen && (
          <div className={`tag w-full py-3 ${tagColorClass} flex items-center justify-center cursor-pointer hover:brightness-110 transition-all`}>
            <h3 className="text-white text-xs font-semibold uppercase tracking-wider">{data.tag.tagTitle}</h3>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default Card;


