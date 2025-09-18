import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const LocationDeleteConfirm = ({ open, setOpen, onConfirm, data }) => {
  const { id, enName, vnName } = data || {};

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', fontSize: 20, position: 'relative' }}>
        Delete Confirmation
        {/* Nút đóng modal */}
        <IconButton aria-label="close" onClick={() => setOpen(false)} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography>
          <strong>Province Information:</strong>
        </Typography>
        <div style={{ marginTop: 10 }}>
          <div>
            <span style={{ display: 'inline-block', width: '150px' }}>CODE</span>
            <span style={{ paddingRight: 10 }}>:</span>
            <span> {id || 'N/A'} </span>
          </div>
          <div>
            <span style={{ display: 'inline-block', width: '150px' }}>English Name</span>
            <span style={{ paddingRight: 10 }}>:</span>
            <span> {enName || 'N/A'}</span>
          </div>
          <div>
            <span style={{ display: 'inline-block', width: '150px' }}>Vietnamese Name</span>
            <span style={{ paddingRight: 10 }}>:</span>
            <span> {vnName || 'N/A'}</span>
          </div>
        </div>
        <Typography mt={2}>Are you sure you want to delete this Province?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onConfirm(data)} color="error" variant="contained">
          Delete
        </Button>
        <Button onClick={() => setOpen(false)} color="primary" variant="outlined">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LocationDeleteConfirm;
