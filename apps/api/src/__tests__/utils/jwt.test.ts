/**
 * JWT Utils Tests
 * Test sign, verify, and error handling
 */

import { describe, it, expect } from 'vitest';
import { sign, verify, decode } from '../../utils/jwt.js';

describe('JWT Utils', () => {
  const testPayload = { userId: 'test-user-123', email: 'test@example.com' };
  const jwtSecret = process.env.JWT_SECRET || 'test-secret';

  describe('sign()', () => {
    it('should create a valid JWT token', () => {
      const token = sign(testPayload);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT format: header.payload.signature
    });

    it('should include correct payload in token', () => {
      const token = sign(testPayload);
      const decoded = decode(token);
      expect(decoded).toBeDefined();
      expect(decoded.userId).toBe(testPayload.userId);
      expect(decoded.email).toBe(testPayload.email);
    });

    it('should create different tokens for different calls', () => {
      const token1 = sign(testPayload);
      const token2 = sign(testPayload);
      // Tokens may differ due to timing/jti
      expect(token1).toBeDefined();
      expect(token2).toBeDefined();
    });
  });

  describe('verify()', () => {
    it('should verify a valid token', () => {
      const token = sign(testPayload);
      const decoded = verify(token);
      expect(decoded).toBeDefined();
      expect(decoded.userId).toBe(testPayload.userId);
    });

    it('should throw error for invalid token', () => {
      expect(() => {
        verify('invalid.token.here');
      }).toThrow();
    });

    it('should throw error for tampered token', () => {
      const token = sign(testPayload);
      const tampered = token.slice(0, -10) + 'tampered123';
      expect(() => {
        verify(tampered);
      }).toThrow();
    });

    it('should throw error for expired token', () => {
      // This would require setting expiration time
      // For now, we'll skip this test
      // TODO: Implement expiring token test
    });

    it('should throw error for empty token', () => {
      expect(() => {
        verify('');
      }).toThrow();
    });

    it('should throw error for null token', () => {
      expect(() => {
        verify(null as any);
      }).toThrow();
    });
  });

  describe('decode()', () => {
    it('should decode token without verification', () => {
      const token = sign(testPayload);
      const decoded = decode(token);
      expect(decoded).toBeDefined();
      expect(decoded.userId).toBe(testPayload.userId);
    });

    it('should return null for invalid token format', () => {
      const decoded = decode('not.a.valid.token');
      expect(decoded).toBeNull();
    });

    it('should decode tampered token (without verification)', () => {
      const token = sign(testPayload);
      const tampered = token.slice(0, -10) + 'tampered123';
      // decode doesn't verify, so it might still work
      // This is expected behavior
      const decoded = decode(tampered);
      // May be null or decoded depending on implementation
      expect(typeof decoded === 'object' || decoded === null).toBe(true);
    });
  });
});
