import React, { useState, useEffect, useMemo } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import { Box, Button, TextField, Autocomplete } from '@mui/material';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// project imports
import CommonTable from '../common/common-table';
import MovementSalaryModal from './movement-salary-modal';
import MovementSalaryDeleteConfirm from './movement-salary-delete-confirm';
import { Refresh, Add, Edit, Delete } from '@mui/icons-material';

import { deleteWorkingApi, getWorkingInfoApi, updateWorkingApi } from 'api/working.api';
import { getOtherListNApi } from 'api/other-list-n.api';
import { getEmployeeApi, updateEmployeeApi } from 'api/employee.api';
import { getDepartmentApi } from 'api/department.api';
import { getFunctionApi } from 'api/function.api';
import { getSectionApi } from 'api/section.api';
import { getCompanyApi } from 'api/company.api';
import { getLocationApi } from 'api/location.api';
import { getAllowTypeApi } from 'api/allow-type.api';
import { formatNumber } from 'utils/convert-money';
import { getJobTypeApi } from 'api/job-type.api';
import { getWorklevelApi } from 'api/worklevel.api';
import { getPositionApi } from 'api/position.api';
import { getOtherListApi } from 'api/other-list.api';

import updateLocale from 'dayjs/plugin/updateLocale';

dayjs.extend(updateLocale);
dayjs.updateLocale('en', {
  months: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
});

