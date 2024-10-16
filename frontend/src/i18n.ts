import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from '../locales/en.json';
import esTranslations from '../locales/es.json';
import ptBRTranslations from '../locales/pt-BR.json';
import ptPTTranslations from '../locales/pt-PT.json';

const getLocale = (): string => {
  const language = navigator.language.split(/[-_]/)[0];
  return language === 'pt' ? 'pt-BR' : language;
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      es: { translation: esTranslations },
      'pt-BR': { translation: ptBRTranslations },
      'pt-PT': { translation: ptPTTranslations },
    },
    fallbackLng: 'en',
    lng: getLocale(),
    detection: {
      order: ['navigator', 'htmlTag', 'path', 'subdomain'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
