/* eslint-disable react/no-array-index-key */
import React from 'react';
import moment from 'moment';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import './Home.css';

export default function MonthView(props) {
  const { eventList } = props;
  return (
    <div className="agenda-listing">
      <div className="list">
        <ul className="event-list">
          {eventList != null
            && Object.keys(eventList).map((e, index) => (
              <li className="agenda-list-container" key={index}>
                <div className="agenda-date">
                  {moment(e, 'x').format('DD MMM, ddd')}
                </div>
                <div className="agenda-data">
                  <div className="agenda-duration">
                    <ul className="adenda-content">
                      {eventList[e].map((time, index2) => (
                        <li className="time-list" key={`time ${index2}`}>
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
