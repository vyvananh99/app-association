import React from 'react';
import { Box, Typography } from '@mui/material';

const CommonTabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <Box
      sx={{ width: '100%' }}
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 1, width: '100%' }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default CommonTabPanel;
