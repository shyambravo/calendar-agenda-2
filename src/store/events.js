/* eslint-disable no-restricted-syntax */
import moment from 'moment';
import Event from '../models/events/EventModel';
import EventList from '../collections/events/EventCollection';
import { getEvents, editEvent } from '../services/Events';

class EventStore {
  constructor(agenda, cb) {
    this.eventArray = [];
    for (const data of agenda) {
      const startDate = moment(data.dateandtime.start).format(
        'dddd, MMMM Do YYYY, h:mm:ss a',
      );
      const endDate = moment(data.dateandtime.end).format(
        'dddd, MMMM Do YYYY, h:mm:ss a',
      );
      const date = moment(data.dateandtime.start).format('YYYY-MM-DD');
      const unixDate = moment(date, 'YYYY-MM-DD').format('x');
      this.eventArray.push(
        new Event({
          id: data.uid,
          title: data.title,
          organizer: data.organizer,
          fromDate: startDate,
          toDate: endDate,
          date: unixDate,
          location: data.location ? data.location : null,
          description: data.description ? data.description : null,
          attendees: data.attendees ? data.attendees : null,
          color: data.color,
          etag: data.etag,
          dateandtime: data.dateandtime,
        }),
      );
    }

    this.eventCollection = new EventList(this.eventArray);
    this.eventCollection.on('all', () => {
      cb();
    });
  }

  updateEvents = async (fromDate, toDate, cid, token) => {
    const eventArray = await getEvents(token, cid, fromDate, toDate);
    if (eventArray !== 0) {
      this.eventCollection.reset();
      if (eventArray.length > 0 && eventArray[0].message !== 'No events found.') {
        for (const data of eventArray) {
          const startDate = moment(data.dateandtime.start).format(
            'dddd, MMMM Do YYYY, h:mm:ss a',
          );
          const endDate = moment(data.dateandtime.end).format(
            'dddd, MMMM Do YYYY, h:mm:ss a',
          );
          const date = moment(data.dateandtime.start).format('YYYY-MM-DD');
          const unixDate = moment(date, 'YYYY-MM-DD').format('x');
          this.eventCollection.add(
            new Event({
              id: data.uid,
              title: data.title,
              organizer: data.organizer,
              fromDate: startDate,
              toDate: endDate,
              date: unixDate,
              location: data.location ? data.location : null,
              description: data.description ? data.description : null,
              attendees: data.attendees ? data.attendees : null,
              color: data.color,
              etag: data.etag,
              dateandtime: data.dateandtime,
            }),
          );
        }
        return true;
      }
    } else {
      alert('Token Expired');
      window.location('http://localhost:3000');
    }
    return false;
  };

  updateSingleEvent = async (data) => {
    const result = await editEvent(data);
    if (result !== 0 && result.events) {
      if (result.events.length > 0) {
        const fromDate = moment(data.fromTime, 'YYYY-MM-DDTHH:mm').format('dddd, MMMM Do YYYY, h:mm:ss a');
        const toDate = moment(data.toTime, 'YYYY-MM-DDTHH:mm').format('dddd, MMMM Do YYYY, h:mm:ss a');
        const updateModel = this.eventCollection.get(data.uid);
        const { etag } = result.events[0];
        updateModel.set({
          title: data.title, fromDate, toDate, etag, color: data.color,
        });
        this.eventCollection.create(updateModel);
      }
    } else {
      alert('Token Expied');
      window.location = 'http://localhost:3000';
    }
    return result;
  }
}

export default EventStore;
