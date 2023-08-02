import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
interface SignUpParams {
  email: string;
  password: string;
  name: string;
  phone: string;
}

interface SignInParams {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  async signUp({ email, password, name, phone }: SignUpParams) {
    const userExists = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    console.log(`🚀 ~ AuthService ~ signUp ~ userExists:`, userExists);

    if (userExists) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prismaService.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        user_type: 'BUYER',
        phone,
      },
    });
    const token = jwt.sign({ name, id: user.id }, process.env.JSON_TOKEN_KEY, {
      expiresIn: '1d',
    });
    return { token, user };
  }

  async signIn({ email, password }: SignInParams) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new ConflictException('User does not exists');
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const token = jwt.sign(
      { name: user.name, id: user.id },
      process.env.JSON_TOKEN_KEY,
      {
        expiresIn: '1d',
      },
    );

    return { token, user };
  }
}
