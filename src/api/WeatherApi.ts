import IWeatherApiService from './IWeatherApiService';
import WeatherData from './WeatherData';

export default class WeatherApi implements IWeatherApiService {
  private static _API_KEY = 'FYP8W4KJUXDR8R6L7F4G7CZQH';

  // Dates should be in yyyy-MM-dd format
  private _getWeatherAPIUrl(
    location: string,
    startDate?: string,
    endDate?: string
  ): string {
    if (typeof startDate === 'undefined') {
      return `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/?key=${WeatherApi._API_KEY}`;
    }
    if (typeof endDate === 'undefined') {
      return `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${startDate}/?key=${WeatherApi._API_KEY}`;
    }
    return `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${startDate}/${endDate}/?key=${WeatherApi._API_KEY}`;
  }

  public getData = async (location: string): Promise<WeatherData> => {
    const url = this._getWeatherAPIUrl(location);
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const data: WeatherData = await response.json();
    return data;
  };
}
