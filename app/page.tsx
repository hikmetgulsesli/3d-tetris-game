"use client";

import { useState } from "react";
import { CurrentWeather, CurrentWeatherData } from "@/components/CurrentWeather";
import { Search } from "lucide-react";

// Mock weather data for demo purposes
const mockWeatherData: Record<string, CurrentWeatherData> = {
  "san francisco": {
    city: "San Francisco",
    country: "US",
    temperature: 72,
    humidity: 45,
    windSpeed: 8,
    condition: "clear",
    conditionText: "Mostly Sunny",
  },
  "new york": {
    city: "New York",
    country: "US",
    temperature: 65,
    humidity: 60,
    windSpeed: 12,
    condition: "clouds",
    conditionText: "Partly Cloudy",
  },
  "london": {
    city: "London",
    country: "UK",
    temperature: 58,
    humidity: 75,
    windSpeed: 15,
    condition: "rain",
    conditionText: "Light Rain",
  },
  "tokyo": {
    city: "Tokyo",
    country: "JP",
    temperature: 78,
    humidity: 55,
    windSpeed: 6,
    condition: "partly-cloudy",
    conditionText: "Partly Cloudy",
  },
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [weatherData, setWeatherData] = useState<CurrentWeatherData | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);

    // Simulate API delay
    setTimeout(() => {
      const query = searchQuery.toLowerCase().trim();
      const data = mockWeatherData[query];

      if (data) {
        setWeatherData(data);
        setIsLoading(false);
      } else {
        setError(`City "${searchQuery}" not found. Try: San Francisco, New York, London, or Tokyo.`);
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background font-body">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
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
              >
                <path d="M17.5 19c0-1.7-1.3-3-3-3c-1.1 0-2.1.6-2.6 1.5c-.5-.9-1.5-1.5-2.6-1.5c-1.7 0-3 1.3-3 3" />
                <path d="M12 2v4" />
                <path d="M4.22 10.22l2.83 2.83" />
                <path d="M17.95 13.05l2.83-2.83" />
                <path d="M22 12h-4" />
                <path d="M6 12H2" />
              </svg>
            </div>
            <h2 className="text-lg font-bold tracking-tight text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
              Weather Dashboard
            </h2>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full flex justify-center py-8 px-4 sm:px-6">
        <div className="flex flex-col w-full max-w-[1000px] gap-8">
          {/* Search Bar */}
          <div className="flex flex-col items-center justify-center gap-4 py-4">
            <form onSubmit={handleSearch} className="relative w-full max-w-lg group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city (try: San Francisco, New York, London, Tokyo)..."
                className="h-14 w-full rounded-2xl border-0 bg-card py-4 pl-12 pr-4 text-base shadow-soft ring-1 ring-border focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/60"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <kbd className="hidden rounded border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground sm:inline-block">
                  Enter
                </kbd>
              </div>
            </form>
          </div>

          {/* Current Weather Display */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CurrentWeather 
                data={weatherData}
                isLoading={isLoading}
                error={error}
              />
            </div>

            {/* Placeholder for future features */}
            <div className="lg:col-span-1">
              <div className="h-full min-h-[250px] relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 shadow-soft ring-1 ring-border flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto mb-4">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M12 2v4" />
                      <path d="m4.93 4.93 2.83 2.83" />
                      <path d="M20 12h4" />
                      <path d="m19.07 4.93-2.83 2.83" />
                      <path d="M15.947 12.65a4 4 0 0 0-5.925-4.128" />
                      <path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-foreground mb-2">5-Day Forecast</h3>
                  <p className="text-sm text-muted-foreground">Coming in the next update</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
