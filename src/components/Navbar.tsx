import React from 'react';
import { ShoppingBag, Flower, Search, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types';

interface NavbarProps {
  cart: CartItem[];
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export default function Navbar({
  cart,
  onOpenCart,
  searchQuery,
  onSearchChange,
  activeSection,
  onNavigate,
}: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'catalog', label: 'Our Collection' },
    { id: 'custom', label: 'Custom Garlands' },
    { id: 'tracking', label: 'Track Order' },
    { id: 'reviews', label: 'Customer Love' },
    { id: 'faq', label: 'FAQs' },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-orange-50/95 backdrop-blur-md border-b border-orange-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-2.5 cursor-pointer group"
            id="nav-logo-btn"
          >
            <div className="bg-gradient-to-tr from-amber-500 to-rose-500 p-2 rounded-full shadow-md group-hover:rotate-12 transition-transform duration-300">
              <Flower className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-sans font-bold text-lg sm:text-xl text-stone-800 tracking-tight block">
                Rutuja's Art Collection
              </span>
              <span className="text-[10px] font-mono tracking-wider text-rose-600 font-medium uppercase block -mt-1">
                Handcrafted Pipe Cleaner Flowers
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`font-sans text-[15px] font-medium transition-colors relative py-2 cursor-pointer ${
                  activeSection === link.id
                    ? 'text-rose-600'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                id={`nav-link-${link.id}`}
              >
                {link.label}
                {activeSection === link.id && (
                  <motion.div
                    layoutId="activeUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Search Bar & Cart Icons */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search flowers..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-48 xl:w-64 bg-orange-100/50 hover:bg-orange-100/80 focus:bg-white text-stone-800 text-sm pl-10 pr-4 py-2 rounded-full border border-orange-200/50 focus:border-rose-300 focus:outline-none transition-all duration-300"
                id="search-input-desktop"
              />
              <Search className="absolute left-3.5 top-2.5 w-4.5 h-4.5 text-stone-400" />
            </div>

            <button
              onClick={onOpenCart}
              className="relative p-2.5 bg-rose-50 hover:bg-rose-100 rounded-full text-rose-600 cursor-pointer transition-all duration-300 shadow-sm border border-rose-100/40"
              id="cart-trigger-desktop"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag className="w-5.5 h-5.5" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white font-mono text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* Mobile Buttons */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={onOpenCart}
              className="relative p-2 bg-rose-50 hover:bg-rose-100 rounded-full text-rose-600 cursor-pointer"
              id="cart-trigger-mobile"
              aria-label="Open Shopping Cart Mobile"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white font-mono text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100/80 cursor-pointer"
              id="mobile-menu-toggle"
              aria-label="Toggle Mobile Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-orange-100 bg-orange-50/98 px-4 py-4 space-y-4"
          >
            {/* Mobile Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search flowers or garlands..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-orange-100/50 text-stone-800 text-sm pl-10 pr-4 py-2.5 rounded-full border border-orange-200/50 focus:border-rose-300 focus:outline-none"
                id="search-input-mobile"
              />
              <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-stone-400" />
            </div>

            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigate(link.id);
                    setIsOpen(false);
                  }}
                  className={`text-left font-sans text-base font-semibold py-2.5 px-4 rounded-xl transition-colors cursor-pointer ${
                    activeSection === link.id
                      ? 'bg-rose-50 text-rose-600'
                      : 'text-stone-600 hover:bg-stone-100/50'
                  }`}
                  id={`nav-link-mobile-${link.id}`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
