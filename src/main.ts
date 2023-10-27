import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { Env } from './env'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false,
  })

  const config = new DocumentBuilder()
    .setTitle('Gym API')
    .setDescription('Gym API description')
    .setVersion('1.0')
    .addTag('Gym')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  const configService: ConfigService<Env, true> = app.get(ConfigService)

  const port = configService.get('PORT', { infer: true })

  await app.listen(port)
}
bootstrap()
