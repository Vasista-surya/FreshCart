import React from 'react';
import { motion } from 'framer-motion';

/**
 * AnimatedCharacter
 * A premium vector-sharp SVG character that handles 4 states:
 * - 'walk-in' / 'walk-out': realistic leg swing cycles, arm sways, torso bobbing
 * - 'surprised' (Stage 2 - magic swirl): standing, wide eyes, curious mouth
 * - 'happy-thumbsup' (Stage 3 & 4 - success): standing/walking, big smile, thumbs up, winking
 * - 'waving' (Login page): friendly greeting wave
 * 
 * Supports bag contents states: 'empty', 'half', 'full'
 */
const AnimatedCharacter = ({ 
  state = 'walk-in', // 'walk-in' | 'surprised' | 'happy-thumbsup' | 'waving' | 'walk-out'
  bagState = 'empty', // 'empty' | 'half' | 'full'
  className = '' 
}) => {
  const isWalking = state === 'walk-in' || state === 'walk-out';

  // Torso vertical bobbing variant
  const torsoBob = {
    walk: {
      y: [0, -6, 0, -6, 0],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    idle: {
      y: 0
    }
  };

  // Leg scissor-walk cycles
  const leftLegAnim = {
    walk: {
      rotate: [-22, 22, -22],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: "linear"
      }
    },
    idle: {
      rotate: 0
    }
  };

  const rightLegAnim = {
    walk: {
      rotate: [22, -22, 22],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: "linear"
      }
    },
    idle: {
      rotate: 0
    }
  };

  // Arm sway animation
  const leftArmAnim = {
    walk: {
      rotate: [15, -15, 15],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: "linear"
      }
    },
    idle: {
      rotate: 0
    }
  };

  const rightArmAnim = {
    walk: {
      rotate: [-15, 15, -15],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: "linear"
      }
    },
    thumbsUp: {
      rotate: -45,
      y: -10,
      x: 5,
      transition: { duration: 0.4, type: 'spring' }
    },
    wave: {
      rotate: [0, -40, -10, -40, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    idle: {
      rotate: 0
    }
  };

  const bagSwingAnim = {
    walk: {
      rotate: [-8, 8, -8],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: "linear"
      }
    },
    idle: {
      rotate: 0
    }
  };

  return (
    <div className={`relative select-none ${className}`} style={{ width: '100%', height: '100%' }}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 200 350" 
        className="w-full h-full drop-shadow-[0_20px_50px_rgba(79,61,245,0.3)]"
      >
        {/* CHARACTER RIG GROUP */}
        <motion.g
          animate={isWalking ? "walk" : "idle"}
          className="origin-bottom"
        >
          {/* BACKGROUND SHADOW GENTLE GLOW */}
          <ellipse cx="100" cy="335" rx="50" ry="10" fill="#000000" fillOpacity="0.25" />

          {/* LEFT LEG & FOOT */}
          <motion.g 
            variants={leftLegAnim} 
            style={{ originX: '85px', originY: '215px' }}
          >
            {/* Charcoal Trouser */}
            <path d="M80,215 L90,215 L82,310 L72,310 Z" fill="#334155" />
            {/* Sneaker Joint */}
            <rect x="68" y="306" width="16" height="8" rx="2" fill="#ffffff" />
            {/* White Shoe */}
            <path d="M66,310 L84,310 L84,320 L62,320 C62,315 64,310 66,310 Z" fill="#ffffff" />
            {/* Sole */}
            <path d="M62,319 L84,319 L84,322 L62,322 Z" fill="#cbd5e1" />
          </motion.g>

          {/* RIGHT LEG & FOOT */}
          <motion.g 
            variants={rightLegAnim} 
            style={{ originX: '115px', originY: '215px' }}
          >
            {/* Charcoal Trouser */}
            <path d="M110,215 L120,215 L128,310 L118,310 Z" fill="#334155" />
            {/* Sneaker Joint */}
            <rect x="116" y="306" width="16" height="8" rx="2" fill="#ffffff" />
            {/* White Shoe */}
            <path d="M116,310 L134,310 C136,310 138,315 138,320 L116,320 Z" fill="#ffffff" />
            {/* Sole */}
            <path d="M116,319 L138,319 L138,322 L116,322 Z" fill="#cbd5e1" />
          </motion.g>

          {/* MAIN UPPER BODY GROUP (Bobs during walk) */}
          <motion.g 
            variants={torsoBob}
            style={{ originX: '100px', originY: '220px' }}
          >
            {/* TORSO & BLAZER */}
            {/* White Shirt Underneath */}
            <path d="M90,120 L110,120 L105,215 L95,215 Z" fill="#ffffff" />
            {/* Golden Devotional Medallion/Chain */}
            <path d="M93,125 Q100,145 107,125" stroke="#f59e0b" strokeWidth="2.5" fill="none" />
            <circle cx="100" cy="143" r="4.5" fill="#d97706" />

            {/* Smart Casual Grey Blazer */}
            <path d="M74,120 L126,120 L120,220 L80,220 Z" fill="#64748b" />
            {/* Blazer Lapels */}
            <path d="M74,120 L96,150 L95,185 L80,220" stroke="#475569" strokeWidth="2.5" fill="none" />
            <path d="M126,120 L104,150 L105,185 L120,220" stroke="#475569" strokeWidth="2.5" fill="none" />
            {/* Blazer Pockets */}
            <rect x="80" y="185" width="12" height="7" rx="1.5" fill="#475569" />
            <rect x="108" y="185" width="12" height="7" rx="1.5" fill="#475569" />

            {/* HEAD & NECK */}
            {/* Neck */}
            <rect x="94" y="105" width="12" height="20" rx="2" fill="#fed7aa" />
            
            {/* Face Oval */}
            <circle cx="100" cy="80" r="23" fill="#fed7aa" />

            {/* Blonde Hair */}
            {/* Back Hair */}
            <path d="M77,80 C74,55 126,55 123,80 C123,83 125,85 125,88 C122,88 120,83 118,80 C110,65 90,65 82,80 Z" fill="#f59e0b" />
            {/* Dynamic Fringe / Front Hair Swirl */}
            <path d="M78,72 Q100,45 124,68 C115,55 95,58 84,65 Z" fill="#d97706" />

            {/* Neat Trimmed Blonde Beard */}
            <path d="M78,75 Q78,105 100,105 Q122,105 122,75 C122,95 110,101 100,101 Q90,101 78,75 Z" fill="#d97706" />
            <path d="M84,88 Q100,100 116,88 Q100,97 84,88 Z" fill="#b45309" />
            {/* Mustache */}
            <path d="M88,86 Q100,91 112,86 Q100,95 88,86 Z" fill="#f59e0b" />

            {/* EYES */}
            {state === 'happy-thumbsup' ? (
              // Left winking, right smiling eye
              <g>
                {/* Winking Left Eye */}
                <path d="M87,76 Q92,80 97,76" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                {/* Smiling Right Eye */}
                <path d="M103,75 Q108,71 113,75" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinecap="round" />
                <circle cx="108" cy="77" r="3.5" fill="#2563eb" />
                <circle cx="109" cy="76" r="1" fill="#ffffff" />
              </g>
            ) : state === 'surprised' ? (
              // Wide open astonished eyes
              <g>
                <circle cx="91" cy="76" r="4.5" fill="#ffffff" />
                <circle cx="91" cy="76" r="2.5" fill="#2563eb" />
                <circle cx="109" cy="76" r="4.5" fill="#ffffff" />
                <circle cx="109" cy="76" r="2.5" fill="#2563eb" />
              </g>
            ) : (
              // Normal friendly eyes
              <g>
                <circle cx="91" cy="76" r="3.5" fill="#2563eb" />
                <circle cx="91" cy="75.2" r="1" fill="#ffffff" />
                <circle cx="109" cy="76" r="3.5" fill="#2563eb" />
                <circle cx="109" cy="75.2" r="1" fill="#ffffff" />
              </g>
            )}

            {/* EYEBROWS */}
            <motion.path 
              d="M85,70 Q91,67 96,70" 
              stroke="#b45309" strokeWidth="2" fill="none" strokeLinecap="round"
              animate={state === 'surprised' ? { y: -3 } : { y: 0 }}
            />
            <motion.path 
              d="M104,70 Q109,67 115,70" 
              stroke="#b45309" strokeWidth="2" fill="none" strokeLinecap="round"
              animate={state === 'surprised' ? { y: -3 } : { y: 0 }}
            />

            {/* MOUTH */}
            {state === 'happy-thumbsup' ? (
              // Big happy laughing open mouth
              <path d="M92,85 Q100,100 108,85 Z" fill="#991b1b" stroke="#1e293b" strokeWidth="1.5" />
            ) : state === 'surprised' ? (
              // Astonished circle ooh mouth
              <circle cx="100" cy="88" r="5" fill="#1e293b" />
            ) : (
              // Gentle soft friendly smile
              <path d="M93,86 Q100,92 107,86" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            )}

            {/* LEFT ARM (Carries the bag) */}
            <motion.g
              variants={leftArmAnim}
              style={{ originX: '74px', originY: '125px' }}
            >
              {/* Sleeve */}
              <path d="M74,120 L60,165 L70,168 L80,128 Z" fill="#64748b" />
              {/* Hand */}
              <circle cx="58" cy="170" r="6" fill="#fed7aa" />

              {/* PAPER GROCERY BAG */}
              <motion.g
                variants={bagSwingAnim}
                style={{ originX: '58px', originY: '170px' }}
                className="cursor-pointer"
              >
                {/* Bag Handles */}
                <path d="M48,172 Q58,155 68,172" stroke="#a18262" strokeWidth="3" fill="none" />
                
                {/* Paper Bag Main Body */}
                <path d="M38,172 L78,172 L72,225 L44,225 Z" fill="#d2b48c" />
                <path d="M38,172 L44,225 M78,172 L72,225" stroke="#b49372" strokeWidth="1.5" />

                {/* Radhakrishna Brand Logo on Bag */}
                <g transform="translate(58, 202) scale(0.65)">
                  {/* Small Lotus Devotional Icon */}
                  <path d="M-10,0 C-10,-8 0,-15 0,-15 C0,-15 10,-8 10,0 C10,5 5,8 0,8 C-5,8 -10,5 -10,0 Z" fill="#d97706" />
                  <path d="M-6,2 C-6,-4 0,-10 0,-10 C0,-10 6,-4 6,2 C6,5 3,7 0,7 C-3,7 -6,5 -6,2 Z" fill="#f59e0b" />
                  <circle cx="0" cy="1" r="2.5" fill="#ffffff" />
                </g>

                {/* BAG CONTENTS DYNAMIC GRAPHICS */}
                {bagState === 'half' && (
                  <g transform="translate(42, 160)">
                    {/* Lettuce leaves */}
                    <path d="M0,12 C-5,0 12,0 8,12 Z" fill="#22c55e" />
                    {/* Carrot top */}
                    <path d="M12,12 L16,-2 L20,12" stroke="#f97316" strokeWidth="4" fill="none" strokeLinecap="round" />
                    <path d="M16,-2 L14,-6 M16,-2 L18,-6" stroke="#15803d" strokeWidth="2.5" fill="none" />
                  </g>
                )}

                {bagState === 'full' && (
                  <g transform="translate(36, 150)">
                    {/* Red Tomato/Apple */}
                    <circle cx="10" cy="20" r="9" fill="#ef4444" />
                    <path d="M10,12 Q8,10 6,12" stroke="#15803d" strokeWidth="2" fill="none" />
                    
                    {/* Blue Milk Packet */}
                    <rect x="18" y="5" width="13" height="18" rx="2" fill="#3b82f6" />
                    <path d="M18,5 L24.5,-2 L31,5 Z" fill="#1d4ed8" />
                    <rect x="21" y="9" width="7" height="4" fill="#ffffff" />

                    {/* Lettuce bunch */}
                    <circle cx="12" cy="12" r="8" fill="#22c55e" />
                    <circle cx="6" cy="14" r="6.5" fill="#4ade80" />
                    <circle cx="16" cy="13" r="6.5" fill="#4ade80" />

                    {/* Yellow Bananas */}
                    <path d="M28,18 Q38,5 34,-5" stroke="#facc15" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                    <path d="M29,19 Q39,7 36,-3" stroke="#eab308" strokeWidth="3" strokeLinecap="round" fill="none" />

                    {/* Sparkle lines */}
                    <path d="M0,0 L3,-4 M38,0 L35,-4" stroke="#ffffff" strokeWidth="1.5" />
                  </g>
                )}
              </motion.g>
            </motion.g>

            {/* RIGHT ARM (Sways, gives thumbs up, waves) */}
            <motion.g
              animate={
                state === 'happy-thumbsup' 
                  ? 'thumbsUp' 
                  : state === 'waving' 
                    ? 'wave' 
                    : 'idle'
              }
              variants={rightArmAnim}
              style={{ originX: '126px', originY: '125px' }}
            >
              {/* Sleeve */}
              <path d="M126,120 L140,165 L130,168 L120,128 Z" fill="#64748b" />
              {/* Hand */}
              <circle cx="142" cy="170" r="6" fill="#fed7aa" />

              {/* Thumbs up graphics attachment */}
              {state === 'happy-thumbsup' && (
                <g transform="translate(142, 170)">
                  {/* Thumb raised */}
                  <path d="M4,-4 C6,-12 0,-14 -2,-12 C-4,-10 -2,-4 -2,-4" stroke="#fed7aa" strokeWidth="3.5" fill="#fed7aa" strokeLinecap="round" />
                  {/* Fist fingers */}
                  <circle cx="2" cy="-1" r="2.5" fill="#e0a96d" />
                  <circle cx="2" cy="2" r="2.5" fill="#e0a96d" />
                  <circle cx="1" cy="5" r="2.5" fill="#e0a96d" />
                  {/* Golden sparkly glow at thumbs up */}
                  <circle cx="1" cy="-10" r="1.5" fill="#ffffff" />
                  <path d="M1,-16 L1,-13 M-2,-10 L-5,-10 M4,-10 L7,-10" stroke="#facc15" strokeWidth="1" />
                </g>
              )}
            </motion.g>
          </motion.g>
        </motion.g>
      </svg>
    </div>
  );
};

export default AnimatedCharacter;
