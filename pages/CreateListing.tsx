import React, { useState } from 'react';
import { Camera, Zap, Loader2, ShieldCheck, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { analyzeEquipmentImage } from '../geminiService.ts';
import { EquipmentCategory, Condition } from '../types.ts';

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
      <div className="max-w-xl mx-auto px-4 py-32 text-center">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-4xl font-black text-[#1a2332] uppercase tracking-tighter mb-4">Listing Live!</h1>
        <Link to="/dashboard" className="inline-block bg-[#1a2332] text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl">Go to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#1a2332] font-black text-[10px] uppercase tracking-[0.2em] mb-12">
        <ArrowLeft size={16} /> Back to Market
      </Link>

      <div className="bg-white rounded-[3.5rem] shadow-xl overflow-hidden border border-slate-50 flex flex-col lg:flex-row">
        <div className="lg:w-[40%] bg-slate-50/50 p-12 border-r border-slate-100">
           <label className="block h-full cursor-pointer">
            <div className={`h-full min-h-[300px] border-4 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center p-10 transition-all ${imagePreview ? 'border-orange-500 bg-white' : 'border-slate-200'}`}>
              {imagePreview ? (
                <img src={imagePreview} className="w-full h-full object-cover rounded-3xl shadow-lg" alt="Preview" />
              ) : (
                <div className="text-center">
                  <Camera size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-sm font-black text-[#1a2332] uppercase tracking-tighter">Upload Photo</p>
                </div>
              )}
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>
        </div>

        <div className="lg:w-[60%] p-12 space-y-8">
          {loading && (
            <div className="flex items-center gap-4 p-4 bg-orange-50 text-orange-700 rounded-2xl border border-orange-100">
              <Loader2 className="animate-spin" size={20} />
              <span className="text-xs font-black uppercase tracking-widest">AI Scanning Gear...</span>
            </div>
          )}

          <div className="space-y-6">
            <input 
              type="text" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="Model Title"
              className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none font-black text-[#1a2332]" 
            />
            <textarea 
              rows={4}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none font-medium text-slate-600"
              placeholder="Technical Description"
            />
            <button 
              onClick={() => setIsSuccess(true)}
              className="w-full bg-[#1a2332] text-white py-6 rounded-[2rem] font-black text-xl hover:bg-orange-600 shadow-2xl uppercase tracking-tighter"
            >
              Post Listing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateListing;