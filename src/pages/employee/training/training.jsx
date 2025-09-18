import React, { useState, useMemo, useEffect } from 'react';
import { Box, Grid, Button } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { toast } from 'react-toastify';
import MainCard from 'components/MainCard';
import { InfoOutline } from '@mui/icons-material';
import CommonTable from '../../common/common-table';
import TrainingModal from './training-modal';
import TrainingDeleteConfirm from './Training-delete-confirm';
import {
  getTrainingByParticipantApi,
  getTrainingParticipantsApi,
  createTrainingApi,
  updateTrainingApi,
  deleteTrainingApi
} from 'api/training.api';
import dayjs from 'dayjs';

const Training = ({ action, onClose, otherListData, rowData, companyData, employeeData, coursesData, otherListNData }) => {
  const [actionModal, setActionModal] = useState();
  const [openParticipants, setOpenParticipants] = useState(false);
  const [participantsData, setParticipantsData] = useState([]);
  const [selectedParticipantsData, setSelectedParticipantsData] = useState({});
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [disableParticipantsBtn, setDisableParticipantsBtn] = useState(false);
  const [courseData, setCourseData] = useState([]);

  useEffect(() => {
    fetchTrainingData();
  }, []);

  const fetchTrainingData = async () => {
    try {
      const getParticipantsData = await getTrainingByParticipantApi(rowData.employeeId);
      if (getParticipantsData?.data) {
        setParticipantsData(getParticipantsData.data);
        const listCourseIds = [...new Set(getParticipantsData.data.map((item) => item.courseId))];
        const filteredCourses = coursesData.filter((course) => listCourseIds.includes(course.courseId));
        setCourseData(filteredCourses || []);
      }
    } catch (error) {
      toast.error('Failed to fetch Participants');
    }
  };

  const onCreate = () => {
    setActionModal('create');
    setOpenParticipants(true);
    setSelectedParticipantsData({});
  };

  const onEdit = (data) => {
    setActionModal('edit');
    setSelectedParticipantsData(data);
    setOpenParticipants(true);
  };

  const onDelete = (data) => {
    setOpenDeleteConfirm(true);
    setSelectedParticipantsData(data);
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
        size: 100,
        cell: ({ row }) => (
          <Box display="flex" gap={1} flexWrap="nowrap" alignItems="center" sx={{ whiteSpace: 'nowrap' }}>
            <Button variant="contained" color="primary" size="small" startIcon={<InfoOutline />} onClick={() => onEdit(row.original)}>
              Info
            </Button>
          </Box>
        )
      }
    ],
    []
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: '100%' }}>
        <MainCard>
          {/* Modal Content */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              height: {
                xs: 'calc(80vh - 50px)',
                xl: 'calc(80vh - 10px)'
              }
            }}
          >
            <CommonTable data={courseData} columns={columns} tableHeight={'90%'} />
          </Box>
        </MainCard>
      </Box>
      <TrainingModal
        open={openParticipants}
        setOpen={setOpenParticipants}
        rowData={selectedParticipantsData}
        otherListNData={otherListNData}
      ></TrainingModal>
    </LocalizationProvider>
  );
};

export default Training;
