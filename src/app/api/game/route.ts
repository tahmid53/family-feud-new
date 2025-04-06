// API routes for game management
import { NextRequest } from 'next/server';
import { handleCreateGame, handleCheckGame } from '../../../lib/socket/socket-server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  // Check if a game exists
  return handleCheckGame(request);
}

export async function POST(request: NextRequest) {
  // Create a new game
  return handleCreateGame(request);
}
