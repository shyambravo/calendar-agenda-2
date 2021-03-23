/* eslint-disable no-param-reassign */
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
    this.sortByDate = this.sortByDate.bind(this);
    this.findConflict = this.findConflict.bind(this);
    // this.setWidthAndLeft = this.setWidthAndLeft.bind(this);
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
      const time = parseInt(hour * 60, 10) + parseInt(minutes, 10);
      const endHour = moment(e.toDate, 'dddd, MMMM Do YYYY, h:mm:ss a').format('HH');
      const endMinutes = moment(e.toDate, 'dddd, MMMM Do YYYY, h:mm:ss a').format('mm');
      const height = parseInt(endHour * 60, 10) + parseInt(endMinutes, 10);
      const total = (height - time);
      const obj = {
        startTime: time,
        endTime: height,
        top: `${time}px`,
        left: 0,
        title: e.title,
        height: `${height - time}px`,
        totalTime: total,
        index: 0,
        width: 100,
      };
      temp.push(obj);
    });
    this.sortByDate(temp);
    // eslint-disable-next-line react/no-did-update-set-state
    this.setState({
      events: temp,
    });
  }

  sortByDate = (arr) => {
    arr.sort((a, b) => {
      if (a.startTime === b.startTime) {
        return b.totalTime - a.totalTime;
      }
      return a.startTime - b.startTime;
    });
    this.findConflict(arr);
  }

  findConflict = (arr) => {
    // const map = {};
    // for (let i = 0; i < arr.length; i++) {
    //   map[`${i}`] = [];
    // }
    for (let index = 1; index < arr.length; index += 1) {
      let count = 0;
      for (let i = 0; i < index; i += 1) {
        if (arr[index].startTime >= arr[i].startTime && arr[index].startTime <= arr[i].endTime) {
          count += 1;
          arr[i].index = count;
        }
      }

      count += 1;
      arr[index].index = count;
      let width = 100;
      for (let i = 0; i < arr.length; i += 1) {
        const temp = width / count;
        if (arr[i].index !== 0) {
          if (arr[i].width < temp) {
            width = (100 - arr[i].width);
            count -= 1;
          } else {
            arr[i].width = temp;
            arr[i].left = parseInt(parseInt(arr[i].index - 1, 10) * temp, 10);
          }
          arr[i].index = 0;
        }
      }
    }
    this.setState({
      events: arr,
    });
  }

  render() {
    const { day, events } = this.state;
    return (
      <div className="day-container">
        <div className="absolute-container">
          {
            events && events.map((event) => (
              <div
                className="grid-absolute"
                style={{
                  top: event.top, height: event.height, width: `${event.width}%`, left: `${event.left}%`,
                }}
              >
                <p>{event.title}</p>
              </div>
            ))
          }
        </div>
        <div className="day-grid">
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
