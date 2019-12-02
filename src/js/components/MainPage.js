import {
  select,
  templates,
  //settings,
  classNames
} from '../settings.js';
import {
//  utils
} from '../utils.js';


class MainPage {
  constructor(element) {
    const thisMainPage = this;

    thisMainPage.render(element);
    thisMainPage.slider();
  }


  slider() {
    const thisMainPage = this;
    thisMainPage.slideIndex = 0;

    setInterval(function() {
      for (let slide of thisMainPage.dom.sliderElem) {
        slide.classList.remove(classNames.slider.sliderActive);
      }

      thisMainPage.slideIndex += 1;
      console.log(thisMainPage.slideIndex);
      for(let slide of thisMainPage.dom.sliderElem){
        if (thisMainPage.slideIndex > thisMainPage.dom.sliderElem.length - 1) {
          thisMainPage.slideIndex = 0;
        }
        slide.classList.add(classNames.slider.sliderActive);
      }
    }, 3000);
  }

  render(element) {
    const thisMainPage = this;
    const generatedHTML = templates.mainPage();

    thisMainPage.dom = {};
    thisMainPage.dom.wrapper = element;
    thisMainPage.dom.wrapper.innerHTML = generatedHTML;
    thisMainPage.dom.carousel = document.querySelectorAll(select.containerOf.carousel);
    thisMainPage.dom.sliderElem = document.querySelectorAll(select.slider.sliderElem);
    thisMainPage.dom.orderBtn = document.querySelector(select.nav.order);
    thisMainPage.dom.bookingBtn = document.querySelector(select.nav.booking);
    console.log(thisMainPage.dom.sliderElem);
  }
}

export default MainPage;
