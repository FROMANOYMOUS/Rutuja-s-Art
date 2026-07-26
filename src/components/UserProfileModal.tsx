import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Mail, Phone, MapPin, Save, LogOut, Package, ExternalLink, CheckCircle2, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { OrderRecord } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTracker?: (orderId: string) => void;
}

export default function UserProfileModal({ isOpen, onClose, onNavigateToTracker }: UserProfileModalProps) {
  const { user, logout, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [userOrders, setUserOrders] = useState<OrderRecord[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');

      // Load user orders by matching user email
      setLoadingOrders(true);
      fetchUserOrders(user.email);
    }
  }, [user]);

  const fetchUserOrders = async (userEmail: string) => {
    let matches: OrderRecord[] = [];

    // 1. LocalStorage orders check
    try {
      const stored = localStorage.getItem('rutujas_crm_orders');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          matches = parsed.filter(
            (o: any) => o.customerEmail?.toLowerCase() === userEmail.toLowerCase()
          );
        }
      }
    } catch (e) {
      console.warn('LocalStorage load error:', e);
    }

    // 2. Fetch from Express API
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const apiOrders = await res.json();
        if (Array.isArray(apiOrders)) {
          apiOrders.forEach((o: any) => {
            if (o.customerEmail?.toLowerCase() === userEmail.toLowerCase()) {
              const exists = matches.some((m) => m.orderId === o.orderId);
              if (!exists) {
                matches.push({
                  orderId: o.orderId,
                  customerName: o.customerName,
                  customerEmail: o.customerEmail,
                  customerPhone: o.customerPhone,
                  orderDate: o.orderDate,
                  estimatedDelivery: o.estimatedDelivery,
                  status: o.status,
                  courier: o.courier,
                  trackingNo: o.trackingNo,
                  address: o.address,
                  paymentMode: o.paymentMode,
                  paymentType: o.paymentType,
                  paymentStatus: o.paymentStatus,
                  items: o.items || [{ name: 'Handcrafted Flower Order', quantity: 1, price: 499 }]
                });
              }
            }
          });
        }
      }
    } catch (e) {
      console.warn('API fetch user orders error:', e);
    }

    setUserOrders(matches);
    setLoadingOrders(false);
  };

  if (!isOpen || !user) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateProfile({ name, phone, address });
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-stone-900/70 backdrop-blur-xs"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full relative z-10 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
          id="user-profile-modal"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* User Header */}
          <div className="flex items-center gap-4 pb-4 border-b border-stone-100">
            <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-amber-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold font-serif shadow-md shadow-rose-200 shrink-0">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-2xl font-bold text-stone-800">{user.name}</h2>
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Email
                </span>
              </div>
              <p className="font-mono text-xs text-stone-500 flex items-center gap-1 mt-1">
                <Mail className="w-3.5 h-3.5 text-rose-500" /> {user.email}
              </p>
            </div>
          </div>

          {/* Account Profile Form */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-stone-800 text-lg flex items-center gap-2">
              <User className="w-4 h-4 text-rose-500" />
              <span>Saved Customer Details (Cloud Synced)</span>
            </h3>

            {savedSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-sans flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Profile & default shipping address saved successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 text-stone-800 p-2.5 rounded-xl focus:border-rose-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-stone-50 border border-stone-200 text-stone-800 p-2.5 rounded-xl focus:border-rose-400 focus:outline-none font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-stone-700 font-medium mb-1">Default Delivery Address</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House No, Street, Landmark, City & Pincode"
                  className="w-full bg-stone-50 border border-stone-200 text-stone-800 p-2.5 rounded-xl focus:border-rose-400 focus:outline-none resize-none"
                />
              </div>

              <div className="sm:col-span-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-stone-800 hover:bg-stone-900 text-white font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer text-xs flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving...' : 'Save Profile Details'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* User Order History */}
          <div className="pt-4 border-t border-stone-100 space-y-3">
            <h3 className="font-serif font-bold text-stone-800 text-lg flex items-center gap-2">
              <Package className="w-4 h-4 text-rose-500" />
              <span>Your Orders ({userOrders.length})</span>
            </h3>

            {loadingOrders ? (
              <p className="text-stone-400 text-xs font-mono py-4">Fetching order history...</p>
            ) : userOrders.length === 0 ? (
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 text-center text-xs text-stone-500">
                You have no active orders yet. Your placed orders will appear here for live tracking.
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {userOrders.map((ord) => (
                  <div
                    key={ord.orderId}
                    className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-sans"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-stone-800">#{ord.orderId}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-100 text-amber-800">
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-stone-500 text-[11px]">
                        Order Date: {ord.orderDate} • {ord.items.length} Item(s)
                      </p>
                    </div>

                    {onNavigateToTracker && (
                      <button
                        onClick={() => {
                          onClose();
                          onNavigateToTracker(ord.orderId);
                        }}
                        className="bg-white border border-stone-200 hover:border-rose-300 text-rose-600 font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all text-xs cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Track Order Live</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-stone-100 flex justify-between items-center text-xs font-sans">
            <span className="text-stone-400 font-mono text-[11px]">User ID: {user.id}</span>
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
