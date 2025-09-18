import React, { useState, useMemo, useEffect } from 'react';
import { Box, Grid, Button } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { toast } from 'react-toastify';
import MainCard from 'components/MainCard';
import { Add, Edit, Delete } from '@mui/icons-material';
import CommonTable from '../../../common/common-table';
import OtherSkillModal from './other-skill-modal';
import OtherSkillDeleteConfirm from './other-skill-delete-confirm';
import { getOtherSkillApi, createOtherSkillApi, updateOtherSkillApi, deleteOtherSkillApi } from 'api/other-skill.api';
import dayjs from 'dayjs';

const OtherSkill = ({ action, onClose, rowData }) => {
  const [actionModal, setActionModal] = useState();
  const [openModalAOtherSkill, setOpenModalAOtherSkill] = useState(false);
  const [OtherSkill, setOtherSkillData] = useState([]);
  const [selectedOtherSkillData, setSelectedOtherSkillData] = useState({});
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchOtherSkillData();
  }, []);

  const fetchOtherSkillData = async () => {
    try {
      const employeeId = rowData.employeeId;
      const getOtherSkillData = await getOtherSkillApi(employeeId);
      setOtherSkillData(getOtherSkillData.data);
    } catch (error) {
      toast.error('Failed to fetch OtherSkill');
    }
  };

  const onAction = async (data) => {
    try {
      const employeeId = rowData.employeeId;
      const newData = Object.assign(data, { employeeId });
      if (actionModal === 'create') {
        const resultCreate = await createOtherSkillApi(newData);
        if (resultCreate.isSuccess) {
          toast.success('Create OtherSkill successfully');
          fetchOtherSkillData();
          setOpenModalAOtherSkill(false);
        } else toast.error(resultCreate.message);
      } else if (actionModal === 'edit' && selectedOtherSkillData.pkey) {
        const resultUpdate = await updateOtherSkillApi(newData, selectedOtherSkillData.pkey);
        if (resultUpdate.isSuccess) {
          toast.success('Update OtherSkill successfully');
          fetchOtherSkillData();
          setOpenModalAOtherSkill(false);
        } else toast.error(resultUpdate.message);
      } else {
        toast.error('OtherSkill not found');
      }
    } catch {
      toast.error(`${action === 'edit' ? 'Update' : 'Create'} OtherSkill failed`);
    }
  };

  const onConfirmDelete = async (data) => {
    try {
      const deleteResult = await deleteOtherSkillApi(data.pkey);
      setOpenDeleteConfirm(false);
      if (deleteResult.isSuccess) {
        fetchOtherSkillData();
        toast.success('Delete OtherSkill successfully');
      } else {
        toast.error(deleteResult.message);
      }
    } catch {
      toast.error('Delete OtherSkill failed');
    }
  };

  const onCreate = () => {
    setActionModal('create');
    setOpenModalAOtherSkill(true);
    setSelectedOtherSkillData({});
  };

  const onEdit = (data) => {
    setActionModal('edit');
    setSelectedOtherSkillData(data);
    setOpenModalAOtherSkill(true);
  };

  const onDelete = (data) => {
    setOpenDeleteConfirm(true);
    setSelectedOtherSkillData(data);
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
        accessorKey: 'skill',
        header: () => 'Skill',
        minSize: 200
      },
      {
        accessorKey: 'relatTraining',
        header: () => 'Relevant Training',
        minSize: 200
      },
      {
        accessorKey: 'certificate',
        header: () => 'Certificate',
        minSize: 200
      },
      {
        accessorKey: 'issuedDate',
        header: () => 'Issued Date',
        cell: ({ row }) => {
          const value = row.getValue('issuedDate');
          const dateCus = value ? dayjs(value).format('DD-MM-YYYY') : '';
          return <span>{dateCus}</span>;
        },
        minSize: 100
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
                xs: 'calc(80vh - 120px)',
                xl: 'calc(80vh - 80px)'
              },
              minHeight: '400px',
            }}
          >
            <Grid display="flex" justifyContent="flex-end" marginLeft="auto">
              <Button sx={{ mb: 2, mr: 1 }} variant="contained" color="primary" size="small" startIcon={<Add />} onClick={() => onCreate()}>
                Create
              </Button>
            </Grid>
            <CommonTable data={OtherSkill} columns={columns} tableHeight={'500'} />
          </Box>
        </MainCard>
      </Box>
      <OtherSkillModal
        open={openModalAOtherSkill}
        setOpen={setOpenModalAOtherSkill}
        action={actionModal}
        data={selectedOtherSkillData}
        onAction={onAction}
      ></OtherSkillModal>
      <OtherSkillDeleteConfirm
        open={openDeleteConfirm}
        setOpen={setOpenDeleteConfirm}
        onConfirm={onConfirmDelete}
        data={selectedOtherSkillData}
      ></OtherSkillDeleteConfirm>
    </LocalizationProvider>
  );
};

export default OtherSkill;
