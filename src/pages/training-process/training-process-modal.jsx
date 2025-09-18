import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, IconButton, Button, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import FormikAutocomplete from '../common/formik-autocomplete';
import { formatNumber, parseNumber } from 'utils/convert-money';
import dayjs from 'dayjs';
import FormTextFieldShrink from '../common/form-text-field-shrink';

const TrainingProcessModal = ({ open, setOpen, onAction, rowData, action, otherListNData, setDisableBtn, disableBtn }) => {
  const handleClose = () => {
    setOpen(false);
    setDisableBtn(true);
  };

  useEffect(() => {
    setDisableBtn(false);
  }, [open]);

  const validationSchema = Yup.object({
    courseId: Yup.string().required('CourseId code is required'),
    courseTitle: Yup.string().required('Course title  is required'),
    startDate: Yup.string().required('Start date is required'),
    endDate: Yup.string().required('End date is required')
  });

  const courseCatList = otherListNData.filter((i) => i.type === 'COURSE_CAT');
  const courseScopeList = otherListNData.filter((i) => i.type === 'COURSE_SCOPE');
  const organizedByList = otherListNData.filter((i) => i.type === 'COURSE_ORG');

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

          <Typography variant="h4">{action === 'edit' ? 'Update Training Process' : 'Create Training Process'}</Typography>

          <Formik
            initialValues={{
              courseId: rowData?.courseId || '',
              courseTitle: rowData?.courseTitle || '',
              startDate: rowData?.startDate || '',
              endDate: rowData?.endDate || '',
              country: rowData?.country || '',
              city: rowData?.city || '',
              venue: rowData?.venue || '',
              manday: rowData?.manday || '',
              costEmp: rowData?.costEmp || '',
              slot: rowData?.slot || '',
              totalCost: rowData?.totalCost || '',
              targetGroup: rowData?.targetGroup || '',
              categories: rowData?.categories || '',
              courseScope: rowData?.courseScope || '',
              organized: rowData?.organized || '',
              tutor: rowData?.tutor || ''
            }}
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
                  <Grid size={{ xs: 4, md: 3 }}>
                    <Field name="courseId" component={FormTextFieldShrink} label="Course Code" variant="outlined" inputHeight="34.5px" />
                  </Grid>
                  <Grid size={{ xs: 8, md: 9 }}>
                    <Field name="courseTitle" component={FormTextFieldShrink} label="Course Name" variant="outlined" inputHeight="34.5px" />
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
                  <Grid size={{ xs: 6, md: 6 }}>
                    <Field name="country" component={FormTextFieldShrink} label="Country" variant="outlined" inputHeight="34.5px" />
                  </Grid>
                  <Grid size={{ xs: 6, md: 6 }}>
                    <Field name="city" component={FormTextFieldShrink} label="City" variant="outlined" inputHeight="34.5px" />
                  </Grid>
                  <Grid size={{ xs: 12, md: 12 }}>
                    <Field name="venue" component={FormTextFieldShrink} label="Venue" variant="outlined" inputHeight="34.5px" />
                  </Grid>
                  <Grid size={{ xs: 12, md: 12 }}>
                    <Field type="number" name="manday" component={FormTextFieldShrink} label="Manday" variant="outlined" inputHeight="34.5px" />
                  </Grid>
                  <Grid size={{ xs: 6, md: 6 }}>
                    <Field
                      name="costEmp"
                      component={FormTextFieldShrink}
                      formatNumber={formatNumber}
                      parseNumber={parseNumber}
                      label="Cost/Head"
                      variant="outlined"
                      inputHeight="34.5px"
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 6 }}>
                    <Field type="number" name="slot" component={FormTextFieldShrink} label="Slot" variant="outlined" inputHeight="34.5px" />
                  </Grid>
                  <Grid size={{ xs: 6, md: 6 }}>
                    <Field
                      name="totalCost"
                      component={FormTextFieldShrink}
                      formatNumber={formatNumber}
                      parseNumber={parseNumber}
                      label="Total Cost"
                      variant="outlined"
                      inputHeight="34.5px"
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 6 }}>
                    <Field
                      name="targetGroup"
                      component={FormTextFieldShrink}
                      label="Target Group"
                      variant="outlined"
                      inputHeight="34.5px"
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <FormikAutocomplete
                      name="categories"
                      filedName="name"
                      options={courseCatList}
                      getOptionLabel={(option) => option.name || ''}
                      label="Course Categories"
                      inputHeight="34.5px"
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <FormikAutocomplete
                      name="courseScope"
                      options={courseScopeList}
                      getOptionLabel={(option) => option.name || ''}
                      label="Course Scope"
                      inputHeight="34.5px"
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <FormikAutocomplete
                      name="organized"
                      filedName="name"
                      options={organizedByList}
                      getOptionLabel={(option) => option.name || ''}
                      label="Organized By"
                      inputHeight="34.5px"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 12 }}>
                    <Field name="tutor" component={FormTextFieldShrink} label="Tutor's Name" variant="outlined" inputHeight="34.5px" />
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

export default TrainingProcessModal;
