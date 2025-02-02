'use-client';

import RegisterForm from '@/features/auth/components/RegisterForm';
import PublicRoute from '@/routes/PublicRoute';

export default function RegisterPage() {
  return (
    <PublicRoute>
      <RegisterForm />
    </PublicRoute>
  );
}
