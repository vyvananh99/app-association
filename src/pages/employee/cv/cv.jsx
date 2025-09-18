import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Tabs, Tab, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileContract } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import MainCard from 'components/MainCard';
import FormikAutocomplete from '../../common/formik-autocomplete';
import CommonTabPanel from '../../common/common-tab-panel';
import { updateEmployeeCvApi, createEmployeeCvApi } from 'api/employee-cv.api';
import FamilyModal from './family/family-modal';
import { getEmployeeCvApi } from 'api/employee-cv.api';

const CV = ({ setOpen, otherListNData, otherListData, provinceData, cityData, rowData }) => {
  const [disableBtn, setDisableBtn] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [idTab, setIdTab] = useState(0);
  const [openModalFamily, setOpenModalFamily] = useState(false);
  const [employeeCvData, setEmployeeCvData] = useState([]);

  const validationSchema = Yup.object({
    email: Yup.string().email('Email address is required'),
    gender: Yup.number().required('Gender is required')
  });
  const genderList = otherListNData.filter((i) => i.type === 'GENDER');
  const nationalityList = otherListData.filter((i) => i.type === 'NATIONALITY');
  const religionList = otherListData.filter((i) => i.type === 'RELIGION');
  const maritalStatusList = otherListData.filter((i) => i.type === 'MARITAL');
  const educationList = otherListData.filter((i) => i.type === 'EDUCATION');
  const relationshipList = otherListData.filter((i) => i.type === 'RELATION'); 
  const handleClose = () => {
    setOpen(false);
    setDisableBtn(true);
  };

  useEffect(() => {
    if (rowData?.employeeId && rowData.comId) fetchEmployeeData(rowData.employeeId, rowData.comId);
  }, [rowData?.employeeId]);

  const fetchEmployeeData = async (employeeId, comId) => {
    try {
      const employeeCvDataApi = await getEmployeeCvApi(employeeId, comId);
      setEmployeeCvData(employeeCvDataApi.data);
    } catch (error) {
      toast.error('Failed to fetch Employee');
    }
  };

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChangeTabId = (event, newValue) => {
    setIdTab(newValue);
  };

  const onAction = async (data) => {
    try {
      const employeeId = rowData.employeeId;
      const comId = rowData.comId;
      const newData = Object.assign(data, { employeeId, comId });
      if (employeeId && comId && employeeCvData.employeeId) {
        const resultUpdate = await updateEmployeeCvApi(employeeId, comId, newData);
        if (resultUpdate.isSuccess) toast.success('Update Employee CV successfully');
        else toast.error(resultUpdate.message);
      } else {
        const resultCreate = await createEmployeeCvApi(newData);
        if (resultCreate.isSuccess) toast.success('Update Employee CV successfully');
        else toast.error(resultCreate.message);
      }
    } catch {
      toast.error(`Update Employee CV failed`);
    }
    setDisableBtn(false);
  };

  const handleOpenFamily = () => {
    setOpenModalFamily(true);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: '100%', position: 'relative' }}>
        <MainCard
          sx={{
            height: {
              xs: 'calc(80vh - 60px)',
              xl: 'calc(80vh - 20px)'
            },
            overflowY: 'auto'
          }}
        >
          <Formik
            enableReinitialize
            initialValues={{
              birthPlace: employeeCvData.birthPlace || '',
              originPlace: employeeCvData.originPlace || '',
              children: employeeCvData.children || '',
              pager: employeeCvData.pager || '',
              mobile: employeeCvData.mobile || '',
              email: employeeCvData.email || '',
              drawerNo: employeeCvData.drawerNo || '',
              birthDate: employeeCvData.birthDate || '',
              gender: Number(employeeCvData.gender) || genderList[0].id,
              nationality: Number(employeeCvData.nationality) || '',
              religion: Number(employeeCvData.religion) || '',
              maritalStatus: Number(employeeCvData.maritalStatus) || '',
              education: Number(employeeCvData.education) || '',
              perCity: employeeCvData.perCity || '',
              perProvince: employeeCvData.perProvince || '', // Thêm vào initialValues
              perDistrict: employeeCvData.perDistrict || '',
              perAddress: employeeCvData.perAddress || '',
              perTel: employeeCvData.perTel || '',
              curProvince: employeeCvData.curProvince || '',
              curCity: employeeCvData.curCity || '',
              curDistrict: employeeCvData.curDistrict || '',
              curAddress: employeeCvData.curAddress || '',
              curTel: employeeCvData.curTel || '',
              traUnionId: employeeCvData.traUnionId || '',
              traUnionDate: employeeCvData.traUnionDate || '',
              traUnionPlace: employeeCvData.traUnionPlace || '',
              cTactWith: employeeCvData.cTactWith || '',
              cTactRelation: Number(employeeCvData.cTactRelation) || '',
              cTactAddress: employeeCvData.cTactAddress || '',
              cTactTel: employeeCvData.cTactTel || '',
              idNo: employeeCvData.idNo || '',
              idPlace: employeeCvData.idPlace || '',
              idDate: employeeCvData.idDate || '',
              passDate: employeeCvData.passDate || '',
              passExpire: employeeCvData.passExpire || '',
              passNo: employeeCvData.passNo || '',
              passPlace: employeeCvData.passPlace || ''
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              setDisableBtn(true);
              onAction(values);
            }}
          >
            {({ values, handleChange, errors, touched, setFieldValue, isSubmitting }) => (
              <Form id="cv-form" style={{ width: '100%' }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <MainCard sx={{ mt: 1 }} contentSX={{ p: 1.5 }}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                        Personal Information
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                          <DatePicker
                            label="Date of Birth"
                            value={values.birthDate ? dayjs(values.birthDate) : null}
                            onChange={(date) => {
                              setFieldValue('birthDate', date ? date.toISOString() : '');
                            }}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                size: 'small',
                                InputLabelProps: { shrink: true },
                                error: touched.birthDate && !!errors.birthDate,
                                helperText: touched.birthDate && errors.birthDate
                              }
                            }}
                            maxDate={dayjs()}
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <TextField
                            fullWidth
                            label="Place of Birth"
                            variant="outlined"
                            name="birthPlace"
                            value={values.birthPlace}
                            onChange={handleChange}
                            error={touched.birthPlace && !!errors.birthPlace}
                            helperText={touched.birthPlace && errors.birthPlace}
                            slotProps={{
                              inputLabel: { shrink: true }
                            }}
                            size="small"
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <TextField
                            fullWidth
                            label="Plate of Origin"
                            variant="outlined"
                            name="originPlace"
                            value={values.originPlace}
                            onChange={handleChange}
                            error={touched.originPlace && !!errors.originPlace}
                            helperText={touched.originPlace && errors.originPlace}
                            slotProps={{
                              inputLabel: { shrink: true }
                            }}
                            size="small"
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <FormikAutocomplete
                            name="gender"
                            options={genderList}
                            getOptionLabel={(option) => option.name || ''}
                            label="Gender (M=1)"
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <FormikAutocomplete
                            name="nationality"
                            filedName="pkey"
                            options={nationalityList}
                            getOptionLabel={(option) => option.name || ''}
                            label="Nationality"
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <FormikAutocomplete
                            name="religion"
                            filedName="pkey"
                            options={religionList}
                            getOptionLabel={(option) => option.name || ''}
                            label="Religion"
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <FormikAutocomplete
                            name="maritalStatus"
                            filedName="pkey"
                            options={maritalStatusList}
                            getOptionLabel={(option) => option.name || ''}
                            label="Marital Status"
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <TextField
                            fullWidth
                            label="No of Children"
                            variant="outlined"
                            name="children"
                            value={values.children}
                            onChange={handleChange}
                            error={touched.children && !!errors.children}
                            helperText={touched.children && errors.children}
                            slotProps={{
                              inputLabel: { shrink: true }
                            }}
                            size="small"
                            type="number"
                            onBlur={() => { 
                              const numValue = parseInt(values.children, 10);
                              setFieldValue('children', isNaN(numValue) ? '' : numValue);
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <FormikAutocomplete
                            name="education"
                            filedName="pkey"
                            options={educationList}
                            getOptionLabel={(option) => option.name || ''}
                            label="Education"
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <TextField
                            fullWidth
                            label="Pager"
                            variant="outlined"
                            name="pager"
                            value={values.pager}
                            onChange={handleChange}
                            error={touched.pager && !!errors.pager}
                            helperText={touched.pager && errors.pager}
                            slotProps={{
                              inputLabel: { shrink: true }
                            }}
                            size="small"
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <TextField
                            fullWidth
                            label="Mobile Phone"
                            variant="outlined"
                            name="mobile"
                            value={values.mobile}
                            onChange={handleChange}
                            error={touched.mobile && !!errors.mobile}
                            helperText={touched.mobile && errors.mobile}
                            slotProps={{
                              inputLabel: { shrink: true }
                            }}
                            size="small"
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <TextField
                            fullWidth
                            label="Email Address"
                            variant="outlined"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            error={touched.email && !!errors.email}
                            helperText={touched.email && errors.email}
                            slotProps={{
                              inputLabel: { shrink: true }
                            }}
                            size="small"
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <TextField
                            fullWidth
                            label="Drawer No"
                            variant="outlined"
                            name="drawerNo"
                            value={values.drawerNo}
                            onChange={handleChange}
                            error={touched.drawerNo && !!errors.drawerNo}
                            helperText={touched.drawerNo && errors.drawerNo}
                            slotProps={{
                              inputLabel: { shrink: true }
                            }}
                            size="small"
                          />
                        </Grid>
                      </Grid>
                    </MainCard>
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
                        value={idTab}
                        onChange={handleChangeTabId}
                        aria-label="id tabs"
                      >
                        <Tab
                          label="ID"
                          sx={{
                            backgroundColor: idTab === 0 ? '#f0f0f0' : 'transparent',
                            '&:hover': {
                              backgroundColor: idTab === 0 ? '#e0e0e0' : 'transparent'
                            },
                            transition: 'background-color 0.3s ease'
                          }}
                        />
                        <Tab
                          label="Passport"
                          sx={{
                            backgroundColor: idTab === 1 ? '#f0f0f0' : 'transparent',
                            '&:hover': {
                              backgroundColor: idTab === 1 ? '#e0e0e0' : 'transparent'
                            },
                            transition: 'background-color 0.3s ease'
                          }}
                        />
                      </Tabs>
                      <CommonTabPanel value={idTab} index={0}>
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 12 }}>
                            <TextField
                              fullWidth
                              label="No."
                              variant="outlined"
                              name="idNo"
                              value={values.idNo}
                              onChange={handleChange}
                              error={touched.idNo && !!errors.idNo}
                              helperText={touched.idNo && errors.idNo}
                              slotProps={{
                                inputLabel: { shrink: true }
                              }}
                              size="small"
                            />
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <DatePicker
                              label="Issued Date"
                              value={values.idDate ? dayjs(values.idDate) : null}
                              onChange={(date) => {
                                setFieldValue('idDate', date ? date.toISOString() : '');
                              }}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  size: 'small',
                                  InputLabelProps: { shrink: true },
                                  error: touched.idDate && !!errors.idDate,
                                  helperText: touched.idDate && errors.idDate
                                }
                              }}
                              maxDate={dayjs()}
                            />
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <TextField
                              fullWidth
                              label="Issued Place"
                              variant="outlined"
                              name="idPlace"
                              value={values.idPlace}
                              onChange={handleChange}
                              error={touched.idPlace && !!errors.idPlace}
                              helperText={touched.idPlace && errors.idPlace}
                              slotProps={{
                                inputLabel: { shrink: true }
                              }}
                              size="small"
                            />
                          </Grid>
                        </Grid>
                      </CommonTabPanel>
                      <CommonTabPanel value={idTab} index={1}>
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 12 }}>
                            <TextField
                              fullWidth
                              label="No."
                              variant="outlined"
                              name="passNo"
                              value={values.passNo}
                              onChange={handleChange}
                              error={touched.passNo && !!errors.passNo}
                              helperText={touched.passNo && errors.passNo}
                              slotProps={{
                                inputLabel: { shrink: true }
                              }}
                              size="small"
                            />
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <DatePicker
                              label="Issued Date"
                              value={values.passDate ? dayjs(values.passDate) : null}
                              onChange={(date) => {
                                setFieldValue('passDate', date ? date.toISOString() : '');
                              }}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  size: 'small',
                                  InputLabelProps: { shrink: true },
                                  error: touched.passDate && !!errors.passDate,
                                  helperText: touched.passDate && errors.passDate
                                }
                              }}
                              maxDate={dayjs()}
                            />
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <DatePicker
                              label="Expired Date"
                              value={values.passExpire ? dayjs(values.passExpire) : null}
                              onChange={(date) => {
                                setFieldValue('passExpire', date ? date.toISOString() : '');
                              }}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  size: 'small',
                                  InputLabelProps: { shrink: true },
                                  error: touched.passExpire && !!errors.passExpire,
                                  helperText: touched.passExpire && errors.passExpire
                                }
                              }}
                            />
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <TextField
                              fullWidth
                              label="Issued Place"
                              variant="outlined"
                              name="passPlace"
                              value={values.passPlace}
                              onChange={handleChange}
                              error={touched.passPlace && !!errors.passPlace}
                              helperText={touched.passPlace && errors.passPlace}
                              slotProps={{
                                inputLabel: { shrink: true }
                              }}
                              size="small"
                            />
                          </Grid>
                        </Grid>
                      </CommonTabPanel>
                    </MainCard>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
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
                            '&:hover': {
                              backgroundColor: tabValue === 0 ? '#e0e0e0' : 'transparent'
                            },
                            transition: 'background-color 0.3s ease'
                          }}
                        />
                        <Tab
                          label="Current Address"
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
                          <Grid size={{ xs: 12 }}>
                            <TextField
                              fullWidth
                              label="Address"
                              variant="outlined"
                              name="perAddress"
                              value={values.perAddress}
                              onChange={handleChange}
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
                              onChange={handleChange}
                              error={touched.perDistrict && !!errors.perDistrict}
                              helperText={touched.perDistrict && errors.perDistrict}
                              slotProps={{
                                inputLabel: { shrink: true }
                              }}
                              size="small"
                            />
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <FormikAutocomplete
                              name="perCity"
                              options={cityData}
                              getOptionLabel={(option) => option.vnName || ''}
                              label="City"
                            />
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <FormikAutocomplete
                              name="perProvince"
                              options={provinceData}
                              getOptionLabel={(option) => option.vnName || ''}
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
                              onChange={handleChange}
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
                              onChange={handleChange}
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
                              onChange={handleChange}
                              error={touched.curDistrict && !!errors.curDistrict}
                              helperText={touched.curDistrict && errors.curDistrict}
                              slotProps={{
                                inputLabel: { shrink: true }
                              }}
                              size="small"
                            />
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <FormikAutocomplete
                              name="curCity"
                              options={cityData}
                              getOptionLabel={(option) => option.vnName || ''}
                              label="City"
                            />
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <FormikAutocomplete
                              name="curProvince"
                              options={provinceData}
                              getOptionLabel={(option) => option.vnName || ''}
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
                              onChange={handleChange}
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
                    <MainCard sx={{ mt: 2 }} contentSX={{ p: 1.5 }}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                        Trade Union
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                          <TextField
                            fullWidth
                            label="No"
                            variant="outlined"
                            name="traUnionId"
                            value={values.traUnionId}
                            onChange={handleChange}
                            error={touched.traUnionId && !!errors.traUnionId}
                            helperText={touched.traUnionId && errors.traUnionId}
                            slotProps={{
                              inputLabel: { shrink: true }
                            }}
                            size="small"
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <DatePicker
                            label="Issued Date"
                            value={values.traUnionDate ? dayjs(values.traUnionDate) : null}
                            onChange={(date) => {
                              setFieldValue('traUnionDate', date ? date.toISOString() : '');
                            }}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                size: 'small',
                                InputLabelProps: { shrink: true },
                                error: touched.traUnionDate && !!errors.traUnionDate,
                                helperText: touched.traUnionDate && errors.traUnionDate
                              }
                            }}
                            maxDate={dayjs()}
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <TextField
                            fullWidth
                            label="Issued Place"
                            variant="outlined"
                            name="traUnionPlace"
                            value={values.traUnionPlace}
                            onChange={handleChange}
                            error={touched.traUnionPlace && !!errors.traUnionPlace}
                            helperText={touched.traUnionPlace && errors.traUnionPlace}
                            slotProps={{
                              inputLabel: { shrink: true }
                            }}
                            size="small"
                          />
                        </Grid>
                      </Grid>
                    </MainCard>
                    <MainCard sx={{ mt: 2 }} contentSX={{ p: 1.5 }}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                        Emergency Contact
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                          <TextField
                            fullWidth
                            label="Name"
                            variant="outlined"
                            name="cTactWith"
                            value={values.cTactWith}
                            onChange={handleChange}
                            error={touched.cTactWith && !!errors.cTactWith}
                            helperText={touched.cTactWith && errors.cTactWith}
                            slotProps={{
                              inputLabel: { shrink: true }
                            }}
                            size="small"
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <FormikAutocomplete
                            name="cTactRelation"
                            filedName="pkey"
                            options={relationshipList}
                            getOptionLabel={(option) => option.name || ''}
                            label="Relationship"
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <TextField
                            fullWidth
                            label="Address"
                            variant="outlined"
                            name="cTactAddress"
                            value={values.cTactAddress}
                            onChange={handleChange}
                            error={touched.cTactAddress && !!errors.cTactAddress}
                            helperText={touched.cTactAddress && errors.cTactAddress}
                            slotProps={{
                              inputLabel: { shrink: true }
                            }}
                            size="small"
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <TextField
                            fullWidth
                            label="Telephone"
                            variant="outlined"
                            name="cTactTel"
                            value={values.cTactTel}
                            onChange={handleChange}
                            error={touched.cTactTel && !!errors.cTactTel}
                            helperText={touched.cTactTel && errors.cTactTel}
                            slotProps={{
                              inputLabel: { shrink: true }
                            }}
                            size="small"
                          />
                        </Grid>
                      </Grid>
                    </MainCard>
                    <Grid container justifyContent="flex-end" alignItems="center" sx={{ pt: 3, pr: 3 }}>
                      <Grid onClick={handleOpenFamily} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <FontAwesomeIcon icon={faFileContract} style={{ marginRight: 8 }} size="lg" />
                        <Typography variant="body1" color="primary">
                          Family Members
                        </Typography>
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
        <Button form="cv-form" disabled={disableBtn} type="submit" variant="contained" sx={{ width: 80, height: 30 }}>
          Update
        </Button>
        <Button onClick={handleClose} variant="outlined" sx={{ width: 80, height: 30 }}>
          Cancel
        </Button>
      </Box>
      <FamilyModal
        open={openModalFamily}
        setOpen={setOpenModalFamily}
        rowData={rowData}
        genderList={genderList}
        relationshipList={relationshipList}
      ></FamilyModal>
    </LocalizationProvider>
  );
};

export default CV;
