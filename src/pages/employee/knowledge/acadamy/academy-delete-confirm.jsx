import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';

const AcademyDeleteConfirm = ({ open, setOpen, onConfirm, data }) => {
  const { startDate, endDate, schoolName, employeeId, major } = data || {};
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
          <strong>Academy Information:</strong>
        </Typography>
        <div style={{ marginTop: 10 }}>
          <div>
            <span style={{ display: 'inline-block', width: '150px' }}>Employee ID</span>
            <span style={{ paddingRight: 10 }}>:</span>
            <span> {employeeId || 'N/A'}</span>
          </div>
          <div>
            <span style={{ display: 'inline-block', width: '150px' }}>Start Date</span>
            <span style={{ paddingRight: 10 }}>:</span>
            <span> {(startDate && dayjs(startDate).format('DD-MM-YYYY')) || 'N/A'} </span>
          </div>
          <div>
            <span style={{ display: 'inline-block', width: '150px' }}>End Date</span>
            <span style={{ paddingRight: 10 }}>:</span>
            <span> {(endDate && dayjs(endDate).format('DD-MM-YYYY')) || 'N/A'}</span>
          </div>
          <div>
            <span style={{ display: 'inline-block', width: '150px' }}>School Name</span>
            <span style={{ paddingRight: 10 }}>:</span>
            <span> {schoolName || 'N/A'} </span>
          </div>
          <div>
            <span style={{ display: 'inline-block', width: '150px' }}>Major</span>
            <span style={{ paddingRight: 10 }}>:</span>
            <span> {major || 'N/A'} </span>
          </div>
        </div>
        <Typography mt={2}>Are you sure you want to delete this Academy?</Typography>
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

export default AcademyDeleteConfirm;
