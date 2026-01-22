import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCrops, createCrop } from '../utils/api';
import { useLanguage } from '../context/LanguageContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Header from '../components/Header';
import Footer from '../components/Footer';

const cropNameMap = {
  'धान': { en: 'Rice', hi: 'धान', mr: 'भात' },
  'गेहूं': { en: 'Wheat', hi: 'गेहूं', mr: 'गहू' },
  'गन्ना': { en: 'Sugarcane', hi: 'गन्ना', mr: 'ऊस' },
  'बैंगन': { en: 'Brinjal', hi: 'बैंगन', mr: 'वांगी' },
  'गोभी': { en: 'Cauliflower', hi: 'गोभी', mr: 'फुलकोबी' },
  'मिर्च': { en: 'Chilli', hi: 'मिर्च', mr: 'मिरची' }
};

const statusMap = {
  'चालू': { en: 'Ongoing', hi: 'चालू', mr: 'चालू' },
  'पूर्ण': { en: 'Completed', hi: 'पूर्ण', mr: 'पूर्ण' }
};

const unitMap = {
  'बीघा': { en: 'Bigha', hi: 'बीघा', mr: 'बिघा' },
  'डिस्मिल': { en: 'Dismil', hi: 'डिस्मिल', mr: 'डिस्मिल' },
  'एकड़': { en: 'Acre', hi: 'एकड़', mr: 'एकर' },
  'हेक्टेयर': { en: 'Hectare', hi: 'हेक्टेयर', mr: 'हेक्टर' }
};

const translateValue = (map, value, lang) => map[value]?.[lang] || value;
const localeForLang = (lang) => (lang === 'en' ? 'en-IN' : lang === 'mr' ? 'mr-IN' : 'hi-IN');

