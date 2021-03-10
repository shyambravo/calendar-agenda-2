import {agenda} from "../pages/home/textdata";

//get Evens by calendar name and date

const getEventsByDate = async (fromDate, toDate) => {
    if(fromDate && toDate) {
        return agenda.events;
    } else {
        return agenda.events;
    }
};

export { getEventsByDate };
