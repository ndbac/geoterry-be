import { BadRequestException, Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import config from 'config';

@Injectable()
export class JwtService {
  private JWT_DATA = {
    secret: config.get<string>('jsonwebtoken.secretKey'),
    subject: config.get<string>('jsonwebtoken.subject'),
    audience: config.get<string>('jsonwebtoken.audience'),
  };

  signToken(data: any) {
    return jwt.sign({ data }, this.JWT_DATA.secret, {
      expiresIn: config.get<string>('jsonwebtoken.expiresIn'),
      subject: this.JWT_DATA.subject,
      audience: this.JWT_DATA.audience,
    });
  }

  verifyToken(token: string, options?: { ignoreError?: boolean }) {
    try {
      return jwt.verify(token, this.JWT_DATA.secret, {
        subject: this.JWT_DATA.subject,
        audience: this.JWT_DATA.audience,
      });
    } catch (error) {
      if (!options?.ignoreError)
        throw new BadRequestException({
          message: 'Invalid token',
          sentryAlertDisabled: true,
        });
    }
  }
}
