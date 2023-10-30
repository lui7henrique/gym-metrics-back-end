import { z } from 'zod'

export const createUserBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

export type CreateUserBodySchema = z.infer<typeof createUserBodySchema>
