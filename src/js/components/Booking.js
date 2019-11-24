import {
  select,
  templates,
  settings,
  classNames
} from '../settings.js';
import {
  utils
} from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HoursPicker.js';

class Booking {
  constructor(element) {
    const thisBooking = this;

    thisBooking.render(element);
    thisBooking.initWidgets();
    thisBooking.getData();
    thisBooking.getTable();
  }

  getData() {
    const thisBooking = this;

    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);

    const params = {
      booking: [
        startDateParam,
        endDateParam,
      ],
      eventsCurrent: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam,
      ],
      eventsRepeat: [
        settings.db.repeatParam,
        endDateParam,
      ]
    };

    const urls = {
      booking: settings.db.url + '/' + settings.db.booking + '?' + params.booking.join('&'),
      eventsCurrent: settings.db.url + '/' + settings.db.event + '?' + params.eventsCurrent.join('&'),
      eventsRepeat: settings.db.url + '/' + settings.db.event + '?' + params.eventsRepeat.join('&'),
    };
    console.log('urls', urls);

    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function(allResponses) {
        const bookingsResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function([bookings, eventsCurrent, eventsRepeat]) {
        //console.log(bookings);
        //console.log(eventsCurrent);
        //console.log(eventsRepeat);
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
  }

  parseData(bookings, eventsCurrent, eventsRepeat) {
    const thisBooking = this;

    thisBooking.booked = {};

    for (let item of bookings) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }
    for (let item of eventsCurrent) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;

    for (let item of eventsRepeat) {
      if (item.repeat == 'daily') {
        for (let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)) {
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }
    }
    thisBooking.updateDOM();
  }

  makeBooked(date, hour, duration, table) {
    const thisBooking = this;

    if (typeof thisBooking.booked[date] == 'undefined') {
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);

    for (let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5) {
      if (typeof thisBooking.booked[date][hourBlock] == 'undefined') {
        thisBooking.booked[date][hourBlock] = [];
      }

      thisBooking.booked[date][hourBlock].push(table);
    }
  }

  updateDOM() {
    const thisBooking = this;

    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

    let allAvailable = false;

    if (
      typeof thisBooking.booked[thisBooking.date] == 'undefined' ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ) {
      allAvailable = true;
    }

    for (let table of thisBooking.dom.tables) {
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if (!isNaN(tableId)) {
        tableId = parseInt(tableId);
      }

      if (
        !allAvailable &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ) {
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
  }

  getTable() { // funkcja pozwala zaznaczyć rezerwacje stolika
    const thisBooking = this;

    for (let table of thisBooking.dom.tables) {
      table.addEventListener('click', function() {
        event.preventDefault();

        for (let tableClass of thisBooking.dom.tables) {
          tableClass.classList.remove(classNames.booking.tableChoose);
        }
        table.classList.add(classNames.booking.tableChoose);
        thisBooking.reservation = table.getAttribute(settings.booking.tableIdAttribute);
        console.log(typeof(thisBooking.reservation));
      });
    }

    thisBooking.hourSet = thisBooking.hourPicker.dom.input;
    thisBooking.dateSet = thisBooking.datePicker.dom.input;

    thisBooking.hourSet.addEventListener('change', function(){  //usuwa zaznaczony stolik po zmianie godz.
      for(let table of thisBooking.dom.tables){
        table.classList.remove(classNames.booking.tableChoose);
      }
    });

    thisBooking.dateSet.addEventListener('change', function(){  //usuwa zaznaczony stolik po zmianie daty
      for(let table of thisBooking.dom.tables){
        table.classList.remove(classNames.booking.tableChoose);
      }
    });
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
    thisBooking.dom.hourPicker = document.querySelector(select.widgets.hourPicker.wrapper);
    thisBooking.dom.tables = element.querySelectorAll(select.booking.tables);
    thisBooking.dom.starterPick = element.querySelectorAll(select.booking.starters);
    thisBooking.dom.bookingSub = element.querySelector(select.booking.bookingSubmit);
    thisBooking.dom.telephon = element.querySelector(select.booking.telephon);
    thisBooking.dom.address = element.querySelector(select.booking.address);

    console.log(thisBooking.dom.bookingSub);
  }

  sendBooking() {   // przesyła dane do API, blokuje rezerwacje
    const thisBooking = this;
    const url = settings.db.url + '/' + settings.db.booking;
    console.log(url);

    const payload = {
      date: thisBooking.datePicker.value,
      hour: thisBooking.hourPicker.value,
      table: parseInt([thisBooking.reservation]),
      duration: thisBooking.hoursAmount.value,
      ppl: thisBooking.peopleAmount.value,
      telephon: thisBooking.dom.telephon.value,
      address: thisBooking.dom.address.value,
      starters: [],
    };
    console.log(typeof(payload.table));
    thisBooking.makeBooked(thisBooking.datePicker.value, thisBooking.hourPicker.value, thisBooking.hoursAmount.value, payload.table);

    for (let starter of thisBooking.dom.starterPick) {
      if (starter.checked == true) {
        payload.starters.push(starter.value);
      }
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options)
      .then(function(response) {
        console.log(response);
        return response.json();
      })
      .then(function(parsedResponse) {
        console.log('bookingResponse:', parsedResponse);
        for (let tableClass of thisBooking.dom.tables) {
          tableClass.classList.add(classNames.booking.tableBooked);
        }
      });
  }

  initWidgets() {
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

    thisBooking.dom.wrapper.addEventListener('updated', function() {
      thisBooking.updateDOM();
    });

    thisBooking.dom.bookingSub.addEventListener('click', function() {
      event.preventDefault();
      thisBooking.sendBooking();
    });

  }
}
export default Booking;
