import { Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module'; // Import the ProjectsModule
import { LoggerMiddleware } from './logger/logger.middleware';
import { MiddlewareConsumer } from '@nestjs/common/interfaces/middleware';

// 웹 소켓
// import { SocketModule } from './socket/socket.module';
import { SocketGateway } from './socket/socket.gateway';
import { KanbanModule } from './kanban/kanban.module';
import { SocketModule } from './socket/socket.module';
import * as mongoose from 'mongoose';

@Module({
  imports: [
    UsersModule,
    ProjectsModule, // Add the ProjectsModule here
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MOGODB_URI, {}),

    // SocketModule,
    KanbanModule,

    SocketModule,
  ],
  controllers: [AppController],
  providers: [AppService, SocketGateway],
})
export class AppModule implements NestModule {
  private readonly isDev: boolean = process.env.MODE === 'development';

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('/users');

    // 환경변수 사용 - 프로덕션 배포할땐 false이고 개발환결일때는 true 이기때문
    mongoose.set('debug', this.isDev);
  }
}
