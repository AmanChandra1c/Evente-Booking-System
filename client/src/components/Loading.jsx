import React from 'react';
import { RiLoaderLine } from "react-icons/ri";

const Loading = () => {
  return (
    <>
      <div className="w-full h-screen flex items-center justify-center "><RiLoaderLine className='text-4xl font-bold animate-spin'/></div>
    </>
  );
};

export default Loading;