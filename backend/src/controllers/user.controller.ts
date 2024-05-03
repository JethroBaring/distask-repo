import { Request, Response } from 'express';
import prisma from '../utils/db';

const getUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  });
  return res.status(200).json({
    count: users.length,
    results: users,
  });
};

const getUserById = async (req: Request, res: Response) => {
  const params = req.params;
  const user = await prisma.user.findFirst({
    where: {
      id: Number.parseInt(params.id),
    },
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  });
  if (!user) return res.status(400).json({ message: 'User not found' });
  return res.status(200).json(user);
};

export { getUsers, getUserById };
