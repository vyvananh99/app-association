import React, { useState, useEffect, useMemo } from 'react';

// material-ui
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Grid from '@mui/material/Grid';
import { Box, Button, Modal, TextField } from '@mui/material';
import { toast } from 'react-toastify';

// project imports
import MainCard from 'components/MainCard';
import CommonTable from '../common/common-table';
import EmployeeModal from './employee-modal';
import EmployeeDeleteConfirm from './employee-delete-confirm';
import { Refresh, Add, Edit, Delete } from '@mui/icons-material';

import { getEmployeeApi, updateEmployeeApi, createEmployeeApi, deleteEmployeeApi } from 'api/employee.api';
import { getCompanyApi } from 'api/company.api';
import { getLocationApi } from 'api/location.api';
import { getDepartmentApi } from 'api/department.api';
import { getSectionApi } from 'api/section.api';
import { getFunctionApi } from 'api/function.api';
import { getPositionApi } from 'api/position.api';
import { getCostCenterApi } from 'api/cost-center.api';
import { getJobTypeApi } from 'api/job-type.api';
import { getContractTypeApi } from 'api/contract-type.api';
import { getOtherListNApi } from 'api/other-list-n.api';
import { getOtherListApi } from 'api/other-list.api';
import { getProvinceApi } from 'api/province.api';
import { getCityApi } from 'api/city.api';
import { getWorklevelApi } from 'api/worklevel.api';
import { getCoursesApi } from 'api/courses.api';

