import prisma from '../utils/db';
import { Request, Response } from 'express';

const createTask = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const user = await prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const group = await prisma.group.findUnique({
      where: { id: data.groupId },
    });

    if (!group) {
      return res.status(400).json({ error: 'Group not found' });
    }

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
        include: {
          user: true
        }
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

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const updateData: any = {};

    if (body.status !== undefined) {
      updateData.status = body.status;
    }
    if (body.title !== undefined) {
      updateData.title = body.title;
    }
    if (body.description !== undefined) {
      updateData.description = body.description;
    }


    if (task !== null) {
      const task = await prisma.task.update({
        data: updateData,
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

const deleteTaskById = async (req: Request, res: Response) => {
  try {
    const data = req.params;
    const task = await prisma.task.findFirst({
      where: {
        id: Number.parseInt(data.taskId),
      },
    });

    if (task !== null) {
      const task = await prisma.task.delete({
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

export { createTask, getTasksByGroupId, updateTaskById, deleteTaskById };
