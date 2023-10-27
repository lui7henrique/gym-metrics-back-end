import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { CreateAccountController } from './controllers/create-account/index.controller'
import { AuthenticateController } from './controllers/authenticate/index.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [CreateAccountController, AuthenticateController],
})
export class HttpModule {}
