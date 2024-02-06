// src/socket/socket.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
// 미들웨어
import { Logger } from '@nestjs/common';

import {
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Card } from 'src/kanban/kanban.schema';
import { Server } from 'http';
// import { YourModel } from '../your-model/your-model.schema';

@WebSocketGateway(4001, {
  namespace: 'board',
  cors: { origin: '*' },
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor() {} // @InjectModel(Card.name) private readonly cardModel: Model<Card>,

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  afterInit(server: Server) {
    this.logger.log('웹소켓 서버 초기화 ✅', server);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`클라이언트 접속됨 ✅ ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`클라이언트 접속해제됨 ❌ ${client.id}`);
  }

  /* -------------------------------subscribe ----------------------------------- */
  @SubscribeMessage('addCard')
  async handleAddCard(
    @MessageBody() data: { title: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    // const newCard = new this.cardModel(data);
    // await newCard.save();
    client.broadcast.emit('updateBoard', { action: 'addCard', data });
  }

  @SubscribeMessage('moveCard')
  async handleMoveCard(
    @MessageBody() data: { card: any; currentIndex: number },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    // await this.cardModel.updateOne(
    //   { _id: data.card._id },
    //   { $set: { currentIndex: data.currentIndex } },
    // );
    client.broadcast.emit('updateBoard', { action: 'moveCard', data });
  }
}
