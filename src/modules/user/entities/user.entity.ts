import { User } from '@prisma/client';

export const UserOmittedKeys = ['createdAt', 'updatedAt'] as const;
type UserKeysUnion = (typeof UserOmittedKeys)[number];

export type UserEntity = Omit<User, UserKeysUnion>;
