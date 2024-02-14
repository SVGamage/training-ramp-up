import { veryfyUser } from '../../../services/users.services';
import { type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn()
}));

describe('verifyUser', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      cookies: { accessToken: 'validToken' },
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('should verify a user', async () => {
    const mockJwtPayload = { user: { role: 'student' } };
    (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
      callback(null, mockJwtPayload);
    });

    await veryfyUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User is verified',
      role: 'student'
    });
  });

  it('should handle invalid tokens', async () => {
    (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
      callback(new Error('Token is not valid'), null);
    });

    await veryfyUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token is not valid' });
  });

  it('should handle errors', async () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Test error');
    });

    await veryfyUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internel server Error' });
  });
});
