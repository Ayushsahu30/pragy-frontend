/**
 * Country calling codes for the phone field. India first (most visitors),
 * then A to Z. Anyone whose country is missing can pick "Other" and type the
 * full number with its + code.
 */
export type Country = { iso: string; name: string; dial: string };

export const countries: Country[] = [
  { iso: "IN", name: "India", dial: "91" },
  { iso: "AF", name: "Afghanistan", dial: "93" },
  { iso: "AU", name: "Australia", dial: "61" },
  { iso: "AT", name: "Austria", dial: "43" },
  { iso: "BH", name: "Bahrain", dial: "973" },
  { iso: "BD", name: "Bangladesh", dial: "880" },
  { iso: "BE", name: "Belgium", dial: "32" },
  { iso: "BT", name: "Bhutan", dial: "975" },
  { iso: "BR", name: "Brazil", dial: "55" },
  { iso: "CA", name: "Canada", dial: "1" },
  { iso: "CN", name: "China", dial: "86" },
  { iso: "DK", name: "Denmark", dial: "45" },
  { iso: "EG", name: "Egypt", dial: "20" },
  { iso: "FR", name: "France", dial: "33" },
  { iso: "DE", name: "Germany", dial: "49" },
  { iso: "HK", name: "Hong Kong", dial: "852" },
  { iso: "ID", name: "Indonesia", dial: "62" },
  { iso: "IE", name: "Ireland", dial: "353" },
  { iso: "IL", name: "Israel", dial: "972" },
  { iso: "IT", name: "Italy", dial: "39" },
  { iso: "JP", name: "Japan", dial: "81" },
  { iso: "KE", name: "Kenya", dial: "254" },
  { iso: "KW", name: "Kuwait", dial: "965" },
  { iso: "MY", name: "Malaysia", dial: "60" },
  { iso: "MV", name: "Maldives", dial: "960" },
  { iso: "MU", name: "Mauritius", dial: "230" },
  { iso: "MX", name: "Mexico", dial: "52" },
  { iso: "NP", name: "Nepal", dial: "977" },
  { iso: "NL", name: "Netherlands", dial: "31" },
  { iso: "NZ", name: "New Zealand", dial: "64" },
  { iso: "NG", name: "Nigeria", dial: "234" },
  { iso: "NO", name: "Norway", dial: "47" },
  { iso: "OM", name: "Oman", dial: "968" },
  { iso: "PK", name: "Pakistan", dial: "92" },
  { iso: "PH", name: "Philippines", dial: "63" },
  { iso: "PL", name: "Poland", dial: "48" },
  { iso: "PT", name: "Portugal", dial: "351" },
  { iso: "QA", name: "Qatar", dial: "974" },
  { iso: "RU", name: "Russia", dial: "7" },
  { iso: "SA", name: "Saudi Arabia", dial: "966" },
  { iso: "SG", name: "Singapore", dial: "65" },
  { iso: "ZA", name: "South Africa", dial: "27" },
  { iso: "KR", name: "South Korea", dial: "82" },
  { iso: "ES", name: "Spain", dial: "34" },
  { iso: "LK", name: "Sri Lanka", dial: "94" },
  { iso: "SE", name: "Sweden", dial: "46" },
  { iso: "CH", name: "Switzerland", dial: "41" },
  { iso: "TH", name: "Thailand", dial: "66" },
  { iso: "TR", name: "Turkey", dial: "90" },
  { iso: "AE", name: "United Arab Emirates", dial: "971" },
  { iso: "GB", name: "United Kingdom", dial: "44" },
  { iso: "US", name: "United States", dial: "1" },
  { iso: "VN", name: "Vietnam", dial: "84" },
];

/** Value of the "Other" choice: the person types the full number with its + code. */
export const OTHER_COUNTRY = "other";

/**
 * Splits a saved number like "+919876543210" into a country and the rest,
 * to fill the form. +1 is shown as United States (Canada shares the code).
 */
export function splitPhone(phone: string | null): { country: string; local: string } {
  if (!phone) return { country: "IN", local: "" };
  if (!phone.startsWith("+")) return { country: OTHER_COUNTRY, local: phone };
  const digits = phone.slice(1);
  const match = countries
    .filter((c) => digits.startsWith(c.dial) && c.iso !== "CA")
    .sort((a, b) => b.dial.length - a.dial.length)[0];
  return match ? { country: match.iso, local: digits.slice(match.dial.length) } : { country: OTHER_COUNTRY, local: phone };
}

/**
 * Builds the number to save. A number typed with its own "+code" is used as
 * typed; otherwise the chosen country's code is added and a leading 0
 * (as in "098765…") is dropped.
 */
export function joinPhone(country: string, local: string): string {
  const typed = local.replace(/[\s\-.()]/g, "");
  if (typed.startsWith("+") || country === OTHER_COUNTRY) return typed;
  const dial = countries.find((c) => c.iso === country)?.dial ?? "91";
  return `+${dial}${typed.replace(/^0+/, "")}`;
}
