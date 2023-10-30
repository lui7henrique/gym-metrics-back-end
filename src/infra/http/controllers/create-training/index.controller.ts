import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { CreateTrainingBodySchema, createTrainingBodySchema } from './schema'
import { CreateTrainingDto } from '@/core/dto/create-training-dto'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { UserNotFoundException } from '@/core/errors/user-not-found-exception'
import { TrainingNotFoundException } from '@/core/errors/training-not-found-exception'

@Controller('/trainings')
@ApiTags('Trainings')
export class CreateTrainingController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new training' })
  @ApiBody({ type: CreateTrainingDto })
  @ApiResponse({ status: 201, description: 'Training created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid request data' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async handle(
    @Body() body: CreateTrainingBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { sub } = user

    const userData = await this.prisma.user.findUnique({
      where: {
        id: sub,
      },
    })

    if (!userData) {
      throw new UserNotFoundException()
    }

    if (!userData) {
      return 'User not found'
    }

    const { name, days } = body

    const training = await this.prisma.training.create({
      data: {
        name,
        userId: userData.id,
        days: {
          create: days.map((day) => ({
            name: day.name,
            exercises: {
              create: day.exercises.map((exercise) => ({
                name: exercise.name,
              })),
            },
          })),
        },
      },
    })

    return { training }
  }
}
