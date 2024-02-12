/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import { verifyAdmin } from '../middleware/verifyAdmin';
import {
  createStudentController,
  getAllStudentsController,
  removeStudentController,
  updateStudentController
} from '../controllers/student.controller';

function socketRouter(): Router {
  const router = Router();
  router.post('/newStudent', verifyToken, verifyAdmin, createStudentController);
  router.get('/getAllStudents', verifyToken, getAllStudentsController);
  router.put(
    '/updateStudent/:id',
    verifyToken,
    verifyAdmin,
    updateStudentController
  );
  router.delete(
    '/removeStudent/:id',
    verifyToken,
    verifyAdmin,
    removeStudentController
  );

  return router;
}

export default socketRouter;
