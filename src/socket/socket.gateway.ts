// src/socket/socket.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { YourModel } from '../your-model/your-model.schema';

@WebSocketGateway()
export class SocketGateway {
  constructor(
    @InjectModel(YourModel.name) private readonly yourModel: Model<YourModel>,
  ) {}

  @SubscribeMessage('addCard')
  async handleAddCard(
    @MessageBody() data: { title: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const newCard = new this.yourModel(data);
    await newCard.save();
    client.broadcast.emit('updateBoard', { action: 'addCard', data });
  }

  @SubscribeMessage('moveCard')
  async handleMoveCard(
    @MessageBody() data: { card: any; currentIndex: number },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    await this.yourModel.updateOne(
      { _id: data.card._id },
      { $set: { currentIndex: data.currentIndex } },
    );
    client.broadcast.emit('updateBoard', { action: 'moveCard', data });
  }
}
