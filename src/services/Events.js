import axios from "./axios";

//get calendar uid

const getCalendarUid = async (name) => {
  let calendars = await axios.get(
    "​https://calendar.zoho.com/api/v1/calendars"
  );
  if (calendars) {
    let uid = calendars.data.calendars.find((calendar) => calendar.name == name)
      .uid;
    if (uid) {
      return uid;
    } else {
      return 0;
    }
  }
};

//get Events by calendar name

//get Evens by calendar name and date

const getEventsByDate = async (fromDate, toDate, calendarName) => {
  let uid = await getCalendarUid(calendarName);
  if (uid != 0) {
    let events = await axios.get(
      `https://calendar.zoho.com/api/v1/calendars/${uid}/events`
    );
    if (events) {
      console.log(events);
    }
  }
};

export { getEventsByDate };
