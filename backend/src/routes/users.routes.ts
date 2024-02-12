/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { getAllUsers, veryfyUser } from '../services/users.services';
import { verifyToken } from '../middleware/auth';
import { verifyAdmin } from '../middleware/verifyAdmin';
import {
  createUserController,
  emailSendController,
  loginUserController,
  logoutUserController,
  registerUserController
} from '../controllers/users.controller';

export default function userSocketRouter(): Router {
  const userRouter = Router();
  userRouter.post('/newUser', createUserController);
  userRouter.post('/emailSend', emailSendController);
  userRouter.post('/registerUser', registerUserController);
  userRouter.post('/loginUser', loginUserController);
  userRouter.get('/getUsers', verifyToken, verifyAdmin, getAllUsers);
  userRouter.post('/logoutUser', logoutUserController);
  userRouter.post('/verifyAuth', veryfyUser);
  return userRouter;
}
