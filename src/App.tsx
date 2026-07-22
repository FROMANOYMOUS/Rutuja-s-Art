import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageCircle, Info, Heart, Flower } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import ProductDetailModal from './components/ProductDetailModal';
import Customizer from './components/Customizer';
import OrderTracker from './components/OrderTracker';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import { PRODUCTS } from './data';
import { Product, CartItem } from './types';

export default function App() {
  const [cart, setCart] = React.useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('rutujas_art_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [cartOpen, setCartOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeSection, setActiveSection] = React.useState('home');

  // Sync cart to localStorage
  React.useEffect(() => {
    localStorage.setItem('rutujas_art_cart', JSON.stringify(cart));
  }, [cart]);

  // Track active section on scroll
  React.useEffect(() => {
    if (activeSection === 'tracking') return;
    const handleScroll = () => {
      const sections = ['home', 'catalog', 'custom', 'reviews', 'faq'];
      const scrollPosition = window.scrollY + 160;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'home' || sectionId === 'tracking') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80; // height of sticky header
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      // If we are navigating from the tracking page to a section on the home page,
      // wait a moment for the elements to mount and then scroll
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          const yOffset = -80;
          const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex((item) => item.product.id === product.id);
      if (existingIdx > -1) {
        const updated = [...prevCart];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + quantity,
        };
        return updated;
      } else {
        return [...prevCart, { product, quantity }];
      }
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleBrowseCatalog = () => {
    handleNavigate('catalog');
  };

  const handleExploreCustom = () => {
    handleNavigate('custom');
  };

  return (
    <div className="min-h-screen bg-stone-50/20 text-stone-800 selection:bg-rose-100 selection:text-rose-800 antialiased" id="app-root">
      
      {/* Promotion bar */}
      <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600 text-white text-center py-2 px-4 text-xs font-semibold tracking-wider font-sans flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        <span>Festive Special: 10% Off on orders above ₹1,999! Each piece custom-crafted with premium soft pipe cleaners.</span>
      </div>

      {/* Main sticky navigation header */}
      <Navbar
        cart={cart}
        onOpenCart={() => setCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q) handleNavigate('catalog');
        }}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* Content Sections */}
      <main>
        {activeSection === 'tracking' ? (
          <OrderTracker onBackToShop={() => handleNavigate('home')} />
        ) : (
          <>
            {/* Hero Section */}
            <div id="home">
              <Hero
                onBrowseCatalog={handleBrowseCatalog}
                onExploreCustom={handleExploreCustom}
              />
            </div>

            {/* Handcrafted Process Spotlight strip */}
            <section className="bg-stone-900 text-white py-12 sm:py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                  <div className="p-4 space-y-2">
                    <span className="text-rose-400 font-mono text-2xl font-bold">01.</span>
                    <h4 className="font-bold text-lg">Meticulous Twisting</h4>
                    <p className="text-stone-400 text-sm leading-relaxed font-sans">
                      Each flower petal is sculpted individually with specialized soft chenille stems, creating plump, flexible, and symmetrical blossoms.
                    </p>
                  </div>
                  <div className="p-4 space-y-2">
                    <span className="text-amber-400 font-mono text-2xl font-bold">02.</span>
                    <h4 className="font-bold text-lg">Ribbon & Bead Detailing</h4>
                    <p className="text-stone-400 text-sm leading-relaxed font-sans">
                      The garlands are strung using high-grade satin ribbons and golden beads, mirroring the rich elegance of fresh floral gendas and chafas.
                    </p>
                  </div>
                  <div className="p-4 space-y-2">
                    <span className="text-emerald-400 font-mono text-2xl font-bold">03.</span>
                    <h4 className="font-bold text-lg">Everlasting Fragrance-Ready</h4>
                    <p className="text-stone-400 text-sm leading-relaxed font-sans">
                      Our pipe cleaner flowers don't dry up! You can optionally spray them with your favorite perfume or essential oils for custom scenting.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Products Catalog Grid */}
            <ProductGrid
              products={PRODUCTS}
              onAddToCart={(p) => handleAddToCart(p, 1)}
              onViewProduct={(p) => setSelectedProduct(p)}
              searchQuery={searchQuery}
            />

            {/* Customizer Workshop */}
            <Customizer />
          </>
        )}
      </main>

      {/* Footer (includes verified reviews and FAQ) */}
      <Footer />

      {/* Product Detail Modal dialog overlay */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={handleAddToCart}
          />
        )}
      </AnimatePresence>

      {/* Shopping Cart sidebar drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
