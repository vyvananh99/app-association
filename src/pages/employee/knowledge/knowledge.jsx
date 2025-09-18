import React, { useState } from 'react';
import { Box, Tabs, Tab, Modal, IconButton } from '@mui/material';
import CommonTabPanel from '../../common/common-tab-panel';
import MainCard from 'components/MainCard';
import CloseIcon from '@mui/icons-material/Close';
import Academy from './acadamy/academy';
import Language from './language/language';
import OtherSkill from './other-skill/other-skill';
function Knowledge({
  rowData,
  open,
  setOpen,
  action,
  fetchData,
  companyData,
  locationData,
  departmentData,
  sectionData,
  functionData,
  positionData,
  costCenterData,
  jobTypeData,
  contractTypeData,
  otherListNData,
  otherListData,
  provinceData,
  cityData,
  employeeCvData
}) {
  const [value, setValue] = useState(0);

  const handleClose = (event, reason) => {
    if (reason && reason === 'backdropClick') {
      return;
    }
    setOpen(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <MainCard sx={{ mt: 1 }} contentSX={{ p: 1.5 }}>
      <Tabs
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          '& .MuiTabs-flexContainer': {
            flexWrap: 'wrap'
          }
        }}
        value={value}
        onChange={handleChange}
        aria-label="basic tabs example"
      >
        <Tab
          label="Academy"
          sx={{
            backgroundColor: value === 0 ? '#f0f0f0' : 'transparent',
            '&:hover': {
              backgroundColor: value === 0 ? '#e0e0e0' : 'transparent'
            },
            transition: 'background-color 0.3s ease'
          }}
        />
        <Tab
          label="Language"
          sx={{
            backgroundColor: value === 1 ? '#f0f0f0' : 'transparent',
            '&:hover': {
              backgroundColor: value === 1 ? '#e0e0e0' : 'transparent'
            },
            transition: 'background-color 0.3s ease'
          }}
        />
        <Tab
          label="Other Skills"
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
        <Academy rowData={rowData} />
      </CommonTabPanel>
      <CommonTabPanel value={value} index={1}>
        <Language rowData={rowData} />
      </CommonTabPanel>
      <CommonTabPanel value={value} index={2}>
        <OtherSkill rowData={rowData} />
      </CommonTabPanel>
    </MainCard>
  );
}

export default Knowledge;
