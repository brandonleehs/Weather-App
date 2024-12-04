import WeatherData from './WeatherData';

export default interface IWeatherApiService {
  getData: (location: string) => Promise<WeatherData>;
}
