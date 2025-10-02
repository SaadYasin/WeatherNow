import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { City } from '../types';
import { searchCities } from '../services/weatherApi';

interface CitySelectorProps {
  selectedCity: City | null;
  onCitySelect: (city: City) => void;
}

export const CitySelector: React.FC<CitySelectorProps> = ({ selectedCity, onCitySelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (searchTerm.trim().length < 2) {
      setCities([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    debounceTimer.current = setTimeout(async () => {
      try {
        const results = await searchCities(searchTerm);
        setCities(results);
        setError(null);
      } catch (err) {
        console.error('City search error:', err);
        setError('Failed to search cities');
        setCities([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchTerm]);

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
        <input
          type="text"
          placeholder={selectedCity ? `${selectedCity.name}, ${selectedCity.country}` : 'Search for a city...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 focus:bg-white/20 transition-all duration-200"
        />
        {loading && (
          <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 animate-spin" size={20} />
        )}
      </div>

      {isOpen && (searchTerm.trim().length >= 2) && (
        <div className="absolute top-full mt-2 w-full bg-white/95 backdrop-blur-lg border border-white/30 rounded-xl shadow-2xl z-50 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="mx-auto mb-2 text-blue-500 animate-spin" size={32} />
              <p className="text-gray-600">Searching cities...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : cities.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">No cities found. Try a different search.</p>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {cities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => {
                    onCitySelect(city);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0 flex items-start space-x-3"
                >
                  <MapPin className="text-blue-500 mt-1 flex-shrink-0" size={18} />
                  <div>
                    <div className="font-medium text-gray-900">{city.name}</div>
                    <div className="text-sm text-gray-500">
                      {city.state ? `${city.state}, ${city.country}` : city.country}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
