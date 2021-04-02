// get Evens by calendar name and date
import moment from 'moment';

const verifyToken = () => {
  const tokenTime = sessionStorage.getItem('tokenTime');
  const currentTime = moment().format('YYYY MM DD, HH:mm:ss');
  if (moment(currentTime, 'YYYY MM DD, HH:mm:ss').isBefore(moment(tokenTime, 'YYYY MM DD, HH:mm:ss'))) {
    return true;
  }
  alert('Token expired');
  window.location = 'http://localhost:3000';

  return false;
};

const getAccessToken = async (code) => {
  const token = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/authorization/${code}/${process.env.REACT_APP_CLIENT_ID}/${process.env.REACT_APP_CLIENT_SECRET}`,
  )
    .then((res) => res.text());

  return token;
};

const getEvents = async (token, cid, fromDate, toDate) => {
  verifyToken();
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
  ).then((res) => {
    res.JSON();
  });
  if (result !== 0 && result !== 1) {
    return result.events;
  }
  return 0;
};

const getCalendars = async (token) => {
  verifyToken();
  const result = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getCalendars/${token}`).then((res) => {
    if (res.status === 200) {
      return res.json();
    } if (res.status === 401) {
      return 0;
    }
    return 1;
  });
  if (result !== 0 && result !== 1) {
    return result;
  }
  return 0;
};

const editEvent = async (data) => {
  verifyToken();
  const fromDate = moment(data.fromTime, 'YYYY-MM-DDTHH:mm').format('YYYYMMDDTHHmmSSZZ');
  const toDate = moment(data.toTime, 'YYYY-MM-DDTHH:mm').format('YYYYMMDDTHHmmSSZZ');
  const { timezone } = data.dateandtime;

  const obj = {
    etag: data.etag,
    uid: data.uid,
    estatus: 'updated',
    dateandtime: { start: fromDate, end: toDate, timezone },
    title: data.title,
    cid: data.cid,
    color: data.color,
    description: data.description,
  };

  // verifyToken();
  const token = sessionStorage.getItem('token');
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(obj),
  };
  const result = await fetch(`${process.env.REACT_APP_BACKEND_URL}/editEvent/${token}`, params).then((res) => {
    if (res.status === 200) {
      return res.json();
    }
    if (res.status === 401) {
      return 1;
    }
    return 0;
  });

  if (result !== 1 && result !== 0) {
    return result;
  }
  return 0;
};

const getnewtoken = async (refreshToken) => {
  const result = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getnewtoken/${refreshToken}/${process.env.REACT_APP_CLIENT_ID}/${process.env.REACT_APP_CLIENT_SECRET}`).then((res) => res.json()).catch(() => 0);
  return result;
};

const fetcheventdetails = async (cid, eid) => {
  verifyToken();
  const token = sessionStorage.getItem('token');
  const result = await fetch(`${process.env.REACT_APP_BACKEND_URL}/geteventdetails/${token}/${cid}/${eid}`).then((res) => {
    if (res.status === 200) {
      return res.json();
    } if (res.status === 401) {
      return 1;
    }
    return 0;
  });
  if (result !== 1 && result !== 0) {
    return result;
  }
  return 0;
};

export {
  getEvents, getAccessToken, getCalendars, editEvent, verifyToken, getnewtoken, fetcheventdetails,
};
