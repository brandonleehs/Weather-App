import WeatherApi from '../api/WeatherApi';
import { DayData } from '../api/WeatherData';
import WeatherIcons from '../api/WeatherIcons';
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
    <form action="" method="get" class="home__form">
    <section class="home__hero">
      <h1 class="home__heading"><span class="home__logo">Sky</span>Track</h1>
      <p class="home__subheading">Real time forecasts tailored to your location.</p>
    </section>
    <section class="home__search">
    <div class="searchbar">
      <input type="text" class="searchbar__input" required aria-required="true" placeholder="Location"><button class="searchbar__submit">Search</button>
    </div>
    <div class="unit">
      <button class="celsius" type="button">&deg;C</button><button class="fahrenheit" type="button">&deg;F</button>
    </div>
    </section>
    </form>`;
  }

  private _bindEvents = (): void => {
    this._bindSubmitEvent();
    this._bindUnitButtons();
  };

  private _bindSubmitEvent(): void {
    const submitButton = document.querySelector(
      '.searchbar__submit'
    ) as HTMLButtonElement;
    const weatherLocationInput = document.querySelector(
      '.searchbar__input'
    ) as HTMLInputElement;

    submitButton.addEventListener('click', (e: Event): void => {
      const weatherLocation = weatherLocationInput.value;
      if (!weatherLocation) {
        return;
      }
      e.preventDefault();
      weatherLocationInput.value = '';

      const dataDisplay: HTMLElement | null =
        document.querySelector('.data-display');
      if (dataDisplay) {
        dataDisplay.remove();
      }

      const newDataDisplay = document.createElement('section') as HTMLElement;
      newDataDisplay.classList.add('data-display');
      newDataDisplay.innerHTML = `
      <p class="loading">Fetching weather data...</p>
      `;
      const unit = document.querySelector('.unit') as HTMLDivElement;
      unit.insertAdjacentElement('afterend', newDataDisplay);

      const weatherApi = new WeatherApi();
      const dataPromise =
        localStorage.getItem('unit') === 'celsius'
          ? weatherApi.getData(weatherLocation, 'metric')
          : weatherApi.getData(weatherLocation, 'us');

      dataPromise
        .then((data): void => {
          const currentDay: DayData = data.days[0];
          let weatherIcon: WeatherIcons;
          if (currentDay.conditions.toLowerCase().includes('clear')) {
            weatherIcon = WeatherIcons.CLEAR;
            newDataDisplay.classList.add('data-display--clear');
          } else if (currentDay.conditions.toLowerCase() === 'cloudy') {
            weatherIcon = WeatherIcons.CLOUDY;
            newDataDisplay.classList.add('data-display--cloudy');
          } else if (currentDay.conditions.toLowerCase().includes('rain')) {
            weatherIcon = WeatherIcons.RAIN;
            newDataDisplay.classList.add('data-display--rain');
          } else if (currentDay.conditions.toLowerCase().includes('storm')) {
            weatherIcon = WeatherIcons.STORM;
            newDataDisplay.classList.add('data-display--storm');
          } else if (currentDay.conditions.toLowerCase().includes('snow')) {
            weatherIcon = WeatherIcons.SNOW;
            newDataDisplay.classList.add('data-display--snow');
          } else {
            weatherIcon = WeatherIcons.PARTIALLY_CLOUDY;
            newDataDisplay.classList.add('data-display--partially-cloudy');
          }

          newDataDisplay.innerHTML = `
          <header>
            <p class="resolvedaddress">${
              data.resolvedAddress
            }</p><p class="datetime">${currentDay.datetime}</p>
          </header>
          <main>
            <p class="temp ${localStorage.getItem('unit')}">${
            currentDay.temp
          }</p>
            <p class="feelslike ${localStorage.getItem('unit')}">${
            currentDay.feelslike
          }</p>
            <p class="description">${currentDay.description}</p>
          </main>
          <footer>
          <div class="info info--humidity">
            ${WeatherIcons.HUMIDITY}
            <p class="humidity">${currentDay.humidity}</p>
          </div>
          <div class="info info--windspeed">
            ${WeatherIcons.WINDSPEED}
            <p class="windspeed ${
              localStorage.getItem('unit') === 'celsius' ? 'kph' : 'mph'
            }">${currentDay.windspeed}</p>
          </div>
          <div class="info info--conditions">
            ${weatherIcon}
            <p class="conditions">${currentDay.conditions}</p>
          </div>
          </footer>
          `;
        })
        .catch((e: Error): void => {
          const dataDisplay = document.querySelector(
            '.data-display'
          ) as HTMLElement;
          dataDisplay.innerHTML = `
          <p class="error">❌ Oops! Unable to fetch weather data. Please check your location and try again.</p>
          `;
        });
    });
  }

  private _bindUnitButtons(): void {
    const unit = storageAvailable('localStorage')
      ? localStorage.getItem('unit')
      : null;
    const celsiusButton = document.querySelector(
      '.celsius'
    ) as HTMLButtonElement;
    const fahrenheitButton = document.querySelector(
      '.fahrenheit'
    ) as HTMLButtonElement;

    if (!unit || unit == 'celsius') {
      celsiusButton.classList.add('active');
      localStorage.setItem('unit', 'celsius');
    } else {
      fahrenheitButton.classList.add('active');
      localStorage.setItem('unit', 'fahrenheit');
    }

    celsiusButton.addEventListener('click', (e: Event): void => {
      if (localStorage.getItem('unit') == 'celsius') {
        return;
      }
      celsiusButton.classList.add('active');
      fahrenheitButton.classList.remove('active');

      localStorage.setItem('unit', 'celsius');
      const temp = document.querySelector('.temp') as HTMLParagraphElement;
      const feelslike = document.querySelector(
        '.feelslike'
      ) as HTMLParagraphElement;
      const windspeed = document.querySelector(
        '.windspeed'
      ) as HTMLParagraphElement;
      temp.className = 'temp celsius';
      feelslike.className = 'feelslike celsius';
      windspeed.className = 'windspeed kph';
      temp.innerText = getCelsius(parseFloat(temp.innerText)).toString();
      feelslike.innerText = getCelsius(
        parseFloat(feelslike.innerText)
      ).toString();
      windspeed.innerText = (
        Math.round(parseFloat(windspeed.innerText) * 0.621371 * 10) / 10
      ).toString();
    });

    fahrenheitButton.addEventListener('click', (e: Event): void => {
      if (localStorage.getItem('unit') == 'fahrenheit') {
        return;
      }
      fahrenheitButton.classList.add('active');
      celsiusButton.classList.remove('active');

      localStorage.setItem('unit', 'fahrenheit');

      const temp = document.querySelector('.temp') as HTMLParagraphElement;
      const feelslike = document.querySelector(
        '.feelslike'
      ) as HTMLParagraphElement;
      const windspeed = document.querySelector(
        '.windspeed'
      ) as HTMLParagraphElement;
      temp.className = 'temp fahrenheit';
      feelslike.className = 'feelslike fahrenheit';
      windspeed.className = 'windspeed mph';
      temp.innerText = getFahrenheit(parseFloat(temp.innerText)).toString();
      feelslike.innerText = getFahrenheit(
        parseFloat(feelslike.innerText)
      ).toString();
      windspeed.innerText = (
        Math.round(parseFloat(windspeed.innerText) * 1.60934 * 10) / 10
      ).toString();
    });
  }
}

declare global {
  interface Window {
    setItem: (x: any, y: any) => void;
    removeItem: (x: any) => void;
  }
}

function storageAvailable(type: any) {
  let storage;
  try {
    storage = window[type];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      e.name === 'QuotaExceededError' &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

function getFahrenheit(celsius: number): number {
  return Math.round(((celsius * 9) / 5 + 32) * 10) / 10;
}

function getCelsius(fahrenheit: number): number {
  return Math.round((((fahrenheit - 32) * 5) / 9) * 10) / 10;
}
