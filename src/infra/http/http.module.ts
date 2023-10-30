import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { CreateUserController } from './controllers/create-user/index.controller'
import { AuthenticateController } from './controllers/authenticate/index.controller'
import { CreateTrainingController } from './controllers/create-training/index.controller'
import { MeController } from './controllers/me/index.controller'
import { DeleteTrainingController } from './controllers/delete-training/index.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateUserController,
    AuthenticateController,
    CreateTrainingController,
    DeleteTrainingController,
    MeController,
  ],
})
export class HttpModule {}
