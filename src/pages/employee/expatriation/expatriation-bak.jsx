import React, { useEffect, useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  TextField,
  RadioGroup,
  FormLabel,
  Autocomplete,
  Radio,
  Tabs,
  Tab,
  FormGroup,
  Checkbox,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import MainCard from 'components/MainCard';
import FormikAutocomplete from '../../common/formik-autocomplete';
import CommonTabPanel from '../../common/common-tab-panel';
import { faFileContract } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const workLevelList = [
  { id: '1', name: 'Level 1' },
  { id: '2', name: 'Level 2' }
];

const initialTableData = [
  {
    id: 1,
    startDate: '2025-01-01',
    hostCountry: 'Việt Nam',
    company: 'Company A',
    position: 'Manager'
  },
  {
    id: 2,
    startDate: '2025-02-01',
    hostCountry: 'Mỹ',
    company: 'Company B',
    position: 'Engineer'
  }
];

const Expatriation = ({
  open,
  setOpen,
  onAction,
  rowData,
  action,
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
  const [tableData, setTableData] = useState(initialTableData);

  const handleClose = () => {
    setOpen(false);
    setDisableBtn(false);
  };

  const validationSchema = Yup.object({
    startDate: Yup.date().nullable().required('Start Date is required'),
    endDate: Yup.date().nullable().required('End Date153 is required'),
    hostCountry: Yup.string().required('Host Country is required'),
    company: Yup.string().required('Company is required'),
    position: Yup.string().required('Position is required'),
    workLevel: Yup.object().nullable().required('Work Level is required'),
    salaryHome: Yup.string().required('Salary From Home Country is required'),
    salaryHost: Yup.string().required('Salary From Host Country is required'),
    terms: Yup.string().required('Terms and Conditions is required'),
    remarks: Yup.string().required('Remarks is required')
  });

  const initialValues = {
    startDate: rowData?.startDate ? dayjs(rowData.startDate) : null,
    endDate: rowData?.endDate ? dayjs(rowData.endDate) : null,
    hostCountry: rowData?.hostCountry || '',
    company: rowData?.company || '',
    position: rowData?.position || '',
    workLevel: rowData?.workLevel || null,
    salaryHome: rowData?.salaryHome || '',
    salaryHost: rowData?.salaryHost || '',
    terms: rowData?.terms || '',
    remarks: rowData?.remarks || ''
  };

  const handleSubmit = (values, { setSubmitting }) => {
    const formattedValues = {
      ...values,
      startDate: values.startDate ? dayjs(values.startDate).toISOString() : null,
      endDate: values.endDate ? dayjs(values.endDate).toISOString() : null
    };
    onAction(formattedValues);
    toast.success('Form submitted successfully!');
    setSubmitting(false);
    setOpen(false);
  };

  const TableWrapper = TableContainer || Paper;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: '100%', position: 'relative', p: 2 }}>
        <MainCard sx={{ height: 'calc(80vh)', overflowY: 'auto' }}>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ values, handleChange, errors, touched, setFieldValue, isSubmitting }) => (
              <Form id="secondment-form" style={{ width: '100%' }}>
                <MainCard sx={{ mt: 1 }} contentSX={{ p: 1.5 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                    Expatriation Information
                  </Typography>
                  <Grid container columnSpacing={2} rowSpacing={2} sx={{ width: '100%' }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <DatePicker
                        label="Start Date"
                        value={values.startDate}
                        onChange={(date) => setFieldValue('startDate', date)}
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
                    <Grid size={{ xs: 12, md: 6 }}>
                      <DatePicker
                        label="End Date"
                        value={values.endDate}
                        onChange={(date) => setFieldValue('endDate', date)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: 'small',
                            InputLabelProps: { shrink: true },
                            error: touched.endDate && !!errors.endDate,
                            helperText: touched.endDate && errors.endDate
                          }
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Host Country"
                        variant="outlined"
                        name="hostCountry"
                        value={values.hostCountry}
                        onChange={handleChange}
                        error={touched.hostCountry && !!errors.hostCountry}
                        helperText={touched.hostCountry && errors.hostCountry}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Company"
                        variant="outlined"
                        name="company"
                        value={values.company}
                        onChange={handleChange}
                        error={touched.company && !!errors.company}
                        helperText={touched.company && errors.company}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Position"
                        variant="outlined"
                        name="position"
                        value={values.position}
                        onChange={handleChange}
                        error={touched.position && !!errors.position}
                        helperText={touched.position && errors.position}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormikAutocomplete
                        name="workLevel"
                        options={workLevelList}
                        getOptionLabel={(option) => option.name || ''}
                        label="Work Level"
                        value={values.workLevel}
                        onChange={(event, value) => setFieldValue('workLevel', value)}
                        error={touched.workLevel && !!errors.workLevel}
                        helperText={touched.workLevel && errors.workLevel}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Salary From Home Country"
                        variant="outlined"
                        name="salaryHome"
                        value={values.salaryHome}
                        onChange={handleChange}
                        error={touched.salaryHome && !!errors.salaryHome}
                        helperText={touched.salaryHome && errors.salaryHome}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Salary From Host Country"
                        variant="outlined"
                        name="salaryHost"
                        value={values.salaryHost}
                        onChange={handleChange}
                        error={touched.salaryHost && !!errors.salaryHost}
                        helperText={touched.salaryHost && errors.salaryHost}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Terms and Conditions"
                        variant="outlined"
                        name="terms"
                        value={values.terms}
                        onChange={handleChange}
                        error={touched.terms && !!errors.terms}
                        helperText={touched.terms && errors.terms}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Remarks"
                        variant="outlined"
                        name="remarks"
                        value={values.remarks}
                        onChange={handleChange}
                        error={touched.remarks && !!errors.remarks}
                        helperText={touched.remarks && errors.remarks}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </MainCard>
                <MainCard sx={{ mt: 2 }} contentSX={{ p: 1.5 }}>
                  <Box sx={{ width: '100%', p: 2 }}>
                    <TableWrapper component={Paper} sx={{ maxHeight: 300, overflow: 'auto' }}>
                      <Table stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Start Date</TableCell>
                            <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>End Date</TableCell>
                            <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Host Country</TableCell>
                            <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Company</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {tableData.map((row) => (
                            <TableRow
                              key={row.id}
                              sx={{
                                '&:nth-of-type(odd)': { backgroundColor: '#fff' },
                                '&:nth-of-type(even)': { backgroundColor: '#f9f9f9' }
                              }}
                            >
                              <TableCell>{row.startDate}</TableCell>
                              <TableCell>{row.hostCountry}</TableCell>
                              <TableCell>{row.company}</TableCell>
                              <TableCell>{row.position}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableWrapper>
                  </Box>
                </MainCard>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2, pr: 2 }}>
                  <Button form="secondment-form" disabled={isSubmitting} type="submit" variant="contained" sx={{ width: 80, height: 30 }}>
                    {action === 'edit' ? 'Update' : 'Create'}
                  </Button>
                  <Button onClick={handleClose} variant="outlined" sx={{ width: 80, height: 30 }}>
                    Cancel
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </MainCard>
      </Box>
    </LocalizationProvider>
  );
};

export default Expatriation;
