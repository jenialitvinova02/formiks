import User from '../models/User';
import { AppError } from '../errors/AppError';
import { serializeUser } from '../utils/serializers';

export async function getUserById(userId: number) {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  return user;
}

export async function getProfile(userId: number) {
  return serializeUser(await getUserById(userId));
}

export async function updateProfile(
  userId: number,
  payload: { username: string; email: string },
) {
  const user = await getUserById(userId);
  await user.update(payload);
  return serializeUser(user);
}

export async function listUsers() {
  const users = await User.findAll();
  return users.map(serializeUser);
}

export async function updateUserRole(userId: number, role: 'user' | 'admin') {
  const user = await getUserById(userId);
  await user.update({ role });
  return serializeUser(user);
}

export async function deleteUser(userId: number) {
  const user = await getUserById(userId);
  await user.destroy();
}
