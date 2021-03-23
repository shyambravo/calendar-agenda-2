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
    // Stores the 24 hours format in an Array and calls a helper function
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
    // This funcion creates an array of objects with keys for width and positioning
    const temp = [];
    eventList.forEach((e) => {
      const hour = moment(e.fromDate, 'dddd, MMMM Do YYYY, h:mm:ss a').format('HH');
      let minutes = moment(e.fromDate, 'dddd, MMMM Do YYYY, h:mm:ss a').format('m');
      if (minutes === '0') {
        minutes += 1;
      }
      const time = parseFloat(hour * 60) + parseFloat(minutes);
      const endHour = moment(e.toDate, 'dddd, MMMM Do YYYY, h:mm:ss a').format('HH');
      const endMinutes = moment(e.toDate, 'dddd, MMMM Do YYYY, h:mm:ss a').format('mm');
      const height = parseFloat(endHour * 60) + parseFloat(endMinutes);
      const total = (height - time);
      // Model for storing the event with width and postion
      // Need to create a backbone model and colection for this
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
    // Calls a function to sort
    this.sortByDate(temp);
    // eslint-disable-next-line react/no-did-update-set-state
    this.setState({
      events: temp,
    });
  }

  sortByDate = (arr) => {
    // Function that sorts the events based on starting time and length
    arr.sort((a, b) => {
      if (a.startTime === b.startTime) {
        return b.totalTime - a.totalTime;
      }
      return a.startTime - b.startTime;
    });
    // Calls a function to check for collision
    this.findConflict(arr);
  }

  findConflict = (arr) => {
    // Function that finds collision and set width and position
    // Outer loop for iterating the events
    for (let index = 1; index < arr.length; index += 1) {
      let count = 0;
      // Inner loop for finding the number of collision
      for (let i = 0; i < index; i += 1) {
        /* checks the collision if the start time is
         in between the start and end time of previous events */
        if (arr[index].startTime >= arr[i].startTime && arr[index].startTime <= arr[i].endTime) {
          count += 1;
          arr[i].index = count;
        }
      }
      // Storing the counts to split the width
      count += 1;
      arr[index].index = count;
      let width = parseFloat(100);
      // Logic for splitting the width and setting the position
      for (let i = 0; i < arr.length; i += 1) {
        const temp = parseFloat(width / count);
        if (arr[i].index !== 0) {
          // condition for the edge case in which the previous event's width is already split
          if (arr[i].width < temp) {
            width = (100 - arr[i].width);
            // count -= 1;
          } else {
            // setting new width and position
            arr[i].width = temp;
            arr[i].left = parseFloat(parseFloat(arr[i].index - 1) * temp);
          }
          // Marking as no conflict
          arr[i].index = 0;
        }
      }
    }
    // setting the state for the updated events array
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
