import Backbone from 'backbone';

const Event = Backbone.Model.extend({
  urlRoot: '/api/v1/event',

  defaults: {
    title: '',
    description: '',
  },

});

export default Event;
