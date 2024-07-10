export function calculateMonthlyPayments(
  totalLoan: number,
  months: number,
): number {
  return totalLoan / months;
}
