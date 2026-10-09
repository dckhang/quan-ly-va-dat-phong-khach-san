import { BrowserRouter, Routes, Route } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import DashboardLayout from "./layouts/DashboardLayout"

import Home from "./pages/Home"
import Search from "./pages/Search"
import HotelDetail from "./pages/HotelDetail"
import RoomDetail from "./pages/RoomDetail"
import Login from "./pages/Login"
import Register from "./pages/Register"
import MyBookings from "./pages/MyBookings"
import About from "./pages/About"
import Blog from "./pages/Blog"
import ArticleDetail from "./pages/ArticleDetail"

import StaffDashboard from "./pages/staff/StaffDashboard"
import StaffBookings from "./pages/staff/StaffBookings"
import StaffCheckin from "./pages/staff/StaffCheckin"

import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminHotels from "./pages/admin/AdminHotels"
import AdminRooms from "./pages/admin/AdminRooms"
import AdminUsers from "./pages/admin/AdminUsers"
import AdminBookings from "./pages/admin/AdminBookings"
import AdminReviews from "./pages/admin/AdminReviews"
import AdminArticles from "./pages/admin/AdminArticles"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public + Customer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/hotels/:id" element={<HotelDetail />} />
          <Route path="/rooms/:id" element={<RoomDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<ArticleDetail />} />
        </Route>

        {/* Staff */}
        <Route path="/staff" element={<DashboardLayout role="staff" />}>
          <Route index element={<StaffDashboard />} />
          <Route path="bookings" element={<StaffBookings />} />
          <Route path="checkin" element={<StaffCheckin />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={<DashboardLayout role="admin" />}>
          <Route index element={<AdminDashboard />} />
          <Route path="hotels" element={<AdminHotels />} />
          <Route path="rooms" element={<AdminRooms />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="articles" element={<AdminArticles />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
