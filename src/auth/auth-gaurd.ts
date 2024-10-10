import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGaurd implements CanActivate {
  // Load thses values from vault or secrets or config
  private readonly validUsername = 'admin';
  private readonly validPassword = 'password';

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Missing Authorization header.');
    }

    const [type, credentials] = authHeader.split(' ');

    if (type !== 'Basic' || !credentials) {
      throw new UnauthorizedException('Invalid Authorization format.');
    }

    // Decode Base64 credentials
    const decodedCredentials = Buffer.from(credentials, 'base64').toString(
      'ascii',
    );
    const [username, password] = decodedCredentials.split(':');

    // Validate credentials
    if (username !== this.validUsername || password !== this.validPassword) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    return true;
  }
}
