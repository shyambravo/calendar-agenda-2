import React, { Component } from 'react';
import './Home.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import moment from 'moment';
import queryString from 'query-string';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import EventStore from '../../store/events';
import {
  getEvents,
  getAccessToken,
  getCalendarId,
} from '../../services/Events';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventList: [],
      fromDate: null,
      toDate: null,
      token: null,
      isLoading: true,
      cid: null,
      eventStore: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.filterByDate = this.filterByDate.bind(this);
  }

  async componentDidMount() {
    const { location } = this.props;
    const parsed = queryString.parse(location.search).code;
    const token = await getAccessToken(parsed);
    this.setState({
      token,
      isLoading: false,
    });
  }

  handleChange = (type, e) => {
    const val = e.target.value;
    if (type === 'start') {
      this.setState({
        fromDate: val,
      });
    } else if (type === 'end') {
      this.setState({
        toDate: val,
      });
    } else {
      this.setState({
        cid: e.target.value,
      });
    }
  };

  filterByDate = async () => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    const {
      eventStore, fromDate, toDate, cid, token,
    } = this.state;
    const start = moment(fromDate).format('YYYYMMDD');
    const end = moment(toDate).format('YYYYMMDD');
    const a = moment(start);
    const b = moment(end);
    if (cid && token && fromDate && toDate && (Math.abs(a.diff(b, 'day')) < 30)) {
      this.setState({
        isLoading: true,
        eventList: null,
      });
      const result = await eventStore.updateEvents(start, end, cid, token);
      if (result === false) {
        alert('No Events found.');
      } else {
        console.log(eventStore.eventCollection.toJSON());
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
    const { token, cid } = this.state;
    const calendarId = await getCalendarId(token, cid);
    let flag = true;
    if (calendarId === 0) {
      alert('calendar not found');
      flag = false;
    } else {
      const events = await getEvents(token, calendarId[0].uid, null, null);
      if (events[0].message === 'No events found.') {
        alert('No events found');
        flag = false;
      } else {
        const temp = new EventStore(events);
        this.setState({
          eventList: temp.eventCollection.toJSON(),
          cid: calendarId[0].uid,
          isLoading: false,
          eventStore: temp,
        });
      }
    }
    if (flag === false) {
      this.setState({
        eventList: [],
        isLoading: false,
      });
    }
  };

  render() {
    const { isLoading, eventList } = this.state;
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
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Calendar Name"
                    variant="outlined"
                    type="text"
                    onChange={(e) => this.handleChange('name', e)}
                    className="calendar-input"
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Button
                    variant="contained"
                    onClick={(e) => this.selectCalendar(e)}
                    color="primary"
                    className="calendar-input"
                  >
                    Select
                  </Button>
                </Grid>
              </Grid>
              <Grid container spacing={3} alignItems="center" className="grid">
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="From Date"
                    variant="outlined"
                    type="date"
                    onChange={(e) => this.handleChange('start', e)}
                    InputLabelProps={{ shrink: true }}
                    className="calendar-input"
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="To Date"
                    variant="outlined"
                    type="date"
                    onChange={(e) => this.handleChange('end', e)}
                    InputLabelProps={{ shrink: true }}
                    className="calendar-input"
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Button
                    variant="contained"
                    onClick={this.filterByDate}
                    className="calendar-input"
                  >
                    Search
                  </Button>
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
