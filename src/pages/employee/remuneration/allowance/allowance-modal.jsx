import React, { useState, useMemo, useEffect } from 'react';
import { Box, Grid, Button, Modal, IconButton, Typography, Stack } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { toast } from 'react-toastify';
import { Add, Edit, Delete } from '@mui/icons-material';
import CommonTable from '../../../common/common-table';
import AllowanceActionModal from './allowance-action-modal';
import AllowanceDeleteConfirm from './allowance-delete-confirm';
import { getAllowanceApi, createAllowanceApi, updateAllowanceApi, deleteAllowanceApi } from 'api/allowance.api';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';

const AllowanceModal = ({ open, setOpen, rowData, fetchAllowanceData, allowanceData, allowTypeData, otherListNData }) => {
  const [actionModal, setActionModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAllowanceData, setSelectedAllowanceData] = useState({});
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);

  const handleClose = (event, reason) => {
    if (reason && reason === 'backdropClick') {
      return;
    }
    setOpen(false);
  };

  const onAction = async (data) => {
    try {
      if (data && data.pay) data.pay = Number(data.pay);
      if (!data.pay) delete data.pay;
      const resultUpdate = await updateAllowanceApi(data, rowData.pkey);
      if (resultUpdate.isSuccess) {
        toast.success('Update allowance successfully');
        setOpenModal(false);
      } else toast.error(resultUpdate.message);
      fetchAllowanceData();
      setDisableBtn(false);
    } catch (err) {
      toast.error(`Update allowance failed`);
      setDisableBtn(false);
    }
  };

  const onConfirmDelete = async (data) => {
    try {
      const deleteResult = await deleteAllowanceApi(rowData.pkey);
      setOpenDeleteConfirm(false);
      if (deleteResult.isSuccess) {
        fetchAllowanceData();
        toast.success('Delete Allowance successfully');
      } else {
        toast.error(deleteResult.message);
      }
    } catch {
      toast.error('Delete Allowance failed');
    }
  };

  const onCreate = () => {
    setActionModal('create');
    setOpenModal(true);
    setSelectedAllowanceData({});
  };

  const onEdit = (data) => {
    setActionModal('edit');
    setSelectedAllowanceData(data);
    setOpenModal(true);
  };

  const onDelete = (data) => {
    setOpenDeleteConfirm(true);
    setSelectedAllowanceData(data);
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
        accessorKey: 'type',
        header: () => 'Allowance',
        cell: ({ row }) => {
          const value = row.getValue('type');
          const valueCus = allowTypeData.find((item) => item.code === value)?.name;
          return <span>{valueCus}</span>;
        },
        minSize: 250
      },
      {
        accessorKey: 'startDate',
        header: () => 'Start Date',
        cell: ({ row }) => {
          const value = row.getValue('startDate');
          const valueCus = value ? dayjs(value).format('DD-MM-YYYY') : '';
          return <span>{valueCus}</span>;
        },
        minSize: 100
      },
      {
        accessorKey: 'endDate',
        header: () => 'Expire Date',
        cell: ({ row }) => {
          const value = row.getValue('endDate');
          const valueCus = value ? dayjs(value).format('DD-MM-YYYY') : '';
          return <span>{valueCus}</span>;
        },
        minSize: 100
      },
      {
        accessorKey: 'comments',
        header: () => 'Description',
        minSize: 250
      },
      {
        id: 'actions',
        header: '',
        size: 80,
        cell: ({ row }) => (
          <Box display="flex" gap={1} flexWrap="nowrap" alignItems="center" sx={{ whiteSpace: 'nowrap' }}>
            <Button variant="contained" color="primary" size="small" startIcon={<Edit />} onClick={() => onEdit(row.original)}>
              Edit
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
            Allowance Members
          </Typography>
          <Grid sx={{ ml: 3, mb: 3 }}>
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
          <CommonTable data={allowanceData} columns={columns} tableHeight={'500'} />
        </Box>
      </Modal>
      <AllowanceActionModal
        open={openModal}
        setOpen={setOpenModal}
        action={actionModal}
        data={selectedAllowanceData}
        onAction={onAction}
        otherListNData={otherListNData}
        allowTypeData={allowTypeData}
        rowData={selectedAllowanceData}
        disableBtn={disableBtn}
        setDisableBtn={setDisableBtn}
      ></AllowanceActionModal>
      <AllowanceDeleteConfirm
        open={openDeleteConfirm}
        setOpen={setOpenDeleteConfirm}
        onConfirm={onConfirmDelete}
        data={selectedAllowanceData}
      ></AllowanceDeleteConfirm>
    </LocalizationProvider>
  );
};

export default AllowanceModal;
