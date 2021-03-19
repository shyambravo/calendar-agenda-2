import React, { Component } from 'react';
import './Home.css';
import Card from '@material-ui/core/Card';

export default class DayView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      day: [],
    };
  }

  componentDidMount() {
    const day = [];
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
        minutes:
          {
            first: [],
            second: [],
            third: [],
            fourth: [],
          },
      };
      day.push(data);
    }
    this.setState({
      day,
    });
  }

  render() {
    const { day } = this.state;
    let minutesData;
    if (day.length > 0) {
      minutesData = Object.keys({
        first: null,
        second: null,
        third: null,
        fourth: null,
      });
    }
    return (
      <div className="day-container">
        <div className="day-grid">
          {day.map((e) => (
            <Card className="hour-div">
              <div className="side-panel">
                <p>{e.time}</p>
              </div>
              <div className="minutes-div">
                {
                     minutesData.map(() => (
                       <div className="events-div">
                         <p>Event</p>
                       </div>
                     ))
                 }
              </div>
            </Card>
          ))}
        </div>
      </div>

    );
  }
}
