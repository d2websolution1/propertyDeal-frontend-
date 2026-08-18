import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton,
  Paper, Grow, ClickAwayListener, Avatar, InputBase
} from '@mui/material';
import {
  KeyboardArrowDown, Menu as MenuIcon, AccountCircle,
  Home, Search, ApartmentOutlined, HouseOutlined,
  BusinessOutlined, GroupsOutlined, VillaOutlined, StorefrontOutlined
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoginModal from './LoginModal';
import SideDrawer from './SideDrawer';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);

  const handleEnter = (key) => setOpenMenu(key);
  const handleLeave = () => setOpenMenu(null);

  const cities = [
    'Mumbai', 'Bengaluru', 'Pune', 'Chennai', 'Kolkata', 'Ahmedabad',
    'Delhi', 'Noida', 'Gurgaon', 'Hyderabad', 'Thane', 'Navi Mumbai',
  ];

  // ── For Buyers dropdown data ──
  const propertyTypesBuy = [
    { label: 'Flats', icon: <ApartmentOutlined fontSize="small" /> },
    { label: 'Houses', icon: <HouseOutlined fontSize="small" /> },
    { label: 'Builder floors', icon: <BusinessOutlined fontSize="small" /> },
    { label: 'Plots', icon: <VillaOutlined fontSize="small" /> },
    { label: 'Villas', icon: <VillaOutlined fontSize="small" /> },
    { label: 'Commercial properties', icon: <StorefrontOutlined fontSize="small" /> },
  ];

  const popularAreasBuy = [
    'Thane West', 'Borivali West', 'Mira Road East',
    'Kurla West', 'Kurla East', 'Santacruz East',
  ];

  const searchByBHKBuy = [
    '1 RK for Sale in Mumbai', '1 BHK for Sale in Mumbai',
    '2 BHK for Sale in Mumbai', '3 BHK for Sale in Mumbai',
    '1 BHK Houses', '2 BHK Houses',
  ];

  const popularSearchesBuy = [
    'Flats without brokerage', 'Under construction flats',
    'Affordable projects for sale', 'Ready to move-in projects',
    'New residential projects', 'Resale properties',
  ];

  // ── For Tenants dropdown data ──
  const propertyTypesRent = [
    { label: 'Flats', icon: <ApartmentOutlined fontSize="small" /> },
    { label: 'Houses', icon: <HouseOutlined fontSize="small" /> },
    { label: 'PG / Co-living', icon: <GroupsOutlined fontSize="small" /> },
    { label: 'Builder floors', icon: <BusinessOutlined fontSize="small" /> },
    { label: 'Villas', icon: <VillaOutlined fontSize="small" /> },
    { label: 'Commercial properties', icon: <StorefrontOutlined fontSize="small" /> },
  ];

  const popularAreasRent = [
    'Thane West', 'Borivali West', 'Mira Road East',
    'Kurla West', 'Kurla East', 'Santacruz East',
  ];

  const searchByBHKRent = [
    '1 RK for Rent in Mumbai', '1 BHK for Rent in Mumbai',
    '2 BHK for Rent in Mumbai', '3 BHK for Rent in Mumbai',
    '1 BHK Houses for Rent', '2 BHK Houses for Rent',
  ];

  const popularSearchesRent = [
    'Flats without brokerage', 'Fully furnished flats',
    'Bachelor friendly flats', 'Family friendly flats',
    'Pet friendly flats', 'Flats near metro',
  ];

  const sellersMenu = [
    { title: 'Developers', desc: 'Launch or sell homes' },
    { title: 'Brokers', desc: 'List and grow business' },
    { title: 'Owners', desc: 'Sell or rent easily' },
  ];

  const servicesMenu = {
    'Housing Edge': ['Home Loan', 'Housing Premium'],
    'Tools': ['EMI calculator', 'Property value calculator', 'Rent receipt generator'],
  };

  const newsMenu = [
    { title: 'Real Estate News', desc: 'Latest market updates' },
    { title: 'Buying Guide', desc: 'Expert homebuying tips' },
    { title: 'Housing Research', desc: 'Data-driven insights' },
  ];

  const navLinkSx = {
    color: 'white',
    fontWeight: 500,
    textTransform: 'none',
    fontSize: '0.9rem',
    whiteSpace: 'nowrap',
    minWidth: 'fit-content',
    flexShrink: 0,
  };

  const ArrowIcon = ({ menuKey, color = 'white' }) => (
    <KeyboardArrowDown
      sx={{
        color,
        fontSize: 20,
        transition: 'transform 0.2s ease',
        transform: openMenu === menuKey ? 'rotate(180deg)' : 'rotate(0deg)',
      }}
    />
  );

  const Caret = () => (
    <Box
      sx={{
        position: 'absolute',
        top: -6,
        left: 24,
        width: 12,
        height: 12,
        bgcolor: 'white',
        transform: 'rotate(45deg)',
        boxShadow: '-2px -2px 4px rgba(0,0,0,0.04)',
      }}
    />
  );

  return (
    <ClickAwayListener onClickAway={handleLeave}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{ background: 'linear-gradient(90deg, #3b2f6e 0%, #5a4a9e 100%)', overflow: 'visible' }}
      >
        <Toolbar
          sx={{
            gap: 2,
            px: { xs: 2, md: 4 },
            py: 1,
            flexWrap: 'nowrap',
            minHeight: 64,
            overflowX: { xs: 'auto', md: 'visible' },
          }}
        >
          {/* Logo + All India grouped together with tight gap */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
            <Box
              component={Link}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                textDecoration: 'none',
                flexShrink: 0,
                whiteSpace: 'nowrap',
              }}
            >
              <Box sx={{ width: 30, height: 30, borderRadius: '6px', bgcolor: '#ffb300', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Home sx={{ color: '#3b2f6e', fontSize: 18 }} />
              </Box>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 800, fontSize: '1.1rem', whiteSpace: 'nowrap' }}>
                PropertyDeal<Typography component="span" sx={{ fontWeight: 400, fontSize: 'inherit' }}></Typography>
              </Typography>
            </Box>

            {/* All India / city selector */}
            <Box
              onMouseEnter={() => handleEnter('city')}
              onMouseLeave={handleLeave}
              sx={{ position: 'relative', flexShrink: 0 }}
            >
              <Button endIcon={<ArrowIcon menuKey="city" />} sx={navLinkSx}>
                All India
              </Button>
              <Grow in={openMenu === 'city'}>
                <Paper
                  sx={{
                    display: openMenu === 'city' ? 'block' : 'none',
                    position: 'absolute', top: '100%', left: 0, mt: 1.5,
                    width: 430, p: 3, zIndex: 20, borderRadius: 2,
                  }}
                >
                  <Caret />
                  <InputBase
                    placeholder="Search for city"
                    startAdornment={<Search sx={{ color: 'text.secondary', mr: 1 }} />}
                    fullWidth
                    sx={{ border: '1px solid #ddd', borderRadius: 2, px: 2, py: 1, mb: 2, fontSize: '0.9rem' }}
                  />
                  <Typography variant="subtitle2" fontWeight="700" sx={{ mb: 1.5 }}>
                    Popular cities
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5 }}>
                    {cities.map((city) => (
                      <Button
                        key={city}
                        onClick={() => { navigate(`/properties?city=${city}`); handleLeave(); }}
                        sx={{
                          justifyContent: 'flex-start', textTransform: 'none', color: 'text.primary',
                          border: '1px solid #eee', borderRadius: 2, fontSize: '0.82rem', fontWeight: 500,
                        }}
                      >
                        {city}
                      </Button>
                    ))}
                  </Box>
                </Paper>
              </Grow>
            </Box>
          </Box>

          {/* Desktop nav */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 0.5,
              flexGrow: 1,
              flexWrap: 'nowrap',
              whiteSpace: 'nowrap',
              ml: 2,
            }}
          >
            {/* For Buyers */}
            <Box onMouseEnter={() => handleEnter('buyers')} onMouseLeave={handleLeave} sx={{ position: 'relative', flexShrink: 0 }}>
              <Button endIcon={<ArrowIcon menuKey="buyers" />} sx={navLinkSx}>For Buyers</Button>
              <Grow in={openMenu === 'buyers'}>
                <Paper
                  sx={{
                    display: openMenu === 'buyers' ? 'flex' : 'none',
                    position: 'absolute', top: '100%', left: 0, mt: 1.5, zIndex: 20,
                    p: 3, borderRadius: 2, gap: 5, minWidth: 850,
                  }}
                >
                  <Caret />
                  <Box sx={{ minWidth: 180 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      Property type
                    </Typography>
                    <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 1.6 }}>
                      {propertyTypesBuy.map((item) => (
                        <Box
                          key={item.label}
                          sx={{ display: 'flex', alignItems: 'center', gap: 1.2, cursor: 'pointer', color: 'text.primary', '&:hover': { color: 'primary.main' } }}
                        >
                          <Box sx={{ color: 'text.secondary', display: 'flex' }}>{item.icon}</Box>
                          <Typography variant="body2">{item.label}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      Popular areas
                    </Typography>
                    <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                      {popularAreasBuy.map((l) => (
                        <Typography key={l} variant="body2" sx={{ cursor: 'pointer', whiteSpace: 'nowrap', '&:hover': { color: 'primary.main' } }}>
                          {l}
                        </Typography>
                      ))}
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      Search by BHK
                    </Typography>
                    <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                      {searchByBHKBuy.map((l) => (
                        <Typography key={l} variant="body2" sx={{ cursor: 'pointer', whiteSpace: 'nowrap', '&:hover': { color: 'primary.main' } }}>
                          {l}
                        </Typography>
                      ))}
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      Popular searches
                    </Typography>
                    <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                      {popularSearchesBuy.map((l) => (
                        <Typography key={l} variant="body2" sx={{ cursor: 'pointer', whiteSpace: 'nowrap', '&:hover': { color: 'primary.main' } }}>
                          {l}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                </Paper>
              </Grow>
            </Box>

            {/* For Tenants */}
            <Box onMouseEnter={() => handleEnter('tenants')} onMouseLeave={handleLeave} sx={{ position: 'relative', flexShrink: 0 }}>
              <Button endIcon={<ArrowIcon menuKey="tenants" />} sx={navLinkSx}>For Tenants</Button>
              <Grow in={openMenu === 'tenants'}>
                <Paper
                  sx={{
                    display: openMenu === 'tenants' ? 'flex' : 'none',
                    position: 'absolute', top: '100%', left: 0, mt: 1.5, zIndex: 20,
                    p: 3, borderRadius: 2, gap: 5, minWidth: 850,
                  }}
                >
                  <Caret />
                  <Box sx={{ minWidth: 180 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      Property type
                    </Typography>
                    <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 1.6 }}>
                      {propertyTypesRent.map((item) => (
                        <Box
                          key={item.label}
                          sx={{ display: 'flex', alignItems: 'center', gap: 1.2, cursor: 'pointer', color: 'text.primary', '&:hover': { color: 'primary.main' } }}
                        >
                          <Box sx={{ color: 'text.secondary', display: 'flex' }}>{item.icon}</Box>
                          <Typography variant="body2">{item.label}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      Popular areas
                    </Typography>
                    <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                      {popularAreasRent.map((l) => (
                        <Typography key={l} variant="body2" sx={{ cursor: 'pointer', whiteSpace: 'nowrap', '&:hover': { color: 'primary.main' } }}>
                          {l}
                        </Typography>
                      ))}
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      Search by BHK
                    </Typography>
                    <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                      {searchByBHKRent.map((l) => (
                        <Typography key={l} variant="body2" sx={{ cursor: 'pointer', whiteSpace: 'nowrap', '&:hover': { color: 'primary.main' } }}>
                          {l}
                        </Typography>
                      ))}
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      Popular searches
                    </Typography>
                    <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                      {popularSearchesRent.map((l) => (
                        <Typography key={l} variant="body2" sx={{ cursor: 'pointer', whiteSpace: 'nowrap', '&:hover': { color: 'primary.main' } }}>
                          {l}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                </Paper>
              </Grow>
            </Box>

            {/* For Sellers */}
            <Box onMouseEnter={() => handleEnter('sellers')} onMouseLeave={handleLeave} sx={{ position: 'relative', flexShrink: 0 }}>
              <Button endIcon={<ArrowIcon menuKey="sellers" />} sx={navLinkSx}>For Sellers</Button>
              <Grow in={openMenu === 'sellers'}>
                <Paper
                  sx={{
                    display: openMenu === 'sellers' ? 'block' : 'none',
                    position: 'absolute', top: '100%', left: 0, mt: 1.5, zIndex: 20,
                    p: 3, borderRadius: 2, minWidth: 260,
                  }}
                >
                  <Caret />
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    Packages for
                  </Typography>
                  <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {sellersMenu.map((item) => (
                      <Box key={item.title} sx={{ cursor: 'pointer' }}>
                        <Typography variant="body2" fontWeight="600">{item.title}</Typography>
                        <Typography variant="caption" color="text.secondary">{item.desc}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Grow>
            </Box>

            {/* Services */}
            <Box onMouseEnter={() => handleEnter('services')} onMouseLeave={handleLeave} sx={{ position: 'relative', flexShrink: 0 }}>
              <Button endIcon={<ArrowIcon menuKey="services" />} sx={navLinkSx}>Services</Button>
              <Grow in={openMenu === 'services'}>
                <Paper
                  sx={{
                    display: openMenu === 'services' ? 'flex' : 'none',
                    position: 'absolute', top: '100%', left: 0, mt: 1.5, zIndex: 20,
                    p: 3, borderRadius: 2, gap: 5, minWidth: 420,
                  }}
                >
                  <Caret />
                  {Object.entries(servicesMenu).map(([col, links]) => (
                    <Box key={col}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        {col}
                      </Typography>
                      <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                        {links.map((l) => (
                          <Typography key={l} variant="body2" sx={{ cursor: 'pointer', whiteSpace: 'nowrap', '&:hover': { color: 'primary.main' } }}>
                            {l}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  ))}
                </Paper>
              </Grow>
            </Box>

            {/* News & Guide */}
            <Box onMouseEnter={() => handleEnter('news')} onMouseLeave={handleLeave} sx={{ position: 'relative', flexShrink: 0 }}>
              <Button endIcon={<ArrowIcon menuKey="news" />} sx={navLinkSx}>News & Guide</Button>
              <Grow in={openMenu === 'news'}>
                <Paper
                  sx={{
                    display: openMenu === 'news' ? 'block' : 'none',
                    position: 'absolute', top: '100%', left: 0, mt: 1.5, zIndex: 20,
                    p: 3, borderRadius: 2, minWidth: 280,
                  }}
                >
                  <Caret />
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    Property market guide
                  </Typography>
                  <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {newsMenu.map((item) => (
                      <Box
                        key={item.title}
                        sx={{ cursor: 'pointer' }}
                        onClick={() => { navigate('/blogs'); handleLeave(); }}
                      >
                        <Typography variant="body2" fontWeight="600">{item.title}</Typography>
                        <Typography variant="caption" color="text.secondary">{item.desc}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Grow>
            </Box>
          </Box>

          {/* Right side */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, flexShrink: 0, whiteSpace: 'nowrap' }}>
            <Button sx={{ display: { xs: 'none', md: 'inline-flex' }, color: 'white', textTransform: 'none', fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
              Download App
            </Button>

            <Button
              onClick={() => isAuthenticated ? navigate('/vendor/properties/add') : setLoginModalOpen(true)}
              sx={{ display: { xs: 'none', md: 'inline-flex' }, color: 'white', textTransform: 'none', fontWeight: 600, fontSize: '0.85rem', gap: 0.8, whiteSpace: 'nowrap' }}
            >
              Post Property
              <Box component="span" sx={{ bgcolor: '#e53935', color: 'white', fontSize: 9, fontWeight: 700, px: 0.7, py: 0.2, borderRadius: 0.5 }}>
                FREE
              </Box>
            </Button>

            {isAuthenticated ? (
              <Box
                sx={{ display: 'flex', alignItems: 'center', bgcolor: 'white', borderRadius: 10, px: 0.5, py: 0.5, gap: 0.5, flexShrink: 0 }}
              >
                <IconButton
                  size="small"
                  onClick={(e) => { e.stopPropagation(); setSideDrawerOpen(true); }}
                >
                  <MenuIcon sx={{ color: '#3b2f6e', fontSize: 20 }} />
                </IconButton>
                <Avatar
                  sx={{ width: 26, height: 26, bgcolor: '#3b2f6e', fontSize: 13, cursor: 'pointer' }}
                  onClick={() => navigate(`/${user?.role}/dashboard`)}
                >
                  {user?.name?.charAt(0)?.toUpperCase() || <AccountCircle />}
                </Avatar>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'white', borderRadius: 10, pl: 2, pr: 0.5, py: 0.4, gap: 1, flexShrink: 0 }}>
                <Button
                  onClick={() => setLoginModalOpen(true)}
                  sx={{ color: '#3b2f6e', textTransform: 'none', fontWeight: 600, fontSize: '0.85rem', minWidth: 0, p: 0, whiteSpace: 'nowrap' }}
                >
                  Login
                </Button>
                <IconButton size="small" onClick={() => setSideDrawerOpen(true)}>
                  <MenuIcon sx={{ color: '#3b2f6e', fontSize: 20 }} />
                </IconButton>
              </Box>
            )}
          </Box>
        </Toolbar>

        <LoginModal open={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
        <SideDrawer
          open={sideDrawerOpen}
          onClose={() => setSideDrawerOpen(false)}
          onLoginClick={() => setLoginModalOpen(true)}
        />
      </AppBar>
    </ClickAwayListener>
  );
};

export default Header;