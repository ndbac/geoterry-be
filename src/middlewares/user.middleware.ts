import { Injectable, NestMiddleware } from '@nestjs/common';
import { isAfter, sub } from 'date-fns';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { AccountRepository } from 'src/modules/account/accounts.repository';
import { JwtService } from 'src/modules/common/jsonwebtoken/jwt.service';
import { getBearerTokenFromRequest } from 'src/shared/helpers';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(
    private readonly accountRepo: AccountRepository,
    private readonly jwtService: JwtService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const bearerToken = getBearerTokenFromRequest(req);
    const tokenData = this.jwtService.verifyToken(bearerToken || '', {
      ignoreError: true,
    }) as JwtPayload;
    if (tokenData?.data) {
      const account = await this.accountRepo.findByIdOrFail(tokenData.data?.id);
      if (
        isAfter(
          (tokenData.iat || 0) * 1000,
          sub(account.credentials.passwordChangedAt, { minutes: 1 }),
        )
      ) {
        req['user'] = {
          namespace: account.namespace,
          userId: account.id,
          identifier: account.identifier,
          identifierType: account.identifierType,
          role: account.role,
        };
      }
    }

    next();
  }
}
