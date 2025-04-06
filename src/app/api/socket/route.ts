// API route for Socket.IO server
import { Server as SocketIOServer } from 'socket.io';
import { NextApiRequest } from 'next';
import { NextApiResponse } from 'next';

// Import socket server implementation
import { initSocketServer } from '../../../lib/socket/socket-server';

// Store the socket server instance
let socketServer: SocketIOServer;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!res.socket.server.io) {
    console.log('Initializing Socket.IO server...');
    
    // Create new Socket.IO server
    socketServer = new SocketIOServer(res.socket.server);
    
    // Initialize socket server with our implementation
    initSocketServer(socketServer);
    
    // Store the Socket.IO server instance
    res.socket.server.io = socketServer;
  } else {
    console.log('Socket.IO server already running');
  }
  
  res.end();
}
