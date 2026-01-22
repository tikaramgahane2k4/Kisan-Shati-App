import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

function Header() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  return (
    <header className="bg-gradient-to-r from-primary to-secondary shadow-md sticky top-0 z-50 header-bar">
      <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 lg:px-6 py-2 xs:py-3 sm:py-4 header-inner">
        <div className="flex justify-between items-center gap-2 xs:gap-3 sm:gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 flex-1 min-w-0">
            <div className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 bg-white rounded flex-shrink-0 flex items-center justify-center shadow-sm">
              <span className="text-sm xs:text-base sm:text-lg font-bold text-primary">KS</span>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-base xs:text-lg sm:text-xl lg:text-2xl font-bold text-white truncate leading-tight">
                {t('appName')}
              </h1>
              {user?.name && (
                <p className="text-xs sm:text-sm text-green-50 truncate hidden xs:block leading-tight">
                  {user.name}
                </p>
              )}
            </div>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 flex-shrink-0">
            <div className="hidden xs:block">
              <LanguageSwitcher />
            </div>
            <button
              onClick={logout}
              className="px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 text-xs sm:text-sm bg-white text-primary font-semibold rounded hover:bg-gray-100 transition-colors whitespace-nowrap shadow-sm"
            >
              {t('logout')}
            </button>
          </div>
        </div>
        {/* Mobile Language Switcher */}
        <div className="xs:hidden mt-2 flex justify-center">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}

export default Header;
