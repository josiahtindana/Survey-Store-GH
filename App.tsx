import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Loader2, Lock, Mail } from 'lucide-react';

import { supabase } from './supabase.ts';
import Layout from './components/Layout.tsx';
import ListingBrowser from './pages/ListingBrowser.tsx';
import ListingDetails from './pages/ListingDetails.tsx';
import CreateListing from './pages/CreateListing.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Profile from './pages/Profile.tsx';

const AuthPage = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password, 
          options: { data: { full_name: fullName } } 
        });
        if (error) throw error;
        alert('Success! Check your email for verification.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/dashboard');
      }
    } catch (err: any) { 
      setError(err.message); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="py-20 flex justify-center px-4 bg-slate-50 min-h-[80vh]">
       <div className="bg-white p-10 md:p-16 rounded-[4rem] shadow-2xl border border-slate-50 max-w-lg w-full">
          <div className="text-center mb-12">
             <div className="inline-flex items-center justify-center p-6 bg-orange-50 text-orange-500 rounded-[2rem] mb-8 shadow-inner">
                <Lock size={32} />
             </div>
             <h2 className="text-3xl font-black uppercase tracking-tighter text-[#1a2332]">
                {mode === 'login' ? 'Welcome Back' : 'Create Profile'}
             </h2>
          </div>
          <form onSubmit={handleAuth} className="space-y-6">
             {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest">{error}</div>}
             {mode === 'signup' && (
               <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-2">Full Name</label>
                  <input type="text" placeholder="John Doe" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full px-8 py-5 bg-slate-50 rounded-2xl font-black text-[#1a2332] outline-none border-2 border-transparent focus:border-orange-500 transition-all" required />
               </div>
             )}
             <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-2">Work Email</label>
                <div className="relative">
                   <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                   <input type="email" placeholder="pro@survey.gh" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-16 pr-8 py-5 bg-slate-50 rounded-2xl font-black text-[#1a2332] outline-none border-2 border-transparent focus:border-orange-500 transition-all" required />
                </div>
             </div>
             <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-2">Passcode</label>
                <div className="relative">
                   <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                   <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-16 pr-8 py-5 bg-slate-50 rounded-2xl font-black text-[#1a2332] outline-none border-2 border-transparent focus:border-orange-500 transition-all" required />
                </div>
             </div>
             <button type="submit" disabled={loading} className="w-full bg-[#1a2332] text-white py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-orange-600 transition-all flex items-center justify-center gap-4">
                {loading ? <Loader2 className="animate-spin" /> : (mode === 'login' ? 'Access Portal' : 'Register Profile')}
             </button>
          </form>
          <div className="mt-12 text-center">
             <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-[10px] font-black text-orange-500 uppercase tracking-widest hover:underline decoration-2 underline-offset-8 transition-all">
                {mode === 'login' ? "New Professional? Join Marketplace" : "Existing Member? Access Dashboard"}
             </button>
          </div>
       </div>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (id: string) => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
      if (!error) setProfile(data);
    } catch (e) {
      console.error("Error fetching profile:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleProfileUpdate = () => {
    if (user) fetchProfile(user.id);
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1a2332]">
       <div className="text-orange-500 animate-spin mb-8"><Loader2 size={64}/></div>
       <div className="text-white font-black uppercase tracking-[0.4em] text-xs">Supabase Secure Handshake...</div>
    </div>
  );

  return (
    <HashRouter>
      <Layout user={user} profile={profile} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<ListingBrowser />} />
          <Route path="/listing/:id" element={<ListingDetails />} />
          <Route 
            path="/list-equipment" 
            element={user ? <CreateListing user={user} profile={profile} /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard user={user} profile={profile} /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/profile" 
            element={user ? <Profile user={user} profile={profile} onUpdateUser={handleProfileUpdate} /> : <Navigate to="/auth" />} 
          />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;