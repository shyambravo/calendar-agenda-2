import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import "./Authorization.css";

export default class Authorization extends Component {
  constructor(props) {
    super(props);
    this.authorize = this.authorize.bind(this);
  }
  authorize = () => {
    window.location = `https://accounts.zoho.com/oauth/v2/auth?scope=ZohoCalendar.calendar.READ%2CZohoCalendar.event.READ&client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=code&redirect_uri=http://127.0.0.1:3000/home&access_type=offline`;
  };
  render() {
    return (
      <div className="Authorization-container">
        <Button variant="contained" onClick={this.authorize}>
          Authorize
        </Button>
      </div>
    );
  }
}
