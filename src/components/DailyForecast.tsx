import React from 'react';
import { WeatherData, TemperatureUnit } from '../types';
import { WeatherIcon } from './WeatherIcon';
import { convertTemperature, getTemperatureUnit, formatDate } from '../utils/weather';
import { Wind } from 'lucide-react';

interface DailyForecastProps {
  weather: WeatherData;
  unit: TemperatureUnit;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ weather, unit }) => {
  const tempUnit = getTemperatureUnit(unit);

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
      <h3 className="text-white text-lg font-semibold mb-4">10-Day Forecast</h3>
      
      <div className="space-y-3">
        {weather.daily.slice(0, 10).map((day, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b border-white/10 last:border-b-0">
            <div className="flex items-center space-x-4 flex-1">
              <div className="text-white font-medium w-16 text-sm">
                {index === 0 ? 'Today' : formatDate(day.dt)}
              </div>
              
              <WeatherIcon condition={day.weather[0].main} size={24} />
              
              <div className="text-white/70 text-sm capitalize flex-1">
                {day.weather[0].description}
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm">
                <Wind size={16} className="text-green-400" />
                <span className="text-white/70">
                  {Math.round(day.wind_speed * (unit === 'fahrenheit' ? 2.237 : 3.6))} {unit === 'fahrenheit' ? 'mph' : 'km/h'}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 text-right min-w-[80px]">
                <span className="text-white font-medium">
                  {convertTemperature(day.temp.max, unit)}{tempUnit}
                </span>
                <span className="text-white/60">
                  {convertTemperature(day.temp.min, unit)}{tempUnit}
                </span>
              </div>
              
              {day.pop > 0 && (
                <div className="text-blue-300 text-sm min-w-[40px] text-right">
                  {Math.round(day.pop * 100)}%
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};