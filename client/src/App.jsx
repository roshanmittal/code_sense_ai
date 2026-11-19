import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CodeEditorProvider } from './context/CodeEditorContext';
import { MainLayout } from './layouts/MainLayout';
import { EditorWorkspacePage } from './pages/EditorWorkspacePage';
import { DashboardPage } from './pages/DashboardPage';
import { ComparisonPage } from './pages/ComparisonPage';
import { BenchmarkPage } from './pages/BenchmarkPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { HistoryPage } from './pages/HistoryPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CodeEditorProvider>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Navigate to="/workspace" replace />} />
              <Route path="/workspace" element={<EditorWorkspacePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/comparison" element={<ComparisonPage />} />
              <Route path="/benchmarks" element={<BenchmarkPage />} />
              <Route path="/recommendations" element={<RecommendationsPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<Navigate to="/workspace" replace />} />
            </Route>
          </Routes>
        </CodeEditorProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
