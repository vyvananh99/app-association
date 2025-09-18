import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, IconButton, Button, TextField, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import Divider from '@mui/material/Divider';

const CompanyModal = ({ open, setOpen, onAction, rowData, action }) => {
  const [disableBtn, setDisableBtn] = useState(false);
  const handleClose = () => {
    setOpen(false);
    setDisableBtn(true);
  };

  useEffect(() => {
    setDisableBtn(false);
  }, [open]);

  const validationSchema = Yup.object({
    id: Yup.string()
      .required('Company Code is required')
      .matches(/^[A-Za-z0-9]{1,10}$/, 'Company Code must be 4 characters and less than 10 characters'),

    name: Yup.string().required('Company English Name is required').max(255, 'Company Name cannot be longer than 255 characters'),

    vnName: Yup.string().required('Company Vietnamese Name is required').max(255, 'Vietnamese Name cannot be longer than 255 characters'),

    madvBh: Yup.string().optional().matches(/^\d+$/, 'Insurance code must be numeric'),

    address: Yup.string().optional().max(500, 'Address cannot be longer than 500 characters'),

    tel: Yup.string()
      .optional()
      .matches(/^\d{0,11}$/, 'Telephone must be 10-11 digits'),

    fax: Yup.string()
      .optional()
      .matches(/^\d{0,30}$/, 'Fax number must be 10-11 digits'),

    accountNo: Yup.string().optional().max(50, 'Bank Account Number cannot be longer than 50 characters'),

    bank: Yup.string().optional().max(100, 'Bank Name cannot be longer than 100 characters'),

    taxCode: Yup.string()
      .optional()
      .matches(/^\d{0,30}$/, 'Tax Code must be 9 or 10 digits'),

    area: Yup.string().optional().max(100, 'Area cannot be longer than 100 characters'),

    chuquan: Yup.string().optional().max(100, 'Chu Quan cannot be longer than 100 characters'),

    tpkt: Yup.string().optional().max(100, 'TPKT cannot be longer than 100 characters'),

    capql: Yup.string().optional().max(100, 'Management Authority cannot be longer than 100 characters'),

    capqlAccountNo: Yup.string().optional().max(50, 'CAPQL Account No cannot be longer than 50 characters'),

    capqlBank: Yup.string().optional().max(100, 'CAPQL Bank cannot be longer than 100 characters')
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
          width: '80%',
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
          Company Parameters
        </Typography>

        <Formik
          initialValues={{
            id: rowData?.id || '',
            name: rowData?.name || '',
            vnName: rowData?.vnName || '',
            madvBh: rowData?.madvBh || '',
            address: rowData?.address || '',
            tel: rowData?.tel || '',
            fax: rowData?.fax || '',
            accountNo: rowData?.accountNo || '',
            bank: rowData?.bank || '',
            taxCode: rowData?.taxCode || '',
            area: rowData?.area || '',
            capql: rowData?.capql || '',
            mgtName: rowData?.mgtName || '',
            mgtPos: rowData?.mgtPos || '',
            mgtNationality: rowData?.mgtNationality || '',
            mgtId: rowData?.mgtId || '',
            mgtIdDate: rowData?.mgtIdDate || '',
            mgtIdPlace: rowData?.mgtIdPlace || '',
            posNote: rowData?.posNote || '',
            protectNote: rowData?.protectNote || '',
            siNote: rowData?.siNote || '',
            benefitNote: rowData?.benefitNote || '',
            agreementNote: rowData?.agreementNote || '',
            cityName: rowData?.cityName || '',
            chuquan: rowData?.chuquan || '',
            tpkt: rowData?.tpkt || '',
            annualNode: rowData?.annualNode || '',
            maKcb: rowData?.maKcb || '',
            capqlAccountNo: rowData?.capqlAccountNo || '',
            capqlBank: rowData?.capqlBank || ''
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            onAction(values);
            // handleClose();
            setDisableBtn(true);
          }}
        >
          {({ values, handleChange, errors, touched }) => (
            <Form style={{ width: '100%' }}>
              <Grid
                container
                spacing={0.5}
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
                    value={values.id}
                    onChange={handleChange}
                    name="id"
                    error={touched.id && !!errors.id}
                    helperText={touched.id && errors.id}
                    sx={{ marginBottom: 1 }}
                    slotProps={{
                      inputLabel: { shrink: true }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 6 }}>
                  <TextField
                    fullWidth
                    label="English Name"
                    variant="outlined"
                    value={values.name}
                    onChange={handleChange}
                    name="name"
                    error={touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                    sx={{ marginBottom: 1 }}
                    slotProps={{
                      inputLabel: { shrink: true }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Vietnamese Name"
                    variant="outlined"
                    value={values.vnName}
                    onChange={handleChange}
                    name="vnName"
                    error={touched.vnName && !!errors.vnName}
                    helperText={touched.vnName && errors.vnName}
                    sx={{ marginBottom: 1 }}
                    slotProps={{
                      inputLabel: { shrink: true }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    fullWidth
                    label="Insurance Service Code"
                    variant="outlined"
                    value={values.madvBh}
                    onChange={handleChange}
                    name="madvBh"
                    error={touched.madvBh && !!errors.madvBh}
                    helperText={touched.madvBh && errors.madvBh}
                    sx={{ marginBottom: 1 }}
                    slotProps={{
                      inputLabel: { shrink: true }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    fullWidth
                    label="Health Service Code"
                    variant="outlined"
                    value={values.maKcb}
                    onChange={handleChange}
                    name="maKcb"
                    error={touched.maKcb && !!errors.maKcb}
                    helperText={touched.maKcb && errors.maKcb}
                    sx={{ marginBottom: 1 }}
                    slotProps={{
                      inputLabel: { shrink: true }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 0, md: 4 }}></Grid>
                <Grid size={{ xs: 12, md: 12 }}>
                  <TextField
                    fullWidth
                    label="Company Address"
                    variant="outlined"
                    value={values.address}
                    onChange={handleChange}
                    name="address"
                    error={touched.address && !!errors.address}
                    helperText={touched.address && errors.address}
                    sx={{ marginBottom: 1 }}
                    slotProps={{
                      inputLabel: { shrink: true }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    fullWidth
                    label="Tel"
                    variant="outlined"
                    value={values.tel}
                    onChange={handleChange}
                    name="tel"
                    error={touched.tel && !!errors.tel}
                    helperText={touched.tel && errors.tel}
                    sx={{ marginBottom: 1 }}
                    slotProps={{
                      inputLabel: { shrink: true }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    fullWidth
                    label="Fax"
                    variant="outlined"
                    value={values.fax}
                    onChange={handleChange}
                    name="fax"
                    error={touched.fax && !!errors.fax}
                    helperText={touched.fax && errors.fax}
                    sx={{ marginBottom: 1 }}
                    slotProps={{
                      inputLabel: { shrink: true }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Bank Account Code"
                    variant="outlined"
                    value={values.accountNo}
                    onChange={handleChange}
                    name="accountNo"
                    error={touched.accountNo && !!errors.accountNo}
                    helperText={touched.accountNo && errors.accountNo}
                    sx={{ marginBottom: 1 }}
                    slotProps={{
                      inputLabel: { shrink: true }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Bank"
                    variant="outlined"
                    value={values.bank}
                    onChange={handleChange}
                    name="bank"
                    error={touched.bank && !!errors.bank}
                    helperText={touched.bank && errors.bank}
                    sx={{ marginBottom: 1 }}
                    slotProps={{
                      inputLabel: { shrink: true }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Area"
                    variant="outlined"
                    value={values.area}
                    onChange={handleChange}
                    name="area"
                    error={touched.area && !!errors.area}
                    helperText={touched.area && errors.area}
                    sx={{ marginBottom: 1 }}
                    slotProps={{
                      inputLabel: { shrink: true }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Tax Code"
                    variant="outlined"
                    value={values.taxCode}
                    onChange={handleChange}
                    name="taxCode"
                    error={touched.taxCode && !!errors.taxCode}
                    helperText={touched.taxCode && errors.taxCode}
                    sx={{ marginBottom: 1 }}
                    slotProps={{
                      inputLabel: { shrink: true }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 0, md: 4 }}></Grid>
                <Grid sx={{ padding: 1 }} size={{ xs: 12, md: 12 }}></Grid>
                <Grid size={{ xs: 6, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Managing"
                    variant="outlined"
                    value={values.chuquan}
                    onChange={handleChange}
                    name="chuquan"
                    error={touched.chuquan && !!errors.chuquan}
                    helperText={touched.chuquan && errors.chuquan}
                    sx={{ marginBottom: 1 }}
                    slotProps={{
                      inputLabel: { shrink: true }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Economic Sectors"
                    variant="outlined"
                    value={values.tpkt}
                    onChange={handleChange}
                    name="tpkt"
                    error={touched.tpkt && !!errors.tpkt}
                    helperText={touched.tpkt && errors.tpkt}
                    sx={{ marginBottom: 1 }}
                    slotProps={{
                      inputLabel: { shrink: true }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 12 }}>
                  <Divider sx={{ marginY: 2, borderColor: '#262626' }} />
                </Grid>
                <Grid size={{ xs: 6, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Management"
                    variant="outlined"
                    value={values.capql}
                    onChange={handleChange}
                    name="capql"
                    error={touched.capql && !!errors.capql}
                    helperText={touched.capql && errors.capql}
                    sx={{ marginBottom: 1 }}
                    slotProps={{
                      inputLabel: { shrink: true }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Bank Account of Mgt."
                    variant="outlined"
                    value={values.capqlAccountNo}
                    onChange={handleChange}
                    name="capqlAccountNo"
                    error={touched.capqlAccountNo && !!errors.capqlAccountNo}
                    helperText={touched.capqlAccountNo && errors.capqlAccountNo}
                    sx={{ marginBottom: 1 }}
                    slotProps={{
                      inputLabel: { shrink: true }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 12 }}>
                  <TextField
                    fullWidth
                    label="Bank Name of Mgt."
                    variant="outlined"
                    value={values.capqlBank}
                    onChange={handleChange}
                    name="capqlBank"
                    error={touched.capqlBank && !!errors.capqlBank}
                    helperText={touched.capqlBank && errors.capqlBank}
                    sx={{ marginBottom: 1 }}
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
  );
};

export default CompanyModal;
