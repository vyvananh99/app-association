import React, { useState, useMemo, useEffect } from 'react';
import { Box, Grid, Button } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { toast } from 'react-toastify';
import MainCard from 'components/MainCard';
import { Add, InfoOutline, Delete } from '@mui/icons-material';
import CommonTable from '../../common/common-table';
import WorkingHistoryModal from './work-history-modal';
import WorkingHistoryDeleteConfirm from './work-history-delete-confirm';
import { getWorkingInfoByEmployeeApi, updateWorkingApi } from 'api/working.api';
import dayjs from 'dayjs';
import { formatNumber } from 'utils/convert-money';

const WorkHistory = ({
  action,
  onClose,
  rowData,
  companyData,
  locationData,
  departmentData,
  sectionData,
  functionData,
  positionData,
  jobTypeData,
  worklevelData,
  otherListNData,
  costCenterData,
  otherListData,
}) => {
  const [actionModal, setActionModal] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [workingData, setWorkingData] = useState([]);
  const [selectedWorkingData, setSelectedWorkingData] = useState({});
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  const workStatusList = otherListNData.filter((i) => i.type === 'WORK_STATUS');

  useEffect(() => {
    fetchWorkingData();
  }, []);

  const fetchWorkingData = async () => {
    try {
      const employeeId = rowData.employeeId;
      const getWorkingData = await getWorkingInfoByEmployeeApi(employeeId);
      setWorkingData(getWorkingData.data);
    } catch (error) {
      toast.error('Failed to fetch WorkHistory');
    }
  };

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
        const resultCreate = await createWorkingHistoryApi(newData);
        if (resultCreate.isSuccess) {
          toast.success('Create WorkHistory successfully');
          fetchWorkingData();
          setOpenModal(false);
        } else toast.error(resultCreate.message);
      } else if (actionModal === 'edit' && selectedWorkingData.pkey) {
        const resultUpdate = await updateWorkingHistoryApi(newData, selectedWorkingData.pkey);
        if (resultUpdate.isSuccess) {
          toast.success('Update WorkHistory successfully');
          fetchWorkingData();
          setOpenModal(false);
        } else toast.error(resultUpdate.message);
      } else {
        toast.error('WorkHistory not found');
      }
    } catch {
      toast.error(`${action === 'edit' ? 'Update' : 'Create'} WorkHistory failed`);
    }
  };

  const onConfirmDelete = async (data) => {
    try {
      const deleteResult = await deleteWorkingHistoryApi(data.pkey);
      setOpenDeleteConfirm(false);
      if (deleteResult.isSuccess) {
        fetchWorkingData();
        toast.success('Delete WorkHistory successfully');
      } else {
        toast.error(deleteResult.message);
      }
    } catch {
      toast.error('Delete WorkHistory failed');
    }
  };

  const onCreate = () => {
    setActionModal('create');
    setOpenModal(true);
    setSelectedWorkingData({});
  };

  const onEdit = (data) => {
    setActionModal('edit');
    setSelectedWorkingData(data);
    setOpenModal(true);
  };

  const onDelete = (data) => {
    setOpenDeleteConfirm(true);
    setSelectedWorkingData(data);
  };

  const columns = useMemo(
    () => [
      {
        id: 'actions',
        header: '',
        size: 90,
        cell: ({ row }) => (
          <Box display="flex" gap={1} flexWrap="nowrap" alignItems="center" sx={{ whiteSpace: 'nowrap' }}>
            <Button variant="contained" color="primary" size="small" startIcon={<InfoOutline />} onClick={() => onEdit(row.original)}>
              info
            </Button>
          </Box>
        )
      },
      {
        id: 'no',
        header: () => 'No.',
        size: 70,
        cell: ({ row }) => row.index + 1
      },
      {
        accessorKey: 'workStatus',
        header: () => 'Movement',
        cell: ({ row }) => {
          const value = row.getValue('workStatus');
          const valueCus = value ? workStatusList.find((i) => i.id === value)?.name : '';
          return <span>{valueCus}</span>;
        },
        minSize: 100
      },
      {
        accessorKey: 'issuedDate',
        header: () => 'Issued Date',
        cell: ({ row }) => {
          const value = row.getValue('issuedDate');
          const valueCus = value ? dayjs(value).format('DD-MM-YYYY') : '';
          return <span>{valueCus}</span>;
        },
        minSize: 100
      },
      {
        accessorKey: 'effectDate',
        header: () => 'Effect Date',
        cell: ({ row }) => {
          const value = row.getValue('effectDate');
          const valueCus = value ? dayjs(value).format('DD-MM-YYYY') : '';
          return <span>{valueCus}</span>;
        },
        minSize: 100
      },
      {
        accessorKey: 'appliedBy',
        header: () => 'Applied By',
        minSize: 150
      },
      {
        accessorKey: 'company',
        header: () => 'Company',
        cell: ({ row }) => {
          const value = row.getValue('company');
          const valueCus = value ? value.name || value.enName : '';
          return <span>{valueCus}</span>;
        },
        minSize: 250
      },
      {
        accessorKey: 'function',
        header: () => 'Function',
        cell: ({ row }) => {
          const value = row.getValue('function');
          const valueCus = value ? value.vnName || value.enName : '';
          return <span>{valueCus}</span>;
        },
        minSize: 200
      },
      {
        accessorKey: 'position',
        header: () => 'Position',
        cell: ({ row }) => {
          const value = row.getValue('position');
          const valueCus = value ? value.vnName || value.enName : '';
          return <span>{valueCus}</span>;
        },
        minSize: 200
      },
      {
        accessorKey: 'department',
        header: () => 'Department',
        cell: ({ row }) => {
          const value = row.getValue('department');
          const valueCus = value ? value.vnName || value.enName : '';
          return <span>{valueCus}</span>;
        },
        minSize: 250
      },
      {
        accessorKey: 'section',
        header: () => 'Section',
        cell: ({ row }) => {
          const value = row.getValue('section');
          const valueCus = value ? value.vnName || value.enName : '';
          return <span>{valueCus}</span>;
        },
        minSize: 200
      },

      {
        accessorKey: 'location',
        header: () => 'Location',
        cell: ({ row }) => {
          const value = row.getValue('location');
          const valueCus = value ? value.vnName || value.enName : '';
          return <span>{valueCus}</span>;
        },
        minSize: 200
      },
      {
        accessorKey: 'costCenter',
        header: () => 'Cost Center',
        minSize: 110
      },
      {
        accessorKey: 'workLevel',
        header: () => 'Work Level',
        cell: ({ row }) => {
          const value = row.getValue('workLevel');
          const valueCus = value ? worklevelData.find((i) => i.id === value) : '';
          return <span>{(valueCus && valueCus.payPos) || ''}</span>;
        },
        minSize: 100
      },
      {
        accessorKey: 'basic',
        header: () => 'Basic',
        cell: ({ row }) => {
          const value = row.getValue('basic');
          const valueCus = value ? formatNumber(value) : '';
          return <span>{valueCus}</span>;
        },
        minSize: 120
      },
      {
        accessorKey: 'grossSal',
        header: () => 'Gross',
        cell: ({ row }) => {
          const value = row.getValue('grossSal');
          const valueCus = value ? formatNumber(value) : '';
          return <span>{valueCus}</span>;
        },
        minSize: 120
      },
      {
        accessorKey: 'mgtAllow',
        header: () => 'mgt. Allowance',
        minSize: 130
      },
      {
        accessorKey: 'totalBase',
        header: () => 'Total Base',
        cell: ({ row }) => {
          const value = row.getValue('totalBase');
          const valueCus = value ? formatNumber(value) : '';
          return <span>{valueCus}</span>;
        },
        minSize: 120
      },
      {
        accessorKey: 'nth',
        header: () => 'NTH',
        cell: ({ row }) => {
          const value = row.getValue('nth');
          const valueCus = value ? formatNumber(value) : '';
          return <span>{valueCus}</span>;
        },
        minSize: 120
      },
      {
        accessorKey: 'payPoint',
        header: () => 'Pay Point',
        minSize: 120
      },
      {
        accessorKey: 'anTotalNth',
        header: () => 'AnnualNTH',
        cell: ({ row }) => {
          const value = row.getValue('anTotalNth');
          const valueCus = value ? formatNumber(value) : '';
          return <span>{valueCus}</span>;
        },
        minSize: 120
      },
      {
        accessorKey: 'varpayRange',
        header: () => 'Variable Pay Range',
        minSize: 150
      },
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
            {/* <Grid display="flex" justifyContent="flex-end" marginLeft="auto">
              <Button sx={{ mb: 2, mr: 1 }} variant="contained" color="primary" size="small" startIcon={<Add />} onClick={() => onCreate()}>
                Create
              </Button>
            </Grid> */}
            <CommonTable data={workingData} columns={columns} tableHeight={'90%'} />
          </Box>
        </MainCard>
      </Box>
      <WorkingHistoryModal
        open={openModal}
        workingHistoryLevel={{}}
        setOpen={setOpenModal}
        action={actionModal}
        data={selectedWorkingData}
        onAction={onAction}
        companyData={companyData}
        locationData={locationData}
        departmentData={departmentData}
        sectionData={sectionData}
        functionData={functionData}
        positionData={positionData}
        costCenterData={costCenterData}
        jobTypeData={jobTypeData}
        worklevelData={worklevelData}
        otherListNData={otherListNData}
        otherListData={otherListData}
      ></WorkingHistoryModal>
      <WorkingHistoryDeleteConfirm
        open={openDeleteConfirm}
        setOpen={setOpenDeleteConfirm}
        onConfirm={onConfirmDelete}
        data={selectedWorkingData}
        companyData={companyData}
      ></WorkingHistoryDeleteConfirm>
    </LocalizationProvider>
  );
};

export default WorkHistory;
