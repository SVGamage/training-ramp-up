import { type Request, type Response } from 'express';
import {
  createUser,
  emailSend,
  loginUser,
  logoutUser,
  registerUser
} from '../services/users.services';
import { io, userSocketMap } from '../index';

export const logoutUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await logoutUser(req, res).then(() => {
      io.emit('logout_user', res.statusCode);
    });
  } catch (error) {
    console.error(error);
  }
};

export const loginUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const role = await loginUser(req, res);
    const socketId = userSocketMap.get(req.body.email as string);
    if (socketId !== null) {
      io.to(socketId!).emit('login_user', {
        statusCode: res.statusCode,
        role
      });
    }
  } catch (error) {
    console.error(error);
  }
};

export const registerUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const socketId = userSocketMap.get(req.body.email as string);
    await registerUser(req, res).then(() => {
      if (socketId !== null) {
        io.to(socketId!).emit('register_user', res.statusCode);
      }
    });
  } catch (error) {
    console.error(error);
  }
};

export const emailSendController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const socketId = userSocketMap.get(req.body.email as string);
    await emailSend(req, res).then(() => {
      if (socketId !== null) {
        io.to(socketId!).emit('send_email', res.statusCode);
      }
    });
  } catch (error) {
    console.error(error);
  }
};

export const createUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await createUser(req, res).then(() => {
      io.emit('create_new_user', res.statusCode);
    });
  } catch (error) {
    console.error(error);
  }
};
