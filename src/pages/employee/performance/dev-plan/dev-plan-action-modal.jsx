import React, { useEffect, useState } from 'react';
import { Box, TextField, Typography, Button, Modal, IconButton } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import FormikAutocomplete from '../../../common/formik-autocomplete';
import CloseIcon from '@mui/icons-material/Close';

const DevPlanActionModal = ({ open, setOpen, action, data, onAction, developSkillList, approachList, devArchievedList }) => {
  const [disableBtn, setDisableBtn] = useState(false);

  const validationSchema = Yup.object({
    skill: Yup.string().required('Development skill is required'),
    approach: Yup.string().required('Approach is required'),
    area: Yup.string().required('Area is required'),
    actionPlant: Yup.string().required('Action plan is required')
  });

  useEffect(() => {
    if (!open) setDisableBtn(false);
  }, [open]);

  const handleClose = (event, reason) => {
    if (reason && reason === 'backdropClick') {
      return;
    }
    setOpen(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Modal open={open} onClose={handleClose} disableEscapeKeyDown>
        <Box
          sx={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: 3,
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: 24,
            maxWidth: '900px', // You can adjust max width as per your needs
            display: 'flex',
            flexDirection: 'column',
            alignremarks: 'flex-start',
            justifyContent: 'flex-start',
            position: 'relative'
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 10,
              right: 10
            }}
          >
            <CloseIcon fontSize="1.5em" />
          </IconButton>

          <Typography variant="h4" sx={{ marginBottom: 2 }}>
            {action === 'edit' ? 'Update Development Plan' : 'Create Development Plan'}
          </Typography>

          <Formik
            initialValues={{
              skill: data?.skill || '',
              approach: data?.approach || '',
              area: data?.area || '',
              actionPlant: data?.actionPlant || '',
              remark: data?.remark || '',
              achieved: data?.achieved || ''
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              onAction(values);
            }}
          >
            {({ values, handleChange, errors, touched, setFieldValue, isSubmitting }) => (
              <Form style={{ width: '100%' }}>
                <Grid
                  container
                  spacing={2}
                  sx={{
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    marginBottom: 5,
                    paddingTop: 1
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormikAutocomplete
                        name="skill"
                        filedName="name"
                        options={developSkillList}
                        getOptionLabel={(option) => option.name || ''}
                        label="Development Skill"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormikAutocomplete
                        name="approach"
                        filedName="name"
                        options={approachList}
                        getOptionLabel={(option) => option.name || ''}
                        label="Approach"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <FormikAutocomplete
                        name="achieved"
                        options={devArchievedList}
                        getOptionLabel={(option) => option.name || ''}
                        label="Achieved"
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="area"
                        variant="outlined"
                        name="area"
                        value={values.area}
                        onChange={handleChange}
                        error={touched.area && !!errors.area}
                        helperText={touched.area && errors.area}
                        slotProps={{
                          inputLabel: { shrink: true }
                        }}
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Action Plan"
                        variant="outlined"
                        name="actionPlant"
                        value={values.actionPlant}
                        onChange={handleChange}
                        error={touched.actionPlant && !!errors.actionPlant}
                        helperText={touched.actionPlant && errors.actionPlant}
                        slotProps={{
                          inputLabel: { shrink: true }
                        }}
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="remark"
                        variant="outlined"
                        name="remark"
                        value={values.remark}
                        onChange={handleChange}
                        error={touched.remark && !!errors.remark}
                        helperText={touched.remark && errors.remark}
                        slotProps={{
                          inputLabel: { shrink: true }
                        }}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 20,
                    right: 25,
                    display: 'flex',
                    gap: 2,
                    marginTop: 1
                  }}
                >
                  <Button disabled={disableBtn} type="submit" variant="contained" sx={{ width: 80, height: 30 }}>
                    {action === 'edit' ? 'Update' : 'Create'}
                  </Button>
                  <Button onClick={() => handleClose()} variant="outlined" sx={{ width: 80, height: 30 }}>
                    Cancel
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
    </LocalizationProvider>
  );
};

export default DevPlanActionModal;
