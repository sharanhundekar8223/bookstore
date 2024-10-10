import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UrcGaurd implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const urc = request.headers['urc'];
    if (!urc) {
      throw new BadRequestException('URC (unique reference code) is required.');
    }
    return true;
  }
}
