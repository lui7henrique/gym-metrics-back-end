import { HttpException, HttpStatus } from '@nestjs/common'

export class DuplicateEmailException extends HttpException {
  constructor() {
    super(
      'A user with the provided email address already exists. Please use a different email.',
      HttpStatus.CONFLICT,
    )
  }
}
