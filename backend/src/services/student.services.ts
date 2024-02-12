/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { type Request, type Response } from 'express';
import { Student } from '../models/student';
import AppDataSource from '../dataSource';

export const createStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const studentRepo = AppDataSource.getRepository(Student);
    const newStudent = studentRepo.create(req.body);
    await studentRepo.save(newStudent);
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ error: 'internal server error' });
  }
};

export const getAllStudents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const studentRepo = AppDataSource.getRepository(Student);
    const allStudents = await studentRepo.find();
    res.status(201).json(allStudents);
  } catch (error) {
    res.status(500).json({ error: 'internal server error' });
  }
};

export const updateStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const studentRepo = AppDataSource.getRepository(Student);
    const selectedStudent = await studentRepo.findOne({
      where: { id: parseInt(id) }
    });

    if (selectedStudent == null) {
      res.status(404).json({ error: 'student not found' });
    } else {
      studentRepo.merge(selectedStudent, req.body);
      const updatedStudent = await studentRepo.save(selectedStudent);
      res.status(201).json(updatedStudent);
    }
  } catch (error) {
    res.status(500).json({ error: 'internal server error' });
  }
};

export const removeStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const studentRepo = AppDataSource.getRepository(Student);
    const selectedStudent = await studentRepo.findOne({
      where: { id: parseInt(id) }
    });

    if (selectedStudent == null) {
      res.status(404).json({ error: 'student not found' });
    } else {
      await studentRepo.remove(selectedStudent);
      res.status(204).end();
    }
  } catch (error) {
    res.status(500).json({ error: 'internal server error' });
  }
};
