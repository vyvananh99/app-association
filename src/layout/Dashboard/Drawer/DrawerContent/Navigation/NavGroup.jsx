import PropTypes from 'prop-types';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import { useState } from 'react';

// project import
import NavItem from './NavItem';
import { useGetMenuMaster } from 'api/menu';

export default function NavGroup({ item }) {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  // Kiểm tra nếu có children thì hiển thị dạng collapsible menu
  const [open, setOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  return (
    <List
      subheader={
        item.title &&
        drawerOpen && (
          <Box sx={{ pl: 3, mb: 1.5 }}>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              onClick={hasChildren ? handleToggle : undefined}
              sx={{
                cursor: hasChildren ? 'pointer' : 'default',
                fontWeight: 'bold' // Thêm một chút làm nổi bật tiêu đề
              }}
            >
              {item.title}
            </Typography>
          </Box>
        )
      }
      sx={{ mb: drawerOpen ? 1.5 : 0, py: 0, zIndex: 0 }}
    >
      {/* Duyệt qua từng mục con */}
      {item.children?.map((menuItem) => (
        <NavItem key={menuItem.id} item={menuItem} level={1} />
      ))}

      {/* Nếu có children, hiển thị menu con khi mở */}
      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children.map((child) => (
              <NavItem key={child.id} item={child} level={2} />
            ))}
          </List>
        </Collapse>
      )}
    </List>
  );
}

NavGroup.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.object)
  }).isRequired
};
