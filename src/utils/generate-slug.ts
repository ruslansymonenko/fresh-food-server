export const generateSlug = (...args: string[]): string => {
  const value = args.join(' ');

  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0400-\u04FF ]/g, '')
    .replace(/\s+/g, '-');
};
