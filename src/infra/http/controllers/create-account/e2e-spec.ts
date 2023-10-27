import { AppModule } from '@/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CreateAccountBodySchema } from './schema'

describe('Create Account (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /accounts (creates a new user)', async () => {
    const { statusCode } = await request(app.getHttpServer())
      .post('/accounts')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      })

    expect(statusCode).toBe(201)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: 'johndoe@example.com',
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })

  test('[POST] /accounts (fails to create a duplicate user)', async () => {
    const userData: CreateAccountBodySchema = {
      name: 'Jane Smith',
      email: 'janesmith@example.com',
      password: '654321',
    }

    await request(app.getHttpServer()).post('/accounts').send(userData)

    const { status } = await request(app.getHttpServer())
      .post('/accounts')
      .send(userData)

    expect(status).toBe(HttpStatus.CONFLICT)
  })
})
