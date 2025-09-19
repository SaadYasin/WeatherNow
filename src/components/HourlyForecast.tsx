import React from 'react';
import { WeatherData, TemperatureUnit } from '../types';
import { WeatherIcon } from './WeatherIcon';
import { convertTemperature, getTemperatureUnit, formatTime } from '../utils/weather';

interface HourlyForecastProps {
  weather: WeatherData;
  unit: TemperatureUnit;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ weather, unit }) => {
  const tempUnit = getTemperatureUnit(unit);

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
      <h3 className="text-white text-lg font-semibold mb-4">48-Hour Forecast</h3>
      
      <div className="overflow-x-auto">
        <div className="flex space-x-4 pb-2">
          {weather.hourly.slice(0, 16).map((hour, index) => (
            <div key={index} className="flex-shrink-0 text-center min-w-[80px]">
              <div className="text-white/70 text-sm mb-2">
                {index === 0 ? 'Now' : formatTime(hour.dt)}
              </div>
              
              <div className="flex justify-center mb-2">
                <WeatherIcon condition={hour.weather[0].main} size={24} />
              </div>
              
              <div className="text-white font-medium mb-1">
                {convertTemperature(hour.temp, unit)}{tempUnit}
              </div>
              
              {hour.pop > 0 && (
                <div className="text-blue-300 text-xs">
                  {Math.round(hour.pop * 100)}%
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};