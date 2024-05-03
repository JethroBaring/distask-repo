import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookie = req.cookies;
  const authorization = req.headers.authorization;

  if (!authorization) return res.send('No authorization header');

  const token = authorization.split(' ')[1];
  if (token === undefined) {
    res.status(400).send('No token provided');
  }

  try {
    jwt.verify(token, "distask");
    next();
  } catch (error) {
    const refresh = req.cookies.Refresh;
    try {
      const decoded = jwt.verify(refresh, "distask") as {
        id?: number;
      };
      const access = jwt.sign({ id: decoded.id }, "distask", {
        expiresIn: '1h',
      });
      return res.status(401).json({
        access,
      });
    } catch (error) {
      return res.status(400).send('Invalid token');
    }
  }
};

export default authenticate;
