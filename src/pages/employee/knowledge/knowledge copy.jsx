import React, { useState, useMemo, useEffect } from 'react';
import { Box, Grid, Button } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { toast } from 'react-toastify';
import MainCard from 'components/MainCard';
import { Add, Edit, Delete } from '@mui/icons-material';
import CommonTable from '../../common/common-table';
import KnowledgeModal from './acadamy/academy-modal';
import KnowledgeDeleteConfirm from './acadamy/academy-delete-confirm';
import { getAcademyApi, createAcademyApi, updateAcademyApi, deleteAcademyApi } from 'api/academy.api';
import dayjs from 'dayjs';

const Knowledge = ({ action, onClose, rowData }) => {
  const [actionModal, setActionModal] = useState();
  const [openModalAacademy, setOpenModalAacademy] = useState(false);
  const [knowledgeData, setKnowledgeData] = useState([]);
  const [selectedKnowledgeData, setSelectedKnowledgeData] = useState({});
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchKnowledgeData();
  }, []);

  const fetchKnowledgeData = async () => {
    try {
      const employeeId = rowData.employeeId;
      const getKnowledgeData = await getAcademyApi(employeeId);
      setKnowledgeData(getKnowledgeData.data);
    } catch (error) {
      toast.error('Failed to fetch Knowledge');
    }
  };

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
        const resultCreate = await createAcademyApi(newData);
        if (resultCreate.isSuccess) {
          toast.success('Create Knowledge successfully');
          fetchKnowledgeData();
          setOpenModalAacademy(false);
        } else toast.error(resultCreate.message);
      } else if (actionModal === 'edit' && selectedKnowledgeData.pkey) {
        const resultUpdate = await updateAcademyApi(newData, selectedKnowledgeData.pkey);
        if (resultUpdate.isSuccess) {
          toast.success('Update Knowledge successfully');
          fetchKnowledgeData();
          setOpenModalAacademy(false);
        } else toast.error(resultUpdate.message);
      } else {
        toast.error('Knowledge not found');
      }
    } catch {
      toast.error(`${action === 'edit' ? 'Update' : 'Create'} Knowledge failed`);
    }
  };

  const onConfirmDelete = async (data) => {
    try {
      const deleteResult = await deleteAcademyApi(data.pkey);
      setOpenDeleteConfirm(false);
      if (deleteResult.isSuccess) {
        fetchKnowledgeData();
        toast.success('Delete Knowledge successfully');
      } else {
        toast.error(deleteResult.message);
      }
    } catch {
      toast.error('Delete Knowledge failed');
    }
  };

  const onCreate = () => {
    setActionModal('create');
    setOpenModalAacademy(true);
    setSelectedKnowledgeData({});
  };

  const onEdit = (data) => {
    setActionModal('edit');
    setSelectedKnowledgeData(data);
    setOpenModalAacademy(true);
  };

  const onDelete = (data) => {
    setOpenDeleteConfirm(true);
    setSelectedKnowledgeData(data);
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
            <CommonTable data={knowledgeData} columns={columns} tableHeight={'90%'} />
          </Box>
        </MainCard>
      </Box>
      <KnowledgeModal
        open={openModalAacademy}
        setOpen={setOpenModalAacademy}
        action={actionModal}
        data={selectedKnowledgeData}
        onAction={onAction}
      ></KnowledgeModal>
      <KnowledgeDeleteConfirm
        open={openDeleteConfirm}
        setOpen={setOpenDeleteConfirm}
        onConfirm={onConfirmDelete}
        data={selectedKnowledgeData}
      ></KnowledgeDeleteConfirm>
    </LocalizationProvider>
  );
};

export default Knowledge;
