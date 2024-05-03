import prisma from '../utils/db';
import { Request, Response } from 'express';
import { Status } from '@prisma/client';

const getRequestByGuild = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const requests = await prisma.groupRequest.findMany({
      where: {
        status: Status.PENDING,
        groupId: Number.parseInt(params.id),
      },
      include: {
        user: {
          select: {
            email: true,
            createdAt: true
          }
        }
      }
    });

    if (!requests) return res.status(400).json({ message: 'error' });

    return res.status(200).json(requests);
  } catch (error) {
    console.log(error);
  }
};

export { getRequestByGuild }