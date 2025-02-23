'use-client';

import { ProfileView } from '@/features/user/components/ProfileView';
import ProtectedRoute from '@/routes/ProtectedRoute';

// import { button } from '@/components/ui/button';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileView />
    </ProtectedRoute>
  );
}
