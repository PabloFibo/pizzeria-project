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
  //  thisMainPage.naviMainDisabled();
  }


  slider() {
    const thisMainPage = this;
    thisMainPage.slideIndex = 0;
    thisMainPage.dotsIndex = 0;

    setInterval(function() {
      for (let slide of thisMainPage.dom.sliderElem) { //usuwa klase active z slajdów
        slide.classList.remove(classNames.slider.sliderActive);
      }

      thisMainPage.slideIndex += 1;
      let slides = thisMainPage.dom.sliderElem;

      for (let i = 0; i < slides.length; i++) {
        if (thisMainPage.slideIndex > slides.length - 1) {
          thisMainPage.slideIndex = 0;
        }
        slides[thisMainPage.slideIndex].classList.add(
          classNames.slider.sliderActive);
      }

      for (let dot of thisMainPage.dom.dots) { //usuwa klase active z dots
        dot.classList.remove(classNames.slider.dotsActive);
      }

      thisMainPage.dotsIndex += 1;
      let dots = thisMainPage.dom.dots;

      for (let i = 0; i < dots.length; i++) {
        if (thisMainPage.dotsIndex > dots.length - 1) {
          thisMainPage.dotsIndex = 0;

        }
        dots[thisMainPage.dotsIndex].classList.add(
          classNames.slider.dotsActive);
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
    thisMainPage.dom.dots = document.querySelectorAll(select.nav.dots);
    thisMainPage.dom.navDisabled = document.querySelectorAll(select.nav.links);
  }
}

export default MainPage;
