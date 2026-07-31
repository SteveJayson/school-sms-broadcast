import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BroadcastForm from './components/forms/BroadcastForm';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <ProtectedRoute>
              <>
                <header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h-6a2 2 0 01-2-2V6a2 2 0 012-2h6m4 14h4a2 2 0 002-2V6a2 2 0 00-2-2h-4m-4 14V6m-4 14h8" />
                          </svg>
                        </div>
                        <div>
                          <h1 className="text-2xl font-bold text-white tracking-tight">
                            📱 School SMS Broadcast
                          </h1>
                          <p className="text-sm text-blue-100">
                            Send announcements to parents and students instantly
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-400/20 text-green-100 border border-green-400/30 backdrop-blur-sm">
                          <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                          Connected
                        </span>
                        <button
                          onClick={() => {
                            localStorage.removeItem('token');
                            window.location.href = '/login';
                          }}
                          className="text-white hover:text-gray-200 text-sm font-medium"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </header>
                <main className="py-8">
                  <BroadcastForm />
                </main>
                <footer className="text-center py-4 text-sm text-gray-400 border-t border-gray-200/50 mt-8">
                  <p>© 2024 School SMS Broadcast System • Built with ❤️</p>
                </footer>
              </>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;