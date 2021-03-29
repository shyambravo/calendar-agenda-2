import Backbone from 'backbone';

const CalendarModel = Backbone.Model.extend({
  urlRoot: '/api/v1/calendar',
  defaults: {
    uid: '',
    name: '',
    color: '',
  },
});

export default CalendarModel;
