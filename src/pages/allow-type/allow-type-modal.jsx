import React, { useEffect, useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

const JobTypeModal = ({ open, setOpen, onAction, rowData, action, otherListNData }) => {
  const [disableBtn, setDisableBtn] = useState(false);
  const handleClose = () => {
    setOpen(false);
    setDisableBtn(true);
  };

  useEffect(() => {
    setDisableBtn(false);
  }, [open]);

  const validationSchema = Yup.object({
    code: Yup.string()
      .required('Allow Type Code is required')
      .matches(/^[A-Za-z0-9]{2}$/, 'Allow Type Code must be less than 2 characters'),

    name: Yup.string().required('Allow Type Name is required').max(255, 'Allow Type Name cannot be longer than 255 characters'),

    pay: Yup.string().required('Allow Type pay is required')
  });

  return (
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
          maxWidth: '650px',
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
          {action === 'edit' ? 'Update Allow Type' : 'Create Allow Type'}
        </Typography>

        <Formik
          initialValues={{
            code: rowData?.code || '',
            name: rowData?.name || '',
            pay: rowData?.pay || '',
            tax: rowData?.tax === 'X' ? true : false,
            type: rowData?.type || '0', // Default to 'M' if not provided
            l1: rowData?.l1 || '',
            l2: rowData?.l2 || '',
            l3: rowData?.l3 || ''
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            onAction(values);
            setDisableBtn(true);
          }}
        >
          {({ values, handleChange, errors, touched }) => (
            <Form style={{ width: '100%' }}>
              <Grid
                container
                spacing={2}
                sx={{
                  maxHeight: '80vh',
                  overflowY: 'auto',
                  marginBottom: 4,
                  paddingTop: 1
                }}
              >
                <Grid size={{ xs: 12, md: 12 }}>
                  <TextField
                    fullWidth
                    label="CODE"
                    variant="outlined"
                    value={values.code}
                    onChange={handleChange}
                    name="code"
                    error={touched.code && !!errors.code}
                    helperText={touched.code && errors.code}
                    sx={{ marginBottom: 2 }}
                    slotProps={{
                      inputLabel: { shrink: true }
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 12 }}>
                  <TextField
                    fullWidth
                    label="Name"
                    variant="outlined"
                    value={values.name}
                    onChange={handleChange}
                    name="name"
                    error={touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                    sx={{ marginBottom: 2 }}
                    slotProps={{
                      inputLabel: { shrink: true }
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 12 }}>
                  <TextField
                    fullWidth
                    label="Pay"
                    variant="outlined"
                    value={values.pay}
                    type="number"
                    onChange={handleChange}
                    name="pay"
                    error={touched.pay && !!errors.pay}
                    helperText={touched.pay && errors.pay}
                    sx={{ marginBottom: 2 }}
                    slotProps={{
                      inputLabel: { shrink: true }
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth sx={{ marginBottom: 2 }}>
                    <InputLabel shrink={true}>Type</InputLabel>
                    <Select labelId="type-select-label" value={values.type} onChange={handleChange} name="type" label="Type">
                      {otherListNData &&
                        otherListNData.map((i) => (
                          <MenuItem key={i.id} value={i.id}>
                            {i.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControlLabel control={<Checkbox checked={values.tax} onChange={handleChange} name="tax" />} label="Taxable" />
                </Grid>

                <Grid size={{ xs: 12, md: 12 }}>
                  <TextField
                    fullWidth
                    label="L1"
                    variant="outlined"
                    value={values.l1}
                    type="number"
                    onChange={handleChange}
                    name="l1"
                    error={touched.l1 && !!errors.l1}
                    helperText={touched.l1 && errors.l1}
                    sx={{ marginBottom: 2 }}
                    slotProps={{
                      inputLabel: { shrink: true }
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 12 }}>
                  <TextField
                    fullWidth
                    label="L2"
                    variant="outlined"
                    value={values.l2}
                    type="number"
                    onChange={handleChange}
                    name="l2"
                    error={touched.l2 && !!errors.l2}
                    helperText={touched.l2 && errors.l2}
                    sx={{ marginBottom: 2 }}
                    slotProps={{
                      inputLabel: { shrink: true }
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 12 }}>
                  <TextField
                    fullWidth
                    label="L3"
                    variant="outlined"
                    value={values.l3}
                    type="number"
                    onChange={handleChange}
                    name="l3"
                    error={touched.l3 && !!errors.l3}
                    helperText={touched.l3 && errors.l3}
                    sx={{ marginBottom: 2 }}
                    slotProps={{
                      inputLabel: { shrink: true }
                    }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ position: 'absolute', bottom: 15, right: 25, display: 'flex', gap: 2 }}>
                <Button disabled={disableBtn} type="submit" variant="contained" sx={{ width: 80, height: 30 }}>
                  {action === 'edit' ? 'Update' : 'Create'}
                </Button>
                <Button onClick={handleClose} variant="outlined" sx={{ width: 80, height: 30 }}>
                  Cancel
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default JobTypeModal;
