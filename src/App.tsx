import React, { useState, useEffect } from 'react';
import { City, WeatherData, TemperatureUnit } from './types';
import { CitySelector } from './components/CitySelector';
import { CurrentWeather } from './components/CurrentWeather';
import { WeatherDetails } from './components/WeatherDetails';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecast } from './components/DailyForecast';
import { fetchWeatherData, WeatherApiError } from './services/weatherApi';
import { Thermometer, AlertCircle } from 'lucide-react';

function App() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>('celsius');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
  };

  const toggleTemperatureUnit = () => {
    setTemperatureUnit(prev => prev === 'celsius' ? 'fahrenheit' : 'celsius');
  };

  useEffect(() => {
    if (selectedCity) {
      setLoading(true);
      setError(null);
      
      fetchWeatherData(selectedCity)
        .then((data) => {
          setWeatherData(data);
          setError(null);
        })
        .catch((err) => {
          console.error('Weather API Error:', err);
          if (err instanceof WeatherApiError) {
            setError(err.message);
          } else {
            setError('Failed to fetch weather data. Please try again.');
          }
          setWeatherData(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [selectedCity]);

  // Dynamic background based on weather conditions
  const getBackgroundClass = () => {
    if (!weatherData) return 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600';
    
    const condition = weatherData.current.weather[0].main.toLowerCase();
    const hour = new Date().getHours();
    const isNight = hour < 6 || hour > 20;
    
    if (condition.includes('clear')) {
      return isNight 
        ? 'bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900'
        : 'bg-gradient-to-br from-blue-400 via-sky-400 to-cyan-400';
    } else if (condition.includes('cloud')) {
      return 'bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700';
    } else if (condition.includes('rain')) {
      return 'bg-gradient-to-br from-gray-600 via-blue-600 to-indigo-700';
    } else if (condition.includes('snow')) {
      return 'bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400';
    }
    
    return 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600';
  };

  return (
    <div className={`min-h-screen transition-all duration-1000 ${getBackgroundClass()}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-3 rounded-full">
              <Thermometer className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Weather Forecast</h1>
              <p className="text-white/80">Your comprehensive weather dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <CitySelector
              selectedCity={selectedCity}
              onCitySelect={handleCitySelect}
            />
            
            <button
              onClick={toggleTemperatureUnit}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium border border-white/30"
            >
              °{temperatureUnit === 'celsius' ? 'C' : 'F'}
            </button>
          </div>
        </div>

        {/* Initial State - No City Selected */}
        {!selectedCity && !loading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 text-center max-w-md">
              <Thermometer className="text-white/60 mx-auto mb-4" size={64} />
              <h2 className="text-2xl font-bold text-white mb-2">Welcome to Weather Forecast</h2>
              <p className="text-white/80">Search for a city above to get started with real-time weather data</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white text-lg text-center">Loading weather data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-2xl p-8 max-w-md">
              <div className="flex items-center justify-center mb-4">
                <AlertCircle className="text-red-400" size={48} />
              </div>
              <h3 className="text-white text-xl font-semibold text-center mb-2">Weather Data Unavailable</h3>
              <p className="text-white/80 text-center mb-4">{error}</p>
              <button
                onClick={() => selectedCity && setSelectedCity({ ...selectedCity })}
                className="w-full bg-red-500/20 hover:bg-red-500/30 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium border border-red-500/30"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Weather Content */}
        {!loading && !error && weatherData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Current Weather & Details */}
            <div className="lg:col-span-1 space-y-6">
              <CurrentWeather weather={weatherData} unit={temperatureUnit} />
              <WeatherDetails weather={weatherData} unit={temperatureUnit} />
            </div>
            
            {/* Right Column - Forecasts */}
            <div className="lg:col-span-2 space-y-6">
              <HourlyForecast weather={weatherData} unit={temperatureUnit} />
              <DailyForecast weather={weatherData} unit={temperatureUnit} />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-white/60">
          <p className="text-sm">
            Weather data provided by OpenWeatherMap • Last updated: {weatherData ? new Date(weatherData.current.dt * 1000).toLocaleTimeString() : new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;