// get Evens by calendar name and date

const getAccessToken = async (code) => {
  const token = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/authorization/${code}/${process.env.REACT_APP_CLIENT_ID}/${process.env.REACT_APP_CLIENT_SECRET}`,
  )
    .then((res) => res.text());

  return token;
};

const getEvents = async (token, cid) => {
  const result = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/getEventList/${token}/${cid}`,
  ).then((res) => res.json());
  return result.events;
};

const getCalendarId = async (token, name) => {
  const result = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getCalendarName/${token}/${name}`).then((res) => res.json()).catch(() => 0);

  return result;
};

export { getEvents, getAccessToken, getCalendarId };
