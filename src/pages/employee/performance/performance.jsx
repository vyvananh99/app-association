import React, { useState, useEffect } from 'react';
import { Box, Typography, FormControlLabel, TextField, FormGroup, Checkbox, Button, Grid, Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import MainCard from 'components/MainCard';
import FormikAutocomplete from '../../common/formik-autocomplete';
import DescriptionIcon from '@mui/icons-material/Description';
import { getPerformanceApi, createPerformanceApi, updatePerformanceApi } from 'api/performance.api';
import DevPlanModal from './dev-plan/dev-plan-modal';

const Performance = ({ action, onClose, rowData, otherListData, otherListNData }) => {
  const [disableBtn, setDisableBtn] = useState(false);
  const [openDevPlan, setOpenDevPlan] = useState(false);
  const [year, setYear] = useState(dayjs().year());
  const [performanceData, setPerformanceData] = useState({});

  const validationSchema = Yup.object({
    year: Yup.string().required('Year is required')
    // busiAchieved: Yup.string().required('VP for Business Targets is required'),
    // personAchieved: Yup.string().required('VP for Personal Targets is required'),
    // varpayRate: Yup.string().required('Total Variable Pay is required'),
    // induRate: Yup.string(),
    // performGrade: Yup.object().nullable().required('Performance Grade is required'),
    // nthRate: Yup.string(),
    // hplist: Yup.object().nullable(),
    // effectDate: Yup.string().required('Effective Date is required'),
    // comments: Yup.string(),
    // proCompleted: Yup.boolean(),
    // comCompleted: Yup.boolean()
  });

  const performGrade = otherListData.filter((i) => i.type === 'PER_GRADE');
  const hplist = otherListData.filter((i) => i.type === 'HPLIST');
  const approachList = otherListData.filter((i) => i.type === 'APPROACH');
  const developSkillList = otherListData.filter((i) => i.type === 'DEVELOP_SKILL');
  const devArchievedList = otherListNData.filter((i) => i.type === 'DEV_ARCHIEVED');
  
  useEffect(() => {
    if (rowData?.employeeId) {
      fetchPerformanceData(year);
    }
  }, [rowData?.employeeId]);

  const fetchPerformanceData = async (year) => {
    try {
      const employeeId = rowData.employeeId;
      const comId = rowData.comId;
      const getPerformanceData = await getPerformanceApi(employeeId, comId, year);
      if (getPerformanceData?.data) {
        setPerformanceData(getPerformanceData.data);
      } else {
        setPerformanceData({ year });
      }
    } catch (error) {
      toast.error('Failed to fetch Performance');
    }
  };

  const onAction = async (data) => {
    try {
      const employeeId = rowData.employeeId;
      const comId = rowData.comId;
      const funcId = rowData.funcId;
      const posId = rowData.posId;
      const locId = rowData.locId;
      const depId = rowData.depId;
      const secId = rowData.secId;
      const newData = Object.assign({}, data, { employeeId, comId, funcId, posId, locId, depId, secId });
      const cleanData = {
        ...newData,
        varpayRate: newData.varpayRate === '' ? null : Number(newData.varpayRate),
        induRate: newData.induRate === '' ? null : Number(newData.induRate),
        nthRate: newData.nthRate === '' ? null : Number(newData.nthRate),
        busiAchieved: newData.busiAchieved === '' ? null : Number(newData.busiAchieved),
        personAchieved: newData.personAchieved === '' ? null : Number(newData.personAchieved)
      };
      if (performanceData.pkey) {
        const resultUpdate = await updatePerformanceApi(cleanData, performanceData.pkey);
        if (resultUpdate.isSuccess) {
          toast.success('Update performance successfully');
          fetchPerformanceData(year);
        } else toast.error(resultUpdate.message);
      } else {
        const resultCreate = await createPerformanceApi(cleanData);
        if (resultCreate.isSuccess) {
          toast.success('Create performance successfully');
          fetchPerformanceData(year);
        } else toast.error(resultCreate.message);
      }
    } catch {
      toast.error(`Update insurance failed`);
    }
    setDisableBtn(false);
  };

  const handleOpenDevPlan = () => {
    setOpenDevPlan(true);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: '100%', position: 'relative' }}>
        <MainCard
          sx={{
            flex: 1,
            overflowY: 'auto',
            height: {
              xs: 'calc(80vh - 60px)',
              xl: 'calc(80vh - 20px)'
            }
          }}
        >
          <Formik
            enableReinitialize
            initialValues={{
              year: performanceData.year || dayjs().year(),
              busiAchieved: performanceData.busiAchieved || '',
              personAchieved: performanceData.personAchieved || '',
              varpayRate: performanceData.varpayRate || '',
              induRate: performanceData.induRate || '',
              performGrade: performanceData.performGrade || '',
              nthRate: performanceData.nthRate || '',
              hplist: performanceData.hplist || '',
              effectDate: performanceData.effectDate || '',
              comments: performanceData.comments || '',
              proCompleted: performanceData.proCompleted || 0,
              comCompleted: performanceData.comCompleted || 0
            }}
            validationSchema={validationSchema}
            onSubmit={onAction}
          >
            {({ values, handleChange, errors, touched, setFieldValue }) => (
              <Form id="profile-form" style={{ width: '100%' }}>
                <MainCard sx={{ mt: 1 }} contentSX={{ p: 2 }}>
                  <Grid container spacing={2} justifyContent="center">
                    <Grid size={{ xs: 12, md: 4 }}>
                      <DatePicker
                        label="Year"
                        views={['year']}
                        value={values.year ? dayjs(`${values.year}-01-01`) : null}
                        onChange={async (date) => {
                          const selectedYear = date ? date.year() : '';
                          setFieldValue('year', selectedYear);
                          setYear(selectedYear);
                          fetchPerformanceData(selectedYear);
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: 'small',
                            InputLabelProps: { shrink: true },
                            error: touched.year && !!errors.year,
                            helperText: touched.year && errors.year
                          }
                        }}
                        minDate={dayjs('1900-01-01')}
                        maxDate={dayjs(`${dayjs().year()}-01-01`)}
                      />
                    </Grid>
                  </Grid>
                </MainCard>
                <MainCard sx={{ mt: 2 }} contentSX={{ p: 2 }}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <TextField
                        type="number"
                        fullWidth
                        label="VP for Business Targets Achieved (% of Annual NTH)"
                        name="busiAchieved"
                        value={values.busiAchieved}
                        onChange={handleChange}
                        error={touched.busiAchieved && !!errors.busiAchieved}
                        helperText={touched.busiAchieved && errors.busiAchieved}
                        slotProps={{ inputLabel: { shrink: true } }}
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <TextField
                        type="number"
                        fullWidth
                        label="VP for Personal Targets Achieved (% of Annual NTH)"
                        name="personAchieved"
                        value={values.personAchieved}
                        onChange={handleChange}
                        error={touched.personAchieved && !!errors.personAchieved}
                        helperText={touched.personAchieved && errors.personAchieved}
                        slotProps={{ inputLabel: { shrink: true } }}
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <TextField
                        type="number"
                        fullWidth
                        label="Total Variable Pay (% of Annual NTH)"
                        name="varpayRate"
                        value={values.varpayRate}
                        onChange={handleChange}
                        error={touched.varpayRate && !!errors.varpayRate}
                        helperText={touched.varpayRate && errors.varpayRate}
                        slotProps={{ inputLabel: { shrink: true } }}
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <TextField
                        type="number"
                        fullWidth
                        label="Individual Recognition (% of Annual NTH)"
                        name="induRate"
                        value={values.induRate}
                        onChange={handleChange}
                        error={touched.induRate && !!errors.induRate}
                        helperText={touched.induRate && errors.induRate}
                        slotProps={{ inputLabel: { shrink: true } }}
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <FormikAutocomplete
                        name="performGrade"
                        filedName="name"
                        options={performGrade}
                        getOptionLabel={(option) => option.name || ''}
                        label="Performance Grade"
                      />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <TextField
                        type="number"
                        fullWidth
                        label="NTH Increase"
                        name="nthRate"
                        value={values.nthRate}
                        onChange={handleChange}
                        error={touched.nthRate && !!errors.nthRate}
                        helperText={touched.nthRate && errors.nthRate}
                        slotProps={{ inputLabel: { shrink: true } }}
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <FormikAutocomplete
                        name="hplist"
                        filedName="name"
                        options={hplist}
                        getOptionLabel={(option) => option.name || ''}
                        label="HP List"
                      />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <DatePicker
                        label="Effective Date"
                        value={values.effectDate ? dayjs(values.effectDate) : null}
                        onChange={(date) => setFieldValue('effectDate', date ? date.toISOString() : '')}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: 'small',
                            error: touched.effectDate && !!errors.effectDate,
                            helperText: touched.effectDate && errors.effectDate,
                            InputLabelProps: { shrink: true }
                          }
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Overall Comments"
                        name="comments"
                        value={values.comments}
                        onChange={handleChange}
                        error={touched.comments && !!errors.comments}
                        helperText={touched.comments && errors.comments}
                        slotProps={{ inputLabel: { shrink: true } }}
                        size="small"
                        multiline
                        rows={2}
                      />
                    </Grid>
                  </Grid>
                  <Grid size={{ md: 8, sx: 12 }} sx={{ pt: 3 }}>
                    <FormGroup row sx={{ justifyContent: 'center' }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={!!values.proCompleted}
                            onChange={(e) => {
                              setFieldValue('proCompleted', e.target.checked ? 1 : 0);
                            }}
                            name="proCompleted"
                          />
                        }
                        label="Professional Skill Profile Completed"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={!!values.comCompleted}
                            onChange={(e) => {
                              setFieldValue('comCompleted', e.target.checked ? 1 : 0);
                            }}
                            name="comCompleted"
                          />
                        }
                        label="Competency Skill Profile Completed"
                      />
                    </FormGroup>
                  </Grid>
                </MainCard>
                <MainCard sx={{ mt: 2 }} contentSX={{ p: 2 }}>
                  <Grid container spacing={6} justifyContent="center">
                    <Grid>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <DescriptionIcon />
                        <Typography variant="body1">Business Targets</Typography>
                      </Stack>
                    </Grid>
                    <Grid>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <DescriptionIcon />
                        <Typography variant="body1">Personal Targets</Typography>
                      </Stack>
                    </Grid>
                    <Grid>
                      <Stack onClick={() => handleOpenDevPlan()} direction="row" spacing={1} alignItems="center">
                        <DescriptionIcon />
                        <Typography variant="body1">Development Plan</Typography>
                      </Stack>
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
          {performanceData.pkey ? 'Update' : 'Create'}
        </Button>
        <Button onClick={onClose} variant="outlined" sx={{ width: 80, height: 30 }}>
          Cancel
        </Button>
      </Box>
      <DevPlanModal
        open={openDevPlan}
        setOpen={setOpenDevPlan}
        rowData={rowData}
        approachList={approachList}
        developSkillList={developSkillList}
        devArchievedList={devArchievedList}
      ></DevPlanModal>
    </LocalizationProvider>
  );
};

export default Performance;
