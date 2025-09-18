import React, { useState, useEffect, useMemo } from 'react';
import Grid from '@mui/material/Grid';
import { Box, Button, TextField, Autocomplete } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import CommonTable from '../common/common-table';
import CasualLaborModal from './casual-labor-modal';
import CasualLaborDeleteConfirm from './casual-labor-delete-cofirm';
import { Refresh, Add, Edit, Delete } from '@mui/icons-material';
import { getCasualApi, updateCasualApi, createCasualApi, deleteCasualApi } from 'api/casual.api';
import { getCompanyApi } from 'api/company.api';
import { getLocationApi } from 'api/location.api';
import { getFunctionApi } from 'api/function.api';
import { getDepartmentApi } from 'api/department.api';
import { getCostCenterApi } from 'api/cost-center.api';
import { getCityApi } from 'api/city.api';
import { getProvinceApi } from 'api/province.api';
import { getOtherListNApi } from 'api/other-list-n.api';
import { getOtherListApi } from 'api/other-list.api';

const CasualLabor = () => {
  const [casualLaborData, setCasualLaborData] = useState([]);
  const [rowData, setRowData] = useState(null);
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const [disableBtn, setDisableBtn] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [companyData, setCompanyData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [functionData, setFunctionData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [costCenterData, setCostCenterData] = useState([]);
  const [otherListData, setOtherListData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [provinceData, setProvinceData] = useState([]);
  const [otherListNData, setOtherListNData] = useState([]);

  // Filter states
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedFunction, setSelectedFunction] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  // Filter department data based on selected company
  const departmentFilterData = useMemo(() => {
    if (!selectedCompany) {
      return departmentData;
    }
    return departmentData.filter((dept) => dept.comId === selectedCompany);
  }, [departmentData, selectedCompany]);

  useEffect(() => {
    fetchData();
    fetchCompanyData();
    fetchLocationData();
    fetchFunctionData();
    fetchDepartmentData();
    fetchCostCenterData();
    fetchCityData();
    fetchProvinceData();
    fetchOtherListNData();
    fetchOtherListData();
  }, []);

  const fetchData = async () => {
    try {
      const casualData = await getCasualApi();
      setCasualLaborData(casualData);
    } catch (error) {
      toast.error('Failed to fetch Casual Labor');
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
  const fetchFunctionData = async () => {
    try {
      const getFunctionData = await getFunctionApi();
      setFunctionData(getFunctionData);
    } catch (error) {
      toast.error('Failed to fetch functions');
    }
  };
  const fetchDepartmentData = async () => {
    try {
      const getDepartmentData = await getDepartmentApi();
      setDepartmentData(getDepartmentData);
    } catch (error) {
      toast.error('Failed to fetch departments');
    }
  };

  const fetchCostCenterData = async () => {
    try {
      const getCostCenterData = await getCostCenterApi();
      setCostCenterData(getCostCenterData);
    } catch (error) {
      toast.error('Failed to fetch Cost Center');
    }
  };
  const fetchCityData = async () => {
    try {
      const getCityData = await getCityApi();
      setCityData(getCityData);
    } catch (error) {
      toast.error('Failed to fetch City');
    }
  };
  const fetchProvinceData = async () => {
    try {
      const getProvinceData = await getProvinceApi();
      setProvinceData(getProvinceData);
    } catch (error) {
      toast.error('Failed to fetch Province');
    }
  };
  const fetchOtherListNData = async () => {
    try {
      const getOtherListNData = await getOtherListNApi();
      setOtherListNData(getOtherListNData);
    } catch (error) {
      toast.error('Failed to fetch Other List N');
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
    setDisableBtn(false);
    setOpen(true);
    setRowData(data);
  };

  const onDelete = (data) => {
    setRowData(data);
    setOpenDeleteConfirm(true);
  };
  const onConfirmDelete = async (data) => {
    try {
      await deleteCasualApi(data.pkey);
      toast.success('Delete successfully');
      setOpenDeleteConfirm(false);
      fetchData();
    } catch {
      toast.error('Delete failed');
      setOpenDeleteConfirm(false);
    }
  };

  const onCreate = () => {
    setAction('create');
    setDisableBtn(false);
    setRowData({});
    setOpen(true);
  };

  const onAction = async (data) => {
    if (data && !data.gender) delete data.gender;
    if (data && !data.period) delete data.period;
    if (data && !data.salary) delete data.salary;
    if (data && !data.allowance) delete data.allowance;
    try {
      if (action === 'create') {
        await createCasualApi(data);
        toast.success('Create successfully');
        setOpen(false);
        fetchData();
      } else if (action === 'edit') {
        await updateCasualApi(data, data.pkey || rowData?.pkey);
        toast.success('Update successfully');
        setOpen(false);
        fetchData();
      }
      setDisableBtn(false);
    } catch {
      toast.error(`${action === 'edit' ? 'Update' : 'Create'} failed`);
      setDisableBtn(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const filteredCasualLaborData = useMemo(() => {
    let filteredData = casualLaborData || [];
    if (selectedCompany) {
      filteredData = filteredData.filter((item) => item.comId === selectedCompany);
    }
    if (selectedLocation) {
      filteredData = filteredData.filter((item) => item.locId === selectedLocation);
    }
    if (selectedFunction) {
      filteredData = filteredData.filter((item) => item.funcId == selectedFunction);
    }

    if (selectedDepartment) {
      filteredData = filteredData.filter((item) => item.depId == selectedDepartment);
    }
    if (selectedPeriod) {
      filteredData = filteredData.filter((item) => {
        if (item.hiringDate) {
          const hiringDate = dayjs(item.hiringDate);
          return hiringDate.year() === selectedPeriod.year && hiringDate.month() === selectedPeriod.month;
        }
        return false;
      });
    }

    return filteredData;
  }, [casualLaborData, selectedCompany, selectedLocation, selectedFunction, selectedDepartment, selectedPeriod]);

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
        header: () => 'Code',
        minSize: 120
      },
      {
        accessorKey: 'vnFullname',
        header: () => 'Full Name',
        cell: ({ row }) => {
          const value = row.getValue('vnFullname');
          return <span>{value || ''}</span>;
        },
        minSize: 200
      },
      {
        accessorKey: 'birthDate',
        header: () => 'Birth Date',
        cell: ({ row }) => {
          const value = row.getValue('birthDate');
          const valueCus = value ? dayjs(value).format('DD-MM-YYYY') : '';
          return <span>{valueCus}</span>;
        },
        minSize: 120
      },
      {
        accessorKey: 'gender',
        header: () => 'Gender',
        cell: ({ row }) => {
          const value = row.getValue('gender');
          return <span>{value === 1 ? 'Male' : value === 0 ? 'Female' : ''}</span>;
        },
        minSize: 80
      },
      {
        accessorKey: 'hiringDate',
        header: () => 'Hiring Date',
        cell: ({ row }) => {
          const value = row.getValue('hiringDate');
          const valueCus = value ? dayjs(value).format('DD-MM-YYYY') : '';
          return <span>{valueCus}</span>;
        },
        minSize: 120
      },
      {
        accessorKey: 'endDate',
        header: () => 'End Date',
        cell: ({ row }) => {
          const value = row.getValue('endDate');
          const valueCus = value ? dayjs(value).format('DD-MM-YYYY') : '';
          return <span>{valueCus}</span>;
        },
        minSize: 120
      },
      {
        accessorKey: 'position',
        header: () => 'Position',
        minSize: 150
      },
      {
        accessorKey: 'company',
        header: () => 'Company',
        cell: ({ row }) => {
          const value = row.original;
          const company = companyData.find((c) => c.id === value.comId);
          return <span>{company?.name || ''}</span>;
        },
        minSize: 200
      },
      {
        accessorKey: 'function',
        header: () => 'Function',
        cell: ({ row }) => {
          const value = row.original;
          const func = functionData.find((f) => f.id == value.funcId);
          return <span>{func?.vnName || func?.enName || ''}</span>;
        },
        minSize: 150
      },
      {
        accessorKey: 'department',
        header: () => 'Department',
        cell: ({ row }) => {
          const value = row.original;
          const dept = departmentData.find((d) => d.id == value.depId);
          return <span>{dept?.vnName || dept?.enName || ''}</span>;
        },
        minSize: 250
      },
      {
        accessorKey: 'location',
        header: () => 'Location',
        cell: ({ row }) => {
          const value = row.original;
          const location = locationData.find((l) => l.id == value.locId);
          return <span>{location?.vnName || location?.enName || ''}</span>;
        },
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
    [companyData, functionData, departmentData, locationData, cityData, provinceData]
  );
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid sx={{ width: '100%', pb: 1 }} container spacing={2} alignItems="center">
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
              setSelectedDepartment(''); // Reset department when company changes
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

        <Grid display="flex" justifyContent="flex-end" marginLeft="auto" gap={1}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<Refresh />}
            onClick={fetchData}
            style={{ backgroundColor: '#4caf50' }}
          >
            Refresh
          </Button>

          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<Add />}
            onClick={() => {
              onCreate();
            }}
          >
            Create
          </Button>
        </Grid>
      </Grid>

      <CommonTable data={filteredCasualLaborData} columns={columns} searchQuery={searchQuery} tableHeight={310} />
      <CasualLaborModal
        open={open}
        setOpen={setOpen}
        rowData={rowData}
        onAction={onAction}
        action={action}
        setDisableBtn={setDisableBtn}
        disableBtn={disableBtn}
        companyData={companyData}
        locationData={locationData}
        functionData={functionData}
        departmentData={departmentData}
        costCenterData={costCenterData}
        otherListData={otherListData}
        otherListNData={otherListNData}
        cityData={cityData}
        provinceData={provinceData}
      />
      <CasualLaborDeleteConfirm
        open={openDeleteConfirm}
        setOpen={setOpenDeleteConfirm}
        onConfirm={onConfirmDelete}
        rowData={rowData || {}}
      />
    </LocalizationProvider>
  );
};

export default CasualLabor;
