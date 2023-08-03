import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './user/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { HomeModule } from './home/home.module';

@Module({
  imports: [UserModule, AuthModule, PrismaModule, HomeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
