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
    jwt.verify(token, process.env.JWT_SECRET_KEY);
    next();
  } catch (error) {
    const refresh = req.cookies.Refresh;
    try {
      const decoded = jwt.verify(refresh, process.env.JWT_SECRET_KEY) as {
        id?: number;
      };
      const access = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET_KEY, {
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
