
import React, { useState } from 'react';
import { Camera, Zap, Loader2, Calendar, ShieldCheck, Info, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { analyzeEquipmentImage } from '../geminiService';
import { EquipmentCategory, Condition } from '../types';

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
  const [isSuccess, setIsSuccess] = useState(false);

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

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto px-4 py-32 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-4xl font-black text-[#1a2332] uppercase tracking-tighter mb-4">Listing Live!</h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-10">Your equipment is now being seen by thousands of engineers across Ghana.</p>
        <Link to="/dashboard" className="inline-block bg-[#1a2332] text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-slate-800 transition-all active:scale-95">Go to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#1a2332] font-black text-[10px] uppercase tracking-[0.2em] mb-12 transition-colors">
        <ArrowLeft size={16} /> Back to Market
      </Link>

      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-[#1a2332] mb-4 uppercase tracking-tighter">Post Your <span className="text-orange-500">Inventory</span></h1>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Ghana's largest network for professional geospatial gear</p>
      </div>

      <div className="bg-white rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-50 flex flex-col lg:flex-row min-h-[700px]">
        {/* Upload Side */}
        <div className="lg:w-[40%] bg-slate-50/50 p-12 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col">
          <div className="mb-8">
            <h3 className="text-xs font-black text-[#1a2332] uppercase tracking-[0.2em] mb-2">1. Visual Proof</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed">High resolution photos attract 4x more buyers</p>
          </div>
          
          <label className="block flex-grow cursor-pointer group">
            <div className={`h-full min-h-[350px] border-4 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center p-10 transition-all ${imagePreview ? 'border-orange-500 bg-orange-50/10' : 'border-slate-200 hover:border-orange-300 hover:bg-white bg-white/50'}`}>
              {imagePreview ? (
                <div className="relative w-full h-full shadow-2xl rounded-3xl overflow-hidden aspect-square">
                  <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-[10px] font-black uppercase tracking-widest">Replace Image</p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-20 h-20 bg-white rounded-[2rem] shadow-xl flex items-center justify-center text-slate-300 mb-6 mx-auto group-hover:text-orange-500 group-hover:scale-110 transition-all">
                    <Camera size={36} strokeWidth={1.5} />
                  </div>
                  <p className="text-sm font-black text-[#1a2332] mb-2 uppercase tracking-tight">Drop Photo Here</p>
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest max-w-[140px] mx-auto leading-loose">Gemini AI will analyze your gear automatically</p>
                </div>
              )}
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>
        </div>

        {/* Form Side */}
        <div className="lg:w-[60%] p-12 lg:p-16 space-y-10">
          <div>
            <h3 className="text-xs font-black text-[#1a2332] uppercase tracking-[0.2em] mb-2">2. Gear Intelligence</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed">AI-suggested specs can be edited below</p>
          </div>

          {loading && (
            <div className="flex items-center gap-4 p-6 bg-orange-50 text-orange-700 rounded-3xl border border-orange-100 animate-pulse">
              <Loader2 className="animate-spin" size={20} />
              <div className="flex flex-col">
                 <span className="text-[10px] font-black uppercase tracking-[0.2em]">Scanning with Survey AI...</span>
                 <span className="text-[9px] font-bold opacity-70">Extracting precision specs and identifying model</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="col-span-full">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Model Title</label>
              <input 
                type="text" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. Leica TS16 P 1 inch"
                className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none font-black text-[#1a2332] tracking-tighter transition-all" 
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Category</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none font-bold text-[#1a2332] appearance-none"
              >
                <option value="">Type</option>
                {Object.values(EquipmentCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Calibration Status</label>
              <select 
                value={formData.condition}
                onChange={e => setFormData({...formData, condition: e.target.value})}
                className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none font-bold text-[#1a2332] appearance-none"
              >
                <option value="">Condition</option>
                {['New', 'Like New', 'Excellent', 'Good', 'Fair'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="col-span-full">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Detailed Specs</label>
              <textarea 
                rows={4}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none font-medium text-[#1a2332] transition-all"
                placeholder="Accessories, battery health, last calibration date..."
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Sale Price ($)</label>
              <input 
                type="number" 
                value={formData.salePrice}
                onChange={e => setFormData({...formData, salePrice: e.target.value})}
                className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none font-black text-[#1a2332] tracking-tighter" 
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Rental ($/day)</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={formData.rentalPrice}
                  onChange={e => setFormData({...formData, rentalPrice: e.target.value})}
                  className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none font-black text-[#1a2332] tracking-tighter" 
                />
              </div>
            </div>

            <div className="col-span-full pt-8">
              <button 
                onClick={() => setIsSuccess(true)}
                className="w-full bg-[#1a2332] text-white py-6 rounded-[2rem] font-black text-xl hover:bg-orange-600 transition-all shadow-2xl active:scale-95 uppercase tracking-tighter"
              >
                Launch Listing
              </button>
              <div className="flex items-center justify-center gap-2 mt-6 text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">
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
