import Home from './view/Home';
import './scss/main.scss';

document.addEventListener('DOMContentLoaded', (): void => {
  const home = new Home();
  home.render();
});
