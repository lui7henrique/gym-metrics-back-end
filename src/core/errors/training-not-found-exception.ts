import { HttpException, HttpStatus } from '@nestjs/common'

export class TrainingNotFoundException extends HttpException {
  constructor() {
    super('Training not found', HttpStatus.NOT_FOUND)
  }
}
