import { ApiProperty } from '@nestjs/swagger'
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
} from 'class-validator'

export class CreateAccountDto {
  @ApiProperty({ description: 'Name of the user', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name?: string

  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@example.com',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email?: string

  @ApiProperty({ description: 'User password', example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password?: string
}
