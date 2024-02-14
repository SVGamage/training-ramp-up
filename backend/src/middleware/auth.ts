/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import { type NextFunction, type Request, type Response } from 'express';
import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET_KEY!;
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.accessToken as string;
    if (token === null) {
      res.status(401).json({ message: 'User is  not verified' });
      return;
    }
    const decoded = jwt.verify(token, SECRET_KEY, (error, data) => {
      if (error !== null) {
        console.log(error);
        res.status(401).json({ message: 'Token is not valid' });
        return;
      }
      req.body.role = (data as jwt.JwtPayload).user.role;
      next();
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internel server Error' });
  }
};
