import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { getAuthURL } from '../../services/Events';
import config from '../../../config';
import './Authorization.css';

export default class Authorization extends Component {
  constructor(props) {
    super(props);
    this.authorize = this.authorize.bind(this);
  }

  authorize = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken !== null) {
      window.location = config.REACT_APP_URL;
    } else {
      window.location = await getAuthURL();
    }
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
