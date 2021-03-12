import CalendarModel from '../models/calendar/CalendarModel';

class CalendarStore {
  constructor(data) {
    this.calendar = new CalendarModel({ uid: data.uid, name: data.name });
  }

  changeCalendar = (uid, name) => {
    this.calendar.uid = uid;
    this.calendar.anme = name;
  };
}

export default CalendarStore;
