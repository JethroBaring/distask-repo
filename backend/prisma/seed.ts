import prisma from '../src/utils/db';
import bcrypt from 'bcrypt';

const main = async () => {
  const salt = await bcrypt.genSalt();

  const user = await prisma.user.create({
    data: {
      email: 'admin@gmail.com',
      password: await bcrypt.hash('admin123', salt),
      group: {
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
      role: "CREATOR",
    },
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
