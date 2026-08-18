import React from 'react';
import {
  Drawer, Box, Typography, Button, Grid, Divider, List,
  ListItemButton, ListItemIcon, ListItemText, Chip
} from '@mui/material';
import {
  AccountCircle, DescriptionOutlined, FavoriteBorder, SearchOutlined,
  DiamondOutlined, ReceiptLongOutlined, StarBorderOutlined,
  NotificationsNoneOutlined, ReportGmailerrorredOutlined, HelpOutlineOutlined,
  ChevronRight, Home
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const SideDrawer = ({ open, onClose, onLoginClick }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const activityItems = [
    { label: 'Contacted Properties', icon: <DescriptionOutlined fontSize="small" />, count: '00' },
    { label: 'Seen Properties', icon: <DescriptionOutlined fontSize="small" />, count: '00', active: true },
    { label: 'Saved Properties', icon: <FavoriteBorder fontSize="small" />, count: '00' },
    { label: 'Recent Searches', icon: <SearchOutlined fontSize="small" />, count: '00' },
  ];

  const menuItems = [
    { label: 'Zero Brokerage Properties', icon: <DiamondOutlined fontSize="small" /> },
    { label: 'My Transactions', icon: <ReceiptLongOutlined fontSize="small" /> },
    { label: 'My Reviews', icon: <StarBorderOutlined fontSize="small" />, badge: 'NEW' },
    { label: 'Unsubscribe Alerts', icon: <NotificationsNoneOutlined fontSize="small" /> },
    { label: 'Report a Fraud', icon: <ReportGmailerrorredOutlined fontSize="small" /> },
  ];

  const handleNav = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 340, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Top greeting card */}
        <Box sx={{ p: 3, pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 44, height: 44, borderRadius: '50%',
                  bgcolor: '#ede7f6', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                <AccountCircle sx={{ color: '#5a4a9e', fontSize: 30 }} />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight="700">
                  {isAuthenticated ? `Hello, ${user?.name?.split(' ')[0]}` : 'Hello 👋'}
                </Typography>
                {!isAuthenticated && (
                  <>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      ✓ Easy Contact with sellers
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      ✓ Personalized experience
                    </Typography>
                  </>
                )}
              </Box>
            </Box>

            {!isAuthenticated && (
              <Button
                variant="contained"
                onClick={() => { onClose(); onLoginClick(); }}
                sx={{
                  bgcolor: '#2e7d32', borderRadius: 5, px: 3,
                  textTransform: 'none', fontWeight: 700,
                  '&:hover': { bgcolor: '#256428' },
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Box>

        <Divider />

        {/* My Activity */}
        <Box sx={{ p: 3 }}>
          <Typography variant="subtitle2" fontWeight="700" sx={{ mb: 2 }}>
            My Activity
          </Typography>
          <Grid container spacing={1.5}>
            {activityItems.map((item) => (
              <Grid item xs={6} key={item.label}>
                <Box
                  onClick={() => handleNav('/user/dashboard')}
                  sx={{
                    border: item.active ? '1px solid #5a4a9e' : '1px solid #eee',
                    borderRadius: 2, p: 1.5, textAlign: 'center',
                    cursor: 'pointer', height: '100%',
                    '&:hover': { borderColor: '#5a4a9e' },
                  }}
                >
                  <Box sx={{ color: '#5a4a9e', mb: 0.5 }}>{item.icon}</Box>
                  <Typography variant="caption" sx={{ display: 'block', fontWeight: 500, lineHeight: 1.3 }}>
                    {item.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight="700">
                    {item.count}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Illustration + CTA */}
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Box
              sx={{
                height: 100, borderRadius: 2, mb: 2,
                background: 'linear-gradient(135deg, #ede7f6 0%, #f3e5f5 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <SearchOutlined sx={{ fontSize: 40, color: '#c5b3e6' }} />
            </Box>
            <Button
              variant="contained"
              onClick={() => handleNav('/properties')}
              sx={{
                bgcolor: '#5a4a9e', borderRadius: 2, px: 4, py: 1,
                textTransform: 'none', fontWeight: 700,
                '&:hover': { bgcolor: '#4a3d85' },
              }}
            >
              Start new search
            </Button>
          </Box>
        </Box>

        {/* Post property banner */}
        <Box sx={{ px: 3, pb: 2 }}>
          <Box
            onClick={() => handleNav(isAuthenticated ? '/vendor/properties/add' : '#')}
            sx={{
              bgcolor: '#fff3e0', borderRadius: 2, p: 2,
              display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer',
            }}
          >
            <Box
              sx={{
                width: 48, height: 48, borderRadius: 2, bgcolor: '#ffe0b2',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}
            >
              <Home sx={{ color: '#e65100' }} />
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2" fontWeight="600">
                Looking to sell / rent your property?
              </Typography>
            </Box>
          </Box>
          <Button
            fullWidth
            variant="outlined"
            sx={{
              mt: 1.5, borderRadius: 5, textTransform: 'none', fontWeight: 700,
              borderColor: '#5a4a9e', color: '#5a4a9e',
            }}
          >
            Post property for FREE
          </Button>
        </Box>

        <Divider />

        {/* Menu list */}
        <List sx={{ py: 1 }}>
          {menuItems.map((item) => (
            <ListItemButton key={item.label} sx={{ py: 1.2 }}>
              <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" fontWeight="500">{item.label}</Typography>
                    {item.badge && (
                      <Chip
                        label={item.badge}
                        size="small"
                        sx={{ height: 18, fontSize: 9, fontWeight: 700, bgcolor: '#e53935', color: 'white' }}
                      />
                    )}
                  </Box>
                }
              />
            </ListItemButton>
          ))}
        </List>

        <Box sx={{ px: 3, pb: 2 }}>
          <Box
            sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              border: '1px solid #eee', borderRadius: 2, p: 1.5, cursor: 'pointer',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <HelpOutlineOutlined fontSize="small" sx={{ color: 'text.secondary' }} />
              <Typography variant="body2" fontWeight="600" color="primary">
                Visit Help Center
              </Typography>
            </Box>
            <ChevronRight fontSize="small" sx={{ color: 'text.secondary' }} />
          </Box>
        </Box>

        <Divider />

        {/* Download app */}
        <Box sx={{ p: 3 }}>
          <Typography variant="subtitle2" fontWeight="700" sx={{ mb: 1.5 }}>
            Download Housing App
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box
                sx={{
                  bgcolor: '#000', color: 'white', borderRadius: 1, px: 1.5, py: 0.6,
                  fontSize: 11, textAlign: 'center', cursor: 'pointer',
                }}
              >
                Download on the App Store
              </Box>
              <Box
                sx={{
                  bgcolor: '#000', color: 'white', borderRadius: 1, px: 1.5, py: 0.6,
                  fontSize: 11, textAlign: 'center', cursor: 'pointer',
                }}
              >
                GET IT ON Google Play
              </Box>
            </Box>
            <Box
              sx={{
                width: 70, height: 70, border: '1px solid #eee', borderRadius: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, color: 'text.secondary', textAlign: 'center', p: 0.5,
              }}
            >
              QR Code
            </Box>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default SideDrawer;