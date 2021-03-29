import React, { Component } from 'react';
import './Home.css';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';
import queryString from 'query-string';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { FormControl, InputLabel } from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import EventStore from '../../store/events';
import MonthView from './MonthView';
import DayView from './DayView';
import CalendarStore from '../../store/calendar';
import pkg from '../../../package.json';

import { getEvents, getAccessToken, getCalendars } from '../../services/Events';

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
    this.sortArrayByDate = this.sortArrayByDate.bind(this);
    this.storeByKeys = this.storeByKeys.bind(this);
    this.updateCollection = this.updateCollection.bind(this);
    console.log(pkg);
  }

  async componentDidMount() {
    const { location } = this.props;
    const parsed = queryString.parse(location.search).code;
    let token = localStorage.getItem('token');
    let tokenTime = localStorage.getItem('tokenTime');
    if (token === null) {
      token = await getAccessToken(parsed);
      tokenTime = moment().format('YYYY MM DD, h:mm:ss');
      tokenTime = moment(tokenTime, 'YYYY MM DD, h:mm:ss').add(3600, 'seconds');
      localStorage.setItem('token', token);
      localStorage.setItem('tokenTime', tokenTime);
    } else {
      const currentTime = moment().format('YYYY MM DD, h:mm:ss');
      if (!moment(currentTime, 'YYYY MM DD, h:mm:ss').isBefore(moment(tokenTime, 'YYYY MM DD, h:mm:ss'))) {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenTime');
        window.location = 'http://localhost:3000/';
      }
    }

    this.setState({
      token,
    });
    const result = await getCalendars(token);
    this.setState({
      calendarList: [],
      isLoading: false,
    });
    if (result.calendars && result.calendars.length > 0) {
      const calendarStore = new CalendarStore(result.calendars);
      this.setState({
        calendarStore,
        calendarList: calendarStore.calendarCollection.toJSON(),
      });
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
        fromDate: e.target.value,
      },
      () => this.filterByDate(),
    );
  };

  handleToDate = (e) => {
    this.setState(
      {
        toDate: e.target.value,
      },
      () => this.filterByDate(),
    );
  };

  sortArrayByDate = async (arr) => {
    arr.sort((a, b) => a.date - b.date);
    const result = await this.storeByKeys(arr);

    return result;
  }

  storeByKeys = (arr) => {
    const eventObj = {};
    for (let i = 0; i < arr.length; i += 1) {
      if (Object.prototype.hasOwnProperty.call(eventObj, arr[i].date)) {
        eventObj[arr[i].date].push(arr[i]);
      } else {
        eventObj[`${arr[i].date}`] = [];
        eventObj[`${arr[i].date}`].push(arr[i]);
      }
    }
    this.setState({
      eventObj,
    });
    return arr;
  }

  filterRange = async (eventStore, start, end, cid, token) => {
    this.setState({
      eventList: null,
      isLoading: true,
    });
    const result = await eventStore.updateEvents(start, end, cid, token);
    const sortedArray = await this.sortArrayByDate(eventStore.eventCollection.toJSON());
    if (result === false) {
      alert('No Events found.');
      this.setState({
        eventList: sortedArray,
        isLoading: false,
      });
    } else {
      this.setState({
        eventList: sortedArray,
        isLoading: false,
      });
    }
  }

  updateCollection = () => {
    const { eventStore } = this.state;
    this.setState({
      eventList: eventStore.eventCollection.toJSON(),
    });
  }

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
    } else if (cid !== '0'
      && token
      && fromDate) {
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
    let calendarColor = calendarStore.calendarCollection.get(cid);
    calendarColor = calendarColor.toJSON().color;
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
      const events = await getEvents(token, calendarId, start, end);
      if (events[0].message === 'No events found.') {
        alert('No events found');
        const temp = new EventStore([], this.updateCollection);
        this.setState({
          eventList: temp.eventCollection.toJSON(),
          eventStore: temp,
        });
      } else {
        const temp = new EventStore(events, this.updateCollection);
        const sortedArray = this.sortArrayByDate(temp.eventCollection.toJSON());
        this.setState({
          eventList: sortedArray,
          eventStore: temp,
        });
      }
    } else {
      alert('No calendar selected');
    }
    this.setState({
      isLoading: false,
      calColor: calendarColor,
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
                      <TextField
                        label={page === 0 ? 'From Date' : 'Date'}
                        variant="outlined"
                        type="date"
                        value={fromDate}
                        onChange={this.handleFromDate}
                        InputLabelProps={{ shrink: true }}
                        className="calendar-input"
                      />
                    </Grid>
                    {page === 0 && (
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="To Date"
                          variant="outlined"
                          type="date"
                          value={toDate}
                          onChange={this.handleToDate}
                          InputLabelProps={{ shrink: true }}
                          className="calendar-input"
                        />
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
                <Tab label="Agenda View" />
                <Tab label="Day View" />
              </Tabs>
            </div>
            {page === 0 ? (
              <MonthView eventList={eventObj} />
            ) : (
              <DayView eventList={eventList} store={eventStore} calColor={calColor} />
            )}
          </div>
        </div>
      </div>
    );
  }
}
