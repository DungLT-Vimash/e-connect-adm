import generator from 'generate-password';

export function createDate(days: number, months: number, years: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setMonth(date.getMonth() + months);
  date.setFullYear(date.getFullYear() + years);
  return date;
}

export const password = generator.generate({
  length: 10,
  numbers: true,
});
