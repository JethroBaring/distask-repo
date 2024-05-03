import jwt from 'jsonwebtoken';

const createToken = (id: number) => {
  return {
    refresh: jwt.sign({ id }, "distask", {
      expiresIn: '1d',
    }),
    access: jwt.sign({ id }, "distask", {
      expiresIn: '1h',
    }),
  };
};

export { createToken };
