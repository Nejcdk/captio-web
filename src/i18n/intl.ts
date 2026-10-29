/** The locale to give Intl for a site language: the site writes Serbian in Latin script, Intl defaults to Cyrillic. */
export function intlLocale(code: string): string {
  return code === "sr" ? "sr-Latn" : code;
}
