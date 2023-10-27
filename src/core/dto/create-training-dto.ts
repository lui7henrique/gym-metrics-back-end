import { ApiProperty } from '@nestjs/swagger'

export class CreateExerciseDto {
  @ApiProperty({ description: 'Name of the exercise', example: 'Push-up' })
  name?: string
}

export class CreateTrainingDayDto {
  @ApiProperty({ description: 'Custom name for the day', example: 'Day 1' })
  name?: string

  @ApiProperty({
    type: [CreateExerciseDto],
    description: 'Exercises for the day',
  })
  exercises?: CreateExerciseDto[]
}

export class CreateTrainingDto {
  @ApiProperty({ description: 'Name of the training', example: 'My Workout' })
  name?: string

  @ApiProperty({
    type: [CreateTrainingDayDto],
    description: 'Days of the training',
  })
  days?: CreateTrainingDayDto[]
}
