import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ValidRoles } from '../interfaces/active-roles.interface';
import { Role } from './role.decorator';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';

export function Auth(...roles: ValidRoles[]) {
   return applyDecorators(
      Role(...roles),
      UseGuards(AuthGuard(), UserRoleGuard),
   );
}