import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  FormControlLabel,
  TextField,
  RadioGroup,
  Radio,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl
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
import { formatNumber, parseNumber } from 'utils/convert-money';
import { Field } from 'formik';
import FormTextFieldShrink from '../../common/form-text-field-shrink';
import CommonDatePicker from '../../common/common-date-picker';
import FormikAutocomplete from '../../common/formik-autocomplete';

const WorkHistory = ({
  action,
  onClose,
  rowData,
  companyData,
  locationData,
  departmentData,
  sectionData,
  functionData,
  positionData,
  jobTypeData,
  worklevelData,
  otherListNData
}) => {
  const [disableBtn, setDisableBtn] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState('recruitment');
  const [positionFilter, setPositionFilter] = useState([]);
  const [departmentFilterData, setDepartmentFilterData] = useState([]);
  const [sectionFilterData, setSectionFilterData] = useState([]);

  const workStatusList = otherListNData.filter((i) => i.type === 'WORK_STATUS');

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

  const validationSchema = Yup.object({
    issuedDate: Yup.date().nullable().required('Issued Date is required'),
    effectDate: Yup.date().nullable().required('Effective Date is required'),
    appliedBy: Yup.string().required('Applied By is required').max(100, 'Applied By must be at most 100 characters'),
    company: Yup.string().required('Company is required').max(100, 'Company must be at most 100 characters'),
    location: Yup.string().required('Location is required').max(100, 'Location must be at most 100 characters'),
    department: Yup.string().required('Department is required').max(100, 'Department must be at most 100 characters'),
    section: Yup.string().required('Section is required').max(100, 'Section must be at most 100 characters'),
    function: Yup.string().required('Function is required').max(100, 'Function must be at most 100 characters'),
    position: Yup.string().required('Position is required').max(100, 'Position must be at most 100 characters'),
    costCenter: Yup.string().required('Cost Center is required').max(100, 'Cost Center must be at most 100 characters'),
    jobType: Yup.string().required('Job Type is required').max(100, 'Job Type must be at most 100 characters')
  });

  const data = [
    {
      movement: 'recruitment',
      issuedDate: '05/05/2011',
      effectDate: '05/05/2011',
      appliedBy: 'Applied By',
      company: 'CTY MINH PHAT'
    }
  ];

  const handleCancel = () => {
    setDisableBtn(true);
    onClose();
  };

  const handleClose = () => {
    setDisableBtn(true);
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const formattedValues = {
        workHistory: {
          issuedDate: values.issuedDate,
          effectDate: values.effectDate,
          appliedBy: values.appliedBy,
          comId: rowData?.comId || '',
          locId: rowData?.locId || '',
          depId: rowData?.depId || '',
          secId: rowData?.secId || '',
          funcId: rowData?.funcId || '',
          posId: rowData?.posId || '',
          costCenter: rowData?.costCenter || '',
          jobType: rowData?.jobType || ''
        }
      };


      toast.success(action === 'edit' ? 'Cập nhật lịch sử công việc thành công!' : 'Tạo lịch sử công việc thành công!');
      resetForm();
      onClose();
    } catch (error) {
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại!');
    }
  };

  const keptByOptions = [
    { id: 1, name: 'Nguyễn Văn A' },
    { id: 2, name: 'Trần Thị B' },
    { id: 3, name: 'Phạm Văn C' }
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: '100%', position: 'relative', p: 2 }}>
        <MainCard sx={{ height: 'calc(80vh)', overflowY: 'auto' }}>
          <Formik
            initialValues={{
              issuedDate: rowData.issuedDate || '',
              effectDate: rowData.effectDate || '',
              appliedBy: rowData.appliedBy || '',
              comId: rowData?.comId || '',
              locId: rowData?.locId || '',
              depId: rowData?.depId || '',
              secId: rowData?.secId || '',
              funcId: rowData?.funcId || '',
              posId: rowData?.posId || '',
              jobType: rowData?.jobType || '',
              costCenter: rowData?.costCenter || ''
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange, errors, touched, setFieldValue }) => (
              <Form id="cv-form" style={{ width: '100%' }}>
                <Grid container size={{ xs: 12 }}>
                  <Grid size={{ xs: 12 }}>
                    <Grid size={{ xs: 12 }}>
                      <MainCard contentSX={{ p: 1.5 }}>
                        <Grid container spacing={2}>
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
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 5 }}>
                        <MainCard contentSX={{ p: 1.5 }}>
                          <Grid container spacing={2}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                              Movement
                            </Typography>
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
                      <Grid size={{ xs: 12, md: 5 }}>
                        <MainCard contentSX={{ p: 1.5 }}>
                          <Grid container spacing={2}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                              New Finance
                            </Typography>
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

                            {/* <Grid size={{ xs: 12 }}>
                                <FormikAutocomplete
                                  name="varpayRange"
                                  filedName="name"
                                  options={workRangeList}
                                  label="Variable Pay Range"
                                  getOptionLabel={(option) => option.name || ''}
                                />
                              </Grid> */}
                          </Grid>
                        </MainCard>
                      </Grid>
                      <Grid size={{ xs: 12, md: 2 }}>
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
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </MainCard>
        <Box sx={{ position: 'absolute', bottom: -20, right: 25, display: 'flex', gap: 2, marginTop: 1 }}>
          <Button form="cv-form" disabled={disableBtn} type="submit" variant="contained" sx={{ width: 80, height: 30 }}>
            {action === 'edit' ? 'Update' : 'Create'}
          </Button>
          <Button onClick={handleClose} variant="outlined" sx={{ width: 80, height: 30 }}>
            Cancel
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default WorkHistory;
