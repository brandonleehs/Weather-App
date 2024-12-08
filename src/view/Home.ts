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
      <h1 class="home__heading">SkyTrack</h1>
      <p class="home__subheading">Real time forecasts tailored to your location.</p>
    </section>
    <div class="searchbar">
      <input type="text" class="searchbar__input" required aria-required="true" placeholder="Location"><button class="searchbar__submit">Search</button>
    </div>
    </form>`;
  }

  private _bindEvents(): void {
    const submitButton = document.querySelector(
      '.searchbar__submit'
    ) as HTMLButtonElement;
    const weatherLocationInput = document.querySelector(
      '.searchbar__input'
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
