"use client";
import Link from "next/link";
import { useId } from "react";

export default function BrandLogo({ onClick }) {
  // Generates a unique ID so the gradients don't collide when
  // rendered in both the Desktop Sidebar and Mobile Menu!
  const logoId = useId().replace(/:/g, "");

  return (
    <Link
      href='/dashboard'
      onClick={onClick}
      className='flex items-center gap-3.5 group w-fit shrink-0'
    >
      {/* Premium Animated Icon */}
      <div className='relative flex items-center justify-center w-12 h-12 shrink-0'>
        {/* Dynamic Background Glow */}
        <div className='absolute inset-0 bg-indigo-500 blur-xl opacity-20 group-hover:opacity-40 group-hover:bg-cyan-400 transition-all duration-500 rounded-full'></div>

        {/* Core Geometric SVG */}
        <svg
          viewBox='0 0 40 40'
          fill='none'
          className='relative w-full h-full transform group-hover:scale-105 transition-transform duration-500 ease-out'
          xmlns='http://www.w3.org/2000/svg'
        >
          <defs>
            <linearGradient
              id={`k-stem-${logoId}`}
              x1='0%'
              y1='0%'
              x2='0%'
              y2='100%'
            >
              <stop offset='0%' stopColor='#818cf8' /> {/* Indigo 400 */}
              <stop offset='100%' stopColor='#4f46e5' /> {/* Indigo 600 */}
            </linearGradient>
            <linearGradient
              id={`k-top-${logoId}`}
              x1='0%'
              y1='100%'
              x2='100%'
              y2='0%'
            >
              <stop offset='0%' stopColor='#22d3ee' /> {/* Cyan 400 */}
              <stop offset='100%' stopColor='#3b82f6' /> {/* Blue 500 */}
            </linearGradient>
            <linearGradient
              id={`k-bottom-${logoId}`}
              x1='0%'
              y1='0%'
              x2='100%'
              y2='100%'
            >
              <stop offset='0%' stopColor='#a78bfa' /> {/* Violet 400 */}
              <stop offset='100%' stopColor='#6d28d9' /> {/* Violet 700 */}
            </linearGradient>
          </defs>

          {/* Left Vertical Stem */}
          <rect
            x='6'
            y='6'
            width='8'
            height='28'
            rx='4'
            fill={`url(#k-stem-${logoId})`}
          />

          {/* Top Right Arm */}
          <path
            d='M14 21L28 6H34C34 6 22 18 18 22.5L14 21Z'
            fill={`url(#k-top-${logoId})`}
            className='drop-shadow-md'
          />

          {/* Bottom Right Arm */}
          <path
            d='M14 20L34 34H28L14 20Z'
            fill={`url(#k-bottom-${logoId})`}
            className='drop-shadow-lg'
          />

          {/* Intersection Accent Node */}
          <circle
            cx='15'
            cy='20.5'
            r='2.5'
            fill='#ffffff'
            className='opacity-90 shadow-sm'
          />
        </svg>
      </div>

      {/* Premium Typography */}
      <div className='flex flex-col justify-center'>
        <span className='text-2xl font-black bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-700 leading-none tracking-tighter group-hover:from-indigo-600 group-hover:to-cyan-500 transition-all duration-500'>
          Kunj
        </span>
        <span className='text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.25em] mt-1.5 leading-none group-hover:text-indigo-500 transition-colors duration-300'>
          Tech Agency
        </span>
      </div>
    </Link>
  );
}
