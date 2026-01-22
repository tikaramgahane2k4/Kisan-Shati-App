import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup as signupAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError(t('passwordMismatch'));
      return;
    }

    if (formData.password.length < 6) {
      setError(t('passwordTooShort'));
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...signupData } = formData;
      const { data } = await signupAPI(signupData);
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || t('signupError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col items-center justify-center px-3 xs:px-4 sm:px-6 py-4 sm:py-6 relative auth-shell">
      <div className="absolute top-3 xs:top-4 right-3 xs:right-4 auth-lang">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-sm xs:max-w-md">
        <div className="bg-white rounded-xl xs:rounded-2xl shadow-lg xs:shadow-xl p-5 xs:p-6 sm:p-8 auth-card">
          {/* Header */}
          <div className="text-center mb-5 xs:mb-6 sm:mb-8">
            <h2 className="text-2xl xs:text-3xl font-bold text-gray-900 mb-1 xs:mb-2">{t('signupTitle')}</h2>
            <p className="text-sm xs:text-base text-gray-600">{t('signupSubtitle')}</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 xs:p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm xs:text-base">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 xs:space-y-4 sm:space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-1 xs:mb-2 text-sm xs:text-base">
                {t('nameLabel')}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t('namePlaceholder')}
                required
                className="w-full px-3 xs:px-4 py-2.5 xs:py-3 text-sm xs:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1 xs:mb-2 text-sm xs:text-base">
                {t('mobileLabel')}
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder={t('mobilePlaceholder')}
                maxLength="10"
                pattern="[0-9]{10}"
                required
                className="w-full px-3 xs:px-4 py-2.5 xs:py-3 text-sm xs:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1 xs:mb-2 text-sm xs:text-base">
                {t('passwordLabel')}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t('passwordPlaceholder')}
                minLength="6"
                required
                className="w-full px-3 xs:px-4 py-2.5 xs:py-3 text-sm xs:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1 xs:mb-2 text-sm xs:text-base">
                {t('confirmPasswordLabel')}
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder={t('confirmPasswordPlaceholder')}
                required
                className="w-full px-3 xs:px-4 py-2.5 xs:py-3 text-sm xs:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 xs:py-3 bg-primary text-white font-semibold text-sm xs:text-base rounded-lg shadow-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? t('signupButtonLoading') : t('signupButton')}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-4 xs:mt-6 text-center">
            <p className="text-gray-600 text-xs xs:text-sm sm:text-base">
              {t('haveAccount')}{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                {t('loginHere')}
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-3 xs:mt-4 text-center">
            <Link to="/" className="text-gray-500 text-xs xs:text-sm hover:text-gray-700">
              {t('backHome')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
