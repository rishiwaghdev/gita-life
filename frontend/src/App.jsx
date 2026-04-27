import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import PublicForm from './pages/PublicForm';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Students from './pages/Students';
import Batches from './pages/Batches';
import Attendance from './pages/Attendance';

const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!admin) return <Navigate to="/login" />;
  return <Layout>{children}</Layout>;
};

const AppRoutes = () => {
  const { admin } = useContext(AuthContext);
  return (
    <Routes>
      <Route path="/" element={<PublicForm />} />
      <Route path="/login" element={admin ? <Navigate to="/dashboard" /> : <Login />} />
      
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/dashboard/leads" element={<ProtectedRoute><Leads /></ProtectedRoute>} />
      <Route path="/dashboard/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
      <Route path="/dashboard/batches" element={<ProtectedRoute><Batches /></ProtectedRoute>} />
      <Route path="/dashboard/sessions/:sessionId/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
