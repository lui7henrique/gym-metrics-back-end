import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common'

import { hash } from 'bcryptjs'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { CreateAccountBodySchema, createAccountBodySchema } from './schema'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { DuplicateEmailException } from '@/core/errors/duplicated-email-exception'
import { CreateAccountDto } from '@/core/dto/create-account-dto'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger'

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  @ApiOperation({ summary: 'Create a new user account' })
  @ApiBody({ type: CreateAccountDto })
  @ApiResponse({ status: 201, description: 'Account created successfully' })
  @ApiResponse({ status: 409, description: 'Email address is already in use' })
  @ApiBadRequestResponse({ description: 'Invalid request data' })
  async handle(@Body() body: CreateAccountBodySchema) {
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
