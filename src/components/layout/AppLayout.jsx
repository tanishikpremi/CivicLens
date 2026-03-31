import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Map, List, PlusCircle, ShieldAlert } from 'lucide-react';

export const AppLayout = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm h-14 flex items-center justify-between px-4 shrink-0 fixed top-0 w-full z-10 w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
             C
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
            CivicLens
          </h1>
        </div>
        <NavLink 
          to="/admin" 
          className={({isActive}) => `text-gray-400 p-2 rounded-full hover:bg-gray-100 ${isActive ? 'text-red-500 bg-red-50' : ''}`}
        >
          <ShieldAlert size={20} />
        </NavLink>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pt-14 pb-16">
        <Outlet />
      </main>

      {/* Bottom Navigation (Mobile First) */}
      <nav className="bg-white border-t border-gray-200 h-16 fixed bottom-0 w-full flex justify-around items-center px-2 pb-safe z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <NavItem to="/" icon={<Map size={24} />} label="Map" />
        <div className="relative -top-4">
          <NavLink 
            to="/report" 
            className="w-14 h-14 flex items-center justify-center bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-transform active:scale-95 border-4 border-white"
          >
            <PlusCircle size={28} />
          </NavLink>
        </div>
        <NavItem to="/feed" icon={<List size={24} />} label="Feed" />
      </nav>
    </div>
  );
};

const NavItem = ({ to, icon, label }) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `flex flex-col items-center justify-center w-20 space-y-1 transition-colors ${
          isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
        }`
      }
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </NavLink>
  );
};
