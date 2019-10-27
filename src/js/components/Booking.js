import {
  select,
  templates
} from '../settings.js';
//import {utils} from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HoursPicker from './HoursPicker.js';

class Booking {
  constructor(bookingWidget) {
    const thisBooking = this;

    thisBooking.render(bookingWidget);
    thisBooking.initWidgets();
  }

  render(element) {
    const thisBooking = this;
    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = {};
    thisBooking.dom.wrapper = element;
    thisBooking.dom.wrapper.innerHTML = generatedHTML;
    thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);
    thisBooking.dom.datePicker = document.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hoursPicker = document.querySelector(select.widgets.hourPicker.wrapper);
  }

  initWidgets() {
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hoursPicker = new HoursPicker(thisBooking.dom.hoursPicker);
  }
}
export default Booking;
