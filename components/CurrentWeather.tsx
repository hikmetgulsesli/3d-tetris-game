import React from "react";
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  Droplets, 
  Wind,
  CloudFog,
  CloudSun
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type WeatherCondition = 
  | "clear" 
  | "clouds" 
  | "rain" 
  | "snow" 
  | "thunderstorm" 
  | "drizzle" 
  | "mist" 
  | "fog" 
  | "haze"
  | "partly-cloudy";

export interface CurrentWeatherData {
  city: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: WeatherCondition;
  conditionText: string;
  country?: string;
}

interface CurrentWeatherProps {
  data?: CurrentWeatherData;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}

const weatherIcons: Record<WeatherCondition, React.ComponentType<{ className?: string }>> = {
  clear: Sun,
  clouds: Cloud,
  "partly-cloudy": CloudSun,
  rain: CloudRain,
  snow: CloudSnow,
  thunderstorm: CloudLightning,
  drizzle: CloudRain,
  mist: CloudFog,
  fog: CloudFog,
  haze: CloudFog,
};

const weatherColors: Record<WeatherCondition, string> = {
  clear: "text-yellow-500",
  clouds: "text-slate-400",
  "partly-cloudy": "text-blue-500",
  rain: "text-blue-600",
  snow: "text-cyan-400",
  thunderstorm: "text-purple-600",
  drizzle: "text-blue-400",
  mist: "text-slate-400",
  fog: "text-slate-400",
  haze: "text-slate-400",
};

const weatherBgColors: Record<WeatherCondition, string> = {
  clear: "bg-gradient-to-br from-yellow-100 to-orange-50",
  clouds: "bg-gradient-to-br from-slate-100 to-gray-50",
  "partly-cloudy": "bg-gradient-to-br from-blue-50 to-yellow-50",
  rain: "bg-gradient-to-br from-blue-100 to-slate-100",
  snow: "bg-gradient-to-br from-cyan-50 to-blue-50",
  thunderstorm: "bg-gradient-to-br from-purple-100 to-slate-100",
  drizzle: "bg-gradient-to-br from-blue-50 to-slate-100",
  mist: "bg-gradient-to-br from-slate-100 to-gray-100",
  fog: "bg-gradient-to-br from-slate-100 to-gray-100",
  haze: "bg-gradient-to-br from-slate-100 to-gray-100",
};

function CurrentWeatherLoading() {
  return (
    <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-8">
      <div className="flex items-center gap-4">
        <Skeleton className="h-24 w-24 rounded-2xl" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-16 w-32" />
          <Skeleton className="h-6 w-28" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 w-full sm:w-auto mt-4 sm:mt-0">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-4 w-10" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CurrentWeatherError({ error }: { error: string }) {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500 mb-4">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="32" 
          height="32" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-text-main mb-2">Failed to load weather</h3>
      <p className="text-sm text-text-secondary max-w-xs">{error}</p>
    </div>
  );
}

export function CurrentWeather({ 
  data, 
  isLoading = false, 
  error = null,
  className 
}: CurrentWeatherProps) {
  if (isLoading) {
    return (
      <div className={cn(
        "relative flex flex-col rounded-2xl bg-white p-6 shadow-soft ring-1 ring-border overflow-hidden",
        className
      )}>
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50 blur-3xl" />
        <CurrentWeatherLoading />
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn(
        "relative flex flex-col rounded-2xl bg-white p-6 shadow-soft ring-1 ring-border overflow-hidden",
        className
      )}>
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-gradient-to-br from-red-50 to-orange-50 opacity-50 blur-3xl" />
        <CurrentWeatherError error={error} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className={cn(
        "relative flex flex-col rounded-2xl bg-white p-6 shadow-soft ring-1 ring-border overflow-hidden",
        className
      )}>
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50 blur-3xl" />
        <div className="relative z-10 flex flex-col items-center justify-center py-12 text-center">
          <p className="text-text-secondary">Search for a city to see weather data</p>
        </div>
      </div>
    );
  }

  const WeatherIcon = weatherIcons[data.condition] || Sun;
  const weatherColorClass = weatherColors[data.condition] || "text-yellow-500";
  const weatherBgClass = weatherBgColors[data.condition] || "bg-gradient-to-br from-yellow-100 to-orange-50";

  return (
    <div className={cn(
      "relative flex flex-col rounded-2xl bg-white p-6 shadow-soft ring-1 ring-border overflow-hidden",
      className
    )}>
      <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50 blur-3xl" />
      
      <div className="relative z-10">
        {/* Header with city name */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <h1 className="text-2xl font-bold text-text-main" style={{ fontFamily: 'var(--font-heading)' }}>
                {data.city}{data.country ? `, ${data.country}` : ''}
              </h1>
            </div>
            <p className="text-sm font-medium text-text-secondary">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' })} • {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            </p>
          </div>
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
            Live Updates
          </span>
        </div>

        {/* Main weather display */}
        <div className="mt-8 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className={cn(
              "flex h-24 w-24 items-center justify-center rounded-2xl shadow-sm",
              weatherBgClass
            )}>
              <WeatherIcon className={cn("w-16 h-16", weatherColorClass)} />
            </div>
            <div className="flex flex-col">
              <span 
                className="text-6xl font-bold tracking-tight text-text-main"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {Math.round(data.temperature)}°
              </span>
              <span className="text-lg font-medium text-text-secondary" style={{ fontFamily: 'var(--font-body)' }}>
                {data.conditionText}
              </span>
            </div>
          </div>

          {/* Weather details grid */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 w-full sm:w-auto mt-4 sm:mt-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-primary">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-text-secondary">Humidity</p>
                <p className="text-sm font-bold text-text-main">{data.humidity}%</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-text-secondary">Wind</p>
                <p className="text-sm font-bold text-text-main">{data.windSpeed} mph</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CurrentWeather;
