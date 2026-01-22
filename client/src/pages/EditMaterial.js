import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMaterial, updateMaterial } from '../utils/api';
import { useLanguage } from '../context/LanguageContext';

const materialTypeMap = {
  'बीज': { en: 'Seed', hi: 'बीज', mr: 'बियाणे' },
  'खाद': { en: 'Fertilizer', hi: 'खाद', mr: 'खत' },
  'दवाई': { en: 'Medicine', hi: 'दवाई', mr: 'औषध' },
  'कीटनाशक': { en: 'Pesticide', hi: 'कीटनाशक', mr: 'किटकनाशक' },
  'मजदूरी': { en: 'Labor', hi: 'मजदूरी', mr: 'मजुरी' },
  'ट्रैक्टर/उपकरण': { en: 'Tractor/Equipment', hi: 'ट्रैक्टर/उपकरण', mr: 'ट्रॅक्टर/साधने' },
  'पानी/बिजली': { en: 'Water/Electricity', hi: 'पानी/बिजली', mr: 'पाणी/वीज' },
  'परिवहन': { en: 'Transport', hi: 'परिवहन', mr: 'वाहतूक' },
  'भंडारण': { en: 'Storage', hi: 'भंडारण', mr: 'साठवण' },
  'अन्य': { en: 'Other', hi: 'अन्य', mr: 'इतर' }
};

const quantityUnitMap = {
  'किलोग्राम': { en: 'Kilogram', hi: 'किलोग्राम', mr: 'किलोग्राम' },
  'लीटर': { en: 'Litre', hi: 'लीटर', mr: 'लिटर' },
  'पैकेट': { en: 'Packet', hi: 'पैकेट', mr: 'पॅकेट' },
  'बोरी': { en: 'Bag', hi: 'बोरी', mr: 'गोणी' },
  'दिन': { en: 'Day', hi: 'दिन', mr: 'दिवस' },
  'घंटा': { en: 'Hour', hi: 'घंटा', mr: 'तास' },
  'पीस': { en: 'Piece', hi: 'पीस', mr: 'तुकडा' },
  'बोतल': { en: 'Bottle', hi: 'बोतल', mr: 'बाटली' },
  'व्यक्ति': { en: 'Person', hi: 'व्यक्ति', mr: 'व्यक्ती' }
};

const genderMap = {
  'महिला': { en: 'Female', hi: 'महिला', mr: 'महिला' },
  'पुरुष': { en: 'Male', hi: 'पुरुष', mr: 'पुरुष' },
  'mixed': { en: 'Mixed (Both)', hi: 'मिश्रित (दोनों)', mr: 'मिश्रित (दोन्ही)' }
};

const translateValue = (map, value, lang) => map[value]?.[lang] || value;

