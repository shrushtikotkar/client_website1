import React, { useState, useEffect } from 'react';
import Services from './components/Services';
import FleetShowcase from './components/FleetShowcase';
import AdminVehicleUpload from './components/AdminVehicleUpload';
import { 
  Phone, 
  Clock, 
  ArrowRight, 
  Menu, 
  X, 
  Send,
  CheckCircle2,
  Users,
  Briefcase,
  Mail,
  Eye,
  ShieldCheck,
  Award,
  MapPin,
  Sparkles,
  Zap,
  Car,
  ChevronLeft,
  ChevronRight,
  Camera
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '';


const CONTACT_INFO = {
  name: "Sadguru Tours And Travels",
  email: "amolr9837@gmail.com",
  contacts: [
    { name: "Amol Rothe", phone: "7972738737", whatsapp: "9823841476" },
    { name: "Arvind Rothe", phone: "7385514325", whatsapp: "" }
  ]
};

const ALL_SERVICES = [
  "Corporate Car Rental Services",
  "Corporate Taxi Service",
  "Corporate Vehicle Rental",
  "Day Trips & Outings",
  "Driver Services",
  "Hotel Booking Service",
  "Local Cab Service",
  "Long Term Car Rental",
  "Mini Bus Rentals",
  "One Way Cabs",
  "Outstation Trips",
  "Taxi Rental Service",
  "Tempo Travelers (17/26 Seater)",
  "Tour Packages across India",
  "Trips And Travels",
  "Vehicle Rental For Weddings",
  "Weekend Getaways Travel"
];

const SADGURU_BUS_IMAGES = [
  { url: "/cyan-bus-full.jpg", label: "Exterior Side View" },
  { url: "/sadguru-bus-interior.jpg", label: "Luxury Interior (AC & LED)" },
  { url: "/cyan-bus-front.jpg", label: "Front View (MH 04 GP 7877)" },
  { url: "/sadguru-coach-side.jpg", label: "Side Angle" }
];

const WHITE_BUS_IMAGES = [
  { url: "/white-bus-side.jpg", label: "Exterior Side Profile" },
  { url: "/white-bus-front.jpg", label: "Front View (DD 01 Z 9559)" },
  { url: "/white-bus-interior.jpg", label: "Luxury Violet LED Cabin" }
];

const FORCE_TRAVELLER_IMAGES = [
  { url: "/force-traveller-exterior.jpg", label: "Executive Traveller Exterior (DD 01 AC 9837)" }
];

const BHARATBENZ_BUS_IMAGES = [
  { url: "/bharatbenz-bus-side.jpg", label: "Exterior Side Profile" },
  { url: "/bharatbenz-bus-front.jpg", label: "Front View (MH 20 GY 7776)" },
  { url: "/bharatbenz-bus-interior.jpg", label: "2x2 AC Pushback Cabin" }
];

const INITIAL_FLEET = [
  {
    id: 'f1',
    name: 'Sadguru Deluxe Luxury Coach (MH 04 GP 7877)',
    category: 'Luxury Bus',
    images: SADGURU_BUS_IMAGES,
    image: '/cyan-bus-full.jpg',
    description: 'Custom decorated luxury 2x2 sleeper/seater coach (MH 04 GP 7877) featuring plush pushback seating, custom illuminated Sadguru LED ambient ceiling, powerful AC, sound system, and heavy underbody luggage storage.',
    seats: '35-45 Seats',
    luggage: 'Large Luggage Hold',
    tag: 'Flagship Luxury Coach'
  },
  {
    id: 'f2',
    name: 'Executive White Tourist Coach (DD 01 Z 9559)',
    category: 'Luxury Bus',
    images: WHITE_BUS_IMAGES,
    image: '/white-bus-side.jpg',
    description: 'Mercedes-Benz styled executive tourist coach (DD 01 Z 9559) featuring luxury blue-beige leather pushback seats, violet mood lighting, pristine AC, and spacious luggage bays for outstation tours and weddings.',
    seats: '32-45 Seats',
    luggage: 'Large Hold Storage',
    tag: 'Executive Tourist'
  },
  {
    id: 'f3',
    name: 'Force Traveller Executive (DD 01 AC 9837)',
    category: 'Tempo Traveler',
    images: FORCE_TRAVELLER_IMAGES,
    image: '/force-traveller-exterior.jpg',
    description: 'Pristine, pushback seating Force Tourist Traveller (DD 01 AC 9837) ideal for outstation family trips, pilgrimage tours, airport transfers, and corporate outings.',
    seats: '17 to 26 Seats',
    luggage: 'Roof & Rear Luggage',
    tag: 'Family Favorite'
  },
  {
    id: 'f4',
    name: 'BharatBenz Premium Tourist Coach (MH 20 GY 7776)',
    category: 'Luxury Bus',
    images: BHARATBENZ_BUS_IMAGES,
    image: '/bharatbenz-bus-side.jpg',
    description: 'Long-distance express BharatBenz tourist coach (MH 20 GY 7776) featuring ultra-comfortable suspensions, clean white headrest seat covers, and full climate control.',
    seats: '40+ Seats',
    luggage: 'Underbody Storage',
    tag: 'Express Comfort'
  }
];

const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('/uploads')) {
    return `${API_BASE}${url}`;
  }
  return url;
};

