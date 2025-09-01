import React from 'react'
import Heroimage2 from '../assets/rayz-images/Heroimage2.webp';
import { Link } from "react-router-dom";
// ...existing code...
export const Herosection2 = () => {
  return (
    <div><section className="relative w-full h-[80vh] heroimage">
      {/* Background Image */}
      <img
        src={Heroimage2}
        alt="Hero Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay for darkening the image (optional) */}
      <div className="absolute inset-0 bg-black/10"></div>

      {/* Content on top */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold">Joy of luxury</h1>
        <p className="mt-4 text-lg md:text-xl">Explore our exclusive collections</p>
        <Link to="/New"><button className="mt-8 px-6 py-3 bg-white text-black ">Shop Now</button></Link>
      </div>
    </section></div>
  )
}
