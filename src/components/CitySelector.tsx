import React, { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { City } from '../types';
import { majorCities } from '../data/cities';

interface CitySelectorProps {
  selectedCity: City | null;
  onCitySelect: (city: City) => void;
}

export const CitySelector: React.FC<CitySelectorProps> = ({ selectedCity, onCitySelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCities = majorCities.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full max-w-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-left flex items-center justify-between hover:bg-white/20 transition-all duration-200"
      >
        <span className="text-white font-medium">
          {selectedCity ? `${selectedCity.name}, ${selectedCity.country}` : 'Select a city'}
        </span>
        <ChevronDown className={`text-white transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} size={20} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white/95 backdrop-blur-lg border border-white/30 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {filteredCities.map((city) => (
              <button
                key={city.id}
                onClick={() => {
                  onCitySelect(city);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
                className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
              >
                <div className="font-medium text-gray-900">{city.name}</div>
                <div className="text-sm text-gray-500">{city.country}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};