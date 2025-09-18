import React, { useState, useMemo, useEffect } from 'react';
import { Box, Grid, Button, Modal, IconButton, Typography, Stack } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { toast } from 'react-toastify';
import { Add, Edit, Delete } from '@mui/icons-material';
import CommonTable from '../../../common/common-table';
import ProvisionActionModal from './provision-action-modal';
import ProvisionDeleteConfirm from './provision-delete-confirm';
import { getProvisionApi, createProvisionApi, updateProvisionApi, deleteProvisionApi } from 'api/provision.api';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';

const ProvisionModal = ({ open, setOpen, rowData, fetchProvisionData, provisionData }) => {
  const [actionModal, setActionModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProvisionData, setSelectedProvisionData] = useState({});
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  const handleClose = (event, reason) => {
    if (reason && reason === 'backdropClick') {
      return;
    }
    setOpen(false);
  };

  const onAction = async (data) => {
    try {
      const employeeId = rowData.employeeId;
      const newData = Object.assign(data, { employeeId });
      if (actionModal === 'create') {
        const resultCreate = await createProvisionApi(newData);
        if (resultCreate.isSuccess) {
          toast.success('Create Provision successfully');
          fetchProvisionData();
          setOpenModal(false);
        } else toast.error(resultCreate.message);
      } else if (actionModal === 'edit' && selectedProvisionData.pkey) {
        const resultUpdate = await updateProvisionApi(newData, selectedProvisionData.pkey);
        if (resultUpdate.isSuccess) {
          toast.success('Update Provision successfully');
          fetchProvisionData();
          setOpenModal(false);
        } else toast.error(resultUpdate.message);
      } else {
        toast.error('Provision not found');
      }
    } catch {
      toast.error(`${actionModal === 'edit' ? 'Update' : 'Create'} Provision failed`);
    }
  };

  const onConfirmDelete = async (data) => {
    try {
      const deleteResult = await deleteProvisionApi(data.pkey);
      setOpenDeleteConfirm(false);
      if (deleteResult.isSuccess) {
        fetchProvisionData();
        toast.success('Delete Provision successfully');
      } else {
        toast.error(deleteResult.message);
      }
    } catch {
      toast.error('Delete Provision failed');
    }
  };

  const onCreate = () => {
    setActionModal('create');
    setOpenModal(true);
    setSelectedProvisionData({});
  };

  const onEdit = (data) => {
    setActionModal('edit');
    setSelectedProvisionData(data);
    setOpenModal(true);
  };

  const onDelete = (data) => {
    setOpenDeleteConfirm(true);
    setSelectedProvisionData(data);
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
        accessorKey: 'extendDate',
        header: () => 'Start Date',
        cell: ({ row }) => {
          const value = row.getValue('startDate');
          const dateCus = value ? dayjs(value).format('DD-MM-YYYY') : '';
          return <span>{dateCus}</span>;
        },
        minSize: 100
      },
      {
        accessorKey: 'expireDate',
        header: () => 'Expire Date',
        cell: ({ row }) => {
          const value = row.getValue('expireDate');
          const dateCus = value ? dayjs(value).format('DD-MM-YYYY') : '';
          return <span>{dateCus}</span>;
        },
        minSize: 100
      },
      {
        accessorKey: 'Item',
        header: () => 'item',
        minSize: 150
      },
      {
        accessorKey: 'value',
        header: () => 'Value',
        minSize: 150
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
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Modal open={open} onClose={handleClose} disableEscapeKeyDown>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90vw',
            maxHeight: '90vh',
            minHeight: '500px',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            overflowY: 'auto',
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
            Provision Members
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
          <CommonTable data={provisionData} columns={columns} tableHeight={'500'} />
        </Box>
      </Modal>
      <ProvisionActionModal
        open={openModal}
        setOpen={setOpenModal}
        action={actionModal}
        data={selectedProvisionData}
        onAction={onAction}
      ></ProvisionActionModal>
      <ProvisionDeleteConfirm
        open={openDeleteConfirm}
        setOpen={setOpenDeleteConfirm}
        onConfirm={onConfirmDelete}
        data={selectedProvisionData}
      ></ProvisionDeleteConfirm>
    </LocalizationProvider>
  );
};

export default ProvisionModal;
