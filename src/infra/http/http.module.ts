import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { CreateAccountController } from './controllers/create-account/index.controller'
import { AuthenticateController } from './controllers/authenticate/index.controller'
import { CreateTrainingController } from './controllers/create-training/index.controller'
import { MeController } from './controllers/me/index.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateTrainingController,
    MeController,
  ],
})
export class HttpModule {}
