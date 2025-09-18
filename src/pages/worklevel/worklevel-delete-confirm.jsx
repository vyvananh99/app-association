import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const WorklevelDeleteConfirm = ({ open, setOpen, onConfirm, data }) => {
  const { id, payPos, levels, payPoint } = data || {};

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', fontSize: 20, position: 'relative' }}>
        Delete Confirmation
        <IconButton aria-label="close" onClick={() => setOpen(false)} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography>
          <strong>Worklevel Information:</strong>
        </Typography>
        <div style={{ marginTop: 10 }}>
          <div>
            <span style={{ display: 'inline-block', width: '150px' }}>Code</span>
            <span style={{ paddingRight: 10 }}>:</span>
            <span> {id || 'N/A'} </span>
          </div>
          <div>
            <span style={{ display: 'inline-block', width: '150px' }}>Pay Position</span>
            <span style={{ paddingRight: 10 }}>:</span>
            <span> {payPos || 'N/A'} </span>
          </div>
          <div>
            <span style={{ display: 'inline-block', width: '150px' }}>Level</span>
            <span style={{ paddingRight: 10 }}>:</span>
            <span> {levels || 'N/A'}</span>
          </div>
          <div>
            <span style={{ display: 'inline-block', width: '150px' }}>Pay Point</span>
            <span style={{ paddingRight: 10 }}>:</span>
            <span> {payPoint || 'N/A'}</span>
          </div>
        </div>
        <Typography mt={2}>Are you sure you want to delete this Worklevel?</Typography>
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

export default WorklevelDeleteConfirm;
