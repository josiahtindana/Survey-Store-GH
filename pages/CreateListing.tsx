
import React, { useState } from 'react';
import { Camera, Upload, Zap, DollarSign, MapPin, CheckCircle, Info, Loader2, Calendar, ShieldCheck } from 'lucide-react';
import { analyzeEquipmentImage } from '../geminiService';
import { EquipmentCategory, Condition, TransactionType } from '../types';

const CreateListing: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    salePrice: '',
    rentalPrice: '',
    location: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(',')[1];
        setImagePreview(reader.result as string);
        
        setLoading(true);
        const analysis = await analyzeEquipmentImage(base64);
        setLoading(false);

        if (analysis) {
          setFormData({
            ...formData,
            title: analysis.title || '',
            description: analysis.description || '',
            category: analysis.category || '',
            condition: analysis.condition || '',
            salePrice: analysis.suggestedSalePrice?.toString() || '',
            rentalPrice: analysis.suggestedRentalDaily?.toString() || '',
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black text-[#1a2332] mb-3 uppercase tracking-tighter">List Your Equipment</h1>
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Fast AI analysis • Ghana-wide exposure • Secure sales</p>
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-50 flex flex-col md:flex-row min-h-[600px]">
        {/* Upload Section */}
        <div className="md:w-2/5 bg-slate-50/50 p-10 border-b md:border-b-0 md:border-r border-slate-100">
          <label className="block h-full">
            <div className={`h-full min-h-[350px] border-4 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center p-8 transition-all cursor-pointer ${imagePreview ? 'border-orange-500 bg-orange-50/20' : 'border-slate-200 hover:border-orange-300 hover:bg-white bg-white/50'}`}>
              {imagePreview ? (
                <div className="relative w-full h-full shadow-2xl rounded-3xl overflow-hidden">
                  <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <p className="text-white text-[10px] font-black uppercase tracking-widest">Update Photo</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-20 h-20 bg-white rounded-3xl shadow-lg flex items-center justify-center text-slate-400 mb-6 group-hover:text-orange-500 transition-colors">
                    <Camera size={40} strokeWidth={1.5} />
                  </div>
                  <p className="text-sm font-black text-[#1a2332] mb-2 uppercase tracking-tighter">Snap or Upload Gear</p>
                  <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-widest max-w-[160px]">AI will extract model details automatically</p>
                </>
              )}
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>
        </div>

        {/* Form Section */}
        <div className="md:w-3/5 p-12 space-y-8">
          {loading && (
            <div className="flex items-center gap-4 p-5 bg-orange-50 text-orange-700 rounded-3xl border border-orange-100 animate-pulse">
              <Loader2 className="animate-spin" size={20} />
              <span className="text-xs font-black uppercase tracking-widest">Survey AI is analyzing specs...</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="col-span-full">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Professional Title</label>
              <input 
                type="text" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="Model, Brand, Year"
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none font-black text-[#1a2332] tracking-tighter transition-all" 
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Category</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none font-bold text-[#1a2332] appearance-none"
              >
                <option value="">Choose Type</option>
                {Object.values(EquipmentCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Gear Condition</label>
              <select 
                value={formData.condition}
                onChange={e => setFormData({...formData, condition: e.target.value})}
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none font-bold text-[#1a2332] appearance-none"
              >
                <option value="">Select Condition</option>
                {Object.values(Condition).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="col-span-full">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Technical Description</label>
              <textarea 
                rows={4}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none font-medium text-[#1a2332] transition-all"
                placeholder="List features, accessories, and maintenance history..."
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Sale Price ($)</label>
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 font-black">$</div>
                <input 
                  type="number" 
                  value={formData.salePrice}
                  onChange={e => setFormData({...formData, salePrice: e.target.value})}
                  className="w-full pl-10 pr-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none font-black text-[#1a2332] tracking-tighter" 
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Rental ($/day)</label>
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"><Calendar size={18}/></div>
                <input 
                  type="number" 
                  value={formData.rentalPrice}
                  onChange={e => setFormData({...formData, rentalPrice: e.target.value})}
                  className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none font-black text-[#1a2332] tracking-tighter" 
                />
              </div>
            </div>

            <div className="col-span-full pt-6">
              <button className="w-full bg-[#1a2332] text-white py-5 rounded-[1.5rem] font-black text-xl hover:bg-slate-800 transition-all shadow-2xl active:scale-[0.98] uppercase tracking-tighter">
                Confirm Listing
              </button>
              <div className="flex items-center justify-center gap-2 mt-6 text-[9px] text-slate-400 font-black uppercase tracking-[0.1em]">
                {/* Corrected: Added missing ShieldCheck import to lucide-react */}
                <ShieldCheck size={14} className="text-orange-500" /> Professional verification process included
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateListing;
