/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React, { Component } from 'react';
import { Input } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import Button from '@material-ui/core/Button';

export default class EditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      color: '',
      description: '',
      fromTime: '',
      toTime: '',
      closeModal: null,
      editEventSubmit: null,
      focus: null,
    };
    this.myRef = React.createRef();

    this.modalHandleChange = this.modalHandleChange.bind(this);
    this.updateState = this.updateState.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.editEventSubmit = this.editEventSubmit.bind(this);
  }

  componentDidMount() {
    const {
      title, color, description, fromTime, toTime, closeModal, editEventSubmit,
    } = this.props;
    this.setState({
      title,
      color,
      description,
      fromTime,
      toTime,
      editEventSubmit,
      closeModal,
    });
    this.myRef.current.focus();
  }

  componentDidUpdate(prevProps) {
    const {
      title, color, description, fromTime, toTime, closeModal, editEventSubmit,
    } = this.props;
    if (prevProps !== this.props) {
      this.updateState(title, color, description, fromTime, toTime, closeModal, editEventSubmit);
    }
  }

  modalHandleChange = (type, e) => {
    if (type === 'fromTime') {
      this.setState({
        fromTime: e,
      });
    } else if (type === 'toTime') {
      this.setState({
        toTime: e,
      });
    } else if (type === 'color') {
      this.setState({
        color: e.target.value,
      });
    } else if (type === 'description') {
      this.setState({
        description: e.target.value,
      });
    } else {
      this.setState({
        title: e.target.value,
      });
    }
  };

  closeModal = () => {
    const { closeModal } = this.state;
    closeModal();
  }

  editEventSubmit = () => {
    const { editEventSubmit } = this.state;
    const {
      title, color, description, fromTime, toTime,
    } = this.state;
    editEventSubmit(title, color, description, fromTime, toTime);
  }

  updateState(title, color, description, fromTime, toTime, closeModal, editEventSubmit) {
    this.setState({
      title,
      color,
      description,
      fromTime,
      toTime,
      closeModal,
      editEventSubmit,
    });
  }

  render() {
    const {
      title, color, description, fromTime, toTime,
    } = this.state;
    return (
      // eslint-disable-next-line jsx-a11y/tabindex-no-positive
      <div className="agenda-backdrop">
        <div className="agenda-modal">
          <h3>Edit Event</h3>
          <TextField
            id="outlined-basic"
            onChange={(e) => this.modalHandleChange('title', e)}
            value={title}
            label="Title"
            variant="outlined"
            className="agenda-modal-input"
            tabIndex={0}
            ref={this.myRef}
          />
          <div className="agenda-modal-date">
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DateTimePicker value={fromTime} onChange={(e) => this.modalHandleChange('fromTime', e)} label="FromTime" tabIndex={0} />
            </MuiPickersUtilsProvider>
          </div>
          <div className="agenda-modal-date">
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DateTimePicker value={toTime} onChange={(e) => this.modalHandleChange('toTime', e)} label="ToTime" tabIndex={0} />
            </MuiPickersUtilsProvider>
          </div>

          <div className="color-picker-container">
            <Input type="color" variant="outlined" className="color-picker" placeholder="select color" onChange={(e) => this.modalHandleChange('color', e)} value={color} tabIndex={0} />
            <p>select color</p>
          </div>
          <TextField
            id="description"
            label="Description"
            multiline
            rows={4}
            defaultValue="Event Description"
            variant="outlined"
            style={{ width: '100%', marginTop: '20px' }}
            value={description}
            onChange={(e) => this.modalHandleChange('description', e)}
            tabIndex={0}
          />
          <div className="modal-buttons">
            <Button
              variant="contained"
              color="primary"
              style={{ width: '45%', marginRight: '10%' }}
              onClick={() => this.editEventSubmit()}
              tabIndex={0}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="primary"
              style={{ width: '45%' }}
              onClick={() => this.closeModal()}
              tabIndex={0}
            >
              Close
            </Button>
          </div>

        </div>
      </div>
    );
  }
}