function Dashboard() {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const dateLocale = localeForLang(lang);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newCrop, setNewCrop] = useState({
    cropType: 'धान',
    startDate: new Date().toISOString().split('T')[0],
    expectedDuration: '',
    landSize: { value: '', unit: 'बीघा' }
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const { data } = await getCrops();
      setCrops(data.crops);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCrop = async (e) => {
    e.preventDefault();
    setError('');

    const valueNum = parseFloat(newCrop.landSize.value);
    const durationNum = Number(newCrop.expectedDuration);

    if (!valueNum || valueNum <= 0) {
      setError(t('areaValidation'));
      return;
    }
    if (!durationNum || durationNum <= 0) {
      setError(t('durationValidation'));
      return;
    }

    try {
      const payload = {
        ...newCrop,
        expectedDuration: durationNum,
        landSize: {
          value: valueNum,
          unit: newCrop.landSize.unit
        }
      };
      await createCrop(payload);
      setShowModal(false);
      setNewCrop({
        cropType: 'धान',
        startDate: new Date().toISOString().split('T')[0],
        expectedDuration: '',
        landSize: { value: '', unit: 'बीघा' }
      });
      fetchCrops();
    } catch (err) {
      setError(err.response?.data?.message || t('createCropError'));
    }
  };

  const activeCrops = crops.filter(c => c.status === 'चालू');
  const completedCrops = crops.filter(c => c.status === 'पूर्ण');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 w-full">
        <div className="max-w-7xl w-full mx-auto px-2.5 xs:px-3 sm:px-4 md:px-6 lg:px-8 py-3 xs:py-4 sm:py-5 md:py-6 lg:py-8 dashboard-shell">
          {/* Add Crop Button */}
          <div className="mb-4 xs:mb-5 sm:mb-6 md:mb-8">
            <button
              onClick={() => setShowModal(true)}
              className="w-full xs:w-auto px-3 xs:px-4 sm:px-5 md:px-6 py-2 xs:py-2.5 sm:py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-md xs:rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center xs:justify-start gap-1.5 xs:gap-2 text-xs xs:text-sm sm:text-base"
            >
              <span className="text-base xs:text-lg sm:text-xl">+</span>
              {t('startNewCrop')}
            </button>
          </div>

          {loading ? (
            <LoadingSpinner fullScreen />
          ) : (
            <>
              {/* Active Crops */}
              <section className="mb-5 xs:mb-6 sm:mb-8 md:mb-10 lg:mb-12">
                <div className="mb-2.5 xs:mb-3 sm:mb-4 md:mb-5 lg:mb-6">
                  <h2 className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 mb-1 xs:mb-1.5 sm:mb-2">
                    {t('activeCrops')}
                  </h2>
                  <div className="h-0.5 xs:h-0.5 sm:h-1 w-6 xs:w-8 sm:w-10 md:w-12 bg-gradient-to-r from-primary to-secondary rounded"></div>
                  <p className="text-[10px] xs:text-xs sm:text-sm text-gray-500 mt-1 xs:mt-1.5 sm:mt-2">
                    {activeCrops.length} {activeCrops.length === 1 ? 'crop' : 'crops'} ongoing
                  </p>
                </div>
                {activeCrops.length === 0 ? (
                  <div className="bg-white rounded-md xs:rounded-lg shadow-sm p-3 xs:p-4 sm:p-6 md:p-8 text-center">
                    <div className="text-2xl xs:text-3xl sm:text-4xl mb-1.5 xs:mb-2 sm:mb-3">🌾</div>
                    <p className="text-[11px] xs:text-xs sm:text-sm md:text-base text-gray-600">{t('noActiveCrops')}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-3 sm:gap-4 lg:gap-5 xl:gap-6 justify-items-stretch">
                    {activeCrops.map(crop => (
                      <CropCard key={crop._id} crop={crop} onClick={() => navigate(`/crop/${crop._id}`)} lang={lang} dateLocale={dateLocale} />
                    ))}
                  </div>
                )}
              </section>

              {/* Completed Crops */}
              {completedCrops.length > 0 && (
                <section className="mb-5 xs:mb-6 sm:mb-8 md:mb-10 lg:mb-12">
                  <div className="mb-2.5 xs:mb-3 sm:mb-4 md:mb-5 lg:mb-6">
                    <h2 className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 mb-1 xs:mb-1.5 sm:mb-2">
                      {t('completedCrops')}
                    </h2>
                    <div className="h-0.5 xs:h-0.5 sm:h-1 w-6 xs:w-8 sm:w-10 md:w-12 bg-gradient-to-r from-gray-400 to-gray-600 rounded"></div>
                    <p className="text-[10px] xs:text-xs sm:text-sm text-gray-500 mt-1 xs:mt-1.5 sm:mt-2">
                      {completedCrops.length} {completedCrops.length === 1 ? 'crop' : 'crops'} completed
                    </p>
                  </div>
                  <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                    {completedCrops.map(crop => (
                      <CropCard key={crop._id} crop={crop} onClick={() => navigate(`/crop/${crop._id}`)} lang={lang} dateLocale={dateLocale} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>

      {/* Create Crop Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-0 sm:p-3 md:p-4 z-50">
          <div className="bg-white rounded-t-2xl sm:rounded-xl md:rounded-2xl shadow-xl w-full sm:max-w-md md:max-w-lg sm:w-full p-3 xs:p-4 sm:p-5 md:p-6 max-h-[92vh] sm:max-h-[90vh] overflow-y-auto modal-card">
            <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 xs:mb-4">{t('modalTitle')}</h3>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs sm:text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateCrop} className="space-y-3 xs:space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1.5 xs:mb-2 text-[11px] xs:text-xs sm:text-sm">{t('selectCrop')}</label>
                <select
                  value={newCrop.cropType}
                  onChange={(e) => setNewCrop({...newCrop, cropType: e.target.value})}
                  className="w-full px-2.5 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 rounded-md xs:rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-[11px] xs:text-xs sm:text-sm"
                >
                  {Object.keys(cropNameMap).map((value) => (
                    <option key={value} value={value}>{translateValue(cropNameMap, value, lang)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1.5 xs:mb-2 text-[11px] xs:text-xs sm:text-sm">{t('startDate')}</label>
                <input
                  type="date"
                  value={newCrop.startDate}
                  onChange={(e) => setNewCrop({...newCrop, startDate: e.target.value})}
                  required
                  className="w-full px-2.5 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 rounded-md xs:rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-[11px] xs:text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1.5 xs:mb-2 text-[11px] xs:text-xs sm:text-sm">{t('expectedDuration')}</label>
                <input
                  type="number"
                  value={newCrop.expectedDuration}
                  onChange={(e) => setNewCrop({...newCrop, expectedDuration: e.target.value})}
                  placeholder={t('durationPlaceholder')}
                  min="1"
                  required
                  className="w-full px-2.5 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 rounded-md xs:rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-[11px] xs:text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1.5 xs:mb-2 text-[11px] xs:text-xs sm:text-sm">{t('landArea')}</label>
                <div className="grid grid-cols-2 gap-2 xs:gap-2.5 sm:gap-3">
                  <input
                    type="number"
                    step="0.01"
                    value={newCrop.landSize.value}
                    onChange={(e) => setNewCrop({
                      ...newCrop,
                      landSize: { ...newCrop.landSize, value: e.target.value }
                    })}
                    placeholder={t('landPlaceholder')}
                    min="0.01"
                    required
                    className="w-full px-2.5 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 rounded-md xs:rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-[11px] xs:text-xs sm:text-sm"
                  />
                  <select
                    value={newCrop.landSize.unit}
                    onChange={(e) => setNewCrop({
                      ...newCrop,
                      landSize: { ...newCrop.landSize, unit: e.target.value }
                    })}
                    className="w-full px-2.5 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 rounded-md xs:rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-[11px] xs:text-xs sm:text-sm"
                  >
                    {Object.keys(unitMap).map((value) => (
                      <option key={value} value={value}>{translateValue(unitMap, value, lang)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col xs:flex-row gap-2 xs:gap-2.5 sm:gap-3 pt-1.5 xs:pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 text-gray-700 rounded-md xs:rounded-lg hover:bg-gray-50 text-[11px] xs:text-xs sm:text-sm font-medium transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-md xs:rounded-lg hover:shadow-lg text-[11px] xs:text-xs sm:text-sm font-medium transition-all"
                >
                  {t('create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

const CropCard = ({ crop, onClick, lang, dateLocale }) => {
  const { t } = useLanguage();
  const statusLabel = translateValue(statusMap, crop.status, lang);
  const cropLabel = translateValue(cropNameMap, crop.cropType, lang);
  const unitLabel = translateValue(unitMap, crop.landSize?.unit, lang);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-md xs:rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer p-2.5 xs:p-3 sm:p-4 md:p-5 active:scale-[0.98] xs:active:scale-95 group border border-gray-100 hover:border-gray-200"
    >
      {/* Header - Crop Name & Status */}
      <div className="flex justify-between items-start mb-1.5 xs:mb-2 sm:mb-3 gap-1.5 xs:gap-2">
        <h3 className="text-xs xs:text-sm sm:text-base md:text-lg font-bold text-gray-900 group-hover:text-primary transition-colors flex-1 leading-tight line-clamp-2">
          {cropLabel}
        </h3>
        <span className={`px-1.5 xs:px-2 py-0.5 xs:py-1 rounded text-[10px] xs:text-xs font-medium whitespace-nowrap flex-shrink-0 ${
          crop.status === 'चालू' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {statusLabel}
        </span>
      </div>
      
      {/* Crop Details - Compact */}
      <div className="space-y-0.5 xs:space-y-1 sm:space-y-1.5 text-[11px] xs:text-xs sm:text-sm text-gray-600 mb-1.5 xs:mb-2 sm:mb-3">
        <div className="flex items-center gap-1 xs:gap-1.5">
          <span className="text-sm xs:text-base flex-shrink-0">📅</span>
          <span className="truncate">{new Date(crop.startDate).toLocaleDateString(dateLocale)}</span>
        </div>
        <div className="flex items-center gap-1 xs:gap-1.5">
          <span className="text-sm xs:text-base flex-shrink-0">🌾</span>
          <span className="truncate">
            {crop?.landSize?.value && crop?.landSize?.unit
              ? `${crop.landSize.value} ${unitLabel}`
              : t('notAvailable')}
          </span>
        </div>
        <div className="flex items-center gap-1 xs:gap-1.5">
          <span className="text-sm xs:text-base flex-shrink-0">💰</span>
          <span className="font-semibold text-gray-900 truncate">₹{crop.totalCost?.toFixed(2) || '0.00'}</span>
        </div>
        {crop.status === 'पूर्ण' && crop.netProfit !== undefined && (
          <div className="flex items-center gap-1 xs:gap-1.5">
            <span className="text-sm xs:text-base flex-shrink-0">{crop.netProfit >= 0 ? '📈' : '📉'}</span>
            <span className={`font-semibold truncate ${crop.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹{Math.abs(crop.netProfit).toFixed(2)}
            </span>
          </div>
        )}
      </div>
      
      {/* View Button - Compact */}
      <button className="w-full py-1.5 xs:py-2 sm:py-2.5 bg-primary text-white text-[11px] xs:text-xs sm:text-sm font-medium rounded hover:bg-secondary transition-colors">
        {t('viewDetails')}
      </button>
    </div>
  );
};

export default Dashboard;
