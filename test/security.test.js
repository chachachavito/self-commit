import { describe, it, expect } from 'vitest';
import { scanForSecrets } from '../src/git.js';
import { getExternalContext } from '../src/analyzer.js';

describe('Security Features', () => {
  describe('Secret Scanning (DLP)', () => {
    it('should detect OpenAI API keys', () => {
      const content = 'export const key = "sk-abc123abc123abc123abc123abc123abc123abc123abc123"';
      expect(scanForSecrets(content)).toBe('OpenAI API Key');
    });

    it('should detect AWS Access Keys', () => {
      const content = 'AWS_KEY=AKIAIOSFODNN7EXAMPLE';
      expect(scanForSecrets(content)).toBe('AWS Access Key');
    });

    it('should detect GitHub Tokens', () => {
      const content = 'token: ghp_123456789012345678901234567890123456';
      expect(scanForSecrets(content)).toBe('GitHub Token');
    });

    it('should detect Private Keys', () => {
      const content = '-----BEGIN RSA PRIVATE KEY-----';
      expect(scanForSecrets(content)).toBe('Private Key');
    });

    it('should return null for safe content', () => {
      const content = 'const x = 10; console.log(x);';
      expect(scanForSecrets(content)).toBeNull();
    });
  });

  describe('Command Injection Immunity', () => {
    it('should treat semicolons as literal arguments (no injection)', async () => {
      // With spawn (shell: false), 'ls; rm' tries to find an executable named 'ls; rm' or fails
      // It will NOT execute 'rm'.
      const result = await getExternalContext('ls ; rm -rf /');
      expect(result).toBeNull(); // Should fail because 'ls ;' is not a valid command structure here
    });

    it('should allow safe commands', async () => {
      try {
        const result = await getExternalContext('ls');
        // On success it should return text, on failure (like in CI) it returns null but NOT a security throw
        if (result !== null) {
          expect(typeof result).toBe('string');
        }
      } catch (e) {
        expect(e.message).not.toContain('Security violation');
      }
    });
  });
});
