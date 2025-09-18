import React, { useState, useEffect, useMemo } from 'react';

// material-ui
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Grid from '@mui/material/Grid';
import { Box, Button, MenuItem, TextField, FormControl, InputLabel, Select } from '@mui/material';
import { toast } from 'react-toastify';

// project imports
import MainCard from 'components/MainCard';
import CommonTable from '../common/common-table';
import PositionModal from './position-modal';
import PositionDeleteConfirm from './position-delete-confirm';
import { Refresh, Add, Edit, Delete } from '@mui/icons-material';

import { getPositionApi, updatePositionApi, createPositionApi, deletePositionApi } from 'api/position.api';
import { getFunctionApi } from 'api/function.api';

const Position = () => {
  const [positionData, setPositionData] = useState([]);
  const [functionData, setFunctionData] = useState([]);
  const [positiondataFilter, setPositionDataFilter] = useState([]);
  const [selectedFunction, setSelectedFunction] = useState('');
  const [rowData, setRowData] = useState(null);
  const [open, setOpen] = useState(false);
  const [currentId, setCurrentId] = useState();
  const [action, setAction] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchData();
    fetchFunctionData();
  }, []);

  // useCallback để tránh tạo lại hàm mỗi lần render
  const fetchData = async () => {
    try {
      const getPositionData = await getPositionApi();
      setPositionData(getPositionData);
    } catch (error) {
      toast.error('Failed to fetch companies');
    }
  };

  const fetchFunctionData = async () => {
    try {
      const getfunctiondata = await getFunctionApi();
      setFunctionData(getfunctiondata);
      if (getfunctiondata.length > 0) setSelectedFunction(getfunctiondata[0].id);
    } catch (error) {
      toast.error('Failed to fetch functions');
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
      const deleteResult = await deletePositionApi(data.id);
      setOpenDeleteConfirm(false);
      if (deleteResult.isSuccess) {
        fetchData(); // Đảm bảo dữ liệu được cập nhật ngay sau khi xóa
        toast.success('Delete Position successfully');
      } else {
        toast.error(deleteResult.message);
      }
    } catch {
      toast.error('Delete Position failed');
    }
  };

  const onCreate = () => {
    setAction('create');
    setRowData({});
    setOpen(true);
  };

  const onAction = async (data) => {
    try {
      data.funcId = selectedFunction;
      if (action === 'create') {
        const resultCreate = await createPositionApi(data);
        if (resultCreate.isSuccess) toast.success('Create Position successfully');
        else toast.error(resultCreate.message);
      } else if (action === 'edit' && currentId) {
        const resultUpdate = await updatePositionApi(data, currentId);
        if (resultUpdate.isSuccess) toast.success('Update Position successfully');
        else toast.error(resultUpdate.message);
      } else {
        toast.error('Position not found');
      }
      setOpen(false);
      fetchData(); // Cập nhật dữ liệu sau khi tạo/ cập nhật
    } catch {
      toast.error(`${action === 'edit' ? 'Update' : 'Create'} Position failed`);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleChangeFunction = (e) => {
    setSelectedFunction(e.target.value);
  };

  const updatePositionFilter = () => {
    if (positionData) {
      const positiondataFilter = positionData.filter((position) => position.funcId === selectedFunction);
      setPositionDataFilter(positiondataFilter);
    }
  };

  useEffect(() => {
    updatePositionFilter();
  }, [positionData, selectedFunction]);

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
        minSize: 100
      },
      {
        accessorKey: 'enName',
        header: () => 'English Name',
        minSize: 250
      },
      {
        accessorKey: 'vnName',
        header: () => 'Vietnamese Name',
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
        <FormControl
          fullWidth
          sx={{
            width: '350px',
            backgroundColor: '#ffffff'
          }}
        >
          <InputLabel id="company-select">Function</InputLabel>
          <Select
            labelId="company-select"
            id="company-simple-select"
            value={selectedFunction}
            label="Comany"
            onChange={(e) => handleChangeFunction(e)}
            sx={{
              width: '100%', // Ensure the select takes the full width of its parent
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#ffffff' // Background color for the TextField
              }
            }}
          >
            {functionData &&
              functionData.map((i) => (
                <MenuItem key={i.id} value={i.id}>
                  {i.enName}
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
      <CommonTable data={positiondataFilter} columns={columns} searchQuery={searchQuery} tableHeight={310} />
      <PositionModal open={open} setOpen={setOpen} rowData={rowData} onAction={onAction} action={action} />
      <PositionDeleteConfirm open={openDeleteConfirm} setOpen={setOpenDeleteConfirm} onConfirm={onConfirmDelete} data={rowData} />
    </Grid>
  );
};

export default Position;
