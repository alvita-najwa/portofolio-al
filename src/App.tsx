/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase.ts';
import LandingPage from './pages/LandingPage.tsx';
import BlogDetail from './pages/BlogDetail.tsx';
import Login from './pages/Login.tsx';
import AdminLayout from './components/AdminLayout.tsx';
import Dashboard from './pages/admin/Dashboard.tsx';
import ManageProfile from './pages/admin/ManageProfile.tsx';
import ManageProjects from './pages/admin/ManageProjects.tsx';
import ManageBlog from './pages/admin/ManageBlog.tsx';
import ManageCertificates from './pages/admin/ManageCertificates.tsx';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/login" element={<Login session={session} />} />

        {/* Protected Admin Routes */}
        <Route 
          path="/admin" 
          element={session ? <AdminLayout /> : <Navigate to="/login" />}
        >
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<ManageProfile />} />
          <Route path="projects" element={<ManageProjects />} />
          <Route path="blog" element={<ManageBlog />} />
          <Route path="certificates" element={<ManageCertificates />} />
        </Route>
      </Routes>
    </Router>
  );
}
