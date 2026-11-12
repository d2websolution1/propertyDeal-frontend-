import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import HomePage from './pages/public/HomePage';
import RentPage from './pages/public/RentPage';
import CommercialPage from './pages/public/CommercialPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import ProtectedAdminRoute from './pages/admin/ProtectedAdminRoute';
import ManageUsers from './pages/admin/ManageUsers';
import ManageLocations from './pages/admin/ManageLocations';
import ManageProperties from './pages/admin/ManageProperties';
import ManageHomeContent from './pages/admin/ManageHomeContent';
import ClientAuthPage from './pages/public/ClientAuthPage';
import ProfilePage from './pages/public/ProfilePage';
import MyListingsPage from './pages/public/MyListingsPage';
import PostPropertyPage from './pages/public/PostPropertyPage';
import Pgpage from './pages/public/Pgpage';
import Plotspage from './pages/public/Plotspage';
import BlogsPage from './pages/public/BlogsPage';
import BlogDetailPage from './pages/public/BlogDetailPage';
import CmsViewPage from './pages/public/CmsViewPage';

// Content & Marketing admin pages
import ManageNavMenus from './pages/admin/ManageNavMenus';
import ManageBlogs from './pages/admin/ManageBlogs';
import ManageSeo from './pages/admin/ManageSeo';
import ManageAdvertisements from './pages/admin/ManageAdvertisements';
import ManageCmsPages from './pages/admin/ManageCmsPages';
import ManageEmailTemplates from './pages/admin/ManageEmailTemplates';
import ManageBanners from './pages/admin/ManageBanners';
import BulkMessaging from './pages/admin/BulkMessaging';

// Users & Listings admin pages
import ManageFeaturedListings from './pages/admin/ManageFeaturedListings';
import ManageVerifiedTags from './pages/admin/ManageVerifiedTags';
import ManageEnquiries from './pages/admin/ManageEnquiries';

// Billing admin pages
import ManagePayments from './pages/admin/ManagePayments';
import ManageSubscriptions from './pages/admin/ManageSubscriptions';

// Reports admin pages
import ManageReports from './pages/admin/ManageReports';
import ReportListings from './pages/admin/ReportListings';
import ReportUsers from './pages/admin/ReportUsers';

// Settings admin pages
import ManageGeneralSettings from './pages/admin/ManageGeneralSettings';
import ManageLanguageSettings from './pages/admin/ManageLanguageSettings';
import ManageSecuritySettings from './pages/admin/ManageSecuritySettings';
import ManageSessions from './pages/admin/ManageSessions';

