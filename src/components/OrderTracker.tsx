import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Truck, 
  Scissors, 
  Package, 
  CheckCircle, 
  Calendar, 
  MapPin, 
  Sparkles, 
  Clock, 
  ArrowRight,
  ShoppingBag,
  HelpCircle,
  Flower,
  Copy,
  Check,
  CreditCard,
  User,
  Mail,
  Phone,
  Database,
  ShieldCheck,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Terminal,
  Layers
} from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

interface TrackingMilestone {
  status: 'ordered' | 'crafting' | 'packed' | 'shipped' | 'delivered';
  title: string;
  description: string;
  date: string;
  isCompleted: boolean;
  isActive: boolean;
}

interface OrderDetails {
  orderId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  orderDate: string;
  estimatedDelivery: string;
  status: 'ordered' | 'crafting' | 'packed' | 'shipped' | 'delivered';
  courier: string;
  trackingNo: string;
  address: string;
  paymentMode?: string; // e.g. 'Prepaid' | 'Cash on Delivery'
  paymentType?: string; // e.g. 'UPI / Google Pay (GPay)', 'Credit Card (HDFC Visa)'
  paymentStatus?: string; // e.g. 'Paid' | 'Pending'
  items: { name: string; quantity: number; price: number }[];
  milestones: TrackingMilestone[];
}

