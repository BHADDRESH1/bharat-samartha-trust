// utils/numberFormat.js

// Format number in Indian numbering system (lakhs, crores)
export function formatIndianNumber(num) {
    const numStr = num.toString();
    let result = '';
    
    // For numbers less than 1000, no formatting needed
    if (numStr.length <= 3) {
      return numStr;
    }
    
    // Add commas for Indian number system
    // First, the last 3 digits
    result = numStr.substring(numStr.length - 3);
    
    // Then handle remaining digits in groups of 2
    let remaining = numStr.substring(0, numStr.length - 3);
    while (remaining.length > 0) {
      const group = remaining.substring(Math.max(0, remaining.length - 2));
      remaining = remaining.substring(0, Math.max(0, remaining.length - 2));
      result = group + (result ? ',' + result : result);
    }
    
    return result;
  }
  
  // Format number in Western numbering system (thousands, millions)
  export function formatWesternNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  // Use either of the above based on your preference
  export const formatNumber = formatWesternNumber; // or formatIndianNumber