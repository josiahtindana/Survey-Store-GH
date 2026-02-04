
import React from 'react';
import { Settings, Package, Calendar, MessageSquare, ArrowUpRight, CheckCircle2, Clock, Landmark } from 'lucide-react';
import { MOCK_LISTINGS } from '../constants.tsx';

const Dashboard: React.FC = () => {
  const myListings = MOCK_LISTINGS.slice(0, 2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-[#1a2332] uppercase tracking-tighter">Account Dashboard</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">Manage your inventory and transactions in Ghana</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 border-2 border-slate-100 rounded-2xl text-xs font-black text-slate-700 hover:bg-slate-50 flex items-center gap-2 uppercase tracking-widest transition-all">
            <Settings size={16} /> Settings
          </button>
          <button className="px-6 py-3 bg-[#1a2332] text-white rounded-2xl text-xs font-black hover:bg-slate-800 flex items-center gap-2 shadow-xl shadow-slate-200 uppercase tracking-widest transition-all active:scale-95">
            <Landmark size={16} /> Withdraw
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
          <div className="w-14 h-14 bg-slate-50 text-[#1a2332] rounded-2xl flex items-center justify-center group-hover:bg-[#1a2332] group-hover:text-white transition-all">
            <Package size={28} />
          </div>
          <div>
            <div className="text-3xl font-black text-[#1a2332] tracking-tighter">08</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Gear</div>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
          <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all">
            <Calendar size={28} />
          </div>
          <div>
            <div className="text-3xl font-black text-[#1a2332] tracking-tighter">03</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Rentals</div>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
            <ArrowUpRight size={28} />
          </div>
          <div>
            <div className="text-3xl font-black text-[#1a2332] tracking-tighter">GH₵ 52k</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Revenue</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Recent Activity */}
        <section>
          <h2 className="text-xl font-black text-[#1a2332] mb-8 uppercase tracking-widest flex items-center gap-3">
            <Clock size={20} className="text-orange-500" /> Order Requests
          </h2>
          <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-50">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-8 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden shadow-inner">
                      <img src={`https://picsum.photos/seed/${i + 10}/100`} alt="Listing" className="object-cover w-full h-full" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-[#1a2332] uppercase tracking-tighter">Trimble R12 Rental</h4>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Mark Mensah • 5 Days • GH₵ 12,000</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-orange-500 text-white text-[10px] font-black rounded-xl hover:bg-orange-600 uppercase tracking-widest active:scale-95 transition-all">Accept</button>
                    <button className="px-4 py-2 border-2 border-slate-100 text-slate-400 text-[10px] font-black rounded-xl hover:bg-slate-50 uppercase tracking-widest transition-all">Ignore</button>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-5 text-[10px] font-black text-orange-500 hover:bg-slate-50 border-t border-slate-50 uppercase tracking-[0.2em]">Show History</button>
          </div>
        </section>

        {/* My Equipment */}
        <section>
          <h2 className="text-xl font-black text-[#1a2332] mb-8 uppercase tracking-widest flex items-center gap-3">
            <Package size={20} className="text-orange-500" /> Inventory List
          </h2>
          <div className="grid grid-cols-1 gap-6">
            {myListings.map(item => (
              <div key={item.id} className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm flex items-center gap-6 group hover:shadow-lg transition-all">
                <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 shadow-inner">
                  <img src={item.images[0]} alt={item.title} className="object-cover w-full h-full" />
                </div>
                <div className="flex-grow">
                  <h4 className="text-sm font-black text-[#1a2332] line-clamp-1 uppercase tracking-tighter">{item.title}</h4>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-[9px] text-emerald-600 font-black uppercase tracking-widest"><CheckCircle2 size={12}/> Listed</div>
                    <div className="text-[9px] text-slate-300 font-black uppercase tracking-widest">UID: {item.id.toUpperCase()}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-[#1a2332] tracking-tighter">${item.salePrice || item.rentalPriceDaily}</div>
                  <button className="text-[9px] font-black text-orange-500 uppercase tracking-widest hover:underline mt-1">Modify</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
