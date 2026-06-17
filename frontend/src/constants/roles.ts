export const ROLES = {
  USER: 'USER',
  SECRETARY: 'SECRETARY',
  SUPERVISOR: 'SUPERVISOR',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_HOME_ROUTE: Record<Role, string> = {
  USER: '/dashboard/farmer',
  SECRETARY: '/dashboard/secretary',
  SUPERVISOR: '/dashboard/supervisor',
};
