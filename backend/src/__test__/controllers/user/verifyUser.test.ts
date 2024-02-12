// import { type Request, type Response } from 'express';
// import jwt from 'jsonwebtoken';
// import { veryfyUser } from '../../../controllers/user.controller'; // import your function

// jest.mock('jsonwebtoken', () => ({
//   verify: jest.fn()
// }));

// describe('verifyUser', () => {
//   let req: Partial<Request>;
//   let res: Partial<Response>;

//   beforeEach(() => {
//     req = {
//       headers: {
//         cookie: 'token=validToken'
//       }
//     };
//     res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn()
//     };
//   });

//   it('should respond with 401 if no cookie is present', async () => {
//     req.headers!.cookie = undefined;

//     await veryfyUser(req as Request, res as Response);

//     expect(res.status).toHaveBeenCalledWith(401);
//     expect(res.json).toHaveBeenCalledWith({ message: 'User is  not verified' });
//   });

//   it('should respond with 401 if token is not valid', async () => {
//     (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
//       callback(new Error('Token is not valid'));
//     });

//     await veryfyUser(req as Request, res as Response);

//     expect(res.status).toHaveBeenCalledWith(401);
//     expect(res.json).toHaveBeenCalledWith({ message: 'Token is not valid' });
//   });

//   it('should respond with 200 if token is valid', async () => {
//     (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
//       callback(null, { user: { role: 'admin' } });
//     });

//     await veryfyUser(req as Request, res as Response);

//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith({
//       message: 'User is verified',
//       role: 'admin'
//     });
//   });

//   it('should handle errors', async () => {
//     (jwt.verify as jest.Mock).mockImplementation(() => {
//       throw new Error('Internal server error');
//     });

//     await veryfyUser(req as Request, res as Response);

//     expect(res.status).toHaveBeenCalledWith(500);
//     expect(res.json).toHaveBeenCalledWith({ message: 'Internel server Error' });
//   });
// });
