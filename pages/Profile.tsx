import React, { useState } from 'react';
import { User as UserIcon, Mail, MapPin, Shield, Camera, Save, ArrowLeft, Star, Award, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { User } from '../types.ts';

interface ProfileProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    location: 'Accra, Ghana',
    bio: 'Professional Surveyor with over 10 years of experience.',
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
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#1a2332] font-black text-[10px] uppercase tracking-[0.2em] mb-12">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="bg-white rounded-[3.5rem] shadow-xl overflow-hidden border border-slate-50 p-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-black text-[#1a2332] uppercase tracking-tighter">{user.name}</h1>
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="bg-[#1a2332] text-white px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl"
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>

        <div className="space-y-8">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Email</label>
            <input 
              type="email" 
              disabled={!isEditing}
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold text-[#1a2332] outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Location</label>
            <input 
              type="text" 
              disabled={!isEditing}
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold text-[#1a2332] outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;