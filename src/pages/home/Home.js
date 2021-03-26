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

import { getEvents, getAccessToken, getCalendars } from '../../services/Events';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calendarList: [],
      eventList: [],
      fromDate: moment().format('YYYY-MM-DD'),
      toDate: moment().format('YYYY-MM-DD'),
      token: null,
      isLoading: true,
      cid: '0',
      eventStore: null,
      page: 0,
    };
    this.handleChange = this.handleChange.bind(this);
    this.filterByDate = this.filterByDate.bind(this);
    this.handleFromDate = this.handleFromDate.bind(this);
    this.handleToDate = this.handleToDate.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.filterByDate = this.filterByDate.bind(this);
  }

  async componentDidMount() {
    const { location } = this.props;
    const parsed = queryString.parse(location.search).code;
    let token = localStorage.getItem('token');
    if (token === null) {
      token = await getAccessToken(parsed);
    }

    localStorage.setItem('token', token);
    this.setState({
      token,
    });
    const result = await getCalendars(token);
    this.setState({
      calendarList: [],
      isLoading: false,
    });
    if (result.calendars && result.calendars.length > 0) {
      this.setState({
        calendarList: result.calendars,
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

  filterRange = async (eventStore, start, end, cid, token) => {
    this.setState({
      eventList: null,
    });
    const result = await eventStore.updateEvents(start, end, cid, token);
    if (result === false) {
      alert('No Events found.');
    } else {
      this.setState({
        eventList: eventStore.eventCollection.toJSON(),
      });
    }
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
    this.setState({
      isLoading: true,
    });
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

    this.setState({
      isLoading: false,
    });
  };

  selectCalendar = async () => {
    this.setState({
      isLoading: true,
    });
    const {
      token, cid, fromDate, toDate,
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
      const events = await getEvents(token, calendarId, start, end);
      if (events[0].message === 'No events found.') {
        alert('No events found');
        const temp = new EventStore([]);
        this.setState({
          eventList: temp.eventCollection.toJSON(),
          eventStore: temp,
        });
      } else {
        const temp = new EventStore(events);
        this.setState({
          eventList: temp.eventCollection.toJSON(),
          eventStore: temp,
        });
      }
    } else {
      alert('No calendar selected');
    }
    this.setState({
      isLoading: false,
    });
  };

  handlePageClick = (event, newValue) => {
    this.setState({
      page: newValue,
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
    } = this.state;
    return (
      <div className="home-container">
        {isLoading && (
          <div className="backdrop">
            <CircularProgress disableShrink className="loader" />
          </div>
        )}
        <div className="home-header">
          <h3>Calendar Demo V-0.3.3</h3>
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
                          <MenuItem value={e.uid} key={e.uid}>
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
                <Tab label="Month View" />
                <Tab label="Day View" />
              </Tabs>
            </div>
            {page === 0 ? (
              <MonthView eventList={eventList} />
            ) : (
              <DayView eventList={eventList} />
            )}
          </div>
        </div>
      </div>
    );
  }
}
