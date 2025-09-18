import React, { useState, useMemo, useEffect } from 'react';
import { Box, Grid, Button } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { toast } from 'react-toastify';
import MainCard from 'components/MainCard';
import { Add, Edit, Delete } from '@mui/icons-material';
import CommonTable from '../../common/common-table';
import ExpatriationModal from './expatriation-modal';
import ExpatriationDeleteConfirm from './Expatriation-delete-confirm';
import { getSecondmentApi, createSecondmentApi, updateSecondmentApi, deleteSecondmentApi } from 'api/secondment.api';
import dayjs from 'dayjs';

const Expatriation = ({ action, onClose, rowData }) => {
  const [actionModal, setActionModal] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [expatriationData, setExpatriationData] = useState([]);
  const [selectedExpatriationData, setSelectedExpatriationData] = useState({});
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchExpatriationData();
  }, []);

  const fetchExpatriationData = async () => {
    try {
      const employeeId = rowData.employeeId;
      const getExpatriationData = await getSecondmentApi(employeeId, 1);
      setExpatriationData(getExpatriationData.data);
    } catch (error) {
      toast.error('Failed to fetch Expatriation');
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
      newData.type = 1;
      if (actionModal === 'create') {
        const resultCreate = await createSecondmentApi(newData);
        if (resultCreate.isSuccess) {
          toast.success('Create Expatriation successfully');
          fetchExpatriationData();
          setOpenModal(false);
        } else toast.error(resultCreate.message);
      } else if (actionModal === 'edit' && selectedExpatriationData.pkey) {
        const resultUpdate = await updateSecondmentApi(newData, selectedExpatriationData.pkey);
        if (resultUpdate.isSuccess) {
          toast.success('Update Expatriation successfully');
          fetchExpatriationData();
          setOpenModal(false);
        } else toast.error(resultUpdate.message);
      } else {
        toast.error('Expatriation not found');
      }
    } catch {
      toast.error(`${action === 'edit' ? 'Update' : 'Create'} Expatriation failed`);
    }
  };

  const onConfirmDelete = async (data) => {
    try {
      const deleteResult = await deleteSecondmentApi(data.pkey);
      setOpenDeleteConfirm(false);
      if (deleteResult.isSuccess) {
        fetchExpatriationData();
        toast.success('Delete Expatriation successfully');
      } else {
        toast.error(deleteResult.message);
      }
    } catch {
      toast.error('Delete Expatriation failed');
    }
  };

  const onCreate = () => {
    setActionModal('create');
    setOpenModal(true);
    setSelectedExpatriationData({});
  };

  const onEdit = (data) => {
    setActionModal('edit');
    setSelectedExpatriationData(data);
    setOpenModal(true);
  };

  const onDelete = (data) => {
    setOpenDeleteConfirm(true);
    setSelectedExpatriationData(data);
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
            <CommonTable data={expatriationData} columns={columns} tableHeight={'90%'} />
          </Box>
        </MainCard>
      </Box>
      <ExpatriationModal
        open={openModal}
        setOpen={setOpenModal}
        action={actionModal}
        data={selectedExpatriationData}
        onAction={onAction}
      ></ExpatriationModal>
      <ExpatriationDeleteConfirm
        open={openDeleteConfirm}
        setOpen={setOpenDeleteConfirm}
        onConfirm={onConfirmDelete}
        data={selectedExpatriationData}
      ></ExpatriationDeleteConfirm>
    </LocalizationProvider>
  );
};

export default Expatriation;
