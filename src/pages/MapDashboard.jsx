import React, { useEffect, useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { mcpClient } from '../lib/mcpClient';
import { config } from '../config/env';
import { Link } from 'react-router-dom';

const MAP_CONTAINER_STYLE = { width: '100%', height: '100%' };
const DEFAULT_CENTER = { lat: 28.6139, lng: 77.2090 };

const STATUS_COLORS = {
  'High': '#EF4444', 
  'Medium': '#F59E0B', 
  'Low': '#22C55E', 
};

export const MapDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [selected, setSelected] = useState(null);
  const [map, setMap] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: config.maps.googleMapsKey || '',
  });

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const data = await mcpClient.getPosts({});
        setIssues(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchIssues();
  }, []);

  const onLoad = useCallback((mapInstance) => setMap(mapInstance), []);
  const onUnmount = useCallback(() => setMap(null), []);

  return (
    <div className="bg-[#f0fdf4] text-[#131e19] overflow-hidden min-h-screen">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-emerald-950/80 backdrop-blur-xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-50 overflow-hidden">
            <img alt="User profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_gMZROGzSW3Y3qSRTf8VdVoYP6TpDUtKHE60sKau6UxVvgeWyiHTByNe2mC_BGHDa9wepC8yloIP1BK5wrR0qvWhsQ6Ms6v2aGTEx6a0-tWLaevI3CmBXFApRxsEQKt5_m9DInguPN_89az4rtdLH7TO9GuoFlQ09o0wXiM0SB5NKQfkC_39_kOOxC0DyR-WFa00LaED-P2_hZxliiLUsLi4g-zrAkRdXpqFgfSIF98aRYN8KM368588Wsz8Lkb4oQqvUdGAHaKWF"/>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#006e2f] font-[Manrope]">CivicLens</h1>
        </div>
        <div className="flex items-center gap-6">
          <button className="p-2 rounded-full hover:bg-emerald-50/50 transition-colors">
            <span className="material-symbols-outlined text-[#006e2f]">search</span>
          </button>
        </div>
      </header>

      {/* Main Canvas Map */}
      <main className="relative w-full h-screen">
        <div className="absolute inset-0 bg-[#eaf7ee] overflow-hidden">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={MAP_CONTAINER_STYLE}
            center={DEFAULT_CENTER}
            zoom={12}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{ disableDefaultUI: true, styles: [ { featureType: "all", stylers: [ { saturation: -80 }, { lightness: 20 } ] } ] }}
          >
            {issues.map(issue => (
              <Marker
                key={issue.id}
                position={{ lat: issue.lat, lng: issue.lng }}
                icon={{
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: 10,
                  fillColor: STATUS_COLORS[issue.severity] || '#22C55E',
                  fillOpacity: 1,
                  strokeColor: '#ffffff',
                  strokeWeight: 3,
                }}
                onClick={() => setSelected(issue)}
              />
            ))}
          </GoogleMap>
        ) : (
          <div className="w-full h-full bg-emerald-50 animate-pulse flex items-center justify-center">Loading Ecosystem...</div>
        )}
        </div>

        {/* Overlay Block for Map Tint */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#f0fdf4]/40 via-transparent to-[#f0fdf4]/20 pointer-events-none"></div>

        {/* Right Side Quick Actions */}
        <div className="absolute right-6 top-24 flex flex-col gap-4 z-40">
          <button className="bg-white/80 p-4 rounded-2xl shadow-sm border border-white/20 text-[#006e2f] hover:text-emerald-700 transition-colors backdrop-blur-xl">
            <span className="material-symbols-outlined">my_location</span>
          </button>
        </div>

        {/* Floating Issue Card (Slide-up Detail) */}
        {selected && (
          <div className="absolute bottom-28 left-0 right-0 px-6 flex justify-center z-40 transition-all">
            <div className="max-w-xl w-full bg-white/90 backdrop-blur-xl rounded-[28px] p-5 shadow-[0_20px_40px_-10px_rgba(34,197,94,0.12)] border border-white/40 flex flex-col sm:flex-row gap-5 items-center relative">
              <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-emerald-900/40 hover:text-emerald-700">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
              {/* Thumbnail */}
              <div class="w-full sm:w-32 h-32 flex-shrink-0 rounded-[20px] overflow-hidden">
                <img className="w-full h-full object-cover" src={selected.image_url || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400"} alt="Issue" />
              </div>
              {/* Content */}
              <div className="flex-grow w-full">
                <div className="flex items-center gap-3 mb-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${selected.severity === 'High' ? 'bg-red-100 text-red-700' : selected.severity === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {selected.severity}
                  </span>
                  <span className="text-xs text-[#3d4a3d] font-medium">{new Date(selected.timestamp).toLocaleDateString()}</span>
                </div>
                <h3 className="text-xl font-extrabold text-[#131e19] leading-tight font-[Manrope]">{selected.title}</h3>
                <p className="text-sm text-[#3d4a3d] line-clamp-2 mt-1 mb-4 leading-relaxed">
                  {selected.description}
                </p>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-800">@{selected.author}</span>
                  </div>
                  <Link to={`/issue/${selected.id}`} className="bg-gradient-to-br from-[#6DFE9C] to-[#22C55E] px-6 py-2.5 rounded-full text-white font-bold text-sm shadow-md shadow-emerald-500/20 active:scale-95 transition-transform font-[Manrope]">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* FAB - Create New Issue */}
      <Link to="/report" className="fixed bottom-24 right-8 z-50 bg-[#006e2f] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(0,110,47,0.3)] hover:scale-105 active:scale-95 transition-all">
        <span className="material-symbols-outlined text-3xl">add</span>
      </Link>

      {/* BottomNavBar Shell */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-6">
        <div className="bg-white/90 dark:bg-emerald-950/80 backdrop-blur-xl rounded-full mx-auto w-max px-4 py-2 flex items-center gap-2 shadow-[0_20px_40px_-10px_rgba(34,197,94,0.15)] border border-emerald-500/10">
          <Link to="/" className="bg-[#22C55E] text-white rounded-full p-3 shadow-lg shadow-emerald-500/40 active:scale-90 transition-transform flex items-center">
            <span className="material-symbols-outlined">map</span>
          </Link>
          <Link to="/admin" className="text-emerald-900/40 dark:text-emerald-100/40 p-3 hover:text-[#006e2f] transition-all active:scale-90">
            <span className="material-symbols-outlined">shield_person</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};
