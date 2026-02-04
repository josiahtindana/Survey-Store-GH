
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, MapPin, Star, Zap, Compass, ShoppingCart, Calendar } from 'lucide-react';
import { MOCK_LISTINGS } from '../constants.tsx';
import { EquipmentCategory, TransactionType } from '../types';
import { parseSmartSearch } from '../geminiService';

const ListingBrowser: React.FC = () => {
  const [listings, setListings] = useState(MOCK_LISTINGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeTxType, setActiveTxType] = useState<string>('All');
  const [isSmartSearchLoading, setIsSmartSearchLoading] = useState(false);

  const categories = ['All', ...Object.values(EquipmentCategory)];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.length > 10) {
      setIsSmartSearchLoading(true);
      const parsed = await parseSmartSearch(searchQuery);
      setIsSmartSearchLoading(false);
      
      const filtered = MOCK_LISTINGS.filter(l => {
        const matchesCat = !parsed.category || l.category.toLowerCase().includes(parsed.category.toLowerCase());
        const matchesBrand = !parsed.brand || l.title.toLowerCase().includes(parsed.brand.toLowerCase());
        return matchesCat && matchesBrand;
      });
      setListings(filtered);
    } else {
      applyFilters(searchQuery, activeCategory, activeTxType);
    }
  };

  const applyFilters = (query: string, category: string, txType: string) => {
    let filtered = MOCK_LISTINGS;
    
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

    setListings(filtered);
  };

  useEffect(() => {
    applyFilters(searchQuery, activeCategory, activeTxType);
  }, [activeCategory, activeTxType]);

  const handleQuickAction = (type: string) => {
    setActiveTxType(type);
    // Smooth scroll to results
    const resultsElement = document.getElementById('listings-results');
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="pb-20">
      {/* Hero Banner Section */}
      <section className="relative bg-[#1a2332] overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-[-10%] left-[-5%] w-96 h-96 border-[40px] border-orange-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] border-[60px] border-teal-500 rounded-full blur-3xl"></div>
          <div className="grid grid-cols-12 gap-4 h-full w-full p-10">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="h-2 w-2 bg-white/20 rounded-full"></div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter uppercase leading-[0.9]">
              Elite Survey <span className="text-orange-500">Solutions</span>
            </h1>
            <p className="text-slate-300 mb-12 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              Ghana's premier professional marketplace for high-precision geospatial equipment. Trusted by thousands of engineers nationwide.
            </p>
            
            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <button 
                onClick={() => handleQuickAction(TransactionType.RENTAL)}
                className={`w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-2xl ${activeTxType === TransactionType.RENTAL ? 'bg-orange-500 text-white shadow-orange-500/20' : 'bg-white text-[#1a2332] hover:bg-orange-50'}`}
              >
                <Calendar size={20} /> Rent a Gear
              </button>
              <button 
                onClick={() => handleQuickAction(TransactionType.SALE)}
                className={`w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-2xl ${activeTxType === TransactionType.SALE ? 'bg-orange-500 text-white shadow-orange-500/20' : 'bg-white text-[#1a2332] hover:bg-orange-50'}`}
              >
                <ShoppingCart size={20} /> Buy a Gear
              </button>
              {activeTxType !== 'All' && (
                <button 
                  onClick={() => setActiveTxType('All')}
                  className="text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors underline underline-offset-4"
                >
                  View All
                </button>
              )}
            </div>

            {/* Integrated Search Bar */}
            <form onSubmit={handleSearch} className="relative group max-w-3xl mx-auto">
              <input
                type="text"
                placeholder="Search by model, brand, or location..."
                className="w-full pl-14 pr-40 py-6 bg-white border-none rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] focus:ring-4 focus:ring-orange-500/30 outline-none transition-all text-lg md:text-xl font-bold text-[#1a2332]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#1a2332]">
                <Search size={24} strokeWidth={2.5} />
              </div>
              <button 
                type="submit"
                className="absolute right-3 top-3 bottom-3 bg-[#1a2332] text-white px-8 rounded-full font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 active:scale-95"
              >
                {isSmartSearchLoading ? (
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : <Zap size={18} fill="white" />}
                Find Gear
              </button>
            </form>
            <p className="mt-6 text-[10px] text-slate-400 italic flex items-center justify-center gap-1 font-black uppercase tracking-[0.2em]">
              <Zap size={12} fill="currentColor" className="text-orange-500" /> Professional AI Search Assistant Active
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div id="listings-results" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 space-y-10">
            <div>
              <h3 className="text-xs font-black text-[#1a2332] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Filter size={16} className="text-orange-500" /> Equipment Category
              </h3>
              <div className="space-y-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all font-bold ${
                      activeCategory === cat ? 'bg-orange-500 text-white shadow-md shadow-orange-100' : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 bg-[#1a2332] rounded-[2rem] text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="text-xs font-black uppercase tracking-widest mb-2 text-orange-400">Pro Tip</h4>
                <p className="text-[10px] font-bold text-slate-300 leading-relaxed uppercase tracking-tighter">
                  Verified sellers with 4.5+ ratings are more likely to offer reliable calibration certificates.
                </p>
              </div>
              <Compass className="absolute bottom-[-10px] right-[-10px] opacity-10 text-white" size={64} />
            </div>
          </aside>

          {/* Listings Grid */}
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-8">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                {activeTxType !== 'All' ? `${activeTxType} Listings` : 'All Inventory'} ({listings.length})
              </p>
              <button className="flex items-center gap-2 text-xs font-black text-[#1a2332] bg-white px-5 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 uppercase tracking-wider transition-all">
                <SlidersHorizontal size={14} /> Sort: Newest
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {listings.map(item => (
                <Link 
                  key={item.id} 
                  to={`/listing/${item.id}`}
                  className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-300 overflow-hidden flex flex-col"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img 
                      src={item.images[0]} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {item.transactionType === TransactionType.BOTH ? (
                        <span className="bg-orange-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">Sale & Rental</span>
                      ) : (
                        <span className="bg-[#1a2332] text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">{item.transactionType}</span>
                      )}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-1 text-[9px] font-black text-orange-600 uppercase tracking-[0.15em] mb-2">
                      {item.category} • {item.condition}
                    </div>
                    <h3 className="text-base font-extrabold text-[#1a2332] line-clamp-2 mb-3 leading-snug group-hover:text-orange-500 transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mb-6">
                      <MapPin size={12} className="text-orange-400" /> {item.location}
                    </div>
                    
                    <div className="mt-auto pt-5 border-t border-slate-50 flex items-center justify-between">
                      <div>
                        {item.salePrice && (
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Purchase: <span className="text-[#1a2332] text-sm font-black">${item.salePrice.toLocaleString()}</span></div>
                        )}
                        {item.rentalPriceDaily && (
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Rent: <span className="text-orange-600 text-sm font-black">${item.rentalPriceDaily}</span>/day</div>
                        )}
                      </div>
                      <div className="w-10 h-10 bg-slate-50 flex items-center justify-center rounded-2xl text-[#1a2332] group-hover:bg-orange-500 group-hover:text-white transition-all shadow-inner">
                        <Zap size={18} fill="currentColor" strokeWidth={1} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {listings.length === 0 && (
              <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                <Compass size={48} className="mx-auto text-slate-200 mb-6" />
                <p className="text-slate-400 font-bold uppercase tracking-widest">No matching equipment found</p>
                <button onClick={() => { setSearchQuery(''); setActiveCategory('All'); setActiveTxType('All'); }} className="mt-6 text-orange-500 font-black text-sm uppercase hover:underline">Reset Filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingBrowser;
