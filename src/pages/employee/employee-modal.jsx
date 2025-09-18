import React, { useState } from 'react';
import { Box, Tabs, Tab, Modal, IconButton } from '@mui/material';
import CommonTabPanel from '../common/common-tab-panel';
import CloseIcon from '@mui/icons-material/Close';
import Profile from './profile/profile';
import CV from './cv/cv';
import Remuneration from './remuneration/remuneration';
import Insurance from './insurance/insurance';
import WorkHistory from './workHistory/work-history';
import Training from './training/training';
import Discipline from './discipline/discipline';
import Secondment from './secondment/secondment';
import Expatriation from './expatriation/expatriation';
import Knowledge from './knowledge/knowledge';
import Performance from './performance/performance';
import Commend from './commend/commend';
function EmployeeModal({
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
  employeeCvData,
  worklevelData,
  coursesData
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
    <Modal open={open} onClose={handleClose} disableEscapeKeyDown>
      <Box
        sx={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: 3,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: 24,
          width: '98%',
          height: '96%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          position: 'relative'
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
            label="Profile"
            sx={{
              backgroundColor: value === 0 ? '#f0f0f0' : 'transparent',
              '&:hover': {
                backgroundColor: value === 0 ? '#e0e0e0' : 'transparent'
              },
              transition: 'background-color 0.3s ease'
            }}
          />
          <Tab
            label="CV"
            sx={{
              backgroundColor: value === 1 ? '#f0f0f0' : 'transparent',
              '&:hover': {
                backgroundColor: value === 1 ? '#e0e0e0' : 'transparent'
              },
              transition: 'background-color 0.3s ease'
            }}
          />
          <Tab
            label="Remuneration"
            sx={{
              backgroundColor: value === 2 ? '#f0f0f0' : 'transparent',
              '&:hover': {
                backgroundColor: value === 2 ? '#e0e0e0' : 'transparent'
              },
              transition: 'background-color 0.3s ease'
            }}
          />
          <Tab
            label="Insurance"
            sx={{
              backgroundColor: value === 3 ? '#f0f0f0' : 'transparent',
              '&:hover': {
                backgroundColor: value === 3 ? '#e0e0e0' : 'transparent'
              },
              transition: 'background-color 0.3s ease'
            }}
          />
          <Tab
            label="Work History"
            sx={{
              backgroundColor: value === 4 ? '#f0f0f0' : 'transparent',
              '&:hover': {
                backgroundColor: value === 4 ? '#e0e0e0' : 'transparent'
              },
              transition: 'background-color 0.3s ease'
            }}
          />
          <Tab
            label="Training"
            sx={{
              backgroundColor: value === 5 ? '#f0f0f0' : 'transparent',
              '&:hover': {
                backgroundColor: value === 5 ? '#e0e0e0' : 'transparent'
              },
              transition: 'background-color 0.3s ease'
            }}
          />
          <Tab
            label="Performance"
            sx={{
              backgroundColor: value === 6 ? '#f0f0f0' : 'transparent',
              '&:hover': {
                backgroundColor: value === 6 ? '#e0e0e0' : 'transparent'
              },
              transition: 'background-color 0.3s ease'
            }}
          />
          <Tab
            label="Commend"
            sx={{
              backgroundColor: value === 7 ? '#f0f0f0' : 'transparent',
              '&:hover': {
                backgroundColor: value === 7 ? '#e0e0e0' : 'transparent'
              },
              transition: 'background-color 0.3s ease'
            }}
          />
          <Tab
            label="Discipline"
            sx={{
              backgroundColor: value === 8 ? '#f0f0f0' : 'transparent',
              '&:hover': {
                backgroundColor: value === 8 ? '#e0e0e0' : 'transparent'
              },
              transition: 'background-color 0.3s ease'
            }}
          />
          <Tab
            label="Secondment"
            sx={{
              backgroundColor: value === 9 ? '#f0f0f0' : 'transparent',
              '&:hover': {
                backgroundColor: value === 9 ? '#e0e0e0' : 'transparent'
              },
              transition: 'background-color 0.3s ease'
            }}
          />
          <Tab
            label="Expatriation"
            sx={{
              backgroundColor: value === 10 ? '#f0f0f0' : 'transparent',
              '&:hover': {
                backgroundColor: value === 10 ? '#e0e0e0' : 'transparent'
              },
              transition: 'background-color 0.3s ease'
            }}
          />
          <Tab
            label="Knowledge"
            sx={{
              backgroundColor: value === 11 ? '#f0f0f0' : 'transparent',
              '&:hover': {
                backgroundColor: value === 11 ? '#e0e0e0' : 'transparent'
              },
              transition: 'background-color 0.3s ease'
            }}
          />
        </Tabs>

        <CommonTabPanel value={value} index={0}>
          <Profile
            rowData={rowData}
            setOpen={setOpen}
            action={action}
            fetchData={fetchData}
            companyData={companyData}
            locationData={locationData}
            departmentData={departmentData}
            sectionData={sectionData}
            functionData={functionData}
            positionData={positionData}
            costCenterData={costCenterData}
            jobTypeData={jobTypeData}
            contractTypeData={contractTypeData}
            otherListNData={otherListNData}
          ></Profile>
        </CommonTabPanel>
        <CommonTabPanel value={value} index={1}>
          <CV
            setOpen={setOpen}
            action={action}
            rowData={rowData}
            employeeCvData={employeeCvData}
            otherListNData={otherListNData}
            otherListData={otherListData}
            provinceData={provinceData}
            cityData={cityData}
          />
        </CommonTabPanel>
        <CommonTabPanel value={value} index={2}>
          <Remuneration
            setOpen={setOpen}
            rowData={rowData}
            fetchData={fetchData}
            otherListData={otherListData}
            otherListNData={otherListNData}
          />
        </CommonTabPanel>
        <CommonTabPanel value={value} index={3}>
          <Insurance rowData={rowData} fetchData={fetchData} />
        </CommonTabPanel>
        <CommonTabPanel value={value} index={4}>
          <WorkHistory
            rowData={rowData}
            companyData={companyData}
            locationData={locationData}
            departmentData={departmentData}
            sectionData={sectionData}
            functionData={functionData}
            positionData={positionData}
            costCenterData={costCenterData}
            jobTypeData={jobTypeData}
            contractTypeData={contractTypeData}
            otherListNData={otherListNData}
            worklevelData={worklevelData}
            otherListData={otherListData}
          />
        </CommonTabPanel>
        <CommonTabPanel value={value} index={5}>
          <Training rowData={rowData} coursesData={coursesData} otherListNData={otherListNData} />
        </CommonTabPanel>
        <CommonTabPanel value={value} index={6}>
          <Performance rowData={rowData} otherListData={otherListData} otherListNData={otherListNData} />
        </CommonTabPanel>
        <CommonTabPanel value={value} index={7}>
          <Commend rowData={rowData} otherListData={otherListData} companyData={companyData} />
        </CommonTabPanel>
        <CommonTabPanel value={value} index={8}>
          <Discipline rowData={rowData} otherListData={otherListData} companyData={companyData} />
        </CommonTabPanel>
        <CommonTabPanel value={value} index={9}>
          <Secondment rowData={rowData} />
        </CommonTabPanel>
        <CommonTabPanel value={value} index={10}>
          <Expatriation rowData={rowData} />
        </CommonTabPanel>
        <CommonTabPanel value={value} index={11}>
          <Knowledge rowData={rowData} />
        </CommonTabPanel>
      </Box>
    </Modal>
  );
}

export default EmployeeModal;
