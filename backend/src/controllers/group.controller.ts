import prisma from '../utils/db';
import { Request, Response } from 'express';

const createGroup = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const guild = await prisma.group.create({
      data: {
        name: data.name,
        creatorId: Number.parseInt(data.creator),
        groupMembership: {
          create: [
            {
              userId: Number.parseInt(data.creator),
              role: 'CREATOR',
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
          },
        },
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
      include: {
        groupMembership: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!world) return res.status(400).json({ message: 'Not found' });

    return res.status(200).json(world);
  } catch (error) {}
};

const joinGroup = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const group = await prisma.group.findFirst({
      where: {
        id: data.groupId,
      },
    });

    if (group !== null) {
      const group = await prisma.groupMembership.create({
        data: {
          userId: data.userId,
          groupId: data.groupId,
          role: 'MEMBER',
        },
      });

      if (group) {
        return res.status(200).json(group);
      } else {
        return res.status(400).json(group);
      }
    } else {
      return res.status(400).json({ error: 'Group not found.' });
    }
  } catch (error) {}
};

const leaveGroup = async (req: Request, res: Response) => {
  try {
    const { userId, groupId } = req.body;

    const membership = await prisma.groupMembership.findFirst({
      where: {
        userId: Number.parseInt(userId),
        groupId: Number.parseInt(groupId),
      },
    });

    if (!membership) {
      return res.status(400).json({ message: 'Membership not found' });
    }

    const group = await prisma.groupMembership.delete({
      where: {
        userId_groupId: {
          userId,
          groupId,
        },
      },
    });

    if (group) {
      return res.status(200).json({ message: 'Successfully left the group' });
    } else {
      return res.status(400);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export { createGroup, getGroupsByUser, getGroupById, joinGroup, leaveGroup };
