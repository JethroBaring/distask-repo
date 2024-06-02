import { Request, Response } from 'express';
import prisma from '../utils/db';

const createGroup = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const group = await prisma.group.create({
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

    if (group) {
      console.log('test');
      return res.status(200).json(group);
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
    const groups = await prisma.groupMembership.findMany({
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

    if (!groups) return res.status(400).json({ message: 'Not found' });

    return res.status(200).json({
      count: groups.length,
      results: groups,
    });
  } catch (error) {}
};

const getGroupById = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const group = await prisma.group.findUnique({
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

    if (!group) return res.status(400).json({ message: 'Not found' });

    return res.status(200).json(group);
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

export { createGroup, getGroupById, getGroupsByUser, joinGroup, leaveGroup };

