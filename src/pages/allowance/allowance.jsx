import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as XLSX from 'xlsx';
// material-ui
import Grid from '@mui/material/Grid';
import { Box, Button, TextField, Autocomplete } from '@mui/material';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

// project imports
import CommonTable from '../common/common-table';
import AllowanceModal from './allowance-modal';
import AllowanceDeleteConfirm from './allowance-delete-confirm';
import AllowanceWarningModal from './allowance-warning-modal';
import { Refresh, Add, Edit, Delete, UploadFile } from '@mui/icons-material';

import {
  updateAllowanceApi,
  createAllowanceApi,
  deleteAllowanceApi,
  getAllowanceInfoApi,
  checkAllowanceApi,
  uploadAllowanceApi
} from 'api/allowance.api';
import { getOtherListNApi } from 'api/other-list-n.api';
import { getEmployeeApi } from 'api/employee.api';
import { getDepartmentApi } from 'api/department.api';
import { getFunctionApi } from 'api/function.api';
import { getSectionApi } from 'api/section.api';
import { getCompanyApi } from 'api/company.api';
import { getLocationApi } from 'api/location.api';
import { getAllowTypeApi } from 'api/allow-type.api';
import { formatNumber } from 'utils/convert-money';
import { useAuth } from 'contexts/AuthContext';

