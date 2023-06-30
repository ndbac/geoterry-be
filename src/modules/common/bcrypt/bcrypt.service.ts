import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import config from 'config';

@Injectable()
export class BcryptService {
  async hash(rawText: string) {
    const salt = await bcrypt.genSalt(
      config.get<number>('bcrypt.saltRoundQuantity'),
    );
    const hashedText = await bcrypt.hash(rawText, salt);
    return hashedText;
  }

  async compare(rawText: string, hashedText: string) {
    return await bcrypt.compare(rawText, hashedText);
  }
}
