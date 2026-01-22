import React from 'react';
import { useLanguage } from '../context/LanguageContext';

function Footer() {
  const { t, lang } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-100 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 py-3 xs:py-4">
        {/* Compact Single Row Layout for Mobile */}
        <div className="flex flex-wrap justify-between items-start gap-x-4 gap-y-2 mb-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-primary rounded flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">KS</span>
            </div>
            <span className="font-bold text-white text-xs">{t('appName')}</span>
          </div>

          {/* Contact Links - Compact */}
          <div className="flex items-center gap-3 text-xs">
            <a href="mailto:support@kisansathi.com" className="hover:text-primary transition-colors" title="Email">
              📧
            </a>
            <a href="tel:+919876543210" className="hover:text-primary transition-colors" title="Phone">
              📞
            </a>
          </div>
        </div>

        {/* Bottom Info - Compact */}
        <div className="border-t border-gray-800 pt-2 flex flex-col xs:flex-row justify-between items-center gap-1 text-xs text-gray-500">
          <p className="text-center xs:text-left">
            © {currentYear} {t('appName')}
          </p>
          <p className="text-center xs:text-right">
            {lang === 'en' ? 'By' : lang === 'hi' ? 'द्वारा' : 'द्वारे'} <span className="text-primary font-semibold">Pawan Gahane</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
