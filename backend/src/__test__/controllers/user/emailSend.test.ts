import { emailSend } from '../../../services/users.services';
import AppDataSource from '../../../dataSource';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Users } from '../../../models/user';
import { type Request, type Response } from 'express';

jest.mock('../../../dataSource', () => ({
  getRepository: jest.fn().mockReturnValue({
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn()
  })
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn()
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn()
}));

describe('emailSend', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: { email: 'test@example.com', role: 'student', name: 'John Doe' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('should send an email', async () => {
    const mockUser = {
      email: 'test@example.com',
      role: 'student',
      name: 'John Doe'
    };
    const userRepo = AppDataSource.getRepository(Users);
    (userRepo.findOne as jest.Mock).mockResolvedValue(null);
    (userRepo.create as jest.Mock).mockReturnValue(mockUser);
    (userRepo.save as jest.Mock).mockResolvedValue(mockUser);
    (jwt.sign as jest.Mock).mockReturnValue('tempToken');
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedTempPassword');

    await emailSend(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Signup link sent successfully',
      tempToken: 'tempToken'
    });
  }, 10000);

  it('should handle errors', async () => {
    const userRepo = AppDataSource.getRepository(Users);
    (userRepo.save as jest.Mock).mockRejectedValue(new Error('Test error'));

    await emailSend(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});
