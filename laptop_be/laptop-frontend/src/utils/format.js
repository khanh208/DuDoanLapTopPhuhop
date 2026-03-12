export function formatCurrency(value) {
  if (value === null || value === undefined || value === '') return '—';
  return Number(value).toLocaleString('vi-VN') + ' đ';
}

export function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('vi-VN');
}
