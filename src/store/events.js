import moment from 'moment';
import Event from '../models/events/EventModel';
import EventList from '../collections/events/EventCollection';

class EventStore {
  constructor(agenda) {
    this.eventArray = [];
    for (const data of agenda) {
      const startDate = moment(data.dateandtime.start).format(
        'MMMM DD YYYY, h:mm:ss a',
      );
      const endDate = moment(data.dateandtime.end).format(
        'MMMM DD YYYY, h:mm:ss a',
      );
      this.eventArray.push(
        new Event({
          title: data.title,
          organizer: data.organizer,
          fromDate: startDate,
          toDate: endDate,
          description: data.description ? data.description : null,
          attendees: data.attendees ? data.attendees : null,
        }),
      );
    }
    this.eventCollection = new EventList(this.eventArray);
  }
}

export default EventStore;
