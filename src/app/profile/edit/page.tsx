'use-client';

import EditUserForm from '@/features/user/components/EditUserForm';
import ProtectedRoute from '@/routes/ProtectedRoute';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <EditUserForm />
    </ProtectedRoute>
  );
}
