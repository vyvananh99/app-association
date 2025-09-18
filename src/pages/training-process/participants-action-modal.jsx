import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, IconButton, Button, TextField, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import FormikAutocomplete from '../common/formik-autocomplete';
import dayjs from 'dayjs';
import FormTextFieldShrink from '../common/form-text-field-shrink';
import { getPerformanceApi } from 'api/performance.api';

import CommonDatePicker from '../common/common-date-picker';

const ParticipantsActionModal = ({ open, setOpen, onAction, rowData, action, setDisableBtn, disableBtn, employeeData, otherListData }) => {
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const hplist = otherListData.filter((i) => i.type === 'HPLIST');
  const workLevelList = [
    { id: '01', name: 'Level 1' },
    { id: '02', name: 'Level 2' }
  ];

  useEffect(() => {
    if (open && rowData?.courseId) {
      const employee = employeeData.find((emp) => emp.employeeId === rowData.employeeId);
      setSelectedEmployee(employee);
    }
  }, [open]);

  const handleClose = () => {
    setOpen(false);
    setDisableBtn(true);
    setSelectedEmployee({});
  };

  const fetchPerformanceData = async (employeeId, comId) => {
    try {
      const year = dayjs().year();
      const getPerformanceData = await getPerformanceApi(employeeId, comId, year);
      if (getPerformanceData?.data) {
        return getPerformanceData.data;
      } else {
        return {};
      }
    } catch (error) {
      return {};
    }
  };

  useEffect(() => {
    setDisableBtn(false);
  }, [open]);

  const validationSchema = Yup.object({
    employeeId: Yup.string().required('Employee code is required')
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
            maxWidth: '80vw', // You can adjust max width as per your needs
            minWidth: '900px', // You can adjust max width as per your needs
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

          <Typography variant="h4">Participants</Typography>

          <Formik
            initialValues={{
              courseId: rowData?.courseId || '',
              employeeId: rowData?.employeeId || '',
              comId: rowData?.comId || '',
              locId: rowData?.locId || '',
              depId: rowData?.depId || '',
              secId: rowData?.secId || '',
              funcId: rowData?.funcId || '',
              posId: rowData?.posId || '',
              jobType: rowData?.jobType || '',
              workLevel: rowData?.workLevel || '',
              vnFullName: rowData?.vnFullName || '',
              enFullName: rowData?.enFullName || '',
              joinDateState: rowData?.joinDateState || '',
              hplist: rowData?.hplist || '',
              attendance: rowData?.attendance || 0
            }}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={(values) => {
              onAction(values);
              setDisableBtn(true);
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
                    marginBottom: 4,
                    paddingTop: 2
                  }}
                >
                  <Grid size={{ xs: 12 }}>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 6 }}>
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 12 }}>
                            <FormikAutocomplete
                              name="employeeId"
                              filedName="employeeId"
                              options={employeeData}
                              onChange={async (event, value) => {
                                const selected = value || {};
                                setSelectedEmployee(selected);
                                let performanceData = {};
                                if (value && value.employeeId)
                                  performanceData = await fetchPerformanceData(value.employeeId, selected.comId);
                                setFieldValue('employeeId', selected.employeeId || '');
                                setFieldValue('vnFullName', selected.vnFullName || '');
                                setFieldValue('enFullName', selected.enFullName || '');
                                setFieldValue('joinDateState', selected.joinDateState || '');
                                setFieldValue('birthDate', selected.birthDate || '');
                                setFieldValue('workLevel', selected.workLevel || '');
                                setFieldValue('jobType', selected.jobType?.id || '');
                                setFieldValue('comId', selected.comId || '');
                                setFieldValue('locId', selected.locId || '');
                                setFieldValue('depId', selected.depId || '');
                                setFieldValue('secId', selected.secId || '');
                                setFieldValue('funcId', selected.funcId || '');
                                setFieldValue('posId', selected.posId || '');

                                setFieldValue('hplist', performanceData.hplist || '');
                              }}
                              getOptionLabel={(option) => `${option.employeeId}-${option.enFullName}` || ''}
                              label="Employe ID"
                              disabled={action === 'edit'}
                              inputHeight="37.5px"
                            />
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <Field
                              name="vnFullName"
                              component={FormTextFieldShrink}
                              label="Vietnamese Name"
                              variant="outlined"
                              inputHeight="37.5px"
                              disabled
                            />
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <Field
                              name="enFullName"
                              component={FormTextFieldShrink}
                              label="English Name"
                              variant="outlined"
                              inputHeight="37.5px"
                              disabled
                            />
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <Field
                              name="birthDate"
                              component={FormTextFieldShrink}
                              label="Birth Date"
                              variant="outlined"
                              inputHeight="37.5px"
                              disabled
                            />
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <DatePicker
                              label="Join Date with State"
                              value={values.joinDateState ? dayjs(values.joinDateState) : null}
                              onChange={(date) => {
                                setFieldValue('joinDateState', date ? date.toISOString() : '');
                              }}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  size: 'small',
                                  InputLabelProps: { shrink: true }
                                }
                              }}
                              disabled
                            />
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <FormikAutocomplete
                              name="hplist"
                              filedName="name"
                              options={hplist}
                              getOptionLabel={(option) => option.name || ''}
                              label="HP List"
                              disabled
                            />
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <Field
                              name="laguageLevel"
                              component={FormTextFieldShrink}
                              label="English Level"
                              variant="outlined"
                              inputHeight="37.5px"
                              disabled
                            />
                          </Grid>
                          <Grid size={{ xs: 12 }} sx={{ ml: 2 }}>
                            <Field name="attendance" type="checkbox">
                              {({ field }) => (
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={field.value === 1}
                                      onChange={(e) => {
                                        setFieldValue('attendance', e.target.checked ? 1 : 0);
                                      }}
                                    />
                                  }
                                  label="Attendance"
                                />
                              )}
                            </Field>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 12 }}>
                            <TextField
                              label="Company"
                              value={(selectedEmployee?.company && selectedEmployee?.company.name) || ''}
                              variant="outlined"
                              fullWidth
                              disabled
                              slotProps={{
                                inputLabel: { shrink: true },
                                readOnly: true
                              }}
                              sx={{ '& .MuiOutlinedInput-root': { height: '37.5px' } }}
                            />
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <TextField
                              label="Location"
                              value={
                                (selectedEmployee?.location && (selectedEmployee?.location.vnName || selectedEmployee?.location.enName)) ||
                                ''
                              }
                              variant="outlined"
                              fullWidth
                              disabled
                              slotProps={{
                                inputLabel: { shrink: true },
                                readOnly: true
                              }}
                              sx={{ '& .MuiOutlinedInput-root': { height: '37.5px' } }}
                            />
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <TextField
                              label="Department"
                              value={
                                (selectedEmployee?.department &&
                                  (selectedEmployee?.department.vnName || selectedEmployee?.department.enName)) ||
                                ''
                              }
                              variant="outlined"
                              fullWidth
                              disabled
                              slotProps={{
                                inputLabel: { shrink: true },
                                readOnly: true
                              }}
                              sx={{ '& .MuiOutlinedInput-root': { height: '37.5px' } }}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, md: 12 }}>
                            <TextField
                              label="Section"
                              value={
                                (selectedEmployee?.section && (selectedEmployee?.section.vnName || selectedEmployee?.section.enName)) || ''
                              }
                              variant="outlined"
                              fullWidth
                              disabled
                              slotProps={{
                                inputLabel: { shrink: true },
                                readOnly: true
                              }}
                              sx={{ '& .MuiOutlinedInput-root': { height: '37.5px' } }}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, md: 12 }}>
                            <TextField
                              label="Function"
                              value={
                                (selectedEmployee?.function && (selectedEmployee?.function.vnName || selectedEmployee?.function.enName)) ||
                                ''
                              }
                              variant="outlined"
                              fullWidth
                              disabled
                              slotProps={{
                                inputLabel: { shrink: true },
                                readOnly: true
                              }}
                              sx={{ '& .MuiOutlinedInput-root': { height: '37.5px' } }}
                            />
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <TextField
                              label="Position"
                              value={
                                (selectedEmployee?.position && (selectedEmployee?.position.vnName || selectedEmployee?.position.enName)) ||
                                ''
                              }
                              variant="outlined"
                              fullWidth
                              disabled
                              slotProps={{
                                inputLabel: { shrink: true },
                                readOnly: true
                              }}
                              sx={{ '& .MuiOutlinedInput-root': { height: '37.5px' } }}
                            />
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <TextField
                              label="Job Type"
                              value={(selectedEmployee?.jobType && selectedEmployee?.jobType.name) || ''}
                              variant="outlined"
                              fullWidth
                              disabled
                              slotProps={{
                                inputLabel: { shrink: true },
                                readOnly: true
                              }}
                              sx={{ '& .MuiOutlinedInput-root': { height: '37.5px' } }}
                            />
                          </Grid>
                          <Grid size={{ xs: 5 }}>
                            <FormikAutocomplete
                              name="workLevel"
                              options={workLevelList}
                              getOptionLabel={(option) => option.name || ''}
                              label="Work Level"
                              inputHeight="37.5px"
                              disabled
                            />
                          </Grid>
                          <Grid size={{ xs: 7 }}>
                            <Field name="effectDate" component={CommonDatePicker} label="Effective Date" disabled />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
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

export default ParticipantsActionModal;
