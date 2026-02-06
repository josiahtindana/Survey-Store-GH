import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, MapPin, ShieldCheck, Calendar, DollarSign, MessageCircle, Share2, Info, ChevronRight, Check, Star, ShieldAlert } from 'lucide-react';
import { MOCK_LISTINGS, MOCK_USERS } from '../constants.tsx';
import { TransactionType } from '../types.ts';

const ListingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const item = MOCK_LISTINGS.find(l => l.id === id);
  const seller = MOCK_USERS.find(u => u.id === item?.sellerId);
  const [activeTab, setActiveTab] = useState<'buy' | 'rent'>('buy');
  const [bookingDays, setBookingDays] = useState(3);

  if (!item) return <div className="p-20 text-center text-slate-400 font-black uppercase">Listing not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/" className="inline-flex items-center gap-2 text-[#1a2332] text-xs font-black uppercase tracking-widest hover:text-orange-500 mb-10 transition-colors">
        <ChevronLeft size={16} /> Back to Listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <div className="rounded-[3rem] overflow-hidden shadow-2xl bg-slate-100 relative group aspect-[16/10]">
            <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
          </div>

          <div className="bg-white rounded-[3rem] p-10 border border-slate-50 shadow-sm">
            <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-700 text-[10px] font-black rounded-full uppercase tracking-[0.2em] mb-4">{item.category}</span>
            <h1 className="text-4xl font-black text-[#1a2332] leading-[1.1] mb-4 uppercase tracking-tighter">{item.title}</h1>
            <p className="text-slate-600 leading-relaxed text-lg mb-10">{item.description}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(item.specs).map(([key, value]) => (
                <div key={key} className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2">{key}</div>
                  <div className="text-base font-black text-[#1a2332]">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-[3rem] p-8 border border-slate-50 shadow-2xl sticky top-28">
            <div className="flex flex-col">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Price</span>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-[#1a2332] tracking-tighter">${(item.salePrice || item.rentalPriceDaily)?.toLocaleString()}</span>
                <span className="text-slate-400 font-bold uppercase">{item.salePrice ? 'USD' : '/ day'}</span>
              </div>
            </div>
            <button className="w-full bg-[#1a2332] text-white py-5 mt-8 rounded-3xl font-black text-lg hover:bg-slate-800 transition-all shadow-xl active:scale-[0.98] uppercase tracking-tighter">
              Inquire Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;