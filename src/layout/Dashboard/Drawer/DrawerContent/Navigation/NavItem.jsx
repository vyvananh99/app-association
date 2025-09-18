import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation, matchPath } from 'react-router-dom';

// material-ui
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useMediaQuery from '@mui/material/useMediaQuery';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// ==============================|| NAVIGATION - LIST ITEM ||============================== //

export default function NavItem({ item, level }) {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const isSelected = !!(item?.url && pathname && matchPath({ path: item.url, end: false }, pathname));

  const hasChildren = item.children && item.children.length > 0;
  const handleClick = () => {
    if (hasChildren) {
      setOpen((prev) => !prev);
    }
  };

  return (
    <>
      <ListItemButton
        component={item.url ? Link : 'div'}
        to={item.url || '#'}
        selected={isSelected}
        onClick={handleClick}
        sx={{
          pl: level * 2,
          backgroundColor: isSelected ? 'primary.lighter' : 'transparent',
          '&:hover': { backgroundColor: 'primary.lighter' }
        }}
      >
        {item.icon && (
          // <ListItemIcon sx={{ minWidth: 32 }}>
          //   <item.icon />
          // </ListItemIcon>
          <FontAwesomeIcon
            size="lg"
            icon={item.icon}
            style={{
              paddingRight: drawerOpen ? '15px' : '',
              paddingTop: !drawerOpen ? '6px' : '',
              paddingBottom: !drawerOpen ? '6px' : ''
            }}
          />
        )}
        {drawerOpen && (
          <ListItemText
            primary={
              <Typography variant="body1" color={isSelected ? 'primary.main' : 'text.primary'}>
                {item.title}
              </Typography>
            }
          />
        )}
        {hasChildren && drawerOpen && <ListItemIcon sx={{ minWidth: 24 }}>{open ? <ExpandLess /> : <ExpandMore />}</ListItemIcon>}
      </ListItemButton>

      {/* Nếu có children, hiển thị menu con */}
      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children.map((child) => (
              <NavItem key={child.id} item={child} level={level + 1} />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
}

NavItem.propTypes = {
  item: PropTypes.object.isRequired,
  level: PropTypes.number
};
