import {
  select,
  settings
} from '../settings.js';
import BaseWidget from './BaseWidget.js';

class AmountWidget extends BaseWidget {
  constructor(element) {
    super(element, settings.amountWidget.defaultValue, settings.amountWidget.halfValue);
    const thisWidget = this;

    thisWidget.getElements(element);
    thisWidget.initActions();
    //console.log('AmountWidget:', thisWidget);
    //console.log('constructor arguments:', element);
  }

  getElements() {
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
    thisWidget.dom.halfDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.halfDecrease);
    thisWidget.dom.halfIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.halfIncrease);
  }

  isValid(value) {
    return !isNaN(value) &&
      value >= settings.amountWidget.defaultMin &&
      value <= settings.amountWidget.defaultMax;
  }

  renderValue() {
    const thisWidget = this;

    thisWidget.dom.input.value = thisWidget.value;
  }

  initActions() {
    const thisWidget = this;

    thisWidget.dom.input.addEventListener('change', function() {
      //event.preventDefault();
      thisWidget.setValue(thisWidget.dom.input.value);
    });

    if(thisWidget.dom.halfDecrease){  //zmiejsza czas rezerwacji o 0.5h
      thisWidget.dom.halfDecrease.addEventListener('click', function(event){
        event.preventDefault();
        thisWidget.setValue(thisWidget.value - 0.5);
      });
    }

    if(thisWidget.dom.halfIncrease){  //zwiększa czas rezerwacji o 0.5h
      thisWidget.dom.halfIncrease.addEventListener('click', function(event){
        event.preventDefault();
        thisWidget.setValue(thisWidget.value + 0.5);
      });
    }

    thisWidget.dom.linkDecrease.addEventListener('click', function(event) {  //zmniesza czas rezerwacji o 1h
      event.preventDefault();
      thisWidget.setValue(thisWidget.value - 1);
    });

    thisWidget.dom.linkIncrease.addEventListener('click', function(event) {  //zwiększa czas rezerwacji o 1h
      event.preventDefault();
      thisWidget.setValue(thisWidget.value + 1);
    });
  }

}

export default AmountWidget;
