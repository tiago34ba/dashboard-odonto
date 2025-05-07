import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import "../Header/Dashboard.css";

const Header: React.FC = () => {
  const location = useLocation();
  // Get both t and i18n
  const { t, i18n } = useTranslation();

  // Memorize the route check
  const isHomePage = useMemo(() => location.pathname === "/", [location.pathname]);

  // Define the languages for the combobox
  const languages = [
    { code: 'pt-BR', name: 'Português (Brasil)', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh-CN', name: '中文 (简体)', flag: '🇨🇳' },
    { code: 'wuu', name: 'Wu Chinese (吴语)', flag: '🇨🇳' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'pt-PT', name: 'Português (Portugal)', flag: '🇵🇹' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { code: 'pnb', name: 'Western Punjabi (پنجابی)', flag: '🇵🇰' },
    { code: 'jv', name: 'Basa Jawa', flag: '🇮🇩' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'ur', name: 'اردو', flag: '🇵🇰' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱' },
    { code: 'uk', name: 'Українська', flag: '🇺🇦' },
    { code: 'ro', name: 'Română', flag: '🇷🇴' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
    { code: 'th', name: 'ไทย', flag: '🇹🇭' },
    { code: 'sw', name: 'Kiswahili', flag: '🇹🇿' },
    { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
    { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
    { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
    { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
    { code: 'he', name: 'עברית', flag: '🇮🇱' },
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'fi', name: 'Suomi', flag: '🇫🇮' },
    { code: 'da', name: 'Dansk', flag: '🇩🇰' },
    { code: 'no', name: 'Norsk', flag: '🇳🇴' },
    { code: 'sk', name: 'Slovenčina', flag: '🇸🇰' },
    { code: 'bg', name: 'Български', flag: '🇧🇬' },
    { code: 'hr', name: 'Hrvatski', flag: '🇭🇷' },
    { code: 'sr', name: 'Српски', flag: '🇷🇸' },
    { code: 'lt', name: 'Lietuvių', flag: '🇱🇹' },
    { code: 'sl', name: 'Slovenščina', flag: '🇸🇮' },
    { code: 'et', name: 'Eesti', flag: '🇪🇪' },
    { code: 'lv', name: 'Latviešu', flag: '🇱🇻' },
    { code: 'af', name: 'Afrikaans', flag: '🇿🇦' },
    { code: 'sq', name: 'Shqip', flag: '🇦🇱' },
    { code: 'is', name: 'Íslenska', flag: '🇮🇸' }
  ];

  // Handler function to change the language
  const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = event.target.value;
    i18n.changeLanguage(selectedLanguage);
    // localStorage.setItem('i18nextLng', selectedLanguage); // Optional persistence
  };

  // Determine the current language value safely
  const currentLanguageValue = useMemo((): string => {
    const currentLang = i18n.language;
    const options = i18n.options;
    const fallbackLng = options?.fallbackLng;
    const absoluteDefaultCode = languages[0]?.code || 'en';

    const getPrimaryFallbackCode = (): string | undefined => {
      if (fallbackLng === undefined) return undefined;
      if (typeof fallbackLng === 'string') return fallbackLng;
      if (Array.isArray(fallbackLng)) return fallbackLng.find(lng => typeof lng === 'string');
      return undefined;
    };

    const primaryFallbackCode = getPrimaryFallbackCode();

    if (currentLang) {
      const match = languages.find(lang => currentLang === lang.code || currentLang.startsWith(lang.code + '-'));
      if (match) return match.code;
    }
    if (primaryFallbackCode) {
      const fallbackMatch = languages.find(lang => lang.code === primaryFallbackCode);
      if (fallbackMatch) return fallbackMatch.code;
    }
    return absoluteDefaultCode;
  }, [i18n.language, i18n.options?.fallbackLng]);


  return (
    <header className="header">
      {/* header-content might not need space-between anymore if only notifications are shown */}
      <div className="header-content">
        {isHomePage && ( // Only show notifications and language selector on home page
          <div className="header-notifications">
            {/* Notification items */}
            <div className="notification-item">
              <span aria-label={t('notificacoes')} className="icon" title={t('notificacoes')}>🔔</span>
              <span className="notification-title">{t('notificacoes')}</span>
            </div>
            <div className="notification-item">
              <span aria-label={t('financeiro')} className="icon" title={t('financeiro')}>💵</span>
              <span className="notification-title">{t('financeiro')}</span>
            </div>
            <div className="notification-item">
              <span aria-label={t('mensagens')} className="icon" title={t('mensagens')}>📧</span>
              <span className="notification-title">{t('mensagens')}</span>
            </div>
            <div className="notification-item">
              <span aria-label={t('perfil')} className="icon" title={t('perfil')}>👤</span>
              <span className="notification-title">{t('perfil')}</span>
            </div>

            {/* Language Selector MOVED HERE */}
            {/* Seletor de Idioma MOVIDO AQUI */}
            <div className="language-selector"> {/* Aplique display: flex; align-items: center; gap: 5px; a esta classe no CSS */}
              {/* Remova a classe visually-hidden */}
              <label htmlFor="language-select">{t('Idiomas')}</label>
              <select
                id="language-select"
                value={currentLanguageValue}
                onChange={changeLanguage}
                className="language-select-dropdown"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Fim do Seletor de Idioma */}

          </div>
        )}
        {/* If not home page, this div will be empty or just contain other header elements if you add them later */}
      </div>
    </header>
  );
};

export default Header;
