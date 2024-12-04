export default interface WeatherData {
  resolvedAddress: string;
  address: string;
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
  conditions: string;
}
