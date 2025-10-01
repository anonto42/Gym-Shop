import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports:[
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || "secretKey",
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || "10d" },
    }),
    TypeOrmModule.forFeature([
      User
    ])
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
