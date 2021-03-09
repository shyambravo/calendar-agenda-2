import Backbone from 'backbone';
const Event = Backbone.Model.extend({

    defaults: {
        title: "",
        description: "",
        fromDate: "",
        toDate: "",
        fromTime: "",
        toTime: "",
    },
  

  });

  export {Event};