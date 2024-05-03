import prisma from '../utils/db';
import { Request, Response } from 'express';

const createMessage = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const message = await prisma.message.create({
      data: {
        content: data.content,
        userId: data.userId,
        groupId: data.groupId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            email: true,
            groupMembership: {
              where: {
                groupId: data.groupId
              },
              select: {
                role: true,
                nickname: true,
              },
            },
          },
        },
      },
    });

    if (!message) return res.status(400).json({ message: 'Error' });

    return res.status(200).json(message);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

const getMessagesByGuildId = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const messages = await prisma.message.findMany({
      where: {
        groupId: Number.parseInt(params.groupId),
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            email: true,
            groupMembership: {
              where: {
                groupId: Number.parseInt(params.guildId),
              },
              select: {
                role: true,
                nickname: true,
              },
            },
          },
        },
      },
    });

    if (!messages) return res.status(400).json({ message: 'error' });

    return res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'error' });
  }
};

export { createMessage, getMessagesByGuildId };
