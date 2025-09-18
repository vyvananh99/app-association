import React, { useEffect, useState } from 'react';
import { Box, Typography, FormControl, FormControlLabel, TextField, RadioGroup, Radio, Button, Stack } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import MainCard from 'components/MainCard';
import FormikAutocomplete from '../../common/formik-autocomplete';
import { updateEmployeeApi } from 'api/employee.api';
import { faFileContract } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ComLoanModal from './com-loan/com-loan-modal';
import AllowanceModal from './allowance/allowance-modal';
import ProvisionModal from './provision/provision-modal';
import { formatNumber, parseNumber } from 'utils/convert-money';
import FormTextFieldShrink from '../../common/form-text-field-shrink';
import { getProvisionApi } from 'api/provision.api';
import { getComLoanApi } from 'api/com-loan.api';
import { getAllowanceByEmployeeApi } from 'api/allowance.api';
import { getAllowTypeApi } from 'api/allow-type.api';
import { calcIncomTax } from 'api/function-db.api';
import dayjs from 'dayjs';

const Remuneration = ({ setOpen, onClose, rowData, fetchData, otherListData, otherListNData }) => {
  const [disableBtn, setDisableBtn] = useState(false);
  const [openComLoan, setOpenComLoan] = useState(false);
  const [companyProvision, setCompanyProvision] = useState(false);
  const [provisionData, setProvisionData] = useState({});
  const [comLoanData, setComLoanData] = useState({});
  const [allowanceData, setAllowanceData] = useState([]);
  const [allowanceDaily, setAllowanceDaily] = useState();
  const [loanPayment, setLoanPayment] = useState('');
  const [openAllowance, setOpenAllowance] = useState(false);
  const [allowTypeData, setAllowTypeData] = useState([]);

  const validationSchema = Yup.object({
    // payBy: Yup.string().required('Salary type is required'),
    // varpayRange: Yup.object().nullable().required('Work level is required'),
    // annualLeave: Yup.number().min(0, 'Annual leave cannot be negative').required('Annual leave is required'),
    // basic: Yup.number().min(0, 'Basic salary cannot be negative').required('Basic salary is required'),
    // grossSal: Yup.number().min(0, 'grossSal salary cannot be negative').required('grossSal salary is required'),
    // mgtAllow: Yup.number().min(0, 'Management allowance cannot be negative').required('Management allowance is required'),
    // totalBase: Yup.number().min(0, 'Total base cannot be negative').required('Total base is required'),
    // nth: Yup.number().min(0, 'NTH cannot be negative').required('NTH is required'),
    // payPoint: Yup.number().min(0, 'Pay point cannot be negative').required('Pay point is required'),
    // anTotalNth: Yup.number().min(0, 'Annual total NTH cannot be negative').required('Annual total NTH is required'),
    // variablePayRange: Yup.string().nullable(),
    // dailyAllow: Yup.number().min(0, 'Lumpsum daily allowances cannot be negative').required('Lumpsum daily allowances is required'),
    // monthlyAllow: Yup.number().min(0, 'Lumpsum monthly allowances cannot be negative').required('Lumpsum monthly allowances is required'),
    // monthlyLoanPayment: Yup.number()
    //   .min(0, 'Lumpsum monthly loan payment cannot be negative')
    //   .required('Lumpsum monthly loan payment is required'),
    // monthlyLoan: Yup.number()
    //   .min(0, 'Lumpsum monthly loan payback cannot be negative')
    //   .required('Lumpsum monthly loan payback is required'),
    // bank: Yup.string().max(255, 'Bank name cannot be longer than 255 characters').required('Bank name is required'),
    // accountNo: Yup.string()
    //   .matches(/^[0-9]{8,20}$/, 'Account number must be 8-20 digits')
    //   .required('Account number is required')
  });

  const handleClose = () => {
    setDisableBtn(true);
    setOpen(false);
    if (onClose) onClose();
  };

  useEffect(() => {
    if (rowData?.employeeId) {
      fetchProvisionData();
      fetchComLoanData();
      fetchAllowanceData();
      fetchAllowTypeData();
    }
  }, [rowData?.employeeId]);

  const fetchProvisionData = async () => {
    try {
      const employeeId = rowData.employeeId;
      if (!employeeId) return;
      const getProvisionData = await getProvisionApi(employeeId);
      setProvisionData(getProvisionData.data || []);
    } catch (error) {
      toast.error('Failed to fetch Provision');
    }
  };

  const fetchComLoanData = async () => {
    try {
      const employeeId = rowData.employeeId;
      if (!employeeId) return;
      const getComLoanData = await getComLoanApi(employeeId);
      setComLoanData(getComLoanData.data || []);
      const comLoanTotal = getComLoanData.data
        .filter((item) => {
          if (!item.endDate) return true;
          return new Date(item.endDate) < dayjs().toDate();
        })
        .reduce((sum, item) => sum + (item.amount || 0), 0);
      setLoanPayment(comLoanTotal);
    } catch (error) {
      toast.error('Failed to fetch ComLoan');
    }
  };

  const fetchAllowanceData = async () => {
    try {
      const employeeId = rowData.employeeId;
      if (!employeeId) return;
      const getAllowanceData = await getAllowanceByEmployeeApi(employeeId);
      setAllowanceData(getAllowanceData.data || []);
      if (getAllowanceData.data && getAllowanceData.data.length > 0) {
        const totalPay = getAllowanceData.data.reduce((sum, item) => sum + (item.pay || 0), 0);
        setAllowanceDaily(totalPay);
      }
    } catch (error) {
      toast.error('Failed to fetch ComLoan');
    }
  };

  const fetchAllowTypeData = async () => {
    try {
      const getAllowanceData = await getAllowTypeApi();
      setAllowTypeData(getAllowanceData || []);
    } catch (error) {
      toast.error('Failed to fetch allow type');
    }
  };

  const workLevelList = [
    { id: '01', name: 'TIME' },
    { id: '02', name: 'SP' }
  ];
  const varpayRangeList = otherListData.filter((i) => i.type === 'VARPAY_RANGE');

  const onAction = async (data) => {
    try {
      const employeeId = rowData.employeeId;
      const comId = rowData.comId;
      let newData = Object.assign({}, data, { employeeId, comId });
      if (newData.varpayRange) newData.varpayRange.toString();
      const resultUpdate = await updateEmployeeApi(newData, employeeId, comId, rowData.pkey);
      if (resultUpdate.isSuccess) {
        toast.success('Update remuneration successfully');
        fetchData();
      } else toast.error(resultUpdate.message);
    } catch (err) {
      toast.error(`Update remuneration failed`);
    }
    setDisableBtn(false);
  };

  const handleOpenCompanyLoan = () => {
    setOpenComLoan(true);
  };

  const handleOpenCompanyProvision = () => {
    setCompanyProvision(true);
  };

  const handleOpenAllowance = () => {
    setOpenAllowance(true);
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
            initialValues={{
              payBy: rowData.payBy || 'N',
              workLevel: rowData.workLevel || '',
              varpayRange: Number(rowData.varpayRange) || null,
              annualLeave: rowData.annualLeave || '',
              basic: rowData.basic || '',
              grossSal: rowData.grossSal || '',
              mgtAllow: rowData.mgtAllow || '',
              totalBase: rowData.totalBase || '',
              nth: rowData.nth || '',
              payPoint: rowData.payPoint || '',
              anTotalNth: rowData.anTotalNth || '',
              dailyAllow: rowData.dailyAllow || Number(allowanceDaily) || 0,
              monthlyAllow: rowData.monthlyAllow || Number(allowanceDaily * 30) || 0,
              monthlyLoanPayment: rowData.monthlyLoanPayment || Number(loanPayment) || 0,
              monthlyLoan: rowData.monthlyLoan || '',
              bank: rowData.bank || '',
              accountNo: rowData.accountNo || ''
            }}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={(values) => {
              onAction(values);
            }}
          >
            {({ values, handleChange, errors, touched, setFieldValue, isSubmitting }) => (
              <Form id="remuneration-form" style={{ width: '100%' }}>
                <Grid container spacing={2}>
                  <MainCard contentSX={{ p: 1 }}>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 2 }}>
                        <MainCard sx={{ p: 2 }}>
                          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                            Pay By
                          </Typography>
                          <FormControl component="fieldset" fullWidth>
                            <RadioGroup
                              name="payBy"
                              value={values.payBy}
                              onChange={async (event) => {
                                const value = event.target.value;
                                setFieldValue('payBy', value);
                                let nth = Number(values.mgtAllow) + Number(values.basic);
                                if (value === 'N') {
                                  const getTax = await calcIncomTax(Number(values.basic));
                                  const tax = getTax.data || 0;
                                  let nth = Number(values.mgtAllow) + Number(values.basic) - tax;
                                }
                                setFieldValue('nth', nth);
                              }}
                              sx={{ flexDirection: 'row' }}
                            >
                              <FormControlLabel value="N" control={<Radio color="primary" />} label="Net" sx={{ mr: 3 }} />
                              <FormControlLabel value="G" control={<Radio color="primary" />} label="Goss" />
                            </RadioGroup>
                            {errors.payBy && touched.payBy && (
                              <Typography variant="caption" color="error">
                                {errors.payBy}
                              </Typography>
                            )}
                          </FormControl>
                        </MainCard>
                      </Grid>
                      <Grid size={{ xs: 12, md: 5 }}>
                        <MainCard contentSX={{ p: 1 }} sx={{ p: 2 }}>
                          <Grid container spacing={2}>
                            <Grid size={{ xs: 12 }}>
                              <FormikAutocomplete
                                name="workLevel"
                                options={workLevelList}
                                getOptionLabel={(option) => option.name || ''}
                                label="Work Level (Job Grade)"
                                inputHeight="34.5px"
                              />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <TextField
                                fullWidth
                                label="Annual Leave"
                                variant="outlined"
                                name="annualLeave"
                                value={values.annualLeave}
                                onChange={handleChange}
                                error={touched.annualLeave && !!errors.annualLeave}
                                helperText={touched.annualLeave && errors.annualLeave}
                                slotProps={{
                                  inputLabel: { shrink: true },
                                  height: '34.5px'
                                }}
                                size="small"
                                type="number"
                              />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <Field
                                name="basic"
                                formatNumber={formatNumber}
                                parseNumber={parseNumber}
                                debounceTime={2000}
                                onChange={async (value) => {
                                  let inputValue = value;
                                  inputValue = parseNumber(inputValue);
                                  setFieldValue('grossSal', inputValue);
                                  setFieldValue('totalBase', inputValue);
                                  if (values.payBy === 'G') {
                                    const nth = Number(inputValue) + Number(values.mgtAllow);
                                    setFieldValue('nth', nth);
                                    setFieldValue('anTotalNth', nth * 13);
                                  }
                                  setFieldValue('basic', inputValue);
                                }}
                                onDebouncedChange={async (inputValue) => {
                                  if (values.payBy === 'N' && Number(values.basic)) {
                                    const getTax = await calcIncomTax(Number(values.basic));
                                    const tax = getTax.data || 0;
                                    const nth = Number(inputValue) + Number(values.mgtAllow) - tax;
                                    setFieldValue('nth', nth);
                                    setFieldValue('anTotalNth', nth * 13);
                                  }
                                }}
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
                                debounceTime={2000}
                                onChange={(value) => {
                                  let inputValue = value;
                                  inputValue = parseNumber(inputValue);
                                  if (values.payBy === 'G') {
                                    const nth = Number(inputValue) + Number(values.basic);
                                    setFieldValue('nth', nth);
                                    setFieldValue('anTotalNth', nth * 13);
                                  }
                                  setFieldValue('mgtAllow', inputValue);
                                }}
                                onDebouncedChange={async (inputValue) => {
                                  if (values.payBy === 'N' && Number(inputValue)) {
                                    const getTax = await calcIncomTax(Number(values.basic));
                                    const tax = getTax.data || 0;
                                    const nth = Number(inputValue) + Number(values.basic) - tax;
                                    setFieldValue('nth', nth);
                                    setFieldValue('anTotalNth', nth * 13);
                                  }
                                }}
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
                      <Grid size={{ xs: 12, md: 5 }}>
                        <MainCard sx={{ p: 2 }} contentSX={{ p: 2 }}>
                          <Grid container spacing={2}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                              Allowances and Loans
                            </Typography>
                            <Grid size={{ xs: 12 }}>
                              <Field
                                name="dailyAllow"
                                label="Lumpsum Daily Allowances"
                                component={FormTextFieldShrink}
                                variant="outlined"
                                inputHeight="34.5px"
                                disabled
                              />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <Field
                                name="monthlyAllow"
                                label="Lumpsum Monthly Allowances"
                                component={FormTextFieldShrink}
                                variant="outlined"
                                inputHeight="34.5px"
                                disabled
                              />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <Field
                                name="monthlyLoanPayment"
                                label="Lumpsum Monthly Loan Payment"
                                component={FormTextFieldShrink}
                                variant="outlined"
                                inputHeight="34.5px"
                                disabled
                              />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <Field
                                name="monthlyLoan"
                                label="Lumpsum Monthly Loan Payback"
                                component={FormTextFieldShrink}
                                variant="outlined"
                                inputHeight="34.5px"
                                disabled
                              />
                            </Grid>
                          </Grid>
                        </MainCard>
                        <MainCard sx={{ mt: 3, p: 2, pb: 1 }} contentSX={{ p: 2 }}>
                          <Grid container spacing={2} sx={{ width: '100%' }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                              Payment Transaction
                            </Typography>
                            <Grid size={{ xs: 12 }}>
                              <Field
                                name="bank"
                                label="Bank Name"
                                component={FormTextFieldShrink}
                                variant="outlined"
                                inputHeight="34.5px"
                              />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <Field
                                name="accountNo"
                                label="Account No."
                                component={FormTextFieldShrink}
                                variant="outlined"
                                inputHeight="34.5px"
                              />
                            </Grid>
                          </Grid>
                        </MainCard>
                      </Grid>
                    </Grid>
                  </MainCard>
                </Grid>
              </Form>
            )}
          </Formik>
          <Grid container justifyContent="center" sx={{ pt: 3, pr: 1 }}>
            <Stack direction="row" spacing={10} justifyContent="center">
              <Box sx={{ cursor: 'pointer' }} display="flex" onClick={() => handleOpenAllowance()}>
                <FontAwesomeIcon size="lg" icon={faFileContract} style={{ paddingRight: 10 }} />
                <Typography variant="body1" color="primary">
                  Allowance
                </Typography>
              </Box>

              <Box sx={{ cursor: 'pointer' }} display="flex" onClick={() => handleOpenCompanyProvision()}>
                <FontAwesomeIcon size="lg" icon={faFileContract} style={{ paddingRight: 10 }} />
                <Typography variant="body1" color="primary">
                  Company Provision
                </Typography>
              </Box>

              <Box sx={{ cursor: 'pointer' }} display="flex" onClick={() => handleOpenCompanyLoan()}>
                <FontAwesomeIcon size="lg" icon={faFileContract} style={{ paddingRight: 10 }} />
                <Typography variant="body1" color="primary">
                  Company Loan
                </Typography>
              </Box>
            </Stack>
          </Grid>
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
        <Button form="remuneration-form" disabled={disableBtn} type="submit" variant="contained" sx={{ width: 80, height: 30 }}>
          Update
        </Button>
        <Button onClick={handleClose} variant="outlined" sx={{ width: 80, height: 30 }}>
          Cancel
        </Button>
      </Box>
      <ComLoanModal
        open={openComLoan}
        setOpen={setOpenComLoan}
        rowData={rowData}
        comLoanData={comLoanData}
        fetchComLoanData={fetchComLoanData}
      ></ComLoanModal>
      <ProvisionModal
        open={companyProvision}
        setOpen={setCompanyProvision}
        rowData={rowData}
        fetchProvisionData={fetchProvisionData}
        provisionData={provisionData}
      ></ProvisionModal>
      <AllowanceModal
        open={openAllowance}
        setOpen={setOpenAllowance}
        rowData={rowData}
        fetchAllowanceData={fetchAllowanceData}
        allowanceData={allowanceData}
        otherListNData={otherListNData}
        allowTypeData={allowTypeData}
      ></AllowanceModal>
    </LocalizationProvider>
  );
};

export default Remuneration;
