import { randomBytes } from 'crypto';

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // hanya huruf, angka, spasi, strip
    .replace(/[\s-]+/g, '-') // ganti spasi/strip beruntun jadi satu strip
    .replace(/^-+|-+$/g, ''); // hapus strip di awal/akhir
};

export function generateRandomId(length = 12): string {
  return randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .substring(0, length);
}
