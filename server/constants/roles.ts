export const ROLE_ADMIN = 'admin';
export const ROLE_USER = 'user';

export const USER_ROLES = [ROLE_USER, ROLE_ADMIN] as const;

export type UserRole = (typeof USER_ROLES)[number];
