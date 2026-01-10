import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class N8nAuthGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const token = req.headers.authorization?.replace('Bearer ', '');

    return token === process.env.N8N_SECRET;
  }
}
