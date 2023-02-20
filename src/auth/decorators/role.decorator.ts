import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces/active-roles.interface';

export const META_DATA_ROLES = 'roles';

export const Role = (...roles: ValidRoles[]) => SetMetadata(META_DATA_ROLES, roles);