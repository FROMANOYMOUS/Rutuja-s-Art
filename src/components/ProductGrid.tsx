import React from 'react';
import { Star, ShoppingCart, Eye, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: 'spring', 
      stiffness: 260, 
      damping: 24 
    } 
  },
};

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onViewProduct: (product: Product) => void;
  searchQuery: string;
}

type FilterType = 'all' | 'single' | 'hibiscus-garlands' | 'festive-garlands';

export default function ProductGrid({
  products,
  onAddToCart,
  onViewProduct,
  searchQuery,
}: ProductGridProps) {
  const [activeFilter, setActiveFilter] = React.useState<FilterType>('all');

  const filters = [
    { id: 'all', label: 'All Crafts' },
    { id: 'single', label: 'Single Flowers' },
    { id: 'hibiscus-garlands', label: 'Hibiscus Garlands' },
    { id: 'festive-garlands', label: 'Festive Garlands' },
  ];

  // Filter products based on search AND categories
  const filteredProducts = products.filter((product) => {
    // Search query check
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.flowerType.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Filter type check
    if (activeFilter === 'all') return true;
    if (activeFilter === 'single') return product.category === 'flower';
    if (activeFilter === 'hibiscus-garlands') {
      return product.category === 'garland' && product.flowerType === 'hibiscus';
    }
    if (activeFilter === 'festive-garlands') {
      return product.category === 'garland' && (product.flowerType === 'marigold' || product.flowerType === 'chafa');
    }
    return true;
  });

  return (
    <section id="catalog" className="py-16 md:py-24 bg-stone-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="font-sans font-bold text-3xl sm:text-4xl text-stone-800 tracking-tight" id="catalog-header">
            Discover Our Handcrafted Blossoms
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-amber-500 to-rose-500 mx-auto mt-4 rounded-full" />
          <p className="font-sans text-stone-500 mt-4 text-base sm:text-lg">
            Lovingly twisted from high-quality plush chenille stems. Our custom flowers bring everlasting color and auspicious charm to your home decor and sacred spaces.
          </p>
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 mb-10 sm:mb-14" id="catalog-filters">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id as FilterType)}
              className={`font-sans text-xs sm:text-sm font-semibold px-4.5 py-2.5 rounded-full border cursor-pointer transition-all duration-300 ${
                activeFilter === filter.id
                  ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-200'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
              }`}
              id={`filter-btn-${filter.id}`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-100 shadow-sm max-w-lg mx-auto px-6">
            <Sparkles className="w-12 h-12 text-amber-500 mx-auto mb-4 animate-bounce" />
            <h3 className="text-lg font-bold text-stone-800">No flower matched your search</h3>
            <p className="text-sm text-stone-500 mt-2">
              We can custom craft any style! Try searching for 'hibiscus', 'marigold' or click the Custom Inquiry below.
            </p>
            <button
              onClick={() => setActiveFilter('all')}
              className="mt-6 px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-sm font-semibold rounded-xl cursor-pointer transition-all"
            >
              Clear filters & search
            </button>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10" 
            id="product-cards-grid"
          >
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={cardVariants}
                layout
                whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
                whileTap={{ scale: 0.985 }}
                className="group bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-sm transition-all duration-300 flex flex-col h-full"
                id={`product-card-${product.id}`}
              >
                {/* Image Section */}
                <div className="relative aspect-[4/3] bg-orange-50/20 overflow-hidden cursor-pointer" onClick={() => onViewProduct(product)}>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    id={`product-img-${product.id}`}
                  />
                  
                  {/* Tags overlay */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                    {product.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className={`text-[10px] font-bold font-mono tracking-wide uppercase px-2.5 py-1 rounded-full text-white ${
                          tag === 'Best Seller'
                            ? 'bg-amber-500 shadow-sm'
                            : tag === 'Premium Craft' || tag === 'Premium Elegant'
                            ? 'bg-rose-600 shadow-sm'
                            : 'bg-stone-800/80 shadow-sm'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Rating Badge Overlay */}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold text-stone-800 font-mono leading-none mt-0.5">{product.rating}</span>
                    <span className="text-[10px] text-stone-500 leading-none mt-0.5">({product.reviewsCount})</span>
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Specifications badges */}
                    <div className="flex gap-2 mb-2.5">
                      {product.specs.flowerCount && (
                        <span className="text-[10px] font-mono font-semibold bg-orange-50 text-orange-700 px-2 py-0.5 rounded border border-orange-100">
                          {product.specs.flowerCount} Flowers
                        </span>
                      )}
                      {product.specs.length && (
                        <span className="text-[10px] font-mono font-semibold bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-100">
                          {product.specs.length} Length
                        </span>
                      )}
                      <span className="text-[10px] font-mono font-semibold bg-stone-50 text-stone-600 px-2 py-0.5 rounded border border-stone-200/60 ml-auto">
                        {product.specs.durability.split(',')[0]}
                      </span>
                    </div>

                    <h3 
                      onClick={() => onViewProduct(product)}
                      className="font-sans font-bold text-lg sm:text-xl text-stone-800 hover:text-rose-600 cursor-pointer transition-colors leading-snug"
                    >
                      {product.name}
                    </h3>
                    
                    <p className="font-sans text-stone-500 text-sm mt-2 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Buy / CTA section */}
                  <div className="pt-5 mt-5 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-stone-400 block font-sans">Price</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold font-mono text-stone-800">₹{product.price}</span>
                        <span className="text-xs text-stone-500 font-mono">(~${(product.price / 83).toFixed(1)})</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => onViewProduct(product)}
                        className="p-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-600 rounded-xl cursor-pointer transition-all"
                        title="View Details"
                        id={`view-details-${product.id}`}
                      >
                        <Eye className="w-5 h-5" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => onAddToCart(product)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-rose-100 cursor-pointer transition-all"
                        id={`add-to-cart-${product.id}`}
                      >
                        <ShoppingCart className="w-4.5 h-4.5" />
                        <span>Add to Cart</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

      </div>
    </section>
  );
}
