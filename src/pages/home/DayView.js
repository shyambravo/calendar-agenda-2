/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import './Home.css';
import Card from '@material-ui/core/Card';
import CircularProgress from '@material-ui/core/CircularProgress';

import moment from 'moment';

import { fetcheventdetails } from '../../services/Events';
import EditModal from '../../components/EditModal/EditModal';

export default class DayView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      day: [],
      width: null,
      isLoading: false,
      isModal: false,
      editEvent: null,
      fromTime: null,
      toTime: null,
      title: null,
      cid: null,
      color: '#ffff',
      description: '',
    };
    this.storePosition = this.storePosition.bind(this);
    this.sortByDate = this.sortByDate.bind(this);
    this.findConflict = this.findConflict.bind(this);
    this.recursiveFunction = this.recursiveFunction.bind(this);
    this.editEvent = this.editEvent.bind(this);
    this.editEventSubmit = this.editEventSubmit.bind(this);
    this.closeModal = this.closeModal.bind(this);
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
    this.setState(
      {
        day,
      },
      () => this.storePosition(eventList),
    );
  }

  componentDidUpdate(prevProps) {
    const { eventList, cid } = this.props;
    if (prevProps.eventList !== eventList && eventList) {
      this.storePosition(eventList, cid);
    }
  }

  storePosition = (eventList, cid) => {
    // This funcion creates an array of objects with keys for width and positioning
    this.setState({
      isLoading: true,
      cid,
    });
    const temp = [];
    if (eventList.forEach) {
      eventList.forEach((e) => {
        const startHour = moment(
          e.fromDate,
          'dddd, MMMM Do YYYY, h:mm:ss a',
        ).format('H');
        let startMinutes = moment(
          e.fromDate,
          'dddd, MMMM Do YYYY, h:mm:ss a',
        ).format('m');
        /* Condition for the edge case in which event
         from 7pm - 8pm and another event from 8pm - 9pm.
        Here we should not consider this as collision. */
        if (startMinutes === '0') {
          startMinutes += 1;
        }
        const startTime = parseFloat(startHour * 60) + parseFloat(startMinutes);
        const endHour = moment(
          e.toDate,
          'dddd, MMMM Do YYYY, h:mm:ss a',
        ).format('H');
        const endMinutes = moment(
          e.toDate,
          'dddd, MMMM Do YYYY, h:mm:ss a',
        ).format('m');
        const endTime = parseFloat(endHour * 60) + parseFloat(endMinutes);
        const total = endTime - startTime;
        const fromTime = moment(
          e.fromDate,
          'dddd, MMMM Do YYYY, h:mm:ss a',
        ).format('YYYY-MM-DDTHH:mm');
        const toTime = moment(e.toDate, 'dddd, MMMM Do YYYY, h:mm:ss a').format(
          'YYYY-MM-DDTHH:mm',
        );
        // Model for storing the event with width and postion
        // Need to create a backbone model and colection for this
        const obj = {
          id: e.id,
          startTime,
          endTime,
          top: `${startTime}px`,
          left: 0,
          title: e.title,
          height: `${total}px`,
          totalTime: total,
          width: 100,
          column: null,
          color: e.color,
          fromTime,
          toTime,
          dateandtime: e.dateandtime,
          etag: e.etag,
        };
        temp.push(obj);
      });
      // Calls a function to sort
      this.sortByDate(temp);
    } else {
      this.setState({
        isLoading: false,
      });
    }
  };

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
  };

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
  };

  findConflict = async (arr) => {
    // Function that finds collision and set width and position
    // Outer loop for iterating the events
    const mark = [];
    for (let index = 0; index < arr.length; index += 1) {
      const { startTime, endTime } = arr[index];
      let flag = false;
      for (let i = 0; i < mark.length; i += 1) {
        flag = false;
        const result = this.recursiveFunction(
          mark[i],
          startTime,
          endTime,
          0,
          mark[i].length - 1,
        );
        if (result) {
          flag = true;
        }

        if (flag === false) {
          arr[index].column = i;
          mark[i].push({
            start: arr[index].startTime,
            end: arr[index].endTime,
          });
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
  };

  editEvent = async (e) => {
    const { calColor } = this.props;
    const { cid } = this.state;
    const eventData = await fetcheventdetails(cid, e.id);
    let description = '';
    if (eventData) {
      if (eventData.events[0].description !== undefined) {
        description = eventData[0].description;
      }
    }

    this.setState({
      isModal: true,
      editEvent: e,
      fromTime: e.fromTime,
      toTime: e.toTime,
      title: e.title,
      color: e.color === '' ? calColor : e.color,
      description,
    });
  };

  editEventSubmit = async (title, color, description, fromTime, toTime) => {
    const { store } = this.props;
    const { editEvent, cid } = this.state;
    const data = {
      uid: editEvent.id,
      title,
      fromTime,
      toTime,
      dateandtime: editEvent.dateandtime,
      etag: editEvent.etag,
      cid,
      color,
      description,
    };
    store.updateSingleEvent(data);
    this.setState({
      title,
      description,
      color,
      fromTime,
      toTime,
      isModal: false,
      isLoading: true,
    });
  };

  closeModal = () => {
    this.setState({
      isModal: false,
    });
  }

  render() {
    const {
      day,
      events,
      width,
      isLoading,
      isModal,
      fromTime,
      toTime,
      title,
      color,
      description,
    } = this.state;
    const { calColor } = this.props;
    return (
      <div className="day-container">
        {isLoading && (
          <div className="backdrop">
            <CircularProgress disableShrink className="loader" />
          </div>
        )}
        {isModal && (
          <EditModal
            fromTime={fromTime}
            toTime={toTime}
            title={title}
            color={color}
            description={description}
            editEventSubmit={this.editEventSubmit}
            closeModal={this.closeModal}
          />
        )}
        <div className="absolute-container">
          {events
            && events.map((event, index) => (
              <div
                className="grid-absolute"
                style={{
                  top: event.top,
                  height: event.height,
                  width: `${width}%`,
                  left: `${event.column * width}%`,
                  backgroundColor: event.color === '' ? calColor : event.color,
                }}
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                onClick={() => this.editEvent(event)}
              >
                <p>{event.title}</p>
              </div>
            ))}
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
