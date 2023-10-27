import { AppModule } from '@/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Authenticate (E2E)', () => {
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

  beforeEach(async () => {
    await prisma.user.deleteMany()
  })

  test('[POST] /sessions (successful authentication)', async () => {
    const hashedPassword = await hash('123456', 8)
    await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: hashedPassword,
      },
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })

  test('[POST] /sessions (authentication with non-existent email)', async () => {
    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'nonexistent@example.com',
      password: '123456',
    })

    expect(response.statusCode).toBe(401)
    expect(response.body.message).toBe('User credentials do not match')
  })

  test('[POST] /sessions (authentication with incorrect password)', async () => {
    const hashedPassword = await hash('123456', 8)
    await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: hashedPassword,
      },
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'johndoe@example.com',
      password: 'incorrect_password',
    })

    expect(response.statusCode).toBe(401)
    expect(response.body.message).toBe('User credentials do not match')
  })
})
