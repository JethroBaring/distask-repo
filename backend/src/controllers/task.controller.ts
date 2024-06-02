import prisma from '../utils/db';
import { Request, Response } from 'express';

const createTask = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const task = await prisma.task.create({
      data: {
        userId: data.userId,
        groupId: data.groupId,
        title: data.title,
        description: data.description,
        status: data.status,
      },
    });

    if (task) {
      return res.status(200).json(task);
    } else {
      return res.status(400).json(task);
    }
  } catch (error) {
    return res.status(400).json({ error: 'Error' });
  }
};

const getTasksByGroupId = async (req: Request, res: Response) => {
  try {
    const data = req.params;
    const group = await prisma.group.findFirst({
      where: {
        id: Number.parseInt(data.groupId),
      },
    });

    if (group !== null) {
      const tasks = await prisma.task.findMany({
        where: {
          groupId: Number.parseInt(data.groupId),
        },
      });

      if (tasks) {
        return res.status(200).json(tasks);
      } else {
        return res.status(400).json(tasks);
      }
    } else {
      return res.status(400).json({ error: 'Group not found' });
    }
  } catch (error) {
    console.log(error);
  }
};

const updateTaskById = async (req: Request, res: Response) => {
  try {
    const data = req.params;
    const body = req.body;
    const task = await prisma.task.findFirst({
      where: {
        id: Number.parseInt(data.taskId),
      },
    });

    if (task !== null) {
      const task = await prisma.task.update({
        data: {
          status: body.status,
        },
        where: {
          id: Number.parseInt(data.taskId),
        },
      });

      if (task) {
        return res.status(200).json(task);
      } else {
        return res.status(400).json(task);
      }
    }
  } catch (error) {
    return res.status(400).json({ error: 'Error' });
  }
};

export { createTask, getTasksByGroupId, updateTaskById };
