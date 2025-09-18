import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, IconButton, Button, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';

const JobTypeModal = ({ open, setOpen, onAction, rowData, action }) => {
  const [disableBtn, setDisableBtn] = useState(false);
  const handleClose = () => {
    setOpen(false);
    setDisableBtn(true);
  };

  useEffect(() => {
    setDisableBtn(false);
  }, [open]);

  const validationSchema = Yup.object({
    code: Yup.string()
      .required('Job Type Code is required')
      .matches(/^[A-Za-z0-9]{2,15}$/, 'Job Type Code must be less than 15 characters'),

    name: Yup.string().required('Job Type Name is required').max(255, 'Job Type Name cannot be longer than 255 characters'),

    pay: Yup.string().required('Job Type pay  is required')
  });

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: 3,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: 24,
          maxWidth: '650px', // You can adjust max width as per your needs
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
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
          {action === 'edit' ? 'Update Job Type' : 'Create Job Type'}
        </Typography>

        <Formik
          initialValues={{
            code: rowData?.code || '',
            name: rowData?.name || '',
            workday: rowData?.workday || '',
            workweek: rowData?.workweek || '',
            workmonth: rowData?.workmonth || '',
            pay: rowData?.pay || ''
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            onAction(values);
            // handleClose();
            setDisableBtn(true);
          }}
        >
          {({ values, handleChange, errors, touched }) => (
            <Form style={{ width: '100%' }}>
              <Grid
                container
                spacing={2}
                sx={{
                  maxHeight: '80vh',
                  overflowY: 'auto',
                  marginBottom: 4,
                  paddingTop: 1
                }}
              >
                <Grid size={{ xs: 12, md: 12 }}>
                  <TextField
                    fullWidth
                    label="CODE"
                    variant="outlined"
                    value={values.code}
                    onChange={handleChange}
                    name="code"
                    error={touched.code && !!errors.code}
                    helperText={touched.code && errors.code}
                    sx={{ marginBottom: 2 }}
                    slotProps={{
                      inputLabel: { shrink: true }
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 12 }}>
                  <TextField
                    fullWidth
                    label="Name"
                    variant="outlined"
                    value={values.name}
                    onChange={handleChange}
                    name="name"
                    error={touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                    sx={{ marginBottom: 2 }}
                    slotProps={{
                      inputLabel: { shrink: true }
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 12 }}>
                  <TextField
                    fullWidth
                    label="Work Day"
                    variant="outlined"
                    value={values.workday}
                    type="number"
                    onChange={handleChange}
                    name="workday"
                    error={touched.workday && !!errors.workday}
                    helperText={touched.pay && errors.workday}
                    sx={{ marginBottom: 2 }}
                    slotProps={{
                      inputLabel: { shrink: true }
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 12 }}>
                  <TextField
                    fullWidth
                    label="Work Week"
                    variant="outlined"
                    value={values.workweek}
                    type="number"
                    onChange={handleChange}
                    name="workweek"
                    error={touched.workweek && !!errors.workweek}
                    helperText={touched.workweek && errors.workweek}
                    sx={{ marginBottom: 2 }}
                    slotProps={{
                      inputLabel: { shrink: true }
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 12 }}>
                  <TextField
                    fullWidth
                    label="Work Month"
                    variant="outlined"
                    value={values.workmonth}
                    type="number"
                    onChange={handleChange}
                    name="workmonth"
                    error={touched.workmonth && !!errors.workmonth}
                    helperText={touched.workmonth && errors.workmonth}
                    sx={{ marginBottom: 2 }}
                    slotProps={{
                      inputLabel: { shrink: true }
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 12 }}>
                  <TextField
                    fullWidth
                    label="Pay %"
                    variant="outlined"
                    value={values.pay}
                    type="number"
                    onChange={handleChange}
                    name="pay"
                    error={touched.pay && !!errors.pay}
                    helperText={touched.pay && errors.pay}
                    sx={{ marginBottom: 2 }}
                    slotProps={{
                      inputLabel: { shrink: true }
                    }}
                  />
                </Grid>
              </Grid>

              <Box
                sx={{
                  position: 'absolute',
                  bottom: 15,
                  right: 25,
                  display: 'flex',
                  gap: 2
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
  );
};

export default JobTypeModal;
