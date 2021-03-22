import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import './Authorization.css';

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
        <div className="shadow-container">
          <div className="agenda-title">
            <h1>Welcome to Calendar Demo</h1>
          </div>
          <Button variant="contained" onClick={this.authorize} color="primary">
            Authorize
            <ArrowForwardIcon className="icon" />
          </Button>
        </div>
      </div>
    );
  }
}
