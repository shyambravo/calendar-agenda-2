import React, { Component } from 'react';
import './Home.css';
import Card from '@material-ui/core/Card';
import moment from 'moment';

export default class DayView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      day: [],
    };
    this.storePosition = this.storePosition.bind(this);
  }

  componentDidMount() {
    const day = [];
    const { eventList } = this.props;
    for (let i = 0; i < 24; i += 1) {
      let indicator;
      if (i < 13) {
        indicator = 'AM';
      } else {
        indicator = 'PM';
      }
      const data = {
        index: i,
        time: `${i}:00 ${indicator}`,
      };
      day.push(data);
    }
    this.setState({
      day,
    }, () => this.storePosition(eventList));
  }

  componentDidUpdate(prevProps) {
    const { eventList } = this.props;
    if (prevProps.eventList !== eventList && eventList) {
      this.storePosition(eventList);
    }
  }

  storePosition = (eventList) => {
    const temp = [];
    eventList.forEach((e) => {
      const hour = moment(e.fromDate, 'dddd, MMMM Do YYYY, h:mm:ss a').format('HH');
      const minutes = moment(e.fromDate, 'dddd, MMMM Do YYYY, h:mm:ss a').format('mm');
      const time = (hour * 120) + (minutes * 2);
      const obj = {
        top: `${time}px`,
        left: 0,
        title: e.title,
      };
      temp.push(obj);
    });
    // eslint-disable-next-line react/no-did-update-set-state
    this.setState({
      events: temp,
    });
  }

  render() {
    const { day, events } = this.state;
    return (
      <div className="day-container">
        <div className="day-grid">
          <div className="absolute-container">
            {
            events && events.map((event) => (
              <div className="grid-absolute" style={{ top: event.top }}>
                <p>{event.title}</p>
              </div>
            ))
          }
          </div>
          {day.map((e) => (
            <Card className="hour-div">
              <div className="side-panel">
                <p>{e.time}</p>
              </div>
              <div className="minutes-div" />
            </Card>
          ))}
        </div>
      </div>

    );
  }
}
