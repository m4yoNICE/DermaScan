export function formatPriceRange(price) {
  if (!price) return null;
  const parts = price.split("-");
  if (parts.length === 2) {
    const low = Number(parts[0]).toLocaleString();
    const high = Number(parts[1]).toLocaleString();
    return `₱${low} - ₱${high}`;
  }
  return `₱${price}`;
}