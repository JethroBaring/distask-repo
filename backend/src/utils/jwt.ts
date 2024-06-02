import jwt from 'jsonwebtoken';

const createToken = (id: number) => {
  return {
    refresh: jwt.sign({ id }, "distask", {
      expiresIn: '7d',
    }),
    access: jwt.sign({ id }, "distask", {
      expiresIn: '3d',
    }),
  };
};

export { createToken };
