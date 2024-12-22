import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AnonymousUserGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authorization = request.headers.authorization;
        const token = authorization?.split(' ')[1];
        if (!token) {
            request.user = null;
            return true;
        }

        try {
            const tokenPayload = await this.jwtService.verifyAsync(token);

            request.user = {
                userId: tokenPayload.userId,
                email: tokenPayload.email,
            };
            return true;
        } catch (e) {
            console.log(e);
            throw new UnauthorizedException('Invalid Token');
        }
    }
}
