import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ListingBrowser from './pages/ListingBrowser';
import ListingDetails from './pages/ListingDetails';
import CreateListing from './pages/CreateListing';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import { MOCK_USERS } from './constants';
import { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(MOCK_USERS[0]); // Defaulting to James Survey for demo purposes

  const handleLogout = () => {
    setUser(null);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <HashRouter>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<ListingBrowser />} />
          <Route path="/listing/:id" element={<ListingDetails />} />
          <Route 
            path="/list-equipment" 
            element={user ? <CreateListing /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/profile" 
            element={user ? <Profile user={user} onUpdateUser={handleUpdateUser} /> : <Navigate to="/auth" />} 
          />
          <Route path="/auth" element={
            <div className="flex items-center justify-center min-h-[75vh] px-4">
              <div className="bg-white p-12 md:p-16 rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] border border-slate-50 max-w-lg w-full text-center">
                <div className="inline-flex items-center justify-center p-4 bg-slate-50 rounded-3xl mb-8">
                  <div className="text-[#1a2332]">
                    <div className="relative">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-bag"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                      <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-md">
                        <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                           <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter text-[#1a2332]">Welcome Back</h2>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-10">Sign in to Survey Store Ghana</p>
                <div className="space-y-4">
                  <button 
                    onClick={() => setUser(MOCK_USERS[0])}
                    className="w-full bg-[#1a2332] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-xl active:scale-[0.98]"
                  >
                    James Survey (Seller Profile)
                  </button>
                  <button 
                    onClick={() => setUser(MOCK_USERS[1])}
                    className="w-full border-2 border-slate-100 text-[#1a2332] py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all active:scale-[0.98]"
                  >
                    Sarah Eng (Buyer Profile)
                  </button>
                </div>
                <p className="mt-8 text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Ghana's Professional Geospatial Hub</p>
              </div>
            </div>
          } />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;