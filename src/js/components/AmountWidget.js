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
    console.log(thisWidget.dom.input);

    thisWidget.dom.inputHalf = thisWidget.dom.wrapper.querySelector(select.widgets.amount.inputHalf);
    console.log(thisWidget.dom.inputHalf);
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
    console.log(thisWidget.value);
    thisWidget.dom.inputHalf.value = thisWidget.valuehalf;
    console.log(thisWidget.dom.inputHalf.valuehalf);
  }

  initActions() {
    const thisWidget = this;

    thisWidget.dom.input.addEventListener('change', function() {
      //event.preventDefault();
      thisWidget.setValue(thisWidget.dom.input.value);
    });

    if (thisWidget.dom.inputHalf) {
      thisWidget.dom.inputHalf.addEventListener('change', function(event) {
        event.preventDefault();
        thisWidget.setValue(thisWidget.dom.inputHalf.value);
      });
    }
    thisWidget.dom.linkDecrease.addEventListener('click', function(event) {
      event.preventDefault();
      thisWidget.setValue(thisWidget.value - 1);
    });

    thisWidget.dom.linkIncrease.addEventListener('click', function(event) {
      event.preventDefault();
      thisWidget.setValue(thisWidget.value + 1);
    });
    /*
    thisWidget.dom.halfDecrease.addEventListener('click', function(event){
      event.preventDefault();
      thisWidget.setValue(thisWidget.valuehalf - 0.5);
    });

    thisWidget.dom.halfIncrease.addEventListener('click', function(event){
      event.preventDefault();
      thisWidget.setValue(thisWidget.valuehalf + 0.5);
    });*/
  }

}

export default AmountWidget;
