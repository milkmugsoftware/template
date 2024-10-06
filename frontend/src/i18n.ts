import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from '../locales/en.json';
import esTranslations from '../locales/es.json';
import ptBRTranslations from '../locales/pt-BR.json';
import ptPTTranslations from '../locales/pt-PT.json';

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
    detection: {
      order: ['navigator'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
