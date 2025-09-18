import React, { useState, useEffect, useMemo } from 'react';
import { Box, Button, Grid, FormControl, InputLabel, Select, MenuItem, Autocomplete, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import { Refresh, Add, Edit, Delete } from '@mui/icons-material';

// Project imports
import CommonTable from '../../common/common-table';
import SectionModal from './section-modal';
import SectionDeleteConfirm from './section-delete-confirm';
import { getSectionApi, updateSectionApi, createSectionApi, deleteSectionApi } from 'api/section.api';
import { getDepartmentApi } from 'api/department.api';

const Section = ({ companyData, departmentData, selectedCompany, setSelectedCompany, selectedDepartment, setSelectedDepartment }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [rowData, setRowData] = useState(null);
  const [open, setOpen] = useState(false);
  const [currentId, setCurrentId] = useState();
  const [action, setAction] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [departmentList, setDepartmentList] = useState([]);
  const [disableCreate, setDisableCreate] = useState(false);

  const columns = useMemo(() => [
    { id: 'no', header: 'No.', size: 70, cell: ({ row }) => row.index + 1 },
    { accessorKey: 'id', header: 'Code' },
    { accessorKey: 'enName', header: 'English Name' },
    { accessorKey: 'vnName', header: 'Vietnamese Name' },
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
  ]);

  const fetchData = async () => {
    const sectionData = await getSectionApi();
    setData(sectionData);
  };

  const updateSectionFilter = () => {
    const filteredDataNew = data.filter(
      (section) => section.comId === selectedCompany && (selectedDepartment === '' || section.depId === selectedDepartment)
    );
    setFilteredData(filteredDataNew);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    updateSectionFilter();
  }, [data, selectedCompany, selectedDepartment]);

  useEffect(() => {
    if (departmentData && departmentData.length > 0) {
      setDepartmentList(departmentData);
    }
  }, [departmentData]);

  useEffect(() => {
    if (selectedCompany && departmentList.length > 0) {
      const filteredDepartments = departmentList.filter((department) => department.comId === selectedCompany);
      selectedDepartment && setSelectedDepartment(filteredDepartments.length > 0 ? filteredDepartments[0].id : '');
    }
  }, [selectedCompany, departmentList]);

  useEffect(() => {
    if (!selectedDepartment) setDisableCreate(true);
    else setDisableCreate(false);
  }, [selectedDepartment]);

  const onEdit = (data) => {
    setAction('edit');
    setCurrentId(data.id);
    setRowData(data);
    setOpen(true);
  };

  const onDelete = (data) => {
    setRowData(data);
    setOpenDeleteConfirm(true);
  };

  const onConfirmDelete = async (data) => {
    try {
      await deleteSectionApi(data.id, data.comId, data.depId);
      setOpenDeleteConfirm(false);
      await fetchData();
      toast.success('Delete Section successfully');
    } catch {
      toast.error('Delete Section failed');
    }
  };

  const onCreate = () => {
    setAction('create');
    setRowData({});
    setOpen(true);
  };

  const onAction = async (data) => {
    try {
      data.comId = selectedCompany;
      data.depId = selectedDepartment;
      if (action === 'create') {
        const resultCreate = await createSectionApi(data);
        if (resultCreate.isSuccess) toast.success('Create Section successfully');
        else toast.error(resultUpdate.message);
      } else if (action === 'edit' && currentId) {
        const resultUpdate = await updateSectionApi(data, currentId);
        if (resultUpdate.isSuccess) toast.success('Update Section successfully');
        else toast.error(resultUpdate.message);
      } else {
        toast.error('Section not found');
      }
      setOpen(false);
      await fetchData();
    } catch {
      toast.error(`${action === 'edit' ? 'Update' : 'Create'} Section failed`);
    }
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid display="flex" alignItems="center">
        <FormControl fullWidth sx={{ width: '400px' }}>
          <InputLabel shrink={true} id="company-select">
            Company
          </InputLabel>
          <Select
            labelId="company-select"
            value={selectedCompany}
            label="Company"
            onChange={(e) => setSelectedCompany(e.target.value)}
            sx={{
              width: '100%',
              height: '41px', // Set a fixed height
              backgroundColor: '#ffffff'
            }}
          >
            {companyData &&
              companyData.map((i) => (
                <MenuItem key={i.id} value={i.id}>
                  {i.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid display="flex" alignItems="center">
        <FormControl fullWidth sx={{ width: '400px' }}>
          <Autocomplete
            value={departmentList.find((department) => department.id === selectedDepartment) || null}
            onChange={(e, newValue) => {
              setSelectedDepartment(newValue ? newValue.id : ''); // Store only the `id` in the state
            }}
            options={departmentList.filter((department) => department.comId === selectedCompany)}
            getOptionLabel={(option) => option.enName || ''} // Display English name as the label
            isOptionEqualToValue={(option, value) => option.id === value} // Compare by `id`
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {option.enName} {/* Display the English name in the dropdown */}
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Department"
                variant="outlined"
                sx={{
                  backgroundColor: '#ffffff',
                  '& .MuiOutlinedInput-root': {
                    height: '41px'
                  }
                }}
              />
            )}
            sx={{
              width: '100%'
            }}
          />
        </FormControl>
      </Grid>

      <Grid display="flex" justifyContent="flex-end" marginLeft="auto" gap={1}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<Refresh />}
          onClick={fetchData}
          style={{ backgroundColor: '#4caf50' }}
        >
          Refresh
        </Button>
        <Button disabled={disableCreate} variant="contained" color="primary" size="small" startIcon={<Add />} onClick={onCreate}>
          Create
        </Button>
      </Grid>

      <CommonTable data={filteredData} columns={columns} searchQuery={searchQuery} tableHeight={290} />
      <SectionModal open={open} setOpen={setOpen} rowData={rowData} onAction={onAction} action={action} />
      <SectionDeleteConfirm open={openDeleteConfirm} setOpen={setOpenDeleteConfirm} onConfirm={onConfirmDelete} data={rowData} />
    </Grid>
  );
};

export default Section;
