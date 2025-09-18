import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, IconButton, Button, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';

const WorklevelModal = ({ open, setOpen, onAction, rowData, action }) => {
  const [disableBtn, setDisableBtn] = useState(false);
  const handleClose = () => {
    setOpen(false);
    setDisableBtn(true);
  };

  useEffect(() => {
    setDisableBtn(false);
  }, [open]);

  const validationSchema = Yup.object({
    payPos: Yup.string().required('Worklevel payPos is required').max(4, 'Worklevel payPos cannot be longer than 4 characters'),
    levels: Yup.string().required('Worklevel levels  is required')
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
          maxWidth: '650px',
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
          {action === 'edit' ? 'Update Worklevel' : 'Create Worklevel'}
        </Typography>

        <Formik
          initialValues={{
            payPos: rowData?.payPos || '',
            levels: rowData?.levels || '',
            payPoint: rowData?.payPoint || '',
            id: rowData?.id || ''
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
                    label="Code"
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
                    label="Pay Position"
                    variant="outlined"
                    value={values.payPos}
                    onChange={handleChange}
                    name="payPos"
                    error={touched.payPos && !!errors.payPos}
                    helperText={touched.payPos && errors.payPos}
                    sx={{ marginBottom: 2 }}
                    slotProps={{
                      inputLabel: { shrink: true }
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 12 }}>
                  <TextField
                    fullWidth
                    label="Level"
                    variant="outlined"
                    value={values.levels}
                    type="number"
                    onChange={handleChange}
                    name="levels"
                    error={touched.levels && !!errors.levels}
                    helperText={touched.levels && errors.levels}
                    sx={{ marginBottom: 2 }}
                    slotProps={{
                      inputLabel: { shrink: true }
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 12 }}>
                  <TextField
                    fullWidth
                    label="Pay Point"
                    variant="outlined"
                    value={values.payPoint}
                    type="number"
                    onChange={handleChange}
                    name="payPoint"
                    error={touched.payPoint && !!errors.payPoint}
                    helperText={touched.payPoint && errors.payPoint}
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

export default WorklevelModal;
