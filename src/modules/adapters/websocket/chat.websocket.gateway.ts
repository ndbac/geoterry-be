import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { infoLog } from 'src/shared/logger/logger.helpers';

// TODO: implement an authentication logic for websocket
@WebSocketGateway()
export class ChatWebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  afterInit(): void {
    infoLog('Socket server is running');
  }

  handleConnection(socket: Socket): void {
    infoLog({ socketId: socket.id }, 'Socket connected');
  }

  handleDisconnect(socket: Socket): void {
    infoLog({ socketId: socket.id }, 'Socket disconnected');
  }

  @SubscribeMessage('conversations')
  onNewConversation(socket: Socket, conversationInput: any) {
    infoLog(
      { socketId: socket.id, conversationInput },
      'Socket received new conversation',
    );
    // TODO: should implement a real logic to handle onNewConversation event
    const profileId = 'mock-profile-id';
    this.server.emit(`profile/${profileId}/conversations`, {
      socketId: socket.id,
      ...conversationInput,
    });
  }

  @SubscribeMessage('messages')
  onNewMessage(socket: Socket, messageInput: any) {
    infoLog(
      { socketId: socket.id, messageInput },
      'Socket received new message',
    );
    // TODO: should implement a real logic to handle onNewMessage event
    const profileId = 'mock-profile-id';
    const conversationId = 'mock-conversation-id';
    this.server.emit(`profile/${profileId}/conversations/${conversationId}`, {
      socketId: socket.id,
      ...messageInput,
    });
  }
}
