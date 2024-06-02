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
        id: data.groupId
      }
    })

    if(group !== null) {
      const group = await prisma.groupMembership.create({
        data: {
          userId: data.userId,
          groupId: data.groupId,
          role: 'MEMBER'
        }
      });
  
      if (group) {
        return res.status(200).json(group);
      } else {
        return res.status(400).json(group);
      }
    } else {
      return res.status(400).json({error: "Group not found."})
    }

  } catch (error) {}
};

export {
  createGroup,
  getGroupsByUser,
  getGroupById,
  joinGroup
};
