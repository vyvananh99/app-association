import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ComLoanDeleteConfirm = ({ open, setOpen, onConfirm, data }) => {
  const { startDate, endDate, amount, comLoanPayback, description } = data || {};
  const formatNumber = (val) => {
    if (!val) return '';
    return Number(val).toLocaleString('en-US');
  };

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
          <strong>Company Loan Information:</strong>
        </Typography>
        <div style={{ marginTop: 10 }}>
          {/* <div>
            <span style={{ display: 'inline-block', width: '150px' }}>Name</span>
            <span style={{ paddingRight: 10 }}>:</span>
            <span> {name || 'N/A'}</span>
          </div> */}
          <div>
            <span style={{ display: 'inline-block', width: '150px' }}>Start Date</span>
            <span style={{ paddingRight: 10 }}>:</span>
            <span> {startDate || 'N/A'} </span>
          </div>
          <div>
            <span style={{ display: 'inline-block', width: '150px' }}>End Date</span>
            <span style={{ paddingRight: 10 }}>:</span>
            <span> {endDate || 'N/A'} </span>
          </div>
          <div>
            <span style={{ display: 'inline-block', width: '150px' }}>Description</span>
            <span style={{ paddingRight: 10 }}>:</span>
            <span> {description || 'N/A'} </span>
          </div>
          <div>
            <span style={{ display: 'inline-block', width: '150px' }}>Amount</span>
            <span style={{ paddingRight: 10 }}>:</span>
            <span> {formatNumber(amount) || 'N/A'} </span>
          </div>
          <div>
            <span style={{ display: 'inline-block', width: '150px' }}>Monthly Payment</span>
            <span style={{ paddingRight: 10 }}>:</span>
            <span> {formatNumber(comLoanPayback) || 'N/A'} </span>
          </div>
        </div>
        <Typography mt={2}>Are you sure you want to delete this ComLoan member?</Typography>
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

export default ComLoanDeleteConfirm;
