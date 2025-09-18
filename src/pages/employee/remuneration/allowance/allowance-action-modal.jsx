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
import { formatNumber, parseNumber } from 'utils/convert-money';

const AllowanceActionModal = ({ open, setOpen, action, data, otherListNData, employeeData, allowTypeData, rowData, onAction, disableBtn, setDisableBtn }) => {
  const validationSchema = Yup.object({
    type: Yup.string().required('Type is required'),
    pay: Yup.string().required('Amount is required'),
    employeeId: Yup.string().required('Employee ID is required')
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
            Update Allowance
          </Typography>

          <Formik
            initialValues={{
              employeeId: rowData?.employeeId || '',
              type: rowData?.type || '',
              pay: rowData?.pay || '',
              startDate: rowData?.startDate || '',
              endDate: rowData?.endDate || '',
              comments: rowData?.comments || ''
            }}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              await onAction(values);
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
                    marginBottom: 4,
                    paddingTop: 2
                  }}
                >
                  <Grid size={{ xs: 12 }}>
                    <FormikAutocomplete
                      name="type"
                      filedName="code"
                      options={allowTypeData}
                      getOptionLabel={(option) => option.name || ''}
                      label="Type"
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Amount"
                      variant="outlined"
                      name="pay"
                      value={formatNumber(values.pay)}
                      onChange={(e) => {
                        const raw = parseNumber(e.target.value);
                        if (/^\d*$/.test(raw)) {
                          setFieldValue('pay', raw);
                        }
                      }}
                      error={touched.pay && !!errors.pay}
                      helperText={touched.pay && errors.pay}
                      slotProps={{
                        inputLabel: { shrink: true }
                      }}
                      size="small"
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <DatePicker
                      label="Start Date"
                      value={values.startDate ? dayjs(values.startDate) : null}
                      onChange={(date) => setFieldValue('startDate', date ? date.toISOString() : null)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: 'small',
                          InputLabelProps: { shrink: true },
                          error: touched.startDate && !!errors.startDate,
                          helperText: touched.startDate && errors.startDate
                        }
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <DatePicker
                      label="End Date"
                      value={values.endDate ? dayjs(values.endDate) : null}
                      onChange={(date) => setFieldValue('endDate', date ? date.toISOString() : null)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: 'small',
                          InputLabelProps: { shrink: true },
                          error: touched.endDate && !!errors.endDate,
                          helperText: touched.endDate && errors.endDate
                        }
                      }}
                      minDate={values.startDate ? dayjs(values.startDate) : undefined}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Comment"
                      variant="outlined"
                      value={values.comments}
                      onChange={handleChange}
                      name="comments"
                      error={touched.comments && !!errors.comments}
                      helperText={touched.comments && errors.comments}
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
    </LocalizationProvider>
  );
};

export default AllowanceActionModal;
