import { Routes, Route, Navigate } from 'react-router-dom'
import Nav from './components/layout/Nav.jsx'
import Footer from './components/layout/Footer.jsx'
import Home from './pages/Home.jsx'
import PostList from './pages/PostList.jsx'
import Post from './pages/Post.jsx'
import CV from './pages/CV.jsx'
import AdminLogin from './pages/admin/AdminLogin.jsx'
import AdminLayout from './pages/admin/AdminLayout.jsx'
import AdminProfile from './pages/admin/AdminProfile.jsx'
import AdminWorkHistory from './pages/admin/AdminWorkHistory.jsx'
import AdminSkills from './pages/admin/AdminSkills.jsx'
import AdminCertifications from './pages/admin/AdminCertifications.jsx'
import AdminMultimedia from './pages/admin/AdminMultimedia.jsx'
import AdminPosts from './pages/admin/AdminPosts.jsx'
import AdminPostEditor from './pages/admin/AdminPostEditor.jsx'
import ProtectedRoute from './components/layout/ProtectedRoute.jsx'

export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<PostList defaultFilter="article" />} />
        <Route path="/blog/:id" element={<Post />} />
        <Route path="/projects" element={<PostList defaultFilter="project" />} />
        <Route path="/projects/:id" element={<Post />} />
        <Route path="/cv" element={<CV />} />

        {/* Admin auth */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin protected */}
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/admin/profile" replace />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="work-history" element={<AdminWorkHistory />} />
          <Route path="skills/frontend" element={<AdminSkills category="frontend" />} />
          <Route path="skills/backend" element={<AdminSkills category="backend" />} />
          <Route path="skills/design" element={<AdminSkills category="design" />} />
          <Route path="certifications" element={<AdminCertifications />} />
          <Route path="multimedia" element={<AdminMultimedia />} />
          <Route path="posts" element={<AdminPosts />} />
          <Route path="posts/new" element={<AdminPostEditor />} />
          <Route path="posts/:id/edit" element={<AdminPostEditor />} />
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  )
}