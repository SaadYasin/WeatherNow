import { WeatherData, City } from '../types';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export class WeatherApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'WeatherApiError';
  }
}

export const fetchWeatherData = async (city: City): Promise<WeatherData> => {
  if (!API_KEY) {
    throw new WeatherApiError('OpenWeatherMap API key is not configured');
  }

  try {
    // Fetch current weather
    const currentResponse = await fetch(
      `${BASE_URL}/weather?lat=${city.coords.lat}&lon=${city.coords.lon}&appid=${API_KEY}&units=metric`
    );

    if (!currentResponse.ok) {
      throw new WeatherApiError(
        `Failed to fetch current weather: ${currentResponse.statusText}`,
        currentResponse.status
      );
    }

    const currentData = await currentResponse.json();

    // Fetch forecast data (5-day forecast with 3-hour intervals)
    const forecastResponse = await fetch(
      `${BASE_URL}/forecast?lat=${city.coords.lat}&lon=${city.coords.lon}&appid=${API_KEY}&units=metric`
    );

    if (!forecastResponse.ok) {
      throw new WeatherApiError(
        `Failed to fetch forecast data: ${forecastResponse.statusText}`,
        forecastResponse.status
      );
    }

    const forecastData = await forecastResponse.json();

    // Transform the API response to match our WeatherData interface
    const weatherData: WeatherData = {
      city,
      current: {
        dt: currentData.dt,
        weather: currentData.weather,
        main: {
          temp: currentData.main.temp,
          feels_like: currentData.main.feels_like,
          temp_min: currentData.main.temp_min,
          temp_max: currentData.main.temp_max,
          pressure: currentData.main.pressure,
          humidity: currentData.main.humidity,
          visibility: currentData.visibility || 10000,
        },
        wind: {
          speed: currentData.wind?.speed || 0,
          deg: currentData.wind?.deg || 0,
          gust: currentData.wind?.gust,
        },
        clouds: {
          all: currentData.clouds?.all || 0,
        },
        rain: currentData.rain,
        snow: currentData.snow,
        sys: {
          sunrise: currentData.sys.sunrise,
          sunset: currentData.sys.sunset,
        },
      },
      hourly: forecastData.list.slice(0, 16).map((item: any) => ({
        dt: item.dt,
        temp: item.main.temp,
        weather: item.weather,
        pop: item.pop || 0,
      })),
      daily: generateDailyFromHourly(forecastData.list),
    };

    return weatherData;
  } catch (error) {
    if (error instanceof WeatherApiError) {
      throw error;
    }
    throw new WeatherApiError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Helper function to generate daily forecast from hourly data
const generateDailyFromHourly = (hourlyList: any[]): WeatherData['daily'] => {
  const dailyMap = new Map<string, any[]>();
  
  // Group hourly data by date
  hourlyList.forEach((item) => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!dailyMap.has(date)) {
      dailyMap.set(date, []);
    }
    dailyMap.get(date)!.push(item);
  });

  // Convert grouped data to daily format
  const dailyData: WeatherData['daily'] = [];
  
  dailyMap.forEach((dayItems, dateString) => {
    const temps = dayItems.map(item => item.main.temp);
    const windSpeeds = dayItems.map(item => item.wind?.speed || 0);
    const pops = dayItems.map(item => item.pop || 0);
    
    // Use the weather condition from the middle of the day (around noon)
    const noonItem = dayItems.find(item => {
      const hour = new Date(item.dt * 1000).getHours();
      return hour >= 11 && hour <= 13;
    }) || dayItems[Math.floor(dayItems.length / 2)];

    dailyData.push({
      dt: dayItems[0].dt,
      temp: {
        min: Math.min(...temps),
        max: Math.max(...temps),
      },
      weather: noonItem.weather,
      wind_speed: Math.max(...windSpeeds),
      pop: Math.max(...pops),
    });
  });

  return dailyData.slice(0, 10); // Return up to 10 days
};