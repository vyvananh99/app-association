import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';

const OtherSkillDeleteConfirm = ({ open, setOpen, onConfirm, data }) => {
  const { skill, issuedDate, certificate, employeeId, relatTraining } = data || {};
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
          <strong>Other skill Information:</strong>
        </Typography>
        <div style={{ marginTop: 10 }}>
          <div>
            <span style={{ display: 'inline-block', width: '150px' }}>Employee ID</span>
            <span style={{ paddingRight: 10 }}>:</span>
            <span> {employeeId || 'N/A'}</span>
          </div>
          <div>
            <span style={{ display: 'inline-block', width: '150px' }}>Skill</span>
            <span style={{ paddingRight: 10 }}>:</span>
            <span> {skill || 'N/A'} </span>
          </div>
          <div>
            <span style={{ display: 'inline-block', width: '150px' }}>Certificate</span>
            <span style={{ paddingRight: 10 }}>:</span>
            <span> {certificate || 'N/A'} </span>
          </div>
          <div>
            <span style={{ display: 'inline-block', width: '150px' }}>Issued Date</span>
            <span style={{ paddingRight: 10 }}>:</span>
            <span> {(issuedDate && dayjs(issuedDate).format('DD-MM-YYYY')) || 'N/A'}</span>
          </div>
          <div>
            <span style={{ display: 'inline-block', width: '150px' }}>Relevant Training</span>
            <span style={{ paddingRight: 10 }}>:</span>
            <span> {relatTraining || 'N/A'} </span>
          </div>
        </div>
        <Typography mt={2}>Are you sure you want to delete this other skill?</Typography>
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

export default OtherSkillDeleteConfirm;
