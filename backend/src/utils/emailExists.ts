import prisma from './db';

const emailExists = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  return user
};

export { emailExists };
