import React, { useState, useMemo, useEffect } from 'react';
import { Box, Grid, Button } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { toast } from 'react-toastify';
import MainCard from 'components/MainCard';
import { Add, Edit, Delete } from '@mui/icons-material';
import CommonTable from '../../common/common-table';
import DisciplineModal from './discipline-modal';
import DisciplineDeleteConfirm from './discipline-delete-confirm';
import { getDisciplineApi, createDisciplineApi, updateDisciplineApi, deleteDisciplineApi } from 'api/discipline.api';
import dayjs from 'dayjs';

const Discipline = ({ action, onClose, otherListData, rowData, companyData }) => {
  const [actionModal, setActionModal] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [disciplineData, setDisciplineData] = useState([]);
  const [selectedDisciplineData, setSelectedDisciplineData] = useState({});
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchDisciplineData();
  }, []);

  const fetchDisciplineData = async () => {
    try {
      const employeeId = rowData.employeeId;
      const comId = rowData.comId;
      const getDisciplineData = await getDisciplineApi(employeeId, comId);
      setDisciplineData(getDisciplineData.data);
    } catch (error) {
      toast.error('Failed to fetch discipline');
    }
  };

  const disciplineLevel = otherListData.filter((i) => i.type === 'DISCIPLINE_LEVEL');

  const onAction = async (data) => {
    try {
      const employeeId = rowData.employeeId;
      const comId = rowData.comId;
      const funcId = rowData.funcId;
      const posId = rowData.posId;
      const locId = rowData.locId;
      const depId = rowData.depId;
      const secId = rowData.secId;
      const newData = Object.assign(data, { employeeId, comId, funcId, posId, locId, depId, secId });
      if (actionModal === 'create') {
        const resultCreate = await createDisciplineApi(newData);
        if (resultCreate.isSuccess) {
          toast.success('Create discipline successfully');
          fetchDisciplineData();
          setOpenModal(false);
        } else toast.error(resultCreate.message);
      } else if (actionModal === 'edit' && selectedDisciplineData.pkey) {
        const resultUpdate = await updateDisciplineApi(newData, selectedDisciplineData.pkey);
        if (resultUpdate.isSuccess) {
          toast.success('Update discipline successfully');
          fetchDisciplineData();
          setOpenModal(false);
        } else toast.error(resultUpdate.message);
      } else {
        toast.error('Discipline not found');
      }
    } catch {
      toast.error(`${action === 'edit' ? 'Update' : 'Create'} discipline failed`);
    }
  };

  const onConfirmDelete = async (data) => {
    try {
      const deleteResult = await deleteDisciplineApi(data.pkey);
      setOpenDeleteConfirm(false);
      if (deleteResult.isSuccess) {
        fetchDisciplineData();
        toast.success('Delete discipline successfully');
      } else {
        toast.error(deleteResult.message);
      }
    } catch {
      toast.error('Delete discipline failed');
    }
  };

  const onCreate = () => {
    setActionModal('create');
    setOpenModal(true);
    setSelectedDisciplineData({});
  };

  const onEdit = (data) => {
    setActionModal('edit');
    setSelectedDisciplineData(data);
    setOpenModal(true);
  };

  const onDelete = (data) => {
    setOpenDeleteConfirm(true);
    setSelectedDisciplineData(data);
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
            <CommonTable data={disciplineData} columns={columns} tableHeight={'90%'} />
          </Box>
        </MainCard>
      </Box>
      <DisciplineModal
        open={openModal}
        disciplineLevel={disciplineLevel}
        setOpen={setOpenModal}
        action={actionModal}
        data={selectedDisciplineData}
        onAction={onAction}
      ></DisciplineModal>
      <DisciplineDeleteConfirm
        open={openDeleteConfirm}
        setOpen={setOpenDeleteConfirm}
        onConfirm={onConfirmDelete}
        data={selectedDisciplineData}
        companyData={companyData}
      ></DisciplineDeleteConfirm>
    </LocalizationProvider>
  );
};

export default Discipline;
