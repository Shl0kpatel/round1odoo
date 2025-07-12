import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import AskQuestionPage from './pages/AskQuestionPage.jsx';
import QuestionDetailPage from './pages/QuestionDetailPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import ProtectedRoute from './components/Auth/ProtectedRoute.jsx';
import AdminRoute from './components/Auth/AdminRoute.jsx';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/ask" 
            element={
              <ProtectedRoute>
                <AskQuestionPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/question/:id" element={<QuestionDetailPage />} />
          <Route 
            path="/profile/:username" 
            element={<ProfilePage />} 
          />
          <Route 
            path="/notifications" 
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;

