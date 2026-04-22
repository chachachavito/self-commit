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

  describe('Command Injection Protection', () => {
    it('should block commands with semicolons', async () => {
      await expect(getExternalContext('ls; rm -rf /')).rejects.toThrow('Security violation');
    });

    it('should block commands with pipes', async () => {
      await expect(getExternalContext('ls | grep test')).rejects.toThrow('Security violation');
    });

    it('should block commands with backticks', async () => {
      await expect(getExternalContext('echo `whoami`')).rejects.toThrow('Security violation');
    });

    it('should block commands with subshells', async () => {
      await expect(getExternalContext('echo $(whoami)')).rejects.toThrow('Security violation');
    });

    it('should allow safe commands', async () => {
      // Note: This will try to run 'ls' in the test environment
      // We wrap it to avoid actual execution failure if 'ls' isn't there,
      // but the security check should pass.
      try {
        await getExternalContext('ls');
      } catch (e) {
        expect(e.message).not.toContain('Security violation');
      }
    });
  });
});
