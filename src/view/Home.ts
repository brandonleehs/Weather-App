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

      const dataDisplay = document.createElement('section') as HTMLElement;
      dataDisplay.classList.add('data-display');
      dataDisplay.innerHTML = `
      <p class="loading">Fetching weather data...</p>
      `;
      const unit = document.querySelector('.unit') as HTMLDivElement;
      unit.insertAdjacentElement('afterend', dataDisplay);

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
    } else {
      fahrenheitButton.classList.add('active');
    }

    celsiusButton.addEventListener('click', (e: Event): void => {
      celsiusButton.classList.add('active');
      fahrenheitButton.classList.remove('active');

      localStorage.setItem('unit', 'celsius');
    });
    fahrenheitButton.addEventListener('click', (e: Event): void => {
      fahrenheitButton.classList.add('active');
      celsiusButton.classList.remove('active');

      localStorage.setItem('unit', 'fahrenheit');
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
