import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { Controller, Get, UseGuards } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { UserNotFoundException } from '@/core/errors/user-not-found-exception'

@Controller('/me')
@ApiTags('User')
export class MeController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user information' })
  @ApiResponse({ status: 200, description: 'Returns user information' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
  async getMe(@CurrentUser() user: UserPayload) {
    const { sub } = user

    const userData = await this.prisma.user.findUnique({
      where: {
        id: sub,
      },
    })

    if (!userData) {
      throw new UserNotFoundException()
    }

    return userData
  }
}