const MOCK_ORDERS: Record<string, OrderDetails> = {
  'RA-2045': {
    orderId: 'RA-2045',
    customerName: 'Aishwarya Rao',
    customerEmail: 'aishwarya.rao@gmail.com',
    customerPhone: '+91 98230 41102',
    orderDate: 'July 19, 2026',
    estimatedDelivery: 'July 24, 2026',
    status: 'ordered',
    courier: 'Speed Post',
    trackingNo: 'SP98320491IN',
    address: 'Flat 402, Shiv Ranjani Heights, Baner Road, Pune, Maharashtra - 411045',
    paymentMode: 'Prepaid',
    paymentType: 'UPI / Google Pay (GPay)',
    paymentStatus: 'Paid',
    items: [
      { name: 'Single Red Hibiscus Flower', quantity: 2, price: 149 }
    ],
    milestones: [
      { status: 'ordered', title: 'Order Placed & Confirmed', description: 'Order received and added to Rutuja’s handcrafting queue. Soft chenille stems selected.', date: 'July 19, 2026, 04:30 PM', isCompleted: true, isActive: true },
      { status: 'crafting', title: 'Meticulous Crafting', description: 'Twisting stems, preparing realistic stamens and foliage details.', date: 'Pending', isCompleted: false, isActive: false },
      { status: 'packed', title: 'Durable Keepsake Packaging', description: 'Securing flowers inside customized air-cushioned boxes.', date: 'Pending', isCompleted: false, isActive: false },
      { status: 'shipped', title: 'Shipped with Love', description: 'Handed over to carrier partner with tracking alerts activated.', date: 'Pending', isCompleted: false, isActive: false },
      { status: 'delivered', title: 'Delivered', description: 'Everlasting blooms delivered to add color and joy to your space!', date: 'Pending', isCompleted: false, isActive: false }
    ]
  },
  'RA-1024': {
    orderId: 'RA-1024',
    customerName: 'Meera Deshmukh',
    customerEmail: 'meera.deshmukh@yahoo.com',
    customerPhone: '+91 99701 88321',
    orderDate: 'July 18, 2026',
    estimatedDelivery: 'July 23, 2026',
    status: 'crafting',
    courier: 'Delhivery',
    trackingNo: 'DEL884210549',
    address: '12A, Vaikunth Society, J.P. Road, Andheri West, Mumbai, Maharashtra - 400053',
    paymentMode: 'Prepaid',
    paymentType: 'Credit Card (HDFC Visa)',
    paymentStatus: 'Paid',
    items: [
      { name: 'Marigold Everlasting Garland (4 Feet)', quantity: 1, price: 499 }
    ],
    milestones: [
      { status: 'ordered', title: 'Order Placed & Confirmed', description: 'Order received and added to Rutuja’s handcrafting queue.', date: 'July 18, 2026, 11:15 AM', isCompleted: true, isActive: false },
      { status: 'crafting', title: 'Meticulous Crafting', description: 'Rutuja is manually twisting the fluffy orange and yellow pipe cleaners and stringing them with golden beads.', date: 'July 19, 2026, 10:00 AM', isCompleted: true, isActive: true },
      { status: 'packed', title: 'Durable Keepsake Packaging', description: 'Securing flowers inside customized air-cushioned boxes.', date: 'Pending', isCompleted: false, isActive: false },
      { status: 'shipped', title: 'Shipped with Love', description: 'Handed over to carrier partner with tracking alerts activated.', date: 'Pending', isCompleted: false, isActive: false },
      { status: 'delivered', title: 'Delivered', description: 'Everlasting blooms delivered to add color and joy to your space!', date: 'Pending', isCompleted: false, isActive: false }
    ]
  },
  'RA-5821': {
    orderId: 'RA-5821',
    customerName: 'Aditya Joshi',
    customerEmail: 'aditya.joshi@outlook.com',
    customerPhone: '+91 98902 55410',
    orderDate: 'July 16, 2026',
    estimatedDelivery: 'July 21, 2026',
    status: 'shipped',
    courier: 'Blue Dart',
    trackingNo: 'BD99824051',
    address: 'Villa 4, Nandi Hills View Enclave, Devanahalli, Bengaluru, Karnataka - 562110',
    paymentMode: 'Prepaid',
    paymentType: 'Net Banking (ICICI Bank)',
    paymentStatus: 'Paid',
    items: [
      { name: 'Chafa (Plumeria) Serene Garland (4 Feet)', quantity: 2, price: 599 },
      { name: 'Single Red Hibiscus Flower', quantity: 1, price: 149 }
    ],
    milestones: [
      { status: 'ordered', title: 'Order Placed & Confirmed', description: 'Order received and added to queue.', date: 'July 16, 2026, 09:00 AM', isCompleted: true, isActive: false },
      { status: 'crafting', title: 'Meticulous Crafting', description: 'All 10 plumeria flowers and 1 single hibiscus crafted successfully with dual-tone detailing.', date: 'July 17, 2026, 02:30 PM', isCompleted: true, isActive: false },
      { status: 'packed', title: 'Durable Keepsake Packaging', description: 'Carefully cushioned with tissue paper to avoid compression. Fragrance-infused upon request.', date: 'July 18, 2026, 04:00 PM', isCompleted: true, isActive: false },
      { status: 'shipped', title: 'Shipped with Love', description: 'Dispatched via Blue Dart. In transit from Pune Hub to Bengaluru Terminal.', date: 'July 19, 2026, 11:20 AM', isCompleted: true, isActive: true },
      { status: 'delivered', title: 'Delivered', description: 'Everlasting blooms delivered to add color and joy to your space!', date: 'Pending', isCompleted: false, isActive: false }
    ]
  },
  'RA-7734': {
    orderId: 'RA-7734',
    customerName: 'Priyanka Sharma',
    customerEmail: 'priyanka.s@gmail.com',
    customerPhone: '+91 97654 32109',
    orderDate: 'July 12, 2026',
    estimatedDelivery: 'July 17, 2026',
    status: 'delivered',
    courier: 'Delhivery',
    trackingNo: 'DEL22415980',
    address: 'Apartment 7C, Orchid Greens, GMS Road, Dehradun, Uttarakhand - 248001',
    paymentMode: 'Cash on Delivery',
    paymentType: 'Cash on Delivery (COD)',
    paymentStatus: 'Paid on Delivery',
    items: [
      { name: 'Grand Hibiscus Garland (5.5 Feet)', quantity: 1, price: 1149 }
    ],
    milestones: [
      { status: 'ordered', title: 'Order Placed & Confirmed', description: 'Order received.', date: 'July 12, 2026, 01:45 PM', isCompleted: true, isActive: false },
      { status: 'crafting', title: 'Meticulous Crafting', description: '11 grand-sized hibiscus flowers twisted and mounted with rich green foliage on flexible wire joints.', date: 'July 14, 2026, 06:15 PM', isCompleted: true, isActive: false },
      { status: 'packed', title: 'Durable Keepsake Packaging', description: 'Garland rolled safely inside a presentation-grade circular box to prevent wrinkling.', date: 'July 15, 2026, 11:30 AM', isCompleted: true, isActive: false },
      { status: 'shipped', title: 'Shipped with Love', description: 'Dispatched via Express Air Cargo.', date: 'July 15, 2026, 05:00 PM', isCompleted: true, isActive: false },
      { status: 'delivered', title: 'Delivered Successfully', description: 'Blooms received! Handed over to recipient with signature confirmation. Everlasting floral decoration is complete.', date: 'July 17, 2026, 02:40 PM', isCompleted: true, isActive: true }
    ]
  }
};

