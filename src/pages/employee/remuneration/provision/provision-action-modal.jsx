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

const ProvisionActionModal = ({ open, setOpen, action, data, onAction }) => {
  const [disableBtn, setDisableBtn] = useState(false);

  const validationSchema = Yup.object({
    extendDate: Yup.date().required('Start Date is required'),
    expireDate: Yup.date().required('End Date is required'),
    value: Yup.string().required('Value is required'),
    item: Yup.string().required('Item is required')
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
            {action === 'edit' ? 'Update Company Loan' : 'Create Company Loan'}
          </Typography>

          <Formik
            initialValues={{
              extendDate: data?.extendDate || '',
              expireDate: data?.expireDate || '',
              description: data?.description || '',
              value: data?.value || '',
              item: data?.item || ''
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
                      <DatePicker
                        label="Start Date"
                        value={values.extendDate ? dayjs(values.extendDate) : null}
                        onChange={(date) => setFieldValue('extendDate', date ? date.toISOString() : null)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: 'small',
                            InputLabelProps: { shrink: true },
                            error: touched.extendDate && !!errors.extendDate,
                            helperText: touched.extendDate && errors.extendDate
                          }
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <DatePicker
                        label="Expire Date"
                        value={values.expireDate ? dayjs(values.expireDate) : null}
                        onChange={(date) => setFieldValue('expireDate', date ? date.toISOString() : null)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: 'small',
                            InputLabelProps: { shrink: true },
                            error: touched.expireDate && !!errors.expireDate,
                            helperText: touched.expireDate && errors.expireDate
                          }
                        }}
                        minDate={values.extendDate ? dayjs(values.extendDate) : undefined}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Description"
                        variant="outlined"
                        name="description"
                        value={values.description}
                        onChange={handleChange}
                        error={touched.description && !!errors.description}
                        helperText={touched.description && errors.description}
                        slotProps={{
                          inputLabel: { shrink: true },
                        }}
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Value"
                        variant="outlined"
                        name="value"
                        value={values.value}
                        onChange={handleChange}
                        error={touched.value && !!errors.value}
                        helperText={touched.value && errors.value}
                        slotProps={{
                          inputLabel: { shrink: true }
                        }}
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Item"
                        variant="outlined"
                        name="item"
                        value={values.item}
                        onChange={handleChange}
                        error={touched.item && !!errors.item}
                        helperText={touched.item && errors.item}
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

export default ProvisionActionModal;
