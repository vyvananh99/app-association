import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const TrainingDeleteConfirm = ({ open, setOpen, onConfirm, data, companyData }) => {
  const { forLevel, effectiveDate, description, employeeId } = data || {};
  let company;
  if (data && data.comId) company = companyData.find((i) => i.id === data.comId);
  const companyName = company ? company.name : '';
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
          <strong>Training Information:</strong>
        </Typography>
        <div style={{ marginTop: 10 }}>
          <div>
            <span style={{ display: 'inline-block', width: '150px' }}>Company Name</span>
            <span style={{ paddingRight: 10 }}>:</span>
            <span> {companyName || 'N/A'} </span>
          </div>
          <div>
            <span style={{ display: 'inline-block', width: '150px' }}>Employee ID</span>
            <span style={{ paddingRight: 10 }}>:</span>
            <span> {employeeId || 'N/A'}</span>
          </div>
          <div>
            <span style={{ display: 'inline-block', width: '150px' }}>Effective Date</span>
            <span style={{ paddingRight: 10 }}>:</span>
            <span> {effectiveDate || 'N/A'}</span>
          </div>
          <div>
            <span style={{ display: 'inline-block', width: '150px' }}>Level</span>
            <span style={{ paddingRight: 10 }}>:</span>
            <span> {forLevel || 'N/A'} </span>
          </div>
          <div>
            <span style={{ display: 'inline-block', width: '150px' }}>Description</span>
            <span style={{ paddingRight: 10 }}>:</span>
            <span> {description || 'N/A'} </span>
          </div>
        </div>
        <Typography mt={2}>Are you sure you want to delete this Training?</Typography>
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

export default TrainingDeleteConfirm;
