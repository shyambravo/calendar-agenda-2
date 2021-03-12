import Backbone from 'backbone';

const CalendarModel = Backbone.Model.extend({
  defaults: {
    uid: '',
    name: '',
  },
});

export default CalendarModel;
