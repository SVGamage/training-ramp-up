import { type Request, type Response } from 'express';
import { Student } from '../../../models/student';
import AppDataSource from '../../../dataSource';
import { createStudent } from '../../../services/student.services';

jest.mock('../../../dataSource', () => ({
  getRepository: jest.fn().mockReturnValue({
    create: jest.fn(),
    save: jest.fn()
  })
}));

describe('createStudent', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: { name: 'John Doe' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('should create a new student', async () => {
    const mockStudent = { id: 1, name: 'John Doe' };
    const studentRepo = AppDataSource.getRepository(Student);
    (studentRepo.create as jest.Mock).mockReturnValue(mockStudent);
    (studentRepo.save as jest.Mock).mockResolvedValue(mockStudent);

    await createStudent(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockStudent);
  });

  it('should handle errors', async () => {
    const studentRepo = AppDataSource.getRepository(Student);
    (studentRepo.save as jest.Mock).mockRejectedValue(new Error('Test error'));

    await createStudent(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'internal server error' });
  });
});
