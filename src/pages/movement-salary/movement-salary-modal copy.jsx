import React, { useEffect, useState, useMemo } from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Autocomplete
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import FormikAutocomplete from '../common/formik-autocomplete';
import { formatNumber, parseNumber } from 'utils/convert-money';
import dayjs from 'dayjs';
import MainCard from 'components/MainCard';
import { Field } from 'formik';
import FormTextFieldShrink from '../common/form-text-field-shrink';
import CommonDatePicker from '../common/common-date-picker';

const MovementSalaryModal = ({
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
  sectionData,
  functionData,
  positionData,
  jobTypeData,
  worklevelData
}) => {
  const [positionFilter, setPositionFilter] = useState([]);
  const [departmentFilterData, setDepartmentFilterData] = useState([]);
  const [sectionFilterData, setSectionFilterData] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState();
  const [selectedFunction, setSelectedFunction] = useState();
  const [selectedLocation, setSelectedLocation] = useState();
  const [selectedDepartment, setSelectedDepartment] = useState();
  const [selectedEmployee, setSelectedEmployee] = useState({});

  const handleClose = () => {
    setOpen(false);
    setDisableBtn(true);
    setSelectedEmployee({});
  };

  useEffect(() => {
    setDisableBtn(false);
  }, [open]);

  useEffect(() => {
    let filterDepData = departmentData;
    let filterSecData = sectionData;
    let filterPosData = positionData;
    if (rowData?.comId) {
      filterDepData = departmentData.filter((i) => i.comId === rowData?.comId);
      filterSecData = sectionData.filter((i) => i.comId === rowData?.comId);
    }
    if (rowData?.depId) {
      filterSecData = filterDepData.filter((i) => i.depId === rowData?.depId);
    }
    if (rowData?.funcId) {
      filterPosData = positionData.filter((i) => i.funcId === rowData?.funcId);
    }
    setDepartmentFilterData(filterDepData);
    setSectionFilterData(filterSecData);
    setPositionFilter(filterPosData);
  }, [rowData]);

  useEffect(() => {
    if (selectedCompany) {
      const filterDepData = departmentData.filter((i) => i.comId === selectedCompany);
      setDepartmentFilterData(filterDepData);
    } else {
      setDepartmentFilterData(departmentData); // Hiển thị tất cả department nếu không chọn company
    }
  }, [departmentData, selectedCompany]);

  const validationSchema = Yup.object({
    employeeId: Yup.string().required('employeeId is required'),
    effectDate: Yup.string().required('Effected Date is required'),
    comId: Yup.string().required('Company date is required')
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

  const varpayRangeList = otherListData.filter((i) => i.type === 'VARPAY_RANGE');
  const workStatusList = otherListNData.filter((i) => i.type === 'WORK_STATUS');

  const getWorkLevelName = (id) => {
    return worklevelData.find((i) => i.id === id)?.payPos || '';
  };

  const getVarpayRangeName = (id) => {
    return varpayRangeList.find((i) => i.id === id)?.name || '';
  };

  const getJobTypeName = (id) => {
    return jobTypeData.find((i) => i.code === id)?.name || '';
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
            <CloseIcon fontSize="1em" />
          </IconButton>

          <Typography variant="h4">
            {action === 'edit' ? 'Update Movement - Salary Adjustment' : 'Create Movement - Salary Adjustment'}
          </Typography>

          <Formik
            initialValues={{
              employeeId: rowData?.employeeId || '',
              issuedDate: rowData?.issuedDate || '',
              effectDate: rowData?.effectDate || '',
              appliedBy: rowData?.appliedBy || '',
              comId: rowData?.comId || '',
              locId: rowData?.locId || '',
              depId: rowData?.depId || '',
              secId: rowData?.secId || '',
              funcId: rowData?.funcId || '',
              posId: rowData?.posId || '',
              jobType: rowData?.jobType || '',
              workLevel: rowData?.workLevel || '',
              basic: rowData?.basic || 0,
              grossSal: rowData?.grossSal || 0,
              mgtAllow: rowData?.mgtAllow || 0,
              totalBase: rowData?.totalBase || 0,
              nth: rowData?.nth || 0,
              payPoint: rowData?.payPoint || 0,
              anTotalNth: rowData?.anTotalNth || 0,
              varpayRange: rowData?.varpayRange || '',
              workStatus: rowData?.workStatus || 3
            }}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={(values) => {
              onAction(values, selectedEmployee);
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
                  <MainCard sx={{ mt: 1 }} contentSX={{ p: 1.5 }}>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12 }}>
                        <MainCard contentSX={{ p: 1.5 }}>
                          <Grid container spacing={2}>
                            {action === 'create' && (
                              <>
                                <Grid size={{ xs: 6, md: 3 }}>
                                  <Autocomplete
                                    disablePortal
                                    options={companyData || []}
                                    getOptionLabel={(option) => option?.name || ''}
                                    value={companyData.find((item) => item.id === selectedCompany) || null}
                                    onChange={(event, newValue) => {
                                      setSelectedCompany(newValue ? newValue.id : '');
                                    }}
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        backgroundColor: '#ffffff',
                                        height: '37px'
                                      },
                                      '& .MuiInputBase-input': {
                                        padding: '8px 14px'
                                      }
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="Company"
                                        variant="outlined"
                                        size="small"
                                        slotProps={{
                                          inputLabel: { shrink: true }
                                        }}
                                      />
                                    )}
                                  />
                                </Grid>
                                <Grid size={{ xs: 6, md: 3 }}>
                                  <Autocomplete
                                    disablePortal
                                    options={locationData || []}
                                    getOptionLabel={(option) => `${option?.enName} - ${option?.vnName}` || ''}
                                    value={locationData.find((item) => item.id === selectedLocation) || null}
                                    onChange={(event, newValue) => {
                                      setSelectedLocation(newValue ? newValue.id : '');
                                    }}
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        backgroundColor: '#ffffff',
                                        height: '37px' // Hoặc cùng chiều cao với TextField
                                      },
                                      '& .MuiInputBase-input': {
                                        padding: '8px 14px'
                                      }
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="Location"
                                        variant="outlined"
                                        size="small"
                                        slotProps={{
                                          inputLabel: { shrink: true }
                                        }}
                                      />
                                    )}
                                  />
                                </Grid>
                                <Grid size={{ xs: 6, md: 3 }}>
                                  <Autocomplete
                                    disablePortal
                                    options={functionData || []}
                                    getOptionLabel={(option) => `${option?.enName} - ${option?.vnName}` || ''}
                                    value={functionData.find((item) => item.id === selectedFunction) || null}
                                    onChange={(event, newValue) => {
                                      setSelectedFunction(newValue ? newValue.id : '');
                                    }}
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        backgroundColor: '#ffffff',
                                        height: '37px'
                                      },
                                      '& .MuiInputBase-input': {
                                        padding: '8px 14px'
                                      }
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="Function"
                                        variant="outlined"
                                        size="small"
                                        slotProps={{
                                          inputLabel: { shrink: true }
                                        }}
                                      />
                                    )}
                                  />
                                </Grid>
                                <Grid size={{ xs: 6, md: 3 }}>
                                  <Autocomplete
                                    disablePortal
                                    options={departmentFilterData || []}
                                    getOptionLabel={(option) => `${option?.enName} - ${option?.vnName}` || ''}
                                    renderOption={(props, option) => (
                                      <li {...props} key={option.id}>
                                        {`${option.enName} - ${option.vnName}`}
                                      </li>
                                    )}
                                    value={departmentFilterData.find((item) => item.id === selectedDepartment) || null}
                                    onChange={(event, newValue) => {
                                      setSelectedDepartment(newValue ? newValue.id : '');
                                    }}
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        backgroundColor: '#ffffff',
                                        height: '37px'
                                      },
                                      '& .MuiInputBase-input': {
                                        padding: '8px 14px'
                                      }
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="Department"
                                        variant="outlined"
                                        size="small"
                                        slotProps={{
                                          inputLabel: { shrink: true }
                                        }}
                                      />
                                    )}
                                  />
                                </Grid>
                              </>
                            )}
                            <Grid size={{ xs: 12 }}>
                              <FormikAutocomplete
                                name="employeeId"
                                filedName="employeeId"
                                options={filteredMovementSalaryInfoData}
                                getOptionLabel={(option) => `${option.employeeId}-${option.enFullName}` || ''}
                                label="Employe ID"
                                disabled={action === 'edit'}
                                onChange={(event, newValue) => {
                                  setFieldValue('employeeId', newValue?.employeeId || '');
                                  if (newValue) {
                                    const companyName = companyData.find((i) => i.id === newValue?.comId);
                                    newValue.company = companyName && companyName.name ? companyName.name : '';
                                    const departmentName = departmentData.find((i) => i.id === newValue?.depId);
                                    newValue.department = departmentName && departmentName.enName ? departmentName.enName : '';
                                    const locationName = locationData.find((i) => i.id === newValue?.locId);
                                    newValue.location = locationName && locationName.enName ? locationName.enName : '';
                                    const sectionName = sectionData.find((i) => i.id === newValue?.secId);
                                    newValue.section = sectionName && sectionName.enName ? sectionName.enName : '';
                                    const functionName = functionData.find((i) => i.id === newValue?.secId);
                                    newValue.function = functionName && functionName.enName ? functionName.enName : '';
                                    const positionName = positionData.find((i) => i.id === newValue?.secId);
                                    newValue.position = positionName && positionName.enName ? positionName.enName : '';
                                    const jobTypeName = jobTypeData.find((i) => i.id === newValue?.secId);
                                    newValue.jobTypeName = jobTypeName && jobTypeName.name ? jobTypeName.name : '';
                                  } else {
                                    newValue = {};
                                  }
                                  setSelectedEmployee(newValue);
                                }}
                              />
                            </Grid>
                            <Grid size={{ xs: 4 }}>
                              <Field name="issuedDate" component={CommonDatePicker} label="Issued Date" />
                            </Grid>
                            <Grid size={{ xs: 4 }}>
                              <Field
                                name="effectDate"
                                component={CommonDatePicker}
                                label="Effective Date"
                                minDate={values.issuedDate ? dayjs(values.issuedDate) : undefined}
                              />
                            </Grid>
                            <Grid size={{ xs: 4 }}>
                              <Field
                                name="appliedBy"
                                component={FormTextFieldShrink}
                                label="Applied By"
                                variant="outlined"
                                inputHeight="37px"
                              />
                            </Grid>
                          </Grid>
                        </MainCard>
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <MainCard contentSX={{ p: 1.5 }}>
                          <Grid container spacing={2}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                              Current Status
                            </Typography>
                            <Grid size={{ xs: 12 }}>
                              <TextField
                                label="Company"
                                value={(rowData && rowData.company && rowData.company.name) || selectedEmployee?.company || ''}
                                variant="outlined"
                                fullWidth
                                disabled
                                slotProps={{
                                  inputLabel: { shrink: true },
                                  readOnly: true
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { height: '34.5px' } }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <TextField
                                label="Location"
                                value={(rowData && rowData.location && rowData.location.vnName) || selectedEmployee?.location || ''}
                                variant="outlined"
                                fullWidth
                                disabled
                                slotProps={{
                                  inputLabel: { shrink: true },
                                  readOnly: true
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { height: '34.5px' } }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <TextField
                                label="Department"
                                value={(rowData && rowData.department && rowData.department.vnName) || selectedEmployee?.department || ''}
                                variant="outlined"
                                fullWidth
                                disabled
                                slotProps={{
                                  inputLabel: { shrink: true },
                                  readOnly: true
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { height: '34.5px' } }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 12 }}>
                              <TextField
                                label="Section"
                                value={(rowData && rowData.section && rowData.section.vnName) || selectedEmployee?.section || ''}
                                variant="outlined"
                                fullWidth
                                disabled
                                slotProps={{
                                  inputLabel: { shrink: true },
                                  readOnly: true
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { height: '34.5px' } }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 12 }}>
                              <TextField
                                label="Function"
                                value={(rowData && rowData.function && rowData.function.vnName) || selectedEmployee?.function || ''}
                                variant="outlined"
                                fullWidth
                                disabled
                                slotProps={{
                                  inputLabel: { shrink: true },
                                  readOnly: true
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { height: '34.5px' } }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <TextField
                                label="Position"
                                value={(rowData && rowData.position && rowData.position.vnName) || selectedEmployee?.position || ''}
                                variant="outlined"
                                fullWidth
                                disabled
                                slotProps={{
                                  inputLabel: { shrink: true },
                                  readOnly: true
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { height: '34.5px' } }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <TextField
                                label="Job Type"
                                value={
                                  (rowData && rowData.jobType && rowData.jobType.name) || getJobTypeName(selectedEmployee?.jobType) || ''
                                }
                                variant="outlined"
                                fullWidth
                                disabled
                                slotProps={{
                                  inputLabel: { shrink: true },
                                  readOnly: true
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { height: '34.5px' } }}
                              />
                            </Grid>
                          </Grid>
                        </MainCard>
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <MainCard contentSX={{ p: 1.5 }}>
                          <Grid container spacing={2}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                              New Status
                            </Typography>
                            <Grid size={{ xs: 12, md: 12 }}>
                              <FormikAutocomplete
                                name="comId"
                                options={companyData}
                                getOptionLabel={(option) => option.name || ''}
                                onChange={(event, newValue) => {
                                  const departmentFilter = departmentData.filter((i) => i.comId === newValue?.id);
                                  const sectionFilter = sectionData.filter((i) => i.comId === newValue?.id);
                                  setSectionFilterData(sectionFilter);
                                  setDepartmentFilterData(departmentFilter);
                                  setFieldValue('comId', newValue?.id || '');
                                  const depData = departmentFilter.find((i) => i.id === values?.depId);
                                  const secData = sectionFilter.find((i) => i.id === values?.depId);
                                  setFieldValue('depId', depData?.id || '');
                                  setFieldValue('secId', secData?.id || '');
                                }}
                                label="Company"
                                inputHeight="34.5px"
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 12 }}>
                              <FormikAutocomplete
                                name="locId"
                                options={locationData}
                                getOptionLabel={(option) => option.enName || ''}
                                label="Location"
                                inputHeight="34.5px"
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 12 }}>
                              <FormikAutocomplete
                                name="depId"
                                options={departmentFilterData}
                                getOptionLabel={(option) => option.enName || ''}
                                label="Department"
                                renderOption={(props, option, state, { selected }) => (
                                  <li {...props} key={`${option.id}-${state.index}`}>
                                    {option.enName}
                                  </li>
                                )}
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 12 }}>
                              <FormikAutocomplete
                                name="secId"
                                options={sectionFilterData}
                                getOptionLabel={(option) => option.enName || ''}
                                label="Section"
                                inputHeight="34.5px"
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 12 }}>
                              <FormikAutocomplete
                                name="funcId"
                                options={functionData}
                                getOptionLabel={(option) => option.enName || ''}
                                label="Function"
                                onChange={(event, newValue) => {
                                  const reportToListData = positionData.filter((i) => i.funcId === newValue?.id);
                                  setPositionFilter(reportToListData);
                                  setFieldValue('funcId', newValue?.id || '');
                                  const posData = reportToListData.find((i) => i.id === values?.funcId);
                                  setFieldValue('posId', posData?.id || '');
                                }}
                                inputHeight="34.5px"
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 12 }}>
                              <FormikAutocomplete
                                name="posId"
                                options={positionFilter}
                                getOptionLabel={(option) => `${option.id} - ${option.enName}` || ''}
                                label="Position"
                                renderOption={(props, option, { selected }) => (
                                  <li {...props} key={option.id}>
                                    {option.id} - {option.enName}
                                  </li>
                                )}
                                inputHeight="34.5px"
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 12 }}>
                              <FormikAutocomplete
                                name="jobType"
                                filedName="code"
                                options={jobTypeData}
                                getOptionLabel={(option) => option.name || ''}
                                label="Job Type"
                                onChange={(event, newValue) => {
                                  setFieldValue('jobType', newValue?.code || '');
                                }}
                                inputHeight="34.5px"
                              />
                            </Grid>
                          </Grid>
                        </MainCard>
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <MainCard sx={{ mt: 2 }} contentSX={{ p: 1.5 }}>
                          <Grid container spacing={2}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                              Finance
                            </Typography>
                            <Grid size={{ xs: 12 }}>
                              <TextField
                                label="Work Level"
                                value={
                                  (rowData && rowData.workLevel && getWorkLevelName(rowData.workLevel)) ||
                                  (selectedEmployee && selectedEmployee.workLevel && getWorkLevelName(selectedEmployee.workLevel)) ||
                                  ''
                                }
                                variant="outlined"
                                fullWidth
                                disabled
                                slotProps={{
                                  inputLabel: { shrink: true },
                                  readOnly: true
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { height: '34.5px' } }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <TextField
                                label="Basic"
                                value={(rowData && rowData.basic && formatNumber(rowData.basic)) || selectedEmployee.basic || ''}
                                variant="outlined"
                                fullWidth
                                disabled
                                slotProps={{
                                  inputLabel: { shrink: true },
                                  readOnly: true
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { height: '34.5px' } }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <TextField
                                label="Gross"
                                value={(rowData && rowData.grossSal && formatNumber(rowData.grossSal)) || selectedEmployee.grossSal || ''}
                                variant="outlined"
                                fullWidth
                                disabled
                                slotProps={{
                                  inputLabel: { shrink: true },
                                  readOnly: true
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { height: '34.5px' } }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <TextField
                                label="Management Allowance"
                                value={(rowData && rowData.mgtAllow && formatNumber(rowData.mgtAllow)) || selectedEmployee.mgtAllow || ''}
                                variant="outlined"
                                fullWidth
                                disabled
                                slotProps={{
                                  inputLabel: { shrink: true },
                                  readOnly: true
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { height: '34.5px' } }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <TextField
                                label="Total Base"
                                value={
                                  (rowData && rowData.totalBase && formatNumber(rowData.totalBase)) || selectedEmployee.totalBase || ''
                                }
                                variant="outlined"
                                fullWidth
                                disabled
                                slotProps={{
                                  inputLabel: { shrink: true },
                                  readOnly: true
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { height: '34.5px' } }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <TextField
                                label="NTH"
                                value={(rowData && rowData.nth && formatNumber(rowData.nth)) || selectedEmployee.nth || ''}
                                variant="outlined"
                                fullWidth
                                disabled
                                slotProps={{
                                  inputLabel: { shrink: true },
                                  readOnly: true
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { height: '34.5px' } }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <TextField
                                label="Pay Point (%)"
                                value={(rowData && rowData.payPoint && formatNumber(rowData.payPoint)) || selectedEmployee.payPoint || ''}
                                variant="outlined"
                                fullWidth
                                disabled
                                slotProps={{
                                  inputLabel: { shrink: true },
                                  readOnly: true
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { height: '34.5px' } }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <TextField
                                label="Annual Total NTH"
                                value={
                                  (rowData && rowData.anTotalNth && formatNumber(rowData.anTotalNth)) || selectedEmployee.anTotalNth || ''
                                }
                                variant="outlined"
                                fullWidth
                                disabled
                                slotProps={{
                                  inputLabel: { shrink: true },
                                  readOnly: true
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { height: '34.5px' } }}
                              />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                              <TextField
                                label="Variable Pay Range"
                                value={
                                  (rowData && rowData.varpayRange && getVarpayRangeName(rowData.varpayRange)) ||
                                  selectedEmployee.varpayRange ||
                                  ''
                                }
                                variant="outlined"
                                fullWidth
                                disabled
                                slotProps={{
                                  inputLabel: { shrink: true },
                                  readOnly: true
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { height: '34.5px' } }}
                              />
                            </Grid>
                          </Grid>
                        </MainCard>
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <MainCard sx={{ mt: 2 }} contentSX={{ p: 1.5 }}>
                          <Grid container spacing={2}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                              New Finance
                            </Typography>
                            <Grid size={{ xs: 12 }}>
                              <FormikAutocomplete
                                name="workLevel"
                                options={worklevelData}
                                getOptionLabel={(option) => option.payPos || ''}
                                label="Work Level (Job Grade)"
                                inputHeight="34.5px"
                              />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <Field
                                name="basic"
                                formatNumber={formatNumber}
                                parseNumber={parseNumber}
                                component={FormTextFieldShrink}
                                label="Basic"
                                variant="outlined"
                                inputHeight="34.5px"
                              />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <Field
                                name="grossSal"
                                formatNumber={formatNumber}
                                parseNumber={parseNumber}
                                component={FormTextFieldShrink}
                                label="Gross"
                                variant="outlined"
                                inputHeight="34.5px"
                                disabled
                              />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <Field
                                name="mgtAllow"
                                formatNumber={formatNumber}
                                parseNumber={parseNumber}
                                label="Management Allowance"
                                component={FormTextFieldShrink}
                                variant="outlined"
                                inputHeight="34.5px"
                              />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <Field
                                name="totalBase"
                                formatNumber={formatNumber}
                                parseNumber={parseNumber}
                                label="Total Base"
                                component={FormTextFieldShrink}
                                variant="outlined"
                                inputHeight="34.5px"
                              />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <Field
                                name="nth"
                                formatNumber={formatNumber}
                                parseNumber={parseNumber}
                                label="NTH"
                                component={FormTextFieldShrink}
                                variant="outlined"
                                inputHeight="34.5px"
                                disabled
                              />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <Field
                                name="payPoint"
                                formatNumber={formatNumber}
                                parseNumber={parseNumber}
                                label="Pay Point (%)"
                                component={FormTextFieldShrink}
                                variant="outlined"
                                inputHeight="34.5px"
                                disabled
                              />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <Field
                                name="anTotalNth"
                                formatNumber={formatNumber}
                                parseNumber={parseNumber}
                                label="Annual Total NTH"
                                component={FormTextFieldShrink}
                                variant="outlined"
                                inputHeight="34.5px"
                                disabled
                              />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                              <FormikAutocomplete
                                name="varpayRange"
                                filedName="name"
                                options={varpayRangeList}
                                label="Variable Pay Range"
                                getOptionLabel={(option) => option.name || ''}
                                inputHeight="34.5px"
                              />
                            </Grid>
                          </Grid>
                        </MainCard>
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <MainCard contentSX={{ p: 1.5 }}>
                          <FormControl component="fieldset" error={touched.workStatus && !!errors.workStatus}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                              Movement
                            </Typography>
                            <RadioGroup
                              name="workStatus"
                              value={values.workStatus}
                              onChange={(e) => setFieldValue('workStatus', e.target.value)}
                              row
                            >
                              {workStatusList.map((i) => {
                                return <FormControlLabel key={i.id} value={i.id} control={<Radio />} label={i.name} />;
                              })}
                            </RadioGroup>
                            {touched.workStatus && errors.workStatus && <FormHelperText>{errors.workStatus}</FormHelperText>}
                          </FormControl>
                        </MainCard>
                      </Grid>
                    </Grid>
                  </MainCard>
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

export default MovementSalaryModal;