const Employee = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [rowData, setRowData] = useState(null);
  const [open, setOpen] = useState(false);
  const [currentId, setCurrentId] = useState();
  const [action, setAction] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
    currentPaging: 1
  });
  const [companyData, setCompanyData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [sectionData, setSectionData] = useState([]);
  const [functionData, setFunctionData] = useState([]);
  const [positionData, setPositionData] = useState([]);
  const [costCenterData, setCostCenterData] = useState([]);
  const [jobTypeData, setJobTypeData] = useState([]);
  const [contractTypeData, setContractTypeData] = useState([]);
  const [otherListNData, setOtherListN] = useState([]);
  const [otherListData, setOtherListData] = useState([]);
  const [provinceData, setProvinceData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [worklevelData, setWorklevelData] = useState([]);
  const [coursesData, setCoursesData] = useState([]);

  useEffect(() => {
    fetchCompanyData();
    fetchLocationData();
    fetchDepartmentData();
    fetchSectionData();
    fetchFunctionData();
    fetchPositionData();
    fetchCostCenterData();
    fetchJobTypeData();
    fetchContractTypeData();
    fetchOtherListNData();
    fetchOtherListData();
    fetchProvinceData();
    fetchCityData();
    fetchWorkLevelData();
    fetchCoursesData();
    fetchData();
  }, []);

  const fetchCoursesData = async () => {
    try {
      const getCoursesData = await getCoursesApi();
      setCoursesData(getCoursesData.data || []);
    } catch (error) {
      toast.error('Failed to fetch courses');
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

  const fetchOtherListData = async () => {
    try {
      const getOtherListData = await getOtherListApi();
      setOtherListData(getOtherListData);
    } catch (error) {
      toast.error('Failed to fetch other list');
    }
  };

  const fetchProvinceData = async () => {
    try {
      const getProvinceData = await getProvinceApi();
      setProvinceData(getProvinceData);
    } catch (error) {
      toast.error('Failed to fetch province');
    }
  };

  const fetchCityData = async () => {
    try {
      const getCityData = await getCityApi();
      setCityData(getCityData);
    } catch (error) {
      toast.error('Failed to fetch province');
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

  const fetchDepartmentData = async () => {
    const getDepartmentData = await getDepartmentApi();
    setDepartmentData(getDepartmentData);
    // getDepartmentData.length > 0 && setSelectedDepartment(getDepartmentData[0].id);
  };

  const fetchSectionData = async () => {
    const getSectionData = await getSectionApi();
    setSectionData(getSectionData);
  };

  const fetchFunctionData = async () => {
    try {
      const getfunctiondata = await getFunctionApi();
      setFunctionData(getfunctiondata);
      // if (getfunctiondata.length > 0) setSelectedFunction(getfunctiondata[0].id);
    } catch (error) {
      toast.error('Failed to fetch functions');
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

  const fetchCostCenterData = async () => {
    try {
      const getCostCenterdata = await getCostCenterApi();
      setCostCenterData(getCostCenterdata);
    } catch (error) {
      toast.error('Failed to fetch Cost Center');
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

  const fetchContractTypeData = async () => {
    try {
      const getContractTypeData = await getContractTypeApi();
      setContractTypeData(getContractTypeData);
    } catch (error) {
      toast.error('Failed to fetch ContractType');
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

  const fetchWorkLevelData = async () => {
    try {
      const getWorkLevelData = await getWorklevelApi();
      setWorklevelData(getWorkLevelData);
    } catch (error) {
      toast.error('Failed to fetch Worklevel');
    }
  };

  const fetchData = async () => {
    try {
      const getEmployeeData = await getEmployeeApi();
      setEmployeeData(getEmployeeData);
    } catch (error) {
      toast.error('Failed to fetch companies');
    }
  };

  const onEdit = async (data) => {
    setAction('edit');
    setCurrentId(data.id);
    setOpen(true);
    setRowData(data);
  };

  const onDelete = (data) => {
    setRowData(data);
    setOpenDeleteConfirm(true);
  };

  const onConfirmDelete = async (data) => {
    try {
      const deleteResult = await deleteEmployeeApi(data.employeeId, data.comId);
      setOpenDeleteConfirm(false);
      if (deleteResult.isSuccess) {
        fetchData(); // Đảm bảo dữ liệu được cập nhật ngay sau khi xóa
        toast.success('Delete Employee successfully');
      } else {
        toast.error(deleteResult.message);
      }
    } catch {
      toast.error('Delete Employee failed');
    }
  };

  const onCreate = () => {
    setAction('create');
    setRowData({});
    setOpen(true);
  };

  const onAction = async (data) => {
    try {
      if (action === 'create') {
        const resultCreate = await createEmployeeApi(data);
        if (resultCreate.isSuccess) {
          toast.success('Create Employee successfully');
          fetchData();
        } else toast.error(resultCreate.message);
      } else if (action === 'edit' && currentId) {
        const resultUpdate = await updateEmployeeApi(data, currentId, rowData.comId, rowData.pkey);
        if (resultUpdate.isSuccess) {
          toast.success('Update Employee successfully');
          fetchData();
        } else toast.error(resultUpdate.message);
      } else {
        toast.error('Employee not found');
      }
      setOpen(false);
    } catch {
      toast.error(`${action === 'edit' ? 'Update' : 'Create'} Employee failed`);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'employeeId',
        header: () => 'Employee Id',
        minSize: 100
      },
      {
        accessorKey: 'vnNameFirst',
        header: () => 'First Name',
        minSize: 250
      },
      {
        accessorKey: 'vnNameLast',
        header: () => 'Last Name',
        minSize: 250
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
    <Grid container spacing={2} alignItems="center">
      <Grid display="flex" alignItems="center">
        <TextField
          variant="outlined"
          label="Search ..."
          sx={{
            width: {
              xs: '100%',
              md: '300px'
            },
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#ffffff'
            }
          }}
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </Grid>

      <Grid display="flex" justifyContent="flex-end" marginLeft="auto" gap={1}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<Refresh />}
          onClick={() => fetchData()}
          style={{ backgroundColor: '#4caf50' }}
        >
          Refresh
        </Button>

        <Button variant="contained" color="primary" size="small" startIcon={<Add />} onClick={() => onCreate()}>
          Create
        </Button>
      </Grid>
      <CommonTable data={employeeData} columns={columns} searchQuery={searchQuery} tableHeight={'calc(100vh - 270px)'} />
      <EmployeeModal
        open={open}
        setOpen={setOpen}
        rowData={rowData}
        onAction={onAction}
        action={action}
        companyData={companyData}
        locationData={locationData}
        departmentData={departmentData}
        sectionData={sectionData}
        functionData={functionData}
        positionData={positionData}
        costCenterData={costCenterData}
        jobTypeData={jobTypeData}
        contractTypeData={contractTypeData}
        otherListNData={otherListNData}
        otherListData={otherListData}
        provinceData={provinceData}
        cityData={cityData}
        fetchData={fetchData}
        worklevelData={worklevelData}
        coursesData={coursesData}
      />
      <EmployeeDeleteConfirm
        rowData={rowData}
        open={openDeleteConfirm}
        setOpen={setOpenDeleteConfirm}
        onConfirm={onConfirmDelete}
        data={rowData}
        companyData={companyData}
      />
    </Grid>
  );
};

export default Employee;
