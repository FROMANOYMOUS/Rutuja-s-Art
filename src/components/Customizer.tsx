import React from 'react';
import { Send, Sparkles, CheckCircle, Info, RefreshCw, Flower } from 'lucide-react';
import { motion } from 'motion/react';

export default function Customizer() {
  const [flowerType, setFlowerType] = React.useState<'hibiscus' | 'marigold' | 'chafa' | 'mixed'>('hibiscus');
  const [size, setSize] = React.useState<'5' | '7' | '11' | 'custom'>('7');
  const [customLength, setCustomLength] = React.useState('4');
  const [customCount, setCustomCount] = React.useState('8');
  const [accents, setAccents] = React.useState({
    ribbons: true,
    leaves: true,
    beads: false,
  });
  const [colorTheme, setColorTheme] = React.useState('Standard Vibrant Red');
  const [specialNotes, setSpecialNotes] = React.useState('');
  const [customerName, setCustomerName] = React.useState('');
  const [inquirySent, setInquirySent] = React.useState(false);
  const [breezeActive, setBreezeActive] = React.useState(false);

  const triggerBreeze = () => {
    if (breezeActive) return;
    setBreezeActive(true);
    setTimeout(() => {
      setBreezeActive(false);
    }, 2000);
  };

  // Price calculations based on selected configurations
  const calculateEstimatedPrice = () => {
    let basePrice = 0;
    
    // Base flower type multiplier
    if (flowerType === 'hibiscus') basePrice = 100; // per flower
    else if (flowerType === 'marigold') basePrice = 80;
    else if (flowerType === 'chafa') basePrice = 90;
    else basePrice = 95; // mixed

    let count = 7;
    if (size === '5') count = 5;
    else if (size === '7') count = 7;
    else if (size === '11') count = 11;
    else count = parseInt(customCount) || 8;

    let subtotal = basePrice * count;

    // Add accents
    if (accents.ribbons) subtotal += 50;
    if (accents.leaves) subtotal += 40;
    if (accents.beads) subtotal += 60;

    return Math.max(150, subtotal);
  };

  const estPrice = calculateEstimatedPrice();

  const handleSendCustomInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert("Please enter your name so Rutuja can address you!");
      return;
    }

    const sizeText = size === 'custom' 
      ? `Custom (${customLength} feet, ${customCount} flowers)` 
      : `${size} flowers garland`;

    const accentList: string[] = [];
    if (accents.ribbons) accentList.push("Satin Ribbons");
    if (accents.leaves) accentList.push("Green Leaf Clusters");
    if (accents.beads) accentList.push("Golden Beads");

    const text = `Hi Rutuja! I want to inquire about a *Custom Handcrafted Garland* from Rutuja's Art Collection:

👤 Customer Name: *${customerName}*
🌸 Base Flower: *${flowerType.toUpperCase()}*
🎨 Color Theme: *${colorTheme}*
📏 Size/Flower Count: *${sizeText}*
✨ Decorative Add-ons: *${accentList.length > 0 ? accentList.join(', ') : 'None'}*
📝 Special Requests/Notes: _${specialNotes ? specialNotes : 'No additional notes'}_
💰 Estimated Cost: *₹${estPrice}*

Please let me know if you can take this custom order and what the timeline would be! Thank you.`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
    setInquirySent(true);

    // Reset indicator after some time
    setTimeout(() => {
      setInquirySent(false);
    }, 6000);
  };

  return (
    <section id="custom" className="py-16 md:py-24 bg-orange-50/20 border-y border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-rose-600 text-xs sm:text-sm font-bold uppercase tracking-wider bg-rose-50 px-3 py-1.5 rounded-full inline-block">
            Bespoke Creations
          </span>
          <h2 className="font-sans font-bold text-3xl sm:text-4xl text-stone-800 tracking-tight mt-3">
            Design Your Dream Garland
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-amber-500 to-rose-500 mx-auto mt-4 rounded-full" />
          <p className="font-sans text-stone-500 mt-4 text-base sm:text-lg">
            Have a specific theme, length, or color combination in mind? Use our interactive customizer below to configure your garland and send details directly to Rutuja's WhatsApp.
          </p>
        </div>

        {/* Customizer Workstation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Form Controls */}
          <form 
            onSubmit={handleSendCustomInquiry}
            className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-stone-100 shadow-sm space-y-6"
            id="customizer-form"
          >
            {/* Step 1: Your Name */}
            <div>
              <label className="block text-sm font-bold text-stone-700 font-sans mb-2">
                1. Your Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Enter your name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl font-sans text-stone-800 focus:outline-none focus:border-rose-400 focus:bg-white transition-all"
                id="customizer-name-input"
              />
            </div>

            {/* Step 2: Base Flower Choice */}
            <div>
              <label className="block text-sm font-bold text-stone-700 font-sans mb-3">
                2. Select Base Flower Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'hibiscus', label: 'Hibiscus', color: 'bg-rose-50 border-rose-200 text-rose-700', active: 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-100' },
                  { id: 'marigold', label: 'Marigold', color: 'bg-amber-50 border-amber-200 text-amber-700', active: 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-100' },
                  { id: 'chafa', label: 'Chafa (Plumeria)', color: 'bg-stone-50 border-stone-200 text-stone-700', active: 'bg-stone-700 text-white border-stone-700 shadow-md shadow-stone-100' },
                  { id: 'mixed', label: 'Mixed Combo', color: 'bg-orange-50 border-orange-200 text-orange-700', active: 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-100' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFlowerType(item.id as any)}
                    className={`p-3 rounded-xl border text-center font-semibold text-xs sm:text-sm cursor-pointer transition-all ${
                      flowerType === item.id ? item.active : `${item.color} hover:bg-opacity-80`
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Size & Length */}
            <div>
              <label className="block text-sm font-bold text-stone-700 font-sans mb-3">
                3. Choose Garland Length (Flower Density)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: '5', label: '5 Flowers', sub: '2.5 Feet Long' },
                  { id: '7', label: '7 Flowers', sub: '3.5 Feet Long' },
                  { id: '11', label: '11 Flowers', sub: '5.5 Feet Long' },
                  { id: 'custom', label: 'Custom Length', sub: 'Any Size you wish' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSize(item.id as any)}
                    className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                      size === item.id
                        ? 'bg-stone-900 border-stone-900 text-white shadow-md'
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <span className="block font-bold text-xs sm:text-sm">{item.label}</span>
                    <span className="block text-[10px] opacity-85 mt-0.5 font-sans">{item.sub}</span>
                  </button>
                ))}
              </div>

              {/* Custom specs inputs */}
              {size === 'custom' && (
                <div className="grid grid-cols-2 gap-4 mt-3 p-4 bg-stone-50 rounded-2xl border border-stone-200/60 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 mb-1">Target Length (Feet):</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={customLength}
                      onChange={(e) => setCustomLength(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 mb-1">Approx. Flowers Count:</label>
                    <input
                      type="number"
                      min="3"
                      max="50"
                      value={customCount}
                      onChange={(e) => setCustomCount(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Step 4: Color Theme details */}
            <div>
              <label className="block text-sm font-bold text-stone-700 font-sans mb-2">
                4. Preferred Color Combination
              </label>
              <input
                type="text"
                placeholder="e.g. Traditional Red & Yellow, Pastel Pink & White, Autumn Orange..."
                value={colorTheme}
                onChange={(e) => setColorTheme(e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl font-sans text-stone-800 focus:outline-none focus:border-rose-400 focus:bg-white transition-all"
              />
            </div>

            {/* Step 5: Accents checkboxes */}
            <div>
              <label className="block text-sm font-bold text-stone-700 font-sans mb-3">
                5. Add-on Garland Elements
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'ribbons', label: 'Interspaced Satin Ribbons', desc: 'Satin ribbon gaps' },
                  { id: 'leaves', label: 'Green Leaf Clusters', desc: 'Adds lush natural detail' },
                  { id: 'beads', label: 'Golden Decorative Beads', desc: 'Traditional royal look' },
                ].map((item) => (
                  <label
                    key={item.id}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all select-none ${
                      accents[item.id as keyof typeof accents]
                        ? 'bg-rose-50/50 border-rose-200 shadow-sm'
                        : 'bg-white border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={accents[item.id as keyof typeof accents]}
                      onChange={() => setAccents({
                        ...accents,
                        [item.id]: !accents[item.id as keyof typeof accents]
                      })}
                      className="mt-1 accent-rose-600 rounded"
                    />
                    <div>
                      <span className="block font-bold text-xs sm:text-sm text-stone-800">{item.label}</span>
                      <span className="block text-[10px] text-stone-400 font-sans mt-0.5">{item.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Step 6: Custom remarks */}
            <div>
              <label className="block text-sm font-bold text-stone-700 font-sans mb-2">
                6. Any special wishes / design details?
              </label>
              <textarea
                placeholder="Describe any specifics: special occasions, spacing, double flowers, dangling drops, custom color patterns, etc..."
                rows={3}
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl font-sans text-stone-800 focus:outline-none focus:border-rose-400 focus:bg-white transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2.5 shadow-lg shadow-rose-200 cursor-pointer transition-all active:scale-98"
              id="custom-whatsapp-submit"
            >
              <Send className="w-5 h-5" />
              <span>Send Design Request to WhatsApp</span>
            </button>

            {inquirySent && (
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-start gap-3 text-emerald-800 text-sm font-sans animate-fadeIn">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Inquiry drafted successfully!</span>
                  <span>We have prepared and opened your WhatsApp app. If it didn't open automatically, you can review the summary block on the right. Rutuja will respond with price quote soon!</span>
                </div>
              </div>
            )}
          </form>

          {/* Right Column: Interactive Live Preview Card */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <div className="bg-gradient-to-br from-stone-900 to-stone-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-white/5 relative overflow-hidden">
              {/* background design */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl" />

              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-orange-400 uppercase">Live Preview Sheet</span>
                  <h3 className="font-sans font-bold text-lg sm:text-xl text-white mt-1">Your Crafted Garland</h3>
                </div>
                <div className="bg-white/10 p-2 rounded-xl text-orange-400">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>

              {/* Garland Visualizer representation */}
              <div className="my-8 py-6 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center relative overflow-hidden min-h-[140px]">
                <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest absolute top-3">Simulated visual density</span>
                
                {/* Visual String Loop */}
                <div className="flex items-center justify-center gap-1.5 mt-4 flex-wrap max-w-xs px-4">
                  {/* Garland Thread loop */}
                  {[...Array(
                    size === '5' ? 5 : size === '7' ? 7 : size === '11' ? 11 : Math.min(15, parseInt(customCount) || 8)
                  )].map((_, idx) => {
                    let color = 'text-rose-500';
                    if (flowerType === 'marigold') color = 'text-amber-500';
                    else if (flowerType === 'chafa') color = 'text-amber-100';
                    else if (flowerType === 'mixed') {
                      color = idx % 3 === 0 ? 'text-rose-500' : idx % 3 === 1 ? 'text-amber-500' : 'text-amber-100';
                    }

                    return (
                      <React.Fragment key={idx}>
                        <motion.div
                          whileHover={{ 
                            scale: 1.35, 
                            rotate: idx % 2 === 0 ? 20 : -20,
                            transition: { type: 'spring', stiffness: 450, damping: 12 }
                          }}
                          whileTap={{ 
                            scale: 0.85, 
                            rotate: idx % 2 === 0 ? -20 : 20 
                          }}
                          animate={breezeActive ? {
                            rotate: [0, -18, 15, -12, 10, -5, 3, 0],
                            scale: [1, 1.25, 0.95, 1.15, 1.05, 1],
                          } : {
                            scale: [1, 1.04, 1],
                            rotate: [0, idx % 2 === 0 ? 4 : -4, 0],
                          }}
                          transition={breezeActive ? {
                            duration: 1.8,
                            delay: idx * 0.08,
                            ease: 'easeInOut'
                          } : {
                            repeat: Infinity,
                            duration: 3,
                            delay: idx * 0.25,
                            ease: 'easeInOut'
                          }}
                          className="cursor-grab active:cursor-grabbing p-1"
                        >
                          <Flower className={`w-8 h-8 ${color} fill-current drop-shadow-md`} />
                        </motion.div>
                        {accents.beads && idx < (size === '5' ? 4 : size === '7' ? 6 : size === '11' ? 10 : 7) && (
                          <div className="w-2 h-2 rounded-full bg-amber-400 border border-amber-300 shadow-sm" />
                        )}
                        {accents.ribbons && !accents.beads && idx % 2 === 0 && idx < (size === '5' ? 4 : size === '7' ? 6 : size === '11' ? 10 : 7) && (
                          <div className="w-2.5 h-1.5 rounded-sm bg-rose-400 opacity-80" />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                {accents.leaves && (
                  <span className="text-[10px] text-emerald-400 font-sans mt-5 block font-semibold">🌱 Interspersed with Green Leaf clusters</span>
                )}

                {/* Interactive Breeze Trigger */}
                <button
                  type="button"
                  onClick={triggerBreeze}
                  disabled={breezeActive}
                  className="mt-4.5 px-3.5 py-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-orange-200 hover:text-white rounded-full text-xs font-semibold tracking-wide border border-white/10 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>🌬️ Blow Gentle Breeze</span>
                </button>
              </div>

              {/* Estimate Details */}
              <div className="space-y-4 text-sm font-sans">
                <div className="flex justify-between items-center text-stone-400">
                  <span>Configuration Name:</span>
                  <span className="font-semibold text-white">
                    {flowerType === 'hibiscus' ? 'Royal Hibiscus' : flowerType === 'marigold' ? 'Golden Marigold' : flowerType === 'chafa' ? 'Sacred Chafa' : 'Artisanal Blend'} Garland
                  </span>
                </div>
                <div className="flex justify-between items-center text-stone-400">
                  <span>Size & Density:</span>
                  <span className="font-semibold text-white">
                    {size === 'custom' ? `${customLength}ft (${customCount} Flowers)` : `${size} Flowers Garland (${size === '5' ? '2.5' : size === '7' ? '3.5' : '5.5'}ft)`}
                  </span>
                </div>
                <div className="flex justify-between items-center text-stone-400">
                  <span>Color Palette:</span>
                  <span className="font-semibold text-white truncate max-w-[200px]">{colorTheme || 'Standard'}</span>
                </div>
                <div className="flex justify-between items-center text-stone-400">
                  <span>Included Elements:</span>
                  <span className="font-semibold text-amber-300 text-xs text-right max-w-[220px]">
                    {[
                      accents.ribbons ? 'Ribbons' : '',
                      accents.leaves ? 'Leaves' : '',
                      accents.beads ? 'Golden Beads' : ''
                    ].filter(Boolean).join(', ') || 'Plain String'}
                  </span>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-between items-baseline">
                  <div>
                    <span className="text-stone-400 block">Est. Craft Budget</span>
                    <span className="text-xs text-stone-500 font-mono">*Excludes local courier</span>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold font-mono text-amber-400">₹{estPrice}</span>
                    <span className="text-xs text-stone-400 block font-mono">~${(estPrice / 83).toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Extra info tip card */}
            <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex items-start gap-3 text-stone-600 text-xs leading-relaxed">
              <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-stone-800 block mb-0.5">Need a bulk discount?</span>
                <span>For bulk event orders (weddings, family ceremonies, office pujas, corporate gifting), Rutuja can configure custom pricing tiers. Mention bulk details in the comments or call directly.</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
