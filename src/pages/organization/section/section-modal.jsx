import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, IconButton, Button, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';

const SectionModal = ({ open, setOpen, onAction, rowData, action }) => {
  const [disableBtn, setDisableBtn] = useState(false);
  const handleClose = () => {
    setOpen(false);
    setDisableBtn(true);
  };

  useEffect(() => {
    setDisableBtn(false);
  }, [open]);

  const validationSchema = Yup.object({
    id: Yup.string()
      .required('Section Code is required')
      .matches(/^[A-Za-z0-9]{4,20}$/, 'Section Code must be more than 2 characters and less than 20 characters'),

    vnName: Yup.string().required('Section English Name is required').max(255, 'Section Name cannot be longer than 255 characters'),

    enName: Yup.string().required('Section Vietnamese Name is required').max(255, 'Vietnamese Name cannot be longer than 255 characters')
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
          width: '70%', // Set width to 100% to make it responsive
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
          {action === 'edit' ? 'Update Section' : 'Create Section'}
        </Typography>

        <Formik
          initialValues={{
            id: rowData?.id || '',
            enName: rowData?.enName || '',
            vnName: rowData?.vnName || ''
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
                    value={values.id}
                    onChange={handleChange}
                    name="id"
                    error={touched.id && !!errors.id}
                    helperText={touched.id && errors.id}
                    sx={{ marginBottom: 2 }}
                    slotProps={{
                      inputLabel: { shrink: true }
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 12 }}>
                  <TextField
                    fullWidth
                    label="English Name"
                    variant="outlined"
                    value={values.enName}
                    onChange={handleChange}
                    name="enName"
                    error={touched.enName && !!errors.enName}
                    helperText={touched.enName && errors.enName}
                    sx={{ marginBottom: 2 }}
                    slotProps={{
                      inputLabel: { shrink: true }
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 12 }}>
                  <TextField
                    fullWidth
                    label="Vietnamese Name"
                    variant="outlined"
                    value={values.vnName}
                    onChange={handleChange}
                    name="vnName"
                    error={touched.vnName && !!errors.vnName}
                    helperText={touched.vnName && errors.vnName}
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

export default SectionModal;
