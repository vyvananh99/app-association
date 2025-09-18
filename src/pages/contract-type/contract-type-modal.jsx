import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, IconButton, Button, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';

const ContractTypeModal = ({ open, setOpen, onAction, rowData, action }) => {
  const [disableBtn, setDisableBtn] = useState(false);
  const handleClose = () => {
    setOpen(false);
    setDisableBtn(true);
  };

  useEffect(() => {
    setDisableBtn(false);
  }, [open]);

  const validationSchema = Yup.object({
    name: Yup.string().required('Contract Type Name is required').max(255, 'ContractType Name cannot be longer than 255 characters'),

    period: Yup.string().required('Contract Type Period  is required')
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
          {action === 'edit' ? 'Update Contract Type' : 'Create Contract Type'}
        </Typography>

        <Formik
          initialValues={{
            name: rowData?.name || '',
            period: rowData?.period || ''
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
                    label="Period"
                    variant="outlined"
                    value={values.period}
                    type="number"
                    onChange={handleChange}
                    name="period"
                    error={touched.period && !!errors.period}
                    helperText={touched.period && errors.period}
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

export default ContractTypeModal;
