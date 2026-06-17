import { Role } from '@prisma/client';

export interface AccessTokenPayload {
  userId: string;
  role: Role;
  // For SECRETARY: their dairyId. For SUPERVISOR: their regionId.
  // For USER (farmer): their farmerId. Lets middleware scope queries
  // without an extra DB round trip on every request.
  scopeId: string | null;
}

export interface RefreshTokenPayload {
  userId: string;
  tokenVersion: string;
}
