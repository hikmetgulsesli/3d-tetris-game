import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CurrentWeather, CurrentWeatherData } from "@/components/CurrentWeather";

describe("CurrentWeather", () => {
  const mockWeatherData: CurrentWeatherData = {
    city: "San Francisco",
    country: "US",
    temperature: 72,
    humidity: 45,
    windSpeed: 8,
    condition: "clear",
    conditionText: "Mostly Sunny",
  };

  it("renders loading skeleton when isLoading is true", () => {
    render(<CurrentWeather isLoading={true} />);
    
    // Check for skeleton elements
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders error state when error is provided", () => {
    const errorMessage = "Failed to fetch weather data";
    render(<CurrentWeather error={errorMessage} />);
    
    expect(screen.getByText("Failed to load weather")).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("renders empty state when no data is provided", () => {
    render(<CurrentWeather />);
    
    expect(screen.getByText("Search for a city to see weather data")).toBeInTheDocument();
  });

  it("displays city name prominently", () => {
    render(<CurrentWeather data={mockWeatherData} />);
    
    expect(screen.getByText("San Francisco, US")).toBeInTheDocument();
  });

  it("displays current temperature prominently", () => {
    render(<CurrentWeather data={mockWeatherData} />);
    
    expect(screen.getByText("72°")).toBeInTheDocument();
  });

  it("displays humidity with droplet icon", () => {
    render(<CurrentWeather data={mockWeatherData} />);
    
    expect(screen.getByText("Humidity")).toBeInTheDocument();
    expect(screen.getByText("45%")).toBeInTheDocument();
  });

  it("displays wind speed with wind icon", () => {
    render(<CurrentWeather data={mockWeatherData} />);
    
    expect(screen.getByText("Wind")).toBeInTheDocument();
    expect(screen.getByText("8 mph")).toBeInTheDocument();
  });

  it("displays weather condition text and icon", () => {
    render(<CurrentWeather data={mockWeatherData} />);
    
    expect(screen.getByText("Mostly Sunny")).toBeInTheDocument();
  });

  it("displays 'Live Updates' badge", () => {
    render(<CurrentWeather data={mockWeatherData} />);
    
    expect(screen.getByText("Live Updates")).toBeInTheDocument();
  });

  it("renders correctly for cloudy weather condition", () => {
    const cloudyData: CurrentWeatherData = {
      ...mockWeatherData,
      condition: "clouds",
      conditionText: "Overcast",
      temperature: 65,
    };
    
    render(<CurrentWeather data={cloudyData} />);
    
    expect(screen.getByText("65°")).toBeInTheDocument();
    expect(screen.getByText("Overcast")).toBeInTheDocument();
  });

  it("renders correctly for rainy weather condition", () => {
    const rainyData: CurrentWeatherData = {
      ...mockWeatherData,
      condition: "rain",
      conditionText: "Light Rain",
      temperature: 58,
      humidity: 80,
    };
    
    render(<CurrentWeather data={rainyData} />);
    
    expect(screen.getByText("58°")).toBeInTheDocument();
    expect(screen.getByText("Light Rain")).toBeInTheDocument();
    expect(screen.getByText("80%")).toBeInTheDocument();
  });

  it("rounds temperature to nearest integer", () => {
    const dataWithDecimal: CurrentWeatherData = {
      ...mockWeatherData,
      temperature: 72.7,
    };
    
    render(<CurrentWeather data={dataWithDecimal} />);
    
    expect(screen.getByText("73°")).toBeInTheDocument();
  });

  it("displays city without country when country is not provided", () => {
    const dataWithoutCountry: CurrentWeatherData = {
      ...mockWeatherData,
      country: undefined,
    };
    
    render(<CurrentWeather data={dataWithoutCountry} />);
    
    expect(screen.getByText("San Francisco")).toBeInTheDocument();
  });
});
