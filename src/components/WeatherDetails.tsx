import React from 'react';
import { WeatherData, TemperatureUnit } from '../types';
import { DetailIcon } from './WeatherIcon';
import { formatTime, getWindDirection } from '../utils/weather';
import { Droplets, Wind, Eye, Gauge, Sun, Moon } from 'lucide-react';

interface WeatherDetailsProps {
  weather: WeatherData;
  unit: TemperatureUnit;
}

export const WeatherDetails: React.FC<WeatherDetailsProps> = ({ weather, unit }) => {
  const { current } = weather;
  
  const details = [
    {
      icon: <Droplets size={20} className="text-blue-400" />,
      label: 'Humidity',
      value: `${current.main.humidity}%`,
    },
    {
      icon: <Wind size={20} className="text-green-400" />,
      label: 'Wind Speed',
      value: `${Math.round(current.wind.speed * (unit === 'fahrenheit' ? 2.237 : 3.6))} ${unit === 'fahrenheit' ? 'mph' : 'km/h'}`,
    },
    {
      icon: <Eye size={20} className="text-purple-400" />,
      label: 'Visibility',
      value: `${Math.round(current.main.visibility / (unit === 'fahrenheit' ? 1609 : 1000))} ${unit === 'fahrenheit' ? 'mi' : 'km'}`,
    },
    {
      icon: <Gauge size={20} className="text-orange-400" />,
      label: 'Pressure',
      value: `${current.main.pressure} hPa`,
    },
    {
      icon: <Sun size={20} className="text-yellow-400" />,
      label: 'Sunrise',
      value: formatTime(current.sys.sunrise),
    },
    {
      icon: <Moon size={20} className="text-indigo-400" />,
      label: 'Sunset',
      value: formatTime(current.sys.sunset),
    },
  ];

  if (current.rain?.['1h']) {
    details.splice(4, 0, {
      icon: <Droplets size={20} className="text-blue-500" />,
      label: 'Precipitation',
      value: `${current.rain['1h']} mm`,
    });
  }

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
      <h3 className="text-white text-lg font-semibold mb-4">Weather Details</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {details.map((detail, index) => (
          <div key={index} className="flex items-center space-x-3">
            {detail.icon}
            <div>
              <div className="text-white/70 text-sm">{detail.label}</div>
              <div className="text-white font-medium">{detail.value}</div>
            </div>
          </div>
        ))}
      </div>
      
      {current.wind.deg && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="flex items-center space-x-3">
            <Wind size={20} className="text-green-400" />
            <div>
              <div className="text-white/70 text-sm">Wind Direction</div>
              <div className="text-white font-medium">{getWindDirection(current.wind.deg)} ({current.wind.deg}°)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};