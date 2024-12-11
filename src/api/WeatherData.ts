interface WeatherData {
  resolvedAddress: string;
  timezone: string;
  description: string;
  days: Array<DayData>;
}

interface DayData {
  datetime: string;
  temp: number;
  feelslike: number;
  humidity: number;
  windspeed: number;
  description: string;
  conditions: string;
}

export { WeatherData, DayData };
