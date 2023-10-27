import { ApiProperty } from '@nestjs/swagger'

export class AuthenticateDto {
  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  email?: string

  @ApiProperty({ description: 'User password', example: 'password123' })
  password?: string
}
