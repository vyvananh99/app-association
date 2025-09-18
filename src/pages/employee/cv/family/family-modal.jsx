import React, { useState, useMemo, useEffect } from 'react';
import { Box, Grid, Button, Modal, IconButton, Typography, Stack } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { toast } from 'react-toastify';
import { Add, Edit, Delete } from '@mui/icons-material';
import CommonTable from '../../../common/common-table';
import FamilyActionModal from './family-action-modal';
import FamilyDeleteConfirm from './family-delete-confirm';
import { getFamilyApi, createFamilyApi, updateFamilyApi, deleteFamilyApi } from 'api/family.api';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';

const FamilyModal = ({ open, setOpen, rowData, relationshipList, genderList }) => {
  const [actionModal, setActionModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [familyData, setFamilyData] = useState({});
  const [selectedFamilyData, setSelectedFamilyData] = useState({});
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  useEffect(() => {
    if (rowData?.employeeId) fetchFamilyData();
  }, [rowData?.employeeId]);

  const handleClose = (event, reason) => {
    if (reason && reason === 'backdropClick') {
      return;
    }
    setOpen(false);
  };

  const fetchFamilyData = async () => {
    try {
      const employeeId = rowData.employeeId;
      if (!employeeId) return;
      const getFamilyData = await getFamilyApi(employeeId);
      setFamilyData(getFamilyData.data);
    } catch (error) {
      toast.error('Failed to fetch family');
    }
  };

  const onAction = async (data) => {
    try {
      const employeeId = rowData.employeeId;
      const newData = Object.assign(data, { employeeId });
      if (actionModal === 'create') {
        const resultCreate = await createFamilyApi(newData);
        if (resultCreate.isSuccess) {
          toast.success('Create family successfully');
          fetchFamilyData();
          setOpenModal(false);
        } else toast.error(resultCreate.message);
      } else if (actionModal === 'edit' && selectedFamilyData.pkey) {
        const resultUpdate = await updateFamilyApi(newData, selectedFamilyData.pkey);
        if (resultUpdate.isSuccess) {
          toast.success('Update family successfully');
          fetchFamilyData();
          setOpenModal(false);
        } else toast.error(resultUpdate.message);
      } else {
        toast.error('family not found');
      }
    } catch {
      toast.error(`${actionModal === 'edit' ? 'Update' : 'Create'} family failed`);
    }
  };

  const onConfirmDelete = async (data) => {
    try {
      const deleteResult = await deleteFamilyApi(data.pkey);
      setOpenDeleteConfirm(false);
      if (deleteResult.isSuccess) {
        fetchFamilyData();
        toast.success('Delete family successfully');
      } else {
        toast.error(deleteResult.message);
      }
    } catch {
      toast.error('Delete family failed');
    }
  };

  const onCreate = () => {
    setActionModal('create');
    setOpenModal(true);
    setSelectedFamilyData({});
  };

  const onEdit = (data) => {
    setActionModal('edit');
    setSelectedFamilyData(data);
    setOpenModal(true);
  };

  const onDelete = (data) => {
    setOpenDeleteConfirm(true);
    setSelectedFamilyData(data);
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
        accessorKey: 'relation',
        header: () => 'Relation',
        cell: ({ row }) => {
          const value = row.getValue('relation');
          const findData = relationshipList.find((i) => i.pkey === value);
          const name = findData ? findData.name : '';
          return <span>{name}</span>;
        },
        minSize: 250
      },
      {
        accessorKey: 'name',
        header: () => 'Name',
        minSize: 250
      },
      {
        accessorKey: 'birthday',
        header: () => 'Birthday',
        cell: ({ row }) => {
          const value = row.getValue('birthday');
          const dateCus = value ? dayjs(value).format('DD-MM-YYYY') : '';
          return <span>{dateCus}</span>;
        },
        minSize: 250
      },
      {
        accessorKey: 'gender',
        header: () => 'Gender',
        cell: ({ row }) => {
          const value = row.getValue('gender');
          const findData = genderList.find((i) => i.id === value);
          const name = findData ? findData.name : '';
          return <span>{name}</span>;
        },
        minSize: 250
      },
      {
        accessorKey: 'occupation',
        header: () => 'Occupation',
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
            Family Members
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
          <CommonTable data={familyData} columns={columns} tableHeight={'90%'} />
        </Box>
      </Modal>
      <FamilyActionModal
        open={openModal}
        relationshipList={relationshipList}
        setOpen={setOpenModal}
        action={actionModal}
        data={selectedFamilyData}
        onAction={onAction}
        genderList={genderList}
      ></FamilyActionModal>
      <FamilyDeleteConfirm
        open={openDeleteConfirm}
        setOpen={setOpenDeleteConfirm}
        onConfirm={onConfirmDelete}
        data={selectedFamilyData}
        genderList={genderList}
        relationshipList={relationshipList}
        ></FamilyDeleteConfirm>
    </LocalizationProvider>
  );
};

export default FamilyModal;
