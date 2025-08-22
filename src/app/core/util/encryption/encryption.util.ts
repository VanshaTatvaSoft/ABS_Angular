import CryptoJS from 'crypto-js';

const SECRET_KEY = '7eT3NpQ8kFg64Lm9rWvYzXc2tBh0AuEq'; // 32 characters
const IV = CryptoJS.enc.Utf8.parse('m9Z4sX1pLq0vHd8e');       // 16 characters

export class EncryptionUtil {
  static encrypt(data: any): string {
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      CryptoJS.enc.Utf8.parse(SECRET_KEY),
      {
        iv: IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    return encrypted.toString();
  }

  static decrypt(cipherText: string): any {
    const bytes = CryptoJS.AES.decrypt(
      cipherText,
      CryptoJS.enc.Utf8.parse(SECRET_KEY),
      {
        iv: IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  }
}
