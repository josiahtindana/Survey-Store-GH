
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, PlusSquare, User, Menu, X, ShoppingBag, Compass, Briefcase, MapPin } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: any;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Browse', path: '/', icon: <Search size={18} /> },
    { name: 'List Equipment', path: '/list-equipment', icon: <PlusSquare size={18} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <Briefcase size={18} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative flex items-center justify-center">
                <div className="text-[#1a2332] transform -translate-x-1 translate-y-[-2px]">
                  <ShoppingBag size={32} fill="currentColor" strokeWidth={1} />
                </div>
                <div className="absolute bottom-[-4px] right-[-6px] bg-white rounded-full p-0.5 border border-slate-100 shadow-sm">
                  <div className="relative w-6 h-6 rounded-full flex items-center justify-center overflow-hidden border border-slate-200">
                    <div className="absolute inset-0 bg-gradient-to-tr from-orange-400 via-red-500 to-teal-400 opacity-20"></div>
                    <Compass size={14} className="text-orange-600" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-extrabold tracking-tighter text-[#1a2332] uppercase">
                  Survey Store
                </span>
                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Ghana</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
                    location.pathname === link.path ? 'text-orange-600' : 'text-[#1a2332] hover:text-orange-500'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
              {user ? (
                <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                  <div className="flex flex-col items-end">
                    <Link to="/profile" className="text-xs font-bold text-slate-900 leading-tight hover:text-orange-500 transition-colors">{user.name}</Link>
                    <button onClick={onLogout} className="text-[10px] text-slate-400 hover:text-red-500 transition-colors uppercase tracking-wider font-bold">Log out</button>
                  </div>
                  <Link to="/profile" className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden hover:border-orange-500 transition-all">
                    <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} alt="User" />
                  </Link>
                </div>
              ) : (
                <Link to="/auth" className="bg-[#1a2332] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95">
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 p-4 space-y-4 shadow-xl animate-in slide-in-from-top duration-200">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 text-slate-700 font-bold"
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            {user && (
              <Link
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 text-slate-700 font-bold"
              >
                <User size={18} />
                My Profile
              </Link>
            )}
            {!user && (
              <Link
                to="/auth"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 p-3 rounded-lg bg-[#1a2332] text-white font-bold"
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#0f172a] text-slate-400 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <ShoppingBag size={24} className="text-white" fill="white" />
              <span className="text-white text-xl font-black tracking-tighter uppercase">Survey Store <span className="text-orange-500">Ghana</span></span>
            </div>
            <p className="text-sm leading-relaxed">The premier digital destination for professional surveying and geospatial technology in Ghana. We connect professionals with high-grade equipment.</p>
            <div className="mt-6 text-sm">
               <a href="https://surveystoregh.com" className="text-orange-500 font-bold hover:underline">surveystoregh.com</a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 text-xs uppercase tracking-[0.2em]">Marketplace</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-orange-400 transition-colors">Browse Equipment</Link></li>
              <li><Link to="/list-equipment" className="hover:text-orange-400 transition-colors">Sell Equipment</Link></li>
              <li><Link to="/list-equipment" className="hover:text-orange-400 transition-colors">Rental Fleet</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 text-xs uppercase tracking-[0.2em]">Equipment</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-orange-400 transition-colors">Total Stations</Link></li>
              <li><Link to="/" className="hover:text-orange-400 transition-colors">GNSS Receivers</Link></li>
              <li><Link to="/" className="hover:text-orange-400 transition-colors">Survey Drones</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 text-xs uppercase tracking-[0.2em]">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><MapPin size={14} /> Accra, Ghana</li>
              <li>Support: help@surveystoregh.com</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-800 text-[10px] text-center uppercase tracking-widest font-bold text-slate-500">
          &copy; {new Date().getFullYear()} Survey Store Ghana. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
