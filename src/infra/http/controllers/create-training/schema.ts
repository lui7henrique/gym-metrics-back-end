import { z } from 'zod'

const exerciseSchema = z.object({
  name: z.string(),
})

const daySchema = z.object({
  name: z.string(),
  exercises: z.array(exerciseSchema),
})

export const createTrainingBodySchema = z.object({
  name: z.string(),
  days: z.array(daySchema),
})

export type CreateTrainingBodySchema = z.infer<typeof createTrainingBodySchema>
