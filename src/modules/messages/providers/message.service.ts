import { Injectable } from '@nestjs/common';
import { MessageRepository } from '../messages.repository';

@Injectable()
export class MessageService {
  constructor(private readonly messageRepo: MessageRepository) {}
}
