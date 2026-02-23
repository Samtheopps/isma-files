import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['fr', 'en'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  // Récupérer la locale depuis l'URL
  let locale = await requestLocale;
  
  // Valider que la locale entrante est supportée
  if (!locale || !locales.includes(locale as Locale)) {
    locale = 'en'; // fallback
  }
  
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
