import React from 'react';
import { Star, Heart, Flower, MessageCircle, HelpCircle, ChevronDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { REVIEWS, FAQS } from '../data';

export default function Footer() {
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleWhatsAppChat = () => {
    const text = encodeURIComponent("Hi Rutuja, I visited your Rutuja's Art Collection website and would love to ask a quick question about your handcrafted pipe cleaner flowers!");
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <footer className="bg-stone-900 text-stone-300">
      
      {/* 1. Customer Love Section */}
      <section id="reviews" className="py-16 md:py-24 bg-gradient-to-b from-white to-stone-50 border-t border-stone-100 text-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="text-rose-600 text-xs sm:text-sm font-bold uppercase tracking-wider bg-rose-50 px-3 py-1.5 rounded-full inline-block">
              Reviews & Testimonials
            </span>
            <h2 className="font-sans font-bold text-3xl sm:text-4xl text-stone-800 tracking-tight mt-3">
              Stories of Handcrafted Happiness
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-amber-500 to-rose-500 mx-auto mt-4 rounded-full" />
            <p className="font-sans text-stone-500 mt-4 text-sm sm:text-base">
              See how our everlasting pipe cleaner flowers and garlands have brightened up home temples, festive poojas, and office desks.
            </p>
          </div>

          <motion.div 
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.08,
                }
              }
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" 
            id="reviews-grid"
          >
            {REVIEWS.map((review) => (
              <motion.div
                key={review.id}
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } }
                }}
                whileHover={{ scale: 1.03, y: -4, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.05)' }}
                whileTap={{ scale: 0.98 }}
                className="bg-white p-6 rounded-2xl border border-stone-100 shadow-xs flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-center text-amber-400 gap-0.5 mb-3.5">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-4 h-4 ${
                          idx < review.rating ? 'fill-amber-400' : 'text-stone-200'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="font-sans text-stone-600 text-xs sm:text-sm italic leading-relaxed mb-4">
                    "{review.comment}"
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-50 flex items-center justify-between">
                  <div>
                    <span className="block font-bold text-stone-800 text-xs font-sans">
                      {review.name}
                    </span>
                    <span className="block text-[10px] text-stone-400 font-mono">
                      {review.date}
                    </span>
                  </div>

                  {review.verified && (
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      Verified Order
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* 2. FAQ Accordion Section */}
      <section id="faq" className="py-16 md:py-24 bg-stone-50 border-t border-stone-100 text-stone-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-rose-600 text-xs sm:text-sm font-bold uppercase tracking-wider bg-rose-50 px-3 py-1.5 rounded-full inline-block">
              Have Questions?
            </span>
            <h2 className="font-sans font-bold text-3xl text-stone-800 tracking-tight mt-3">
              Frequently Asked Questions
            </h2>
            <p className="font-sans text-stone-500 mt-2 text-sm sm:text-base">
              Learn more about Rutuja's crafting timeline, shipping methods, and customization.
            </p>
          </div>

          <div className="space-y-3.5" id="faq-list">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white border border-stone-200/60 rounded-2xl overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-4.5 text-left flex items-center justify-between font-sans font-bold text-stone-800 hover:text-rose-600 transition-colors cursor-pointer select-none text-sm sm:text-base"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-4.5 h-4.5 text-rose-500 flex-shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-stone-400 transition-transform duration-300 flex-shrink-0 ${
                      openFaq === idx ? 'rotate-185 text-rose-500' : ''
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-5 text-xs sm:text-sm text-stone-600 leading-relaxed font-sans border-t border-stone-100 pt-3 bg-stone-50/20">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Quick Chat Call To Action */}
          <div className="mt-12 p-6 sm:p-8 bg-gradient-to-tr from-rose-50 to-orange-50 border border-orange-100 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <h4 className="font-sans font-bold text-stone-800 text-base sm:text-lg">Still have a custom question?</h4>
              <p className="text-stone-500 text-xs sm:text-sm mt-1">Shoot a quick message on WhatsApp and Rutuja will get back to you directly.</p>
            </div>
            <button
              onClick={handleWhatsAppChat}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold text-sm rounded-xl flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-100 transition-all active:scale-98"
            >
              <MessageCircle className="w-4.5 h-4.5 fill-white" />
              <span>Chat on WhatsApp</span>
            </button>
          </div>

        </div>
      </section>

      {/* 3. Footer Copyright Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-b border-stone-800 pb-10">
          
          {/* Logo & description column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-tr from-amber-500 to-rose-500 p-1.5 rounded-full">
                <Flower className="w-5 h-5 text-white" />
              </div>
              <span className="font-sans font-bold text-lg text-white">Rutuja's Art Collection</span>
            </div>
            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed font-sans max-w-sm">
              We create premium everlasting flower crafts and traditional garlands hand-twisted from the finest soft chenille stems. Perfect eco-friendly decorations to keep your home temples and celebrations forever colorful.
            </p>
          </div>

          {/* Contact Details Column */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-white font-bold font-sans text-sm tracking-wider uppercase">Contact & Custom Orders</h4>
            <div className="space-y-2 text-xs sm:text-sm text-stone-400 font-sans">
              <p>📍 Crafted with care in Maharashtra, India</p>
              <p>📱 WhatsApp: <span className="text-emerald-400 font-medium">Inquiry via Website buttons</span></p>
              <p>✉️ Email support: <span className="text-orange-300 font-medium">rutujasartcollection@gmail.com</span></p>
              <p className="text-[11px] text-stone-500 italic mt-2">Custom colors and sizing designs available on order.</p>
            </div>
          </div>

          {/* Links Column */}
          <div className="md:col-span-3 space-y-3 text-stone-400 text-xs sm:text-sm font-sans">
            <h4 className="text-white font-bold tracking-wider uppercase text-sm">Collection Links</h4>
            <div className="flex flex-col gap-2">
              <a href="#catalog" className="hover:text-rose-400 transition-colors">Hibiscus Flower Catalog</a>
              <a href="#catalog" className="hover:text-rose-400 transition-colors">Marigold Garland Special</a>
              <a href="#catalog" className="hover:text-rose-400 transition-colors">White Chafa Garland</a>
              <a href="#custom" className="hover:text-rose-400 transition-colors">Customizer Workshop</a>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] sm:text-xs text-stone-500 font-sans">
          <p>© {new Date().getFullYear()} Rutuja's Art Collection. All Rights Reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> & premium plush pipe cleaners by Rutuja.
          </p>
        </div>
      </div>
    </footer>
  );
}
