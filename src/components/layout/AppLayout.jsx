import React from 'react';
import { Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-surface font-body text-on-surface antialiased overflow-x-hidden relative">
      <Outlet />
    </div>
  );
}
