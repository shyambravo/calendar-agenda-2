import React, { Component } from "react";
import "./Home.css";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { agenda } from "./textdata";
import { getEventsByDate } from "../../services/Events";
import { EventStore } from "../../store/events";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventList: null,
    };
    this.reset = this.reset.bind(this);
  }

  reset = (data) => {
    console.log(data);
    this.setState({
      eventList: null,
    });
  };
  componentDidMount() {
    this.setState(
      {
        eventList: new EventStore(agenda),
      },
      () => {
        this.state.eventList.initializeEvents(this.reset);
      }
    );
  }

  render() {
    if (this.state.eventList != null) {
      console.log(this.state.eventList.eventCollection);
    }
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
            {this.state.eventList != null &&
              this.state.eventList.eventCollection.toJSON().map((e, index) => (
                <div className="card" key={index}>
                  <h3>{e.title}</h3>
                  <p>{e.description}</p>
                  <p>{e.date}</p>
                </div>
              ))}
          </div>
          {this.state.eventList != null && (
            <Button
              variant="contained"
              onClick={() => this.state.eventList.resetArray()}
            >
              reset
            </Button>
          )}
        </div>
      </div>
    );
  }
}
