import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  Param,
} from '@nestjs/common'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { CreateTrainingBodySchema, createTrainingBodySchema } from './schema'
import { CreateTrainingDto } from '@/core/dto/create-training-dto'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

@Controller('/users/:userId/trainings')
@ApiTags('Training')
export class CreateTrainingController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createTrainingBodySchema))
  @ApiOperation({ summary: 'Create a new training for a user' })
  @ApiBody({ type: CreateTrainingDto })
  @ApiResponse({ status: 201, description: 'Training created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid request data' })
  async handle(
    @Param('userId') userId: string,
    @Body() body: CreateTrainingBodySchema,
  ) {
    const { name, days } = body

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) {
      // Trate o caso em que o usuário não foi encontrado
      return 'User not found'
    }

    const training = await this.prisma.training.create({
      data: {
        name,
        userId,
        days: {
          createMany: {
            data: days.map((day) => ({
              name: day.name,
              exercises: {
                createMany: day.exercises.map((exercise) => ({
                  name: exercise.name,
                })),
              },
            })),
          },
        },
      },
    })

    return training
  }
}
