import { AppModule } from '@/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'

describe('Me (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let accessToken: string

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = module.createNestApplication()

    prisma = module.get(PrismaService)

    await app.init()

    await request(app.getHttpServer()).post('/accounts').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const { body } = await request(app.getHttpServer()).post('/sessions').send({
      email: 'johndoe@example.com',
      password: '123456',
    })

    accessToken = body.access_token
  })

  test('[GET] /me (returns the current user)', async () => {
    const { statusCode, body } = await request(app.getHttpServer())
      .get('/me')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(statusCode).toBe(200)

    expect(body.name).toBe('John Doe')
    expect(body.email).toBe('johndoe@example.com')
  })
})
