//get Evens by calendar name and date

const getAccessToken = async (code) => {
  let token = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/authorization/${code}/${process.env.REACT_APP_CLIENT_ID}/${process.env.REACT_APP_CLIENT_SECRET}`
  )
    .then((res) => res.text());

  return token;
};

const getEvents = async (token) => {
  let result = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/getEventList/${token}/${process.env.REACT_APP_CALENDAR_ID}`
  ).then((res) => res.json());
  
  return result.events;
};

export { getEvents, getAccessToken };