function EditMaterial() {
  const { id, materialId } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    materialType: 'बीज',
    materialName: '',
    quantityValue: '',
    quantityUnit: 'किलोग्राम',
    pricePerUnit: '',
    laborDays: '1',
    totalAmount: 0,
    gender: 'mixed',
    notes: '',
    billImage: null
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const materialTypes = [
    'बीज',
    'खाद',
    'दवाई',
    'कीटनाशक',
    'मजदूरी',
    'ट्रैक्टर/उपकरण',
    'पानी/बिजली',
    'परिवहन',
    'भंडारण',
    'अन्य'
  ];

  const units = ['किलोग्राम', 'लीटर', 'पैकेट', 'बोरी', 'दिन', 'घंटा', 'पीस', 'बोतल', 'व्यक्ति'];

  useEffect(() => {
    fetchMaterial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [materialId]);

  const calculateTotal = (quantity, pricePerUnit, days = 1) => {
    const qty = parseFloat(quantity) || 0;
    const price = parseFloat(pricePerUnit) || 0;
    const laborDays = parseFloat(days) || 1;
    return qty * price * laborDays;
  };

  const fetchMaterial = async () => {
    try {
      const { data } = await getMaterial(materialId);
      const material = data.material;
      const pricePerUnit = material.pricePerUnit || (material.price / material.quantity.value / (material.laborDays || 1));
      const laborDays = material.laborDays || 1;

      setFormData({
        date: material.date.split('T')[0],
        materialType: material.materialType,
        materialName: material.materialName,
        quantityValue: material.quantity.value,
        quantityUnit: material.quantity.unit,
        pricePerUnit: pricePerUnit.toFixed(2),
        laborDays: laborDays.toString(),
        totalAmount: material.price,
        gender: material.gender || 'mixed',
        notes: material.notes || '',
        billImage: null
      });
    } catch (err) {
      setError(t('loadExpenseError'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = {
      ...formData,
      [name]: value
    };

    // Recalculate total when quantity, price, or days change
    if (name === 'quantityValue' || name === 'pricePerUnit' || name === 'laborDays') {
      updatedData.totalAmount = calculateTotal(
        name === 'quantityValue' ? value : formData.quantityValue,
        name === 'pricePerUnit' ? value : formData.pricePerUnit,
        name === 'laborDays' ? value : formData.laborDays
      );
    }

    setFormData(updatedData);
    setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError(t('fileSizeError'));
        e.target.value = '';
        return;
      }
      setFormData({
        ...formData,
        billImage: file
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    // Validation
    if (!formData.quantityValue || parseFloat(formData.quantityValue) <= 0) {
      setError(t('quantityValidationError'));
      setSubmitting(false);
      return;
    }
    if (!formData.pricePerUnit || parseFloat(formData.pricePerUnit) <= 0) {
      setError(t('priceValidationError'));
      setSubmitting(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('date', formData.date);
      data.append('materialType', formData.materialType);
      data.append('materialName', formData.materialName);
      data.append('quantity', JSON.stringify({
        value: parseFloat(formData.quantityValue),
        unit: formData.quantityUnit
      }));
      data.append('pricePerUnit', formData.pricePerUnit);
      data.append('price', formData.totalAmount.toString());
      data.append('laborDays', formData.laborDays);
      data.append('gender', formData.gender);
      if (formData.notes) {
        data.append('notes', formData.notes);
      }
      if (formData.billImage) {
        data.append('billImage', formData.billImage);
      }

      await updateMaterial(materialId, data);
      navigate(`/crop/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || t('updateExpenseError'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-3 xs:py-4">
          <button
            onClick={() => navigate(`/crop/${id}`)}
            className="text-primary hover:underline mb-2 flex items-center gap-1 text-sm xs:text-base"
          >
            ← {t('backToCropDetails')}
          </button>
          <h1 className="text-xl xs:text-2xl font-bold text-gray-900">{t('editExpenseTitle')}</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-4 xs:py-6 sm:py-8">
        <div className="bg-white rounded-lg shadow p-4 xs:p-5 sm:p-6">
          {error && (
            <div className="mb-4 p-3 xs:p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm xs:text-base">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 xs:space-y-5 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-5 sm:gap-6">
              {/* Date */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm xs:text-base">{t('dateLabel')} *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-3 xs:px-4 py-2.5 xs:py-3 text-sm xs:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Material Type */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm xs:text-base">{t('materialTypeLabel')} *</label>
                <select
                  name="materialType"
                  value={formData.materialType}
                  onChange={handleChange}
                  required
                  className="w-full px-3 xs:px-4 py-2.5 xs:py-3 text-sm xs:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {materialTypes.map(type => (
                    <option key={type} value={type}>{translateValue(materialTypeMap, type, lang)}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Material Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm xs:text-base">
                {formData.materialType === 'ट्रैक्टर/उपकरण' ? t('tractorOwnerLabel') : t('materialNameLabel')} *
              </label>
              <input
                type="text"
                name="materialName"
                value={formData.materialName}
                onChange={handleChange}
                placeholder={formData.materialType === 'ट्रैक्टर/उपकरण' ? t('tractorOwnerPlaceholder') : t('materialNamePlaceholder')}
                required
                className="w-full px-3 xs:px-4 py-2.5 xs:py-3 text-sm xs:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Quantity */}
            <div className="grid grid-cols-2 gap-3 xs:gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm xs:text-base">
                  {formData.materialType === 'ट्रैक्टर/उपकरण' ? t('hoursLabel') :
                    formData.materialType === 'मजदूरी' ? t('personsLabel') : t('quantityLabel')} *
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="quantityValue"
                  value={formData.quantityValue}
                  onChange={handleChange}
                  placeholder={formData.materialType === 'ट्रैक्टर/उपकरण' ? t('tractorHoursPlaceholder') : t('quantityPlaceholder')}
                  required
                  min="0.01"
                  className="w-full px-3 xs:px-4 py-2.5 xs:py-3 text-sm xs:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm xs:text-base">{t('unitLabel')} *</label>
                <select
                  name="quantityUnit"
                  value={formData.quantityUnit}
                  onChange={handleChange}
                  required
                  className="w-full px-3 xs:px-4 py-2.5 xs:py-3 text-sm xs:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {units.map(unit => (
                    <option key={unit} value={unit}>{translateValue(quantityUnitMap, unit, lang)}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Labor Days (for labor only) */}
            {formData.materialType === 'मजदूरी' && (
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm xs:text-base">{t('numberOfDaysLabel')} *</label>
                <input
                  type="number"
                  step="1"
                  name="laborDays"
                  value={formData.laborDays}
                  onChange={handleChange}
                  placeholder={t('daysPlaceholder')}
                  required
                  min="1"
                  className="w-full px-3 xs:px-4 py-2.5 xs:py-3 text-sm xs:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}

            {/* Price Per Unit */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm xs:text-base">
                {formData.materialType === 'ट्रैक्टर/उपकरण' ? t('pricePerHourLabel') :
                  formData.materialType === 'मजदूरी' ? t('pricePerPersonLabel') : t('pricePerUnitLabel')} *
              </label>
              <input
                type="number"
                step="0.01"
                name="pricePerUnit"
                value={formData.pricePerUnit}
                onChange={handleChange}
                placeholder={t('pricePlaceholder')}
                required
                min="0.01"
                className="w-full px-3 xs:px-4 py-2.5 xs:py-3 text-sm xs:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Total Amount Display */}
            {formData.totalAmount > 0 && (
              <div className="bg-green-50 border-2 border-green-300 rounded-lg p-3 xs:p-4">
                <div className="text-center">
                  <p className="text-xs xs:text-sm text-gray-600 mb-1">{t('totalAmountLabel')}</p>
                  <p className="text-2xl xs:text-3xl font-bold text-green-700">₹{formData.totalAmount.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {formData.quantityValue} {translateValue(quantityUnitMap, formData.quantityUnit, lang)} × ₹{formData.pricePerUnit}
                    {formData.materialType === 'मजदूरी' && formData.laborDays > 1 ? ` × ${formData.laborDays} ${t('days')}` : ''}
                  </p>
                </div>
              </div>
            )}

            {/* Gender (for labor only) */}
            {formData.materialType === 'मजदूरी' && (
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm xs:text-base">{t('laborTypeLabel')}</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 xs:px-4 py-2.5 xs:py-3 text-sm xs:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {Object.keys(genderMap).map((value) => (
                    <option key={value} value={value}>{translateValue(genderMap, value, lang)}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Bill Image */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm xs:text-base">{t('billPhotoLabel')}</label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="w-full px-3 xs:px-4 py-2.5 xs:py-3 text-sm xs:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs xs:text-sm text-gray-500 mt-1">{t('billPhotoHelp')}</p>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm xs:text-base">{t('notesLabel')}</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder={t('notesPlaceholder')}
                rows="3"
                className="w-full px-3 xs:px-4 py-2.5 xs:py-3 text-sm xs:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col xs:flex-row gap-3 xs:gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(`/crop/${id}`)}
                className="flex-1 px-4 xs:px-6 py-2.5 xs:py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 text-sm xs:text-base"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 xs:px-6 py-2.5 xs:py-3 bg-primary text-white font-semibold rounded-lg hover:bg-secondary disabled:opacity-50 text-sm xs:text-base"
              >
                {submitting ? t('updatingExpenseButton') : t('editExpenseButton')}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default EditMaterial;
