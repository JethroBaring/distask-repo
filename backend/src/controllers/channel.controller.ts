import { Request, Response } from 'express';
import prisma from '../utils/db';
import { Permission } from '@prisma/client';

const getChannels = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const channels = await prisma.channel.findMany({
      where: {
        groupId: Number.parseInt(params.id),
      },
    });

    if (!channels) return res.status(400).json({ message: 'Error' });

    return res.status(200).json(channels);
  } catch (error) {}
};

const createChannel = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const channel = await prisma.channel.create({
      data: {
        groupId: Number.parseInt(data.guildId),
        name: data.name,
        channelPermission: {
          create: (
            await prisma.groupMembership.findMany({
              where: {
                groupId: Number.parseInt(data.guildId),
              },
            })
          ).map((member) => ({
            userId: member.userId,
            permission: Permission.READ_WRITE,
          })),
        },
      },
    });

    if(!channel) return res.status(401).json({"message":"Error"})
    return res.status(200).json(channel)
  } catch (error) {}
};

const getChannelPermission = async (req: Request, res: Response) => {
  try {
    const params = req.params
    const permission = await prisma.channelPermission.findUnique({
      where: {
        userId_channelId: {userId: Number.parseInt(params.userId), channelId: Number.parseInt(params.channelId)}
      }
    })
    console.log(permission)
    if(!permission) return res.status(401).json({"message":"Error"})
    return res.status(200).json(permission)
  } catch (error) {
    
  }
}

export { getChannels, createChannel, getChannelPermission };
