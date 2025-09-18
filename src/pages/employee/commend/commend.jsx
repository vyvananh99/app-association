import React, { useState, useMemo, useEffect } from 'react';
import { Box, Grid, Button } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { toast } from 'react-toastify';
import MainCard from 'components/MainCard';
import { Add, Edit, Delete } from '@mui/icons-material';
import CommonTable from '../../common/common-table';
import CommendModal from './commend-modal';
import CommendDeleteConfirm from './commend-delete-confirm';
import { getCommendApi, createCommendApi, updateCommendApi, deleteCommendApi } from 'api/commend.api';
import dayjs from 'dayjs';

const Commend = ({ action, onClose, otherListData, rowData, companyData }) => {
  const [actionModal, setActionModal] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [commendData, setCommendData] = useState([]);
  const [selectedCommendData, setSelectedCommendData] = useState({});
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchCommendData();
  }, []);

  const fetchCommendData = async () => {
    try {
      const employeeId = rowData.employeeId;
      const comId = rowData.comId;
      const getCommendData = await getCommendApi(employeeId, comId);
      setCommendData(getCommendData.data);
    } catch (error) {
      toast.error('Failed to fetch Commend');
    }
  };

  const commendLevel = otherListData.filter((i) => i.type === 'COMMEND_LEVEL');

  const onAction = async (data) => {
    try {
      const employeeId = rowData.employeeId;
      const comId = rowData.comId;
      const funcId = rowData.funcId ? rowData.funcId.toString() : '';
      const posId = rowData.posId;
      const locId = rowData.locId;
      const depId = rowData.depId;
      const secId = rowData.secId;
      const newData = Object.assign(data, { employeeId, comId, funcId, posId, locId, depId, secId });
      if (actionModal === 'create') {
        const resultCreate = await createCommendApi(newData);
        if (resultCreate.isSuccess) {
          toast.success('Create Commend successfully');
          fetchCommendData();
          setOpenModal(false);
        } else toast.error(resultCreate.message);
      } else if (actionModal === 'edit' && selectedCommendData.pkey) {
        const resultUpdate = await updateCommendApi(newData, selectedCommendData.pkey);
        if (resultUpdate.isSuccess) {
          toast.success('Update Commend successfully');
          fetchCommendData();
          setOpenModal(false);
        } else toast.error(resultUpdate.message);
      } else {
        toast.error('Commend not found');
      }
    } catch {
      toast.error(`${action === 'edit' ? 'Update' : 'Create'} Commend failed`);
    }
  };

  const onConfirmDelete = async (data) => {
    try {
      const deleteResult = await deleteCommendApi(data.pkey);
      setOpenDeleteConfirm(false);
      if (deleteResult.isSuccess) {
        fetchCommendData();
        toast.success('Delete Commend successfully');
      } else {
        toast.error(deleteResult.message);
      }
    } catch {
      toast.error('Delete Commend failed');
    }
  };

  const onCreate = () => {
    setActionModal('create');
    setOpenModal(true);
    setSelectedCommendData({});
  };

  const onEdit = (data) => {
    setActionModal('edit');
    setSelectedCommendData(data);
    setOpenModal(true);
  };

  const onDelete = (data) => {
    setOpenDeleteConfirm(true);
    setSelectedCommendData(data);
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
        accessorKey: 'effectiveDate',
        header: () => 'Effective Date',
        cell: ({ row }) => {
          const value = row.getValue('effectiveDate');
          const dateCus = value ? dayjs(value).format('DD-MM-YYYY') : '';
          return <span>{dateCus}</span>;
        },
        minSize: 250
      },
      {
        accessorKey: 'forLevel',
        header: () => 'Level',
        minSize: 250
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
            <CommonTable data={commendData} columns={columns} tableHeight={'90%'} />
          </Box>
        </MainCard>
      </Box>
      <CommendModal
        open={openModal}
        commendLevel={commendLevel}
        setOpen={setOpenModal}
        action={actionModal}
        data={selectedCommendData}
        onAction={onAction}
      ></CommendModal>
      <CommendDeleteConfirm
        open={openDeleteConfirm}
        setOpen={setOpenDeleteConfirm}
        onConfirm={onConfirmDelete}
        data={selectedCommendData}
        companyData={companyData}
      ></CommendDeleteConfirm>
    </LocalizationProvider>
  );
};

export default Commend;
