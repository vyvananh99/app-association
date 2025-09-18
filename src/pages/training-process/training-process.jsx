import React, { useState, useEffect, useMemo } from 'react';

// material-ui
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Grid from '@mui/material/Grid';
import { Box, Button, Modal, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

// project imports
import MainCard from 'components/MainCard';
import CommonTable from '../common/common-table';
import TrainingProcessModal from './training-process-modal';
import ParticipantsModal from './participants-modal';
import TrainingProcessDeleteConfirm from './training-process-delete-confirm';
import { Refresh, Add, Edit, Delete, PeopleAlt } from '@mui/icons-material';
import {
  getCoursesApi,
  updateCoursesApi,
  createCoursesApi,
  deleteCoursesApi
} from 'api/courses.api';
import { getOtherListNApi } from 'api/other-list-n.api';
import { getEmployeeInfoApi } from 'api/employee.api';
import { getOtherListApi } from 'api/other-list.api';

const TrainingProcess = () => {
  const [trainingProcessData, setTrainingProcessData] = useState([]);
  const [rowData, setRowData] = useState(null);
  const [open, setOpen] = useState(false);
  const [currentId, setCurrentId] = useState();
  const [action, setAction] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [otherListNData, setOtherListN] = useState([]);
  const [disableBtn, setDisableBtn] = useState(false);
  const [openParticipants, setOpenParticipants] = useState(false);
  const [emloyeeInfoData, setEmloyeeInfoData] = useState([]);
  const [otherListData, setOtherListData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await fetchEmployeeInfoData();
    await fetchOtherListNData();
    await fetchOtherListData();
    await fetchTrainingData();
  };

  const fetchTrainingData = async () => {
    try {
      const getTrainingProcessData = await getCoursesApi();
      setTrainingProcessData(getTrainingProcessData.data || []);
    } catch (error) {
      toast.error('Failed to fetch TrainingProcess');
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

  const fetchEmployeeInfoData = async () => {
    try {
      const getEmployeeInfoData = await getEmployeeInfoApi();
      setEmloyeeInfoData(getEmployeeInfoData.data || []);
    } catch (error) {
      toast.error('Failed to fetch employee info');
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
      const deleteResult = await deleteCoursesApi(data.pkey);
      setOpenDeleteConfirm(false);
      if (deleteResult.isSuccess) {
        fetchTrainingData(); // Đảm bảo dữ liệu được cập nhật ngay sau khi xóa
        toast.success('Delete TrainingProcess successfully');
      } else {
        toast.error(deleteResult.message);
      }
    } catch {
      toast.error('Delete TrainingProcess failed');
    }
  };

  const onCreate = () => {
    setAction('create');
    setRowData({});
    setOpen(true);
  };

  const onAction = async (data) => {
    try {
      if (data && data.costEmp) data.costEmp = Number(data.costEmp);
      if (data && data.totalCost) data.totalCost = Number(data.totalCost);
      if (!data.courseScope) delete data.courseScope;
      if (!data.manday) delete data.manday;
      if (!data.costEmp) delete data.costEmp;
      if (!data.totalCost) delete data.totalCost;
      if (!data.slot) delete data.slot;
      if (action === 'create') {
        const resultCreate = await createCoursesApi(data);
        if (resultCreate.isSuccess) {
          toast.success('Create training process successfully');
          setOpen(false);
        } else toast.error(resultCreate.message);
      } else if (action === 'edit' && currentId) {
        const resultUpdate = await updateCoursesApi(data, currentId);
        if (resultUpdate.isSuccess) {
          toast.success('Update training process successfully');
          setOpen(false);
        } else toast.error(resultUpdate.message);
      } else {
        toast.error('TrainingProcess not found');
      }
      fetchTrainingData(); // Cập nhật dữ liệu sau khi tạo/ cập nhật
      setDisableBtn(false);
    } catch {
      toast.error(`${action === 'edit' ? 'Update' : 'Create'} TrainingProcess failed`);
      setDisableBtn(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const participants = (data) => {
    setCurrentId(data.pkey);
    setOpenParticipants(true);
    setRowData(data);
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
        accessorKey: 'courseId',
        header: () => 'Course Code',
        minSize: 250
      },
      {
        accessorKey: 'courseTitle',
        header: () => 'Course Title',
        minSize: 250
      },
      {
        accessorKey: 'startDate',
        header: () => 'Start Date',
        cell: ({ row }) => {
          const value = row.getValue('startDate');
          const dateCus = value ? dayjs(value).format('DD-MM-YYYY') : '';
          return <span>{dateCus}</span>;
        },
        minSize: 100
      },
      {
        accessorKey: 'endDate',
        header: () => 'End Date',
        cell: ({ row }) => {
          const value = row.getValue('endDate');
          const dateCus = value ? dayjs(value).format('DD-MM-YYYY') : '';
          return <span>{dateCus}</span>;
        },
        minSize: 100
      },
      {
        id: 'actions',
        header: '',
        size: 285,
        cell: ({ row }) => (
          <Box display="flex" gap={1} flexWrap="nowrap" alignItems="center" sx={{ whiteSpace: 'nowrap' }}>
            <Button variant="contained" color="primary" size="small" startIcon={<PeopleAlt />} onClick={() => participants(row.original)}>
              Participants
            </Button>
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
          onClick={fetchTrainingData}
          style={{ backgroundColor: '#4caf50' }}
        >
          Refresh
        </Button>

        <Button variant="contained" color="primary" size="small" startIcon={<Add />} onClick={() => onCreate()}>
          Create
        </Button>
      </Grid>
      <CommonTable data={trainingProcessData} columns={columns} searchQuery={searchQuery} tableHeight={310} />
      <TrainingProcessModal
        open={open}
        setOpen={setOpen}
        rowData={rowData}
        onAction={onAction}
        action={action}
        otherListNData={otherListNData}
        setDisableBtn={setDisableBtn}
        disableBtn={disableBtn}
      />
      {/* <TrainingProcessModal
        open={open}
        setOpen={setOpen}
        rowData={rowData}
        onAction={onAction}
        action={action}
        otherListNData={otherListNData}
        setDisableBtn={setDisableBtn}
        disableBtn={disableBtn}
      /> */}
      <ParticipantsModal
        open={openParticipants}
        setOpen={setOpenParticipants}
        rowData={rowData}
        onAction={onAction}
        action={action}
        otherListNData={otherListNData}
        setDisableBtn={setDisableBtn}
        disableBtn={disableBtn}
        employeeData={emloyeeInfoData}
        otherListData={otherListData}
      ></ParticipantsModal>
      <TrainingProcessDeleteConfirm open={openDeleteConfirm} setOpen={setOpenDeleteConfirm} onConfirm={onConfirmDelete} rowData={rowData} />
    </Grid>
  );
};

export default TrainingProcess;