const Allowance = () => {
  // const [allowanceData, setAllowanceData] = useState([]);
  const [rowData, setRowData] = useState(null);
  const [open, setOpen] = useState(false);
  const [openWarning, setOpenWarning] = useState(false);
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
  const [allowanceInfoData, setAllowanceInfoData] = useState([]);
  const [allowanceInfoFilterData, setAllowanceInfoFilterData] = useState([]);
  const [allowTypeData, setAllowTypeData] = useState([]);
  const [selectedAllowanceType, setSelectedAllowanceType] = useState();
  const [selectedCompany, setSelectedCompany] = useState();
  const [selectedFunction, setSelectedFunction] = useState();
  const [selectedLocation, setSelectedLocation] = useState();
  const [selectedDepartment, setSelectedDepartment] = useState();
  const [warningData, setWarningData] = useState({
    valid: true,
    validData: []
  });
  const fileInputRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await fetchAllowTypeData();
    await fetchOtherListNData();
    await fetchDepartmentData();
    await fetchFunctionData();
    await fetchSectionData();
    await fetchSectionData();
    await fetchCompanyData();
    await fetchLocationData();
    await fetchEmployeeData();
    // await fetchAllowanceData();
    await fetchAllowanceInfoData();
  };

  useEffect(() => {
    if (selectedAllowanceType) {
      const filterData = allowanceInfoData.filter((i) => i.type === selectedAllowanceType);
      setAllowanceInfoFilterData(filterData);
    } else {
      setAllowanceInfoFilterData(allowanceInfoData);
    }
  }, [allowanceInfoData, selectedAllowanceType]);

  useEffect(() => {
    if (selectedCompany) {
      const filterData = allowanceInfoData.filter((i) => i.employee && i.employee.comId === selectedCompany);
      setAllowanceInfoFilterData(filterData);
      const filterDepData = departmentData.filter((i) => i.comId === selectedCompany);
      setDepartmentFilterData(filterDepData);
    } else {
      setDepartmentFilterData([]);
      setAllowanceInfoFilterData(allowanceInfoData);
    }
  }, [allowanceInfoData, selectedCompany]);

  useEffect(() => {
    if (selectedLocation) {
      const filterData = allowanceInfoData.filter((i) => i.employee && i.employee.locId === selectedLocation);
      setAllowanceInfoFilterData(filterData);
    } else {
      setAllowanceInfoFilterData(allowanceInfoData);
    }
  }, [allowanceInfoData, selectedLocation]);

  useEffect(() => {
    if (selectedFunction) {
      const filterData = allowanceInfoData.filter((i) => i.employee && i.employee.funcId === selectedFunction);
      setAllowanceInfoFilterData(filterData);
    } else {
      setAllowanceInfoFilterData(allowanceInfoData);
    }
  }, [allowanceInfoData, selectedFunction]);

  useEffect(() => {
    if (selectedDepartment) {
      const filterData = allowanceInfoData.filter((i) => i.employee && i.employee.depId === selectedDepartment);
      setAllowanceInfoFilterData(filterData);
    } else {
      setAllowanceInfoFilterData(allowanceInfoData);
    }
  }, [allowanceInfoData, selectedDepartment]);

  // const fetchAllowanceData = async () => {
  //   try {
  //     const getAllowanceData = await getAllowanceApi();
  //     setAllowanceData(getAllowanceData.data || []);
  //   } catch (error) {
  //     toast.error('Failed to fetch Allowance');
  //   }
  // };

  const fetchAllowTypeData = async () => {
    try {
      const getAllowanceData = await getAllowTypeApi();
      setAllowTypeData(getAllowanceData || []);
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

  const fetchAllowanceInfoData = async () => {
    try {
      const getAllowanceInfoData = await getAllowanceInfoApi();
      setAllowanceInfoData(getAllowanceInfoData.data || []);
      setAllowanceInfoFilterData(allowanceInfoData);
    } catch (error) {
      toast.error('Failed to fetch allowance data');
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
      const deleteResult = await deleteAllowanceApi(rowData.pkey);
      setOpenDeleteConfirm(false);
      if (deleteResult.isSuccess) {
        // fetchAllowanceData();
        fetchAllowanceInfoData();
        toast.success('Delete Allowance successfully');
      } else {
        toast.error(deleteResult.message);
      }
    } catch {
      toast.error('Delete Allowance failed');
    }
  };

  const onCreate = () => {
    setAction('create');
    setRowData({});
    setOpen(true);
  };

  const onAction = async (data) => {
    try {
      data.comId = user.comId;
      if (data && data.pay) data.pay = Number(data.pay);
      if (!data.pay) delete data.pay;
      if (action === 'create') {
        const resultCreate = await createAllowanceApi(data);
        if (resultCreate.isSuccess) {
          toast.success('Create allowance successfully');
          setOpen(false);
        } else toast.error(resultCreate.message);
      } else if (action === 'edit' && rowData.pkey) {
        const resultUpdate = await updateAllowanceApi(data, rowData.pkey);
        if (resultUpdate.isSuccess) {
          toast.success('Update allowance successfully');
          setOpen(false);
        } else toast.error(resultUpdate.message);
      } else {
        toast.error('Allowance not found');
      }
      // fetchAllowanceData();
      fetchAllowanceInfoData();
      setDisableBtn(false);
    } catch {
      toast.error(`${action === 'edit' ? 'Update' : 'Create'} Allowance failed`);
      setDisableBtn(false);
    }
  };

  const onActionUpload = async (updateData, createData) => {
    try {
      if ((updateData && updateData.length > 0) || (createData && createData.length > 0)) {
        const proceed = confirm('Có dữ liệu thay đổi! Bạn có muốn tiếp tục không?');
        if (proceed) {
          let cusUpdateData = [];
          if (updateData && updateData.length > 0) {
            cusUpdateData = updateData.map((i) => ({
              ...i,
              pay: Number(i.pay),
              comId: user.comId
            }));
          }

          let cusCreateData = [];
          if (createData && createData.length > 0) {
            cusCreateData = createData.map((i) => ({
              ...i,
              pay: Number(i.pay),
              comId: user.comId
            }));
          }

          const resultCreate = await uploadAllowanceApi({
            updateData: cusUpdateData,
            createData: cusCreateData
          });
          if (resultCreate.isSuccess) {
            toast.success('Upload allowance successfully');
            setOpenWarning(false);
          } else toast.error(resultCreate.message);
        }
      }
    } catch (error) {
      console.log('error', error);
      toast.error(`Upload failed`);
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
        accessorKey: 'type',
        header: () => 'Type',
        minSize: 60
      },
      {
        accessorKey: 'pay',
        header: () => 'Pay',
        cell: ({ row }) => {
          const value = row.getValue('pay');
          const payCus = value ? formatNumber(value) : '';
          return <span>{payCus}</span>;
        },
        minSize: 150
      },

      {
        accessorKey: 'startDate',
        header: () => 'Start Date',
        cell: ({ row }) => {
          const value = row.getValue('startDate');
          const valueCus = value ? dayjs(value).format('DD-MM-YYYY') : '';
          return <span>{valueCus}</span>;
        },
        minSize: 150
      },
      {
        accessorKey: 'endDate',
        header: () => 'End Date',
        cell: ({ row }) => {
          const value = row.getValue('endDate');
          const valueCus = value ? dayjs(value).format('DD-MM-YYYY') : '';
          return <span>{valueCus}</span>;
        },
        minSize: 150
      },
      {
        accessorKey: 'comments',
        header: () => 'Comment',
        minSize: 250
      },
      {
        accessorKey: 'company',
        header: () => 'Company',
        cell: ({ row }) => {
          const value = row.getValue('company');
          const valueCus = value ? value.name : '';
          return <span>{valueCus}</span>;
        },
        minSize: 150
      },
      {
        accessorKey: 'function',
        header: () => 'Function',
        cell: ({ row }) => {
          const value = row.getValue('function');
          const valueCus = value ? value.vnName || value.enName : '';
          return <span>{valueCus}</span>;
        },
        minSize: 150
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

  const handleButtonClick = () => {
    fileInputRef.current.click(); // mở dialog chọn file
  };

  const handleFileChange = (event) => {
    try {
      const headerKey = ['employeeId', 'type', 'pay', 'startDate', 'endDate', 'comments'];
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '', raw: false, header: headerKey });
        const dataWithoutFirstRow = rows.slice(1);
        const invalidRows = dataWithoutFirstRow.filter((r) => {
          if (!r.startDate || r.startDate.trim() === '') {
            r.startDate = 'Error: Start Date is required';
            console.log('start date empty');
            return r;
          } else if (r.startDate && isNaN(new Date(r.startDate).getTime())) {
            r.startDate = 'Error: Start Date is invalid';
            console.log('start date invalid');
            return r;
          }
          if (!r.employeeId || r.employeeId.trim() === '') {
            r.employeeId = 'Error: Employee Code is required';
            console.log('employee code invalid');
            return r;
          } else if (r.employeeId.length > 10) {
            r.employeeId = 'Error: Employee Code is too long';
            console.log('employee code too long');
            return r;
          }
          if (!r.type || r.type.trim() === '') {
            r.type = 'Error: Allowance Type is required';
            console.log('allowance type is required');
            return r;
          } else if (allowTypeData.findIndex((i) => i.code === r.type) < 0) {
            r.type = 'Error: Allowance Type is invalid';
            console.log('allowance type is invalid');
            return r;
          }
          if (!r.pay || r.pay.trim() === '') {
            r.pay = 'Error: Pay is required';
            console.log('Pay is required');
            return r;
          } else if (isNaN(Number(r.pay))) {
            r.pay = 'Error: Pay is invalid';
            console.log('Pay is invalid');
            return r;
          }
        });
        if (invalidRows.length > 0) {
          setWarningData({
            valid: false,
            validData: invalidRows
          });
          setOpenWarning(true);
          event.target.value = '';
          return;
        }
        const result = await checkAllowanceApi(dataWithoutFirstRow);
        setWarningData({
          valid: true,
          toCreate: result.data.toCreate || [],
          toUpdate: result.data.toUpdate || []
        });
        setOpenWarning(true);
        event.target.value = '';
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      event.target.value = '';
    }
  };

  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid display="flex" alignItems="center">
          <TextField
            variant="outlined"
            label="Search ..."
            size="small"
            sx={{
              width: 250,
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#ffffff',
                height: '32px'
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
            options={allowTypeData || []}
            getOptionLabel={(option) => option?.name || ''}
            value={allowTypeData.find((item) => item.code === selectedAllowanceType) || null}
            onChange={(event, newValue) => {
              setSelectedAllowanceType(newValue ? newValue.code : '');
            }}
            sx={{
              width: 250,
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#ffffff',
                height: '32px' // Hoặc cùng chiều cao với TextField
              },
              '& .MuiInputBase-input': {
                padding: '8px 14px'
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Type"
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
                height: '32px'
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
                height: '32px' // Hoặc cùng chiều cao với TextField
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
                height: '32px'
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
                height: '32px'
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
          <input type="file" accept=".xlsx,.xls,.csv" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<UploadFile />}
            onClick={handleButtonClick}
            style={{ backgroundColor: '#0a3780' }}
          >
            Import
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<Refresh />}
            onClick={fetchAllowanceInfoData}
            style={{ backgroundColor: '#4caf50' }}
          >
            Refresh
          </Button>

          <Button variant="contained" color="primary" size="small" startIcon={<Add />} onClick={() => onCreate()}>
            Create
          </Button>
        </Grid>
        <CommonTable data={allowanceInfoFilterData} columns={columns} searchQuery={searchQuery} tableHeight={310} />
      </Grid>
      <AllowanceModal
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
      />
      <AllowanceDeleteConfirm
        open={openDeleteConfirm}
        setOpen={setOpenDeleteConfirm}
        onConfirm={onConfirmDelete}
        data={rowData}
        allowTypeData={allowTypeData}
      />
      <AllowanceWarningModal
        open={openWarning}
        setOpen={setOpenWarning}
        data={warningData}
        onAction={onActionUpload}
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
      />
    </>
  );
};

export default Allowance;
