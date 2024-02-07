import { type Request, type Response, type NextFunction } from 'express';

export const verifyAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log(req.body);
    const role: string = req.body.role as string;
    if (role !== 'Admin') {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized4' });
  }
};