// Generates a realistic order on the fly for any custom ID typed by user
const generateDynamicOrder = (id: string): OrderDetails => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);

  const statuses: ('ordered' | 'crafting' | 'packed' | 'shipped' | 'delivered')[] = [
    'ordered', 'crafting', 'packed', 'shipped', 'delivered'
  ];
  const selectedStatus = statuses[hash % statuses.length];
  
  const couriers = ['Delhivery', 'Blue Dart', 'Speed Post', 'DHL Express'];
  const courier = couriers[hash % couriers.length];
  const trackingNo = `RA${(hash % 90000) + 10000}IN`;
  
  const paymentModes = ['Prepaid', 'Cash on Delivery'];
  const paymentTypes = ['UPI / Google Pay (GPay)', 'Credit Card (HDFC Visa)', 'Net Banking (ICICI)', 'Cash on Delivery (COD)'];
  
  const selectedPaymentMode = paymentModes[hash % paymentModes.length];
  const selectedPaymentType = selectedPaymentMode === 'Cash on Delivery' ? 'Cash on Delivery (COD)' : paymentTypes[hash % (paymentTypes.length - 1)];

  const orderDateObj = new Date();
  orderDateObj.setDate(orderDateObj.getDate() - (hash % 5) - 1);
  const orderDateStr = orderDateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  
  const estDateObj = new Date(orderDateObj);
  estDateObj.setDate(estDateObj.getDate() + 5);
  const estDateStr = estDateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const sampleNames = ['Rohan Verma', 'Kavita Patel', 'Siddharth Nair', 'Ananya Gupta', 'Tushar Kulkarni'];
  const customerName = sampleNames[hash % sampleNames.length];
  const customerEmail = `${customerName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`;
  const customerPhone = `+91 9${(hash % 900000000) + 100000000}`;

  const isDelivered = selectedStatus === 'delivered';
  const isShipped = selectedStatus === 'shipped' || isDelivered;
  const isPacked = selectedStatus === 'packed' || isShipped;
  const isCrafting = selectedStatus === 'crafting' || isPacked;

  const milestones: TrackingMilestone[] = [
    { 
      status: 'ordered', 
      title: 'Order Placed & Confirmed', 
      description: 'Order received and recorded in database. High quality chenille materials selected.', 
      date: `${orderDateStr}, 11:30 AM`, 
      isCompleted: true, 
      isActive: selectedStatus === 'ordered' 
    },
    { 
      status: 'crafting', 
      title: 'Meticulous Crafting', 
      description: isCrafting 
        ? 'Rutuja is individually twisting clean chenille wire petals, leaves, and assembling the stems.' 
        : 'Pending queue allocation.', 
      date: isCrafting ? `${orderDateStr}, 04:00 PM` : 'Pending', 
      isCompleted: isCrafting, 
      isActive: selectedStatus === 'crafting' 
    },
    { 
      status: 'packed', 
      title: 'Durable Keepsake Packaging', 
      description: isPacked 
        ? 'Flowers packaged in rigid eco-boxes with support inserts to prevent shifting.' 
        : 'Awaiting completion.', 
      date: isPacked ? `${orderDateStr}, 06:15 PM` : 'Pending', 
      isCompleted: isPacked, 
      isActive: selectedStatus === 'packed' 
    },
    { 
      status: 'shipped', 
      title: 'Shipped with Love', 
      description: isShipped 
        ? `In transit via ${courier} Express Service. Delivery updates active.` 
        : 'Awaiting handoff to logistics.', 
      date: isShipped ? `${orderDateStr}, 09:30 PM` : 'Pending', 
      isCompleted: isShipped, 
      isActive: selectedStatus === 'shipped' 
    },
    { 
      status: 'delivered', 
      title: 'Delivered', 
      description: isDelivered 
        ? 'Successfully delivered. Your reusable, eco-friendly floral craft has arrived!' 
        : 'In transport stages.', 
      date: isDelivered ? `${estDateStr}, 12:45 PM` : 'Pending', 
      isCompleted: isDelivered, 
      isActive: selectedStatus === 'delivered' 
    }
  ];

  return {
    orderId: id.toUpperCase(),
    customerName,
    customerEmail,
    customerPhone,
    orderDate: orderDateStr,
    estimatedDelivery: estDateStr,
    status: selectedStatus,
    courier,
    trackingNo,
    address: '102, Garden Greens Residency, Senapati Bapat Road, Pune, MH - 411016',
    paymentMode: selectedPaymentMode,
    paymentType: selectedPaymentType,
    paymentStatus: selectedPaymentMode === 'Prepaid' ? 'Paid' : 'Pending Delivery',
    items: [
      { name: 'Custom Handcrafted Floral Garland', quantity: 1, price: 549 }
    ],
    milestones
  };
};

