import React from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, Cog as Fog, Wind, Eye, Thermometer } from 'lucide-react';

interface WeatherIconProps {
  condition: string;
  size?: number;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ condition, size = 24, className = '' }) => {
  const getIcon = () => {
    const lowerCondition = condition.toLowerCase();
    
    if (lowerCondition.includes('clear') || lowerCondition.includes('sun')) {
      return <Sun size={size} className={`text-yellow-500 ${className}`} />;
    }
    if (lowerCondition.includes('cloud')) {
      if (lowerCondition.includes('few') || lowerCondition.includes('scattered')) {
        return <Cloud size={size} className={`text-gray-500 ${className}`} />;
      }
      return <Cloud size={size} className={`text-gray-600 ${className}`} />;
    }
    if (lowerCondition.includes('rain')) {
      return <CloudRain size={size} className={`text-blue-500 ${className}`} />;
    }
    if (lowerCondition.includes('drizzle')) {
      return <CloudDrizzle size={size} className={`text-blue-400 ${className}`} />;
    }
    if (lowerCondition.includes('snow')) {
      return <CloudSnow size={size} className={`text-blue-200 ${className}`} />;
    }
    if (lowerCondition.includes('thunder') || lowerCondition.includes('storm')) {
      return <CloudLightning size={size} className={`text-purple-500 ${className}`} />;
    }
    if (lowerCondition.includes('mist') || lowerCondition.includes('fog') || lowerCondition.includes('haze')) {
      return <Fog size={size} className={`text-gray-400 ${className}`} />;
    }
    
    return <Sun size={size} className={`text-yellow-500 ${className}`} />;
  };

  return getIcon();
};

export const DetailIcon: React.FC<{ type: string; size?: number; className?: string }> = ({ 
  type, 
  size = 20, 
  className = '' 
}) => {
  switch (type) {
    case 'wind':
      return <Wind size={size} className={className} />;
    case 'visibility':
      return <Eye size={size} className={className} />;
    case 'temperature':
      return <Thermometer size={size} className={className} />;
    default:
      return <Sun size={size} className={className} />;
  }
};