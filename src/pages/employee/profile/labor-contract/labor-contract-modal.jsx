import React, { useMemo } from 'react';
import { Box, Grid, Button, Modal, Typography, Divider, IconButton } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import CommonTable from '../../../common/common-table';
import CloseIcon from '@mui/icons-material/Close';

function LaborContractModal({
  data,
  open,
  setOpen,
  setOpenModal,
  setActionModal,
  contractTypeData,
  setContractModalData,
  deleteLaborContract
}) {
  const handleClose = (event, reason) => {
    if (reason && reason === 'backdropClick') {
      return;
    }
    setOpen(false);
  };

  const onCreate = () => {
    setActionModal('create');
    setContractModalData({});
    setOpenModal(true);
  };

  const onEdit = (data) => {
    setActionModal('edit');
    setOpenModal(true);
    setContractModalData(data);
  };

  const onDelete = (data) => {
    deleteLaborContract(data);
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
        accessorKey: 'contractType',
        header: () => 'Type',
        minSize: 250,
        cell: ({ row }) => {
          // Tùy chỉnh cách hiển thị của contractType
          const contractType = row.original.contractType;
          const contractTypeName = contractTypeData.find((i) => i.id === contractType);
          return contractTypeName ? contractTypeName.name : '';
        }
      },
      {
        accessorKey: 'extendDate',
        header: () => 'Start Date',
        minSize: 250
      },
      {
        accessorKey: 'expireDate',
        header: () => 'Expired Date',
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
          width: '80%',
          height: '75%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
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
        <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
          Labor Contract
        </Typography>

        <Divider sx={{ mb: 1 }} />

        {/* Modal Content */}
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          <Grid display="flex" justifyContent="flex-end" marginLeft="auto">
            <Button sx={{ mb: 1, mr: 1 }} variant="contained" color="primary" size="small" startIcon={<Add />} onClick={() => onCreate()}>
              Create
            </Button>
          </Grid>
          <CommonTable data={data} columns={columns} tableHeight={'90%'} />
        </Box>
      </Box>
    </Modal>
  );
}

export default LaborContractModal;
