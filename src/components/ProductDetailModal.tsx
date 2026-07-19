import React from 'react';
import { X, Star, ShoppingCart, MessageCircle, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
}: ProductDetailModalProps) {
  const [quantity, setQuantity] = React.useState(1);
  const [showSuccessToast, setShowSuccessToast] = React.useState(false);

  React.useEffect(() => {
    // Reset quantity when modal opens for a new product
    if (product) {
      setQuantity(1);
      setShowSuccessToast(false);
    }
  }, [product]);

  if (!product) return null;

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCartClick = () => {
    onAddToCart(product, quantity);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 2500);
  };

  const handleWhatsAppQuickOrder = () => {
    const text = `Hi Rutuja, I am interested in ordering from Rutuja's Art Collection:
🌟 Product: *${product.name}*
📦 Quantity: *${quantity}*
💰 Total: *₹${product.price * quantity}*

Please let me know how to proceed with payment and delivery details. Thanks!`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-stone-900/65 backdrop-blur-sm"
      />

      {/* Modal Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-stone-100 flex flex-col md:flex-row z-10 max-h-[90vh] md:max-h-none"
      >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 rounded-full cursor-pointer transition-colors"
            id="close-product-modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Column - Image */}
          <div className="md:w-1/2 relative bg-stone-50 h-64 md:h-auto min-h-[250px] flex items-center justify-center">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Handcrafted Badge overlay */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-sm flex items-center gap-1.5 border border-amber-100">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-100" />
              <span className="text-[11px] font-sans font-bold text-stone-800 uppercase tracking-wider">100% Handcrafted</span>
            </div>
          </div>

          {/* Right Column - Info */}
          <div className="md:w-1/2 p-6 sm:p-8 overflow-y-auto max-h-[50vh] md:max-h-[85vh] flex flex-col justify-between">
            <div>
              {/* Category tag */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
                  {product.category === 'flower' ? 'Single Flower' : 'Festive Garland'}
                </span>
                <span className="text-xs text-stone-400 font-sans">
                  ID: #{product.id}
                </span>
              </div>

              {/* Title */}
              <h2 className="font-sans font-bold text-2xl sm:text-3xl text-stone-800 leading-tight">
                {product.name}
              </h2>

              {/* Rating and Price */}
              <div className="flex items-center justify-between mt-4 pb-4 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'fill-amber-400'
                            : 'text-stone-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-stone-700 font-mono mt-0.5">
                    {product.rating}
                  </span>
                  <span className="text-xs text-stone-400">
                    ({product.reviewsCount} verified reviews)
                  </span>
                </div>

                <div>
                  <span className="text-2xl font-bold font-mono text-stone-800">
                    ₹{product.price}
                  </span>
                  <span className="text-xs text-stone-500 block text-right font-mono -mt-1">
                    ~${(product.price / 83).toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="font-sans text-stone-600 text-sm sm:text-base leading-relaxed mt-4">
                {product.description}
              </p>

              {/* Specifications Block */}
              <div className="mt-5 space-y-3 bg-orange-50/40 p-4 rounded-2xl border border-orange-100/40 text-sm">
                <h4 className="font-bold text-stone-700 font-sans flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Product Specifications:
                </h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 font-sans text-stone-600">
                  {product.specs.flowerCount && (
                    <div>
                      <span className="text-stone-400 text-xs block">Flower Count:</span>
                      <span className="font-semibold text-stone-800">{product.specs.flowerCount} Blossoms</span>
                    </div>
                  )}
                  {product.specs.length && (
                    <div>
                      <span className="text-stone-400 text-xs block">Garland Length:</span>
                      <span className="font-semibold text-stone-800">{product.specs.length}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-stone-400 text-xs block">Materials Used:</span>
                    <span className="font-semibold text-stone-800 text-xs block truncate" title={product.specs.materials.join(', ')}>
                      {product.specs.materials.join(', ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 text-xs block">Durability:</span>
                    <span className="font-semibold text-stone-800 text-xs block">{product.specs.durability}</span>
                  </div>
                </div>

                {/* Maintenance instruction */}
                <div className="pt-2 border-t border-orange-100/30 flex items-center gap-2 text-xs text-stone-500">
                  <RefreshCw className="w-3.5 h-3.5 text-stone-400 animate-spin-slow" />
                  <span>Maintenance: Blow off dust with a hairdryer on cold/low speed. Do not wash in water.</span>
                </div>
              </div>
            </div>

            {/* Actions Block */}
            <div className="mt-6 pt-5 border-t border-stone-100">
              {/* Success Toast */}
              <AnimatePresence>
                {showSuccessToast && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 bg-emerald-50 border border-emerald-100 p-3 rounded-xl text-emerald-700 text-xs flex items-center gap-2 font-sans font-semibold"
                  >
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 flex-shrink-0" />
                    <span>Added {quantity} x {product.name} to your cart successfully!</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {/* Quantity selector */}
                <div className="flex items-center justify-between border border-stone-200 p-1 bg-stone-50 rounded-2xl sm:w-36">
                  <button
                    onClick={handleDecrease}
                    className="w-10 h-10 flex items-center justify-center text-stone-500 hover:text-stone-800 hover:bg-stone-200 rounded-xl cursor-pointer transition-colors"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-stone-800 text-lg w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrease}
                    className="w-10 h-10 flex items-center justify-center text-stone-500 hover:text-stone-800 hover:bg-stone-200 rounded-xl cursor-pointer transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={handleAddToCartClick}
                  className="flex-1 py-3.5 px-6 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 shadow-sm"
                  id="modal-add-to-cart-btn"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart — ₹{product.price * quantity}</span>
                </button>
              </div>

              {/* Direct WhatsApp Quick Order */}
              <button
                onClick={handleWhatsAppQuickOrder}
                className="w-full mt-3 py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 shadow-md shadow-emerald-100"
                id="modal-quick-whatsapp-btn"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Instant Order via WhatsApp</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
  );
}
