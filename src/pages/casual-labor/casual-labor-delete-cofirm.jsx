import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const CasualLaborDeleteConfirm = ({ open, setOpen, onConfirm, rowData = {} }) => {
  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', fontSize: 20, position: 'relative' }}>
        Delete
        <IconButton aria-label="close" onClick={() => setOpen(false)} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <div style={{ marginTop: 10 }}>
          <div>
            <span style={{ display: 'inline-block', width: '120px' }}>Code</span>
            <span style={{ paddingRight: 10 }}>:</span>
            <span> {rowData.employeeId || 'N/A'} </span>
          </div>
          <div>
            <span style={{ display: 'inline-block', width: '120px' }}>Full Name</span>
            <span style={{ paddingRight: 10 }}>:</span>
            <span> {rowData.vnFullname || 'N/A'}</span>
          </div>
        </div>
        <Typography mt={2}>Are you sure you want to delete this casual labor?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onConfirm(rowData)} color="error" variant="contained">
          Delete
        </Button>
        <Button onClick={() => setOpen(false)} color="primary" variant="outlined">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CasualLaborDeleteConfirm;
