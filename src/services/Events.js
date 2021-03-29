// get Evens by calendar name and date

const getAccessToken = async (code) => {
  const token = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/authorization/${code}/${process.env.REACT_APP_CLIENT_ID}/${process.env.REACT_APP_CLIENT_SECRET}`,
  )
    .then((res) => res.text());

  return token;
};

const getEvents = async (token, cid, fromDate, toDate) => {
  let range = null;
  if (fromDate && toDate) {
    range = {
      start: fromDate,
      end: toDate,
    };
  }
  let params;
  if (range) {
    params = {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(range),
    };
  } else {
    params = {
      method: 'POST',
    };
  }
  const result = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/getEventList/${token}/${cid}`, params,
  ).then((res) => res.json());
  return result.events;
};

const getCalendarId = async (token, name) => {
  const result = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getCalendarName/${token}/${name}`).then((res) => res.json()).catch(() => 0);
  return result;
};

const getCalendars = async (token) => {
  const result = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getCalendars/${token}`).then((res) => res.json()).catch(() => 0);
  return result;
};

const editEvent = async (token, data) => {
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data),
  };
  const result = await fetch(`${process.env.REACT_APP_BACKEND_URL}/editEvent/${token}`, params).then((res) => res.json()).catch(() => 0);
  return result;
};

export {
  getEvents, getAccessToken, getCalendarId, getCalendars, editEvent,
};
