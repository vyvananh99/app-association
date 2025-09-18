import React, { useState, useMemo, useEffect } from 'react';
import { Box, Grid, Button } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { toast } from 'react-toastify';
import MainCard from 'components/MainCard';
import { Add, Edit, Delete } from '@mui/icons-material';
import CommonTable from '../../../common/common-table';
import AcademyModal from './academy-modal';
import AcademyDeleteConfirm from './academy-delete-confirm';
import { getAcademyApi, createAcademyApi, updateAcademyApi, deleteAcademyApi } from 'api/academy.api';
import dayjs from 'dayjs';

const Academy = ({ action, onClose, rowData }) => {
  const [actionModal, setActionModal] = useState();
  const [openModalAacademy, setOpenModalAacademy] = useState(false);
  const [academyData, setAcademyData] = useState([]);
  const [selectedAcademyData, setSelectedAcademyData] = useState({});
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchAcademyData();
  }, []);

  const fetchAcademyData = async () => {
    try {
      const employeeId = rowData.employeeId;
      const getAcademyData = await getAcademyApi(employeeId);
      setAcademyData(getAcademyData.data);
    } catch (error) {
      toast.error('Failed to fetch Academy');
    }
  };

  const onAction = async (data) => {
    try {
      const employeeId = rowData.employeeId;
      const newData = Object.assign(data, { employeeId });
      if (actionModal === 'create') {
        const resultCreate = await createAcademyApi(newData);
        if (resultCreate.isSuccess) {
          toast.success('Create Academy successfully');
          fetchAcademyData();
          setOpenModalAacademy(false);
        } else toast.error(resultCreate.message);
      } else if (actionModal === 'edit' && selectedAcademyData.pkey) {
        const resultUpdate = await updateAcademyApi(newData, selectedAcademyData.pkey);
        if (resultUpdate.isSuccess) {
          toast.success('Update Academy successfully');
          fetchAcademyData();
          setOpenModalAacademy(false);
        } else toast.error(resultUpdate.message);
      } else {
        toast.error('Academy not found');
      }
    } catch {
      toast.error(`${action === 'edit' ? 'Update' : 'Create'} Academy failed`);
    }
  };

  const onConfirmDelete = async (data) => {
    try {
      const deleteResult = await deleteAcademyApi(data.pkey);
      setOpenDeleteConfirm(false);
      if (deleteResult.isSuccess) {
        fetchAcademyData();
        toast.success('Delete Academy successfully');
      } else {
        toast.error(deleteResult.message);
      }
    } catch {
      toast.error('Delete Academy failed');
    }
  };

  const onCreate = () => {
    setActionModal('create');
    setOpenModalAacademy(true);
    setSelectedAcademyData({});
  };

  const onEdit = (data) => {
    setActionModal('edit');
    setSelectedAcademyData(data);
    setOpenModalAacademy(true);
  };

  const onDelete = (data) => {
    setOpenDeleteConfirm(true);
    setSelectedAcademyData(data);
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
        header: () => 'Level',
        cell: ({ row }) => {
          const value = row.getValue('endDate');
          const dateCus = value ? dayjs(value).format('DD-MM-YYYY') : '';
          return <span>{dateCus}</span>;
        },
        minSize: 100
      },
      {
        accessorKey: 'schoolName',
        header: () => 'School Name',
        minSize: 200
      },
      {
        accessorKey: 'major',
        header: () => 'Major',
        minSize: 200
      },
      {
        id: 'actions',
        header: '',
        size: 160,
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
                xs: 'calc(70vh - 130px)',
                xl: 'calc(70vh - 90px)'
              },
              minHeight: '300px',
            }}
          >
            <Grid display="flex" justifyContent="flex-end" marginLeft="auto">
              <Button sx={{ mb: 2, mr: 1 }} variant="contained" color="primary" size="small" startIcon={<Add />} onClick={() => onCreate()}>
                Create
              </Button>
            </Grid>
            <CommonTable data={academyData} columns={columns} tableHeight={310} />
          </Box>
        </MainCard>
      </Box>
      <AcademyModal
        open={openModalAacademy}
        setOpen={setOpenModalAacademy}
        action={actionModal}
        data={selectedAcademyData}
        onAction={onAction}
      ></AcademyModal>
      <AcademyDeleteConfirm
        open={openDeleteConfirm}
        setOpen={setOpenDeleteConfirm}
        onConfirm={onConfirmDelete}
        data={selectedAcademyData}
      ></AcademyDeleteConfirm>
    </LocalizationProvider>
  );
};

export default Academy;
