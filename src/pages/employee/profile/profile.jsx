import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  TextField,
  RadioGroup,
  FormLabel,
  Radio,
  Tabs,
  Tab,
  FormGroup,
  Checkbox,
  Button
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import MainCard from 'components/MainCard';
import FormikAutocomplete from '../../common/formik-autocomplete';
import CommonTabPanel from '../../common/common-tab-panel';
import { faFileContract } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LaborContractModal from './labor-contract/labor-contract-modal';
import { getContractByEmployeeApi, createContractApi, updateContractApi, deleteContractApi } from 'api/contract.api';
import { createEmployeeApi, updateEmployeeApi } from 'api/employee.api';

import LaborContractActionModal from './labor-contract/labor-contract-action-modal';
import LaborContractDeleteConfirm from './labor-contract/labor-contract-delete-confirm';
import TerminationModal from './termination-modal';

const Profile = ({
  open,
  setOpen,
  rowData,
  action,
  fetchData,
  companyData,
  locationData,
  departmentData,
  sectionData,
  functionData,
  positionData,
  costCenterData,
  jobTypeData,
  contractTypeData,
  otherListNData
}) => {
  const [disableBtn, setDisableBtn] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [recuitmentStatus, setRecuitmentStatus] = useState([]);
  const [terminationReason, setTerminationReason] = useState([]);
  const [openLaborContract, setOpenLaborContract] = useState(false);
  const [openTermination, setOpenTermination] = useState(false);
  const [openLaborActionContract, setOpenLaborActionContract] = useState(false);
  const [contractModalData, setContractModalData] = useState({});
  const [actionModal, setActionModal] = useState();
  const [contractData, setContractData] = useState({});
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [positionFilter, setPositionFilter] = useState([]);
  const [departmentFilterData, setDepartmentFilterData] = useState([]);
  const [sectionFilterData, setSectionFilterData] = useState([]);

  const handleClose = () => {
    setOpen(false);
    setDisableBtn(true);
  };

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
    const positionFilterData = positionData.filter((i) => i.funcId === rowData.funcId);
    setPositionFilter(positionFilterData);
  }, [rowData.funcId, positionData]);

  useEffect(() => {
    setDisableBtn(false);
  }, [open]);

  useEffect(() => {
    const dataRecuitmentStatus = otherListNData.filter((i) => i.type === 'RECRUITMENT_STATUS');
    setRecuitmentStatus(dataRecuitmentStatus);
    const terminationReasonFilter = otherListNData.filter((i) => i.type === 'TER_REASON');
    setTerminationReason(terminationReasonFilter);
  }, [otherListNData]);

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const onActionModal = async (data, action) => {
    try {
      data.employeeId = rowData.employeeId;
      if (action === 'create') {
        const resultCreate = await createContractApi(data);
        if (resultCreate.isSuccess) toast.success('Create Contract successfully');
        else toast.error(resultCreate.message);
      } else if (action === 'edit') {
        const resultUpdate = await updateContractApi(data, contractModalData.pkey);
        if (resultUpdate.isSuccess) toast.success('Update Contract successfully');
        else toast.error(resultUpdate.message);
      } else {
        toast.error('Contract Type not found');
      }
      setOpenLaborActionContract(false);
      await fetchLaborContract();
    } catch {
      toast.error(`${action === 'edit' ? 'Update' : 'Create'} Contract failed`);
    }
  };

  const onAction = async (data) => {
    try {
      data.enFullName = `${data.enNameFirst} ${data.enNameLast}`;
      data.vnFullName = `${data.vnNameFirst} ${data.vnNameLast}`;
      if (action === 'create') {
        const resultCreate = await createEmployeeApi(data);
        if (resultCreate.isSuccess) {
          toast.success('Create Employee successfully');
          fetchData();
        } else toast.error(resultCreate.message);
      } else if (action === 'edit' && data.employeeId) {
        const resultUpdate = await updateEmployeeApi(data, data.employeeId, rowData.comId, rowData.pkey);
        if (resultUpdate.isSuccess) {
          toast.success('Update Employee successfully');
          fetchData();
        } else toast.error(resultUpdate.message);
      } else {
        toast.error('Employee not found');
      }
      setOpen(false);
    } catch {
      toast.error(`${action === 'edit' ? 'Update' : 'Create'} Employee failed`);
    }
    setDisableBtn(false);
  };

  const deleteLaborContract = (data) => {
    setOpenDeleteConfirm(true);
    setContractModalData(data);
  };

  const onConfirmDelete = async (data) => {
    try {
      const deleteResult = await deleteContractApi(data.pkey);
      setOpenDeleteConfirm(false);
      if (deleteResult.isSuccess) {
        fetchLaborContract();
        toast.success('Delete department successfully');
      } else {
        toast.error(deleteResult.message);
      }
    } catch {
      toast.error('Delete Department failed');
    }
  };

  const fetchLaborContract = async () => {
    const getContractData = await getContractByEmployeeApi(rowData.employeeId);
    setContractData(getContractData);
  };

  const handleOpenLaborContract = async () => {
    await fetchLaborContract();
    setOpenLaborContract(true);
  };

  const handleTermination = async () => {
    // await fetchLaborContract();
    setOpenTermination(true);
  };

  const validationSchema = Yup.object({
    employeeId: Yup.string()
      .required('Profile Code is required')
      .matches(/^[A-Za-z0-9]{4,20}$/, 'Profile Code must be more than 2 characters and less than 20 characters'),

    enNameFirst: Yup.string().required('Profile English Name is required').max(255, 'Profile Name cannot be longer than 255 characters'),

    vnNameFirst: Yup.string()
      .required('Profile Vietnamese Name is required')
      .max(255, 'Vietnamese Name cannot be longer than 255 characters'),
    comId: Yup.string().required('Company ID is required').max(10, 'Company ID cannot be longer than 10 characters')
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: '100%', position: 'relative' }}>
        <MainCard
          contentSX={{ p: 1.5 }}
          sx={{
            height: {
              xs: 'calc(80vh - 60px)',
              xl: 'calc(80vh - 20px)'
            },
            overflowY: 'auto'
          }}
        >
          <Formik
            initialValues={{
              employeeId: rowData?.employeeId || '',
              vnNameFirst: rowData?.vnNameFirst || '',
              vnNameLast: rowData?.vnNameLast || '',
              enNameFirst: rowData?.enNameFirst || '',
              enNameLast: rowData?.enNameLast || '',
              comId: rowData?.comId || '',
              locId: rowData?.locId || '',
              depId: rowData?.depId || '',
              secId: rowData?.secId || '',
              funcId: rowData?.funcId || '',
              posId: rowData?.posId || '',
              costCenter: rowData?.costCenter || '',
              jobType: rowData?.jobType || '',
              ctractType: rowData?.ctractType || '',
              empType: rowData?.empType || 'C',
              laborNo: rowData?.laborNo || '',
              ctractNo: rowData?.ctractNo || '',
              ctractDate: rowData?.ctractDate || '',
              ctractExp: rowData?.ctractExp || '',
              laborDate: rowData?.laborDate || '',
              joinDateState: rowData?.joinDateState || '',
              recruitmentStatus: rowData?.recruitmentStatus || '',
              probation: rowData?.probation || 0,
              probTo: rowData?.probTo || '',
              probFrom: rowData?.probFrom || '',
              probRem: rowData?.probRem || '',
              joinDate: rowData?.joinDate || '',
              proximity: rowData?.proximity || '',
              reportTo: rowData?.reportTo || ''
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              setDisableBtn(true);
              onAction(values);
            }}
          >
            {({ values, handleChange, errors, touched, setFieldValue }) => (
              <Form id="profile-form" style={{ width: '100%' }}>
                <MainCard sx={{ mt: 1 }} contentSX={{ p: 1.5 }}>
                  <Grid container columnSpacing={2} alignItems="center" sx={{ width: '100%' }}>
                    <Grid container size={{ xs: 8, md: 9 }}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Grid container columnSpacing={2} size={{ xs: 12 }}>
                          <Grid size={{ xs: 4 }}>
                            <TextField
                              label=""
                              variant="outlined"
                              value={values.empType}
                              name="empType"
                              sx={{
                                marginBottom: 2,
                                '& .MuiInputBase-input': {
                                  color: 'blue'
                                }
                              }}
                              slotProps={{
                                inputLabel: { shrink: true }
                              }}
                              size="small"
                            />
                          </Grid>

                          <Grid size={{ xs: 8 }}>
                            <TextField
                              disabled={action === 'edit' ? true : false}
                              fullWidth
                              label="Employee ID"
                              variant="outlined"
                              value={values.employeeId}
                              onChange={handleChange}
                              name="employeeId"
                              error={touched.employeeId && !!errors.employeeId}
                              helperText={touched.employeeId && errors.employeeId}
                              sx={{
                                marginBottom: 2,
                                '& .MuiInputBase-input': {
                                  color: 'blue'
                                }
                              }}
                              slotProps={{
                                inputLabel: { shrink: true }
                              }}
                              size="small"
                            />
                          </Grid>
                        </Grid>

                        <TextField
                          fullWidth
                          label="Vietnamese First Name"
                          variant="outlined"
                          value={values.vnNameFirst}
                          onChange={(e) => {
                            setFieldValue('enNameFirst', e.target.value);
                            handleChange(e);
                          }}
                          name="vnNameFirst"
                          error={touched.vnNameFirst && !!errors.vnNameFirst}
                          helperText={touched.vnNameFirst && errors.vnNameFirst}
                          sx={{
                            marginBottom: 2,
                            '& .MuiInputBase-input': {
                              color: '#5900b3'
                            }
                          }}
                          slotProps={{
                            inputLabel: { shrink: true }
                          }}
                          size="small"
                        />

                        <TextField
                          fullWidth
                          label="English First Name"
                          variant="outlined"
                          value={values.enNameFirst}
                          onChange={handleChange}
                          name="enNameFirst"
                          error={touched.enNameFirst && !!errors.enNameFirst}
                          helperText={touched.enNameFirst && errors.enNameFirst}
                          sx={{
                            marginBottom: 2,
                            '& .MuiInputBase-input': {
                              color: '#5900b3'
                            }
                          }}
                          slotProps={{
                            inputLabel: { shrink: true }
                          }}
                          size="small"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="ID Card"
                          variant="outlined"
                          value={values.proximity}
                          onChange={handleChange}
                          name="proximity"
                          error={touched.proximity && !!errors.proximity}
                          helperText={touched.proximity && errors.proximity}
                          sx={{
                            marginBottom: 2,
                            '& .MuiInputBase-input': {
                              color: 'blue'
                            }
                          }}
                          slotProps={{
                            inputLabel: { shrink: true }
                          }}
                          size="small"
                        />

                        <TextField
                          fullWidth
                          label="Vietnamese Last Name"
                          variant="outlined"
                          value={values.vnNameLast}
                          onChange={(e) => {
                            setFieldValue('enNameLast', e.target.value);
                            handleChange(e);
                          }}
                          name="vnNameLast"
                          error={touched.vnNameLast && !!errors.vnNameLast}
                          helperText={touched.vnNameLast && errors.vnNameLast}
                          sx={{
                            marginBottom: 2,
                            '& .MuiInputBase-input': {
                              color: '#5900b3'
                            }
                          }}
                          slotProps={{
                            inputLabel: { shrink: true }
                          }}
                          size="small"
                        />

                        <TextField
                          fullWidth
                          label="English Last Name"
                          variant="outlined"
                          value={values.enNameLast}
                          onChange={handleChange}
                          name="enNameLast"
                          error={touched.enNameLast && !!errors.enNameLast}
                          helperText={touched.enNameLast && errors.enNameLast}
                          sx={{
                            marginBottom: 2,
                            '& .MuiInputBase-input': {
                              color: '#5900b3'
                            }
                          }}
                          slotProps={{
                            inputLabel: { shrink: true }
                          }}
                          size="small"
                        />
                      </Grid>
                      <Grid container columnSpacing={2} size={{ xs: 12, md: 12 }}>
                        <Grid size={{ xs: 3 }}>
                          <Typography align="right">English Full Name</Typography>
                        </Grid>
                        <Grid size={{ xs: 9 }}>
                          <Typography sx={{ paddingLeft: 2, color: 'blue' }}>
                            {values.enNameFirst} {values.enNameLast}
                          </Typography>
                        </Grid>

                        <Grid size={{ xs: 3 }}>
                          <Typography align="right">Vietnamese Full Name</Typography>
                        </Grid>
                        <Grid size={{ xs: 9 }}>
                          <Typography sx={{ paddingLeft: 2, color: 'blue' }}>
                            {values.vnNameFirst} {values.vnNameLast}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid size={{ xs: 4, md: 3 }} display="flex" justifyContent="center">
                      <Box
                        sx={{
                          minWidth: '150px',
                          aspectRatio: '3 / 4',
                          backgroundColor: '#ccc'
                        }}
                      >
                        {/* Ảnh hoặc nội dung */}
                      </Box>
                    </Grid>
                  </Grid>
                </MainCard>
                <MainCard sx={{ mt: 1 }} contentSX={{ p: 1.5 }}>
                  <Grid container columnSpacing={2} sx={{ width: '100%' }}>
                    <Grid container spacing={2} size={{ xs: 6, md: 6 }}>
                      <MainCard sx={{ padding: 0 }} contentSX={{ p: 1.5 }}>
                        <Grid container spacing={2} alignItems="center" sx={{ width: '100%' }}>
                          <Grid size={{ xs: 12, md: 12 }}>
                            <FormikAutocomplete
                              name="comId"
                              options={companyData}
                              getOptionLabel={(option) => option.name || ''}
                              onChange={(event, newValue) => {
                                const departmentFilter = departmentData.filter((i) => i.comId === newValue?.id);
                                const sectionFilter = sectionData.filter((i) => i.comId === newValue?.id && i.depId === values?.depId);
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
                              onChange={(event, newValue) => {
                                const sectionFilter = sectionData.filter((i) => i.comId === values?.comId && i.depId === newValue?.id);
                                setSectionFilterData(sectionFilter);
                                setFieldValue('depId', newValue?.id || '');
                              }}
                              label="Department"
                              renderOption={(props, option, state, { selected }) => (
                                <li {...props} key={`${option.id}-${state.index}`}>
                                  {option.enName}
                                </li>
                              )}
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
                              }}
                              inputHeight="34.5px"
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
                              name="costCenter"
                              options={costCenterData}
                              getOptionLabel={(option) => `[${option.code}] - ${option.description}` || ''}
                              label="Cost Center"
                              renderOption={(props, option, { selected }) => (
                                <li {...props} key={option.id}>
                                  [{option.code}] - {option.description}
                                </li>
                              )}
                              inputHeight="34.5px"
                            />
                          </Grid>
                          <Grid size={{ xs: 12, md: 12 }}>
                            <FormikAutocomplete
                              name="reportTo"
                              options={positionFilter}
                              // getOptionLabel={(option) => option.enName || ''}
                              getOptionLabel={(option) => `${option.id} - ${option.enName}` || ''}
                              label="Report To"
                              renderOption={(props, option, { selected }) => (
                                <li {...props} key={option.id}>
                                  {option.id} - {option.enName}
                                </li>
                              )}
                              inputHeight="34.5px"
                            />
                          </Grid>
                          <Grid size={{ xs: 12, md: 12 }}>
                            <FormControl fullWidth>
                              <Box
                                sx={{
                                  position: 'relative',
                                  border: '1px solid #c4c4c4',
                                  borderRadius: '5px',
                                  padding: '0px 16px 0px 16px' // thêm padding-top để có chỗ cho label
                                }}
                              >
                                <FormLabel
                                  component="legend"
                                  sx={{
                                    position: 'absolute',
                                    top: '-10px',
                                    left: '12px',
                                    backgroundColor: '#fff',
                                    paddingX: '4px',
                                    fontSize: '0.75rem',
                                    color: '#595959'
                                  }}
                                >
                                  Employee Type
                                </FormLabel>

                                <RadioGroup row name="empType" value={values.empType} onChange={handleChange}>
                                  <FormControlLabel value="P" control={<Radio size="small" />} label="Permanent" />
                                  <FormControlLabel value="C" control={<Radio size="small" />} label="Contractual" />
                                </RadioGroup>
                              </Box>
                            </FormControl>
                          </Grid>
                          <Grid size={{ xs: 12, md: 12 }}>
                            <FormikAutocomplete
                              name="jobType"
                              options={jobTypeData}
                              filedName={'code'}
                              getOptionLabel={(option) => `${option.code} - ${option.name}` || ''}
                              label="Job Type"
                              renderOption={(props, option, { selected }) => (
                                <li {...props} key={option.id}>
                                  {option.code} - {option.name}
                                </li>
                              )}
                              onChange={(event, newValue) => {
                                setFieldValue('jobType', newValue?.code || '');
                              }}
                              inputHeight="34.5px"
                            />
                          </Grid>
                        </Grid>
                      </MainCard>
                    </Grid>
                    <Grid size={{ xs: 6, md: 6 }}>
                      <MainCard contentSX={{ p: 1.5 }}>
                        <MainCard contentSX={{ p: 1.5 }}>
                          <Grid container spacing={2} alignItems="center" sx={{ width: '100%' }}>
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
                              aria-label="basic tabs example"
                            >
                              <Tab
                                label="Labor Contract"
                                sx={{
                                  backgroundColor: tabValue === 0 ? '#f0f0f0' : 'transparent',
                                  '&:hover': {
                                    backgroundColor: tabValue === 0 ? '#e0e0e0' : 'transparent'
                                  },
                                  transition: 'background-color 0.3s ease'
                                }}
                              />
                              <Tab
                                label="Labor Book"
                                sx={{
                                  backgroundColor: tabValue === 1 ? '#f0f0f0' : 'transparent',
                                  '&:hover': {
                                    backgroundColor: tabValue === 1 ? '#e0e0e0' : 'transparent'
                                  },
                                  transition: 'background-color 0.3s ease'
                                }}
                              />
                            </Tabs>
                            <CommonTabPanel value={tabValue} index={0}>
                              <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                  <Grid container spacing={2}>
                                    <Grid size={{ xs: 3 }}>
                                      <TextField
                                        label="No."
                                        variant="outlined"
                                        value={values.empType}
                                        name="empType"
                                        slotProps={{
                                          inputLabel: { shrink: true }
                                        }}
                                        size="small"
                                      />
                                    </Grid>
                                    <Grid size={{ xs: 9 }}>
                                      <TextField
                                        fullWidth
                                        label="Contract No"
                                        variant="outlined"
                                        value={values.ctractNo}
                                        onChange={handleChange}
                                        name="ctractNo"
                                        error={touched.ctractNo && !!errors.ctractNo}
                                        helperText={touched.ctractNo && errors.ctractNo}
                                        slotProps={{
                                          inputLabel: { shrink: true }
                                        }}
                                        size="small"
                                      />
                                    </Grid>
                                  </Grid>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                  <FormikAutocomplete
                                    name="ctractType"
                                    options={contractTypeData}
                                    getOptionLabel={(option) => option.name || ''}
                                    label="Type"
                                    onChange={(event, newValue) => {
                                      setFieldValue('ctractType', Number(newValue?.id) || '');
                                      if (values.ctractDate) {
                                        const extendDate = dayjs(values.ctractDate);
                                        const newExpireDate = extendDate.add(newValue.period, 'month').toISOString();
                                        setFieldValue('ctractExp', newExpireDate);
                                      }
                                    }}
                                    inputHeight="34.5px"
                                  />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                  <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                      <DatePicker
                                        label="From"
                                        value={values.ctractDate ? dayjs(values.ctractDate) : null}
                                        onChange={(date) => {
                                          setFieldValue('ctractDate', date ? date.toISOString() : '');
                                          if (date) {
                                            const ctractData = contractTypeData.find((i) => i.id === values.ctractType);
                                            const extendDate = dayjs(date);
                                            const newExpireDate = extendDate.add(ctractData.period, 'month').toISOString();
                                            setFieldValue('ctractExp', newExpireDate);
                                          }
                                        }}
                                        slotProps={{
                                          textField: {
                                            fullWidth: true,
                                            size: 'small',
                                            InputLabelProps: { shrink: true }
                                          }
                                        }}
                                        maxDate={values.ex}
                                      />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                      <DatePicker
                                        label="Expired"
                                        value={values.ctractExp ? dayjs(values.ctractExp) : null}
                                        onChange={(date) => {
                                          setFieldValue('ctractExp', date ? date.toISOString() : '');
                                        }}
                                        slotProps={{
                                          textField: {
                                            fullWidth: true,
                                            size: 'small',
                                            InputLabelProps: { shrink: true }
                                          }
                                        }}
                                        minDate={values.ctractDate ? dayjs(values.ctractDate) : undefined}
                                      />
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </CommonTabPanel>
                            <CommonTabPanel value={tabValue} index={1}>
                              <Grid container spacing={2}>
                                <Grid size={{ xs: 12 }}>
                                  <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                      <TextField
                                        fullWidth
                                        label="Labor Book No."
                                        variant="outlined"
                                        value={values.laborNo}
                                        onChange={handleChange}
                                        name="laborNo"
                                        error={touched.laborNo && !!errors.laborNo}
                                        helperText={touched.laborNo && errors.laborNo}
                                        slotProps={{
                                          inputLabel: { shrink: true },
                                          height: '34.5px'
                                        }}
                                        size="small"
                                      />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                      <DatePicker
                                        label="Issued Date"
                                        value={values.laborDate ? dayjs(values.laborDate) : null}
                                        onChange={(date) => {
                                          setFieldValue('laborDate', date ? date.toISOString() : '');
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
                                  </Grid>
                                </Grid>
                              </Grid>
                            </CommonTabPanel>
                          </Grid>
                        </MainCard>
                        <Grid container justifyContent="right" alignItems="center" sx={{ pt: 1, pr: 1 }}>
                          <Box
                            sx={{
                              cursor: action !== 'edit' ? 'not-allowed' : 'pointer',
                              pointerEvents: action !== 'edit' ? 'none' : 'auto'
                            }}
                            display="flex"
                            alignItems="center"
                            onClick={() => handleOpenLaborContract()}
                          >
                            <FontAwesomeIcon size="lg" icon={faFileContract} style={{ paddingRight: 10 }} />
                            <Typography variant="body1" color="primary">
                              Labor Contract
                            </Typography>
                          </Box>
                        </Grid>
                        <MainCard sx={{ mt: 1 }} contentSX={{ p: 1.5 }}>
                          <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
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
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                              <DatePicker
                                label="Join Date"
                                value={values.joinDate ? dayjs(values.joinDate) : null}
                                onChange={(date) => {
                                  setFieldValue('joinDate', date ? date.toISOString() : '');
                                }}
                                slotProps={{
                                  textField: {
                                    fullWidth: true,
                                    size: 'small',
                                    InputLabelProps: { shrink: true }
                                  }
                                }}
                                minDate={values.joinDateState ? dayjs(values.joinDateState) : undefined}
                              />
                            </Grid>
                            <Grid size={12}>
                              <FormikAutocomplete
                                name="recruitmentStatus"
                                options={recuitmentStatus}
                                getOptionLabel={(option) => option.name || ''}
                                label="Recuitment Status"
                                onChange={(event, newValue) => {
                                  setFieldValue('recruitmentStatus', newValue.id || '');
                                }}
                                inputHeight="34.5px"
                              />
                            </Grid>
                            <Grid container spacing={2} alignItems="center" justifyContent="center">
                              <Grid size={{ xs: 12, md: 5 }}>
                                <FormGroup>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        size="small"
                                        checked={values.probation === 1}
                                        onChange={(e) => {
                                          setFieldValue('probation', e.target.checked ? 1 : 0);
                                        }}
                                      />
                                    }
                                    label="Probation"
                                    sx={{ marginLeft: 1, color: '#000066', fontWeight: 'bold' }}
                                  />
                                </FormGroup>
                              </Grid>
                              <Grid container spacing={2} size={{ xs: 12, md: 7 }}>
                                <Grid size={{ xs: 12 }}>
                                  <DatePicker
                                    label="From"
                                    value={values.probFrom ? dayjs(values.probFrom) : null}
                                    onChange={(date) => {
                                      setFieldValue('probFrom', date ? date.toISOString() : '');
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
                                <Grid size={12}>
                                  <DatePicker
                                    label="To"
                                    value={values.probTo ? dayjs(values.probTo) : null}
                                    onChange={(date) => {
                                      setFieldValue('probTo', date ? date.toISOString() : '');
                                    }}
                                    slotProps={{
                                      textField: {
                                        fullWidth: true,
                                        size: 'small',
                                        InputLabelProps: { shrink: true }
                                      }
                                    }}
                                    minDate={values.probFrom ? dayjs(values.probFrom) : undefined}
                                  />
                                </Grid>
                              </Grid>
                              <Grid size={12}>
                                <TextField
                                  fullWidth
                                  label="Remark"
                                  variant="outlined"
                                  value={values.probRem}
                                  onChange={handleChange}
                                  name="probRem"
                                  error={touched.probRem && !!errors.probRem}
                                  helperText={touched.probRem && errors.probRem}
                                  sx={{ marginBottom: 2 }}
                                  slotProps={{
                                    inputLabel: { shrink: true }
                                  }}
                                  size="small"
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        </MainCard>
                        <Grid container alignItems="center" sx={{ pt: 1, pr: 1 }}>
                          <Grid size={{ xs: 6, md: 6 }}></Grid>
                          <Grid size={{ xs: 6, md: 6 }}>
                            <Box
                              display="flex"
                              justifyContent="right"
                              alignItems="center"
                              sx={{ cursor: 'pointer' }}
                              onClick={() => handleTermination()}
                            >
                              <FontAwesomeIcon size="lg" icon={faFileContract} style={{ paddingRight: 10 }} />
                              <Typography variant="body1" color="primary">
                                Termination
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </MainCard>
                    </Grid>
                  </Grid>
                </MainCard>
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
        <Button form="profile-form" disabled={disableBtn} type="submit" variant="contained" sx={{ width: 80, height: 30 }}>
          {action === 'edit' ? 'Update' : 'Create'}
        </Button>
        <Button onClick={() => handleClose()} variant="outlined" sx={{ width: 80, height: 30 }}>
          Cancel
        </Button>
      </Box>
      <LaborContractModal
        open={openLaborContract}
        setOpen={setOpenLaborContract}
        data={contractData}
        setOpenModal={setOpenLaborActionContract}
        setActionModal={setActionModal}
        contractTypeData={contractTypeData}
        setContractModalData={setContractModalData}
        deleteLaborContract={deleteLaborContract}
      ></LaborContractModal>
      <LaborContractActionModal
        open={openLaborActionContract}
        setOpen={setOpenLaborActionContract}
        rowData={contractModalData}
        onAction={onActionModal}
        action={actionModal}
        contractTypeData={contractTypeData}
      ></LaborContractActionModal>
      <LaborContractDeleteConfirm
        open={openDeleteConfirm}
        setOpen={setOpenDeleteConfirm}
        onConfirm={onConfirmDelete}
        data={contractModalData}
      ></LaborContractDeleteConfirm>
      <TerminationModal
        open={openTermination}
        setOpen={setOpenTermination}
        rowData={rowData}
        terminationReason={terminationReason}
      ></TerminationModal>
    </LocalizationProvider>
  );
};

export default Profile;
