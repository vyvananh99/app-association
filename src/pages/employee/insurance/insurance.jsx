import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import MainCard from 'components/MainCard';
import FormikAutocomplete from '../../common/formik-autocomplete';
import { updateEmployeeApi } from 'api/employee.api';
import FormTextFieldShrink from '../../common/form-text-field-shrink';

const Insurance = ({ action, rowData, fetchData }) => {
  const [disableBtn, setDisableBtn] = useState(false);

  const validationSchema = Yup.object({
    // siBookNo: Yup.string()
    //   .required('SL No. is required')
    //   .matches(/^[A-Z0-9-]+$/, 'SL No. must be alphanumeric with optional hyphens')
    //   .max(20, 'SL No. must be at most 20 characters'),
    // keptBy: Yup.object().required('Kept By is required').nullable(),
    // siDate: Yup.string()
    //   .required('Issued Date is required')
    //   .test('valid-date', 'Issued Date must be a valid date', (value) => value && dayjs(value).isValid()),
    // siPlace: Yup.string().required('Issued Place is required').max(50, 'Issued Place must be at most 50 characters'),
    // monthLenBefore: Yup.string()
    //   .required('Length of Service (B) is required')
    //   .matches(/^\d+$/, 'Length of Service (B) must be a number')
    //   .max(3, 'Length of Service (B) must be at most 3 digits'),
    // monthLen: Yup.string()
    //   .required('Length of Service is required')
    //   .matches(/^\d+$/, 'Length of Service must be a number')
    //   .max(3, 'Length of Service must be at most 3 digits'),
    // hiNo: Yup.string()
    //   .required('HL No. is required')
    //   .matches(/^[A-Z0-9-]+$/, 'HL No. must be alphanumeric with optional hyphens')
    //   .max(20, 'HL No. must be at most 20 characters'),
    // hiDate: Yup.string()
    //   .required('Health Insurance Issued Date is required')
    //   .test('valid-date', 'Health Issued Date must be a valid date', (value) => value && dayjs(value).isValid()),
    // hiPlace: Yup.string()
    //   .required('Health Insurance Issued Place is required')
    //   .max(50, 'Health Issued Place must be at most 50 characters'),
    // aiNo: Yup.string()
    //   .required('AL No. is required')
    //   .matches(/^[A-Z0-9-]+$/, 'AL No. must be alphanumeric with optional hyphens')
    //   .max(20, 'AL No. must be at most 20 characters'),
    // aiDate: Yup.string()
    //   .required('Effective Date is required')
    //   .test('valid-date', 'Effective Date must be a valid date', (value) => value && dayjs(value).isValid()),
    // aiExp: Yup.string()
    //   .required('Expired Date is required')
    //   .test('valid-date', 'Expired Date must be a valid date', (value) => value && dayjs(value).isValid())
    //   .test('after-effective', 'Expired Date must be after Effective Date', function (value) {
    //     const effectiveDate = this.parent.aiDate;
    //     return effectiveDate && value && dayjs(value).isAfter(dayjs(effectiveDate));
    //   }),
    // aiCtract: Yup.string().required('Contact With is required').max(50, 'Contact With must be at most 50 characters'),
    // aiCompensation: Yup.number()
    //   .required('Compensation is required')
    //   .positive('Compensation must be positive')
    //   .integer('Compensation must be an integer')
    //   .max(100, 'Compensation must be at most 100 months')
  });

  const keptByList = [
    { name: 'Employee', id: 0 },
    { name: 'Company', id: 1 }
  ];

  const onAction = async (data) => {
    try {
      const employeeId = rowData.employeeId;
      const comId = rowData.comId;
      const newData = Object.assign({}, data, { employeeId, comId });
      const resultUpdate = await updateEmployeeApi(newData, employeeId, comId, rowData.pkey);
      if (resultUpdate.isSuccess) {
        toast.success('Update insurance successfully');
        fetchData();
      } else toast.error(resultUpdate.message);
    } catch {
      toast.error(`Update insurance failed`);
    }
    setDisableBtn(false);
  };

  const handleClose = () => {
    setDisableBtn(true);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: '100%', position: 'relative' }}>
        <MainCard
          sx={{
            flex: 1,
            overflowY: 'auto',
            height: {
              xs: 'calc(80vh - 60px)',
              xl: 'calc(80vh - 20px)'
            }
          }}
        >
          <Formik
            initialValues={{
              siBookNo: rowData.siBookNo || '',
              keptBy: rowData.keptBy || '',
              siDate: rowData.siDate || '',
              siPlace: rowData.siPlace || '',
              monthLenBefore: rowData.monthLenBefore || '',
              monthLen: rowData.monthLen || '',
              hiNo: rowData.hiNo || '',
              hiDate: rowData.hiDate || '',
              hiPlace: rowData.hiPlace || '',
              aiNo: rowData.aiNo || '',
              aiDate: rowData.aiDate || '',
              aiExp: rowData.aiExp || '',
              aiCtract: rowData.aiCtract || '',
              aiCompensation: rowData.aiCompensation || ''
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              onAction(values);
            }}
          >
            {({ values, handleChange, errors, touched, setFieldValue }) => (
              <Form id="insurance-form" style={{ width: '100%' }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 12 }}>
                    <MainCard sx={{ mt: 1 }} contentSX={{ p: 1.5 }}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                        Social Insurance
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                          <Grid container spacing={2}>
                            <Grid size={{ xs: 6 }}>
                              <Field
                                name="siBookNo"
                                label="SL No."
                                component={FormTextFieldShrink}
                                variant="outlined"
                                inputHeight="34.5px"
                                disabled
                              />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                              <FormikAutocomplete
                                name="keptBy"
                                options={keptByList}
                                getOptionLabel={(option) => option.name || ''}
                                label="Kept By"
                                inputHeight="34.5px"
                              />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                              <DatePicker
                                label="Issued Date"
                                value={values.siDate ? dayjs(values.siDate) : null}
                                onChange={(date) => {
                                  setFieldValue('siDate', date ? date.toISOString() : '');
                                }}
                                slotProps={{
                                  textField: {
                                    fullWidth: true,
                                    size: 'small',
                                    InputLabelProps: { shrink: true },
                                    error: touched.siDate && !!errors.siDate,
                                    helperText: touched.siDate && errors.siDate
                                  }
                                }}
                              />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                              <Field
                                name="siPlace"
                                label="Issued Place"
                                component={FormTextFieldShrink}
                                variant="outlined"
                                inputHeight="34.5px"
                                disabled
                              />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                              <Field
                                name="monthLenBefore"
                                label="Length of Service (B) (Months)"
                                component={FormTextFieldShrink}
                                variant="outlined"
                                inputHeight="34.5px"
                                disabled
                              />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                              <Field
                                name="monthLen"
                                label="Length of Service (Months)"
                                component={FormTextFieldShrink}
                                variant="outlined"
                                inputHeight="34.5px"
                                disabled
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </MainCard>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <MainCard contentSX={{ p: 1.5 }}>
                          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                            Health Insurance
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid size={{ xs: 12 }}>
                              <Field
                                name="hiNo"
                                label="HL No."
                                component={FormTextFieldShrink}
                                variant="outlined"
                                inputHeight="34.5px"
                                disabled
                              />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <DatePicker
                                label="Issued Date"
                                value={values.hiDate ? dayjs(values.hiDate) : null}
                                onChange={(date) => {
                                  setFieldValue('hiDate', date ? date.toISOString() : '');
                                }}
                                slotProps={{
                                  textField: {
                                    fullWidth: true,
                                    size: 'small',
                                    InputLabelProps: { shrink: true },
                                    error: touched.hiDate && !!errors.hiDate,
                                    helperText: touched.hiDate && errors.hiDate
                                  }
                                }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <Field
                                name="hiPlace"
                                label="Issued Place"
                                component={FormTextFieldShrink}
                                variant="outlined"
                                inputHeight="34.5px"
                                disabled
                              />
                            </Grid>
                          </Grid>
                        </MainCard>
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <MainCard contentSX={{ p: 1.5 }}>
                          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                            Accident Insurance
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid size={{ xs: 12 }}>
                              <Field
                                name="aiNo"
                                label="AL No."
                                component={FormTextFieldShrink}
                                variant="outlined"
                                inputHeight="34.5px"
                                disabled
                              />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                              <DatePicker
                                label="Effective Date"
                                value={values.aiDate ? dayjs(values.aiDate) : null}
                                onChange={(date) => {
                                  setFieldValue('aiDate', date ? date.toISOString() : '');
                                }}
                                slotProps={{
                                  textField: {
                                    fullWidth: true,
                                    size: 'small',
                                    InputLabelProps: { shrink: true },
                                    error: touched.aiDate && !!errors.aiDate,
                                    helperText: touched.aiDate && errors.aiDate
                                  }
                                }}
                              />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                              <DatePicker
                                label="Expired Date"
                                value={values.aiExp ? dayjs(values.aiExp) : null}
                                onChange={(date) => {
                                  setFieldValue('aiExp', date ? date.toISOString() : '');
                                }}
                                slotProps={{
                                  textField: {
                                    fullWidth: true,
                                    size: 'small',
                                    InputLabelProps: { shrink: true },
                                    error: touched.aiExp && !!errors.aiExp,
                                    helperText: touched.aiExp && errors.aiExp
                                  }
                                }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <Field
                                name="aiCtract"
                                label="Contact With"
                                component={FormTextFieldShrink}
                                variant="outlined"
                                inputHeight="34.5px"
                                disabled
                              />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <Field
                                name="aiCompensation"
                                label="Compensation (Months)"
                                component={FormTextFieldShrink}
                                variant="outlined"
                                inputHeight="34.5px"
                                disabled
                              />
                            </Grid>
                          </Grid>
                        </MainCard>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </MainCard>
      </Box>
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
        <Button form="insurance-form" disabled={disableBtn} type="submit" variant="contained" sx={{ width: 80, height: 30 }}>
          Update
        </Button>
        <Button onClick={handleClose} variant="outlined" sx={{ width: 80, height: 30 }}>
          Cancel
        </Button>
      </Box>
    </LocalizationProvider>
  );
};

export default Insurance;
