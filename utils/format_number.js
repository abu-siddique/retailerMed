/**
 * Formats numbers for display in a distributor dashboard
 * - Adds thousand separators (commas)
 * - Handles decimals for pricing
 * - Safeguards against non-numeric inputs
 * @param {number|string} n - The number to format
 * @param {boolean} isCurrency - Whether to add ₹ prefix for currency
 * @returns {string} Formatted number string
 */
export default function formatNumber(n, isCurrency = false) {
  // Handle empty/undefined cases
  if (n === null || n === undefined || n === '') return ''
  
  // Convert to number if it's a string
  const num = typeof n === 'string' ? parseFloat(n.replace(/,/g, '')) : Number(n)
  
  // Return empty string if conversion fails
  if (isNaN(num)) return ''

  // Format with commas and optional decimal places
  const formatted = num.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: num % 1 !== 0 ? 2 : 0
  })

  return isCurrency ? `₹${formatted}` : formatted
}