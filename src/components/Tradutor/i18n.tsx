import React from 'react';
import i18n from 'i18next'; // Certifique-se de importar diretamente do i18next
import { useTranslation } from 'react-i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector'; // Opcional: para detectar idioma do navegador
import HttpApi from 'i18next-http-backend'; // Opcional: para carregar traduções de um servidor/arquivos
import Translation from './translation.json'; // Importa o arquivo de tradução padrão

// Importação manual dos arquivos de tradução
import ptBRTranslation from './locales/pt-BR/translation.json';
import enTranslation from './locales/en/translation.json';
import zhCNTranslation from './locales/zh-CN/translation.json';
import wuuTranslation from './locales/wuu/translation.json';
import hiTranslation from './locales/hi/translation.json';
import esTranslation from './locales/es/translation.json';
import frTranslation from './locales/fr/translation.json';
import arTranslation from './locales/ar/translation.json';
import bnTranslation from './locales/bn/translation.json';
import ruTranslation from './locales/ru/translation.json';
import deTranslation from './locales/de/translation.json';
import jaTranslation from './locales/ja/translation.json';
import paTranslation from './locales/pa/translation.json';
import pnbTranslation from './locales/pnb/translation.json';
import jvTranslation from './locales/jv/translation.json';
import koTranslation from './locales/ko/translation.json';
import teTranslation from './locales/te/translation.json';
import mrTranslation from './locales/mr/translation.json';
import trTranslation from './locales/tr/translation.json';
import taTranslation from './locales/ta/translation.json';
import viTranslation from './locales/vi/translation.json';
import urTranslation from './locales/ur/translation.json';
import itTranslation from './locales/it/translation.json';
import faTranslation from './locales/fa/translation.json';
import guTranslation from './locales/gu/translation.json';
import plTranslation from './locales/pl/translation.json';
import ukTranslation from './locales/uk/translation.json';
import roTranslation from './locales/ro/translation.json';
import nlTranslation from './locales/nl/translation.json';
import msTranslation from './locales/ms/translation.json';
import thTranslation from './locales/th/translation.json';
import swTranslation from './locales/sw/translation.json';
import huTranslation from './locales/hu/translation.json';
import csTranslation from './locales/cs/translation.json';
import elTranslation from './locales/el/translation.json';
import svTranslation from './locales/sv/translation.json';
import heTranslation from './locales/he/translation.json';
import idTranslation from './locales/id/translation.json';
import fiTranslation from './locales/fi/translation.json';
import daTranslation from './locales/da/translation.json';
import noTranslation from './locales/no/translation.json';
import skTranslation from './locales/sk/translation.json';
import bgTranslation from './locales/bg/translation.json';
import hrTranslation from './locales/hr/translation.json';
import srTranslation from './locales/sr/translation.json';
import ltTranslation from './locales/lt/translation.json';
import slTranslation from './locales/sl/translation.json';
import etTranslation from './locales/et/translation.json';
import lvTranslation from './locales/lv/translation.json';
import afTranslation from './locales/af/translation.json';
import sqTranslation from './locales/sq/translation.json';
import isTranslation from './locales/is/translation.json';

// Função para carregar traduções dinamicamente
const loadTranslations = () => {
  const translations = {
    'pt-BR': ptBRTranslation,
    en: enTranslation,
    zhCN: zhCNTranslation,
    wuu: wuuTranslation,
    hi: hiTranslation,
    es: esTranslation,
    fr: frTranslation,
    ar: arTranslation,
    bn: bnTranslation,
    ru: ruTranslation,
    de: deTranslation,
    ja: jaTranslation,
    pa: paTranslation,
    pnb: pnbTranslation,
    jv: jvTranslation,
    ko: koTranslation,
    te: teTranslation,
    mr: mrTranslation,
    tr: trTranslation,
    ta: taTranslation,
    vi: viTranslation,
    ur: urTranslation,
    it: itTranslation,
    fa: faTranslation,
    gu: guTranslation,
    pl: plTranslation,
    uk: ukTranslation,
    ro: roTranslation,
    nl: nlTranslation,
    ms: msTranslation,
    th: thTranslation,
    sw: swTranslation,
    hu: huTranslation,
    cs: csTranslation,
    el: elTranslation,
    sv: svTranslation,
    he: heTranslation,
    id: idTranslation,
    fi: fiTranslation,
    da: daTranslation,
    no: noTranslation,
    sk: skTranslation,
    bg: bgTranslation,
    hr: hrTranslation,
    sr: srTranslation,
    lt: ltTranslation,
    sl: slTranslation,
    et: etTranslation,
    lv: lvTranslation,
    af: afTranslation,
    sq: sqTranslation,
    is: isTranslation,
  };

  Object.entries(translations).forEach(([lng, resources]) => {
    i18n.addResources(lng, 'translation', resources);
  });

  // Adiciona as traduções do arquivo Translation importado
  i18n.addResources('default', 'translation', Translation);
};

