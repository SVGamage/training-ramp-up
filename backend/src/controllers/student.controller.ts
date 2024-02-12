import {
  createStudent,
  getAllStudents,
  removeStudent,
  updateStudent
} from '../services/student.services';
import { type Request, type Response } from 'express';
import { io, studentSocketMap } from '../index';
export const getAllStudentsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await getAllStudents(req, res).then(() => {
      io.emit('get_all_students', res.statusCode);
    });
  } catch (error) {
    console.error(error);
  }
};

export const removeStudentController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const socketId = studentSocketMap.get(req.params.id);
    await removeStudent(req, res).then(() => {
      if (socketId !== null) {
        io.to(socketId!).emit('remove_student', res.statusCode);
      }
    });
  } catch (error) {
    console.error(error);
  }
};

export const createStudentController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const socketId = studentSocketMap.get(req.body.mobileno as string);
    await createStudent(req, res).then(() => {
      if (socketId !== null) {
        io.to(socketId!).emit('create_new_student', res.statusCode);
      }
    });
  } catch (error) {
    console.error(error);
  }
};

export const updateStudentController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const socketId = studentSocketMap.get(req.params.id);
    await updateStudent(req, res).then(() => {
      if (socketId !== null) {
        io.to(socketId!).emit('update_student', res.statusCode);
      }
    });
  } catch (error) {
    console.error(error);
  }
};
