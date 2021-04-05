import React, { useRef, useEffect } from 'react';
import Button from '@material-ui/core/Button';

export default function AlertModal(props) {
  const inputRef = useRef(null);
  const { message } = props;
  const modalClose = () => {
    props.closeModal();
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div className="agenda-backdrop">
      <div className="agenda-modal">
        <div className="agenda-alert">
          <h3>{message}</h3>
          <Button
            variant="contained"
            color="primary"
            style={{ marginBottom: '20px', width: '100%' }}
            onClick={() => modalClose()}
            ref={inputRef}
          >
            Close
          </Button>
        </div>

      </div>

    </div>
  );
}
