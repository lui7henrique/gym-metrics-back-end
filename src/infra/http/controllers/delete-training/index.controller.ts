import { Controller, Delete, Param, UseGuards } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'

import { TrainingNotFoundException } from '@/core/errors/training-not-found-exception'

@Controller('/trainings')
@ApiTags('Trainings')
export class DeleteTrainingController {
  constructor(private prisma: PrismaService) {}

  @Delete('/:trainingId')
  @ApiOperation({ summary: 'Delete a training' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Training deleted successfully' })
  @ApiResponse({ status: 404, description: 'Training not found' })
  async deleteTraining(@Param('trainingId') trainingId: string) {
    const training = await this.prisma.training.findUnique({
      where: {
        id: trainingId,
      },
      include: {
        days: {
          include: {
            exercises: true,
          },
        },
      },
    })

    if (!training) {
      throw new TrainingNotFoundException()
    }

    training.days.forEach(async (day) => {
      day.exercises.forEach(async (exercise) => {
        await this.prisma.exercise.delete({
          where: {
            id: exercise.id,
          },
        })
      })

      await this.prisma.day.delete({
        where: {
          id: day.id,
        },
      })
    })

    await this.prisma.training.delete({
      where: {
        id: trainingId,
      },
    })

    return 'Training deleted successfully'
  }
}
