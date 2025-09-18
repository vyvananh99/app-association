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

const genderList = [
  { id: 1, name: 'Male' },
  { id: 2, name: 'Female' }
];

const Training = ({ action, onClose }) => {
  const [disableBtn, setDisableBtn] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState('recruitment');

  const validationSchema = Yup.object({
    courseCode: Yup.string().required('Mã khóa học là bắt buộc'),
    courseName: Yup.string().required('Tên khóa học là bắt buộc'),
    startDate: Yup.date().nullable().required('Ngày bắt đầu là bắt buộc'),
    country: Yup.string().required('Quốc gia là bắt buộc'),
    city: Yup.string().required('Thành phố là bắt buộc'),
    venue: Yup.string().required('Địa điểm là bắt buộc'),
    manday: Yup.number().required('Số ngày là bắt buộc').positive('Số ngày phải lớn hơn 0').integer('Số ngày phải là số nguyên'),
    costPerHead: Yup.number().required('Chi phí mỗi người là bắt buộc').positive('Chi phí mỗi người phải lớn hơn 0'),
    slot: Yup.number()
      .required('Số lượng chỗ là bắt buộc')
      .positive('Số lượng chỗ phải lớn hơn 0')
      .integer('Số lượng chỗ phải là số nguyên'),
    totalCost: Yup.number().required('Tổng chi phí là bắt buộc').positive('Tổng chi phí phải lớn hơn 0'),
    targetGroup: Yup.string().required('Nhóm mục tiêu là bắt buộc'),
    courseCategories: Yup.object().nullable().required('Danh mục khóa học là bắt buộc'),
    courseScope: Yup.object().nullable().required('Phạm vi khóa học là bắt buộc'),
    organizedBy: Yup.object().nullable().required('Đơn vị tổ chức là bắt buộc'),
    tutorsName: Yup.string().required('Tên giảng viên là bắt buộc')
  });

  const initialValues = {
    courseCode: '',
    courseName: '',
    startDate: null,
    country: '',
    city: '',
    venue: '',
    manday: '',
    costPerHead: '',
    slot: '',
    totalCost: '',
    targetGroup: '',
    courseCategories: null,
    courseScope: null,
    organizedBy: null,
    tutorsName: '',
    movementType: 'recruitment',
    ctractExp: null,
    placeOfBirth: '',
    tradeUnionNo: ''
  };

  const data = [
    {
      movement: 'recruitment',
      issuedDate: '05/05/2011',
      effectiveDate: '05/05/2011',
      appliedBy: 'Applied By',
      company: 'CTY MINH PHAT'
    },
    {
      movement: '111',
      issuedDate: '05/05/2011',
      effectiveDate: '05/05/2011',
      appliedBy: 'Applied By',
      company: 'C1T'
    }
  ];

  const handleCancel = () => {
    setDisableBtn(true);
    onClose();
  };

  const handleClose = () => {
    setDisableBtn(true);
  };

  const handleMovementChange = (event) => {
    setSelectedMovement(event.target.value);
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const payload = {
        courseCode: values.courseCode,
        courseName: values.courseName,
        startDate: values.startDate ? dayjs(values.startDate).format('DD/MM/YYYY') : '',
        country: values.country,
        city: values.city,
        venue: values.venue,
        manday: Number(values.manday),
        costPerHead: Number(values.costPerHead),
        slot: Number(values.slot),
        totalCost: Number(values.totalCost),
        targetGroup: values.targetGroup,
        courseCategories: values.courseCategories?.id || null,
        courseScope: values.courseScope?.id || null,
        organizedBy: values.organizedBy?.id || null,
        tutorsName: values.tutorsName,
        movementType: values.movementType
      };


      toast.success(action === 'edit' ? 'Cập nhật khóa đào tạo thành công!' : 'Tạo khóa đào tạo thành công!');
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
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ values, handleChange, errors, touched, setFieldValue }) => (
              <Form id="cv-form" style={{ width: '100%' }}>
                <Grid container size={{ xs: 12 }}>
                  <Grid size={{ xs: 12 }}>
                    <MainCard sx={{ mt: 1 }} contentSX={{ p: 1.5 }}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                        Information
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 4 }} sx={{ marginBottom: 2 }}>
                          <TextField
                            fullWidth
                            label="Course Code"
                            variant="outlined"
                            name="courseCode"
                            value={values.courseCode}
                            onChange={handleChange}
                            error={touched.courseCode && !!errors.courseCode}
                            helperText={touched.courseCode && errors.courseCode}
                            InputLabelProps={{ shrink: true }}
                            size="small"
                          />
                        </Grid>
                        <Grid size={{ xs: 4 }} sx={{ marginBottom: 2 }}>
                          <TextField
                            fullWidth
                            label="Course Name"
                            variant="outlined"
                            name="courseName"
                            value={values.courseName}
                            onChange={handleChange}
                            error={touched.courseName && !!errors.courseName}
                            helperText={touched.courseName && errors.courseName}
                            InputLabelProps={{ shrink: true }}
                            size="small"
                          />
                        </Grid>
                        <Grid size={{ xs: 2 }} sx={{ marginBottom: 2 }}>
                          <DatePicker
                            label="Start Date"
                            value={values.startDate ? dayjs(values.startDate) : null}
                            onChange={(date) => setFieldValue('startDate', date ? date.toISOString() : null)}
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
                        <Grid size={{ xs: 2 }} sx={{ marginBottom: 2 }}>
                          <DatePicker
                            label="End Date"
                            value={values.startDate ? dayjs(values.startDate) : null}
                            onChange={(date) => setFieldValue('startDate', date ? date.toISOString() : null)}
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
                        <Grid size={{ xs: 4 }} sx={{ marginBottom: 2 }}>
                          <TextField
                            fullWidth
                            label="Country"
                            variant="outlined"
                            name="country"
                            value={values.country}
                            onChange={handleChange}
                            error={touched.country && !!errors.country}
                            helperText={touched.country && errors.country}
                            InputLabelProps={{ shrink: true }}
                            size="small"
                          />
                        </Grid>
                        <Grid size={{ xs: 4 }} sx={{ marginBottom: 2 }}>
                          <TextField
                            fullWidth
                            label="City"
                            variant="outlined"
                            name="city"
                            value={values.city}
                            onChange={handleChange}
                            error={touched.city && !!errors.city}
                            helperText={touched.city && errors.city}
                            InputLabelProps={{ shrink: true }}
                            size="small"
                          />
                        </Grid>
                        <Grid size={{ xs: 4 }} sx={{ marginBottom: 2 }}>
                          <TextField
                            fullWidth
                            label="Venue"
                            variant="outlined"
                            name="venue"
                            value={values.venue}
                            onChange={handleChange}
                            error={touched.venue && !!errors.venue}
                            helperText={touched.venue && errors.venue}
                            InputLabelProps={{ shrink: true }}
                            size="small"
                          />
                        </Grid>
                        <Grid size={{ xs: 4 }} sx={{ marginBottom: 2 }}>
                          <TextField
                            fullWidth
                            label="Manday (Days)"
                            variant="outlined"
                            name="manday"
                            value={values.manday}
                            onChange={handleChange}
                            error={touched.manday && !!errors.manday}
                            helperText={touched.manday && errors.manday}
                            InputLabelProps={{ shrink: true }}
                            size="small"
                          />
                        </Grid>
                        <Grid size={{ xs: 4 }} sx={{ marginBottom: 2 }}>
                          <TextField
                            fullWidth
                            label="Cost/Head"
                            variant="outlined"
                            name="costPerHead"
                            value={values.costPerHead}
                            onChange={handleChange}
                            error={touched.costPerHead && !!errors.costPerHead}
                            helperText={touched.costPerHead && errors.costPerHead}
                            InputLabelProps={{ shrink: true }}
                            size="small"
                          />
                        </Grid>
                        <Grid size={{ xs: 4 }} sx={{ marginBottom: 2 }}>
                          <TextField
                            fullWidth
                            label="Slot (Persons)"
                            variant="outlined"
                            name="slot"
                            value={values.slot}
                            onChange={handleChange}
                            error={touched.slot && !!errors.slot}
                            helperText={touched.slot && errors.slot}
                            InputLabelProps={{ shrink: true }}
                            size="small"
                          />
                        </Grid>
                        <Grid size={{ xs: 4 }} sx={{ marginBottom: 2 }}>
                          <TextField
                            fullWidth
                            label="Total Cost"
                            variant="outlined"
                            name="totalCost"
                            value={values.totalCost}
                            onChange={handleChange}
                            error={touched.totalCost && !!errors.totalCost}
                            helperText={touched.totalCost && errors.totalCost}
                            InputLabelProps={{ shrink: true }}
                            size="small"
                          />
                        </Grid>
                        <Grid size={{ xs: 4 }} sx={{ marginBottom: 2 }}>
                          <TextField
                            fullWidth
                            label="Target Group"
                            variant="outlined"
                            name="targetGroup"
                            value={values.targetGroup}
                            onChange={handleChange}
                            error={touched.targetGroup && !!errors.targetGroup}
                            helperText={touched.targetGroup && errors.targetGroup}
                            InputLabelProps={{ shrink: true }}
                            size="small"
                          />
                        </Grid>
                        <Grid size={{ xs: 4 }} sx={{ marginBottom: 2 }}>
                          <FormikAutocomplete
                            name="courseCategories"
                            options={genderList}
                            getOptionLabel={(option) => option.name || ''}
                            label="Course Categories"
                            value={values.courseCategories}
                            onChange={(event, value) => setFieldValue('courseCategories', value)}
                            error={touched.courseCategories && !!errors.courseCategories}
                            helperText={touched.courseCategories && errors.courseCategories}
                          />
                        </Grid>
                        <Grid size={{ xs: 4 }} sx={{ marginBottom: 2 }}>
                          <FormikAutocomplete
                            name="courseScope"
                            options={genderList}
                            getOptionLabel={(option) => option.name || ''}
                            label="Course Scope"
                            value={values.courseScope}
                            onChange={(event, value) => setFieldValue('courseScope', value)}
                            error={touched.courseScope && !!errors.courseScope}
                            helperText={touched.courseScope && errors.courseScope}
                          />
                        </Grid>
                        <Grid size={{ xs: 4 }} sx={{ marginBottom: 2 }}>
                          <FormikAutocomplete
                            name="organizedBy"
                            options={keptByOptions}
                            getOptionLabel={(option) => option.name || ''}
                            label="Organized By"
                            value={values.organizedBy}
                            onChange={(event, value) => setFieldValue('organizedBy', value)}
                            error={touched.organizedBy && !!errors.organizedBy}
                            helperText={touched.organizedBy && errors.organizedBy}
                          />
                        </Grid>
                        <Grid size={{ xs: 4 }} sx={{ marginBottom: 2 }}>
                          <TextField
                            fullWidth
                            label="Tutor's Name"
                            variant="outlined"
                            name="tutorsName"
                            value={values.tutorsName}
                            onChange={handleChange}
                            error={touched.tutorsName && !!errors.tutorsName}
                            helperText={touched.tutorsName && errors.tutorsName}
                            InputLabelProps={{ shrink: true }}
                            size="small"
                          />
                        </Grid>
                      </Grid>
                    </MainCard>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 12 }}>
                        <MainCard sx={{ mt: 2 }} contentSX={{ p: 1.5 }}>
                          <Grid container spacing={2}>
                            <Box sx={{ width: '100%', p: 2 }}>
                              <TableContainer component={Paper} sx={{ maxHeight: 300, overflow: 'auto' }}>
                                <Table stickyHeader>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Start Date</TableCell>
                                      <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>End Date</TableCell>
                                      <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Attendance</TableCell>
                                      <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Course Name</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {data.map((row, index) => (
                                      <TableRow
                                        key={index}
                                        sx={{
                                          '&:nth-of-type(odd)': { backgroundColor: '#fff' },
                                          '&:nth-of-type(even)': { backgroundColor: '#f9f9f9' }
                                        }}
                                      >
                                        <TableCell>{row.issuedDate}</TableCell>
                                        <TableCell>{row.effectiveDate}</TableCell>
                                        <TableCell>{row.appliedBy}</TableCell>
                                        <TableCell>{row.company}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </Box>
                          </Grid>
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

export default Training;
