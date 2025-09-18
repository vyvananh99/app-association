import React, { useState, useEffect, useCallback, useMemo } from 'react';

// material-ui
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Box, Button, Grid, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import { toast } from 'react-toastify';

// project imports
import MainCard from 'components/MainCard';
import CommonTable from '../common/common-table';
import OtherListModal from './other-list-modal';
import OtherListDeleteConfirm from './other-list-delete-confirm';
import { Refresh, Add, Edit, Delete } from '@mui/icons-material';

import { getOtherListApi, updateOtherListApi, createOtherListApi, deleteOtherListApi } from 'api/other-list.api';
import { getOtherListXApi } from 'api/other-list-x.api';

const OtherList = () => {
  const [otherListData, setOtherListData] = useState([]);
  const [otherListdataFilter, setOtherListDataFilter] = useState([]);
  const [otherListXdata, setOtherListXData] = useState([]);
  const [selectedOtherListXdata, setSelectedOtherListXData] = useState([]);
  const [rowData, setRowData] = useState(null);
  const [open, setOpen] = useState(false);
  const [currentId, setCurrentId] = useState();
  const [action, setAction] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchData();
    fetchOtherListXData();
  }, []);
  // useCallback để tránh tạo lại hàm mỗi lần render
  const fetchData = async () => {
    try {
      const getOtherListData = await getOtherListApi();
      setOtherListData(getOtherListData);
    } catch (error) {
      toast.error('Failed to fetch Other List');
    }
  };

  useEffect(() => {
    if (otherListData.length > 0 && selectedOtherListXdata) {
      const newData = otherListData.filter((i) => i.type === selectedOtherListXdata);
      setOtherListDataFilter(newData);
    }
  }, [otherListData, selectedOtherListXdata]);

  const fetchOtherListXData = async () => {
    try {
      const getOtherListXdata = await getOtherListXApi();
      setOtherListXData(getOtherListXdata);
      getOtherListXdata.length > 0 && setSelectedOtherListXData(getOtherListXdata[0].type);
    } catch (error) {
      toast.error('Failed to fetch Other List X');
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
      const deleteResult = await deleteOtherListApi(data.id);
      setOpenDeleteConfirm(false);
      if (deleteResult.isSuccess) {
        fetchData(); // Đảm bảo dữ liệu được cập nhật ngay sau khi xóa
        toast.success('Delete Other List successfully');
      } else {
        toast.error(deleteResult.message);
      }
    } catch {
      toast.error('Delete Other List failed');
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
        const resultCreate = await createOtherListApi(data);
        if (resultCreate.isSuccess) toast.success('Create Other List successfully');
        else toast.error(resultCreate.message);
      } else if (action === 'edit' && currentId) {
        const resultUpdate = await updateOtherListApi(data, currentId);
        if (resultUpdate.isSuccess) toast.success('Update Other List successfully');
        else toast.error(resultUpdate.message);
      } else {
        toast.error('OtherList not found');
      }
      setOpen(false);
      fetchData(); // Cập nhật dữ liệu sau khi tạo/ cập nhật
    } catch {
      toast.error(`${action === 'edit' ? 'Update' : 'Create'} OtherList failed`);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleChangeOtherListX = (e) => {
    setSelectedOtherListXData(e.target.value);
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
        accessorKey: 'name',
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
            {/* <Button variant="contained" color="error" size="small" startIcon={<Delete />} onClick={() => onDelete(row.original)}>
              Delete
            </Button> */}
          </Box>
        )
      }
    ],
    []
  );

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
            Type of list
          </InputLabel>
          <Select
            labelId="company-select"
            id="company-simple-select"
            value={selectedOtherListXdata}
            label="Comany"
            onChange={(e) => handleChangeOtherListX(e)}
            sx={{
              width: '100%', // Ensure the select takes the full width of its parent
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#ffffff' // Background color for the TextField
              }
            }}
          >
            {otherListXdata &&
              otherListXdata.map((i) => (
                <MenuItem key={i.type} value={i.type}>
                  {i.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Grid>

      {/* <Grid display="flex" alignItems="center">
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
      </Grid> */}

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

        {/* <Button variant="contained" color="primary" size="small" startIcon={<Add />} onClick={() => onCreate()}>
          Create
        </Button> */}
      </Grid>
      <CommonTable data={otherListdataFilter} columns={columns} searchQuery={searchQuery} tableHeight={310} />
      <OtherListModal open={open} setOpen={setOpen} rowData={rowData} onAction={onAction} action={action} />
      <OtherListDeleteConfirm open={openDeleteConfirm} setOpen={setOpenDeleteConfirm} onConfirm={onConfirmDelete} data={rowData} />
    </Grid>
  );
};

export default OtherList;
