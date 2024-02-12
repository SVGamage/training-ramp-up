import { type Request, type Response } from 'express';
import { Student } from '../../../models/student';
import AppDataSource from '../../../dataSource';
import { updateStudent } from '../../../services/student.services';

jest.mock('../../../dataSource', () => ({
  getRepository: jest.fn().mockReturnValue({
    findOne: jest.fn(),
    merge: jest.fn(),
    save: jest.fn()
  })
}));

describe('updateStudent', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      params: { id: '1' },
      body: { name: 'John Doe' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('should update a student', async () => {
    const mockStudent = { id: 1, name: 'John Doe' };
    const studentRepo = AppDataSource.getRepository(Student);
    (studentRepo.findOne as jest.Mock).mockResolvedValue(mockStudent);
    (studentRepo.save as jest.Mock).mockResolvedValue(mockStudent);

    await updateStudent(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockStudent);
  });

  it('should handle student not found', async () => {
    const studentRepo = AppDataSource.getRepository(Student);
    (studentRepo.findOne as jest.Mock).mockResolvedValue(null);

    await updateStudent(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'student not found' });
  });

  it('should handle errors', async () => {
    const studentRepo = AppDataSource.getRepository(Student);
    (studentRepo.findOne as jest.Mock).mockRejectedValue(
      new Error('Test error')
    );

    await updateStudent(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'internal server error' });
  });
});
