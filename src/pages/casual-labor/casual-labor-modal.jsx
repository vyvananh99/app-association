import React, { useEffect, useState, useMemo } from 'react';
import { Modal, Box, Typography, IconButton, Button, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import FormikAutocomplete from '../common/formik-autocomplete';
import dayjs from 'dayjs';
import MainCard from 'components/MainCard';
import { Field } from 'formik';
import CommonDatePicker from '../common/common-date-picker';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CommonTabPanel from '../common/common-tab-panel';
import { Autocomplete } from '@mui/material';
import { m } from 'framer-motion';

const CasualLaborModal = ({
  open,
  setOpen,
  onAction,
  rowData,
  action,
  otherListNData,
  setDisableBtn,
  disableBtn,
  employeeData,
  companyData,
  locationData,
  departmentData,
  functionData,
  positionData,
  worklevelData,
  cityData,
  provinceData,
  costCenterData,
  otherListData
}) => {
  const [tabValue, setTabValue] = useState(0);
  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };
  const [departmentFilterData, setDepartmentFilterData] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState();
  const [selectedFunction, setSelectedFunction] = useState();
  const [selectedLocation, setSelectedLocation] = useState();
  const [selectedDepartment, setSelectedDepartment] = useState();
  const [selectedCostCenter, setSelectedCostCenter] = useState();
  const [selectedCity, setSelectedCity] = useState();
  const [selectedProvince, setSelectedProvince] = useState();
  const relationshipList = otherListData.filter((i) => i.type === 'RELATION');
  const genderList = otherListNData.filter((i) => i.type === 'GENDER');
  const maritalStatusList = otherListData.filter((i) => i.type === 'MARITAL');
  const handleClose = () => {
    setOpen(false);
    setDisableBtn(true);
  };
  useEffect(() => {
    if (rowData?.comId) {
      setDepartmentFilterData(departmentData.filter((i) => i.comId === rowData.comId));
    } else {
      setDepartmentFilterData(departmentData);
    }
  }, [rowData, departmentData]);

  useEffect(() => {
    if (selectedCompany) {
      setDepartmentFilterData(departmentData.filter((i) => i.comId === selectedCompany));
    } else {
      setDepartmentFilterData(departmentData);
    }
  }, [selectedCompany, departmentData]);

  const validationSchema = Yup.object({
    employeeId: Yup.string().required('Employee ID is required'),
    vnNameFirst: Yup.string().required('Vietnamese First Name is required'),
    vnNameLast: Yup.string().required('Vietnamese Last Name is required'),
    // enNameFirst: Yup.string().required('English Name (First) is required'),
    // enNameLast: Yup.string().required('English Name (Last) is required'),
    // position: Yup.string().required('Position is required'),
    // hiringDate: Yup.date().required('Hiring Date is required'),
    // endDate: Yup.date().required('End Date is required'),
    // period: Yup.number().typeError('Period must be a number').required('Period is required'),
    // remark: Yup.string().required('Remark is required'),
    // allowance: Yup.number().typeError('Allowance must be a number').required('Allowance is required'),
    // salary: Yup.number().typeError('Salary must be a number').required('Salary is required'),
    // ctactAddress: Yup.string().required('Address is required'),
    // ctactTel: Yup.string().required('Contact Telephone is required'),
    // birthDate: Yup.date().required('Birth Date is required'),
    // birthPlace: Yup.string().required('Birth Place is required'),
    // gender: Yup.number().typeError('Gender is required').required('Gender is required'),
    // marital: Yup.string().required('Marital Status is required'),
    // mobile: Yup.string().required('Mobile Phone is required'),
    // pager: Yup.string().max(50, 'Pager must be at most 50 characters').required('Pager is required'),
    // perAddress: Yup.string().required('Permanent Address is required'),
    // perDistrict: Yup.string().required('Permanent District is required'),
    // perTel: Yup.string().required('Permanent Telephone is required'),
    // curAddress: Yup.string().required('Current Address is required'),
    // curDistrict: Yup.string().required('Current District is required'),
    // curTel: Yup.string().required('Current Telephone is required'),
    // idNo: Yup.string().required('ID Number is required'),
    // idDate: Yup.date().required('Issued Date is required'),
    // idPlace: Yup.string().required('Issued Place is required'),
    // ctactPerson: Yup.string().required('Contact Person is required'),
    // ctactRelation: Yup.string().required('Relationship is required'),
    comId: Yup.string().required('Company ID is required'),
    // locId: Yup.string().required('Location ID is required'),
    // funcId: Yup.string().required('Function ID is required'),
    // depId: Yup.string().required('Department ID is required'),
  });

  const filteredMovementSalaryInfoData = useMemo(() => {
    let filteredData = employeeData || [];
    if (selectedCompany) {
      filteredData = filteredData.filter((i) => i.comId === selectedCompany);
    }

    if (selectedLocation) {
      filteredData = filteredData.filter((i) => i.locId === selectedLocation);
    }

    if (selectedFunction) {
      filteredData = filteredData.filter((i) => i.funcId === selectedFunction);
    }

    if (selectedDepartment) {
      filteredData = filteredData.filter((i) => i.depId === selectedDepartment);
    }

    return filteredData;
  }, [selectedCompany, selectedLocation, selectedFunction, selectedDepartment, employeeData]);

  const workRangeList = otherListNData.filter((i) => i.type === 'PAY_RANGE');
  const workStatusList = otherListNData.filter((i) => i.type === 'WORK_STATUS');

  const getWorkLevelName = (id) => {
    return (worklevelData || []).find((i) => i.id === id)?.payPos || '';
  };

  const getworkRangeName = (id) => {
    return (workRangeList || []).find((i) => i.id === id)?.payPos || '';
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Modal open={open} onClose={handleClose} keepMounted>
        <Box
          sx={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: 3,
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: 24,
            maxWidth: '90%', // You can adjust max width as per your needs
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
            <CloseIcon fontSize="1em" />
          </IconButton>

          <Typography variant="h4">
            {action === 'edit' ? 'Update Casual Labor Profile - Casual Labor Profile' : 'Create Casual Labor Profile'}
          </Typography>

          <Formik
            initialValues={{
              employeeId: rowData?.employeeId || '',
              vnNameFirst: rowData?.vnNameFirst || '',
              vnNameLast: rowData?.vnNameLast || '',
              enNameFirst: rowData?.enNameFirst || '',
              enNameLast: rowData?.enNameLast || '',
              position: rowData?.position || '',
              hiringDate: rowData?.hiringDate || '',
              endDate: rowData?.endDate || '',
              period: rowData?.period || '',
              remark: rowData?.remark || '',
              allowance: rowData?.allowance || '',
              salary: rowData?.salary || '',
              ctactAddress: rowData?.ctactAddress || '',
              ctactTel: rowData?.ctactTel || '',
              birthDate: rowData?.birthDate || '',
              birthPlace: rowData?.birthPlace || '',
              pager: rowData?.pager || '',
              mobile: rowData?.mobile || '',
              perAddress: rowData?.perAddress || '',
              perDistrict: rowData?.perDistrict || '',
              perTel: rowData?.perTel || '',
              curAddress: rowData?.curAddress || '',
              curDistrict: rowData?.curDistrict || '',
              curTel: rowData?.curTel || '',
              idNo: rowData?.idNo || '',
              idDate: rowData?.idDate || '',
              idPlace: rowData?.idPlace || '',
              ctactPerson: rowData?.ctactPerson || '',
              ctactRelation: rowData?.ctactRelation || '',
              comId: rowData?.comId || '',
              funcId: typeof rowData?.funcId === 'string' ? rowData.funcId : rowData?.funcId ? String(rowData.funcId) : '',
              locId: rowData?.locId || '',
              depId: rowData?.depId || '',
              costCenter: rowData?.costCenter || '',
              perCity: rowData?.perCity || '',
              perProvince: rowData?.perProvince || '',
              curCity: rowData?.curCity || '',
              curProvince: rowData?.curProvince || '',
              gender: rowData && rowData.gender != null ? Number(rowData.gender) : (genderList[0]?.code ?? ''),
              marital: typeof rowData?.marital === 'string' ? rowData.marital : rowData?.marital ? String(rowData.marital) : ''
            }}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
              const maritalObj = maritalStatusList.find(
                (item) => String(item.pkey) === String(values.marital) || item.name === values.marital
              );
              values.marital = maritalObj ? maritalObj.name : '';
              if (typeof values.funcId !== 'string') {
                values.funcId = values.funcId ? String(values.funcId) : '';
              }
              if (typeof values.depId !== 'string') {
                values.depId = values.depId ? String(values.depId) : '';
              }
              values.vnFullname = `${values.vnNameFirst || ''} ${values.vnNameLast || ''}`.trim();
              values.enFullname = `${values.enNameFirst || ''} ${values.enNameLast || ''}`.trim();
              if (values.pager && values.pager.length > 50) {
                values.pager = values.pager.slice(0, 50);
              }
              if ('mobilePhone' in values) {
                delete values.mobilePhone;
              }
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
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <MainCard contentSX={{ p: 1.5 }}>
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 12, md: 2 }}>
                            <TextField
                              fullWidth
                              label="Code"
                              variant="outlined"
                              value={values.employeeId}
                              onChange={handleChange}
                              name="employeeId"
                              error={touched.employeeId && !!errors.employeeId}
                              helperText={touched.employeeId && errors.employeeId}
                              slotProps={{ inputLabel: { shrink: true } }}
                            />
                          </Grid>
                          <Grid size={{ xs: 6, md: 3 }}>
                            <TextField
                              fullWidth
                              label="Vietnamese Frirst Name"
                              variant="outlined"
                              value={values.vnNameFirst}
                              onChange={handleChange}
                              name="vnNameFirst"
                              error={touched.vnNameFirst && !!errors.vnNameFirst}
                              helperText={touched.vnNameFirst && errors.vnNameFirst}
                              slotProps={{ inputLabel: { shrink: true } }}
                            />
                          </Grid>
                          <Grid size={{ xs: 6, md: 2 }}>
                            <TextField
                              fullWidth
                              label="Vietnamese Last Name"
                              variant="outlined"
                              value={values.vnNameLast}
                              onChange={handleChange}
                              name="vnNameLast"
                              error={touched.vnNameLast && !!errors.vnNameLast}
                              helperText={touched.vnNameLast && errors.vnNameLast}
                              slotProps={{ inputLabel: { shrink: true } }}
                            />
                          </Grid>
                          <Grid size={{ xs: 6, md: 3 }}>
                            <TextField
                              fullWidth
                              label="English First Name"
                              variant="outlined"
                              value={values.enNameFirst || ''}
                              onChange={handleChange}
                              name="enNameFirst"
                              error={touched.enNameFirst && !!errors.enNameFirst}
                              helperText={touched.enNameFirst && errors.enNameFirst}
                              slotProps={{ inputLabel: { shrink: true } }}
                            />
                          </Grid>
                          <Grid size={{ xs: 6, md: 2 }}>
                            <TextField
                              fullWidth
                              label="English Last Name"
                              variant="outlined"
                              value={values.enNameLast || ''}
                              onChange={handleChange}
                              name="enNameLast"
                              error={touched.enNameLast && !!errors.enNameLast}
                              helperText={touched.enNameLast && errors.enNameLast}
                              slotProps={{ inputLabel: { shrink: true } }}
                            />
                          </Grid>
                        </Grid>
                      </MainCard>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <MainCard contentSX={{ p: 1.5 }}>
                          <Grid size={{ xs: 12, md: 12 }}>
                            <MainCard contentSX={{ p: 1.5 }} sx={{ mb: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
                                Working Information
                              </Typography>
                              <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                  <FormikAutocomplete
                                    name="comId"
                                    options={companyData}
                                    getOptionLabel={(option) => option.name || ''}
                                    value={companyData.find((item) => item.id === values.comId) || null}
                                    onChange={(event, newValue) => {
                                      setSelectedCompany(newValue ? newValue.id : '');
                                      setFieldValue('comId', newValue ? newValue.id : '');
                                    }}
                                    label="Company"
                                    inputHeight="37px"
                                  />
                                </Grid>
                                <Grid size={{ md: 6, xs: 12 }}>
                                  <FormikAutocomplete
                                    name="locId"
                                    options={locationData || []}
                                    getOptionLabel={(option) => `${option?.enName || ''} - ${option?.vnName || ''}`}
                                    value={locationData?.find((item) => item.id === values.locId) || null}
                                    onChange={(event, newValue) => {
                                      setSelectedLocation(newValue ? newValue.id : '');
                                      setFieldValue('locId', newValue ? newValue.id : '');
                                    }}
                                    label="Location"
                                    inputHeight="37px"
                                  />
                                </Grid>
                                <Grid size={{ md: 6, xs: 12 }}>
                                  <FormikAutocomplete
                                    name="funcId"
                                    options={functionData || []}
                                    getOptionLabel={(option) => `${option?.enName || ''} - ${option?.vnName || ''}`}
                                    value={functionData?.find((item) => item.id === values.funcId) || null}
                                    onChange={(event, newValue) => {
                                      setSelectedFunction(newValue ? String(newValue.id) : '');
                                      setFieldValue('funcId', newValue ? String(newValue.id) : '');
                                    }}
                                    label="Function"
                                    inputHeight="37px"
                                  />
                                </Grid>
                                <Grid size={{ md: 6, xs: 12 }}>
                                  <FormikAutocomplete
                                    name="depId"
                                    options={departmentFilterData || []}
                                    getOptionLabel={(option) => `${option?.enName} - ${option?.vnName}` || ''}
                                    renderOption={(props, option) => (
                                      <li {...props} key={option.id}>
                                        {`${option.enName} - ${option.vnName}`}
                                      </li>
                                    )}
                                    value={departmentFilterData.find((item) => item.id === values.depId) || null}
                                    onChange={(event, newValue) => {
                                      setSelectedDepartment(newValue ? newValue.id : '');
                                      setFieldValue('depId', newValue ? newValue.id : '');
                                    }}
                                    label="Department"
                                    inputHeight="37px"
                                  />
                                </Grid>
                                <Grid size={{ md: 6, xs: 12 }}>
                                  <TextField
                                    fullWidth
                                    label="Position"
                                    variant="outlined"
                                    value={values.position || ''}
                                    onChange={handleChange}
                                    name="position"
                                    error={touched.position && !!errors.position}
                                    helperText={touched.position && errors.position}
                                    slotProps={{ inputLabel: { shrink: true } }}
                                  />
                                </Grid>
                                <Grid size={{ md: 6, xs: 12 }}>
                                  <FormikAutocomplete
                                    name="reportTo"
                                    label="Report to"
                                    options={positionData || []}
                                    value={values.reportTo}
                                    onChange={(e, value) => setFieldValue('reportTo', value)}
                                  />
                                </Grid>
                                <Grid size={{ md: 6, xs: 12 }}>
                                  <FormikAutocomplete
                                    name="costCenter"
                                    options={costCenterData}
                                    getOptionLabel={(option) => `[${option.code}] - ${option.description}` || ''}
                                    value={costCenterData?.find((item) => item.id === values.costCenter) || null}
                                    onChange={(event, newValue) => {
                                      setSelectedCostCenter(newValue ? String(newValue.id) : '');
                                      setFieldValue('costCenter', newValue ? String(newValue.id) : '');
                                    }}
                                    label="Cost Center"
                                    renderOption={(props, option, { selected }) => (
                                      <li {...props} key={option.id}>
                                        [{option.code}] - {option.description}
                                      </li>
                                    )}
                                    inputHeight="34.5px"
                                  />
                                </Grid>
                                <Grid size={{ md: 6, xs: 12 }}>
                                  <Field
                                    name="hiringDate"
                                    component={CommonDatePicker}
                                    label="Hiring Date"
                                    minDate={values.siDate ? dayjs(values.siDate) : undefined}
                                  />
                                </Grid>
                                <Grid size={{ md: 6, xs: 12 }}>
                                  <Field
                                    name="endDate"
                                    component={CommonDatePicker}
                                    label="End Date"
                                    minDate={values.siDate ? dayjs(values.siDate) : undefined}
                                  />
                                </Grid>
                                <Grid size={{ md: 6, xs: 12 }}>
                                  <TextField
                                    name="period"
                                    label="Working Period (Months)"
                                    variant="outlined"
                                    fullWidth
                                    value={values.period ?? ''}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setFieldValue('period', val === '' ? null : Number(val));
                                    }}
                                    error={touched.period && !!errors.period}
                                    helperText={touched.period && errors.period}
                                    slotProps={{ inputLabel: { shrink: true } }}
                                  />
                                </Grid>
                                <Grid size={{ md: 6, xs: 12 }}>
                                  <TextField
                                    name="salary"
                                    label="Daily Wage"
                                    variant="outlined"
                                    fullWidth
                                    value={values.salary ?? ''}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setFieldValue('salary', val === '' ? null : Number(val));
                                    }}
                                    error={touched.salary && !!errors.salary}
                                    helperText={touched.salary && errors.salary}
                                    slotProps={{ inputLabel: { shrink: true } }}
                                  />
                                </Grid>
                                <Grid size={{ md: 6, xs: 12 }}>
                                  <TextField
                                    name="allowance"
                                    label="Daily Allowance"
                                    variant="outlined"
                                    fullWidth
                                    value={values.allowance ?? ''}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setFieldValue('allowance', val === '' ? null : Number(val));
                                    }}
                                    error={touched.allowance && !!errors.allowance}
                                    helperText={touched.allowance && errors.allowance}
                                    slotProps={{ inputLabel: { shrink: true } }}
                                  />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                  <TextField
                                    name="remark"
                                    label="Remark"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    minRows={2}
                                    value={values.remark}
                                    onChange={handleChange}
                                    error={touched.remark && !!errors.remark}
                                    helperText={touched.remark && errors.remark}
                                    slotProps={{ inputLabel: { shrink: true } }}
                                  />
                                </Grid>
                              </Grid>
                            </MainCard>
                          </Grid>
                          <Grid container spacing={2}>
                            <MainCard contentSX={{ p: 1.5 }} sx={{ mt: 0.5 }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
                                Emergency Contact
                              </Typography>
                              <Grid container spacing={2}>
                                <Grid size={{ md: 6, xs: 12 }}>
                                  <TextField
                                    fullWidth
                                    label="Contact Person"
                                    variant="outlined"
                                    name="ctactPerson"
                                    value={values.ctactPerson || ''}
                                    onChange={handleChange}
                                    error={touched.ctactPerson && !!errors.ctactPerson}
                                    helperText={touched.ctactPerson && errors.ctactPerson}
                                    slotProps={{ inputLabel: { shrink: true } }}
                                  />
                                </Grid>
                                <Grid size={{ md: 6, xs: 12 }}>
                                  <FormikAutocomplete
                                    name="ctactRelation"
                                    filedName="pkey"
                                    options={relationshipList}
                                    getOptionLabel={(option) => option.name || ''}
                                    value={relationshipList.find((item) => String(item.pkey) === String(values.ctactRelation)) || null}
                                    onChange={(event, newValue) => {
                                      setFieldValue('ctactRelation', newValue ? String(newValue.pkey) : '');
                                    }}
                                    label="Relationship"
                                  />
                                </Grid>
                                <Grid size={{ md: 6, xs: 12 }}>
                                  <TextField
                                    fullWidth
                                    label="Address"
                                    variant="outlined"
                                    value={values.ctactAddress || ''}
                                    onChange={handleChange}
                                    name="ctactAddress"
                                    error={touched.ctactAddress && !!errors.ctactAddress}
                                    helperText={touched.ctactAddress && errors.ctactAddress}
                                    slotProps={{ inputLabel: { shrink: true } }}
                                  />
                                </Grid>
                                <Grid size={{ md: 6, xs: 12 }}>
                                  <TextField
                                    fullWidth
                                    label="Telephone"
                                    variant="outlined"
                                    value={values.ctactTel || ''}
                                    onChange={handleChange}
                                    name="ctactTel"
                                    error={touched.ctactTel && !!errors.ctactTel}
                                    helperText={touched.ctactTel && errors.ctactTel}
                                    slotProps={{ inputLabel: { shrink: true } }}
                                  />
                                </Grid>
                              </Grid>
                            </MainCard>
                          </Grid>
                        </MainCard>
                      </Grid>
                      <Grid size={{ md: 6, xs: 12 }}>
                        <MainCard contentSX={{ p: 1.5 }}>
                          <Grid container spacing={2}>
                            <MainCard contentSX={{ p: 1.5 }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
                                Curriculum Vitae
                              </Typography>
                              <Grid container spacing={2}>
                                <Grid size={{ md: 6, xs: 12 }}>
                                  <Field
                                    name="birthDate"
                                    component={CommonDatePicker}
                                    label="Birth Date"
                                    minDate={values.siDate ? dayjs(values.siDate) : undefined}
                                  />
                                </Grid>
                                <Grid size={{ md: 6, xs: 12 }}>
                                  <TextField
                                    fullWidth
                                    label="Birth Place"
                                    variant="outlined"
                                    value={values.birthPlace || ''}
                                    onChange={handleChange}
                                    name="birthPlace"
                                    error={touched.birthPlace && !!errors.birthPlace}
                                    helperText={touched.birthPlace && errors.birthPlace}
                                    slotProps={{ inputLabel: { shrink: true } }}
                                  />
                                </Grid>
                                <Grid size={{ md: 6, xs: 12 }}>
                                  <FormikAutocomplete
                                    name="gender"
                                    options={genderList}
                                    getOptionLabel={(option) => option.name || ''}
                                    label="Gender"
                                  />
                                </Grid>
                                <Grid size={{ md: 6, xs: 12 }}>
                                  <FormikAutocomplete
                                    name="marital"
                                    filedName="name"
                                    options={maritalStatusList}
                                    getOptionLabel={(option) => option.name || ''}
                                    label="Marital Status"
                                  />
                                </Grid>
                                <Grid size={{ md: 6, xs: 12 }}>
                                  <TextField
                                    fullWidth
                                    label="Pager"
                                    variant="outlined"
                                    value={values.pager || ''}
                                    onChange={handleChange}
                                    name="pager"
                                    error={touched.pager && !!errors.pager}
                                    helperText={touched.pager && errors.pager}
                                    slotProps={{ inputLabel: { shrink: true } }}
                                  />
                                </Grid>
                                <Grid size={{ md: 6, xs: 12 }}>
                                  <TextField
                                    fullWidth
                                    label="Mobile Phone"
                                    variant="outlined"
                                    value={values.mobile || ''}
                                    onChange={handleChange}
                                    name="mobile"
                                    error={touched.mobile && !!errors.mobile}
                                    helperText={touched.mobile && errors.mobile}
                                    slotProps={{ inputLabel: { shrink: true } }}
                                  />
                                </Grid>
                              </Grid>
                            </MainCard>
                          </Grid>
                          <MainCard sx={{ mt: 1 }} contentSX={{ p: 1.5 }}>
                            <Tabs
                              sx={{
                                minHeight: 20,
                                display: 'flex',
                                flexWrap: 'wrap',
                                '& .MuiTabs-flexContainer': {
                                  flexWrap: 'wrap'
                                },
                                '.MuiTab-root': {
                                  minHeight: 20
                                }
                              }}
                              value={tabValue}
                              onChange={handleChangeTab}
                              aria-label="address tabs"
                            >
                              <Tab
                                label="Permanent Address"
                                sx={{
                                  backgroundColor: tabValue === 0 ? '#f0f0f0' : 'transparent',
                                  '&.Mui-selected': {
                                    backgroundColor: tabValue === 0 ? '#e0e0e0' : 'transparent'
                                  }
                                }}
                              />
                              <Tab
                                label="Current Address"
                                sx={{
                                  backgroundColor: tabValue === 1 ? '#f0f0f0' : 'transparent',
                                  '&.Mui-selected': {
                                    backgroundColor: tabValue === 1 ? '#e0e0e0' : 'transparent'
                                  }
                                }}
                              />
                            </Tabs>
                            <CommonTabPanel value={tabValue} index={0}>
                              <Grid container spacing={2}>
                                <Grid size={{ xs: 12 }}>
                                  <TextField
                                    fullWidth
                                    label="Address"
                                    variant="outlined"
                                    name="perAddress"
                                    value={values.perAddress}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      handleChange(e);
                                      if (val.length > 50) {
                                        e.target.value = val.slice(0, 50);
                                      }
                                    }}
                                    error={touched.perAddress && !!errors.perAddress}
                                    helperText={touched.perAddress && errors.perAddress}
                                    slotProps={{
                                      inputLabel: { shrink: true }
                                    }}
                                    size="small"
                                  />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                  <TextField
                                    fullWidth
                                    label="District"
                                    variant="outlined"
                                    name="perDistrict"
                                    value={values.perDistrict}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      handleChange(e);
                                      if (val.length > 50) {
                                        e.target.value = val.slice(0, 50);
                                      }
                                    }}
                                    error={touched.perDistrict && !!errors.perDistrict}
                                    helperText={touched.perDistrict && errors.perDistrict}
                                    slotProps={{
                                      inputLabel: { shrink: true }
                                    }}
                                    size="small"
                                  />
                                </Grid>
                                <Grid size={{ md: 6, xs: 12 }}>
                                  <FormikAutocomplete
                                    name="perCity"
                                    options={cityData}
                                    getOptionLabel={(option) => option.vnName || ''}
                                    value={cityData?.find((item) => item.id === values.perCity) || null}
                                    onChange={(event, newValue) => {
                                      setSelectedCity(newValue ? String(newValue.id) : '');
                                      setFieldValue('perCity', newValue ? String(newValue.id) : '');
                                    }}
                                    label="City"
                                  />
                                </Grid>
                                <Grid size={{ md: 6, xs: 12 }}>
                                  <FormikAutocomplete
                                    name="perProvince"
                                    options={provinceData}
                                    getOptionLabel={(option) => option.vnName || ''}
                                    value={provinceData?.find((item) => item.id === values.perProvince) || null}
                                    onChange={(event, newValue) => {
                                      setSelectedProvince(newValue ? String(newValue.id) : '');
                                      setFieldValue('perProvince', newValue ? String(newValue.id) : '');
                                    }}
                                    label="Province"
                                  />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                  <TextField
                                    fullWidth
                                    label="Telephone"
                                    variant="outlined"
                                    name="perTel"
                                    value={values.perTel}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      handleChange(e);
                                      if (val.length > 50) {
                                        e.target.value = val.slice(0, 50);
                                      }
                                    }}
                                    error={touched.perTel && !!errors.perTel}
                                    helperText={touched.perTel && errors.perTel}
                                    slotProps={{
                                      inputLabel: { shrink: true }
                                    }}
                                    size="small"
                                  />
                                </Grid>
                              </Grid>
                            </CommonTabPanel>
                            <CommonTabPanel value={tabValue} index={1}>
                              <Grid container spacing={2}>
                                <Grid size={{ xs: 12 }}>
                                  <TextField
                                    fullWidth
                                    label="Address"
                                    variant="outlined"
                                    name="curAddress"
                                    value={values.curAddress}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      handleChange(e);
                                      if (val.length > 250) {
                                        e.target.value = val.slice(0, 250);
                                      }
                                    }}
                                    error={touched.curAddress && !!errors.curAddress}
                                    helperText={touched.curAddress && errors.curAddress}
                                    slotProps={{
                                      inputLabel: { shrink: true }
                                    }}
                                    size="small"
                                  />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                  <TextField
                                    fullWidth
                                    label="District"
                                    variant="outlined"
                                    name="curDistrict"
                                    value={values.curDistrict}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      handleChange(e);
                                      if (val.length > 50) {
                                        e.target.value = val.slice(0, 50);
                                      }
                                    }}
                                    error={touched.curDistrict && !!errors.curDistrict}
                                    helperText={touched.curDistrict && errors.curDistrict}
                                    slotProps={{
                                      inputLabel: { shrink: true }
                                    }}
                                    size="small"
                                  />
                                </Grid>
                                <Grid size={{ md: 6, xs: 12 }}>
                                  <FormikAutocomplete
                                    name="curCity"
                                    options={cityData}
                                    getOptionLabel={(option) => option.vnName || ''}
                                    value={cityData?.find((item) => item.id === values.curCity) || null}
                                    onChange={(event, newValue) => {
                                      setSelectedCity(newValue ? String(newValue.id) : '');
                                      setFieldValue('curCity', newValue ? String(newValue.id) : '');
                                    }}
                                    label="City"
                                  />
                                </Grid>
                                <Grid size={{ md: 6, xs: 12 }}>
                                  <FormikAutocomplete
                                    name="curProvince"
                                    options={provinceData}
                                    getOptionLabel={(option) => option.vnName || ''}
                                    value={provinceData?.find((item) => item.id === values.curProvince) || null}
                                    onChange={(event, newValue) => {
                                      setSelectedProvince(newValue ? String(newValue.id) : '');
                                      setFieldValue('curProvince', newValue ? String(newValue.id) : '');
                                    }}
                                    label="Province"
                                  />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                  <TextField
                                    fullWidth
                                    label="Telephone"
                                    variant="outlined"
                                    name="curTel"
                                    value={values.curTel}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      handleChange(e);
                                      if (val.length > 50) {
                                        e.target.value = val.slice(0, 50);
                                      }
                                    }}
                                    error={touched.curTel && !!errors.curTel}
                                    helperText={touched.curTel && errors.curTel}
                                    slotProps={{
                                      inputLabel: { shrink: true }
                                    }}
                                    size="small"
                                  />
                                </Grid>
                              </Grid>
                            </CommonTabPanel>
                          </MainCard>
                          <Grid container spacing={2}>
                            <MainCard contentSX={{ p: 1.5 }} sx={{ mt: 0.5 }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
                                ID
                              </Typography>
                              <Grid container spacing={2}>
                                <Grid size={{ md: 4, xs: 12 }}>
                                  <TextField
                                    fullWidth
                                    label="NO."
                                    variant="outlined"
                                    value={values.idNo || ''}
                                    onChange={(e) => {
                                      let val = e.target.value;
                                      if (val.length > 20) val = val.slice(0, 20);
                                      e.target.value = val;
                                      handleChange(e);
                                    }}
                                    name="idNo"
                                    error={touched.idNo && !!errors.idNo}
                                    helperText={touched.idNo && errors.idNo}
                                    slotProps={{ inputLabel: { shrink: true } }}
                                  />
                                </Grid>
                                <Grid size={{ md: 4, xs: 12 }}>
                                  <Field
                                    name="idDate"
                                    component={CommonDatePicker}
                                    label="Issued Date"
                                    minDate={values.idDate ? dayjs(values.idDate) : undefined}
                                  />
                                </Grid>
                                <Grid size={{ md: 4, xs: 12 }}>
                                  <Field
                                    name="idPlace"
                                    component={CommonDatePicker}
                                    label="Issued Place"
                                    minDate={values.idPlace ? dayjs(values.idPlace) : undefined}
                                  />
                                </Grid>
                              </Grid>
                            </MainCard>
                          </Grid>
                        </MainCard>
                      </Grid>
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

export default CasualLaborModal;
