'use-client';

import LoginForm from '@/features/auth/components/LoginForm';
import PublicRoute from '@/routes/PublicRoute';

export default function LoginPage() {
  return (
    <PublicRoute>
      <LoginForm />
    </PublicRoute>
  );
}