const MovementSalary = () => {
  // const [MovementSalaryData, setMovementSalaryData] = useState([]);
  const [rowData, setRowData] = useState(null);
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [otherListNData, setOtherListN] = useState([]);
  const [disableBtn, setDisableBtn] = useState(false);
  const [employeeData, setEmployeeData] = useState([]);
  const [functionData, setFunctionData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [departmentFilterData, setDepartmentFilterData] = useState([]);
  const [sectionData, setSectionData] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [movementSalaryInfoData, setMovementSalaryInfoData] = useState([]);
  // const [movementSalaryInfoFilterData, setMovementSalaryInfoFilterData] = useState([]); // Sẽ bỏ cái này đi
  const [allowTypeData, setAllowTypeData] = useState([]);
  const [selectedMovementSalaryType, setSelectedMovementSalaryType] = useState();
  const [selectedCompany, setSelectedCompany] = useState();
  const [selectedFunction, setSelectedFunction] = useState();
  const [selectedLocation, setSelectedLocation] = useState();
  const [selectedDepartment, setSelectedDepartment] = useState();
  const [selectedPeriod, setSelectedPeriod] = useState();
  const [jobTypeData, setJobTypeData] = useState([]);
  const [worklevelData, setWorklevelData] = useState([]);
  const [positionData, setPositionData] = useState([]);
  const [otherListData, setOtherListData] = useState([]);
  
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!open) {
      setRowData({});
    }
  }, [open]);

  const fetchData = async () => {
    await fetchAllowTypeData();
    await fetchOtherListNData();
    await fetchDepartmentData();
    await fetchFunctionData();
    await fetchSectionData();
    await fetchCompanyData();
    await fetchLocationData();
    await fetchEmployeeData();
    await fetchJobTypeData();
    await fetchWorkLevelData();
    await fetchPositionData();
    await fetchOtherListData();
    // await fetchMovementSalaryData();
    await fetchMovementSalaryInfoData();
  };

  // Logic để lọc Department theo Company
  useEffect(() => {
    if (selectedCompany) {
      const filterDepData = departmentData.filter((i) => i.comId === selectedCompany);
      setDepartmentFilterData(filterDepData);
    } else {
      setDepartmentFilterData(departmentData); // Hiển thị tất cả department nếu không chọn company
    }
  }, [departmentData, selectedCompany]);

  const filteredMovementSalaryInfoData = useMemo(() => {
    let filteredData = movementSalaryInfoData;

    if (selectedMovementSalaryType) {
      filteredData = filteredData.filter((i) => i.type === selectedMovementSalaryType);
    }

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

    if (selectedPeriod) {
      filteredData = filteredData.filter((i) => {
        if (i.effectDate) {
          const effectDateDayjs = dayjs(i.effectDate);
          if (effectDateDayjs.isValid()) {
            const month = effectDateDayjs.month();
            const year = effectDateDayjs.year();
            return selectedPeriod.year === year && selectedPeriod.month === month;
          }
        }
        return false; 
      });
    }

    return filteredData;
  }, [
    movementSalaryInfoData,
    selectedMovementSalaryType,
    selectedCompany,
    selectedLocation,
    selectedFunction,
    selectedDepartment,
    selectedPeriod
  ]);

  const fetchAllowTypeData = async () => {
    try {
      const getMovementSalaryData = await getAllowTypeApi();
      setAllowTypeData(getMovementSalaryData || []);
    } catch (error) {
      toast.error('Failed to fetch allow type');
    }
  };

  const fetchEmployeeData = async () => {
    try {
      const getEmployeeData = await getEmployeeApi();
      setEmployeeData(getEmployeeData);
    } catch (error) {
      toast.error('Failed to fetch companies');
    }
  };

  const fetchDepartmentData = async () => {
    try {
      const getDepartmentData = await getDepartmentApi();
      setDepartmentData(getDepartmentData);
    } catch (error) {
      toast.error('Failed to fetch department');
    }
  };

  const fetchFunctionData = async () => {
    try {
      const getfunctiondata = await getFunctionApi();
      setFunctionData(getfunctiondata);
    } catch (error) {
      toast.error('Failed to fetch functions');
    }
  };

  const fetchOtherListNData = async () => {
    try {
      const getOtherListNData = await getOtherListNApi();
      setOtherListN(getOtherListNData);
    } catch (error) {
      toast.error('Failed to fetch Other List N');
    }
  };

  const fetchSectionData = async () => {
    try {
      const getSectionData = await getSectionApi();
      setSectionData(getSectionData);
    } catch (error) {
      toast.error('Failed to fetch section');
    }
  };

  const fetchCompanyData = async () => {
    try {
      const getCompanyData = await getCompanyApi();
      setCompanyData(getCompanyData);
    } catch (error) {
      toast.error('Failed to fetch companies');
    }
  };

  const fetchLocationData = async () => {
    try {
      const getLocationData = await getLocationApi();
      setLocationData(getLocationData);
    } catch (error) {
      toast.error('Failed to fetch companies');
    }
  };

  const fetchMovementSalaryInfoData = async () => {
    try {
      const getMovementSalaryInfoData = await getWorkingInfoApi();
      setMovementSalaryInfoData(getMovementSalaryInfoData.data || []);
      // Không cần setMovementSalaryInfoFilterData ở đây nữa
    } catch (error) {
      toast.error('Failed to fetch MovementSalary data');
    }
  };

  const fetchJobTypeData = async () => {
    try {
      const getJobTypeData = await getJobTypeApi();
      const getJobTypeCustom = getJobTypeData.map((i) => ({
        ...i,
        id: i.id.toString()
      }));
      setJobTypeData(getJobTypeCustom);
    } catch (error) {
      toast.error('Failed to fetch Job Type');
    }
  };

  const fetchWorkLevelData = async () => {
    try {
      const worklevelData = await getWorklevelApi();
      setWorklevelData(worklevelData);
    } catch (error) {
      toast.error('Failed to fetch work level');
    }
  };

  const fetchPositionData = async () => {
    try {
      const getPositionData = await getPositionApi();
      setPositionData(getPositionData);
    } catch (error) {
      toast.error('Failed to fetch companies');
    }
  };

  const fetchOtherListData = async () => {
    try {
      const getOtherListData = await getOtherListApi();
      setOtherListData(getOtherListData);
    } catch (error) {
      toast.error('Failed to fetch other list');
    }
  };

  const onEdit = (data) => {
    setAction('edit');
    setOpen(true);
    setRowData(data);
  };

  const onDelete = (data) => {
    setRowData(data);
    setOpenDeleteConfirm(true);
  };

  const onConfirmDelete = async (data) => {
    try {
      const deleteResult = await deleteWorkingApi(data.employeeId, data.type);
      setOpenDeleteConfirm(false);
      if (deleteResult.isSuccess) {
        // fetchMovementSalaryData();
        fetchMovementSalaryInfoData();
        toast.success('Delete MovementSalary successfully');
      } else {
        toast.error(deleteResult.message);
      }
    } catch {
      toast.error('Delete MovementSalary failed');
    }
  };

  const onCreate = () => {
    setAction('create');
    setRowData({});
    setOpen(true);
  };

  const onAction = async (data, selectedEmployee) => {
    try {
      if (data.workStatus) data.workStatus = Number(data.workStatus);
      const cleanedData = Object.fromEntries(Object.entries(data).map(([key, value]) => [key, value === '' ? null : value]));
      const resultUpdateEmployee = await updateEmployeeApi(
        {
          employeeId: data.employeeId,
          basic: data.basic,
          comId: data.comId,
          depId: data.depId,
          funcId: data.funcId,
          jobType: data.jobType,
          locId: data.locId,
          mgtAllow: data.mgtAllow,
          posId: data.posId,
          totalBase: data.totalBase,
          varpayRange: data.varpayRange,
          workLevel: data.workLevel,
          workStatus: data.workStatus
        },
        selectedEmployee.employeeId,
        selectedEmployee.comId,
        selectedEmployee.pkey
      );
      if (resultUpdateEmployee.isSuccess) {
        if (action === 'create') {
          const resultCreate = await createWorkingApi(cleanedData);
          if (resultCreate.isSuccess) {
            toast.success('Create MovementSalary successfully');
            setOpen(false);
          } else toast.error(resultCreate.message);
        } else if (action === 'edit' && rowData.pkey) {
          const resultUpdate = await updateWorkingApi(cleanedData, rowData.pkey);
          if (resultUpdate.isSuccess) {
            toast.success('Update MovementSalary successfully');
            setOpen(false);
          } else toast.error(resultUpdate.message);
        } else {
          toast.error('MovementSalary not found');
          setDisableBtn(false);
        }
        fetchMovementSalaryInfoData();
        setDisableBtn(false);
      }
    } catch (err) {
      toast.error(`${action === 'edit' ? 'Update' : 'Create'} MovementSalary failed`);
      setDisableBtn(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const columns = useMemo(
    () => [
      {
        id: 'no',
        header: () => 'No.',
        size: 70,
        cell: ({ row }) => row.index + 1
      },
      {
        accessorKey: 'employeeId',
        header: () => 'Employee ID',
        minSize: 100
      },
      {
        accessorKey: 'employee',
        header: () => 'FullName',
        cell: ({ row }) => {
          const value = row.getValue('employee');
          const valueCus = value ? value.enFullName || value.vnFullName : '';
          return <span>{valueCus}</span>;
        },
        minSize: 250
      },
      {
        accessorKey: 'issuedDate',
        header: () => 'Issued Date',
        cell: ({ row }) => {
          const value = row.getValue('issuedDate');
          const valueCus = value ? dayjs(value).format('DD-MM-YYYY') : '';
          return <span>{valueCus}</span>;
        },
        minSize: 100
      },
      {
        accessorKey: 'effectDate',
        header: () => 'Effect Date',
        cell: ({ row }) => {
          const value = row.getValue('effectDate');
          const valueCus = value ? dayjs(value).format('DD-MM-YYYY') : '';
          return <span>{valueCus}</span>;
        },
        minSize: 100
      },
      {
        accessorKey: 'appliedBy',
        header: () => 'Applied By',
        minSize: 150
      },
      {
        accessorKey: 'company',
        header: () => 'Company',
        cell: ({ row }) => {
          const value = row.getValue('company');
          const valueCus = value ? value.name || value.enName : '';
          return <span>{valueCus}</span>;
        },
        minSize: 250
      },
      {
        accessorKey: 'function',
        header: () => 'Function',
        cell: ({ row }) => {
          const value = row.getValue('function');
          const valueCus = value ? value.vnName || value.enName : '';
          return <span>{valueCus}</span>;
        },
        minSize: 200
      },
      {
        accessorKey: 'position',
        header: () => 'Position',
        cell: ({ row }) => {
          const value = row.getValue('position');
          const valueCus = value ? value.vnName || value.enName : '';
          return <span>{valueCus}</span>;
        },
        minSize: 200
      },
      {
        accessorKey: 'department',
        header: () => 'Department',
        cell: ({ row }) => {
          const value = row.getValue('department');
          const valueCus = value ? value.vnName || value.enName : '';
          return <span>{valueCus}</span>;
        },
        minSize: 250
      },
      {
        accessorKey: 'section',
        header: () => 'Section',
        cell: ({ row }) => {
          const value = row.getValue('section');
          const valueCus = value ? value.vnName || value.enName : '';
          return <span>{valueCus}</span>;
        },
        minSize: 250
      },
      {
        accessorKey: 'location',
        header: () => 'Location',
        cell: ({ row }) => {
          const value = row.getValue('location');
          const valueCus = value ? value.vnName || value.enName : '';
          return <span>{valueCus}</span>;
        },
        minSize: 150
      },
      {
        accessorKey: 'costCenter',
        header: () => 'Cost Center',
        minSize: 110
      },
      {
        accessorKey: 'reportTo',
        header: () => 'Report To',
        minSize: 200
      },
      {
        accessorKey: 'basic',
        header: () => 'Basic',
        cell: ({ row }) => {
          const value = row.getValue('basic');
          const valueCus = value ? formatNumber(value) : '';
          return <span>{valueCus}</span>;
        },
        minSize: 120
      },
      {
        accessorKey: 'grossSal',
        header: () => 'Gross',
        cell: ({ row }) => {
          const value = row.getValue('grossSal');
          const valueCus = value ? formatNumber(value) : '';
          return <span>{valueCus}</span>;
        },
        minSize: 120
      },
      {
        accessorKey: 'mgtAllow',
        header: () => 'mgt. Allowance',
        minSize: 130
      },
      {
        accessorKey: 'totalBase',
        header: () => 'Total Base',
        cell: ({ row }) => {
          const value = row.getValue('totalBase');
          const valueCus = value ? formatNumber(value) : '';
          return <span>{valueCus}</span>;
        },
        minSize: 120
      },
      {
        accessorKey: 'nth',
        header: () => 'NTH',
        cell: ({ row }) => {
          const value = row.getValue('nth');
          const valueCus = value ? formatNumber(value) : '';
          return <span>{valueCus}</span>;
        },
        minSize: 120
      },
      {
        accessorKey: 'workLevel',
        header: () => 'Work Level',
        cell: ({ row }) => {
          const value = row.getValue('workLevel');
          const valueCus = value ? worklevelData.find((i) => i.id === value) : '';
          return <span>{(valueCus && valueCus.payPos) || ''}</span>;
        },
        minSize: 100
      },
      {
        accessorKey: 'payPoint',
        header: () => 'Pay Point',
        minSize: 120
      },
      {
        accessorKey: 'anTotalNth',
        header: () => 'AnnualNTH',
        cell: ({ row }) => {
          const value = row.getValue('anTotalNth');
          const valueCus = value ? formatNumber(value) : '';
          return <span>{valueCus}</span>;
        },
        minSize: 120
      },
      {
        accessorKey: 'varpayRange',
        header: () => 'Variable Pay Range',
        minSize: 150
      },
      {
        accessorKey: 'comments',
        header: () => 'Comment',
        minSize: 150
      },
      {
        id: 'actions',
        header: '',
        size: 180,
        cell: ({ row }) => (
          <Box display="flex" gap={1} flexWrap="nowrap" alignItems="center" sx={{ whiteSpace: 'nowrap' }}>
            <Button variant="contained" color="primary" size="small" startIcon={<Edit />} onClick={() => onEdit(row.original)}>
              Edit
            </Button>
            <Button variant="contained" color="error" size="small" startIcon={<Delete />} onClick={() => onDelete(row.original)}>
              Delete
            </Button>
          </Box>
        )
      }
    ],
    []
  );

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid sx={{ width: '100%' }} container spacing={2} alignItems="center">
          <Grid display="flex" alignItems="center">
            <TextField
              variant="outlined"
              label="Search ..."
              size="small"
              sx={{
                width: 250,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#ffffff',
                  height: '37px'
                },
                '& .MuiInputBase-input': {
                  padding: '8px 14px'
                }
              }}
              slotProps={{
                inputLabel: { shrink: true }
              }}
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </Grid>
          <Grid display="flex" alignItems="center">
            <Autocomplete
              disablePortal
              options={companyData || []}
              getOptionLabel={(option) => option?.name || ''}
              value={companyData.find((item) => item.id === selectedCompany) || null}
              onChange={(event, newValue) => {
                setSelectedCompany(newValue ? newValue.id : '');
              }}
              sx={{
                width: 250,
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
          <Grid display="flex" alignItems="center">
            <Autocomplete
              disablePortal
              options={locationData || []}
              getOptionLabel={(option) => `${option?.enName} - ${option?.vnName}` || ''}
              value={locationData.find((item) => item.id === selectedLocation) || null}
              onChange={(event, newValue) => {
                setSelectedLocation(newValue ? newValue.id : '');
              }}
              sx={{
                width: 250,
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
          <Grid display="flex" alignItems="center">
            <Autocomplete
              disablePortal
              options={functionData || []}
              getOptionLabel={(option) => `${option?.enName} - ${option?.vnName}` || ''}
              value={functionData.find((item) => item.id === selectedFunction) || null}
              onChange={(event, newValue) => {
                setSelectedFunction(newValue ? newValue.id : '');
              }}
              sx={{
                width: 250,
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
          <Grid display="flex" alignItems="center">
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
                width: 250,
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

          <Grid display="flex" alignItems="center">
            <DatePicker
              label="Period"
              views={['year', 'month']}
              format="MM/YYYY"
              value={selectedPeriod ? dayjs(`${selectedPeriod.year}-${selectedPeriod.month + 1}-01`) : null} // +1 vì dayjs.month() trả về chỉ số 0-11
              onChange={(date) => {
                if (date && dayjs(date).isValid()) {
                  // Kiểm tra tính hợp lệ của date
                  setSelectedPeriod({
                    year: dayjs(date).year(),
                    month: dayjs(date).month()
                  });
                } else {
                  setSelectedPeriod(null);
                }
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

          <Grid display="flex" justifyContent="flex-end" marginLeft="auto" gap={1}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<Refresh />}
              onClick={fetchMovementSalaryInfoData}
              style={{ backgroundColor: '#4caf50' }}
            >
              Refresh
            </Button>

            <Button variant="contained" color="primary" size="small" startIcon={<Add />} onClick={() => onCreate()}>
              Create
            </Button>
          </Grid>
          {/* Thay thế movementSalaryInfoFilterData bằng filteredMovementSalaryInfoData */}
          <CommonTable data={filteredMovementSalaryInfoData} columns={columns} searchQuery={searchQuery} tableHeight={310} />
        </Grid>
      </LocalizationProvider>

      <MovementSalaryModal
        open={open}
        setOpen={setOpen}
        rowData={rowData}
        onAction={onAction}
        action={action}
        otherListNData={otherListNData}
        setDisableBtn={setDisableBtn}
        disableBtn={disableBtn}
        employeeData={employeeData}
        functionData={functionData}
        departmentData={departmentData}
        sectionData={sectionData}
        companyData={companyData}
        locationData={locationData}
        allowTypeData={allowTypeData}
        jobTypeData={jobTypeData}
        worklevelData={worklevelData}
        positionData={positionData}
        otherListData={otherListData}
      />
      <MovementSalaryDeleteConfirm
        open={openDeleteConfirm}
        setOpen={setOpenDeleteConfirm}
        onConfirm={onConfirmDelete}
        data={rowData}
        allowTypeData={allowTypeData}
      />
    </>
  );
};

export default MovementSalary;
