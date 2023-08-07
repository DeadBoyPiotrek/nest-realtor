import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  exports: [AuthService],
  controllers: [AuthController],
  providers: [
    AuthService,
    // { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
  ],
  imports: [PrismaModule],
})
export class AuthModule {}
