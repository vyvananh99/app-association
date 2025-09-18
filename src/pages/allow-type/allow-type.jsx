import React, { useState, useEffect, useMemo } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import { Box, Button, Modal, TextField } from '@mui/material';
import { toast } from 'react-toastify';

// project imports
import CommonTable from '../common/common-table';
import AllowTypeModal from './allow-type-modal';
import AllowTypeDeleteConfirm from './allow-type-delete-confirm';
import { Refresh, Add, Edit, Delete } from '@mui/icons-material';

import { getAllowTypeApi, updateAllowTypeApi, createAllowTypeApi, deleteAllowTypeApi } from 'api/allow-type.api';
import { getOtherListNApi } from 'api/other-list-n.api';

const AllowType = () => {
  const [allowTypeData, setAllowTypeData] = useState([]);
  const [otherListNData, setOtherListN] = useState([]);
  const [rowData, setRowData] = useState(null);
  const [open, setOpen] = useState(false);
  const [currentId, setCurrentId] = useState();
  const [action, setAction] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchData();
    fetchOtherListNData();
  }, []);
  const fetchData = async () => {
    try {
      const getAllowTypeData = await getAllowTypeApi();
      setAllowTypeData(getAllowTypeData);
    } catch (error) {
      toast.error('Failed to fetch Allow Type');
    }
  };

  const fetchOtherListNData = async () => {
    try {
      const getOtherListNData = await getOtherListNApi();
      const getOtherListNDataFilter = getOtherListNData && getOtherListNData.filter((i) => i.type === 'ALLOWANCE');
      setOtherListN(getOtherListNDataFilter);
    } catch (error) {
      toast.error('Failed to fetch Other List N');
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
      const deleteResult = await deleteAllowTypeApi(data.id);
      setOpenDeleteConfirm(false);
      if (deleteResult.isSuccess) {
        fetchData(); // Đảm bảo dữ liệu được cập nhật ngay sau khi xóa
        toast.success('Delete Allow Type successfully');
      } else {
        toast.error(deleteResult.message);
      }
    } catch {
      toast.error('Delete Allow Type failed');
    }
  };

  const onCreate = () => {
    setAction('create');
    setRowData({});
    setOpen(true);
  };

  const onAction = async (data) => {
    try {
      if (data.tax) data.tax = 'X';
      else data.tax = '';
      if (action === 'create') {
        const resultCreate = await createAllowTypeApi(data);
        if (resultCreate.isSuccess) toast.success('Create Allow Type successfully');
        else toast.error(resultCreate.message);
      } else if (action === 'edit' && currentId) {
        const resultUpdate = await updateAllowTypeApi(data, currentId);
        if (resultUpdate.isSuccess) toast.success('Update Allow Type successfully');
        else toast.error(resultUpdate.message);
      } else {
        toast.error('Allow Type not found');
      }
      setOpen(false);
      fetchData(); // Cập nhật dữ liệu sau khi tạo/ cập nhật
    } catch {
      toast.error(`${action === 'edit' ? 'Update' : 'Create'} Allow Type failed`);
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
        size: 70
      },
      {
        accessorKey: 'name',
        header: () => 'Name',
        minSize: 250
      },
      {
        accessorKey: 'pay',
        header: () => 'Pay',
        minSize: 100
      },
      {
        accessorKey: 'tax',
        header: () => 'Tax',
        minSize: 100
      },
      {
        accessorKey: 'l1',
        header: () => 'L1',
        minSize: 100
      },
      {
        accessorKey: 'l2',
        header: () => 'L2',
        minSize: 100
      },
      {
        accessorKey: 'l3',
        header: () => 'L3',
        minSize: 100
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
    <Grid sx={{ width: '100%' }} container spacing={2} alignItems="center">
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
      <CommonTable data={allowTypeData} columns={columns} searchQuery={searchQuery} tableHeight={310} />
      <AllowTypeModal open={open} setOpen={setOpen} rowData={rowData} onAction={onAction} action={action} otherListNData={otherListNData} />
      <AllowTypeDeleteConfirm open={openDeleteConfirm} setOpen={setOpenDeleteConfirm} onConfirm={onConfirmDelete} data={rowData} />
    </Grid>
  );
};

export default AllowType;
