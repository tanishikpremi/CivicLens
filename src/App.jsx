import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { MapDashboard } from './pages/MapDashboard';
import { Feed } from './pages/Feed';
import { ReportIssue } from './pages/ReportIssue';
import { AdminDashboard } from './pages/AdminDashboard';
import { IssueDetail } from './pages/IssueDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<MapDashboard />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/report" element={<ReportIssue />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/issue/:id" element={<IssueDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
