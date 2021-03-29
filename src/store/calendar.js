import CalendarModel from '../models/calendar/CalendarModel';
import CalendarList from '../collections/calendars/CalendarCollection';

class CalendarStore {
  constructor(data) {
    this.calendarArray = [];
    data.forEach((e) => {
      this.calendarArray.push(new CalendarModel({
        id: e.uid,
        name: e.name,
        color: e.color,
      }));
    });
    this.calendarCollection = new CalendarList(this.calendarArray);
  }
}

export default CalendarStore;
