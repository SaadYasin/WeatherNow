import React from 'react';
import { WeatherData, TemperatureUnit } from '../types';
import { WeatherIcon } from './WeatherIcon';
import { convertTemperature, getTemperatureUnit, capitalizeWords } from '../utils/weather';

interface CurrentWeatherProps {
  weather: WeatherData;
  unit: TemperatureUnit;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ weather, unit }) => {
  const { current, city } = weather;
  const tempUnit = getTemperatureUnit(unit);

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">{city.name}, {city.country}</h2>
          <p className="text-white/80 text-sm">
            {new Date(current.dt * 1000).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <WeatherIcon condition={current.weather[0].main} size={48} />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <div className="text-5xl font-bold mb-2">
            {convertTemperature(current.main.temp, unit)}{tempUnit}
          </div>
          <div className="text-white/80 mb-1">
            Feels like {convertTemperature(current.main.feels_like, unit)}{tempUnit}
          </div>
          <div className="text-white/80">
            {capitalizeWords(current.weather[0].description)}
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-lg font-semibold mb-1">
            H: {convertTemperature(current.main.temp_max, unit)}{tempUnit}
          </div>
          <div className="text-lg font-semibold text-white/80">
            L: {convertTemperature(current.main.temp_min, unit)}{tempUnit}
          </div>
        </div>
      </div>
    </div>
  );
};