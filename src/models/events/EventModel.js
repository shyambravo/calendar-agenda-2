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
  

    setEvent: (data) => {
        this.save({
            tite: data.title,
            description: data.description,
            fromDate: data.fromDate,
            toDate: data.toDate,
            fromTime: data.fromTime,
            toTime: data.toTime
        });
    }
  });

  export {Event};