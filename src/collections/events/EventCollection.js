import Backbone from "backbone";
import { Event } from "../../models/events/EventModel";
import { getEventsByDate } from "../../services/Events";

const EventList = Backbone.Collection.extend({
  // Reference to this collection's model.
  model: Event,

  viewEvents: (fromDate, toDate) => {
    let events = getEventsByDate(fromDate, toDate);
    let eventsList = [];
    for(calendarEvent in events) {
        eventsList.push(new Event(calendarEvent));
    }
    return eventsList;
  },
});

export { EventList };
