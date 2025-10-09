/**
 * Removes diacritics (accent marks) from a string
 * @param str The string with diacritics
 * @returns The string without diacritics
 */
export function removeDiacritics(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}