import IWeatherApiService from './IWeatherApiService';
import { WeatherData } from './WeatherData';

export default class WeatherApi implements IWeatherApiService {
  private static _API_KEY = 'FYP8W4KJUXDR8R6L7F4G7CZQH';

  // Dates should be in yyyy-MM-dd format
  private _getWeatherAPIUrl(
    location: string,
    options?: { startDate?: string; endDate?: string; unitGroup?: string }
  ): string {
    const { startDate, endDate, unitGroup } = options || {};
    let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}`;

    if (startDate) url += `/${startDate}`;
    if (endDate) url += `/${endDate}`;
    url += `?key=${WeatherApi._API_KEY}`;

    if (unitGroup) url += `&unitGroup=${unitGroup}`;
    return url;
  }

  public getData = async (
    location: string,
    unitGroup: string
  ): Promise<WeatherData> => {
    const url = this._getWeatherAPIUrl(location, { unitGroup });
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const data: WeatherData = await response.json();
    return data;
  };
}
