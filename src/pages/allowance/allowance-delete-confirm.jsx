import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import { formatNumber } from 'utils/convert-money';

const AllowanceDeleteConfirm = ({ open, setOpen, onConfirm, data, allowTypeData }) => {
  const { employeeId, type, pay, endDate } = data || {};
  const allowanceTypeName = allowTypeData && allowTypeData.find((i) => i.type === type);
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
          <strong>Fix Allowance Information:</strong>
        </Typography>
        <div style={{ marginTop: 10 }}>
          <div>
            <span style={{ display: 'inline-block', width: '150px' }}>Couese ID</span>
            <span style={{ paddingRight: 10 }}>:</span>
            <span> {employeeId || 'N/A'} </span>
          </div>
          <div>
            <span style={{ display: 'inline-block', width: '150px' }}>Course Title</span>
            <span style={{ paddingRight: 10 }}>:</span>
            <span> {allowanceTypeName || 'N/A'}</span>
          </div>
          <div>
            <span style={{ display: 'inline-block', width: '150px' }}>Start Date</span>
            <span style={{ paddingRight: 10 }}>:</span>
            <span> {(pay && formatNumber(pay)) || 'N/A'}</span>
          </div>
        </div>
        <Typography mt={2}>Are you sure you want to delete this allowance?</Typography>
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

export default AllowanceDeleteConfirm;
