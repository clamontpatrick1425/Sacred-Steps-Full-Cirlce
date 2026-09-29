/**
 * Local-First End-to-End Encryption Utility
 * Uses Web Crypto API (SubtleCrypto) with AES-GCM 256-bit and PBKDF2 key derivation.
 */

// Helper to convert ArrayBuffer to Base64
function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Helper to convert Base64 to ArrayBuffer
function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// Derive AES-GCM key from user passphrase and salt using PBKDF2
async function getKeyFromPassphrase(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export interface EncryptedPayload {
  ciphertext: string;
  iv: string;
  salt: string;
  authVerification?: string; // SHA-256 hash to test PIN validity quickly
}

/**
 * Encrypt plaintext using user's private PIN/passphrase
 */
export async function encryptJournalEntry(plainText: string, passphrase: string): Promise<EncryptedPayload> {
  const enc = new TextEncoder();
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await getKeyFromPassphrase(passphrase, salt);

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv as BufferSource,
    },
    key,
    enc.encode(plainText)
  );

  // Generate a verification hash to validate PIN without leaking content
  const verifyData = await window.crypto.subtle.digest(
    'SHA-256',
    enc.encode(passphrase + bufferToBase64(salt.buffer))
  );

  return {
    ciphertext: bufferToBase64(encryptedBuffer),
    iv: bufferToBase64(iv.buffer),
    salt: bufferToBase64(salt.buffer),
    authVerification: bufferToBase64(verifyData),
  };
}

/**
 * Decrypt ciphertext using user's private PIN/passphrase
 */
export async function decryptJournalEntry(payload: EncryptedPayload, passphrase: string): Promise<string> {
  try {
    const salt = new Uint8Array(base64ToBuffer(payload.salt));
    const iv = new Uint8Array(base64ToBuffer(payload.iv));
    const ciphertext = base64ToBuffer(payload.ciphertext);

    const key = await getKeyFromPassphrase(passphrase, salt);
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv as BufferSource,
      },
      key,
      ciphertext
    );

    const dec = new TextDecoder();
    return dec.decode(decryptedBuffer);
  } catch (err) {
    throw new Error('Incorrect passphrase or corrupted encrypted record.');
  }
}

/**
 * Validate if a passphrase matches a stored verification hash
 */
export async function verifyPassphrase(passphrase: string, saltBase64: string, expectedVerification: string): Promise<boolean> {
  try {
    const enc = new TextEncoder();
    const verifyData = await window.crypto.subtle.digest(
      'SHA-256',
      enc.encode(passphrase + saltBase64)
    );
    const hash = bufferToBase64(verifyData);
    return hash === expectedVerification;
  } catch {
    return false;
  }
}
