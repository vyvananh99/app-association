import React, { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { Box, Grid, Button, Modal, Typography, TextField, IconButton, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import MainCard from 'components/MainCard';
import FormikAutocomplete from '../../common/formik-autocomplete';
import { getTerminationInfoApi } from 'api/termination-info.api';
import { updateEmployeeApi } from 'api/employee.api';

function TerminationModal({ rowData, open, setOpen, setOpenModal, terminationReason }) {
  const [disableBtn, setDisableBtn] = useState(false);
  const validationSchema = Yup.object({
    employeeId: Yup.string()
      .required('Profile Code is required')
      .matches(/^[A-Za-z0-9]{4,20}$/, 'Profile Code must be more than 2 characters and less than 20 characters')
  });

  const handleClose = (event, reason) => {
    if (reason && reason === 'backdropClick') {
      return;
    }
    setOpen(false);
    setDisableBtn(false);
  };

  const onUpdate = async (data) => {
    try {
      await updateEmployeeApi(data, data.employeeId, rowData.comId, rowData.pkey);
      toast.success('Update employee successfully');
    } catch {
      toast.error('Update employee failed');
    }
    setDisableBtn(false);
  };

  const changeTerLastDate = async (terDate, setFieldValue) => {
    const terminationData = await getTerminationInfoApi(rowData.employeeId, {
      comId: data.comId,
      terDate
    });
    if (terminationData && terminationData.data) {
      setFieldValue('terServiceMonth', terminationData.data.terServiceMonth);
      setFieldValue('terLastMonSalary', terminationData.data.terLastMonSalary);
      setFieldValue('terSeveranceAllow', terminationData.data.terSeveranceAllow);
      setFieldValue('terOutstandingAl', terminationData.data.terOutstandingAl);
      setFieldValue('terOutstandingAlPay', terminationData.data.terOutstandingAlPay);
      setFieldValue('terOutstandingLoan', terminationData.data.terOutstandingLoan);
      setFieldValue('terOutstandingLoanPayment', terminationData.data.terOutstandingLoanPayment);
      setFieldValue('terOtherAdjust', terminationData.data.terOtherAdjust);
      setFieldValue('terPayByPayroll', terminationData.data.terPayByPayroll);
      setFieldValue('terLastPayment', terminationData.data.terLastPayment);
    }
  };

  return (
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
        <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
          Termination
        </Typography>

        {/* Modal Content */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ flex: 1 }}>
            <Formik
              initialValues={{
                employeeId: rowData?.employeeId || '',
                enFullName: rowData?.enFullName || '',
                terLastDate: rowData?.terLastDate || '',
                terLastMonSalary: rowData?.terLastMonSalary || '',
                terLastPayment: rowData?.terLastPayment || '',
                terSeveranceAllow: rowData?.terSeveranceAllow || '',
                terOutstandingAl: rowData?.terOutstandingAl || '',
                terOutstandingAlPay: rowData?.terOutstandingAlPay || '',
                terOutstandingLoan: rowData?.terOutstandingLoan || '',
                terOtherAdjust: rowData?.terOtherAdjust || '',
                terOutstandingLoanPayment: rowData?.terOutstandingLoanPayment || '',
                terRemark: rowData?.terRemark || '',
                terPayByCast: rowData?.terPayByCast || '',
                terPayByPayroll: rowData?.terPayByPayroll || '',
                terReason: rowData?.terReason || ''
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                setDisableBtn(true);
                onUpdate(values);
              }}
            >
              {({ values, handleChange, errors, touched, setFieldValue }) => (
                <Form id="termination-form" style={{ width: '100%' }}>
                  <MainCard sx={{ mt: 1 }} contentSX={{ p: 1.5 }}>
                    <Grid container columnSpacing={2} size={{ xs: 12, md: 12 }}>
                      <Grid size={{ xs: 4 }}>
                        <Typography align="right">Employee ID</Typography>
                      </Grid>
                      <Grid size={{ xs: 8 }}>
                        <Typography sx={{ paddingLeft: 2, color: 'blue' }}>{values.employeeId}</Typography>
                      </Grid>

                      <Grid size={{ xs: 4 }}>
                        <Typography align="right">FullName</Typography>
                      </Grid>
                      <Grid size={{ xs: 8 }}>
                        <Typography sx={{ paddingLeft: 2, color: 'blue' }}>{values.enFullName}</Typography>
                      </Grid>
                    </Grid>
                  </MainCard>
                  <Box sx={{ flex: 1, overflowY: 'auto', maxHeight: 'calc(100vh - 300px)', minHeight: '400px' }}>
                    <MainCard sx={{ mt: 1 }} contentSX={{ p: 1.5 }}>
                      <Grid container spacing={2} size={{ xs: 12, md: 12 }}>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <DatePicker
                            label="Termination Start Date"
                            value={values.terLastDate ? dayjs(values.terLastDate) : null}
                            onChange={(date) => {
                              setFieldValue('terLastDate', date ? date.toISOString() : '');
                              changeTerLastDate(date.toISOString(), setFieldValue);
                            }}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                size: 'small',
                                InputLabelProps: { shrink: true }
                              }
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            disabled
                            type="number"
                            fullWidth
                            label="Service Period"
                            variant="outlined"
                            value={values.terServiceMonth}
                            onChange={handleChange}
                            name="terServiceMonth"
                            error={touched.terServiceMonth && !!errors.terServiceMonth}
                            helperText={touched.terServiceMonth && errors.terServiceMonth}
                            slotProps={{
                              inputLabel: { shrink: true }
                            }}
                            size="small"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            disabled
                            type="number"
                            fullWidth
                            label="Resignation Allowance"
                            variant="outlined"
                            value={values.terPayByPayroll}
                            onChange={handleChange}
                            name="terPayByPayroll"
                            error={touched.terPayByPayroll && !!errors.terPayByPayroll}
                            helperText={touched.terPayByPayroll && errors.terPayByPayroll}
                            slotProps={{
                              inputLabel: { shrink: true }
                            }}
                            size="small"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            disabled
                            type="number"
                            fullWidth
                            label="Last Month Salary"
                            variant="outlined"
                            value={values.terLastMonSalary}
                            onChange={handleChange}
                            name="terLastMonSalary"
                            error={touched.terLastMonSalary && !!errors.terLastMonSalary}
                            helperText={touched.terLastMonSalary && errors.terLastMonSalary}
                            slotProps={{
                              inputLabel: { shrink: true }
                            }}
                            size="small"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            disabled
                            type="number"
                            fullWidth
                            label="Severance Allowance"
                            variant="outlined"
                            value={values.terSeveranceAllow}
                            onChange={handleChange}
                            name="terSeveranceAllow"
                            error={touched.terSeveranceAllow && !!errors.terSeveranceAllow}
                            helperText={touched.terSeveranceAllow && errors.terSeveranceAllow}
                            slotProps={{
                              inputLabel: { shrink: true }
                            }}
                            size="small"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            disabled
                            type="number"
                            fullWidth
                            label="Outstanding AL Days"
                            variant="outlined"
                            value={values.terOutstandingAl}
                            onChange={handleChange}
                            name="terOutstandingAl"
                            error={touched.terOutstandingAl && !!errors.terOutstandingAl}
                            helperText={touched.terOutstandingAl && errors.terOutstandingAl}
                            slotProps={{
                              inputLabel: { shrink: true }
                            }}
                            size="small"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            type="number"
                            fullWidth
                            label="Outstanding Loan Pay"
                            variant="outlined"
                            value={values.terOutstandingLoan}
                            onChange={handleChange}
                            name="terOutstandingLoan"
                            error={touched.terOutstandingLoan && !!errors.terOutstandingLoan}
                            helperText={touched.terOutstandingLoan && errors.terOutstandingLoan}
                            slotProps={{
                              inputLabel: { shrink: true }
                            }}
                            size="small"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            disabled
                            type="number"
                            fullWidth
                            label="Outstanding AL Pay"
                            variant="outlined"
                            value={values.terOutstandingAlPay}
                            onChange={handleChange}
                            name="terOutstandingAlPay"
                            error={touched.terOutstandingAlPay && !!errors.terOutstandingAlPay}
                            helperText={touched.terOutstandingAlPay && errors.terOutstandingAlPay}
                            slotProps={{
                              inputLabel: { shrink: true }
                            }}
                            size="small"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            type="number"
                            fullWidth
                            label="Other Adjustment"
                            variant="outlined"
                            value={values.terOtherAdjust}
                            onChange={handleChange}
                            name="terOtherAdjust"
                            error={touched.terOtherAdjust && !!errors.terOtherAdjust}
                            helperText={touched.terOtherAdjust && errors.terOtherAdjust}
                            slotProps={{
                              inputLabel: { shrink: true }
                            }}
                            size="small"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            disabled
                            type="number"
                            fullWidth
                            label="Outstanding Loan Payback"
                            variant="outlined"
                            value={values.terOutstandingLoanPayment}
                            onChange={handleChange}
                            name="terOutstandingLoanPayment"
                            error={touched.terOutstandingLoanPayment && !!errors.terOutstandingLoanPayment}
                            helperText={touched.terOutstandingLoanPayment && errors.terOutstandingLoanPayment}
                            slotProps={{
                              inputLabel: { shrink: true }
                            }}
                            size="small"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <FormikAutocomplete
                            name="terReason"
                            options={terminationReason}
                            getOptionLabel={(option) => option.name || ''}
                            label="Reason"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            disabled
                            type="number"
                            fullWidth
                            label="Total Last Payment"
                            variant="outlined"
                            value={values.terLastPayment}
                            onChange={handleChange}
                            name="terLastPayment"
                            error={touched.terLastPayment && !!errors.terLastPayment}
                            helperText={touched.terLastPayment && errors.terLastPayment}
                            slotProps={{
                              inputLabel: { shrink: true }
                            }}
                            size="small"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 12 }}>
                          <TextField
                            fullWidth
                            label="Remask"
                            variant="outlined"
                            value={values.terRemark}
                            onChange={handleChange}
                            name="terRemark"
                            error={touched.terRemark && !!errors.terRemark}
                            helperText={touched.terRemark && errors.terRemark}
                            slotProps={{
                              inputLabel: { shrink: true }
                            }}
                            size="small"
                            multiline
                            rows={2}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <FormGroup>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  size="small"
                                  checked={values.terPayByCast === 1}
                                  onChange={(e) => {
                                    setFieldValue('terPayByCast', e.target.checked ? 1 : 0);
                                  }}
                                />
                              }
                              label="Paid by cash"
                              sx={{ marginLeft: 1, fontWeight: 'bold' }}
                            />
                          </FormGroup>
                        </Grid>
                      </Grid>
                    </MainCard>
                  </Box>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 15,
                      right: 25,
                      display: 'flex',
                      gap: 2
                    }}
                  >
                    <Button form="termination-form" disabled={disableBtn} type="submit" variant="contained" sx={{ width: 80, height: 30 }}>
                      Update
                    </Button>
                    <Button onClick={() => handleClose()} variant="outlined" sx={{ width: 80, height: 30 }}>
                      Cancel
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </Box>
        </LocalizationProvider>
      </Box>
    </Modal>
  );
}

export default TerminationModal;
