import React from 'react';
import { X, Trash2, ShoppingCart, MessageCircle, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, Product } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [customerName, setCustomerName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);
  const [orderCompleted, setOrderCompleted] = React.useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleWhatsAppCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      alert("Please complete Name, Phone, and Delivery Address to place order.");
      return;
    }

    const itemsText = cart
      .map(
        (item, idx) =>
          `${idx + 1}. *${item.product.name}*\n   Qty: *${item.quantity}* × ₹${item.product.price} = *₹${
            item.product.price * item.quantity
          }*`
      )
      .join('\n');

    const text = `Hi Rutuja! I would like to place an order from Rutuja's Art Collection:

🛍️ *ORDER DETAILS* 🛍️
${itemsText}

💰 *TOTAL AMOUNT:* *₹${subtotal}*

👤 *CUSTOMER INFO*
• Name: *${customerName}*
• Phone: *${phone}*
• Delivery Address: *${address}*
• Delivery Note/Msg: _${notes ? notes : 'None'}_

Please let me know the payment details and shipping timeline. Thank you!`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
    
    // Complete the transaction locally
    setIsCheckingOut(true);
    setTimeout(() => {
      setOrderCompleted(true);
      setIsCheckingOut(false);
    }, 1000);
  };

  const handleLocalSubmitCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      alert("Please complete Name, Phone, and Delivery Address to place order.");
      return;
    }

    setIsCheckingOut(true);
    setTimeout(() => {
      setOrderCompleted(true);
      setIsCheckingOut(false);
    }, 1200);
  };

  const handleCloseSuccessModal = () => {
    setOrderCompleted(false);
    setCustomerName('');
    setPhone('');
    setAddress('');
    setNotes('');
    onClearCart();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Cart Panel */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full border-l border-stone-100"
              id="cart-drawer-panel"
            >
              {/* Header */}
              <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-orange-50/40">
                <div className="flex items-center gap-2">
                  <div className="bg-rose-50 p-2 rounded-xl text-rose-600">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-lg text-stone-800">Your Shopping Basket</h3>
                    <p className="text-xs text-stone-500 font-sans">{cart.length} unique crafts</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-xl cursor-pointer"
                  id="close-cart-btn"
                >
                  <X className="w-5.5 h-5.5" />
                </button>
              </div>

              {/* Drawer Content */}
              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-stone-50/30">
                  <div className="bg-orange-50 p-6 rounded-full text-amber-500 mb-4 border border-orange-100/40">
                    <ShoppingCart className="w-12 h-12" />
                  </div>
                  <h4 className="font-sans font-bold text-lg text-stone-800">Your basket is empty</h4>
                  <p className="text-sm text-stone-500 mt-2 max-w-xs mx-auto">
                    Take a look at Rutuja's beautiful hibiscus, marigold, and chafa collections and add your favorites!
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-6 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-2xl cursor-pointer transition-all shadow-md shadow-rose-100"
                  >
                    Start Exploring
                  </button>
                </div>
              ) : (
                <>
                  {/* Cart Items List */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-stone-50/40" id="cart-items-list">
                    {cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-stone-100/80 shadow-xs group"
                      >
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-xl bg-stone-100 flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-stone-800 truncate leading-snug">
                            {item.product.name}
                          </h4>
                          <span className="text-xs font-mono font-bold text-rose-600 block mt-0.5">
                            ₹{item.product.price} <span className="text-[10px] text-stone-400 font-sans font-normal">each</span>
                          </span>

                          {/* Quick details */}
                          <p className="text-[10px] text-stone-400 font-sans mt-0.5 truncate">
                            {item.product.specs.length ? `Length: ${item.product.specs.length}` : 'Single Flower'}
                          </p>
                        </div>

                        {/* Adjust quantities */}
                        <div className="flex flex-col items-end justify-between gap-2.5">
                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="text-stone-400 hover:text-rose-600 p-1 rounded-lg hover:bg-stone-50 cursor-pointer"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <div className="flex items-center bg-stone-100/80 rounded-lg p-0.5 border border-stone-200/50">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                              className="w-5 h-5 flex items-center justify-center text-xs font-bold text-stone-500 hover:text-stone-800 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="font-mono text-xs font-bold w-6 text-center text-stone-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="w-5 h-5 flex items-center justify-center text-xs font-bold text-stone-500 hover:text-stone-800 cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Summary */}
                  <div className="p-6 border-t border-stone-100 bg-white">
                    <div className="space-y-2.5 mb-5 font-sans">
                      <div className="flex justify-between text-stone-500 text-sm">
                        <span>Items Count:</span>
                        <span className="font-mono font-semibold text-stone-800">
                          {cart.reduce((sum, i) => sum + i.quantity, 0)} units
                        </span>
                      </div>
                      <div className="flex justify-between text-stone-500 text-sm">
                        <span>Standard Packaging:</span>
                        <span className="text-emerald-600 font-semibold">Free (Eco Bubble Wrap)</span>
                      </div>
                      <div className="flex justify-between items-baseline pt-2.5 border-t border-stone-100">
                        <span className="font-bold text-stone-800 text-base">Order Subtotal:</span>
                        <div className="text-right">
                          <span className="text-2xl font-bold font-mono text-stone-900">₹{subtotal}</span>
                          <span className="text-xs text-stone-500 block font-mono -mt-1">~${(subtotal / 83).toFixed(1)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Checkout Form details */}
                    <div className="border-t border-stone-100 pt-5 space-y-4">
                      <p className="text-xs font-bold font-mono text-rose-600 uppercase tracking-widest flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Instant Checkout Form</span>
                      </p>

                      <div className="space-y-3 font-sans text-stone-700">
                        <div>
                          <input
                            type="text"
                            placeholder="Full Name *"
                            required
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-rose-400"
                          />
                        </div>

                        <div>
                          <input
                            type="tel"
                            placeholder="WhatsApp / Phone No. *"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-rose-400"
                          />
                        </div>

                        <div>
                          <textarea
                            placeholder="Complete Delivery Address *"
                            rows={2}
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-rose-400 resize-none"
                          />
                        </div>

                        <div>
                          <input
                            type="text"
                            placeholder="Delivery notes / special gift wrap? (Optional)"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-rose-400"
                          />
                        </div>
                      </div>

                      {/* Submit buttons */}
                      <div className="grid grid-cols-1 gap-2.5 pt-2">
                        <button
                          onClick={handleWhatsAppCheckout}
                          disabled={isCheckingOut}
                          className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-emerald-100 disabled:opacity-50"
                          id="cart-checkout-whatsapp-btn"
                        >
                          <MessageCircle className="w-4.5 h-4.5 fill-white" />
                          <span>Order via WhatsApp</span>
                        </button>

                        <button
                          onClick={handleLocalSubmitCheckout}
                          disabled={isCheckingOut}
                          className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
                          id="cart-checkout-local-btn"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Traditional Inquiry</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      )}

      {/* Checkout Success Modal Overlay */}
      {orderCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-md" onClick={handleCloseSuccessModal} />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-8 border border-orange-100 text-center shadow-2xl relative z-10"
            id="checkout-success-modal"
          >
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
              <CheckCircle2 className="w-9 h-9 text-emerald-500 animate-pulse" />
            </div>

            <span className="text-[10px] font-mono font-bold text-orange-600 uppercase tracking-widest block mb-1">Order Request Sent!</span>
            <h3 className="font-sans font-bold text-2xl text-stone-800">Thank you, {customerName}!</h3>
            <p className="font-sans text-stone-500 text-sm mt-3 leading-relaxed">
              Your inquiry for the handcrafted pipe cleaner products has been received. Rutuja will review the requested specifications and contact you on <span className="font-semibold text-stone-800 font-mono">{phone}</span> within 12-24 hours via phone/WhatsApp to confirm payment and shipping.
            </p>

            <div className="my-5 p-4 bg-orange-50/50 rounded-2xl border border-orange-100/40 text-left space-y-2 text-xs font-sans text-stone-600">
              <p className="font-bold text-stone-700 text-sm border-b border-orange-100 pb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" /> Order Summary
              </p>
              <div className="flex justify-between">
                <span>Requested Items:</span>
                <span className="font-mono font-semibold text-stone-800">{cart.reduce((s, i) => s + i.quantity, 0)} units</span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-mono font-bold text-rose-600 text-sm">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Address:</span>
                <span className="text-stone-800 font-medium truncate max-w-[200px]">{address}</span>
              </div>
            </div>

            <button
              onClick={handleCloseSuccessModal}
              className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl cursor-pointer transition-all shadow-md shadow-rose-100"
              id="success-dismiss-btn"
            >
              Continue Craft Shopping
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
