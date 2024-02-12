import { type Request, type Response } from 'express';
import { Student } from '../../../models/student';
import AppDataSource from '../../../dataSource';
import { getAllStudents } from '../../../services/student.services';

jest.mock('../../../dataSource', () => ({
  getRepository: jest.fn().mockReturnValue({
    find: jest.fn()
  })
}));

describe('getAllStudents', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('should return all students', async () => {
    const mockStudents = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' }
    ];
    const studentRepo = AppDataSource.getRepository(Student);
    (studentRepo.find as jest.Mock).mockResolvedValue(mockStudents);

    await getAllStudents(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockStudents);
  });

  it('should handle errors', async () => {
    const studentRepo = AppDataSource.getRepository(Student);
    (studentRepo.find as jest.Mock).mockRejectedValue(new Error('Test error'));

    await getAllStudents(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'internal server error' });
  });
});
