import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';

const MovementSalaryDeleteConfirm = ({ open, setOpen, onConfirm, data }) => {
  const { courseId, courseTitle, startDate, endDate } = data || {};

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
          <strong>TrainingProcess Information:</strong>
        </Typography>
        <div style={{ marginTop: 10 }}>
          <div>
            <span style={{ display: 'inline-block', width: '150px' }}>Couese ID</span>
            <span style={{ paddingRight: 10 }}>:</span>
            <span> {courseId || 'N/A'} </span>
          </div>
          <div>
            <span style={{ display: 'inline-block', width: '150px' }}>Course Title</span>
            <span style={{ paddingRight: 10 }}>:</span>
            <span> {courseTitle || 'N/A'}</span>
          </div>
          <div>
            <span style={{ display: 'inline-block', width: '150px' }}>Start Date</span>
            <span style={{ paddingRight: 10 }}>:</span>
            <span> {(startDate && dayjs(startDate).format('DD-MM-YYYY')) || 'N/A'}</span>
          </div>
          <div>
            <span style={{ display: 'inline-block', width: '150px' }}>End Date</span>
            <span style={{ paddingRight: 10 }}>:</span>
            <span> {(endDate && dayjs(endDate).format('DD-MM-YYYY')) || 'N/A'}</span>
          </div>
        </div>
        <Typography mt={2}>Are you sure you want to delete this TrainingProcess?</Typography>
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

export default MovementSalaryDeleteConfirm;
