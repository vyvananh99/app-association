import React, { useEffect, useState } from 'react';
import { Box, TextField, Typography, Button, Modal, IconButton } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import CloseIcon from '@mui/icons-material/Close';

const LanguageModal = ({ open, setOpen, action, LanguageLevel, data, onAction }) => {
  const [disableBtn, setDisableBtn] = useState(false);

  const validationSchema = Yup.object({
    language: Yup.string().required('Language is required'),
    certificate: Yup.string().required('Certificate is required')
  });

  useEffect(() => {
    if (!open) setDisableBtn(false);
  }, [open]);

  const handleClose = () => {
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
            {action === 'edit' ? 'Update Language' : 'Create Language'}
          </Typography>

          <Formik
            initialValues={{
              issuedDate: data?.issuedDate || '',
              language: data?.language || '',
              certificate: data?.certificate || '',
              levels: data?.levels || ''
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              onAction(values);
            }}
          >
            {({ values, handleChange, errors, touched, setFieldValue }) => (
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
                  <Grid container spacing={2} size={{ xs: 12 }}>
                    <Grid size={{ xs: 6 }}>
                      <TextField
                        fullWidth
                        label="Language"
                        variant="outlined"
                        name="language"
                        value={values.language}
                        onChange={handleChange}
                        error={touched.language && !!errors.language}
                        helperText={touched.language && errors.language}
                        slotProps={{
                          inputLabel: { shrink: true }
                        }}
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <TextField
                        fullWidth
                        label="Level"
                        variant="outlined"
                        name="levels"
                        value={values.levels}
                        onChange={handleChange}
                        error={touched.levels && !!errors.levels}
                        helperText={touched.levels && errors.levels}
                        slotProps={{
                          inputLabel: { shrink: true }
                        }}
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Certificate"
                        variant="outlined"
                        name="certificate"
                        value={values.certificate}
                        onChange={handleChange}
                        error={touched.certificate && !!errors.certificate}
                        helperText={touched.certificate && errors.certificate}
                        slotProps={{
                          inputLabel: { shrink: true }
                        }}
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <DatePicker
                        label="Issued Date"
                        value={values.issuedDate ? dayjs(values.issuedDate) : null}
                        onChange={(date) => setFieldValue('issuedDate', date ? date.toISOString() : null)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: 'small',
                            InputLabelProps: { shrink: true },
                            error: touched.issuedDate && !!errors.issuedDate,
                            helperText: touched.issuedDate && errors.issuedDate
                          }
                        }}
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

export default LanguageModal;
