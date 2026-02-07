
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from '../i18n.jsx';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useTranslation();

  return (
    <nav className="bg-emerald-700 text-white shadow-lg sticky top-0 z-50 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-white p-1.5 rounded-lg">
                <svg className="w-6 h-6 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <span className="font-outfit text-xl font-bold tracking-tight">{t('appName')}</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-xs font-bold text-emerald-100">{t('languageLabel')}</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-emerald-600 border border-emerald-500/40 text-white text-xs rounded-lg px-2 py-1 focus:outline-none"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="mr">मराठी</option>
              </select>
            </div>
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-sm font-medium">{t('greeting', { name: user?.name || '' })}</span>
              <span className="text-xs text-emerald-200">{t('farmerAccount')}</span>
            </div>
            <button 
              onClick={() => { onLogout(); navigate('/login'); }}
              className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-emerald-500/30"
            >
              {t('logout')}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
