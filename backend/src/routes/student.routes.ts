/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { type Request, type Response, Router } from 'express';
import {
  createStudent,
  getAllStudents,
  removeStudent,
  updateStudent
} from '../controllers/student.controller';
import { verifyToken } from '../middleware/auth';
import { verifyAdmin } from '../middleware/verifyAdmin';

function socketRouter(io: any, studentSocketMap: Map<string, string>): Router {
  const router = Router();

  router.post(
    '/newStudent',
    verifyToken,
    verifyAdmin,
    async (req: Request, res: Response) => {
      try {
        const socketId = studentSocketMap.get(req.body.mobileno);
        await createStudent(req, res).then(() => {
          if (socketId !== null) {
            io.to(socketId).emit('create_new_student', res.statusCode);
          }
        });
      } catch (error) {
        console.error(error);
      }
    }
  );
  router.get(
    '/getAllStudents',
    verifyToken,
    async (req: Request, res: Response) => {
      try {
        await getAllStudents(req, res).then(() => {
          io.emit('get_all_students', res.statusCode);
        });
      } catch (error) {
        console.error(error);
      }
    }
  );
  router.put(
    '/updateStudent/:id',
    verifyToken,
    verifyAdmin,
    async (req: Request, res: Response) => {
      try {
        const socketId = studentSocketMap.get(req.params.id);
        await updateStudent(req, res).then(() => {
          if (socketId !== null) {
            io.to(socketId).emit('update_student', res.statusCode);
          }
        });
      } catch (error) {
        console.error(error);
      }
    }
  );
  router.delete(
    '/removeStudent/:id',
    verifyToken,
    verifyAdmin,
    async (req: Request, res: Response) => {
      try {
        const socketId = studentSocketMap.get(req.params.id);
        await removeStudent(req, res).then(() => {
          if (socketId !== null) {
            io.to(socketId).emit('remove_student', res.statusCode);
          }
        });
      } catch (error) {
        console.error(error);
      }
    }
  );

  return router;
}

export default socketRouter;
