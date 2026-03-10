import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLoginPage from "./auth/login";
import Dashboard from "./dashboard/Dashboard";
import AdminDashboard from "./dashboard/AdminDashboard";
import AdminPanel from "./dashboard/AdminPanel";

import AdminUsers from "./dashboard/AdminUsers";
import AdminLoginPage from "./auth/mentor";
import ReportLost from "./dashboard/ReportLost";
import ReportFound from "./dashboard/ReportFound";
import LostAndFound from "./dashboard/LostAndFound";
import AdminLostFound from "./dashboard/AdminLostFound";
import ChatPage from "./dashboard/ChatPage";
import Profile from "./dashboard/Profile";
import AdminChat from "./dashboard/AdminChat";
import AdminReports from "./dashboard/AdminReports";
import BookingPage from "./dashboard/BookingPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLoginPage />} />
        <Route path="/login" element={<UserLoginPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />

        {/* User Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Admin Dashboard */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-posts" element={<AdminLostFound />} />
        <Route path="/admin-flagged" element={<AdminLostFound />} />
        <Route path="/admin-reports" element={<AdminReports />} />

        <Route path="/admin-users" element={<AdminUsers />} />
        <Route path="/admin-chat" element={<AdminChat />} />

        {/* Lost & Found */}
        <Route path="/lost-and-found" element={<LostAndFound />} />
        <Route path="/report-lost" element={<ReportLost />} />
        <Route path="/report-found" element={<ReportFound />} />

        {/* Sidebar pages */}
        <Route path="/found" element={<ReportFound />} />
        <Route path="/lost" element={<ReportLost />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/view-items" element={<LostAndFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
