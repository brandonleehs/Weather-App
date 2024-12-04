import WeatherApi from '../api/WeatherApi';
import View from './View';

export default class Home extends View {
  public constructor() {
    super();
  }
  // @Override
  public render = (): void => {
    this._createHTML();
    this._bindEvents();
  };

  private _createHTML(): void {
    const body = document.querySelector('body') as HTMLBodyElement;
    body.innerHTML = `
    <form action="" method="get" class="weather-form">
        <div>
            <label for="weather-location">Location</label>
            <input type="text" id="weather-location" required aria-required="true">
        </div>
        <button class="weather-form__submit">Submit</button>
    </form>`;
  }

  private _bindEvents(): void {
    const submitButton = document.querySelector(
      '.weather-form__submit'
    ) as HTMLButtonElement;
    const weatherLocationInput = document.querySelector(
      '#weather-location'
    ) as HTMLInputElement;

    submitButton.addEventListener('click', (e: Event): void => {
      e.preventDefault();
      const weatherLocation = weatherLocationInput.value;
      weatherLocationInput.value = '';

      const weatherApi = new WeatherApi();
      weatherApi
        .getData(weatherLocation)
        .then((data): void => {
          console.log(data);
        })
        .catch((e: Error): void => {
          // Display error
        });
    });
  }
}
