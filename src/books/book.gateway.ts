import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
@WebSocketGateway({
  cors: {
    origin: '*', // Allow all origins or set specific origins
  },
})
export class BookGateway {
  @WebSocketServer() server: Server;

  // Broadcast to all connected clients
  sendBookUpdate(message: string, data: any) {
    this.server.emit('bookUpdate', { message, data });
  }
}
