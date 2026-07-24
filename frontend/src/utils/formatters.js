// Data Formatter Helpers for WFX ERP

export const formatCurrency = (val) => {
  if (val === undefined || val === null) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(val);
};

export const formatNumber = (val) => {
  if (val === undefined || val === null) return '0';
  return new Intl.NumberFormat('en-US').format(val);
};

export const formatPercent = (val) => {
  if (val === undefined || val === null) return '0%';
  return `${val}%`;
};

export const formatGSM = (val) => {
  if (!val) return 'N/A';
  return `${val} gsm`;
};
