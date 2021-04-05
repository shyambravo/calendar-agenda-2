/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
import moment from 'moment';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import './Home.css';
import React, { Component } from 'react';
import EditModal from '../../components/EditModal/EditModal';
import { fetcheventdetails } from '../../services/Events';

export default class MonthView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      color: '',
      description: '',
      fromTime: '',
      toTime: '',
      editEvent: null,
      calColor: null,
      cid: null,
      store: null,
      isModal: false,
      eventList: [],
    };
    this.updateState = this.updateState.bind(this);
    this.editEventTrigger = this.editEventTrigger.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.editEventSubmit = this.editEventSubmit.bind(this);
  }

  componentDidMount() {
    const {
      calColor, cid, store, eventList,
    } = this.props;
    this.setState({
      calColor,
      cid,
      store,
      eventList,
    });
  }

  componentDidUpdate(prevProps) {
    const {
      eventList, cid, calColor, store,
    } = this.props;
    if (prevProps.eventList !== eventList) {
      this.updateState(eventList, cid, calColor, store);
    }
  }

  updateState = (eventList, cid, calColor, store) => {
    this.setState({
      cid,
      calColor,
      store,
      eventList,
    });
  }

  editEventTrigger = async (e) => {
    const { calColor, cid } = this.state;
    const eventData = await fetcheventdetails(cid, e.id);
    const fromTime = moment(
      e.fromDate,
      'dddd, MMMM Do YYYY, h:mm:ss a',
    ).format('YYYY-MM-DDTHH:mm');
    const toTime = moment(e.toDate, 'dddd, MMMM Do YYYY, h:mm:ss a').format(
      'YYYY-MM-DDTHH:mm',
    );
    let description = '';
    if (eventData) {
      if (eventData.events[0].description !== undefined) {
        description = eventData[0].description;
      }
    }
    this.setState({
      title: e.title,
      color: e.color === '' ? calColor : e.color,
      description,
      fromTime,
      toTime,
      editEvent: e,
      isModal: true,
    });
  }

  editEventSubmit = async (title, color, description, fromTime, toTime) => {
    const { editEvent, cid, store } = this.state;
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
    });
  };

  closeModal = () => {
    this.setState({
      isModal: false,
    });
  }

  render() {
    const {
      isModal, title, description, fromTime, toTime, color, eventList,
    } = this.state;
    return (
      <div className="agenda-listing">
        {isModal && (
        <EditModal
          title={title}
          color={color}
          description={description}
          fromTime={fromTime}
          toTime={toTime}
          editEventSubmit={this.editEventSubmit}
          closeModal={this.closeModal}
        />
        )}
        <div className="list">
          <ul className="event-list">
            {eventList != null
            && Object.keys(eventList).map((e, index) => (
              <li className="agenda-list-container" key={index}>
                <div className="agenda-date">
                  {moment(e, 'YYYY-MM-DD').format('DD MMM, ddd')}
                </div>
                <div className="agenda-data">
                  <div className="agenda-duration">
                    <ul className="adenda-content">
                      {eventList[e].map((time, index2) => (
                        <li
                          className="time-list"
                          key={`time ${index2}`}
                          onKeyDown={() => this.editEventTrigger(time)}
                          // eslint-disable-next-line no-plusplus
                          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                          tabIndex={0}
                        >
                          <div className="agenda-date-expand">
                            <FiberManualRecordIcon />
                            <p className="agenda-date-content">
                              {`${moment(
                                time.fromDate,
                                'dddd, MMMM Do YYYY, h:mm:ss a',
                              ).format('DD-MMM')} (${moment(
                                time.fromDate,
                                'dddd, MMMM Do YYYY, h:mm:ss a',
                              ).format('HH:mm')}) - ${moment(
                                time.toDate,
                                'dddd, MMMM Do YYYY, h:mm:ss a',
                              ).format('DD-MMM')} (${moment(
                                time.toDate,
                                'dddd, MMMM Do YYYY, h:mm:ss a',
                              ).format('HH:mm')})`}
                            </p>
                          </div>
                          <div className="agenda-title">
                            <p key={`title ${index2}`}>{time.title}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
