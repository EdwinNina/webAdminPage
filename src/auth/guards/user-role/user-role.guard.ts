import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_DATA_ROLES } from 'src/auth/decorators/role.decorator';
import { User } from 'src/auth/entities/user.entity';
import { ValidRoles } from 'src/auth/interfaces/active-roles.interface';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private reflector: Reflector
  ){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const roles: string[] = this.reflector.get<ValidRoles[]>(META_DATA_ROLES, context.getHandler())

    if(!roles) return true
    if(roles.length === 0) return true

    const request = context.switchToHttp().getRequest()

    const user: User = request.user;

    if(!user) throw new NotFoundException("User not found in request");

    for(const role of user.roles){
      if(roles.includes(role.name)){
        return true;
      }
    }

    throw new UnauthorizedException(`User ${user.username} you need the ${roles} role`);
  }
}
