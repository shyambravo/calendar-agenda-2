/* eslint-disable no-restricted-syntax */
import moment from 'moment';
import Event from '../models/events/EventModel';
import EventList from '../collections/events/EventCollection';
import { getEvents } from '../services/Events';

class EventStore {
  constructor(agenda) {
    this.eventArray = [];
    for (const data of agenda) {
      const startDate = moment(data.dateandtime.start).format(
        'dddd, MMMM Do YYYY, h:mm:ss a',
      );
      const endDate = moment(data.dateandtime.end).format(
        'dddd, MMMM Do YYYY, h:mm:ss a',
      );
      this.eventArray.push(
        new Event({
          title: data.title,
          organizer: data.organizer,
          fromDate: startDate,
          toDate: endDate,
          location: data.location ? data.location : null,
          description: data.description ? data.description : null,
          attendees: data.attendees ? data.attendees : null,
        }),
      );
    }
    this.eventCollection = new EventList(this.eventArray);
  }

  updateEvents = async (fromDate, toDate, cid, token) => {
    const eventArray = await getEvents(token, cid, fromDate, toDate);
    this.eventCollection.reset();
    if (eventArray.length > 0 && eventArray[0].message !== 'No events found.') {
      for (const data of eventArray) {
        const startDate = moment(data.dateandtime.start).format(
          'dddd, MMMM Do YYYY, h:mm:ss a',
        );
        const endDate = moment(data.dateandtime.end).format(
          'dddd, MMMM Do YYYY, h:mm:ss a',
        );
        this.eventCollection.add(
          new Event({
            title: data.title,
            organizer: data.organizer,
            fromDate: startDate,
            toDate: endDate,
            location: data.location ? data.location : null,
            description: data.description ? data.description : null,
            attendees: data.attendees ? data.attendees : null,
          }),
        );
      }
      return true;
    }
    return false;
  };
}

export default EventStore;