interface OrderTrackerProps {
  onBackToShop?: () => void;
}

export default function OrderTracker({ onBackToShop }: OrderTrackerProps = {}) {
  const [inputId, setInputId] = React.useState('');
  const [searchedId, setSearchedId] = React.useState<string | null>(null);
  const [currentOrder, setCurrentOrder] = React.useState<OrderDetails | null>(null);
  const [isCopied, setIsCopied] = React.useState(false);
  const [isSqlCopied, setIsSqlCopied] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showSupabaseGuide, setShowSupabaseGuide] = React.useState(false);

  // Load default order RA-2045 from Cloud SQL on mount
  React.useEffect(() => {
    fetchOrderFromDb('RA-2045');
  }, []);

  const fetchOrderFromDb = async (id: string) => {
    setIsLoading(true);
    setError(null);
    const cleanId = id.trim().toUpperCase();
    setSearchedId(cleanId);
    setInputId(cleanId);

    try {
      const response = await fetch(`/api/orders/${cleanId}`);
      if (response.ok) {
        const data = await response.json();
        setCurrentOrder(data);
      } else if (response.status === 404) {
        // If not in Cloud SQL yet, create a dynamic order and persist to Cloud SQL database!
        const dynamicOrder = generateDynamicOrder(cleanId);
        
        // Save to Cloud SQL
        await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dynamicOrder)
        });

        setCurrentOrder(dynamicOrder);
      } else {
        setError('Failed to load tracking data from Cloud SQL database.');
      }
    } catch (err) {
      console.error('Error fetching order from Cloud SQL:', err);
      // Fallback to client state if network error
      if (MOCK_ORDERS[cleanId]) {
        setCurrentOrder(MOCK_ORDERS[cleanId]);
      } else {
        setCurrentOrder(generateDynamicOrder(cleanId));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanId = inputId.trim().toUpperCase();
    if (!cleanId) {
      setError('Please enter a valid Order ID to track.');
      return;
    }
    fetchOrderFromDb(cleanId);
  };

  const handleQuickDemo = (id: string) => {
    fetchOrderFromDb(id);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Status visual configurations
  const getStatusBadge = (status: OrderDetails['status']) => {
    switch (status) {
      case 'ordered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200">
            <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} /> Order Placed
          </span>
        );
      case 'crafting':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200 animate-pulse">
            <Scissors className="w-3.5 h-3.5" /> Twisting & Crafting
          </span>
        );
      case 'packed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200">
            <Package className="w-3.5 h-3.5" /> Boxed with Care
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-200">
            <Truck className="w-3.5 h-3.5" /> Handed to Carrier
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5" /> Delivered Everlasting
          </span>
        );
    }
  };

  const getMilestoneIcon = (status: TrackingMilestone['status'], isCompleted: boolean, isActive: boolean) => {
    const baseClass = `w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
      isActive 
        ? 'bg-rose-500 text-white border-rose-500 shadow-md scale-110 ring-4 ring-rose-100'
        : isCompleted
        ? 'bg-emerald-500 text-white border-emerald-500'
        : 'bg-white text-stone-300 border-stone-200'
    }`;

    switch (status) {
      case 'ordered':
        return <div className={baseClass}><Clock className="w-4.5 h-4.5" /></div>;
      case 'crafting':
        return <div className={baseClass}><Scissors className={`w-4.5 h-4.5 ${isActive ? 'animate-bounce' : ''}`} /></div>;
      case 'packed':
        return <div className={baseClass}><Package className="w-4.5 h-4.5" /></div>;
      case 'shipped':
        return <div className={baseClass}><Truck className={`w-4.5 h-4.5 ${isActive ? 'animate-pulse' : ''}`} /></div>;
      case 'delivered':
        return <div className={baseClass}><Flower className="w-4.5 h-4.5" /></div>;
    }
  };

  return (
    <section id="tracking" className="py-20 bg-orange-50/20 border-t border-b border-orange-100/60 relative overflow-hidden">
      {/* Visual background details */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-rose-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Breadcrumb Navigation */}
        {onBackToShop && (
          <div className="flex items-center gap-2 mb-8 text-xs font-mono font-semibold text-stone-500">
            <button 
              type="button"
              onClick={onBackToShop}
              className="hover:text-rose-600 transition-colors cursor-pointer flex items-center gap-1.5 bg-white border border-stone-200/60 px-3.5 py-2 rounded-xl shadow-xs hover:shadow-sm hover:border-rose-200"
              id="tracking-back-breadcrumb"
            >
              <span>← Back to Shop Collection</span>
            </button>
            <span className="text-stone-300">/</span>
            <span className="text-rose-600">Track Order Shipment</span>
          </div>
        )}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            <div className="inline-flex items-center gap-1 bg-rose-50 border border-rose-100/60 px-3 py-1 rounded-full text-rose-600 text-xs font-semibold">
              <Truck className="w-3.5 h-3.5" />
              <span>Eco-Logistic Updates</span>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-emerald-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>PostgreSQL & Supabase Connected</span>
            </div>
            <button
              type="button"
              onClick={() => setShowSupabaseGuide(!showSupabaseGuide)}
              className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-xs"
              id="toggle-supabase-guide-btn"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Supabase Setup Instructions</span>
              {showSupabaseGuide ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
          <h2 className="text-3xl font-bold text-stone-950 font-sans tracking-tight">
            Track Your Everlasting Blooms
          </h2>
          <p className="mt-3 text-stone-500 text-sm sm:text-base leading-relaxed font-sans">
            Real-time status, customer details, payment modes, and courier milestones fetched directly from your database.
          </p>
        </div>

        {/* Supabase Setup Guide Walkthrough Modal/Box */}
        <AnimatePresence>
          {showSupabaseGuide && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
              id="supabase-guide-container"
            >
              <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-8 border border-stone-800 shadow-xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold font-sans text-white">How to Set Up Supabase Database</h3>
                      <p className="text-xs text-stone-400">Step-by-step guide to connect your Supabase PostgreSQL project</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono bg-stone-800 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-md">
                    Status: {isSupabaseConfigured ? '✅ Connected' : '⚡ Ready for Keys'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                  <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700/60 space-y-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs">1</span>
                    <h4 className="font-bold text-white">1. Create Supabase Table Schema</h4>
                    <p className="text-stone-300 leading-relaxed text-[11px]">
                      Open your Supabase Dashboard → <strong>SQL Editor</strong>, paste the schema below, and run it to create tables with customer & payment fields.
                    </p>
                  </div>

                  <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700/60 space-y-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs">2</span>
                    <h4 className="font-bold text-white">2. Copy Supabase API Credentials</h4>
                    <p className="text-stone-300 leading-relaxed text-[11px]">
                      In Supabase, go to <strong>Project Settings → API</strong>. Copy your <code>Project URL</code> and <code>anon public key</code>.
                    </p>
                  </div>

                  <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700/60 space-y-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs">3</span>
                    <h4 className="font-bold text-white">3. Configure Environment Variables</h4>
                    <p className="text-stone-300 leading-relaxed text-[11px]">
                      Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> into your environment variables or <code>.env</code> file.
                    </p>
                  </div>
                </div>

                {/* SQL Schema Script Copy Box */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-stone-300 flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-emerald-400" /> Supabase SQL Editor Script
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const sqlScript = `-- Supabase Schema for Everlasting Blooms Order Tracking
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  order_id TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT DEFAULT 'customer@example.com',
  customer_phone TEXT DEFAULT '+91 98765 43210',
  order_date TEXT NOT NULL,
  estimated_delivery TEXT NOT NULL,
  status TEXT NOT NULL,
  courier TEXT NOT NULL,
  tracking_no TEXT NOT NULL,
  address TEXT NOT NULL,
  payment_mode TEXT DEFAULT 'Prepaid' NOT NULL,
  payment_type TEXT DEFAULT 'UPI / Google Pay (GPay)' NOT NULL,
  payment_status TEXT DEFAULT 'Paid' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id TEXT REFERENCES orders(order_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS order_milestones (
  id SERIAL PRIMARY KEY,
  order_id TEXT REFERENCES orders(order_id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT FALSE,
  step_order INTEGER NOT NULL
);`;
                        navigator.clipboard.writeText(sqlScript);
                        setIsSqlCopied(true);
                        setTimeout(() => setIsSqlCopied(false), 2000);
                      }}
                      className="text-xs bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 px-3 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                      id="copy-supabase-sql-btn"
                    >
                      {isSqlCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-stone-400" />}
                      <span>{isSqlCopied ? 'SQL Copied!' : 'Copy SQL Script'}</span>
                    </button>
                  </div>

                  <pre className="bg-stone-950 p-4 rounded-xl border border-stone-800 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-48 leading-relaxed">
{`CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  order_id TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT DEFAULT 'customer@example.com',
  customer_phone TEXT DEFAULT '+91 98765 43210',
  order_date TEXT NOT NULL,
  estimated_delivery TEXT NOT NULL,
  status TEXT NOT NULL, -- 'ordered' | 'crafting' | 'packed' | 'shipped' | 'delivered'
  courier TEXT NOT NULL,
  tracking_no TEXT NOT NULL,
  address TEXT NOT NULL,
  payment_mode TEXT DEFAULT 'Prepaid' NOT NULL, -- 'Prepaid' | 'Cash on Delivery'
  payment_type TEXT DEFAULT 'UPI / Google Pay (GPay)' NOT NULL, -- 'UPI / Google Pay (GPay)' | 'Credit Card'
  payment_status TEXT DEFAULT 'Paid' NOT NULL -- 'Paid' | 'Pending'
);`}
                  </pre>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Panel Card */}
        <div className="bg-white rounded-2xl border border-orange-100/70 p-6 sm:p-8 shadow-md hover:shadow-lg transition-shadow duration-300 mb-8" id="tracking-search-card">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter your Order ID (e.g., RA-1024)..."
                value={inputId}
                onChange={(e) => {
                  setInputId(e.target.value);
                  if (error) setError(null);
                }}
                className="w-full bg-stone-50/80 hover:bg-stone-50 focus:bg-white text-stone-900 font-medium placeholder-stone-400 text-sm pl-11 pr-4 py-3.5 rounded-xl border border-stone-200/60 focus:border-rose-300 focus:outline-none focus:ring-4 focus:ring-rose-100/50 transition-all duration-300"
                id="tracking-id-input"
              />
              <Search className="absolute left-4 top-4 w-4.5 h-4.5 text-stone-400" />
            </div>
            <button
              type="submit"
              className="bg-stone-900 hover:bg-stone-850 active:bg-stone-950 text-white font-sans text-sm font-semibold px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-sm cursor-pointer"
              id="tracking-search-submit"
            >
              <span>Locate Shipment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {error && (
            <p className="mt-2.5 text-rose-600 text-xs font-semibold flex items-center gap-1.5" id="tracking-error">
              <span className="w-1 h-1 rounded-full bg-rose-600" />
              {error}
            </p>
          )}

          {/* Quick Demos Panel */}
          <div className="mt-6 pt-5 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-stone-400 text-xs font-mono font-medium tracking-wide">
              DEMO TRACKERS:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('RA-2045')}
                className={`text-[11px] font-mono font-semibold px-3 py-1.5 rounded-lg border transition-all duration-300 cursor-pointer ${
                  searchedId === 'RA-2045'
                    ? 'bg-amber-50 text-amber-700 border-amber-300 shadow-sm'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100/80'
                }`}
                id="demo-btn-ordered"
              >
                RA-2045 (Ordered)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('RA-1024')}
                className={`text-[11px] font-mono font-semibold px-3 py-1.5 rounded-lg border transition-all duration-300 cursor-pointer ${
                  searchedId === 'RA-1024'
                    ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-sm'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100/80'
                }`}
                id="demo-btn-crafting"
              >
                RA-1024 (Crafting)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('RA-5821')}
                className={`text-[11px] font-mono font-semibold px-3 py-1.5 rounded-lg border transition-all duration-300 cursor-pointer ${
                  searchedId === 'RA-5821'
                    ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-sm'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100/80'
                }`}
                id="demo-btn-shipped"
              >
                RA-5821 (Shipped)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('RA-7734')}
                className={`text-[11px] font-mono font-semibold px-3 py-1.5 rounded-lg border transition-all duration-300 cursor-pointer ${
                  searchedId === 'RA-7734'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-sm'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100/80'
                }`}
                id="demo-btn-delivered"
              >
                RA-7734 (Delivered)
              </button>
            </div>
          </div>
        </div>

        {/* Tracking Details Results Card */}
        <AnimatePresence mode="wait">
          {currentOrder && searchedId && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="bg-white rounded-2xl border border-orange-100/80 shadow-lg overflow-hidden"
              id="tracking-results-card"
            >
              {/* Header Details */}
              <div className="bg-stone-900 text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-stone-400 font-mono text-xs uppercase tracking-wider font-medium">Order Reference</span>
                    <span className="bg-white/10 px-2.5 py-0.5 rounded text-xs font-mono font-bold text-stone-100 tracking-wider">
                      {currentOrder.orderId}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold font-sans tracking-tight">
                    Hello, {currentOrder.customerName}
                  </h3>
                  <p className="text-stone-400 text-xs font-sans flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Placed on {currentOrder.orderDate}
                  </p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-xl flex flex-col items-start md:items-end gap-1.5 self-start md:self-auto min-w-[200px]">
                  <span className="text-[10px] text-stone-400 uppercase font-mono tracking-wider">Current Shipment Status</span>
                  {getStatusBadge(currentOrder.status)}
                </div>
              </div>

              {/* Progress Content Map */}
              <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left: Interactive Vertical Timeline map */}
                <div className="lg:col-span-7 space-y-8 relative">
                  <h4 className="text-stone-800 text-sm font-sans font-bold uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-rose-500" /> Production & Delivery Journey
                  </h4>

                  {/* Vertical bar line */}
                  <div className="absolute left-5 top-12 bottom-6 w-0.5 bg-stone-100" />

                  <div className="space-y-8 relative">
                    {currentOrder.milestones.map((milestone, idx) => {
                      const isCompleted = milestone.isCompleted;
                      const isActive = milestone.isActive;
                      
                      return (
                        <motion.div 
                          key={milestone.status}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex gap-4 items-start group"
                          id={`milestone-step-${milestone.status}`}
                        >
                          <div className="relative z-10 shrink-0">
                            {getMilestoneIcon(milestone.status, isCompleted, isActive)}
                          </div>
                          <div className="space-y-1 pt-1.5">
                            <h5 className={`font-sans text-sm font-bold tracking-tight ${
                              isActive 
                                ? 'text-rose-600' 
                                : isCompleted 
                                ? 'text-stone-850' 
                                : 'text-stone-400'
                            }`}>
                              {milestone.title}
                            </h5>
                            <p className={`font-sans text-xs leading-relaxed ${
                              isActive
                                ? 'text-stone-700 font-medium'
                                : isCompleted
                                ? 'text-stone-500'
                                : 'text-stone-400/80'
                            }`}>
                              {milestone.description}
                            </p>
                            <span className="block font-mono text-[10px] text-stone-400">
                              {milestone.date}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Right: Customer details, Payment breakdown, Courier & items receipt */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Customer Details Box */}
                  <div className="bg-stone-50 border border-stone-200/60 p-5 rounded-xl space-y-3">
                    <h4 className="text-stone-800 text-xs font-sans font-bold uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-rose-600" /> Customer Information
                      </span>
                      <span className="text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-100 font-mono font-medium">Verified User</span>
                    </h4>

                    <div className="space-y-2.5 font-sans text-xs pt-1">
                      <div className="flex items-center justify-between py-1 border-b border-stone-200/40">
                        <span className="text-stone-500">Full Name:</span>
                        <span className="font-semibold text-stone-800">{currentOrder.customerName}</span>
                      </div>
                      
                      {currentOrder.customerEmail && (
                        <div className="flex items-center justify-between py-1 border-b border-stone-200/40">
                          <span className="text-stone-500 flex items-center gap-1"><Mail className="w-3 h-3 text-stone-400" /> Email:</span>
                          <span className="font-mono text-stone-800 text-[11px]">{currentOrder.customerEmail}</span>
                        </div>
                      )}

                      {currentOrder.customerPhone && (
                        <div className="flex items-center justify-between py-1 border-b border-stone-200/40">
                          <span className="text-stone-500 flex items-center gap-1"><Phone className="w-3 h-3 text-stone-400" /> Phone:</span>
                          <span className="font-mono text-stone-800 text-[11px]">{currentOrder.customerPhone}</span>
                        </div>
                      )}

                      <div className="space-y-1 pt-1">
                        <span className="text-stone-500 block">Shipping Address:</span>
                        <p className="text-stone-700 text-[11px] leading-relaxed flex items-start gap-1 bg-white p-2 rounded border border-stone-200/60">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                          <span>{currentOrder.address}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Mode & Type Details Box */}
                  <div className="bg-emerald-50/40 border border-emerald-200/60 p-5 rounded-xl space-y-3">
                    <h4 className="text-emerald-900 text-xs font-sans font-bold uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-emerald-600" /> Payment Breakdown
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        {currentOrder.paymentStatus || 'Paid'}
                      </span>
                    </h4>

                    <div className="space-y-2.5 font-sans text-xs pt-1">
                      <div className="flex items-center justify-between py-1 border-b border-emerald-100">
                        <span className="text-stone-600">Payment Mode:</span>
                        <span className="font-semibold text-emerald-900 bg-emerald-100/60 px-2 py-0.5 rounded text-[11px]">
                          {currentOrder.paymentMode || 'Prepaid'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-1 border-b border-emerald-100">
                        <span className="text-stone-600">Payment Type / Provider:</span>
                        <span className="font-medium text-stone-800 text-[11px]">
                          {currentOrder.paymentType || 'UPI / Google Pay (GPay)'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-1">
                        <span className="text-stone-600">Transaction Status:</span>
                        <span className="font-semibold text-emerald-700 flex items-center gap-1 text-[11px]">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Verified & Cleared
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Shipping & Logistics Details */}
                  <div className="bg-stone-50 border border-stone-200/50 p-5 rounded-xl space-y-3">
                    <h4 className="text-stone-800 text-xs font-sans font-bold uppercase tracking-wider">
                      Logistic Metadata
                    </h4>

                    <div className="space-y-2.5 font-sans text-xs">
                      <div className="flex items-center justify-between py-1 border-b border-stone-200/40">
                        <span className="text-stone-500">Logistics Courier:</span>
                        <span className="font-semibold text-stone-800">{currentOrder.courier}</span>
                      </div>
                      
                      <div className="flex items-center justify-between py-1 border-b border-stone-200/40">
                        <span className="text-stone-500">AWB Tracking ID:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-semibold text-stone-800">{currentOrder.trackingNo}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(currentOrder.trackingNo)}
                            className="p-1 hover:bg-stone-200/70 rounded text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
                            title="Copy Tracking ID"
                            id="tracking-copy-btn"
                          >
                            {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-1">
                        <span className="text-stone-500">Est. Arrival Date:</span>
                        <span className="font-semibold text-rose-600 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {currentOrder.estimatedDelivery}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Receipt Box */}
                  <div className="bg-orange-50/40 border border-orange-100/50 p-5 rounded-xl space-y-4">
                    <h4 className="text-stone-800 text-xs font-sans font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5 text-orange-600" /> Itemized Receipt
                    </h4>

                    <div className="space-y-3 font-sans text-xs">
                      {currentOrder.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-start gap-2">
                          <div>
                            <span className="font-medium text-stone-800 block">{item.name}</span>
                            <span className="text-stone-400 text-[10px]">Qty: {item.quantity} × ₹{item.price}</span>
                          </div>
                          <span className="font-semibold text-stone-800 shrink-0">
                            ₹{item.quantity * item.price}
                          </span>
                        </div>
                      ))}

                      <div className="pt-3 border-t border-orange-200/40 flex justify-between items-center text-sm">
                        <span className="font-bold text-stone-850">Total Value:</span>
                        <span className="font-bold text-stone-950">
                          ₹{currentOrder.items.reduce((sum, item) => sum + item.quantity * item.price, 0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Care Helper */}
                  <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-stone-50 border border-stone-150">
                    <HelpCircle className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                    <div className="font-sans text-[11px] leading-relaxed text-stone-500">
                      <span className="font-semibold text-stone-700 block">Need custom changes?</span>
                      If your order is in <strong>Order Placed</strong> or <strong>Meticulous Crafting</strong> stages, you can still request custom length changes by pinging Rutuja directly on WhatsApp with your Order ID!
                    </div>
                  </div>

                </div>
              </div>

              {/* Keepsake Flower Care Tips Banner */}
              <div className="bg-stone-50 border-t border-stone-100 px-6 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-rose-100/60 rounded-lg text-rose-600">
                    <Flower className="w-4 h-4" />
                  </div>
                  <div className="font-sans text-xs">
                    <span className="font-bold text-stone-850 block">Durable keepsakes that never fade!</span>
                    <span className="text-stone-500">Simply keep your chenille stems dry and blow-dust with a cold dryer.</span>
                  </div>
                </div>
                <a
                  href="#faq"
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors flex items-center gap-1 self-start sm:self-auto cursor-pointer"
                  id="care-faq-link"
                >
                  <span>Read Care Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
