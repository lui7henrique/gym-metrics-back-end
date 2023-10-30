import { User as PrismaUser, Prisma } from '@prisma/client'
import { User } from '@/domain/forum/enterprise/entities/user'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        email: raw.email,
        name: raw.name,
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(account: User): Prisma.UserUncheckedCreateInput {
    return {
      id: account.id.toString(),
      email: account.email,
      name: account.name,
      password: account.password,
    }
  }
}
