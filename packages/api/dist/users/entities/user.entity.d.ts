import { UserRole, UserStatus } from '@nexus/shared';
export declare class UserEntity {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    avatar?: string;
    phone?: string;
    createdAt: Date;
    updatedAt: Date;
    lastLogin?: Date;
    constructor(partial: Partial<UserEntity>);
}
