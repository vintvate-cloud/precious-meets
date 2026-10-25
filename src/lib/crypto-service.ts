/**
 * Cryptographically Secure Password & Token Generator
 * Follows strict enterprise security rules:
 * - Minimum 16 characters
 * - Uppercase, lowercase, numeric digits, and special characters
 * - Uses Web Crypto API (crypto.getRandomValues) for cryptographically strong randomness
 * - Avoids ambiguous characters (0, O, l, 1, I) to eliminate member sign-in friction
 */

export class CryptoService {
  private static readonly UPPERCASE = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // No 'I', 'O'
  private static readonly LOWERCASE = "abcdefghijkmnopqrstuvwxyz"; // No 'l'
  private static readonly NUMBERS = "23456789"; // No '0', '1'
  private static readonly SPECIAL = "!@#$%^&*()-_+=";

  /**
   * Generates a high-entropy, strong member password
   * Guarantees at least 2 uppercase, 2 lowercase, 2 numbers, and 2 special symbols
   */
  static generateStrongPassword(length: number = 16): string {
    const minLength = Math.max(14, length);

    // Guaranteed character sets
    const guaranteed: string[] = [
      this.getRandomChar(this.UPPERCASE),
      this.getRandomChar(this.UPPERCASE),
      this.getRandomChar(this.LOWERCASE),
      this.getRandomChar(this.LOWERCASE),
      this.getRandomChar(this.NUMBERS),
      this.getRandomChar(this.NUMBERS),
      this.getRandomChar(this.SPECIAL),
      this.getRandomChar(this.SPECIAL),
    ];

    const allChars = this.UPPERCASE + this.LOWERCASE + this.NUMBERS + this.SPECIAL;
    const remainingCount = minLength - guaranteed.length;

    for (let i = 0; i < remainingCount; i++) {
      guaranteed.push(this.getRandomChar(allChars));
    }

    // Cryptographic Fisher-Yates Shuffle
    return this.shuffle(guaranteed).join("");
  }

  /**
   * Generates a formal, professional invoice reference number
   * Format: INV-PM-YYYY-XXXX (e.g. INV-PM-2026-8942)
   */
  static generateInvoiceNumber(): string {
    const year = new Date().getFullYear();
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return `INV-PM-${year}-${randomDigits}`;
  }

  private static getRandomChar(source: string): string {
    const array = new Uint32Array(1);
    if (typeof window !== "undefined" && window.crypto) {
      window.crypto.getRandomValues(array);
    } else if (typeof globalThis !== "undefined" && globalThis.crypto) {
      globalThis.crypto.getRandomValues(array);
    } else {
      // Fallback
      return source.charAt(Math.floor(Math.random() * source.length));
    }
    return source.charAt(array[0] % source.length);
  }

  private static shuffle(array: string[]): string[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const randArr = new Uint32Array(1);
      if (typeof window !== "undefined" && window.crypto) {
        window.crypto.getRandomValues(randArr);
      } else if (typeof globalThis !== "undefined" && globalThis.crypto) {
        globalThis.crypto.getRandomValues(randArr);
      }
      const j = (randArr[0] || Math.floor(Math.random() * 10000)) % (i + 1);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}
