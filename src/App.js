import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* 1. Явный редирект с корня на логин */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                
                {/* 2. Страница входа */}
                <Route path="/login" element={<LoginPage />} />
                
                {/* 3. Защищенная основная страница */}
                <Route 
                    path="/main" 
                    element={
                        <ProtectedRoute>
                            <MainPage />
                        </ProtectedRoute>
                    } 
                />
                
                {/* 4. Любой несуществующий адрес -> на логин */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;