import React, { useState, useMemo, useEffect } from 'react';
import { Grid, Modal, Box, Typography, IconButton, Button, TextField, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import MainCard from 'components/MainCard';
import { Add, Edit, Delete } from '@mui/icons-material';
import CommonTable from '../common/common-table';
import ParticipantsActionModal from './participants-action-modal';
import ParticipantsDeleteConfirm from './participants-delete-confirm';
import { getTrainingApi, createTrainingApi, updateTrainingApi, deleteTrainingApi, getTrainingParticipantsApi } from 'api/training.api';
import dayjs from 'dayjs';

const ParticipantsModal = ({ open, setOpen, setDisableBtn, action, onClose, otherListData, rowData, employeeData }) => {
  const [actionModal, setActionModal] = useState();
  const [openParticipants, setOpenParticipants] = useState(false);
  const [participantsData, setParticipantsData] = useState([]);
  const [selectedParticipantsData, setSelectedParticipantsData] = useState({});
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [disableParticipantsBtn, setDisableParticipantsBtn] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setDisableBtn(true);
  };

  useEffect(() => {
    if (open && rowData?.courseId) fetchParticipantsData();
  }, [open, rowData?.courseId]);

  const fetchParticipantsData = async () => {
    try {
      const getParticipantsData = await getTrainingParticipantsApi(rowData.courseId);
      setParticipantsData(getParticipantsData.data);
    } catch (error) {
      toast.error('Failed to fetch Participants');
    }
  };

  const onAction = async (data) => {
    try {
      delete data.vnFullName;
      delete data.enFullName;
      delete data.joinDateState;
      delete data.birthDate;
      delete data.jobType;
      const updatedData = {
        ...data,
        funcId: data.funcId.toString(),
        courseId: rowData.courseId
      };
      if (actionModal === 'create') {
        const resultCreate = await createTrainingApi(updatedData);
        if (resultCreate.isSuccess) {
          toast.success('Create Participants successfully');
          fetchParticipantsData();
          setOpenParticipants(false);
        } else toast.error(resultCreate.message);
      } else if (actionModal === 'edit' && selectedParticipantsData.pkey) {
        const resultUpdate = await updateTrainingApi(updatedData, selectedParticipantsData.pkey);
        if (resultUpdate.isSuccess) {
          toast.success('Update Participants successfully');
          fetchParticipantsData();
          setOpenParticipants(false);
        } else toast.error(resultUpdate.message);
      } else {
        toast.error('Participants not found');
      }
      setDisableParticipantsBtn(false);
    } catch (err) {
      setDisableParticipantsBtn(false);
      toast.error(`${action === 'edit' ? 'Update' : 'Create'} Participants failed`);
    }
  };

  const onConfirmDelete = async (data) => {
    try {
      const deleteResult = await deleteTrainingApi(data.pkey);
      setOpenDeleteConfirm(false);
      if (deleteResult.isSuccess) {
        fetchParticipantsData();
        toast.success('Delete Participants successfully');
      } else {
        toast.error(deleteResult.message);
      }
    } catch {
      toast.error('Delete Participants failed');
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
        accessorKey: 'no',
        header: () => 'No.',
        size: 100,
        cell: ({ row }) => row.index + 1
      },
      {
        accessorKey: 'employeeId',
        header: () => 'Employee ID',
        minSize: 120
      },
      {
        accessorKey: 'enVnFullName',
        header: () => 'English Name',
        cell: ({ row }) => {
          const value = row.getValue('employeeId');
          const valueCus = employeeData.find((emp) => emp.employeeId === value)?.enFullName || '';
          return <span>{valueCus}</span>;
        },
        minSize: 200
      },
      {
        accessorKey: 'vnVnFullName',
        header: () => 'English Name',
        cell: ({ row }) => {
          const value = row.getValue('employeeId');
          const valueCus = employeeData.find((emp) => emp.employeeId === value)?.vnFullName || '';
          return <span>{valueCus}</span>;
        },
        minSize: 200
      },
      {
        accessorKey: 'attendance',
        header: () => 'Attendance',
        minSize: 80
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
            <Button
              variant="contained"
              color="error"
              size="small"
              startIcon={<Delete />}
              onClick={() => {
                const employeeId = row.original.employeeId;
                const enFullName = employeeData.find((emp) => emp.employeeId === employeeId)?.enFullName || '';
                const vnFullName = employeeData.find((emp) => emp.employeeId === employeeId)?.enFullName || '';
                onDelete({ ...row.original, enFullName, vnFullName });
              }}
            >
              Delete
            </Button>
          </Box>
        )
      }
    ],
    [employeeData]
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: 3,
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: 24,
            maxWidth: '80vw', // You can adjust max width as per your needs
            minWidth: '900px', // You can adjust max width as per your needs
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            position: 'relative'
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 10,
              right: 10
            }}
          >
            <CloseIcon fontSize="1.5em" />
          </IconButton>

          <Typography variant="h4">Participants</Typography>
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
                <Grid display="flex" justifyContent="flex-end" marginLeft="auto">
                  <Button
                    sx={{ mb: 2, mr: 1 }}
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<Add />}
                    onClick={() => onCreate()}
                  >
                    Create
                  </Button>
                </Grid>
                <CommonTable data={participantsData} columns={columns} tableHeight={'90%'} />
              </Box>
            </MainCard>
          </Box>
          <ParticipantsActionModal
            open={openParticipants}
            setOpen={setOpenParticipants}
            rowData={selectedParticipantsData}
            onAction={onAction}
            action={actionModal}
            setDisableBtn={setDisableParticipantsBtn}
            disableBtn={disableParticipantsBtn}
            otherListData={otherListData}
            employeeData={employeeData}
          ></ParticipantsActionModal>
          <ParticipantsDeleteConfirm
            open={openDeleteConfirm}
            setOpen={setOpenDeleteConfirm}
            onConfirm={onConfirmDelete}
            rowData={selectedParticipantsData}
          ></ParticipantsDeleteConfirm>
        </Box>
      </Modal>
    </LocalizationProvider>
  );
};

export default ParticipantsModal;
