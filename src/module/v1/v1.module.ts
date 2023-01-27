import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { V1Controller } from './v1.controller';

@Module({
  imports: [UserModule],
  providers: [],
  controllers: [V1Controller],
})
export class V1Module {}
