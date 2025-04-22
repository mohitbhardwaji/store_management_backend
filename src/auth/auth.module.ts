import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({ secret: 'SECRET_KEY', signOptions: { expiresIn: '1h' } })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
