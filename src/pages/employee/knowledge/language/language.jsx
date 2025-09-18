import React, { useState, useMemo, useEffect } from 'react';
import { Box, Grid, Button } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { toast } from 'react-toastify';
import MainCard from 'components/MainCard';
import { Add, Edit, Delete } from '@mui/icons-material';
import CommonTable from '../../../common/common-table';
import LanguageModal from './language-modal';
import LanguageDeleteConfirm from './language-delete-confirm';
import { getLanguageApi, createLanguageApi, updateLanguageApi, deleteLanguageApi } from 'api/Language.api';
import dayjs from 'dayjs';

const Language = ({ action, onClose, rowData }) => {
  const [actionModal, setActionModal] = useState();
  const [openModalALanguage, setOpenModalALanguage] = useState(false);
  const [language, setLanguageData] = useState([]);
  const [selectedLanguageData, setSelectedLanguageData] = useState({});
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchLanguageData();
  }, []);

  const fetchLanguageData = async () => {
    try {
      const employeeId = rowData.employeeId;
      const getLanguageData = await getLanguageApi(employeeId);
      setLanguageData(getLanguageData.data);
    } catch (error) {
      toast.error('Failed to fetch Language');
    }
  };

  const onAction = async (data) => {
    try {
      const employeeId = rowData.employeeId;
      const newData = Object.assign(data, { employeeId });
      if (actionModal === 'create') {
        const resultCreate = await createLanguageApi(newData);
        if (resultCreate.isSuccess) {
          toast.success('Create Language successfully');
          fetchLanguageData();
          setOpenModalALanguage(false);
        } else toast.error(resultCreate.message);
      } else if (actionModal === 'edit' && selectedLanguageData.pkey) {
        const resultUpdate = await updateLanguageApi(newData, selectedLanguageData.pkey);
        if (resultUpdate.isSuccess) {
          toast.success('Update Language successfully');
          fetchLanguageData();
          setOpenModalALanguage(false);
        } else toast.error(resultUpdate.message);
      } else {
        toast.error('Language not found');
      }
    } catch {
      toast.error(`${action === 'edit' ? 'Update' : 'Create'} Language failed`);
    }
  };

  const onConfirmDelete = async (data) => {
    try {
      const deleteResult = await deleteLanguageApi(data.pkey);
      setOpenDeleteConfirm(false);
      if (deleteResult.isSuccess) {
        fetchLanguageData();
        toast.success('Delete Language successfully');
      } else {
        toast.error(deleteResult.message);
      }
    } catch {
      toast.error('Delete Language failed');
    }
  };

  const onCreate = () => {
    setActionModal('create');
    setOpenModalALanguage(true);
    setSelectedLanguageData({});
  };

  const onEdit = (data) => {
    setActionModal('edit');
    setSelectedLanguageData(data);
    setOpenModalALanguage(true);
  };

  const onDelete = (data) => {
    setOpenDeleteConfirm(true);
    setSelectedLanguageData(data);
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
        accessorKey: 'language',
        header: () => 'Language',
        minSize: 200
      },
      {
        accessorKey: 'certificate',
        header: () => 'Certificate',
        minSize: 200
      },
      {
        accessorKey: 'levels',
        header: () => 'Levels',
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
            <CommonTable data={language} columns={columns} tableHeight={'90%'} />
          </Box>
        </MainCard>
      </Box>
      <LanguageModal
        open={openModalALanguage}
        setOpen={setOpenModalALanguage}
        action={actionModal}
        data={selectedLanguageData}
        onAction={onAction}
      ></LanguageModal>
      <LanguageDeleteConfirm
        open={openDeleteConfirm}
        setOpen={setOpenDeleteConfirm}
        onConfirm={onConfirmDelete}
        data={selectedLanguageData}
      ></LanguageDeleteConfirm>
    </LocalizationProvider>
  );
};

export default Language;
