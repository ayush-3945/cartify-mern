// Input sanitizer for search queries and form inputs
export const sanitizeInput = (input = '') => {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '')
    .slice(0, 200);
};
