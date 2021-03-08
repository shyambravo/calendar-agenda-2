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
    }
  }
};

//get Events by calendar name

//get Evens by calendar name and date

const getEventsByDate = async (fromDate, toDate, calendarName) => {
  let uid = await getCalendarUid(calendarName);
  let events = await axios.get(
    `https://calendar.zoho.com/api/v1/calendars/${uid}/events`
  );
  if (events) {
    return events.data;
  }
};

export { getEventsByDate };
