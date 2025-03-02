import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Toolbar,
  Box,
  Divider
} from '@mui/material';
import {
  People as PeopleIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  ExitToApp as ExitToAppIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
const drawerWidth = 240;
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      text: 'Users Management',
      icon: <PeopleIcon style={{ color: 'white' }} />,
      path: '/admin/users',
      subItems: [
        { text: 'All Users', icon: <PersonIcon style={{ color: 'white' }} />, path: '/admin/users' },
        { text: 'Students', icon: <SchoolIcon style={{ color: 'white' }} />, path: '/admin/users/students' },
        { text: 'Tutors', icon: <PersonIcon style={{ color: 'white' }} />, path: '/admin/users/tutors' }
      ]
    },
    {
      text: 'Projects',
      icon: <AssignmentIcon style={{ color: 'white' }} />,
      path: '/admin/projects'
    },
    {
      text: 'Assign Task',
      icon: <AssignmentIcon style={{ color: 'white' }} />,
      path: '/admin/submit-task'      
    }
  ];

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.replace('/signin');
        return;
      }

      await axios.post('http://localhost:5001/api/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Force a complete page reload and redirect
      window.location.replace('/signin');
      
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace('/signin');
    }
  };

  return (
    <Drawer
        variant="permanent"
        className="sidebar" // Apply the CSS class here
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'background.paper'
          },
        }}
      >
<Toolbar sx={{ minHeight: '100px' }}> {/* Set minHeight to match image */}
  <Box
    component="div"
    sx={{
      flexGrow: 1,
      display: 'flex',
      alignItems: 'center'
    }}
  >
    <img 
      src="/Lab2.png" 
      alt="Logo"
      style={{ height: '80px', objectFit: 'contain' }} // Adjust if needed
    /> 
  </Box>
</Toolbar>

        <Divider />
        
        <List>
          {menuItems.map((item) => (
            <Box key={item.text}>
              <ListItem disablePadding>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
              {item.subItems && (
                <List component="div" disablePadding>
                  {item.subItems.map((subItem) => (
                    <ListItemButton
                      key={subItem.text}
                      sx={{ pl: 4 }}
                      selected={location.pathname === subItem.path}
                      onClick={() => navigate(subItem.path)}
                    >
                      <ListItemIcon>{subItem.icon}</ListItemIcon>
                      <ListItemText primary={subItem.text} />
                    </ListItemButton>
                    
                  ))}
                  
                </List>
                
              )}
            </Box>
          ))}
             <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
        </List>
      </Drawer>
  );
};

export default Sidebar;
