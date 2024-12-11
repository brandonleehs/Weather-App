import { WeatherData } from './WeatherData';

export default interface IWeatherApiService {
  getData: (location: string, urlBase: string) => Promise<WeatherData>;
}
