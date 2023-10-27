import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { compare } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'

import { AuthenticateBodySchema, authenticateBodySchema } from './schema'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AuthenticateDto } from '@/core/dto/authenticate-dto'

@Controller('/sessions')
@ApiTags('Authentication')
export class AuthenticateController {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  @ApiBody({ type: AuthenticateDto })
  @ApiResponse({ status: 201, description: 'Successful authentication' })
  @ApiResponse({ status: 401, description: 'User credentials do not match' })
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      throw new UnauthorizedException('User credentials do not match')
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('User credentials do not match')
    }

    const accessToken = this.jwt.sign({ sub: user.id })

    return { access_token: accessToken }
  }
}
