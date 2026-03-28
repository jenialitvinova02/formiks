export const ADMIN_ACTIONS = {
  MAKE_ADMIN: 'makeAdmin',
  MAKE_USER: 'makeUser',
  DELETE: 'delete',
} as const;

export type AdminAction =
  | (typeof ADMIN_ACTIONS)[keyof typeof ADMIN_ACTIONS]
  | null;
