import React, { useEffect, useState } from 'react';
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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import MainCard from 'components/MainCard';
import FormikAutocomplete from '../../common/formik-autocomplete';
import CloseIcon from '@mui/icons-material/Close';
import CommonDatePicker from '../../common/common-date-picker';
import FormTextFieldShrink from '../../common/form-text-field-shrink';
import { formatNumber, parseNumber } from 'utils/convert-money';

const WorkingHistoryModal = ({
  open,
  setOpen,
  data,
  companyData,
  locationData,
  departmentData,
  sectionData,
  functionData,
  positionData,
  jobTypeData,
  otherListNData,
  otherListData
}) => {
  const [disableBtn, setDisableBtn] = useState(false);
  const [positionFilter, setPositionFilter] = useState([]);
  const [departmentFilterData, setDepartmentFilterData] = useState([]);
  const [sectionFilterData, setSectionFilterData] = useState([]);

  const varpayRangeList = otherListData.filter((i) => i.type === 'VARPAY_RANGE');
  const workStatusList = otherListNData.filter((i) => i.type === 'WORK_STATUS');
  const validationSchema = Yup.object({
    effectiveDate: Yup.date().required('Effective Date is required'),
    forLevel: Yup.string().required('Level is required')
  });

  useEffect(() => {
    if (!open) setDisableBtn(false);
  }, [open]);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    let filterDepData = departmentData;
    let filterSecData = sectionData;
    let filterPosData = positionData;
    if (data?.comId) {
      filterDepData = departmentData.filter((i) => i.comId === data?.comId);
      filterSecData = sectionData.filter((i) => i.comId === data?.comId);
    }
    if (data?.depId) {
      filterSecData = filterDepData.filter((i) => i.depId === data?.depId);
    }
    if (data?.funcId) {
      filterPosData = positionData.filter((i) => i.funcId === data?.funcId);
    }
    setDepartmentFilterData(filterDepData);
    setSectionFilterData(filterSecData);
    setPositionFilter(filterPosData);
  }, [data]);

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
            maxWidth: '90vw', // You can adjust max width as per your needs
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
            Working History Info
          </Typography>
          <Formik
            initialValues={{
              employeeId: data?.employeeId || '',
              issuedDate: data?.issuedDate || '',
              effectDate: data?.effectDate || '',
              appliedBy: data?.appliedBy || '',
              comId: data?.comId || '',
              locId: data?.locId || '',
              depId: data?.depId || '',
              secId: data?.secId || '',
              funcId: data?.funcId || '',
              posId: data?.posId || '',
              jobType: data?.jobType || '',
              workLevel: data?.workLevel || '',
              basic: data?.basic || 0,
              grossSal: data?.grossSal || 0,
              mgtAllow: data?.mgtAllow || 0,
              totalBase: data?.totalBase || 0,
              nth: data?.nth || 0,
              payPoint: data?.payPoint || 0,
              anTotalNth: data?.anTotalNth || 0,
              varpayRange: data?.varpayRange || '',
              workStatus: data?.workStatus || 3
            }}
            validationSchema={validationSchema}
          >
            {({ values, handleChange, errors, touched, setFieldValue }) => (
              <Form style={{ width: '100%' }}>
                <Grid
                  container
                  sx={{
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    marginBottom: 5,
                    paddingTop: 1
                  }}
                >
                  <Grid size={{ xs: 12 }}>
                    <Grid size={{ xs: 12 }}>
                      <MainCard contentSX={{ p: 1.5 }} sx={{ mb: 2 }}>
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 4 }}>
                            <Field name="issuedDate" component={CommonDatePicker} label="Issued Date" disabled />
                          </Grid>
                          <Grid size={{ xs: 4 }}>
                            <Field
                              name="effectDate"
                              component={CommonDatePicker}
                              label="Effective Date"
                              minDate={values.issuedDate ? dayjs(values.issuedDate) : undefined}
                              disabled
                            />
                          </Grid>
                          <Grid size={{ xs: 4 }}>
                            <Field
                              name="appliedBy"
                              component={FormTextFieldShrink}
                              label="Applied By"
                              variant="outlined"
                              inputHeight="37px"
                              disabled
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
                                disabled
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 12 }}>
                              <FormikAutocomplete
                                name="locId"
                                options={locationData}
                                getOptionLabel={(option) => option.enName || ''}
                                label="Location"
                                inputHeight="34.5px"
                                disabled
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
                                disabled
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 12 }}>
                              <FormikAutocomplete
                                name="secId"
                                options={sectionFilterData}
                                getOptionLabel={(option) => option.enName || ''}
                                label="Section"
                                inputHeight="34.5px"
                                disabled
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
                                disabled
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
                                disabled
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
                                disabled
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
                                disabled
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
                                disabled
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
                                disabled
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
                              />
                            </Grid>
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
                              sx={{ flexDirection: 'column' }}
                            >
                              {workStatusList.map((i) => {
                                return <FormControlLabel key={i.id} value={i.id} control={<Radio disabled />} label={i.name} />;
                              })}
                            </RadioGroup>
                            {touched.workStatus && errors.workStatus && <FormHelperText>{errors.workStatus}</FormHelperText>}
                          </FormControl>
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
                  <Button onClick={() => handleClose()} variant="outlined" sx={{ width: 80, height: 30 }}>
                    Close
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

export default WorkingHistoryModal;
