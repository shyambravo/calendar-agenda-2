//get Evens by calendar name and date

const getAccessToken = async (code) => {
  let token = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/authorization/${code}/${process.env.REACT_APP_CLIENT_ID}/${process.env.REACT_APP_CLIENT_SECRET}`
  )
    .then((res) => res.text());

  return token;
};

const getEvents = async (token, cid) => {
  let result = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/getEventList/${token}/${cid}`
  ).then((res) => res.json());
  console.log(result);
  return result.events;
};

const getCalendarId = async (token, name) => {
  let result = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getCalendarName/${token}/${name}`).then(res => res.json()).catch(err => 0);

  return result;
}

export { getEvents, getAccessToken, getCalendarId };
