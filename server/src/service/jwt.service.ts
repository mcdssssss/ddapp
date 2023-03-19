import { Provide } from '@midwayjs/decorator';
import { BaseService } from './base.service';
import { sign, verify } from 'jsonwebtoken';
import { LoginError } from '../error/login.error';
interface VerifyResult {
  isExpried?: boolean;
  userId?: number;
  ip?: string;
  userNo?: string;
}

@Provide()
export class JWTService extends BaseService {
  sign(data: string | object | Buffer, expiresIn?: string) {
    const token = sign(data, this.config().jwt.privateKey, {
      expiresIn: expiresIn || this.config().jwt.expiresIn,
    });
    return token;
  }
  async verify(token: string): Promise<VerifyResult> {
    return new Promise(resolve => {
      verify(token, this.config().jwt.privateKey, (err, decoded) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            resolve({ isExpried: true });
          } else {
            throw new LoginError(err.message);
          }
          // console.log(err);
        }
        resolve(decoded as any);
      });
    });
  }
}
