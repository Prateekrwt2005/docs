import React from 'react'

function background() {
  return (
    <>
    <div className='fixed z-[2] w-full h-screen'>
         <div className='absolute top-[5%] w-full py-10 flex justify-center text-zinc-600 text-xl'>Documents</div>
    <h1 className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[13vw] text-zinc-900 font-light leading-none tracking-tighter'>Docs.</h1>
    </div>
    </>
  )
}

export default background
