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
import EventStore from '../../store/events';

import {
  getEvents,
  getAccessToken,
  getCalendars,
} from '../../services/Events';

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
    };
    this.handleChange = this.handleChange.bind(this);
    this.filterByDate = this.filterByDate.bind(this);
    this.handleFromDate = this.handleFromDate.bind(this);
    this.handleToDate = this.handleToDate.bind(this);
  }

  async componentDidMount() {
    const { location } = this.props;
    const parsed = queryString.parse(location.search).code;
    const token = await getAccessToken(parsed);
    this.setState({
      token,
    });
    const result = await getCalendars(token);
    this.setState({
      calendarList: [],
      isLoading: false,
    });
    if (result.calendars.length > 0) {
      this.setState({
        calendarList: result.calendars,
      });
    }
  }

  handleChange = (e) => {
    this.setState({
      cid: e.target.value,
    }, () => this.selectCalendar());
  };

  handleFromDate = (e) => {
    this.setState({
      fromDate: e.target.value,
    }, () => this.filterByDate());
  }

  handleToDate = (e) => {
    this.setState({
      toDate: e.target.value,
    }, () => this.filterByDate());
  }

  filterByDate = async () => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    const {
      eventStore, fromDate, toDate, cid, token,
    } = this.state;
    const start = moment(fromDate).format('YYYYMMDD');
    const end = moment(toDate).format('YYYYMMDD');
    const a = moment(start);
    const b = moment(end);
    if (cid !== '0' && token && fromDate && toDate && (Math.abs(a.diff(b, 'day')) < 30)) {
      this.setState({
        isLoading: true,
        eventList: null,
      });
      const result = await eventStore.updateEvents(start, end, cid, token);
      if (result === false) {
        alert('No Events found.');
      } else {
        this.setState({
          eventList: eventStore.eventCollection.toJSON(),
          isLoading: false,
        });
      }
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
    if (cid !== '0' && token && fromDate && toDate && (Math.abs(a.diff(b, 'day')) < 30)) {
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

  render() {
    const {
      isLoading, eventList, cid, calendarList, fromDate, toDate,
    } = this.state;
    return (
      <div className="home-container">
        {isLoading && (
          <div className="backdrop">
            <CircularProgress disableShrink className="loader" />
          </div>
        )}
        <div className="home-header">
          <h3>Agenda Listing</h3>
        </div>
        <div className="scrollable-content">
          <div className="calendar-name">
            <div className="calendar-grid">
              <Grid container alignItems="center" justify="space-between" className="calendar-grid-container" spacing={3}>
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
                          <MenuItem value={e.uid} key={e.uid}>{e.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                  </Grid>
                  <Grid item />

                </Grid>
                <Grid item xs={12} sm={6} lg={4} container>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="From Date"
                        variant="outlined"
                        type="date"
                        value={fromDate}
                        onChange={this.handleFromDate}
                        InputLabelProps={{ shrink: true }}
                        className="calendar-input"
                      />
                    </Grid>
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
                  </Grid>

                </Grid>

              </Grid>
            </div>
          </div>

          <div className="agenda-listing">
            <div className="list">
              {eventList != null
                && eventList.map((e, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <div className="card" key={index}>
                    <h3>{e.title}</h3>
                    <p>
                      ORGANIZER -
                      {e.organizer}
                    </p>
                    <p>
                      FROM -
                      {e.fromDate}
                    </p>
                    <p>
                      TO -
                      {e.toDate}
                    </p>
                    <p>{e.description ? e.description : ''}</p>
                    {e.attendees && (
                      <div className="attendees-list">
                        <h3>Attendees List</h3>
                        <ul>
                          {e.attendees.map((person) => (
                            <li key={person.email}>
                              {person.email}
                              {' '}
                              -
                              {person.status}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
