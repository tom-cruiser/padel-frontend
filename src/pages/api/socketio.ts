import { Server } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import type { NextApiRequest } from 'next';
import type { Socket as NetSocket } from 'net';
import type { Server as IOServer } from 'socket.io';
import { getSession } from 'next-auth/react';

interface SocketServer extends HTTPServer {
  io?: IOServer;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiRequest {
  socket: SocketWithIO;
}

const SocketHandler = (req: NextApiResponseWithSocket, res: any) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: '/api/socketio',
    });

    io.on('connection', (socket) => {
      // Join user's room
      socket.on('join', async (userId: string) => {
        const session = await getSession({ req });
        if (session?.user?.id === userId) {
          socket.join(userId);
        }
      });

      // Handle new messages
      socket.on('new_message', (message) => {
        // Emit to recipient's room
        io.to(message.recipientId).emit('receive_message', message);
      });

      // Handle user status
      socket.on('online', (userId: string) => {
        io.emit('user_online', userId);
      });

      socket.on('offline', (userId: string) => {
        io.emit('user_offline', userId);
      });
    });

    res.socket.server.io = io;
  }

  res.end();
};

export default SocketHandler;