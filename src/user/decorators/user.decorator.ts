import { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common/decorators/http';

export interface UserInfo {
  name: string;
  id: number;
  iat: number;
  exp: number;
}

export const User = createParamDecorator((data, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  return request.user;
});