// Configuração do i18next
i18n
  .use(HttpApi) // Backend para carregar traduções
  .use(LanguageDetector) // Detector de idioma do navegador
  .use(initReactI18next) // Passa a instância i18n para react-i18next
  .init({
    debug: process.env.NODE_ENV === 'development', // Ativa o debug apenas em desenvolvimento
    supportedLngs: [
      'pt-BR', 'en', 'zh-CN', 'wuu', 'hi', 'es', 'fr', 'ar', 'bn', 'ru',
      'pt-PT', 'de', 'ja', 'pa', 'pnb', 'jv', 'ko', 'te', 'mr', 'tr',
      'ta', 'vi', 'ur', 'it', 'fa', 'gu', 'pl', 'uk', 'ro', 'nl',
      'ms', 'th', 'sw', 'hu', 'cs', 'el', 'sv', 'he', 'id', 'fi',
      'da', 'no', 'sk', 'bg', 'hr', 'sr', 'lt', 'sl', 'et', 'lv',
      'af', 'sq', 'is',
    ], // Idiomas suportados
    fallbackLng: 'pt-BR', // Idioma padrão caso o detectado não esteja disponível
    interpolation: {
      escapeValue: false, // O React já protege contra XSS
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json', // Caminho para os arquivos de tradução
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'], // Onde guardar o idioma selecionado
    },
  });

// Carrega as traduções
loadTranslations();

// Componente LanguageSelector
const LanguageSelector: React.FC = () => {
  const { t } = useTranslation();

  // Lista de idiomas suportados
  const languages = [
    { code: 'pt-BR', name: t('Português (Brasil)') },
    { code: 'en', name: t('English') },
    { code: 'zh-CN', name: t('中文 (简体)') },
    { code: 'wuu', name: t('吴语') },
    { code: 'hi', name: t('हिन्दी') },
    { code: 'es', name: t('Español') },
    { code: 'fr', name: t('Français') },
    { code: 'ar', name: t('العربية') },
    { code: 'bn', name: t('বাংলা') },
    { code: 'ru', name: t('Русский') },
    { code: 'pt-PT', name: t('Português (Portugal)') },
    { code: 'de', name: t('Deutsch') },
    { code: 'ja', name: t('日本語') },
    { code: 'pa', name: t('ਪੰਜਾਬੀ') },
    { code: 'pnb', name: t('پنجابی') },
    { code: 'jv', name: t('Basa Jawa') },
    { code: 'ko', name: t('한국어') },
    { code: 'te', name: t('తెలుగు') },
    { code: 'mr', name: t('मराठी') },
    { code: 'tr', name: t('Türkçe') },
    { code: 'ta', name: t('தமிழ்') },
    { code: 'vi', name: t('Tiếng Việt') },
    { code: 'ur', name: t('اردو') },
    { code: 'it', name: t('Italiano') },
    { code: 'fa', name: t('فارسی') },
    { code: 'gu', name: t('ગુજરાતી') },
    { code: 'pl', name: t('Polski') },
    { code: 'uk', name: t('Українська') },
    { code: 'ro', name: t('Română') },
    { code: 'nl', name: t('Nederlands') },
    { code: 'ms', name: t('Bahasa Melayu') },
    { code: 'th', name: t('ไทย') },
    { code: 'sw', name: t('Kiswahili') },
    { code: 'hu', name: t('Magyar') },
    { code: 'cs', name: t('Čeština') },
    { code: 'el', name: t('Ελληνικά') },
    { code: 'sv', name: t('Svenska') },
    { code: 'he', name: t('עברית') },
    { code: 'id', name: t('Bahasa Indonesia') },
    { code: 'fi', name: t('Suomi') },
    { code: 'da', name: t('Dansk') },
    { code: 'no', name: t('Norsk') },
    { code: 'sk', name: t('Slovenčina') },
    { code: 'bg', name: t('Български') },
    { code: 'hr', name: t('Hrvatski') },
    { code: 'sr', name: t('Српски') },
    { code: 'lt', name: t('Lietuvių') },
    { code: 'sl', name: t('Slovenščina') },
    { code: 'et', name: t('Eesti') },
    { code: 'lv', name: t('Latviešu') },
    { code: 'af', name: t('Afrikaans') },
    { code: 'sq', name: t('Shqip') },
    { code: 'is', name: t('Íslenska') },
  ];

  // Função para alterar o idioma
  const handleChangeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = event.target.value;
    i18n.changeLanguage(selectedLanguage); // Altera o idioma
  };

  return (
    <div className="language-selector">
      <label htmlFor="language-select">{t('selecionar Idioma')}</label>
      <select
        id="language-select"
        value={i18n.language} // Define o idioma atual como valor selecionado
        onChange={handleChangeLanguage} // Altera o idioma ao selecionar
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;

