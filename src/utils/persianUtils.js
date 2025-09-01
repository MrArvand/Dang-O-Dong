// Custom Persian number formatting functions

// Convert English digits to Persian digits
const toPersianDigits = (str) => {
  if (!str) return '';
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.toString().replace(/\d/g, (d) => persianDigits[d]);
};

// Convert Persian digits to English digits
const toEnglishDigits = (str) => {
  if (!str) return '';
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.toString().replace(/[۰-۹]/g, (d) => persianDigits.indexOf(d));
};

// Add commas for thousand separators
export const addCommas = (number) => {
  const numStr = Math.floor(number).toString();
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Remove commas from number
export const removeCommas = (str) => {
  if (!str) return '';
  return str.toString().replace(/,/g, '');
};

// Format number with Persian commas (integer only)
export const formatPersianNumber = (number) => {
  if (typeof number !== 'number' || isNaN(number)) return '۰';
  // Floor to integer
  const integer = Math.floor(number);
  const withCommas = addCommas(integer);
  return toPersianDigits(withCommas);
};

// Remove commas from Persian number and convert to number
export const unformatPersianNumber = (text) => {
  if (!text || text === '') return 0;
  try {
    const englishText = toEnglishDigits(text.toString());
    const cleaned = removeCommas(englishText);
    const number = parseInt(cleaned);
    return isNaN(number) ? 0 : number;
  } catch (error) {
    console.error('Error in unformatPersianNumber:', error);
    return 0;
  }
};

// Format input value for display (with Persian digits, integer only)
export const formatInputValue = (value) => {
  if (!value || value === '') return '';

  try {
    const englishText = toEnglishDigits(value.toString());
    const cleaned = removeCommas(englishText);
    const number = parseInt(cleaned);
    if (isNaN(number)) return value;
    return toPersianDigits(number.toString());
  } catch (error) {
    console.error('Error in formatInputValue:', error);
    return value;
  }
};

// Convert number to Persian words
export const numberToWords = (number) => {
  const integer = Math.floor(number);
  if (integer === 0) return 'صفر';

  const ones = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'];
  const tens = ['', 'ده', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
  const hundreds = ['', 'صد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'];
  const scales = ['', 'هزار', 'میلیون', 'میلیارد', 'تریلیون'];

  const convertLessThanOneThousand = (num) => {
    if (num === 0) return '';

    if (num < 10) return ones[num];
    if (num < 20) {
      if (num === 11) return 'یازده';
      if (num === 12) return 'دوازده';
      if (num === 13) return 'سیزده';
      if (num === 14) return 'چهارده';
      if (num === 15) return 'پانزده';
      if (num === 16) return 'شانزده';
      if (num === 17) return 'هفده';
      if (num === 18) return 'هجده';
      if (num === 19) return 'نوزده';
    }
    if (num < 100) {
      const ten = Math.floor(num / 10);
      const one = num % 10;
      return tens[ten] + (one > 0 ? ' و ' + ones[one] : '');
    }
    if (num < 1000) {
      const hundred = Math.floor(num / 100);
      const remainder = num % 100;
      return hundreds[hundred] + (remainder > 0 ? ' و ' + convertLessThanOneThousand(remainder) : '');
    }
  };

  const convert = (num) => {
    if (num === 0) return 'صفر';

    let result = '';
    let scaleIndex = 0;

    while (num > 0) {
      const chunk = num % 1000;
      if (chunk !== 0) {
        const chunkWords = convertLessThanOneThousand(chunk);
        if (scaleIndex > 0) {
          result = chunkWords + ' ' + scales[scaleIndex] + (result ? ' و ' + result : '');
        } else {
          result = chunkWords;
        }
      }
      num = Math.floor(num / 1000);
      scaleIndex++;
    }

    return result;
  };

  return convert(integer);
};

// Convert number to Persian words
export const numberToPersianWords = (number) => {
  return numberToWords(number);
};

// Format currency display (integer only)
export const formatCurrency = (amount) => {
  return `${formatPersianNumber(amount)} تومان`;
};

// Format currency with words (integer only)
export const formatCurrencyWithWords = (amount) => {
  return `${formatPersianNumber(amount)} تومان (${numberToPersianWords(amount)})`;
};
