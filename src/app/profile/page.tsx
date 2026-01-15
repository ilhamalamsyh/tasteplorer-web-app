'use client';

import React from 'react';
import ProtectedRoute from '@/routes/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import ProfileContent from './ProfileContent';

export default function ProfilePage() {
  const { user, loading } = useAuth();

  return (
    <ProtectedRoute>{!loading && user && <ProfileContent />}</ProtectedRoute>
  );
}
