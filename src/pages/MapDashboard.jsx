import React, { useEffect, useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { DatabaseService } from '../services/DatabaseService';
import { config } from '../config/env';
import { MapPin, AlertCircle, Loader, Navigation, LocateFixed } from 'lucide-react';

const MAP_CONTAINER_STYLE = { width: '100%', height: '100%' };

const DEFAULT_CENTER = { lat: 28.6139, lng: 77.2090 };

const STATUS_COLORS = {
  reported:    '#ef4444',
  in_progress: '#f59e0b',
  resolved:    '#22c55e',
};

const CATEGORY_EMOJI = {
  pothole:     '🕳️',
  streetlight: '💡',
  garbage:     '🗑️',
  water_leak:  '💧',
  graffiti:    '🎨',
  road_damage: '🚧',
  other:       '📍',
};

export const MapDashboard = () => {
  const [issues, setIssues]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [selected, setSelected]         = useState(null);
  const [map, setMap]                   = useState(null);
  const [filter, setFilter]             = useState('all');
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating]         = useState(false);
  const [locateError, setLocateError]   = useState('');

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: config.maps.googleMapsKey,
  });

  useEffect(() => {
    const fetchIssues = async () => {
      const data = await DatabaseService.getAllIssues();
      setIssues(data);
      setLoading(false);
    };
    fetchIssues();
  }, []);

  const onLoad = useCallback((mapInstance) => setMap(mapInstance), []);
  const onUnmount = useCallback(() => setMap(null), []);

  // ── GPS: Get current location ────────────────────────────────
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setLocateError('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    setLocateError('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(pos);
        setLocating(false);
        if (map) {
          map.panTo(pos);
          map.setZoom(15);
        }
      },
      (err) => {
        setLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocateError('Location access denied. Please allow location in your browser settings.');
        } else {
          setLocateError('Unable to retrieve your location. Try again.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const filteredIssues = filter === 'all'
    ? issues
    : issues.filter(i => i.status === filter);

  // ── Error state ──────────────────────────────────────────────
  if (loadError) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-gray-50">
        <AlertCircle size={48} className="text-red-400 mb-3" />
        <h2 className="text-lg font-semibold text-gray-700">Map failed to load</h2>
        <p className="text-sm text-gray-500 mt-1 max-w-xs text-center">
          Check that your Google Maps API key is valid and the Maps JavaScript API is enabled.
        </p>
        <code className="mt-3 text-xs bg-gray-100 px-3 py-1 rounded text-red-500">
          {loadError.message}
        </code>
      </div>
    );
  }

  // ── Loading state ─────────────────────────────────────────────
  if (!isLoaded || loading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-gray-50">
        <Loader size={40} className="text-blue-500 animate-spin mb-3" />
        <p className="text-sm text-gray-500">Loading map…</p>
      </div>
    );
  }

  // ── No API key ────────────────────────────────────────────────
  if (!config.maps.googleMapsKey) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-gray-100">
        <MapPin size={48} className="mx-auto mb-4 text-gray-400" />
        <h2 className="text-lg font-semibold text-gray-700">Map View Available</h2>
        <p className="text-sm mt-2 text-gray-500 text-center">
          Waiting for Google Maps API Key to render interactive map.
          <br />
          Mock Data currently has {issues.length} reported issues.
        </p>
      </div>
    );
  }

  // ── Main Map ──────────────────────────────────────────────────
  return (
    <div className="h-full w-full flex flex-col">

      {/* Filter bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-white border-b border-gray-200 shadow-sm z-10 flex-wrap">
        <span className="text-xs font-medium text-gray-500 mr-1">Filter:</span>
        {['all', 'reported', 'in_progress', 'resolved'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              filter === s
                ? 'bg-blue-600 text-white shadow'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s === 'all' ? `All (${issues.length})` : s.replace('_', ' ')}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400">
          Showing {filteredIssues.length} issue{filteredIssues.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Error toast for location */}
      {locateError && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-200 text-xs text-red-600 flex items-center gap-2">
          <AlertCircle size={14} />
          {locateError}
          <button onClick={() => setLocateError('')} className="ml-auto text-red-400 hover:text-red-600 font-bold">✕</button>
        </div>
      )}

      {/* Map container (relative so button can be absolutely positioned) */}
      <div className="flex-1 relative">
        <GoogleMap
          mapContainerStyle={MAP_CONTAINER_STYLE}
          center={DEFAULT_CENTER}
          zoom={12}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
          }}
        >
          {/* Issue markers */}
          {filteredIssues.map(issue => {
            const lat = issue.location?.lat ?? issue.lat;
            const lng = issue.location?.lng ?? issue.lng;
            if (!lat || !lng) return null;

            return (
              <Marker
                key={issue.id}
                position={{ lat, lng }}
                title={issue.title || issue.category}
                icon={{
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: 10,
                  fillColor: STATUS_COLORS[issue.status] || '#6b7280',
                  fillOpacity: 0.9,
                  strokeColor: '#fff',
                  strokeWeight: 2,
                }}
                onClick={() => setSelected(issue)}
              />
            );
          })}

          {/* User location marker (blue pulsing dot) */}
          {userLocation && (
            <Marker
              position={userLocation}
              title="Your Location"
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#3b82f6',
                fillOpacity: 1,
                strokeColor: '#fff',
                strokeWeight: 3,
              }}
              zIndex={9999}
            />
          )}

          {/* Issue info window */}
          {selected && (() => {
            const lat = selected.location?.lat ?? selected.lat;
            const lng = selected.location?.lng ?? selected.lng;
            return (
              <InfoWindow
                position={{ lat, lng }}
                onCloseClick={() => setSelected(null)}
              >
                <div className="text-sm max-w-[220px]">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-base">
                      {CATEGORY_EMOJI[selected.category] || '📍'}
                    </span>
                    <span className="font-semibold text-gray-800">
                      {selected.title || selected.category}
                    </span>
                  </div>
                  {selected.description && (
                    <p className="text-gray-600 text-xs mt-1 line-clamp-3">
                      {selected.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className="px-2 py-0.5 rounded-full text-white text-xs font-medium"
                      style={{ backgroundColor: STATUS_COLORS[selected.status] || '#6b7280' }}
                    >
                      {selected.status?.replace('_', ' ') || 'reported'}
                    </span>
                    {selected.upvotes > 0 && (
                      <span className="text-xs text-gray-500">👍 {selected.upvotes}</span>
                    )}
                  </div>
                </div>
              </InfoWindow>
            );
          })()}
        </GoogleMap>

        {/* ── GPS Locate Me Button (floating, bottom-right) ── */}
        <button
          onClick={handleLocateMe}
          disabled={locating}
          title="Go to my location"
          className={`
            absolute bottom-20 right-3 z-10
            flex items-center gap-2
            px-4 py-2.5 rounded-full
            text-sm font-semibold shadow-lg
            transition-all duration-200
            ${locating
              ? 'bg-blue-400 text-white cursor-not-allowed'
              : userLocation
                ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 active:scale-95'
            }
          `}
        >
          {locating
            ? <Loader size={16} className="animate-spin" />
            : <LocateFixed size={16} />
          }
          {locating ? 'Locating…' : userLocation ? 'Located ✓' : 'My Location'}
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-4 py-2 bg-white border-t border-gray-100 text-xs text-gray-500">
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <span key={status} className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: color }} />
            {status.replace('_', ' ')}
          </span>
        ))}
        {userLocation && (
          <span className="flex items-center gap-1 ml-auto">
            <span className="w-3 h-3 rounded-full inline-block bg-blue-500" />
            you
          </span>
        )}
      </div>
    </div>
  );
};
