import CryptoJS from 'crypto-js';

const VAULT_VERIFY_PHRASE = 'ROKKA_VAULT_OK';

export function encrypt(data: string, key: string): string {
  return CryptoJS.AES.encrypt(data, key).toString();
}

export function decrypt(ciphertext: string, key: string): string {
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export function isEncrypted(data: string): boolean {
  return data.startsWith('U2FsdGVkX1');
}

export function createVerifier(key: string): string {
  return encrypt(VAULT_VERIFY_PHRASE, key);
}

export function checkVerifier(verifier: string, key: string): boolean {
  try {
    return decrypt(verifier, key) === VAULT_VERIFY_PHRASE;
  } catch {
    return false;
  }
}
