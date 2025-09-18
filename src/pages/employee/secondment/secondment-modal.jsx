import React, { useEffect, useState } from 'react';
import { Box, TextField, Typography, Button, Modal, IconButton } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import FormikAutocomplete from '../../common/formik-autocomplete';
import CloseIcon from '@mui/icons-material/Close';
import { formatNumber, parseNumber } from 'utils/convert-money';

const SecondmentModal = ({ open, setOpen, action, data, onAction }) => {
  const [disableBtn, setDisableBtn] = useState(false);

  const validationSchema = Yup.object({
    startDate: Yup.date().required('Effective Date is required'),
  });

  const workLevelList = [
    { id: '01', name: 'TIME' },
    { id: '02', name: 'SP' }
  ];

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
            {action === 'edit' ? 'Update Secondment' : 'Create Secondment'}
          </Typography>

          <Formik
            initialValues={{
              startDate: data?.startDate || '',
              endDate: data?.endDate || '',
              country: data?.country || '',
              company: data?.company || '',
              position: data?.position || '',
              workLevel: data?.workLevel || '',
              nth: data?.nth || '',
              hostSal: data?.hostSal || '',
              remark: data?.remark || '',
              condition: data?.condition || ''
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
                  <Grid container spacing={2} size={{ xs: 12 }}>
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
                        label="Country"
                        variant="outlined"
                        name="country"
                        value={values.country}
                        onChange={handleChange}
                        error={touched.country && !!errors.country}
                        helperText={touched.country && errors.country}
                        slotProps={{
                          inputLabel: { shrink: true }
                        }}
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Company"
                        variant="outlined"
                        name="company"
                        value={values.company}
                        onChange={handleChange}
                        error={touched.company && !!errors.company}
                        helperText={touched.company && errors.company}
                        slotProps={{
                          inputLabel: { shrink: true }
                        }}
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Position"
                        variant="outlined"
                        name="position"
                        value={values.position}
                        onChange={handleChange}
                        error={touched.position && !!errors.position}
                        helperText={touched.position && errors.position}
                        slotProps={{
                          inputLabel: { shrink: true }
                        }}
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <FormikAutocomplete
                        name="workLevel"
                        options={workLevelList}
                        getOptionLabel={(option) => option.name || ''}
                        label="Level"
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Salary From Home Country"
                        variant="outlined"
                        name="nth"
                        value={formatNumber(values.nth)}
                        onChange={(e) => {
                          const raw = parseNumber(e.target.value);
                          if (/^\d*$/.test(raw)) {
                            setFieldValue('nth', raw);
                          }
                        }}
                        error={touched.nth && !!errors.nth}
                        helperText={touched.nth && errors.nth}
                        slotProps={{
                          inputLabel: { shrink: true }
                        }}
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Salary From Host Country"
                        variant="outlined"
                        name="hostSal"
                        value={formatNumber(values.hostSal)}
                        onChange={(e) => {
                          const raw = parseNumber(e.target.value);
                          if (/^\d*$/.test(raw)) {
                            setFieldValue('hostSal', raw);
                          }
                        }}
                        error={touched.hostSal && !!errors.hostSal}
                        helperText={touched.hostSal && errors.hostSal}
                        slotProps={{
                          inputLabel: { shrink: true },
                          inputMode: 'numeric'

                        }}
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Terms and Conditions"
                        variant="outlined"
                        name="condition"
                        value={values.condition}
                        onChange={handleChange}
                        error={touched.condition && !!errors.condition}
                        helperText={touched.condition && errors.condition}
                        slotProps={{
                          inputLabel: { shrink: true },
                          inputMode: 'numeric'
                        }}
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Remarks"
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

export default SecondmentModal;
