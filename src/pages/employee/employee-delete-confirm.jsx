import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const EmployeeDeleteConfirm = ({ open, setOpen, onConfirm, data, companyData }) => {
  const { employeeId, vnNameFirst, vnNameLast, enNameFirst, enNameLast } = data || {};
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
          <strong>Employee Information:</strong>
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
            <span> {employeeId || 'N/A'} </span>
          </div>
          <div>
            <span style={{ display: 'inline-block', width: '150px' }}>English Full Name</span>
            <span style={{ paddingRight: 10 }}>:</span>
            <span> {`${vnNameFirst || ''} ${vnNameLast || ''}` || 'N/A'}</span>
          </div>
          <div>
            <span style={{ display: 'inline-block', width: '150px' }}>Vietnamese Full Name</span>
            <span style={{ paddingRight: 10 }}>:</span>
            <span> {`${enNameFirst || ''} ${enNameLast || ''}` || 'N/A'} </span>
          </div>
        </div>
        <Typography mt={2}>Are you sure you want to delete this Employee?</Typography>
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

export default EmployeeDeleteConfirm;