// Routes jinke apne khud ke header/footer hain (common Header/Footer yahan nahi dikhana)
const ROUTES_WITH_CUSTOM_HEADER = ['/admin', '/%20admin', '/ admin', ' /admin'];

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  // Normalize any accidental %20, leading/trailing whitespace in URL paths
  useEffect(() => {
    try {
      const rawPath = location.pathname;
      if (rawPath.includes('%20') || rawPath.includes(' ') || (rawPath.endsWith('/') && rawPath.length > 1)) {
        const decoded = decodeURIComponent(rawPath);
        const cleaned = '/' + decoded.replace(/\s+/g, '').replace(/^\/+/, '');
        if (cleaned && cleaned !== rawPath) {
          navigate(cleaned + location.search + location.hash, { replace: true });
        }
      }
    } catch (e) {
      // ignore
    }
  }, [location.pathname, location.search, location.hash, navigate]);

  let decodedPath = location.pathname;
  try {
    decodedPath = decodeURIComponent(location.pathname);
  } catch (e) {}

  const isNormalizedAdmin =
    /^\/?\s*admin(\/|$)/i.test(decodedPath) ||
    /^\/?%20admin(\/|$)/i.test(location.pathname) ||
    ROUTES_WITH_CUSTOM_HEADER.some((path) => location.pathname.startsWith(path));

  const hideCommonChrome = isNormalizedAdmin;

  return (
    <>
      {!hideCommonChrome && <Header />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/rent" element={<RentPage />} />
        <Route path="/commercial" element={<CommercialPage city="Mumbai" />} />
        <Route path="/pg-co-living" element={<Pgpage city="Mumbai" />} />
        <Route path="/plots" element={<Plotspage city="Mumbai" />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blogs/:slug" element={<BlogDetailPage />} />
        <Route path="/login" element={<ClientAuthPage initialMode="login" />} />
        <Route path="/signup" element={<ClientAuthPage initialMode="signup" />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/my-listings" element={<MyListingsPage />} />
        <Route path="/post-property" element={<PostPropertyPage />} />

        {/* Dynamic CMS Pages (Managed from Admin Panel) */}
        <Route path="/about-us" element={<CmsViewPage defaultSlug="about-us" />} />
        <Route path="/terms-and-conditions" element={<CmsViewPage defaultSlug="terms-and-conditions" />} />
        <Route path="/terms" element={<CmsViewPage defaultSlug="terms-and-conditions" />} />
        <Route path="/privacy-policy" element={<CmsViewPage defaultSlug="privacy-policy" />} />
        <Route path="/contact-us" element={<CmsViewPage defaultSlug="contact-us" />} />
        <Route path="/contact" element={<CmsViewPage defaultSlug="contact-us" />} />
        <Route path="/pages/:slug" element={<CmsViewPage />} />
        <Route path="/page/:slug" element={<CmsViewPage />} />

        {/* Admin Login & Aliases (Handles /%20admin/login, / admin/login, /admin-login) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/%20admin/login" element={<AdminLogin />} />
        <Route path="/ admin/login" element={<AdminLogin />} />
        <Route path=" /admin/login" element={<AdminLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/%20admin" element={<Navigate to="/admin" replace />} />
        <Route path="/ admin" element={<Navigate to="/admin" replace />} />
        <Route path="/%20admin/*" element={<Navigate to="/admin" replace />} />
        <Route path="/ admin/*" element={<Navigate to="/admin" replace />} />

        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          {/* Overview */}
          <Route index element={<AdminDashboard />} />

          {/* Users & Listings */}
          <Route path="users" element={<ManageUsers />} />
          <Route path="locations" element={<ManageLocations />} />
          <Route path="properties" element={<ManageProperties />} />
          <Route path="listings/approvals" element={<ManageProperties />} />
          <Route path="listings/featured" element={<ManageFeaturedListings />} />
          <Route path="listings/verified" element={<ManageVerifiedTags />} />
          <Route path="enquiries" element={<ManageEnquiries />} />

          {/* Content & Marketing */}
          <Route path="content" element={<ManageHomeContent />} />
          <Route path="navigation" element={<ManageNavMenus />} />
          <Route path="blogs" element={<ManageBlogs />} />
          <Route path="seo" element={<ManageSeo />} />
          <Route path="advertisements" element={<ManageAdvertisements />} />
          <Route path="cms" element={<ManageCmsPages />} />
          <Route path="email-templates" element={<ManageEmailTemplates />} />
          <Route path="banners" element={<ManageBanners />} />
          <Route path="bulk-messaging" element={<BulkMessaging />} />

          {/* Billing */}
          <Route path="payments" element={<ManagePayments />} />
          <Route path="subscriptions" element={<ManageSubscriptions />} />

          {/* Reports */}
          <Route path="reports" element={<ManageReports />} />
          <Route path="reports/listings" element={<ReportListings />} />
          <Route path="reports/users" element={<ReportUsers />} />

          {/* Settings */}
          <Route path="settings" element={<ManageGeneralSettings />} />
          <Route path="settings/language" element={<ManageLanguageSettings />} />
          <Route path="settings/security" element={<ManageSecuritySettings />} />
          <Route path="settings/sessions" element={<ManageSessions />} />
        </Route>

        {/* Global Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!hideCommonChrome && <Footer />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
