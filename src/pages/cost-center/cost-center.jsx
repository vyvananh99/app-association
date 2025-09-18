import React, { useState, useEffect, useCallback, useMemo } from 'react';

// material-ui
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Grid from '@mui/material/Grid';
import { Box, Button, Modal, TextField } from '@mui/material';
import { toast } from 'react-toastify';

// project imports
import MainCard from 'components/MainCard';
import CommonTable from '../common/common-table';
import CostCenterModal from './cost-center-modal';
import CostCenterDeleteConfirm from './cost-center-delete-confirm';
import { Refresh, Add, Edit, Delete } from '@mui/icons-material';

import { getCostCenterApi, updateCostCenterApi, createCostCenterApi, deleteCostCenterApi } from 'api/cost-center.api';

const CostCenter = () => {
  const [costCenterdata, setCostCenterData] = useState([]);
  const [rowData, setRowData] = useState(null);
  const [open, setOpen] = useState(false);
  const [currentId, setCurrentId] = useState();
  const [action, setAction] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);
  // useCallback để tránh tạo lại hàm mỗi lần render
  const fetchData = async () => {
    try {
      const getCostCenterdata = await getCostCenterApi();
      setCostCenterData(getCostCenterdata);
    } catch (error) {
      toast.error('Failed to fetch Cost Center');
    }
  };

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
      const deleteResult = await deleteCostCenterApi(data.id);
      setOpenDeleteConfirm(false);
      if (deleteResult.isSuccess) {
        fetchData(); // Đảm bảo dữ liệu được cập nhật ngay sau khi xóa
        toast.success('Delete Cost Center successfully');
      } else {
        toast.error(deleteResult.message);
      }
    } catch {
      toast.error('Delete Cost Center failed');
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
        const resultCreate = await createCostCenterApi(data);
        if (resultCreate.isSuccess) toast.success('Create Cost Center successfully');
        else toast.error(resultCreate.message);
      } else if (action === 'edit' && currentId) {
        const resultUpdate = await updateCostCenterApi(data, currentId);
        if (resultUpdate.isSuccess) toast.success('Update Cost Center successfully');
        else toast.error(resultUpdate.message);
      } else {
        toast.error('CostCenter not found');
      }
      setOpen(false);
      fetchData(); // Cập nhật dữ liệu sau khi tạo/ cập nhật
    } catch {
      toast.error(`${action === 'edit' ? 'Update' : 'Create'} CostCenter failed`);
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
        accessorKey: 'code',
        header: () => 'Code',
        minSize: 100
      },
      {
        accessorKey: 'description',
        header: () => 'Description',
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
          onClick={fetchData}
          style={{ backgroundColor: '#4caf50' }}
        >
          Refresh
        </Button>

        <Button variant="contained" color="primary" size="small" startIcon={<Add />} onClick={() => onCreate()}>
          Create
        </Button>
      </Grid>
      <CommonTable data={costCenterdata} columns={columns} searchQuery={searchQuery} tableHeight={310} />
      <CostCenterModal open={open} setOpen={setOpen} rowData={rowData} onAction={onAction} action={action} />
      <CostCenterDeleteConfirm open={openDeleteConfirm} setOpen={setOpenDeleteConfirm} onConfirm={onConfirmDelete} data={rowData} />
    </Grid>
  );
};

export default CostCenter;
