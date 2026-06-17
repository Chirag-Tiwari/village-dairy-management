import { useAppSelector } from '@/redux/hooks';

export function useAuth() {
  const { user, status, error } = useAppSelector((state) => state.auth);
  return {
    user,
    isAuthenticated: Boolean(user),
    status,
    error,
  };
}
