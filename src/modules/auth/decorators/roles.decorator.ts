import { SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "src/common/enums/role.enum";

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);