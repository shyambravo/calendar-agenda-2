import React, { Component } from "react";
import "./Home.css";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { getEvents, getAccessToken } from "../../services/Events";
import { EventStore } from "../../store/events";
import moment from "moment";
import queryString from "query-string";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventList: null,
      fromDate: null,
      toDate: null,
      urlParams: null,
      token: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.filterByDate = this.filterByDate.bind(this);
  }

  async componentDidMount() {
    const parsed = queryString.parse(this.props.location.search).code;
    const token = await getAccessToken(parsed);
    console.log(token);
    let temp = new EventStore(await getEvents(token));

    this.setState({
      originList: temp.eventCollection.toJSON(),
      eventList: temp.eventCollection.toJSON(),
      urlParams: parsed.code,
      token: token,
    });
  }

  handleChange = (type, e) => {
    let val = e.target.value;
    if (type === "start") {
      this.setState({
        fromDate: val,
      });
    } else {
      this.setState({
        toDate: val,
      });
    }
  };

  filterByDate = () => {
    let eventsArray = [...this.state.originList];
    eventsArray = eventsArray.filter((e) => {
      let start = moment(this.state.fromDate).format("YYYY-MM-DD HH:mm:ss");
      let end = moment(this.state.toDate).format("YYYY-MM-DD HH:mm:ss");
      let startDate = moment(e.fromDate).format("YYYY-MM-DD HH:mm:ss");
      let endDate = moment(e.toDate).format("YYYY-MM-DD HH:mm:ss");
      return (
        moment(startDate).isBetween(start, end) &&
        moment(endDate).isBetween(start, end)
      );
    });
    this.setState({
      eventList: eventsArray,
    });
  };

  render() {
    return (
      <div className="home-container">
        <div className="home-header">
          <div className="date">
            <h4>From Date</h4>
            <TextField
              variant="outlined"
              type="date"
              className="date-input"
              onChange={(e) => this.handleChange("start", e)}
            />
          </div>
          <div className="date">
            <h4>To Date</h4>
            <TextField
              variant="outlined"
              type="date"
              className="date-input"
              onChange={(e) => this.handleChange("end", e)}
            />
          </div>
          <div className="date-search">
            <Button variant="contained" onClick={this.filterByDate}>
              Search
            </Button>
          </div>
        </div>
        <div className="agenda-listing">
          <div className="list">
            {this.state.eventList != null &&
              this.state.eventList.map((e, index) => (
                <div className="card" key={index}>
                  <h3>{e.title}</h3>
                  <p>ORGANIZER - {e.organizer}</p>
                  <p>FROM - {e.fromDate}</p>
                  <p>TO - {e.toDate}</p>
                  <p>{e.description ? e.description : ""}</p>
                  {e.attendees && (
                    <div className="attendees-list">
                      <h3>Attendees List</h3>
                      <ul>
                        {e.attendees.map((person, index) => (
                          <li key={index}>
                            {person.mail} - {person.status}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }
}