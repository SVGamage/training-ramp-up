import { type Request, type Response } from 'express';
import { Student } from '../../../models/student';
import AppDataSource from '../../../dataSource';
import { removeStudent } from '../../../services/student.services';

jest.mock('../../../dataSource', () => ({
  getRepository: jest.fn().mockReturnValue({
    findOne: jest.fn(),
    remove: jest.fn()
  })
}));

describe('removeStudent', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      params: { id: '1' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      end: jest.fn()
    };
  });

  it('should remove a student', async () => {
    const mockStudent = { id: 1, name: 'John Doe' };
    const studentRepo = AppDataSource.getRepository(Student);
    (studentRepo.findOne as jest.Mock).mockResolvedValue(mockStudent);

    await removeStudent(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.end).toHaveBeenCalled();
  });

  it('should handle student not found', async () => {
    const studentRepo = AppDataSource.getRepository(Student);
    (studentRepo.findOne as jest.Mock).mockResolvedValue(null);

    await removeStudent(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'student not found' });
  });

  it('should handle errors', async () => {
    const studentRepo = AppDataSource.getRepository(Student);
    (studentRepo.findOne as jest.Mock).mockRejectedValue(
      new Error('Test error')
    );

    await removeStudent(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'internal server error' });
  });
});
