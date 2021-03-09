import { Event } from "../models/events/EventModel";
import { EventList } from "../collections/events/EventCollection";
import Backbone from "backbone";
import _ from "underscore";

class EventStore {
  constructor(agenda, f) {
    this.eventArray = [];
    for (let data of agenda) {
      this.eventArray.push(
        new Event({
          title: data.title,
          description: data.description,
          fromDate: data.date,
        })
      );
    }
    this.eventCollection = new EventList(this.eventArray);
    //this.resetArray = this.resetArray.bind(this);
    _.extend(this.eventCollection, Backbone.Events);
  }

  resetArray() {
    console.log("hit");
    this.eventCollection.remove(this.eventArray);
    console.log(this);
    this.eventCollection.trigger("update", this.eventCollection);
  }

  initializeEvents(f) {
    this.eventCollection.on("update", (data) => {
      console.log("trigegr");
      f(data);
    });
  }
}

export { EventStore };
