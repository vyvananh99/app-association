import React, { useState, useEffect, useMemo } from 'react';

// material-ui
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Grid from '@mui/material/Grid';
import { Box, Button, Modal, TextField } from '@mui/material';
import { toast } from 'react-toastify';

// project imports
import CommonTable from '../common/common-table';
import WorklevelModal from './worklevel-modal';
import WorklevelDeleteConfirm from './worklevel-delete-confirm';
import { Refresh, Add, Edit, Delete } from '@mui/icons-material';

import { getWorklevelApi, updateWorklevelApi, createWorklevelApi, deleteWorklevelApi } from 'api/worklevel.api';

const Worklevel = () => {
  const [worklevelData, setWorklevelData] = useState([]);
  const [rowData, setRowData] = useState(null);
  const [open, setOpen] = useState(false);
  const [currentId, setCurrentId] = useState();
  const [action, setAction] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const worklevelData = await getWorklevelApi();
      setWorklevelData(worklevelData);
    } catch (error) {
      toast.error('Failed to fetch Worklevel');
    }
  };

  const onEdit = (data) => {
    setAction('edit');
    setCurrentId(data.pkey);
    setOpen(true);
    setRowData(data);
  };

  const onDelete = (data) => {
    setRowData(data);
    setOpenDeleteConfirm(true);
  };

  const onConfirmDelete = async (data) => {
    try {
      const deleteResult = await deleteWorklevelApi(data.pkey);
      setOpenDeleteConfirm(false);
      if (deleteResult.isSuccess) {
        fetchData(); // Đảm bảo dữ liệu được cập nhật ngay sau khi xóa
        toast.success('Delete Worklevel successfully');
      } else {
        toast.error(deleteResult.message);
      }
    } catch {
      toast.error('Delete Worklevel failed');
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
        const resultCreate = await createWorklevelApi(data);
        if (resultCreate.isSuccess) toast.success('Create Worklevel successfully');
        else toast.error(resultCreate.message);
      } else if (action === 'edit' && currentId) {
        const resultUpdate = await updateWorklevelApi(data, currentId);
        if (resultUpdate.isSuccess) toast.success('Update Worklevel successfully');
        else toast.error(resultUpdate.message);
      } else {
        toast.error('Worklevel not found');
      }
      setOpen(false);
      fetchData(); // Cập nhật dữ liệu sau khi tạo/ cập nhật
    } catch {
      toast.error(`${action === 'edit' ? 'Update' : 'Create'} Worklevel failed`);
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
        accessorKey: 'payPos',
        header: () => 'Pay Position',
        minSize: 250
      },
      {
        accessorKey: 'levels',
        header: () => 'Level',
        minSize: 250
      },
      {
        accessorKey: 'payPoint',
        header: () => '100% Pay Point',
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
      <CommonTable data={worklevelData} columns={columns} searchQuery={searchQuery} tableHeight={310} />
      <WorklevelModal open={open} setOpen={setOpen} rowData={rowData} onAction={onAction} action={action} />
      <WorklevelDeleteConfirm open={openDeleteConfirm} setOpen={setOpenDeleteConfirm} onConfirm={onConfirmDelete} data={rowData} />
    </Grid>
  );
};

export default Worklevel;
