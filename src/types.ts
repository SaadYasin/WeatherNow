export interface City {
  id: number;
  name: string;
  country: string;
  coords: {
    lat: number;
    lon: number;
  };
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface CurrentWeather {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  visibility: number;
}

export interface Wind {
  speed: number;
  deg: number;
  gust?: number;
}

export interface WeatherData {
  city: City;
  current: {
    dt: number;
    weather: WeatherCondition[];
    main: CurrentWeather;
    wind: Wind;
    clouds: { all: number };
    rain?: { '1h': number };
    snow?: { '1h': number };
    sys: {
      sunrise: number;
      sunset: number;
    };
  };
  hourly: Array<{
    dt: number;
    temp: number;
    weather: WeatherCondition[];
    pop: number;
  }>;
  daily: Array<{
    dt: number;
    temp: { min: number; max: number };
    weather: WeatherCondition[];
    wind_speed: number;
    pop: number;
  }>;
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';