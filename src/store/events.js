import { Event } from "../models/events/EventModel";
import { EventList } from "../collections/events/EventCollection";
import moment from "moment";

class EventStore {
  constructor(agenda) {
    console.log(agenda);
    this.eventArray = [];
    for (let data of agenda) {
      let startDate = moment(data.dateandtime.start).format(
        "MMMM DD YYYY, h:mm:ss a"
      );
      let endDate = moment(data.dateandtime.end).format(
        "MMMM DD YYYY, h:mm:ss a"
      );
      this.eventArray.push(
        new Event({
          title: data.title,
          organizer: data.organizer,
          fromDate: startDate,
          toDate: endDate,
          description: data.description ? data.description : null,
          attendees: data.attendees ? data.attendees : null
        })
      );
    }
    this.eventCollection = new EventList(this.eventArray);
  }
}

export { EventStore };
