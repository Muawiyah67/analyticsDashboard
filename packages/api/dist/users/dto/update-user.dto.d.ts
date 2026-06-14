import { UserRole, UserStatus } from '@nexus/shared';
export declare class UpdateUserDto {
    name?: string;
    email?: string;
    role?: UserRole;
    status?: UserStatus;
}
