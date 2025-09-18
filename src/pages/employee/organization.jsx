import React, { useState, useCallback, useEffect } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import CommonTabPanel from '../common/common-tab-panel';
import Company from './company/company';
import Department from './department/department';
import Section from './section/section';
import { getCompanyApi, updateCompanyApi, createCompanyApi, deleteCompanyApi } from 'api/company.api';
import { getDepartmentApi, updateDepartmentApi, createDepartmentApi, deleteDepartmentApi } from 'api/department.api';

function Organization() {
  const [companyData, setCompanyData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [value, setValue] = useState(0);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    fetchCompanyData();
    fetchDepartmentData();
  }, []);

  const fetchCompanyData = async () => {
    try {
      const getCompanyData = await getCompanyApi();
      setCompanyData(getCompanyData);
      getCompanyData.length > 0 && setSelectedCompany(getCompanyData[0].id);
    } catch (error) {
      toast.error('Failed to fetch companies');
    }
  };

  const fetchDepartmentData = async () => {
    const getDepartmentData = await getDepartmentApi();
    setDepartmentData(getDepartmentData);
    getDepartmentData.length > 0 && setSelectedDepartment(getDepartmentData[0].id);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
        <Tab
          label="Company"
          id="tab-0"
          sx={{
            backgroundColor: value === 0 ? '#f0f0f0' : 'transparent', // background for selected tab
            '&:hover': {
              backgroundColor: value === 0 ? '#e0e0e0' : 'transparent' // hover effect
            },
            transition: 'background-color 0.3s ease'
          }}
        />
        <Tab
          label="Department"
          id="tab-1"
          sx={{
            backgroundColor: value === 1 ? '#f0f0f0' : 'transparent',
            '&:hover': {
              backgroundColor: value === 1 ? '#e0e0e0' : 'transparent'
            },
            transition: 'background-color 0.3s ease'
          }}
        />
        <Tab
          label="Section"
          id="tab-2"
          sx={{
            backgroundColor: value === 2 ? '#f0f0f0' : 'transparent',
            '&:hover': {
              backgroundColor: value === 2 ? '#e0e0e0' : 'transparent'
            },
            transition: 'background-color 0.3s ease'
          }}
        />
      </Tabs>
      <CommonTabPanel value={value} index={0}>
        <Company companyData={companyData} setCompanyData={setCompanyData} />
      </CommonTabPanel>
      <CommonTabPanel value={value} index={1}>
        <Department
          companyData={companyData}
          selectedCompany={selectedCompany}
          setSelectedCompany={setSelectedCompany}
          departmentData={departmentData}
          setDepartmentData={setDepartmentData}
        />
      </CommonTabPanel>
      <CommonTabPanel value={value} index={2}>
        <Section
          companyData={companyData}
          departmentData={departmentData}
          selectedCompany={selectedCompany}
          setSelectedCompany={setSelectedCompany}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
        />
      </CommonTabPanel>
    </Box>
  );
}

export default Organization;
