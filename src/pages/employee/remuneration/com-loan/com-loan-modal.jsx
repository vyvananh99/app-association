import React, { useState, useMemo, useEffect } from 'react';
import { Box, Grid, Button, Modal, IconButton, Typography, Stack } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { toast } from 'react-toastify';
import { Add, Edit, Delete } from '@mui/icons-material';
import CommonTable from '../../../common/common-table';
import ComLoanActionModal from './com-loan-action-modal';
import ComLoanDeleteConfirm from './com-loan-delete-confirm';
import { getComLoanApi, createComLoanApi, updateComLoanApi, deleteComLoanApi } from 'api/com-loan.api';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';

const ComLoanModal = ({ open, setOpen, rowData, comLoanData, fetchComLoanData }) => {
  const [actionModal, setActionModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedComLoanData, setSelectedComLoanData] = useState({});
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  useEffect(() => {
    if (rowData?.employeeId) fetchComLoanData();
  }, [rowData?.employeeId]);

  const handleClose = (event, reason) => {
    if (reason && reason === 'backdropClick') {
      return;
    }
    setOpen(false);
  };

  const onAction = async (data) => {
    try {
      const employeeId = rowData.employeeId;
      const amount = Number(data.amount);
      const comLoanPayback = Number(data.comLoanPayback);
      const newData = Object.assign(data, { employeeId, amount, comLoanPayback });
      if (actionModal === 'create') {
        const resultCreate = await createComLoanApi(newData);
        if (resultCreate.isSuccess) {
          toast.success('Create ComLoan successfully');
          fetchComLoanData();
          setOpenModal(false);
        } else toast.error(resultCreate.message);
      } else if (actionModal === 'edit' && selectedComLoanData.pkey) {
        const resultUpdate = await updateComLoanApi(newData, selectedComLoanData.pkey);
        if (resultUpdate.isSuccess) {
          toast.success('Update ComLoan successfully');
          fetchComLoanData();
          setOpenModal(false);
        } else toast.error(resultUpdate.message);
      } else {
        toast.error('ComLoan not found');
      }
    } catch {
      toast.error(`${actionModal === 'edit' ? 'Update' : 'Create'} ComLoan failed`);
    }
  };

  const onConfirmDelete = async (data) => {
    try {
      const deleteResult = await deleteComLoanApi(data.pkey);
      setOpenDeleteConfirm(false);
      if (deleteResult.isSuccess) {
        fetchComLoanData();
        toast.success('Delete ComLoan successfully');
      } else {
        toast.error(deleteResult.message);
      }
    } catch {
      toast.error('Delete ComLoan failed');
    }
  };

  const onCreate = () => {
    setActionModal('create');
    setOpenModal(true);
    setSelectedComLoanData({});
  };

  const onEdit = (data) => {
    setActionModal('edit');
    setSelectedComLoanData(data);
    setOpenModal(true);
  };

  const onDelete = (data) => {
    setOpenDeleteConfirm(true);
    setSelectedComLoanData(data);
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
        accessorKey: 'amount',
        header: () => 'Amount',
        minSize: 150
      },
      {
        accessorKey: 'comLoanPayback',
        header: () => 'Monthly Payment',
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
            overflowY: 'auto'
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
            Company Loan
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
          <CommonTable data={comLoanData} columns={columns} tableHeight={'500'} />
        </Box>
      </Modal>
      <ComLoanActionModal
        open={openModal}
        setOpen={setOpenModal}
        action={actionModal}
        data={selectedComLoanData}
        onAction={onAction}
      ></ComLoanActionModal>
      <ComLoanDeleteConfirm
        open={openDeleteConfirm}
        setOpen={setOpenDeleteConfirm}
        onConfirm={onConfirmDelete}
        data={selectedComLoanData}
      ></ComLoanDeleteConfirm>
    </LocalizationProvider>
  );
};

export default ComLoanModal;
