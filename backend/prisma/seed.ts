import { Permission, Role } from '@prisma/client';
import prisma from '../src/utils/db';
import bcrypt from 'bcrypt';

const main = async () => {
  const salt = await bcrypt.genSalt();

  const user = await prisma.user.create({
    data: {
      email: 'admin@gmail.com',
      password: await bcrypt.hash('admin123', salt),
      guild: {
        create: [
          {
            name: 'Alliance Of Light',
          },
        ],
      },
    },
  });

  const membership = await prisma.groupMembership.create({
    data: {
      userId: 1,
      groupId: 1,
      role: Role.CREATOR,
    },
  });

  const channel = await prisma.channel.create({
    data: {
      name: 'General',
      groupId: 1,
      channelPermission: {
        create: [
          {
            userId: 1,
            permission: Permission.READ_ONLY,
          }
        ],
      },
    },
  });

  const messages = await prisma.message.createMany({
    data: [
      {
        content: 'Hi everyone',
        userId: 1,
        channelId: 1,
      },
      {
        content: "I'm the creator of this",
        userId: 1,
        channelId: 1,
      },
      {
        content: 'Welcome to WorldVerse',
        userId: 1,
        channelId: 1,
      },

      {
        content: 'Enjoy and',
        userId: 1,
        channelId: 1,
      },
      {
        content: 'Have fun!!!',
        userId: 1,
        channelId: 1,
      },
    ],
  });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })

  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });
