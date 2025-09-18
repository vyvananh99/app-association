export const formatNumber = (val) => {
  if (!val) return '';
  return Number(val).toLocaleString('en-US');
};

export const parseNumber = (val) => val.replace(/,/g, '');
