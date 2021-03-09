import React, { Component } from "react";
import "./Home.css";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { agenda } from "./textdata";
import { getEventsByDate } from "../../services/Events";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventList: null,
    };
  }
  componentDidMount() {
    if (eventList == null) {
      this.setState({
        eventList: agenda,
      });
    }

    getEventsByDate();
  }
  render() {
    return (
      <div className="home-container">
        <div className="home-header">
          <div className="date">
            <h4>From Date</h4>
            <TextField variant="outlined" type="date" className="date-input" />
          </div>
          <div className="date">
            <h4>To Date</h4>
            <TextField variant="outlined" type="date" className="date-input" />
          </div>
          <div className="date-search">
            <Button variant="contained">Search</Button>
          </div>
        </div>
        <div className="agenda-listing">
          <div className="list">
            {this.state.eventList.map((e, index) => (
              <div className="card" key={index}>
                <h3>{e.title}</h3>
                <p>{e.description}</p>
                <p>{e.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
