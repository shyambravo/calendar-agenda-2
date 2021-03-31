import Backbone from 'backbone';

const Event = Backbone.Model.extend({
  urlRoot: '/api/v1/event',

  defaults: {
    id: '',
    title: '',
    description: '',
    etag: '',
  },

});

export default Event;