function VehicleCard({ vehicle, onOpenGallery }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const images = vehicle.images && vehicle.images.length > 0 
    ? vehicle.images 
    : [{ url: vehicle.image, label: 'Vehicle Photo' }];
  
  const currentImg = images[activeIdx] || images[0];

  const nextImage = (e) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl flex flex-col justify-between hover:border-slate-700 transition duration-300 group">
      <div>
        <div className="h-80 sm:h-96 bg-slate-950 relative overflow-hidden select-none">
          <img 
            src={getImageUrl(currentImg.url)} 
            alt={`${vehicle.name} - ${currentImg.label}`} 
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-95 group-hover:opacity-100" 
          />
          
          {/* Top Tag */}
          <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
            {vehicle.tag}
          </div>

          {/* Photos Counter */}
          {images.length > 1 && (
            <div className="absolute top-4 right-4 bg-slate-950/85 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-slate-700 flex items-center gap-1.5 shadow-lg">
              <Camera className="w-3.5 h-3.5 text-red-400" />
              <span>{activeIdx + 1} / {images.length} Photos</span>
            </div>
          )}

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-950/80 hover:bg-red-600 text-white flex items-center justify-center transition backdrop-blur-md shadow-lg"
                title="Previous photo"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-950/80 hover:bg-red-600 text-white flex items-center justify-center transition backdrop-blur-md shadow-lg"
                title="Next photo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Bottom Thumbnails / View Switcher Strip */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-4 right-16 flex gap-2 overflow-x-auto py-1 scrollbar-none">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setActiveIdx(idx); }}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition backdrop-blur-md whitespace-nowrap shadow-md ${
                    activeIdx === idx
                      ? 'bg-red-600 text-white ring-1 ring-red-400'
                      : 'bg-slate-950/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
                  }`}
                >
                  {img.label}
                </button>
              ))}
            </div>
          )}

          {/* View Full Button */}
          <button 
            type="button"
            onClick={() => onOpenGallery(images, activeIdx, vehicle.name)}
            className="absolute bottom-4 right-4 bg-slate-950/90 hover:bg-red-600 text-white p-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 backdrop-blur-md transition shadow-lg cursor-pointer"
            title="Open Fullscreen Photo"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition">{vehicle.name}</h3>
            <span className="text-xs font-bold bg-slate-800 text-rose-300 px-3 py-1 rounded-lg border border-slate-700">{vehicle.category}</span>
          </div>
          <p className="text-slate-400 text-xs mb-6 leading-relaxed">{vehicle.description}</p>
          
          <div className="flex items-center gap-6 text-xs font-medium text-slate-300 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
            <span className="flex items-center gap-2 font-bold text-red-400"><Users className="w-4 h-4" /> {vehicle.seats}</span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-2 font-bold text-rose-300"><Briefcase className="w-4 h-4" /> {vehicle.luggage}</span>
          </div>
        </div>
      </div>

      <div className="p-6 pt-0 flex justify-end items-center border-t border-slate-800/60 mt-4">
        <div className="flex items-center gap-3">
          <a href="https://wa.me/919823841476" target="_blank" rel="noreferrer" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-lg shadow-emerald-600/20">
            WhatsApp
          </a>
          <a href="tel:7972738737" className="bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-lg shadow-red-600/20">
            Call Now
          </a>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [galleryModal, setGalleryModal] = useState({ isOpen: false, images: [], activeIdx: 0, title: '' });
  const [fleetFilter, setFleetFilter] = useState('All');
  const [fleet, setFleet] = useState(INITIAL_FLEET);

  const fetchVehicles = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/vehicles`);
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        // Filter out any old dummy items that had unsplash placeholder images
        const realUploadedVehicles = result.data.filter(
          item => item.image && !item.image.includes('unsplash.com')
        );

        if (realUploadedVehicles.length > 0) {
          const mapped = realUploadedVehicles.map(item => ({
            id: item._id || item.id,
            name: item.name,
            category: item.category || 'Luxury Bus',
            images: [{ url: item.image, label: 'Vehicle Photo' }],
            image: item.image,
            description: item.description,
            seats: item.seats || 'Comfort Seating',
            luggage: item.luggage || 'Available',
            tag: item.tag || 'New Addition'
          }));
          // Put newly uploaded admin vehicles first, followed by real initial fleet
          setFleet([...mapped, ...INITIAL_FLEET]);
        } else {
          setFleet(INITIAL_FLEET);
        }
      }
    } catch (err) {
      console.log('Backend fleet fetch failed, showing initial fleet:', err.message);
      setFleet(INITIAL_FLEET);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    service: ALL_SERVICES[0]
  });

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const { name, phone, service } = bookingForm;

    // Save lead to database in background
    fetch(`${API_BASE}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, service })
    }).catch(err => console.log('Booking lead sync note:', err.message));

    // Trigger Direct WhatsApp Inquiry to Owner
    const message = `*BOOKING INQUIRY*%0A%0A` +
      `👤 *Name:* ${encodeURIComponent(name)}%0A` +
      `📞 *Phone:* ${encodeURIComponent(phone)}%0A` +
      `🚘 *Requirement:* ${encodeURIComponent(service)}%0A%0A` +
      `_Sent from Sadguru Tours Website_`;

    window.open(`https://wa.me/919823841476?text=${message}`, '_blank');

    setBookingSubmitted(true);
    setTimeout(() => setBookingSubmitted(false), 6000);
    setBookingForm({ name: '', phone: '', service: ALL_SERVICES[0] });
  };

  const categories = ['All', ...Array.from(new Set(fleet.map(item => item.category)))];

  const filteredFleet = fleetFilter === 'All' 
    ? fleet 
    : fleet.filter(item => item.category === fleetFilter);

  const openGallery = (images, idx, title) => {
    setGalleryModal({
      isOpen: true,
      images,
      activeIdx: idx,
      title
    });
  };

  const closeGallery = () => {
    setGalleryModal({ isOpen: false, images: [], activeIdx: 0, title: '' });
  };

  const nextGalleryPhoto = (e) => {
    e.stopPropagation();
    setGalleryModal(prev => ({
      ...prev,
      activeIdx: (prev.activeIdx + 1) % prev.images.length
    }));
  };

  const prevGalleryPhoto = (e) => {
    e.stopPropagation();
    setGalleryModal(prev => ({
      ...prev,
      activeIdx: (prev.activeIdx - 1 + prev.images.length) % prev.images.length
    }));
  };

  return (
    <div className="min-h-screen font-sans bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-red-600 selection:text-white">
      
      {/* TOP ANNOUNCEMENT BAR */}
      <div className="bg-gradient-to-r from-red-950 via-rose-950 to-red-950 text-rose-200 text-xs py-2.5 px-4 border-b border-red-900/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center space-x-3 font-medium">
            <span className="flex items-center gap-1.5 text-red-400 font-bold bg-red-900/40 px-2.5 py-0.5 rounded-full border border-red-800/40">
              <Clock className="w-3.5 h-3.5" /> 24/7 Available
            </span>
            <span className="hidden md:inline text-red-800">|</span>
            <a href={`mailto:${CONTACT_INFO.email}`} className="hidden md:flex items-center gap-1.5 hover:text-white transition">
              <Mail className="w-3.5 h-3.5 text-red-400" /> {CONTACT_INFO.email}
            </a>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-semibold">
            <a href="tel:7972738737" className="hover:text-red-300 flex items-center gap-1 bg-red-900/30 px-3 py-1 rounded-full border border-red-800/30">
              <Phone className="w-3 h-3 text-red-400" /> Amol: 7972738737
            </a>
            <a href="tel:7385514325" className="hover:text-red-300 flex items-center gap-1 bg-red-900/30 px-3 py-1 rounded-full border border-red-800/30">
              <Phone className="w-3 h-3 text-red-400" /> Arvind: 7385514325
            </a>
          </div>
        </div>
      </div>

      {/* NAVIGATION BAR */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            <a href="#home" className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-tr from-red-700 to-rose-500 text-white font-black flex items-center justify-center rounded-2xl text-2xl shadow-lg shadow-red-600/30 ring-2 ring-red-500/20">
                S
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white block leading-none">SADGURU</span>
                <span className="text-[10px] font-extrabold text-red-500 tracking-[0.25em] uppercase block mt-1">Tours & Travels</span>
              </div>
            </a>

            <div className="hidden lg:flex items-center space-x-8 text-sm font-bold text-slate-300">
              <a href="#home" className="hover:text-red-500 transition">Home</a>
              <a href="#services" className="hover:text-red-500 transition">Services</a>
              <a href="#fleet" className="hover:text-red-500 transition">Fleet Showcase</a>
              <a href="#booking" className="hover:text-red-500 transition">Quick Booking</a>
              <a href="#contact-details" className="hover:text-red-500 transition">Contact</a>
            </div>

            <div className="hidden lg:flex items-center">
              <a href="https://wa.me/919823841476" target="_blank" rel="noreferrer" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 transition flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-200 animate-ping"></span> WhatsApp 24/7
              </a>
            </div>

            <div className="lg:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-200">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-6 space-y-4">
            <a href="#home" onClick={() => setMobileMenuOpen(false)} className="block font-bold text-slate-200">Home</a>
            <a href="#services" onClick={() => setMobileMenuOpen(false)} className="block font-bold text-slate-200">Services</a>
            <a href="#fleet" onClick={() => setMobileMenuOpen(false)} className="block font-bold text-slate-200">Fleet Showcase</a>
            <a href="#booking" onClick={() => setMobileMenuOpen(false)} className="block font-bold text-slate-200">Quick Booking</a>
            <a href="https://wa.me/919823841476" className="block w-full text-center bg-emerald-600 text-white font-bold py-3 rounded-xl">WhatsApp Inquiry</a>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section 
        id="home" 
        className="relative bg-slate-950 text-white py-32 px-4 bg-cover bg-center bg-no-repeat overflow-hidden border-b border-slate-800/60"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(3, 7, 18, 0.88), rgba(15, 23, 42, 0.95)), url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1920&q=80')`
        }}
      >
        <div className="max-w-7xl mx-auto text-center relative z-10">
          
          <div className="inline-flex items-center gap-2 bg-red-950/80 border border-red-600/40 text-rose-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-red-400" /> Premium Travel Experience Across India
          </div>
          
          <h1 className="text-4xl sm:text-7xl font-black mb-6 leading-tight tracking-tight text-white drop-shadow-md">
            Ride in Comfort with <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-red-500 via-rose-400 to-amber-300 bg-clip-text text-transparent">
              Sadguru Tours & Travels
            </span>
          </h1>
          
          <p className="max-w-3xl mx-auto text-slate-300 text-base sm:text-xl mb-10 leading-relaxed font-normal">
            Specialized in deluxe luxury coaches, illuminated LED interior buses, 17/26-seater Force Travellers, outstation rides, and customized family tour packages.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="#booking" className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-red-600/30 transition duration-300 text-base flex items-center gap-2">
              Book Your Ride Now <ArrowRight className="w-5 h-5" />
            </a>
            <a href="https://wa.me/919823841476" target="_blank" rel="noreferrer" className="bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold px-8 py-4 rounded-2xl transition duration-300 text-base flex items-center gap-2 backdrop-blur-md">
              WhatsApp Direct (9823841476)
            </a>
          </div>

          {/* STATS STRIP */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16 pt-10 border-t border-slate-800/80 text-left">
            <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800/60 backdrop-blur-sm">
              <div className="text-2xl font-black text-red-500">24 / 7</div>
              <div className="text-xs text-slate-400 font-medium">Available Call Support</div>
            </div>
            <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800/60 backdrop-blur-sm">
              <div className="text-2xl font-black text-rose-400">100%</div>
              <div className="text-xs text-slate-400 font-medium">Clean & Verified Fleet</div>
            </div>
            <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800/60 backdrop-blur-sm">
              <div className="text-2xl font-black text-amber-400">1000+</div>
              <div className="text-xs text-slate-400 font-medium">Successful Outstation Trips</div>
            </div>
            <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800/60 backdrop-blur-sm">
              <div className="text-2xl font-black text-emerald-400">Pan-India</div>
              <div className="text-xs text-slate-400 font-medium">All Route Permits</div>
            </div>
          </div>

        </div>
      </section>

      {/* ADMIN PHOTO & VEHICLE UPLOAD SECTION */}
      <section className="bg-slate-950 py-12 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4">
          <AdminVehicleUpload onVehicleAdded={fetchVehicles} />
        </div>
      </section>

      {/* DYNAMIC BOOKING CARD */}
      <section id="booking" className="relative -mt-12 z-20 max-w-5xl mx-auto px-4">
        <div className="bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-800 p-6 sm:p-10 ring-1 ring-white/10">
          <div className="text-center mb-8">
            <span className="text-red-500 font-bold text-xs uppercase tracking-widest">Instant Booking Inquiry</span>
            <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">Book Your Travel Details</h3>
            <p className="text-xs text-slate-400 mt-1">Submitting will directly connect you with our booking manager on WhatsApp.</p>
          </div>

          {bookingSubmitted && (
            <div className="mb-6 p-4 bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 rounded-2xl text-center text-sm font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Redirecting your booking to WhatsApp...
            </div>
          )}

          <form onSubmit={handleBookingSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">Your Full Name</label>
              <input 
                type="text" 
                required 
                placeholder="Name" 
                value={bookingForm.name}
                onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none placeholder-slate-500" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">Phone Number</label>
              <input 
                type="tel" 
                required 
                placeholder="Mobile Number" 
                value={bookingForm.phone}
                onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none placeholder-slate-500" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">Service Type</label>
              <select 
                value={bookingForm.service}
                onChange={(e) => setBookingForm({...bookingForm, service: e.target.value})}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              >
                {ALL_SERVICES.map((srv, i) => (
                  <option key={i} value={srv}>{srv}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-3.5 px-6 rounded-xl transition shadow-lg shadow-red-600/30 text-sm flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Send Request
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section id="services" className="py-24 bg-slate-950 text-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-red-500 font-black text-xs uppercase tracking-widest">Our Expertise</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">Services We Offer</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-red-600 to-rose-500 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ALL_SERVICES.map((service, index) => (
              <div key={index} className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl flex items-center justify-between hover:border-red-600/50 hover:bg-slate-900 transition duration-300 group">
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-red-950/80 text-red-400 border border-red-800/50 group-hover:bg-red-600 group-hover:text-white flex items-center justify-center font-black text-xs transition">
                    {index + 1}
                  </div>
                  <span className="font-bold text-sm text-slate-200 group-hover:text-white">{service}</span>
                </div>
                <a href="https://wa.me/919823841476" target="_blank" rel="noreferrer" className="text-slate-600 group-hover:text-red-400 transition">
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FLEET SHOWCASE */}
      <section id="fleet" className="py-24 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-red-500 font-black text-xs uppercase tracking-widest">Verified Fleet</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-1">Our Featured Vehicles</h2>
            </div>
          </div>

          <div className="flex gap-2 mb-10 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFleetFilter(cat)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition ${
                  fleetFilter === cat 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' 
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredFleet.map((vehicle) => (
              <VehicleCard 
                key={vehicle.id} 
                vehicle={vehicle} 
                onOpenGallery={openGallery} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* FULL PHOTO LIGHTBOX MODAL */}
      {galleryModal.isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fadeIn select-none"
          onClick={closeGallery}
        >
          <div 
            className="relative max-w-5xl w-full max-h-[95vh] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden p-4 shadow-2xl flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white truncate">{galleryModal.title}</h3>
                <span className="text-xs text-red-400 font-semibold">
                  {galleryModal.images[galleryModal.activeIdx]?.label || 'Vehicle View'} ({galleryModal.activeIdx + 1} of {galleryModal.images.length})
                </span>
              </div>
              <button
                onClick={closeGallery}
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-red-600 text-white flex items-center justify-center transition"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Image Display */}
            <div className="relative flex items-center justify-center my-4 overflow-hidden rounded-2xl bg-slate-950 min-h-[300px] max-h-[65vh]">
              <img 
                src={getImageUrl(galleryModal.images[galleryModal.activeIdx]?.url)} 
                alt="Vehicle Full View" 
                className="max-h-[65vh] w-auto max-w-full object-contain rounded-xl" 
              />

              {galleryModal.images.length > 1 && (
                <>
                  <button
                    onClick={prevGalleryPhoto}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-950/80 hover:bg-red-600 text-white flex items-center justify-center transition backdrop-blur-md shadow-xl"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextGalleryPhoto}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-950/80 hover:bg-red-600 text-white flex items-center justify-center transition backdrop-blur-md shadow-xl"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails below modal */}
            {galleryModal.images.length > 1 && (
              <div className="flex items-center justify-center gap-3 pt-2 overflow-x-auto">
                {galleryModal.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setGalleryModal(prev => ({ ...prev, activeIdx: idx }))}
                    className={`relative rounded-xl overflow-hidden border-2 transition ${
                      galleryModal.activeIdx === idx 
                        ? 'border-red-500 scale-105 shadow-lg' 
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={getImageUrl(img.url)} 
                      alt={img.label} 
                      className="w-16 h-12 sm:w-20 sm:h-14 object-cover" 
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer id="contact-details" className="bg-slate-950 text-white border-t border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="w-12 h-12 bg-red-600 text-white font-black flex items-center justify-center rounded-2xl text-2xl mx-auto mb-4 shadow-lg shadow-red-600/30">
            S
          </div>
          <h3 className="text-2xl font-black mb-2">Sadguru Tours And Travels</h3>
          <p className="text-xs text-slate-400 mb-6 max-w-md mx-auto">
            Contact Amol Rothe (<a href="tel:7972738737" className="text-red-400 underline">7972738737</a>) or Arvind Rothe (<a href="tel:7385514325" className="text-red-400 underline">7385514325</a>) for immediate ride allocation across India.
          </p>
          <div className="text-xs text-slate-600 border-t border-slate-900 pt-8">
            &copy; {new Date().getFullYear()} Sadguru Tours And Travels. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}