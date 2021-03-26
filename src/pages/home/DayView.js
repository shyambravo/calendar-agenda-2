/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import './Home.css';
import Card from '@material-ui/core/Card';
import CircularProgress from '@material-ui/core/CircularProgress';
import moment from 'moment';

export default class DayView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      day: [],
      width: null,
      isLoading: false,
    };
    this.storePosition = this.storePosition.bind(this);
    this.sortByDate = this.sortByDate.bind(this);
    this.findConflict = this.findConflict.bind(this);
    this.recursiveFunction = this.recursiveFunction.bind(this);
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
    this.setState({
      isLoading: true,
    });
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

  recursiveFunction = (arr, x, y, start, end) => {
    // Base Condition
    if (start > end) return false;

    // Find the middle index
    const mid = Math.floor((start + end) / 2);

    // Compare mid with given key x

    if (x >= arr[mid].start && x <= arr[mid].end) return true;

    // If element at mid is greater than x,
    // search in the left half of mid
    if (arr[mid].start > y) return this.recursiveFunction(arr, x, y, start, mid - 1);
    return this.recursiveFunction(arr, x, y, mid + 1, end);
  }

  findConflict = async (arr) => {
    // Function that finds collision and set width and position
    // Outer loop for iterating the events
    const mark = [];
    for (let index = 0; index < arr.length; index += 1) {
      const { startTime, endTime } = arr[index];
      let flag = false;
      for (let i = 0; i < mark.length; i += 1) {
        flag = false;
        const result = this.recursiveFunction(mark[i], startTime, endTime, 0, mark[i].length - 1);
        if (result) {
          flag = true;
        }

        if (flag === false) {
          arr[index].column = i;
          mark[i].push({ start: arr[index].startTime, end: arr[index].endTime });
          break;
        }
      }

      if (flag === true || mark.length === 0) {
        arr[index].column = mark.length;
        mark.push([{ start: arr[index].startTime, end: arr[index].endTime }]);
      }
    }

    const column = mark.length;

    this.setState({
      events: arr,
      width: parseFloat(100 / column),
      isLoading: false,
    });
  }

  render() {
    const {
      day, events, width, isLoading,
    } = this.state;
    return (
      <div className="day-container">
        {isLoading && (
        <div className="backdrop">
          <CircularProgress disableShrink className="loader" />
        </div>
        )}
        <div className="absolute-container">
          {
            events && events.map((event, index) => (
              <div
                className="grid-absolute"
                style={{
                  top: event.top, height: event.height, width: `${width}%`, left: `${(event.column * width)}%`,
                }}
                // eslint-disable-next-line react/no-array-index-key
                key={index}
              >
                <p>{event.title}</p>
              </div>
            ))
          }
        </div>
        <div className="day-grid">
          {day.map((e, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Card className="hour-div" key={index}>
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
