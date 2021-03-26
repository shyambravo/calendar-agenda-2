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
      width: null,
    };
    this.storePosition = this.storePosition.bind(this);
    this.sortByDate = this.sortByDate.bind(this);
    this.findConflict = this.findConflict.bind(this);
    this.binarySearch = this.binarySearch.bind(this);
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
      const startHour = moment(e.fromDate, 'dddd, MMMM Do YYYY, h:mm:ss a').format('H');
      let startMinutes = moment(e.fromDate, 'dddd, MMMM Do YYYY, h:mm:ss a').format('m');
      /* Condition for the edge case in which event from 7pm - 8pm and another event from 8pm - 9pm.
      Here we should not consider this as collision. */
      if (startMinutes === '0') {
        startMinutes += 1;
      }
      const startTime = parseFloat(startHour * 60) + parseFloat(startMinutes);
      const endHour = moment(e.toDate, 'dddd, MMMM Do YYYY, h:mm:ss a').format('H');
      const endMinutes = moment(e.toDate, 'dddd, MMMM Do YYYY, h:mm:ss a').format('m');
      const endTime = parseFloat(endHour * 60) + parseFloat(endMinutes);
      const total = (endTime - startTime);
      // Model for storing the event with width and postion
      // Need to create a backbone model and colection for this
      const obj = {
        startTime,
        endTime,
        top: `${startTime}px`,
        left: 0,
        title: e.title,
        height: `${total}px`,
        totalTime: total,
        width: 100,
        startHour: parseInt(startHour, 10),
        column: null,
      };
      temp.push(obj);
    });
    // Calls a function to sort
    this.sortByDate(temp);
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

   binarySearch = (arr, x, start, end) => {
     // Base Condition
     if (start > end) return false;

     // Find the middle index
     const mid = Math.floor((start + end) / 2);

     // Compare mid with given key x
     if (x >= arr[mid].start && x <= arr[mid].end) return true;

     // If element at mid is greater than x,
     // search in the left half of mid
     if (arr[mid].start > x) return this.binarySearch(arr, x, start, mid - 1);
     return this.binarySearch(arr, x, mid + 1, end);
   }

  findConflict = async (arr) => {
    // Function that finds collision and set width and position
    // Outer loop for iterating the events
    const mark = [{}];
    for (let index = 0; index < arr.length; index += 1) {
      // Inner loop for finding the number of collision
      const { startHour } = arr;
      let flag = false;
      for (let i = 0; i < mark.length; i += 1) {
        if (Object.prototype.hasOwnProperty.call(mark[i], `${startHour}`)) {
          // eslint-disable-next-line no-await-in-loop
          const result = await this.binarySearch(arr, mark[i][`${startHour}`], 0, mark[i][`${startHour}`].length - 1);
          if (result) {
            flag = true;
          } else {
            flag = false;
            mark[i][`${startHour}`].push({ start: arr[index].startTime, end: arr[index].endTime });
            arr[index].column = i;
          }
        } else {
          flag = false;
          mark[i][`${startHour}`] = [];
          arr[index].column = i;
          mark[i][`${startHour}`].push({ start: arr[index].startTime, end: arr[index].endTime });
        }
      }

      if (flag === true) {
        arr[index].column = mark.length;
        const tempObj = {
          [`${startHour}`]: [{ start: arr[index].startTime, end: arr[index].endTime }],
        };

        mark.push(tempObj);
      }
    }

    const column = mark.length;

    this.setState({
      events: arr,
      width: parseFloat(100 / column),
    });
  }

  render() {
    const { day, events, width } = this.state;
    console.log(events, width);
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
