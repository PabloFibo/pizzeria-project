import {
//  select,
  templates,
//  settings,
//  classNames
} from '../settings.js';
import {
//  utils
} from '../utils.js';


class MainPage {
  constructor(element) {
    const thisMainPage = this;

    thisMainPage.render(element);

  }

  render(element){
    const thisMainPage = this;
    const generatedHTML = templates.mainPage();

    thisMainPage.dom = {};
    thisMainPage.dom.wrapper = element;
    thisMainPage.dom.wrapper.innerHTML = generatedHTML;

  }
}

export default MainPage;
