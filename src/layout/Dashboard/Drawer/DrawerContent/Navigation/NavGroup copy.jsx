import PropTypes from 'prop-types';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import NavItem from './NavItem';

export default function NavGroup({ item }) {
  if (!item) return null;

  const renderMenuItems = (menuItems, level = 1) => {
    return menuItems.map((menuItem) => {
      if (menuItem.children && menuItem.children.length > 0) {
        // Nếu có children → Render NavGroup (đệ quy)
        return <NavGroup key={menuItem.id} item={menuItem} />;
      }

      // Nếu là item → Render NavItem
      return <NavItem key={menuItem.id} item={menuItem} level={level} />;
    });
  };

  return (
    <List
      subheader={
        item.title && (
          <Box sx={{ pl: 3, mb: 1.5 }}>
            <Typography variant="subtitle2" color="textSecondary">
              {item.title}
            </Typography>
          </Box>
        )
      }
      sx={{ mb: 1.5, py: 0, zIndex: 0 }}
    >
      {renderMenuItems(item.children || [], 1)}
    </List>
  );
}

NavGroup.propTypes = { item: PropTypes.object.isRequired };
