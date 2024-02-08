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

// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
import { Card } from 'src/kanban/kanban.schema';
import { Server } from 'http';
// import { YourModel } from '../your-model/your-model.schema';

@WebSocketGateway(4001, {
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
  @SubscribeMessage('cards:created')
  async handleAddCard(
    @MessageBody() data: { card: Card },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    // const newCard = new this.cardModel(data);
    // await newCard.save();
    const { card } = data;
    console.log('카드 생성');
    client.broadcast.emit('cards:created', { action: 'cards:created', card });
  }

  @SubscribeMessage('cards:moved')
  async handleMoveCard(
    @MessageBody() data: { card: Card },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    // await this.cardModel.updateOne(
    //   { _id: data.card._id },
    //   { $set: { currentIndex: data.currentIndex } },
    // );
    const { card } = data;
    console.log('카드 이동');
    client.broadcast.emit('cards:moved', { action: 'cards:moved', card });
  }

  @SubscribeMessage('cards:deleted')
  async handleDeleteCard(
    @MessageBody() data: { cardId: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    // await this.cardModel.deleteOne({ _id: data.card._id });
    const { cardId } = data;
    console.log('카드 삭제');
    client.broadcast.emit('cards:deleted', { action: 'cards:deleted', cardId });
  }
}
