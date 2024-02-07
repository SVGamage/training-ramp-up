/* eslint-disable @typescript-eslint/no-misused-promises */
import { type Request, type Response, Router } from 'express';
import {
  createUser,
  emailSend,
  getAllUsers,
  loginUser,
  logoutUser,
  registerUser,
  veryfyUser
} from '../controllers/users.controllers';
import { verifyToken } from '../middleware/auth';
import { verifyAdmin } from '../middleware/verifyAdmin';

export default function userSocketRouter(
  io: any,
  userSocketMap: Map<string, string>
): Router {
  const userRouter = Router();
  userRouter.post('/newUser', async (req: Request, res: Response) => {
    try {
      await createUser(req, res).then(() => {
        io.emit('create_new_user', res.statusCode);
      });
    } catch (error) {
      console.error(error);
    }
  });
  userRouter.post('/emailSend', async (req: Request, res: Response) => {
    try {
      const socketId = userSocketMap.get(req.body.email as string);
      await emailSend(req, res).then(() => {
        if (socketId !== null) {
          io.to(socketId).emit('send_email', res.statusCode);
        }
      });
    } catch (error) {
      console.error(error);
    }
  });
  userRouter.post('/registerUser', async (req: Request, res: Response) => {
    try {
      const socketId = userSocketMap.get(req.body.email as string);
      await registerUser(req, res).then(() => {
        if (socketId !== null) {
          io.to(socketId).emit('register_user', res.statusCode);
        }
      });
    } catch (error) {
      console.error(error);
    }
  });
  userRouter.post('/loginUser', async (req: Request, res: Response) => {
    try {
      const role = await loginUser(req, res);
      const socketId = userSocketMap.get(req.body.email as string);
      if (socketId !== null) {
        io.to(socketId).emit('login_user', {
          statusCode: res.statusCode,
          role
        });
      }
    } catch (error) {
      console.error(error);
    }
  });

  userRouter.get('/getUsers', verifyToken, verifyAdmin, getAllUsers);
  userRouter.post('/logoutUser', async (req: Request, res: Response) => {
    try {
      await logoutUser(req, res).then(() => {
        io.emit('logout_user', res.statusCode);
      });
    } catch (error) {
      console.error(error);
    }
  });
  userRouter.post('/verifyAuth', veryfyUser);
  return userRouter;
}
