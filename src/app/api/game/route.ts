// API routes for game management
import { NextApiRequest, NextApiResponse } from 'next';
import { handleCreateGame, handleCheckGame } from '../../../lib/socket/socket-server';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Create a new game
    return handleCreateGame(req, res);
  } else if (req.method === 'GET') {
    // Check if a game exists
    return handleCheckGame(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
