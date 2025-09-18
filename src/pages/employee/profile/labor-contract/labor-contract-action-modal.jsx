import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, IconButton, Button, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form, useField, useFormikContext } from 'formik';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import FormikAutocomplete from '../../../common/formik-autocomplete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

const LaborContractActionModal = ({ open, setOpen, onAction, rowData, action, contractTypeData }) => {
  const [disableBtn, setDisableBtn] = useState(false);
  const handleClose = (event, reason) => {
    if (reason && reason === 'backdropClick') {
      return;
    }
    setOpen(false);
    setDisableBtn(true);
  };

  useEffect(() => {
    setDisableBtn(false);
  }, [open]);

  const validationSchema = Yup.object({
    no: Yup.string().required('No is required').max(20, 'No cannot be longer than 255 characters'),
    contractType: Yup.string().required('Contract Type  is required'),
    extendDate: Yup.string().required('Start Date is required'),
    expireDate: Yup.string().required('Expire Date  is required')
  });

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
            {action === 'edit' ? 'Update Contract' : 'Create Contract'}
          </Typography>

          <Formik
            initialValues={{
              no: rowData?.no || '',
              contractType: rowData?.contractType || '',
              extendDate: rowData?.extendDate || '',
              expireDate: rowData?.expireDate || ''
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              onAction(values, action);
              // handleClose();
              setDisableBtn(true);
            }}
          >
            {({ values, handleChange, errors, touched, setFieldValue, setFieldTouched, validateField }) => (
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
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="No."
                      variant="outlined"
                      value={values.no}
                      onChange={handleChange}
                      name="no"
                      error={touched.no && !!errors.no}
                      helperText={touched.no && errors.no}
                      sx={{ marginBottom: 2 }}
                      slotProps={{
                        inputLabel: { shrink: true }
                      }}
                      size="small"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormikAutocomplete
                      name="contractType"
                      options={contractTypeData}
                      getOptionLabel={(option) => option.name || ''}
                      label="Type"
                      onChange={(event, newValue) => {
                        setFieldValue('contractType', newValue?.id || '');
                        if (newValue && values.extendDate && newValue.period) {
                          const extendDate = dayjs(values.extendDate);
                          const newExpireDate = extendDate.add(newValue.period, 'month').toISOString();
                          setFieldValue('expireDate', newExpireDate);
                        }
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <DatePicker
                      label="Start Date"
                      value={values.extendDate ? dayjs(values.extendDate) : null}
                      onChange={async (date) => {
                        await setFieldValue('extendDate', date ? date.toISOString() : '');
                        validateField('extendDate');
                        if (values.contractType && date) {
                          const contractType = contractTypeData.find((i) => i.id === values.contractType);
                          if (contractType) {
                            const extendDate = dayjs(date);
                            const newExpireDate = extendDate.add(contractType.period, 'month').toISOString();
                            setFieldValue('expireDate', newExpireDate);
                          }
                        }
                        setFieldTouched('extendDate', true, false);
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: 'small',
                          InputLabelProps: { shrink: true },
                          error: touched.extendDate && Boolean(errors.extendDate),
                          helperText: touched.extendDate && errors.extendDate
                        }
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <DatePicker
                      label="Expired Date"
                      value={values.expireDate ? dayjs(values.expireDate) : null}
                      onChange={(date) => {
                        setFieldValue('expireDate', date ? date.toISOString() : '');
                        setFieldTouched('expireDate', true, false);
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: 'small',
                          InputLabelProps: { shrink: true },
                          error: touched.expireDate && Boolean(errors.expireDate),
                          helperText: touched.expireDate && errors.expireDate
                        }
                      }}
                      minDate={values.extendDate ? dayjs(values.extendDate) : undefined}
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
    </LocalizationProvider>
  );
};

export default LaborContractActionModal;
