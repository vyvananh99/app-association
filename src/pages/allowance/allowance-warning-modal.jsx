import React, { useEffect, useState, useMemo } from 'react';
import { Modal, Box, Typography, IconButton, Button, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import FormikAutocomplete from '../common/formik-autocomplete';
import { formatNumber, parseNumber } from 'utils/convert-money';
import dayjs from 'dayjs';
import CommonTable from '../common/common-table';

const AllowanceWarningModal = ({ open, setOpen, onAction, data, action, setDisableBtn, disableBtn, employeeData, allowTypeData }) => {
  const handleClose = () => {
    setOpen(false);
    setDisableBtn(true);
  };
  const [dataTable, setDataTable] = useState([]);
  const [toCreate, setToCreate] = useState([]);
  const [toUpdate, setToUpdate] = useState([]);

  useEffect(() => {
    if (!data.valid) {
      setDataTable(data.validData || []);
    } else {
      setToCreate(data.toCreate || []);
      setToUpdate(data.toUpdate || []);
    }
  }, [data]);

  useEffect(() => {
    setDisableBtn(false);
  }, [open]);

  const columns = useMemo(
    () => [
      {
        id: 'no',
        header: () => 'No.',
        size: 70,
        cell: ({ row }) => row.index + 1
      },
      {
        accessorKey: 'employeeId',
        header: () => 'Employee ID',
        minSize: 100,
        cell: ({ row }) => {
          const value = row.getValue('employeeId');
          if (value.includes('Error: ')) {
            return <span style={{ color: 'red' }}>{value.replace('Error: ', '')}</span>;
          } else {
            return <span>{value}</span>;
          }
        }
      },
      {
        accessorKey: 'employee',
        header: () => 'FullName',
        cell: ({ row }) => {
          const value = row.getValue('employee');
          const valueCus = value ? value.enFullName || value.vnFullName : '';
          return <span>{valueCus}</span>;
        },
        minSize: 250
      },
      {
        accessorKey: 'type',
        header: () => 'Type',
        minSize: 60,
        cell: ({ row }) => {
          const value = row.getValue('type');
          if (value.includes('Error: ')) {
            return <span style={{ color: 'red' }}>{value.replace('Error: ', '')}</span>;
          } else {
            return <span>{value}</span>;
          }
        }
      },
      {
        accessorKey: 'pay',
        header: () => 'Pay',
        cell: ({ row }) => {
          const value = row.getValue('pay');
          if (value.includes('Error: ')) {
            return <span style={{ color: 'red' }}>{value.replace('Error: ', '')}</span>;
          } else {
            const payCus = value ? formatNumber(value) : '';
            return <span>{payCus}</span>;
          }
        },
        minSize: 150
      },

      {
        accessorKey: 'startDate',
        header: () => 'Start Date',
        cell: ({ row }) => {
          const value = row.getValue('startDate');
          if (value.includes('Error: ')) {
            return <span style={{ color: 'red' }}>{value.replace('Error: ', '')}</span>;
          } else {
            const valueCus = value ? dayjs(value).format('DD-MM-YYYY') : '';
            return <span>{valueCus}</span>;
          }
        },
        minSize: 150
      },
      {
        accessorKey: 'endDate',
        header: () => 'End Date',
        cell: ({ row }) => {
          const value = row.getValue('endDate');
          const valueCus = value ? dayjs(value).format('DD-MM-YYYY') : '';
          return <span>{valueCus}</span>;
        },
        minSize: 150
      },
      {
        accessorKey: 'comments',
        header: () => 'Comment',
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
        minSize: 150
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
        minSize: 150
      }
    ],
    []
  );

  const handleUpdate = () => {
    onAction(toUpdate, toCreate);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: 3,
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: 24,
            maxWidth: '900px',
            width: '900px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            position: 'relative',
            overflowY: 'auto',
            maxHeight: '80vh'
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

          <Typography variant="h4" sx={{ mb: 2 }}>
            {!data.valid ? 'List Allowance Error' : 'List Allowance Warning'}
          </Typography>
          {toUpdate.length < 1 && toCreate.length < 1 && (
            <Typography variant="h5" sx={{ mb: 1, mt: 1 }}>
              No data update or create
            </Typography>
          )}

          {!data.valid && <CommonTable data={dataTable} columns={columns} tableWidth="100%" />}
          {data.valid && (
            <>
              {toUpdate.length > 0 && (
                <>
                  <Typography variant="h5" sx={{ mb: 1, mt: 1 }}>
                    Update List
                  </Typography>
                  <CommonTable data={toUpdate} columns={columns} tableHeight={200} tableWidth="100%" />
                </>
              )}

              {toCreate.length > 0 && (
                <>
                  <Typography variant="h5" sx={{ mb: 1, mt: 1 }}>
                    Create List
                  </Typography>
                  <CommonTable data={toCreate} columns={columns} tableHeight={200} tableWidth="100%" />
                </>
              )}
            </>
          )}

          <Box
            sx={{
              mt: 3,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
              width: '100%'
            }}
          >
            {data.valid && (toUpdate.length > 0 || toCreate.length > 0) && (
              <Button disabled={disableBtn} type="submit" onClick={() => handleUpdate()} variant="contained" sx={{ width: 80, height: 30 }}>
                Update
              </Button>
            )}
            <Button onClick={() => handleClose()} variant="outlined" sx={{ width: 80, height: 30 }}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </LocalizationProvider>
  );
};

export default React.memo(AllowanceWarningModal);
