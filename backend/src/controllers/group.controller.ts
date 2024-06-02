import prisma from '../utils/db';
import { Request, Response } from 'express';

const createGroup = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    console.log(data);
    console.log('Hello create guild');
    const guild = await prisma.group.create({
      data: {
        name: data.name,
        creatorId: Number.parseInt(data.creator),
        groupMembership: {
          create: [
            {
              userId: Number.parseInt(data.creator),
              role: "CREATOR",
            },
          ],
        },
      },
    });

    if (guild) {
      console.log('test');
      return res.status(200).json(guild);
    } else {
      console.log('something wrong');
    }
  } catch (error) {
    console.log(error);
  }
};

const getGroupsByUser = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const worlds = await prisma.groupMembership.findMany({
      where: {
        userId: Number.parseInt(params.id),
      },
      select: {
        group: {
          select: {
            id: true,
            name: true,
          }
        }
      },
    });

    if (!worlds) return res.status(400).json({ message: 'Not found' });

    return res.status(200).json({
      count: worlds.length,
      results: worlds,
    });
  } catch (error) {}
};

const getGroupById = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const world = await prisma.group.findUnique({
      where: {
        id: Number.parseInt(params.id),
      },
    });

    if (!world) return res.status(400).json({ message: 'Not found' });

    return res.status(200).json(world);
  } catch (error) {}
};

const joinGroup = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const world = await prisma.groupRequest.create({
      data: {
        userId: Number.parseInt(data.userId),
        groupId: Number.parseInt(data.guildId),
        status: "PENDING",
      },
    });
    if (!world)
      return res.status(400).json({
        message: 'Error',
      });

    return res.status(200).json(world);
  } catch (error) {}
};

const acceptGroupRequest = async (req: Request, res: Response) => {
  try {
    const { userId, groupId } = req.body as { userId: number; groupId: number };

    const request = await prisma.groupRequest.update({
      where: {
        userId_groupId: { userId, groupId },
      },
      data: {
        status: "ACCEPTED",
      },
    });

    if (request) {
      const group = await prisma.groupMembership.create({
        data: {
          groupId,
          userId,
          role: "MEMBER",
        },
      });

      if (group) {
        return res.status(200).json(group);
      } else {
        return res.status(400).json(group);
      }
    } else {
      return res.status(400).json({ message: 'Error' });
    }
  } catch (error) {}
};

const rejectGroupRequest = async (req: Request, res: Response) => {
  try {
    const { userId, groupId } = req.body as { userId: number; groupId: number };

    const request = await prisma.groupRequest.update({
      where: {
        userId_groupId: { userId, groupId },
      },
      data: {
        status: "REJECTED",
      },
    });

    if (!request) return res.status(400).json({ message: 'Error' });

    if (request) {
      return res.status(200).json(request);
    }
  } catch (error) {}
};

export {
  createGroup,
  getGroupsByUser,
  getGroupById,
  joinGroup,
  acceptGroupRequest,
  rejectGroupRequest,
};
