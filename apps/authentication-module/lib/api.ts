import { NextApiRequest, NextApiResponse } from 'next';
import { register, login } from './db';

const api = {
  register: async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const data = req.body;
      const user = await register(data);
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error registering user' });
    }
  },
  login: async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const data = req.body;
      const user = await login(data);
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error logging in user' });
    }
  },
};

export default api;