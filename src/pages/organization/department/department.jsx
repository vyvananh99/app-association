import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Box, Button, Grid, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import { Refresh, Add, Edit, Delete } from '@mui/icons-material';

// project imports
import MainCard from 'components/MainCard';
import CommonTable from '../../common/common-table';
import DepartmentModal from './department-modal';
import DepartmentDeleteConfirm from './department-delete-confirm';
import { getDepartmentApi, updateDepartmentApi, createDepartmentApi, deleteDepartmentApi } from 'api/department.api';

const Department = ({ companyData, selectedCompany, setSelectedCompany, departmentData, setDepartmentData }) => {
  const [dataFilter, setDataFilter] = useState([]);
  const [rowData, setRowData] = useState(null);
  const [open, setOpen] = useState(false);
  const [currentId, setCurrentId] = useState();
  const [action, setAction] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  const fetchData = async () => {
    const getDepartmentData = await getDepartmentApi();
    setDepartmentData(getDepartmentData);
  };

  const updateDepartmentFilter = () => {
    if (departmentData) {
      const departmentDataFilter = departmentData.filter((department) => department.comId === selectedCompany);
      setDataFilter(departmentDataFilter);
    }
  };

  useEffect(() => {
    updateDepartmentFilter();
  }, [departmentData, selectedCompany]);

  const columns = useMemo(
    () => [
      {
        id: 'no',
        header: () => 'No.',
        size: 70,
        cell: ({ row }) => row.index + 1
      },
      {
        accessorKey: 'id',
        header: () => 'Code',
        size: 100
      },
      {
        accessorKey: 'enName',
        header: () => 'English Name',
        minSize: 250
      },
      {
        accessorKey: 'vnName',
        header: () => 'Vietnamese Name',
        minSize: 350
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

  const onEdit = (data) => {
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
      const deleteResult = await deleteDepartmentApi(data.id, data.comId);
      setOpenDeleteConfirm(false);
      if (deleteResult.isSuccess) {
        fetchData(); // Đảm bảo dữ liệu được cập nhật ngay sau khi xóa
        toast.success('Delete department successfully');
      } else {
        toast.error(deleteResult.message);
      }
    } catch {
      toast.error('Delete Department failed');
    }
  };

  const onCreate = () => {
    setAction('create');
    setRowData({});
    setOpen(true);
  };

  const handleDepartmentAction = async (data) => {
    try {
      data.comId = selectedCompany;
      if (action === 'create') {
        const resultCreate = await createDepartmentApi(data);
        if (resultCreate.isSuccess) toast.success('Update department successfully');
        else toast.error(resultUpdate.message);
      } else if (action === 'edit' && currentId) {
        const resultUpdate = await updateDepartmentApi(data, currentId);
        if (resultUpdate.isSuccess) toast.success('Update Department successfully');
        else toast.error(resultUpdate.message);
      } else {
        toast.error('Department not found');
      }
      setOpen(false);
      await fetchData();
    } catch {
      toast.error(`${action === 'edit' ? 'Update' : 'Create'} Department failed`);
    }
  };

  const handleChangeCompany = (e) => {
    setSelectedCompany(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid display="flex" alignItems="center">
        <FormControl
          fullWidth
          sx={{
            width: '350px',
            backgroundColor: '#ffffff'
          }}
        >
          <InputLabel shrink={true} id="company-select">
            Comany
          </InputLabel>
          <Select
            labelId="company-select"
            id="company-simple-select"
            value={selectedCompany}
            label="Comany"
            onChange={(e) => handleChangeCompany(e)}
            sx={{
              width: '100%', // Ensure the select takes the full width of its parent
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#ffffff' // Background color for the TextField
              }
            }}
          >
            {companyData &&
              companyData.map((i) => (
                <MenuItem key={i.id} value={i.id}>
                  {i.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Grid>

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
          startIcon={<Refresh />} // Thêm icon Refresh
          onClick={() => fetchData()}
          style={{ backgroundColor: '#4caf50' }} // Màu nút "Refresh"
        >
          Refresh
        </Button>

        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<Add />} // Thêm icon Add
          onClick={() => onCreate()}
        >
          Create
        </Button>
      </Grid>

      <CommonTable data={dataFilter} columns={columns} searchQuery={searchQuery} tableHeight={290} />
      <DepartmentModal open={open} setOpen={setOpen} rowData={rowData} onAction={handleDepartmentAction} action={action} />
      <DepartmentDeleteConfirm
        open={openDeleteConfirm}
        setOpen={setOpenDeleteConfirm}
        onConfirm={onConfirmDelete}
        data={rowData}
      ></DepartmentDeleteConfirm>
    </Grid>
  );
};

export default Department;
