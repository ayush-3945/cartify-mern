// Helper to dynamically update document title and meta description
export const setPageTitle = (title) => {
  const baseTitle = 'Cartify | Shop Anything';
  document.title = title ? `${title} | Cartify` : baseTitle;
};

export const setMetaDescription = (description) => {
  let meta = document.querySelector('meta[name="description"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'description';
    document.head.appendChild(meta);
  }
  meta.content = description || 'Shop premium smartphones, laptops, clothing, accessories and more on Cartify.';
};
