export const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(value || 0));

export const formatDateTime = (value) =>
  new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));

export const formatDate = (value) => new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(value));