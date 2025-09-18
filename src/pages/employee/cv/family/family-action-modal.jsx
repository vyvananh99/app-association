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

const FamilyActionModal = ({ open, setOpen, action, data, onAction, genderList, relationshipList }) => {
  const [disableBtn, setDisableBtn] = useState(false);

  const validationSchema = Yup.object({
    relation: Yup.date().required('Relation is required'),
    birthday: Yup.date().required('Birthday is required'),
    name: Yup.string().required('Name is required'),
    gender: Yup.string().required('Gender is required')
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
            {action === 'edit' ? 'Update FamilyAction' : 'Create FamilyAction'}
          </Typography>

          <Formik
            initialValues={{
              birthday: data?.birthday || '',
              name: data?.name || '',
              relation: data?.relation || '',
              occupation: data?.occupation || '',
              gender: data?.gender || genderList[0].id,
              company: data?.company || ''
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
                      <FormikAutocomplete
                        name="relation"
                        filedName="pkey"
                        options={relationshipList}
                        getOptionLabel={(option) => option.name || ''}
                        label="Relation"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Name"
                        variant="outlined"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        error={touched.name && !!errors.name}
                        helperText={touched.name && errors.name}
                        slotProps={{
                          inputLabel: { shrink: true }
                        }}
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Occupation"
                        variant="outlined"
                        name="occupation"
                        value={values.occupation}
                        onChange={handleChange}
                        error={touched.occupation && !!errors.occupation}
                        helperText={touched.occupation && errors.occupation}
                        slotProps={{
                          inputLabel: { shrink: true }
                        }}
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <DatePicker
                        label="Birthday"
                        value={values.birthday ? dayjs(values.birthday) : null}
                        onChange={(date) => setFieldValue('birthday', date ? date.toISOString() : null)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: 'small',
                            InputLabelProps: { shrink: true },
                            error: touched.birthday && !!errors.birthday,
                            helperText: touched.birthday && errors.birthday
                          }
                        }}
                        maxDate={dayjs()}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormikAutocomplete
                        name="gender"
                        options={genderList}
                        getOptionLabel={(option) => option.name || ''}
                        label="Gender"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Company Name"
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

export default FamilyActionModal;
