
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, MapPin, ShieldCheck, Calendar, DollarSign, MessageCircle, Share2, Info, ChevronRight, Check, Star, ShieldAlert } from 'lucide-react';
import { MOCK_LISTINGS, MOCK_USERS } from '../constants.tsx';
import { TransactionType } from '../types';

const ListingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const item = MOCK_LISTINGS.find(l => l.id === id);
  const seller = MOCK_USERS.find(u => u.id === item?.sellerId);
  const [activeTab, setActiveTab] = useState<'buy' | 'rent'>('buy');
  const [bookingDays, setBookingDays] = useState(3);

  if (!item) return <div className="p-20 text-center">Listing not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/" className="inline-flex items-center gap-2 text-[#1a2332] text-xs font-black uppercase tracking-widest hover:text-orange-500 mb-10 transition-colors">
        <ChevronLeft size={16} /> Back to Listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Images and Info */}
        <div className="lg:col-span-2 space-y-12">
          {/* Gallery */}
          <div className="rounded-[3rem] overflow-hidden shadow-2xl bg-slate-100 relative group aspect-[16/10]">
            <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          <div className="bg-white rounded-[3rem] p-10 border border-slate-50 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
              <div className="flex-grow">
                <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-700 text-[10px] font-black rounded-full uppercase tracking-[0.2em] mb-4">{item.category}</span>
                <h1 className="text-4xl font-black text-[#1a2332] leading-[1.1] mb-4 uppercase tracking-tighter">{item.title}</h1>
                <div className="flex flex-wrap items-center gap-6 text-slate-400 text-sm font-bold uppercase tracking-wider">
                  <div className="flex items-center gap-2"><MapPin size={16} className="text-orange-500" /> {item.location}</div>
                  <div className="flex items-center gap-2 text-emerald-600"><Check size={16} /> Verified Quality: {item.condition}</div>
                </div>
              </div>
              <button className="p-4 text-slate-400 hover:text-orange-500 transition-colors border-2 border-slate-50 rounded-[1.5rem]"><Share2 size={24} /></button>
            </div>

            <div className="prose prose-slate max-w-none mt-10">
              <h3 className="text-lg font-black text-[#1a2332] mb-4 uppercase tracking-widest">About this equipment</h3>
              <p className="text-slate-600 leading-relaxed text-lg">{item.description}</p>
            </div>

            <div className="mt-14 pt-10 border-t border-slate-100">
              <h3 className="text-lg font-black text-[#1a2332] mb-8 flex items-center gap-3 uppercase tracking-widest">
                <Info size={22} className="text-orange-500" /> Tech Specifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(item.specs).map(([key, value]) => (
                  <div key={key} className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 hover:border-orange-200 transition-colors">
                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2">{key}</div>
                    <div className="text-base font-black text-[#1a2332]">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Actions and Pricing */}
        <div className="space-y-8">
          <div className="bg-white rounded-[3rem] p-8 border border-slate-50 shadow-2xl sticky top-28">
            <div className="flex gap-3 p-1.5 bg-slate-50 rounded-[1.5rem] mb-8">
              {item.salePrice && (
                <button 
                  onClick={() => setActiveTab('buy')}
                  className={`flex-1 py-4 text-xs font-black rounded-2xl transition-all uppercase tracking-widest ${activeTab === 'buy' ? 'bg-[#1a2332] text-white shadow-xl' : 'text-slate-500 hover:text-[#1a2332]'}`}
                >
                  Purchase
                </button>
              )}
              {item.rentalPriceDaily && (
                <button 
                  onClick={() => setActiveTab('rent')}
                  className={`flex-1 py-4 text-xs font-black rounded-2xl transition-all uppercase tracking-widest ${activeTab === 'rent' ? 'bg-orange-500 text-white shadow-xl shadow-orange-100' : 'text-slate-500 hover:text-orange-500'}`}
                >
                  Lease/Rent
                </button>
              )}
            </div>

            {activeTab === 'buy' ? (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="flex flex-col">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Sale Price</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-[#1a2332] tracking-tighter">${item.salePrice?.toLocaleString()}</span>
                    <span className="text-slate-400 font-bold">USD</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <button className="w-full bg-[#1a2332] text-white py-5 rounded-3xl font-black text-lg hover:bg-slate-800 transition-all shadow-xl active:scale-[0.98] uppercase tracking-tighter">
                    Buy Equipment
                  </button>
                  <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                    <ShieldCheck size={14} className="text-emerald-500" /> Survey Store Secure Escrow
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="flex flex-col">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Daily Rate</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-orange-600 tracking-tighter">${item.rentalPriceDaily}</span>
                    <span className="text-slate-400 font-bold">/ day</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-4">Duration Select</label>
                  <input 
                    type="range" min="1" max="30" value={bookingDays} 
                    onChange={(e) => setBookingDays(parseInt(e.target.value))}
                    className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-orange-500"
                  />
                  <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                    <span>1 Day</span>
                    <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-md">{bookingDays} Days</span>
                    <span>30 Days</span>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-bold uppercase tracking-tighter">${item.rentalPriceDaily} x {bookingDays} days</span>
                    <span className="text-[#1a2332] font-black">${(item.rentalPriceDaily! * bookingDays).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-bold uppercase tracking-tighter">Service Fee</span>
                    <span className="text-[#1a2332] font-black">$25.00</span>
                  </div>
                  <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                    <span className="text-[#1a2332] font-black uppercase tracking-tighter">Estimate Total</span>
                    <span className="text-2xl font-black text-orange-600 tracking-tighter">${(item.rentalPriceDaily! * bookingDays + 25).toLocaleString()}</span>
                  </div>
                </div>

                <button className="w-full bg-orange-500 text-white py-5 rounded-3xl font-black text-lg hover:bg-orange-600 transition-all shadow-xl shadow-orange-100 active:scale-[0.98] uppercase tracking-tighter">
                  Request Rental
                </button>
              </div>
            )}

            <hr className="my-8 border-slate-100" />

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden border-2 border-white shadow-sm">
                <img src={seller?.avatar} alt={seller?.name} />
              </div>
              <div className="flex-grow">
                <div className="text-sm font-black text-[#1a2332] uppercase tracking-tighter">{seller?.name}</div>
                <div className="flex items-center gap-1.5 text-orange-500 text-xs font-black">
                  <Star size={14} fill="currentColor" /> {seller?.rating} <span className="text-slate-300 mx-1">•</span> {seller?.totalTransactions} Deals
                </div>
              </div>
              <button className="p-3.5 text-[#1a2332] hover:bg-[#1a2332] hover:text-white transition-all bg-slate-50 rounded-2xl shadow-inner">
                <MessageCircle size={20} />
              </button>
            </div>
          </div>

          <div className="bg-[#1a2332] rounded-[2.5rem] p-8 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 text-white font-black uppercase tracking-widest text-sm">
              <ShieldCheck size={28} className="text-orange-500" /> Buyer Protection
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-bold uppercase tracking-tighter">
              Funds are held safely in the Survey Store Ghana escrow account until you confirm delivery and testing. 100% money-back guarantee for faulty equipment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
