import Backbone from 'backbone';

const Event = Backbone.Model.extend({

  defaults: {
    title: '',
    description: '',
  },

});

export default Event;
