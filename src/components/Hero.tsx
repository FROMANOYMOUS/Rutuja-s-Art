import React from 'react';
import { Sparkles, ArrowRight, Heart, HeartHandshake, ShieldCheck, Flower } from 'lucide-react';
import { motion } from 'motion/react';
import { HERO_IMAGE } from '../data';

interface HeroProps {
  onBrowseCatalog: () => void;
  onExploreCustom: () => void;
}

export default function Hero({ onBrowseCatalog, onExploreCustom }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-orange-50 via-orange-100/30 to-white py-12 md:py-20 lg:py-24">
      {/* Background blobs for warm feel */}
      <div className="absolute top-1/4 -left-36 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl -z-10" />
      <div className="absolute top-1/3 -right-24 w-80 h-80 bg-rose-200/30 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Text Content Block */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 font-sans text-xs font-semibold tracking-wider uppercase mx-auto lg:mx-0"
              id="hero-badge"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>100% Hand-Twisted Chenille Art</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-sans font-bold text-4xl sm:text-5xl lg:text-6xl text-stone-800 tracking-tight leading-[1.1]"
              id="hero-title"
            >
              Everlasting Flowers for your{' '}
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-rose-500 to-rose-600">
                Auspicious Days
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-sans text-stone-600 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              id="hero-subtitle"
            >
              Exquisite handmade pipe cleaner flowers and traditional garlands by Rutuja. Celebrate festivals, pooja rituals, and home milestones with vibrant hibiscus, fluffy marigolds, and serene chafa blossoms that stay fresh and plump forever.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              id="hero-cta-buttons"
            >
              <motion.button
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={onBrowseCatalog}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold rounded-2xl shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-rose-300 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group text-base"
                id="hero-browse-btn"
              >
                <span>Browse Collection</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={onExploreCustom}
                className="w-full sm:w-auto px-8 py-4 bg-white text-stone-800 font-semibold rounded-2xl border border-stone-200 shadow-sm hover:bg-stone-50 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 text-base"
                id="hero-custom-btn"
              >
                <span>Design Custom Garland</span>
              </motion.button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-3 gap-3 pt-6 border-t border-stone-100 max-w-md mx-auto lg:mx-0"
              id="hero-trust-badges"
            >
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="flex items-center gap-1 text-rose-500 mb-1">
                  <Heart className="w-4 h-4 fill-rose-500" />
                  <span className="font-mono text-xs font-bold text-stone-800">100%</span>
                </div>
                <span className="text-[11px] text-stone-500 leading-tight">Handmade with Love</span>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="flex items-center gap-1 text-amber-500 mb-1">
                  <HeartHandshake className="w-4 h-4" />
                  <span className="font-mono text-xs font-bold text-stone-800">Eco</span>
                </div>
                <span className="text-[11px] text-stone-500 leading-tight">Reusable & Wash-friendly</span>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="flex items-center gap-1 text-emerald-600 mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="font-mono text-xs font-bold text-stone-800">Forever</span>
                </div>
                <span className="text-[11px] text-stone-500 leading-tight">Will Never Fade or Wither</span>
              </div>
            </motion.div>
          </div>

          {/* Right Image Block */}
          <div className="lg:col-span-5 relative" id="hero-image-block">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative mx-auto max-w-[420px] lg:max-w-none"
            >
              {/* Image Frame Accent Border */}
              <div className="absolute inset-0 bg-gradient-to-tr from-rose-200 to-amber-200 rounded-3xl rotate-3 scale-102 opacity-40 blur-sm" />
              
              {/* Product Frame */}
              <div className="relative bg-white p-3 rounded-3xl shadow-xl border border-stone-100 -rotate-1 hover:rotate-0 transition-transform duration-500 overflow-hidden">
                <img
                  src={HERO_IMAGE}
                  alt="Aesthetic pipe cleaner flower collection"
                  className="w-full h-auto aspect-[4/3] lg:aspect-[1] object-cover rounded-2xl"
                  referrerPolicy="no-referrer"
                  id="hero-img-element"
                />
                
                {/* Visual Label Tag Overlay */}
                <div className="absolute bottom-6 right-6 bg-stone-900/90 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-lg border border-white/10 flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-orange-200 font-bold leading-none">Featured Craft</p>
                    <p className="text-xs font-semibold font-sans mt-0.5 leading-none">Festival Garland Display</p>
                  </div>
                </div>
              </div>

              {/* Whimsical Floating Blossom 1 (Hibiscus red) */}
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 4.8, ease: "easeInOut" }}
                whileHover={{ scale: 1.4, rotate: 180, transition: { type: 'spring', stiffness: 350, damping: 10 } }}
                whileTap={{ scale: 0.8, rotate: -90 }}
                className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-md p-2.5 rounded-full shadow-lg border border-rose-100 cursor-grab active:cursor-grabbing text-rose-500 z-10 select-none"
                title="Spin me!"
              >
                <Flower className="w-5.5 h-5.5 fill-current" />
              </motion.div>

              {/* Whimsical Floating Blossom 2 (Marigold orange) */}
              <motion.div
                animate={{ y: [0, 8, 0], rotate: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut", delay: 0.6 }}
                whileHover={{ scale: 1.4, rotate: -180, transition: { type: 'spring', stiffness: 350, damping: 10 } }}
                whileTap={{ scale: 0.8, rotate: 90 }}
                className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-md p-2.5 rounded-full shadow-lg border border-amber-100 cursor-grab active:cursor-grabbing text-amber-500 z-10 select-none"
                title="Tap me!"
              >
                <Flower className="w-5 h-5 fill-current" />
              </motion.div>

              {/* Float Card */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="absolute -top-6 -left-6 bg-white p-4 rounded-2xl shadow-lg border border-orange-100 hidden sm:flex items-center gap-3 max-w-[200px]"
                id="hero-float-card"
              >
                <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-mono text-stone-400 uppercase tracking-wider font-bold">Rutuja's Promise</p>
                  <p className="text-xs font-semibold text-stone-800">Meticulous detail, flawless shape.</p>
                </div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
