import CryptoJS from 'crypto-js';

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
