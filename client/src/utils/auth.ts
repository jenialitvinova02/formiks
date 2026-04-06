export interface SessionUser {
  id: number;
  email: string;
  role: string;
}

export function decodeToken(token: string | null): SessionUser | null {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as SessionUser;
    return payload;
  } catch {
    return null;
  }
}
