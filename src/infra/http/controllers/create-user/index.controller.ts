import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common'

import { hash } from 'bcryptjs'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { CreateUserBodySchema, createUserBodySchema } from './schema'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { DuplicateEmailException } from '@/core/errors/duplicated-email-exception'
import { CreateUserDto } from '@/core/dto/create-user-dto'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

@Controller('/user')
@ApiTags('User')
export class CreateUserController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createUserBodySchema))
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 409, description: 'Email address is already in use' })
  @ApiBadRequestResponse({ description: 'Invalid request data' })
  async handle(@Body() body: CreateUserBodySchema) {
    const { name, email, password } = body

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userWithSameEmail) {
      throw new DuplicateEmailException()
    }

    const hashedPassword = await hash(password, 8)

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return user
  }
}
