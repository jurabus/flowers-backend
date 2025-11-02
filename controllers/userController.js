import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';

const sign = (user) =>
  jwt.sign({ id: user._id }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

export const registerAdmin = async (req, res) => {
  const { email, password, firstName, lastName, phone } = req.body;
  const exist = await User.findOne({ role: 'admin' });
  if (exist) return res.status(403).json({ message: 'Admin already exists' });
  const user = await User.create({ email, password, firstName, lastName, phone, role: 'admin' });
  res.status(201).json({ token: sign(user) });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: 'Invalid credentials' });
  res.json({
    token: sign(user),
    user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role }
  });
};

export const getProfile = async (req, res) => {
  res.json(req.user);
};

export const updateProfile = async (req, res) => {
  const { firstName, lastName, phone } = req.body;
  req.user.firstName = firstName ?? req.user.firstName;
  req.user.lastName  = lastName ?? req.user.lastName;
  req.user.phone     = phone ?? req.user.phone;
  await req.user.save();
  res.json(req.user);
};

export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!(await req.user.matchPassword(oldPassword)))
    return res.status(400).json({ message: 'Old password incorrect' });
  req.user.password = newPassword;
  await req.user.save();
  res.json({ message: 'Password changed' });
};
