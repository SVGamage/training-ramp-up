import { loginUser } from '../../../services/users.services';
import { type Request, type Response } from 'express';
import AppDataSource from '../../../dataSource';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Users } from '../../../models/user';

jest.mock('../../../dataSource', () => ({
  getRepository: jest.fn().mockReturnValue({
    findOne: jest.fn()
  })
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn()
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn()
}));

describe('loginUser', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: { email: 'test@example.com', password: 'password' },
      cookies: { accessToken: null, refreshToken: null }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn()
    };
  });

  it('should log in a user', async () => {
    const mockUser = {
      email: 'sithumvgamage@gmail.com',
      password: 'Sithum12@#',
      role: 'Observer'
    };
    const userRepo = AppDataSource.getRepository(Users);
    (userRepo.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('token');

    const userRole = await loginUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Login Successfully.' });
    expect(userRole).toEqual('Observer');
  });

  it('should handle failed authentication', async () => {
    const userRepo = AppDataSource.getRepository(Users);
    (userRepo.findOne as jest.Mock).mockResolvedValue(null);

    const userRole = await loginUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Authentication Failed' });
    expect(userRole).toBeNull();
  });

  it('should handle errors', async () => {
    const userRepo = AppDataSource.getRepository(Users);
    (userRepo.findOne as jest.Mock).mockImplementation(() => {
      throw new Error('Test error');
    });

    const userRole = await loginUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    expect(userRole).toBeNull();
  });
});
