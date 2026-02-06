import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Filter, SlidersHorizontal, MapPin, Star, Zap, Compass, 
  ShoppingCart, Calendar, Check, ChevronDown, ShieldCheck, Award, 
  Truck, ArrowRight, Activity, Cpu
} from 'lucide-react';
import { MOCK_LISTINGS } from '../constants.tsx';
import { EquipmentCategory, TransactionType, EquipmentListing } from '../types.ts';
import { parseSmartSearch } from '../geminiService.ts';

const BACKGROUND_VIDEOS = [
  "https://assets.mixkit.co/videos/preview/mixkit-engineer-working-with-a-tablet-and-measuring-tools-34531-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-top-view-of-a-construction-site-with-cranes-and-trucks-42410-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-drone-view-of-a-modern-building-under-construction-42353-large.mp4"
];

const BRANDS = ["Leica Geosystems", "Trimble", "Topcon", "Sokkia", "GeoMax", "Nikon", "Faro", "DJI Enterprise"];

type SortOption = 'Featured' | 'Newest' | 'Price: Low to High' | 'Price: High to Low';

const ListingBrowser: React.FC = () => {
  const [listings, setListings] = useState<EquipmentListing[]>(MOCK_LISTINGS);
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
      if (query) {
        filtered = filtered.filter(l => 
          l.title.toLowerCase().includes(query.toLowerCase()) ||
          l.description.toLowerCase().includes(query.toLowerCase())
        );
      }
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

      <div id="listings-results" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex flex-col md:flex-row gap-12">
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
          </aside>

          <div className="flex-grow">
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
                  </div>

                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-lg font-black text-[#1a2332] mb-4 uppercase tracking-tight">
                      {item.title}
                    </h3>
                    <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                      <div className="text-orange-600 text-lg font-black">
                        ${item.salePrice || item.rentalPriceDaily}
                      </div>
                      <ArrowRight size={20} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingBrowser;