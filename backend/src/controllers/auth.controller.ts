import { Request, Response } from 'express';
import prisma from '../utils/db';
import bcrypt from 'bcrypt';
import { emailExists } from '../utils/emailExists';
import { createToken } from '../utils/jwt';
import jwt from 'jsonwebtoken';

const login = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const exists = await emailExists(data.email);

    if (exists) {
      const passwordMatched = await bcrypt.compare(
        data.password,
        exists.password
      );

      if (passwordMatched) {
        return res.status(200).json(createToken(exists.id));
      }

      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    console.log(error);
    res.json({ error: 'Internal Server Error' }).status(500);
  }
};

const signup = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const exists = await emailExists(data.email);

    if (!exists) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(data.password, salt);
      const user = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          guildMembership: {
            create: [
              {
                groupId: 1,
              }
            ],
          },
        },
      });

      return res.status(200).json({
        id: user.id,
        email: user.email,
      });
    }

    return res.status(300).json({
      message: 'Email already exists',
    });
  } catch (error) {
    console.log(error);
    console.error(error);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

const refresh = async (req: Request, res: Response) => {
  try {
    const refresh = req.body.refresh;
    const decoded = jwt.verify(refresh, process.env.JWT_SECRET_KEY) as {
      id?: string;
    };

    const access = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '1h',
    });

    return res.status(200).json({
      access
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: 'Invalid refresh token',
    });
  }
};

export { login, signup, refresh };
