
import React, { useState } from 'react';
import { User as UserIcon, Mail, MapPin, Shield, Camera, Save, ArrowLeft, Star, Award, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { User } from '../types';

interface ProfileProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    location: 'Accra, Ghana', // Defaulting for demo
    bio: 'Professional Surveyor with over 10 years of experience in high-precision engineering and land documentation.',
  });

  const handleSave = () => {
    onUpdateUser({
      ...user,
      name: formData.name,
      email: formData.email,
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#1a2332] font-black text-[10px] uppercase tracking-[0.2em] mb-12 transition-colors">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="bg-white rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-50">
        {/* Header/Cover */}
        <div className="h-48 bg-gradient-to-r from-[#1a2332] via-[#253147] to-orange-500/20 relative">
          <div className="absolute -bottom-16 left-12">
            <div className="relative group">
              <div className="w-32 h-32 rounded-[2.5rem] bg-white p-1.5 shadow-2xl overflow-hidden border border-slate-100">
                <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} alt={user.name} className="w-full h-full object-cover rounded-[2rem]" />
              </div>
              <button className="absolute bottom-2 right-2 p-2.5 bg-orange-500 text-white rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all">
                <Camera size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-20 px-12 pb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-3xl font-black text-[#1a2332] uppercase tracking-tighter flex items-center gap-3">
                {user.name}
                {user.role === 'seller' && <ShieldCheck size={24} className="text-orange-500" />}
              </h1>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1">
                {user.role} • Verified Professional Since 2021
              </p>
            </div>
            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="flex items-center gap-3 px-8 py-3.5 bg-[#1a2332] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all active:scale-95"
            >
              {isEditing ? <><Save size={16} /> Save Profile</> : <UserIcon size={16} />} 
              {isEditing ? '' : 'Edit Profile'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-10">
              <div className="space-y-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Full Name</label>
                    <input 
                      type="text" 
                      disabled={!isEditing}
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className={`w-full px-6 py-4 rounded-2xl font-bold text-[#1a2332] outline-none transition-all ${isEditing ? 'bg-slate-50 border-2 border-slate-100 focus:border-orange-500' : 'bg-transparent border-2 border-transparent pl-0'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Email Address</label>
                    <input 
                      type="email" 
                      disabled={!isEditing}
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className={`w-full px-6 py-4 rounded-2xl font-bold text-[#1a2332] outline-none transition-all ${isEditing ? 'bg-slate-50 border-2 border-slate-100 focus:border-orange-500' : 'bg-transparent border-2 border-transparent pl-0'}`}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Primary Location</label>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-orange-500" />
                      <input 
                        type="text" 
                        disabled={!isEditing}
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className={`flex-grow px-6 py-4 rounded-2xl font-bold text-[#1a2332] outline-none transition-all ${isEditing ? 'bg-slate-50 border-2 border-slate-100 focus:border-orange-500' : 'bg-transparent border-2 border-transparent pl-0'}`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Professional Bio</h3>
                <textarea 
                  disabled={!isEditing}
                  value={formData.bio}
                  rows={4}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className={`w-full px-6 py-4 rounded-2xl font-medium text-slate-600 leading-relaxed outline-none transition-all ${isEditing ? 'bg-slate-50 border-2 border-slate-100 focus:border-orange-500' : 'bg-transparent border-2 border-transparent pl-0'}`}
                />
              </div>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-8">
              <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Market Standing</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-orange-500 shadow-sm">
                        <Star size={20} fill="currentColor" />
                      </div>
                      <span className="text-xs font-black text-[#1a2332] uppercase tracking-tighter">Rating</span>
                    </div>
                    <span className="text-lg font-black text-[#1a2332]">{user.rating} / 5.0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-teal-500 shadow-sm">
                        <Award size={20} />
                      </div>
                      <span className="text-xs font-black text-[#1a2332] uppercase tracking-tighter">Deals Done</span>
                    </div>
                    <span className="text-lg font-black text-[#1a2332]">{user.totalTransactions}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#1a2332] rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                <Shield className="absolute bottom-[-20px] right-[-20px] w-32 h-32 opacity-10 text-white group-hover:scale-110 transition-transform duration-700" />
                <div className="relative z-10">
                  <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 text-orange-400">Security Level</h4>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-[85%] bg-orange-500 rounded-full"></div>
                    </div>
                    <span className="text-[10px] font-black">85%</span>
                  </div>
                  <p className="text-[9px] font-bold text-slate-400 leading-relaxed uppercase tracking-tighter">
                    Enable 2FA to reach 100% and gain the "Trusted Partner" badge.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
