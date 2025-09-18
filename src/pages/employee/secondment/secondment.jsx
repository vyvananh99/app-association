import React, { useState, useMemo, useEffect } from 'react';
import { Box, Grid, Button } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { toast } from 'react-toastify';
import MainCard from 'components/MainCard';
import { Add, Edit, Delete } from '@mui/icons-material';
import CommonTable from '../../common/common-table';
import SecondmentModal from './secondment-modal';
import SecondmentDeleteConfirm from './secondment-delete-confirm';
import { getSecondmentApi, createSecondmentApi, updateSecondmentApi, deleteSecondmentApi } from 'api/secondment.api';
import dayjs from 'dayjs';

const Secondment = ({ action, onClose, rowData }) => {
  const [actionModal, setActionModal] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [secondmentData, setSecondmentData] = useState([]);
  const [selectedSecondmentData, setSelectedSecondmentData] = useState({});
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchSecondmentData();
  }, []);

  const fetchSecondmentData = async () => {
    try {
      const employeeId = rowData.employeeId;
      const getSecondmentData = await getSecondmentApi(employeeId, 0);
      setSecondmentData(getSecondmentData.data);
    } catch (error) {
      toast.error('Failed to fetch Secondment');
    }
  };

  const onAction = async (data) => {
    try {
      const employeeId = rowData.employeeId;
      const newData = Object.assign(data, { employeeId });
      if (!newData.hostSal) newData.hostSal = null;
      else newData.hostSal = Number(newData.hostSal);
      if (!newData.nth) newData.nth = null;
      else newData.nth = Number(newData.nth);
      newData.type = 0;
      if (actionModal === 'create') {
        const resultCreate = await createSecondmentApi(newData);
        if (resultCreate.isSuccess) {
          toast.success('Create Secondment successfully');
          fetchSecondmentData();
          setOpenModal(false);
        } else toast.error(resultCreate.message);
      } else if (actionModal === 'edit' && selectedSecondmentData.pkey) {
        const resultUpdate = await updateSecondmentApi(newData, selectedSecondmentData.pkey);
        if (resultUpdate.isSuccess) {
          toast.success('Update Secondment successfully');
          fetchSecondmentData();
          setOpenModal(false);
        } else toast.error(resultUpdate.message);
      } else {
        toast.error('Secondment not found');
      }
    } catch {
      toast.error(`${action === 'edit' ? 'Update' : 'Create'} Secondment failed`);
    }
  };

  const onConfirmDelete = async (data) => {
    try {
      const deleteResult = await deleteSecondmentApi(data.pkey);
      setOpenDeleteConfirm(false);
      if (deleteResult.isSuccess) {
        fetchSecondmentData();
        toast.success('Delete Secondment successfully');
      } else {
        toast.error(deleteResult.message);
      }
    } catch {
      toast.error('Delete Secondment failed');
    }
  };

  const onCreate = () => {
    setActionModal('create');
    setOpenModal(true);
    setSelectedSecondmentData({});
  };

  const onEdit = (data) => {
    setActionModal('edit');
    setSelectedSecondmentData(data);
    setOpenModal(true);
  };

  const onDelete = (data) => {
    setOpenDeleteConfirm(true);
    setSelectedSecondmentData(data);
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
        accessorKey: 'country',
        header: () => 'Country',
        minSize: 250
      },
      {
        accessorKey: 'company',
        header: () => 'Company',
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
              <Button sx={{ mb: 2, mr: 1 }} variant="contained" color="primary" size="small" startIcon={<Add />} onClick={() => onCreate()}>
                Create
              </Button>
            </Grid>
            <CommonTable data={secondmentData} columns={columns} tableHeight={'90%'} />
          </Box>
        </MainCard>
      </Box>
      <SecondmentModal
        open={openModal}
        setOpen={setOpenModal}
        action={actionModal}
        data={selectedSecondmentData}
        onAction={onAction}
      ></SecondmentModal>
      <SecondmentDeleteConfirm
        open={openDeleteConfirm}
        setOpen={setOpenDeleteConfirm}
        onConfirm={onConfirmDelete}
        data={selectedSecondmentData}
      ></SecondmentDeleteConfirm>
    </LocalizationProvider>
  );
};

export default Secondment;
