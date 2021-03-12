import Backbone from 'backbone';

const Event = Backbone.Model.extend({

  defaults: {
    title: '',
    description: '',
    date: '',
  },

});

export default Event;
