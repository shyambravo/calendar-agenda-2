import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import PersonIcon from '@material-ui/icons/Person';
import DateRangeIcon from '@material-ui/icons/DateRange';
import PeopleIcon from '@material-ui/icons/People';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import './Home.css';

export default function MonthView(props) {
  const { eventList } = props;
  return (
    <div className="agenda-listing">
      <div className="list">
        {eventList != null
        && eventList.map((e, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Card className="card" key={index}>
            <CardContent>
              <Typography>
                <h3>{e.title}</h3>
              </Typography>
              <Typography className="card-content">
                <PersonIcon />
                <p>
                  ORGANIZER -
                  {e.organizer}
                </p>
              </Typography>
              <Typography className="card-content">
                <DateRangeIcon />
                <p>
                  {e.fromDate}
                  {' - '}
                  {e.toDate}
                </p>
              </Typography>
              {e.attendees && (
                <Typography className="card-content">
                  <PeopleIcon />
                  <p>
                    Total Participant :
                    {e.attendees.length}
                  </p>
                </Typography>
              )}
              {e.location && (
                <Typography className="card-content">
                  <LocationOnIcon />
                  <p>{e.location}</p>
                </Typography>
              )}
              {e.description && (
                <Typography className="card-content">
                  <p>{e.description ? e.description : ''}</p>
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>

  );
}
