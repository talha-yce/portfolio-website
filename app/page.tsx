import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { defaultLocale } from '@/lib/i18n/config';

export default function RootPage() {
  const headersList = headers();
  const acceptLanguage = headersList.get('accept-language');
  
  // Simple language detection based on Accept-Language header
  let locale = defaultLocale;
  if (acceptLanguage) {
    if (acceptLanguage.includes('en')) {
      locale = 'en';
    } else if (acceptLanguage.includes('tr')) {
      locale = 'tr';
    }
  }

  redirect(`/${locale}`);
  
  // This won't be reached due to redirect, but needed for TypeScript
  return null;
} 