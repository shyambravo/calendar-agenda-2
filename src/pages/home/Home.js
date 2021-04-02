import React, { Component } from 'react';
import './Home.css';
import moment from 'moment';
import queryString from 'query-string';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { FormControl, InputLabel } from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import EventStore from '../../store/events';
import MonthView from './MonthView';
import DayView from './DayView';
import CalendarStore from '../../store/calendar';
import pkg from '../../../package.json';

import {
  getEvents,
  getAccessToken,
  getCalendars,
  getnewtoken,
} from '../../services/Events';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calendarStore: null,
      calendarList: [],
      eventList: [],
      fromDate: moment().format('YYYY-MM-DD'),
      toDate: moment().format('YYYY-MM-DD'),
      token: null,
      isLoading: true,
      cid: '0',
      eventStore: null,
      page: 0,
      eventObj: null,
      calColor: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.filterByDate = this.filterByDate.bind(this);
    this.handleFromDate = this.handleFromDate.bind(this);
    this.handleToDate = this.handleToDate.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.filterByDate = this.filterByDate.bind(this);
    this.storeByKeys = this.storeByKeys.bind(this);
    this.updateCollection = this.updateCollection.bind(this);
  }

  async componentDidMount() {
    const { location } = this.props;
    let refreshToken = localStorage.getItem('refreshToken');
    let token;
    let tokenTime;
    if (refreshToken !== null) {
      const newToken = await getnewtoken(refreshToken);
      token = newToken.access_token;
    } else {
      const parsed = queryString.parse(location.search).code;
      token = await getAccessToken(parsed);
      token = JSON.parse(token);
      refreshToken = token.refresh_token;
      token = token.access_token;
    }
    tokenTime = moment().format('YYYY MM DD, HH:mm:ss');
    tokenTime = moment(tokenTime, 'YYYY MM DD, HH:mm:ss').add(3500, 'seconds');
    sessionStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    sessionStorage.setItem(
      'tokenTime',
      moment(tokenTime).format('YYYY MM DD, HH:mm:ss'),
    );

    this.setState({
      token,
    });
    const result = await getCalendars(token);
    this.setState({
      calendarList: [],
      isLoading: false,
    });
    if (result !== 0) {
      if (result.calendars && result.calendars.length > 0) {
        const calendarStore = new CalendarStore(result.calendars);
        this.setState({
          calendarStore,
          calendarList: calendarStore.calendarCollection.toJSON(),
        });
      }
    } else {
      alert('invalid token');
      window.location = 'http://localhost:3000';
    }
  }

  handleChange = (e) => {
    this.setState(
      {
        cid: e.target.value,
      },
      () => this.selectCalendar(),
    );
  };

  handleFromDate = (e) => {
    this.setState(
      {
        fromDate: e,
      },
      () => this.filterByDate(),
    );
  };

  handleToDate = (e) => {
    this.setState(
      {
        toDate: e,
      },
      () => this.filterByDate(),
    );
  };

  storeByKeys = (arr) => {
    const eventObj = {};
    for (let i = 0; i < arr.length; i += 1) {
      if (Object.prototype.hasOwnProperty.call(eventObj, arr[i].dateSort)) {
        eventObj[arr[i].dateSort].push(arr[i]);
      } else {
        eventObj[`${arr[i].dateSort}`] = [];
        eventObj[`${arr[i].dateSort}`].push(arr[i]);
      }
    }
    this.setState({
      eventObj,
    });
    return arr;
  };

  filterRange = async (eventStore, start, end, cid, token) => {
    this.setState({
      eventList: null,
      isLoading: true,
    });
    const result = await eventStore.updateEvents(start, end, cid, token);
    if (result === false) {
      alert('No Events found.');
      this.setState({
        eventList: [],
        isLoading: false,
      });
    } else {
      const sortedArray = await this.storeByKeys(
        eventStore.eventCollection.toJSON(),
      );
      this.setState({
        eventList: sortedArray,
        isLoading: false,
      });
    }
  };

  updateCollection = async () => {
    const { eventStore } = this.state;
    this.setState({
      eventList: eventStore.eventCollection.toJSON(),
    });
    const result = await this.storeByKeys(eventStore.eventCollection.toJSON());
    this.storeByKeys(result);
  };

  filterByDate = async () => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    const {
      eventStore, fromDate, toDate, cid, token, page,
    } = this.state;
    const start = moment(fromDate).format('YYYYMMDD');
    const end = moment(toDate).format('YYYYMMDD');
    const a = moment(start);
    const b = moment(end);
    if (page === 0) {
      if (
        cid !== '0'
        && token
        && fromDate
        && toDate
        && Math.abs(a.diff(b, 'day')) < 30
      ) {
        this.filterRange(eventStore, start, end, cid, token);
      } else {
        alert('No calendar is selected or improper date');
      }
    } else if (cid !== '0' && token && fromDate) {
      this.filterRange(eventStore, start, start, cid, token);
    } else {
      alert('No calendar is selected or improper date');
    }
  };

  selectCalendar = async () => {
    this.setState({
      isLoading: true,
    });
    const {
      token, cid, fromDate, toDate, calendarStore,
    } = this.state;
    const calendarId = cid;
    const start = moment(fromDate).format('YYYYMMDD');
    const end = moment(toDate).format('YYYYMMDD');
    const a = moment(start);
    const b = moment(end);
    if (
      cid !== '0'
      && token
      && fromDate
      && toDate
      && Math.abs(a.diff(b, 'day')) < 30
    ) {
      let calendarColor = calendarStore.calendarCollection.get(cid);
      calendarColor = calendarColor.toJSON().color;
      const events = await getEvents(token, calendarId, start, end);
      if (events !== 0) {
        if (events[0].message === 'No events found.') {
          alert('No events found');
          const temp = new EventStore([], this.updateCollection);
          this.setState({
            eventList: temp.eventCollection.toJSON(),
            eventStore: temp,
            calColor: calendarColor,
          });
        } else {
          const temp = new EventStore(events, this.updateCollection);
          const sortedArray = this.storeByKeys(temp.eventCollection.toJSON());
          this.setState({
            eventList: sortedArray,
            eventStore: temp,
            calColor: calendarColor,
          });
        }
      } else {
        alert('Token Expired');
        window.location = 'http://localhost:3000';
      }
    } else {
      alert('No calendar/date selected');
    }
    this.setState({
      isLoading: false,
    });
  };

  handlePageClick = (event, newValue) => {
    this.setState({
      page: newValue,
      eventList: [],
    });
  };

  render() {
    const {
      isLoading,
      eventList,
      cid,
      calendarList,
      fromDate,
      toDate,
      page,
      eventObj,
      eventStore,
      calColor,
    } = this.state;
    return (
      <div className="home-container">
        {isLoading && (
          <div className="backdrop">
            <CircularProgress disableShrink className="loader" />
          </div>
        )}
        <div className="home-header">
          <h3>{`Calendar Demo V-${pkg.version}`}</h3>
        </div>
        <div className="scrollable-content">
          <div className="calendar-name">
            <div className="calendar-grid">
              <Grid
                container
                alignItems="center"
                justify="space-between"
                className="calendar-grid-container"
                spacing={3}
              >
                <Grid item xs={12} sm={6} lg={4}>
                  <Grid item xs={12} sm={6} md={6}>
                    <FormControl className="calendar-input">
                      <InputLabel shrink id="calendar-name">
                        Caledar Name
                      </InputLabel>
                      <Select
                        labelId="calendar-name"
                        value={cid}
                        onChange={this.handleChange}
                        tabIndex={0}
                      >
                        <MenuItem value="0">Select Calendar</MenuItem>
                        {calendarList.map((e) => (
                          <MenuItem value={e.id} key={e.id}>
                            {e.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item />
                </Grid>
                <Grid item xs={12} sm={6} lg={4} container>
                  <Grid container spacing={3} justify="flex-end">
                    <Grid item xs={12} sm={6}>
                      <MuiPickersUtilsProvider utils={MomentUtils}>
                        <DatePicker value={fromDate} onChange={this.handleFromDate} label="FromDate" tabIndex={0} />
                      </MuiPickersUtilsProvider>

                    </Grid>
                    {page === 0 && (
                      <Grid item xs={12} sm={6}>
                        <MuiPickersUtilsProvider utils={MomentUtils}>
                          <DatePicker value={toDate} onChange={this.handleToDate} label="ToDate" tabIndex={0} />
                        </MuiPickersUtilsProvider>

                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </div>
          <div>
            <div className="app-bar">
              <Tabs
                value={page}
                onChange={this.handlePageClick}
                variant="fullWidth"
              >
                <Tab label="Agenda View" tabIndex={0} />
                <Tab label="Day View" tabIndex={0} />
              </Tabs>
            </div>
            {page === 0 ? (
              <MonthView
                eventList={eventObj}
                store={eventStore}
                calColor={calColor}
                cid={cid}
              />
            ) : (
              <DayView
                eventList={eventList}
                store={eventStore}
                calColor={calColor}
                cid={cid}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}
