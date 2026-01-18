
import React from 'react'
import { FaRegFileAlt } from "react-icons/fa";
import { LuDownload } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import {motion} from 'framer-motion';

function Card({ data, reference }) {
  return (
    <motion.div drag 
    dragConstraints={reference} whileDrag={{scale: 1.1}} dragElastic={0.1} dragTransition={{bounceStiffness: 200, bounceDamping: 60}}
  className='relative flex-shrink-0 w-57 h-62 rounded-[46px] bg-zinc-900/90 text-white px-8 py-10 overflow-hidden flex flex-col gap-4 shadow-lg shadow-black/10'>
      <FaRegFileAlt />
      <p className='text-sm mt-3 leading-tight'>
        {data.desc}
      </p>

      <div className='footer absolute bottom-0 w-full left-0'>
        <div className='flex justify-between px-8 py-1.5 mb-3 items-center'>
          <h5>{data.filesize}</h5>
          <span className='w-7 h-7 bg-zinc-600 rounded-full flex justify-center items-center hover:bg-white/20 cursor-pointer'>
            {data.close ? <IoClose /> : <LuDownload size=".8em" color='#fff' />}
          </span>
        </div>

        {data.tag.isOpen && (
          <div
            className={`tag w-full py-2.5 ${data.tag.color === "blue" ? "bg-sky-600" : "bg-green-600"} flex items-center justify-center`}
          >
            <h3 className='text-white text-sm'>{data.tag.tagTitle}</h3>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default Card;

