import React, { useState, useMemo, useEffect } from 'react';
import { Box, Grid, Button, Modal, IconButton, Typography, Stack } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { toast } from 'react-toastify';
import { Add, Edit, Delete } from '@mui/icons-material';
import CommonTable from '../../../common/common-table';
import DevPlanActionModal from './dev-plan-action-modal';
import DevPlanDeleteConfirm from './dev-plan-delete-confirm';
import { getDevelopmentApi, createDevelopmentApi, updateDevelopmentApi, deleteDevelopmentApi } from 'api/development.api';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';

const DevPlanModal = ({ open, setOpen, rowData, developSkillList, approachList, devArchievedList }) => {
  const [actionModal, setActionModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [devPlanData, setDevPlanData] = useState({});
  const [selectedDevPlanData, setSelectedDevPlanData] = useState({});
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  useEffect(() => {
    if (rowData?.employeeId) fetchDevData();
  }, [rowData?.employeeId]);

  const handleClose = (event, reason) => {
    if (reason && reason === 'backdropClick') {
      return;
    }
    setOpen(false);
  };

  const fetchDevData = async () => {
    try {
      const employeeId = rowData.employeeId;
      if (!employeeId) return;
      const getDevPlanData = await getDevelopmentApi(employeeId);
      setDevPlanData(getDevPlanData.data);
    } catch (error) {
      toast.error('Failed to fetch Development Plan');
    }
  };

  const onAction = async (data) => {
    try {
      const employeeId = rowData.employeeId;
      const year = dayjs().year();
      const newData = Object.assign(data, { employeeId, year });
      if (!newData.achieved) newData.achieved = null;
      if (actionModal === 'create') {
        const resultCreate = await createDevelopmentApi(newData);
        if (resultCreate.isSuccess) {
          toast.success('Create Development Plan successfully');
          fetchDevData();
          setOpenModal(false);
        } else toast.error(resultCreate.message);
      } else if (actionModal === 'edit' && selectedDevPlanData.pkey) {
        const resultUpdate = await updateDevelopmentApi(newData, selectedDevPlanData.pkey);
        if (resultUpdate.isSuccess) {
          toast.success('Update Development Plan successfully');
          fetchDevData();
          setOpenModal(false);
        } else toast.error(resultUpdate.message);
      } else {
        toast.error('DevPlan not found');
      }
    } catch {
      toast.error(`${actionModal === 'edit' ? 'Update' : 'Create'} Development Plan failed`);
    }
  };

  const onConfirmDelete = async (data) => {
    try {
      const deleteResult = await deleteDevelopmentApi(data.pkey);
      setOpenDeleteConfirm(false);
      if (deleteResult.isSuccess) {
        fetchDevData();
        toast.success('Delete Development Plan successfully');
      } else {
        toast.error(deleteResult.message);
      }
    } catch {
      toast.error('Delete Development Plan failed');
    }
  };

  const onCreate = () => {
    setActionModal('create');
    setOpenModal(true);
    setSelectedDevPlanData({});
  };

  const onEdit = (data) => {
    setActionModal('edit');
    setSelectedDevPlanData(data);
    setOpenModal(true);
  };

  const onDelete = (data) => {
    setOpenDeleteConfirm(true);
    setSelectedDevPlanData(data);
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
        accessorKey: 'skill',
        header: () => 'Skill',
        minSize: 250
      },
      {
        accessorKey: 'area',
        header: () => 'Area',
        minSize: 250
      },
      {
        accessorKey: 'actionPlant',
        header: () => 'Action Plan',
        minSize: 250
      },
      {
        accessorKey: 'approach',
        header: () => 'Approach',
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
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Modal open={open} onClose={handleClose} disableEscapeKeyDown>
        <Box
          sx={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: 3,
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: 24,
            maxWidth: '1200px', // You can adjust max width as per your needs
            width: '80%', // You can adjust max width as per your needs
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            position: 'relative',
            minHeight: '500px',
            maxHeight: '80%'
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
          <Typography variant="h4" sx={{ marginBottom: 2 }}>
            Development Plan
          </Typography>
          <Grid sx={{ ml: 3 }}>
            <Stack spacing={1}>
              <Box display="flex" alignItems="center">
                <Typography variant="h6" sx={{ width: 150 }}>
                  Company Name
                </Typography>
                <Typography variant="h6" sx={{ pr: 1 }}>
                  :
                </Typography>
                <Typography variant="h6" color="primary">
                  {rowData.employeeId || 'N/A'}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center">
                <Typography variant="h6" sx={{ width: 150 }}>
                  Full Name
                </Typography>
                <Typography variant="h6" sx={{ pr: 1 }}>
                  :
                </Typography>
                <Typography variant="h6" color="primary">
                  {rowData.vnFullName || rowData.enFullName || 'N/A'}
                </Typography>
              </Box>
            </Stack>
          </Grid>
          <Grid display="flex" justifyContent="flex-end" marginLeft="auto">
            <Button sx={{ mb: 2, mr: 1 }} variant="contained" color="primary" size="small" startIcon={<Add />} onClick={() => onCreate()}>
              Create
            </Button>
          </Grid>
          <CommonTable data={devPlanData} columns={columns} tableHeight={'90%'} />
        </Box>
      </Modal>
      <DevPlanActionModal
        open={openModal}
        setOpen={setOpenModal}
        action={actionModal}
        data={selectedDevPlanData}
        onAction={onAction}
        developSkillList={developSkillList}
        approachList={approachList}
        devArchievedList={devArchievedList}
      ></DevPlanActionModal>
      <DevPlanDeleteConfirm
        open={openDeleteConfirm}
        setOpen={setOpenDeleteConfirm}
        onConfirm={onConfirmDelete}
        data={selectedDevPlanData}
      ></DevPlanDeleteConfirm>
    </LocalizationProvider>
  );
};

export default DevPlanModal;
