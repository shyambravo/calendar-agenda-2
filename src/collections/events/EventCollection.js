import Backbone from "backbone";
import { Event } from "../../models/events/EventModel";

const EventList = Backbone.Collection.extend({
  // Reference to this collection's model.
  model: Event,

});

export { EventList };