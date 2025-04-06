// API route for Socket.IO server
import { Server as SocketIOServer } from 'socket.io';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  return new Response('WebSocket API route');
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
