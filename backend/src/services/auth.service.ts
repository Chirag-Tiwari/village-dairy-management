import crypto from 'crypto';
import { userRepository } from '../repositories/user.repository';
import { comparePassword, hashPassword } from '../utils/password.util';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.util';
import { AppError } from '../utils/appError';
import { AccessTokenPayload } from '../types/auth.types';
import { LoginInput } from '../validators/auth.validator';

// Resolves the "scopeId" embedded in the access token: the one ID that
// every downstream query needs to filter by for this user's role.
function resolveScopeId(user: NonNullable<Awaited<ReturnType<typeof userRepository.findByMobile>>>): string | null {
  if (user.role === 'USER') return user.farmer?.id ?? null;
  if (user.role === 'SECRETARY') return user.staff?.managedDairy?.id ?? null;
  if (user.role === 'SUPERVISOR') return user.staff?.managedRegion?.id ?? null;
  return null;
}

// Refresh tokens are stored hashed (never plaintext) so a DB leak doesn't
// hand out usable tokens.
function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export const authService = {
  async login(input: LoginInput) {
    const user = await userRepository.findByMobile(input.mobileNumber);
    if (!user || !user.isActive) {
      throw AppError.unauthorized('Invalid mobile number or password');
    }

    const passwordMatches = await comparePassword(input.password, user.passwordHash);
    if (!passwordMatches) {
      throw AppError.unauthorized('Invalid mobile number or password');
    }

    const scopeId = resolveScopeId(user);
    const accessPayload: AccessTokenPayload = { userId: user.id, role: user.role, scopeId };

    const accessToken = signAccessToken(accessPayload);
    const refreshToken = signRefreshToken({ userId: user.id, tokenVersion: crypto.randomUUID() });

    await userRepository.setRefreshTokenHash(user.id, hashToken(refreshToken));

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        mobileNumber: user.mobileNumber,
        role: user.role,
        name: user.farmer?.name ?? user.staff?.name ?? '',
        scopeId,
      },
    };
  },

  async refresh(refreshToken: string) {
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      throw AppError.unauthorized('Refresh token is invalid or expired');
    }

    const user = await userRepository.findById(decoded.userId);
    if (!user || !user.isActive || !user.refreshTokenHash) {
      throw AppError.unauthorized('Session no longer valid, please log in again');
    }

    if (user.refreshTokenHash !== hashToken(refreshToken)) {
      // Token reuse / mismatch: invalidate the session defensively.
      await userRepository.setRefreshTokenHash(user.id, null);
      throw AppError.unauthorized('Session no longer valid, please log in again');
    }

    const scopeId = resolveScopeId(user);
    const accessToken = signAccessToken({ userId: user.id, role: user.role, scopeId });
    const newRefreshToken = signRefreshToken({ userId: user.id, tokenVersion: crypto.randomUUID() });

    await userRepository.setRefreshTokenHash(user.id, hashToken(newRefreshToken));

    return { accessToken, refreshToken: newRefreshToken };
  },

  async logout(userId: string) {
    await userRepository.setRefreshTokenHash(userId, null);
  },

  hashPassword,
};
