import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Filter, MapPin, Zap, ShoppingCart, Calendar, ArrowRight, Loader2, ShieldCheck, Award, Compass, Cpu
} from 'lucide-react';
import { supabase } from '../App';
import { parseSmartSearch } from '../geminiService';

const BACKGROUND_VIDEOS = [
  "https://assets.mixkit.co/videos/preview/mixkit-engineer-working-with-a-tablet-and-measuring-tools-34531-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-top-view-of-a-construction-site-with-cranes-and-trucks-42410-large.mp4"
];

const BRANDS = ["Leica Geosystems", "Trimble", "Topcon", "Sokkia", "GeoMax", "Nikon", "Faro", "DJI Enterprise"];

const ListingBrowser: React.FC = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSmartSearchLoading, setIsSmartSearchLoading] = useState(false);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setListings(data);
    }
    setLoading(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.length > 5) {
      setIsSmartSearchLoading(true);
      const parsed = await parseSmartSearch(searchQuery);
      setIsSmartSearchLoading(false);
      // Logic for advanced filtering based on AI results would go here
      // For now, let's just use text search
    }
    // Perform simple search
    const { data } = await supabase
      .from('listings')
      .select('*')
      .ilike('title', `%${searchQuery}%`);
    if (data) setListings(data);
  };

  return (
    <div className="pb-20">
      <section className="relative h-[80vh] bg-[#1a2332] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-30">
            <source src={BACKGROUND_VIDEOS[0]} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a2332]/80 to-[#1a2332]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter uppercase leading-none">
            Survey Store <span className="text-orange-500">Ghana</span>
          </h1>
          <p className="text-slate-300 mb-12 text-lg font-medium max-w-2xl mx-auto uppercase tracking-widest">
            Verified Geospatial Hardware across West Africa
          </p>
          
          <form onSubmit={handleSearch} className="relative group max-w-3xl mx-auto">
            <input
              type="text"
              placeholder="Search equipment..."
              className="w-full pl-16 pr-44 py-7 bg-white rounded-[2.5rem] shadow-2xl focus:ring-8 focus:ring-orange-500/10 outline-none font-black text-xl text-[#1a2332]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-4 top-4 bottom-4 bg-[#1a2332] text-white px-10 rounded-full font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all flex items-center gap-2">
              {isSmartSearchLoading ? <Loader2 className="animate-spin" /> : <Zap size={20} fill="currentColor" />}
              Smart Find
            </button>
          </form>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 mt-20">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[1,2,3].map(i => <div key={i} className="bg-slate-100 rounded-[3rem] aspect-[4/5] animate-pulse"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {listings.map(item => (
              <Link key={item.id} to={`/listing/${item.id}`} className="group bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:translate-y-[-8px] transition-all">
                <div className="aspect-[4/3] bg-slate-50 relative overflow-hidden">
                   <img src={item.images?.[0] || 'https://via.placeholder.com/400'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                   <div className="absolute top-6 left-6 bg-[#1a2332]/80 backdrop-blur-md text-white text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest">{item.transaction_type}</div>
                </div>
                <div className="p-10">
                   <span className="text-[10px] font-black uppercase text-orange-500 tracking-widest">{item.category}</span>
                   <h3 className="text-xl font-black text-[#1a2332] mt-3 uppercase tracking-tight group-hover:text-orange-500 transition-colors line-clamp-2">{item.title}</h3>
                   <div className="mt-8 pt-8 border-t border-slate-50 flex justify-between items-center">
                      <span className="text-2xl font-black text-[#1a2332] tracking-tighter">${(item.sale_price || item.rental_price_daily)?.toLocaleString()}</span>
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#1a2332] group-hover:bg-orange-500 group-hover:text-white transition-all"><ArrowRight size={20}/></div>
                   </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <section className="bg-[#1a2332] mt-32 py-24 px-4 overflow-hidden relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10">
          <div className="space-y-6">
            <div className="w-16 h-16 bg-orange-500/20 rounded-3xl flex items-center justify-center text-orange-500">
               <ShieldCheck size={32} />
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Verified Gear</h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">Every item listed on Survey Store Ghana undergoes manual verification for your peace of mind.</p>
          </div>
          <div className="space-y-6">
            <div className="w-16 h-16 bg-teal-500/20 rounded-3xl flex items-center justify-center text-teal-400">
               <Award size={32} />
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Secure Escrow</h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">Funds are only released once you confirm the equipment is in the described condition.</p>
          </div>
          <div className="space-y-6">
            <div className="w-16 h-16 bg-blue-500/20 rounded-3xl flex items-center justify-center text-blue-400">
               <Cpu size={32} />
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Pro Support</h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">Dedicated logistics and technical support for all high-precision geospatial hardware.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ListingBrowser;