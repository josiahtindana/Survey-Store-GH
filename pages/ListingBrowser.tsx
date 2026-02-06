
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Filter, SlidersHorizontal, MapPin, Star, Zap, Compass, 
  ShoppingCart, Calendar, Check, ChevronDown, ShieldCheck, Award, 
  Truck, ArrowRight, Activity, Cpu
} from 'lucide-react';
import { MOCK_LISTINGS } from '../constants.tsx';
import { EquipmentCategory, TransactionType, EquipmentListing } from '../types';
import { parseSmartSearch } from '../geminiService';

const BACKGROUND_VIDEOS = [
  "https://assets.mixkit.co/videos/preview/mixkit-engineer-working-with-a-tablet-and-measuring-tools-34531-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-top-view-of-a-construction-site-with-cranes-and-trucks-42410-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-drone-view-of-a-modern-building-under-construction-42353-large.mp4"
];

const BRANDS = ["Leica Geosystems", "Trimble", "Topcon", "Sokkia", "GeoMax", "Nikon", "Faro", "DJI Enterprise"];

type SortOption = 'Featured' | 'Newest' | 'Price: Low to High' | 'Price: High to Low';

const ListingBrowser: React.FC = () => {
  const [listings, setListings] = useState(MOCK_LISTINGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeTxType, setActiveTxType] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('Featured');
  const [isSmartSearchLoading, setIsSmartSearchLoading] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const categories = ['All', ...Object.values(EquipmentCategory)];
  const sortOptions: SortOption[] = ['Featured', 'Newest', 'Price: Low to High', 'Price: High to Low'];

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentVideoIndex((prev) => (prev + 1) % BACKGROUND_VIDEOS.length);
        setFade(true);
      }, 1000); 
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sortListings = (list: EquipmentListing[], criteria: SortOption) => {
    const sorted = [...list];
    switch (criteria) {
      case 'Newest':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'Price: Low to High':
        return sorted.sort((a, b) => {
          const priceA = a.salePrice || a.rentalPriceDaily || 0;
          const priceB = b.salePrice || b.rentalPriceDaily || 0;
          return priceA - priceB;
        });
      case 'Price: High to Low':
        return sorted.sort((a, b) => {
          const priceA = a.salePrice || a.rentalPriceDaily || 0;
          const priceB = b.salePrice || b.rentalPriceDaily || 0;
          return priceB - priceA;
        });
      case 'Featured':
      default:
        return sorted;
    }
  };

  const applyFiltersAndSort = (query: string, category: string, txType: string, sortCriteria: SortOption, aiParsed?: any) => {
    let filtered = [...MOCK_LISTINGS];
    
    // If AI parsed results, use them as primary filters
    if (aiParsed) {
      if (aiParsed.category) {
        filtered = filtered.filter(l => l.category.toLowerCase().includes(aiParsed.category.toLowerCase()));
      }
      if (aiParsed.brand) {
        filtered = filtered.filter(l => l.title.toLowerCase().includes(aiParsed.brand.toLowerCase()));
      }
      if (aiParsed.maxPrice) {
        filtered = filtered.filter(l => (l.salePrice || l.rentalPriceDaily || 0) <= aiParsed.maxPrice);
      }
      if (aiParsed.transactionType) {
        const type = aiParsed.transactionType.toLowerCase();
        if (type.includes('rent')) filtered = filtered.filter(l => l.transactionType !== TransactionType.SALE);
        if (type.includes('buy') || type.includes('sale')) filtered = filtered.filter(l => l.transactionType !== TransactionType.RENTAL);
      }
    } else {
      // Manual Search Filter
      if (query) {
        filtered = filtered.filter(l => 
          l.title.toLowerCase().includes(query.toLowerCase()) ||
          l.description.toLowerCase().includes(query.toLowerCase())
        );
      }
      // Sidebar Filters
      if (category !== 'All') {
        filtered = filtered.filter(l => l.category === category);
      }
      if (txType !== 'All') {
        filtered = filtered.filter(l => 
          l.transactionType === txType || l.transactionType === TransactionType.BOTH
        );
      }
    }

    setListings(sortListings(filtered, sortCriteria));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.length > 5) {
      setIsSmartSearchLoading(true);
      const parsed = await parseSmartSearch(searchQuery);
      setIsSmartSearchLoading(false);
      applyFiltersAndSort(searchQuery, activeCategory, activeTxType, sortBy, parsed);
    } else {
      applyFiltersAndSort(searchQuery, activeCategory, activeTxType, sortBy);
    }
    document.getElementById('listings-results')?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    applyFiltersAndSort(searchQuery, activeCategory, activeTxType, sortBy);
  }, [activeCategory, activeTxType, sortBy]);

  const handleQuickAction = (type: string) => {
    setActiveTxType(type);
    document.getElementById('listings-results')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="pb-20">
      {/* Hero Banner Section */}
      <section className="relative h-[85vh] md:h-[90vh] bg-[#1a2332] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <video
            key={BACKGROUND_VIDEOS[currentVideoIndex]}
            autoPlay muted loop playsInline
            className={`w-full h-full object-cover transition-opacity duration-1000 ${fade ? 'opacity-40' : 'opacity-0'}`}
          >
            <source src={BACKGROUND_VIDEOS[currentVideoIndex]} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a2332]/80 via-[#1a2332]/60 to-[#1a2332]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-pulse">
              <ShieldCheck size={14} fill="currentColor" /> Ghana's Verified Survey Hub
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter uppercase leading-[0.85]">
              Survey Store <span className="text-orange-500">Ghana</span>
            </h1>
            <p className="text-slate-300 mb-12 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              Rent or Buy high-precision geospatial tech. From GNSS to 3D Scanners, we power Ghana's biggest infrastructure projects.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <button 
                onClick={() => handleQuickAction(TransactionType.RENTAL)}
                className={`w-full sm:w-auto flex items-center justify-center gap-4 px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 border-2 ${activeTxType === TransactionType.RENTAL ? 'bg-orange-500 border-orange-500 text-white shadow-orange-500/40' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}
              >
                <Calendar size={20} /> Rent Equipment
              </button>
              <button 
                onClick={() => handleQuickAction(TransactionType.SALE)}
                className={`w-full sm:w-auto flex items-center justify-center gap-4 px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 border-2 ${activeTxType === TransactionType.SALE ? 'bg-orange-500 border-orange-500 text-white shadow-orange-500/40' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}
              >
                <ShoppingCart size={20} /> Buy Gear
              </button>
            </div>

            <form onSubmit={handleSearch} className="relative group max-w-3xl mx-auto">
              <input
                type="text"
                placeholder="Try: 'Leica Total Station under $15k'..."
                className="w-full pl-16 pr-44 py-7 bg-white border-none rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] focus:ring-4 focus:ring-orange-500/40 outline-none transition-all text-xl md:text-2xl font-black text-[#1a2332]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute left-7 top-1/2 -translate-y-1/2 text-[#1a2332]">
                <Search size={28} strokeWidth={3} />
              </div>
              <button 
                type="submit"
                className="absolute right-4 top-4 bottom-4 bg-[#1a2332] text-white px-10 rounded-full font-black text-sm uppercase tracking-widest hover:bg-orange-600 transition-all flex items-center gap-2 active:scale-95"
              >
                {isSmartSearchLoading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Zap size={20} fill="currentColor" />}
                Smart Find
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Brands Bar */}
      <div className="bg-white border-b border-slate-100 py-10 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 mb-4">
           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Equipment Partners & Supported Brands</h4>
        </div>
        <div className="flex gap-12 items-center animate-marquee whitespace-nowrap">
          {[...BRANDS, ...BRANDS].map((brand, i) => (
            <span key={i} className="text-xl md:text-2xl font-black text-slate-200 uppercase tracking-tighter hover:text-slate-400 transition-colors cursor-default">{brand}</span>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div id="listings-results" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full md:w-64 space-y-10">
            <div>
              <h3 className="text-xs font-black text-[#1a2332] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Filter size={16} className="text-orange-500" /> Filter Inventory
              </h3>
              <div className="space-y-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all font-bold ${
                      activeCategory === cat ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-[#1a2332] to-[#253147] rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center mb-4">
                  <Award size={20} />
                </div>
                <h4 className="text-sm font-black uppercase tracking-widest mb-2">Verified Only</h4>
                <p className="text-[10px] font-bold text-slate-300 leading-relaxed uppercase tracking-tighter">
                  Every total station and GNSS receiver listed here includes a calibration check from certified engineers.
                </p>
              </div>
              <Compass className="absolute bottom-[-20px] right-[-20px] opacity-10 text-white group-hover:rotate-90 transition-transform duration-1000" size={100} />
            </div>
          </aside>

          {/* Results Area */}
          <div className="flex-grow">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
              <div>
                <h2 className="text-2xl font-black text-[#1a2332] uppercase tracking-tighter">Professional Catalog</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing {listings.length} equipment units in Ghana</p>
              </div>
              
              <div className="relative" ref={sortRef}>
                <button 
                  onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                  className="flex items-center gap-3 text-[11px] font-black text-[#1a2332] bg-white px-6 py-3.5 border border-slate-200 rounded-2xl hover:bg-slate-50 uppercase tracking-wider transition-all shadow-sm active:scale-95"
                >
                  <SlidersHorizontal size={14} className="text-orange-500" /> Sort: <span className="text-orange-600">{sortBy}</span>
                  <ChevronDown size={14} className={`transition-transform ${isSortMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {isSortMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-3xl shadow-2xl border border-slate-100 py-3 z-30 animate-in fade-in zoom-in-95 duration-200">
                    {sortOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => { setSortBy(option); setIsSortMenuOpen(false); }}
                        className={`w-full flex items-center justify-between px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${sortBy === option ? 'text-orange-600 bg-orange-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
                      >
                        {option} {sortBy === option && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {listings.map(item => (
                <Link 
                  key={item.id} 
                  to={`/listing/${item.id}`}
                  className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:translate-y-[-6px] transition-all duration-300 overflow-hidden flex flex-col"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img 
                      src={item.images[0]} alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-5 left-5">
                      <div className="bg-[#1a2332]/80 backdrop-blur-md text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl border border-white/10">
                        {item.transactionType}
                      </div>
                    </div>
                    {item.condition === 'New' && (
                      <div className="absolute top-5 right-5">
                        <div className="bg-orange-500 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
                          New
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest bg-orange-50 px-2 py-0.5 rounded-md">{item.category}</span>
                      <div className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        <Star size={10} className="text-yellow-400" fill="currentColor" /> 4.9
                      </div>
                    </div>
                    <h3 className="text-lg font-black text-[#1a2332] line-clamp-2 mb-4 leading-[1.2] group-hover:text-orange-500 transition-colors uppercase tracking-tight">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 mb-8">
                      <MapPin size={14} className="text-orange-400" /> {item.location}
                    </div>
                    
                    <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                      <div>
                        {item.salePrice && <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Buy: <span className="text-[#1a2332] text-lg font-black">${item.salePrice.toLocaleString()}</span></div>}
                        {item.rentalPriceDaily && <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Rent: <span className="text-orange-600 text-lg font-black">${item.rentalPriceDaily}</span>/day</div>}
                      </div>
                      <div className="w-12 h-12 bg-slate-50 flex items-center justify-center rounded-2xl text-[#1a2332] group-hover:bg-orange-500 group-hover:text-white transition-all shadow-inner border border-slate-100">
                        <ArrowRight size={20} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {listings.length === 0 && (
              <div className="text-center py-40 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                <Activity size={64} className="mx-auto text-slate-200 mb-8 animate-pulse" />
                <h3 className="text-xl font-black text-[#1a2332] uppercase tracking-tighter mb-2">No matching units</h3>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Try adjusting your filters or use simpler terms</p>
                <button onClick={() => { setSearchQuery(''); setActiveCategory('All'); setActiveTxType('All'); setSortBy('Featured'); }} className="mt-8 text-orange-500 font-black text-xs uppercase hover:underline tracking-widest">Reset All Filters</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <section className="bg-[#1a2332] mt-32 py-24 px-4 overflow-hidden relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10">
          <div className="space-y-6">
            <div className="w-16 h-16 bg-orange-500/20 rounded-3xl flex items-center justify-center text-orange-500">
               <ShieldCheck size={32} />
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Secure Escrow</h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">Payments are held in our secure platform until you receive and verify the equipment's calibration and working state.</p>
          </div>
          <div className="space-y-6">
            <div className="w-16 h-16 bg-teal-500/20 rounded-3xl flex items-center justify-center text-teal-400">
               <Truck size={32} />
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Nationwide Logistics</h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">From Accra to Wa, our specialized couriers handle sensitive optical equipment with extreme care and tracking.</p>
          </div>
          <div className="space-y-6">
            <div className="w-16 h-16 bg-blue-500/20 rounded-3xl flex items-center justify-center text-blue-400">
               <Cpu size={32} />
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">AI-Powered Search</h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">Our advanced Gemini integration understands complex engineering requirements and technical specs instantly.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ListingBrowser;
