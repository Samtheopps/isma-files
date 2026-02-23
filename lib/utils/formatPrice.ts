/**
 * Format price utilities
 * 
 * Les prix sont stockés en centimes dans MongoDB (ex: 4900 = 49€)
 * Ces fonctions convertissent les centimes en euros formatés
 */

/**
 * Formate un montant en centimes vers euros avec 2 décimales
 * @param amountInCents - Montant en centimes (ex: 4900)
 * @returns Montant formaté avec le symbole € (ex: "49.00€")
 */
export const formatPrice = (amountInCents: number): string => {
  return `${(amountInCents / 100).toFixed(2)}€`;
};

/**
 * Formate un montant en centimes vers euros sans décimales
 * @param amountInCents - Montant en centimes (ex: 4900)
 * @returns Montant formaté sans décimales (ex: "49€")
 */
export const formatPriceRounded = (amountInCents: number): string => {
  return `${(amountInCents / 100).toFixed(0)}€`;
};

/**
 * Formate un montant en centimes vers euros avec le format Intl
 * @param amountInCents - Montant en centimes (ex: 4900)
 * @param locale - Locale à utiliser (défaut: 'fr-FR')
 * @returns Montant formaté selon la locale (ex: "49,00 €")
 */
export const formatPriceIntl = (amountInCents: number, locale: string = 'fr-FR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
  }).format(amountInCents / 100);
};

/**
 * Convertit un montant en euros vers centimes
 * @param amountInEuros - Montant en euros (ex: 49.00)
 * @returns Montant en centimes (ex: 4900)
 */
export const eurosToCents = (amountInEuros: number): number => {
  return Math.round(amountInEuros * 100);
};
