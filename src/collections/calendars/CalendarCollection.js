import Backbone from 'backbone';
import CalendarModel from '../../models/calendar/CalendarModel';

const CalendarList = Backbone.Collection.extend({
  // Reference to this collection's model.
  model: CalendarModel,
  url: '/api/v1/calendar',
});

export default CalendarList;
