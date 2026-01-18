import React, { useRef } from 'react';
import Card from './Card';

function Foreground() {
    const ref= useRef(null);
  const data = [
    {
      desc: "I'm gonna make him an offer he can't refuse. It's not about what he wants, it's about what he can't say no to.",
      filesize: "9.2mb",
      close: false,
      tag: { isOpen: false, tagTitle: "Download Now", color: "green" },
    },
    {
      desc: "Not all treasure is silver and gold, mate. Some things are worth more than money.",
      filesize: "0.4mb",
      close: true,
      tag: { isOpen: true, tagTitle: "Download Now", color: "blue" },
    },
    {
      desc: "I’m just your friendly neighborhood Spider-Man.",
      filesize: "3mb",
      close: true,
      tag: { isOpen: true, tagTitle: "Upload Now", color: "green" },
    },
  ];

  return (
    <div ref={ref} className="fixed top-0 left-0 z-[3] w-full h-full flex items-start justify-start gap-5 flex-wrap overflow-hidden p-5">
      {data.map((item, index) => (
        <Card key={index} data={item} reference={ref} />
      ))}
    </div>
  );
}

export default Foreground;
