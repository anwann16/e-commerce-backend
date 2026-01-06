export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // hanya huruf, angka, spasi, strip
    .replace(/[\s-]+/g, '-') // ganti spasi/strip beruntun jadi satu strip
    .replace(/^-+|-+$/g, ''); // hapus strip di awal/akhir
};
