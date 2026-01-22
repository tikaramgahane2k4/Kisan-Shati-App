import jsPDF from 'jspdf';

const translations = {
  en: {
    cropReport: 'Crop Report',
    cropDetails: 'Crop Details',
    cropName: 'Crop Name:',
    startDate: 'Start Date:',
    endDate: 'End Date:',
    landArea: 'Land Area:',
    duration: 'Duration:',
    status: 'Status:',
    months: 'months',
    statusActive: 'Active',
    statusCompleted: 'Completed',
    statusCancelled: 'Cancelled',
    expenseDetails: 'Expense Details',
    noExpenses: 'No expenses recorded',
    date: 'Date',
    type: 'Type',
    name: 'Name',
    qty: 'Qty',
    rate: 'Rate (Rs)',
    total: 'Total (Rs)',
    financialSummary: 'Financial Summary',
    totalCost: 'Total Cost:',
    production: 'Production:',
    sellingPrice: 'Selling Price:',
    totalIncome: 'Total Income:',
    netProfit: 'Net Profit:',
    netLoss: 'Net Loss:',
    reportGenerated: 'Report Generated:',
    notAvailable: 'Not Available'
  },
  hi: {
    cropReport: 'फसल रिपोर्ट',
    cropDetails: 'फसल विवरण',
    cropName: 'फसल का नाम:',
    startDate: 'शुरुआत की तारीख:',
    endDate: 'समाप्ति की तारीख:',
    landArea: 'जमीन का क्षेत्रफल:',
    duration: 'अवधि:',
    status: 'स्थिति:',
    months: 'महीने',
    statusActive: 'चालू',
    statusCompleted: 'पूर्ण',
    statusCancelled: 'रद्द',
    expenseDetails: 'खर्च का विवरण',
    noExpenses: 'कोई खर्च दर्ज नहीं',
    date: 'तारीख',
    type: 'प्रकार',
    name: 'नाम',
    qty: 'मात्रा',
    rate: 'दर (₹)',
    total: 'कुल (₹)',
    financialSummary: 'वित्तीय सारांश',
    totalCost: 'कुल खर्च:',
    production: 'उत्पादन:',
    sellingPrice: 'विक्रय मूल्य:',
    totalIncome: 'कुल आय:',
    netProfit: 'शुद्ध लाभ:',
    netLoss: 'शुद्ध हानि:',
    reportGenerated: 'रिपोर्ट तैयार:',
    notAvailable: 'उपलब्ध नहीं'
  },
  mr: {
    cropReport: 'पीक अहवाल',
    cropDetails: 'पीक तपशील',
    cropName: 'पीक नाव:',
    startDate: 'सुरुवातीची तारीख:',
    endDate: 'समाप्तीची तारीख:',
    landArea: 'जमिनीचे क्षेत्रफळ:',
    duration: 'कालावधी:',
    status: 'स्थिती:',
    months: 'महिने',
    statusActive: 'सक्रिय',
    statusCompleted: 'पूर्ण',
    statusCancelled: 'रद्द',
    expenseDetails: 'खर्च तपशील',
    noExpenses: 'कोणताही खर्च नोंदलेला नाही',
    date: 'तारीख',
    type: 'प्रकार',
    name: 'नाव',
    qty: 'प्रमाण',
    rate: 'दर (₹)',
    total: 'एकूण (₹)',
    financialSummary: 'आर्थिक सारांश',
    totalCost: 'एकूण खर्च:',
    production: 'उत्पादन:',
    sellingPrice: 'विक्री दर:',
    totalIncome: 'एकूण उत्पन्न:',
    netProfit: 'निव्वळ नफा:',
    netLoss: 'निव्वळ तोटा:',
    reportGenerated: 'अहवाल तयार:',
    notAvailable: 'उपलब्ध नाही'
  }
};

export const generateCropPDF = (crop, materials, lang = 'en') => {
  const dict = translations[lang] || translations.en;
  const t = (key) => dict[key] || key;
  const doc = new jsPDF();
  
  // Header with Background
  doc.setFillColor(34, 139, 34);
  doc.rect(0, 0, 210, 35, 'F');
  
  // Title
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('KISAN PROFIT MITRA', 105, 15, { align: 'center' });
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(t('cropReport'), 105, 25, { align: 'center' });
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Crop Details Section
  let yPos = 45;
  doc.setFillColor(240, 248, 255);
  doc.rect(15, yPos - 5, 180, 8, 'F');
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(t('cropDetails'), 20, yPos);
  
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  // Safely format values to avoid undefined/null showing up as code in PDF
  const cropNameText = (() => {
    const englishMap = {
      'धान': 'Rice',
      'गेहूं': 'Wheat',
      'गन्ना': 'Sugarcane',
      'बैंगन': 'Brinjal',
      'गोभी': 'Cauliflower',
      'मिर्च': 'Chilli'
    };
    const primary = typeof crop?.cropType === 'string' && crop.cropType.trim()
      ? crop.cropType.trim()
      : undefined;
    const translated = primary && englishMap[primary];
    const candidates = [
      translated,
      crop?.cropNameEnglish,
      primary,
      crop?.name,
      crop?.title
    ];
    const name = candidates.find(v => typeof v === 'string' && v.trim());
    return name ? name.trim() : 'Not Available';
  })();
  const startDateText = crop?.startDate
    ? new Date(crop.startDate).toLocaleDateString('en-IN')
    : t('notAvailable');
  const endDateText = crop?.completedAt
    ? new Date(crop.completedAt).toLocaleDateString('en-IN')
    : null;
  const landUnitTranslation = {
    'बीघा': 'Bigha',
    'डिस्मिल': 'Dismil',
    'एकड़': 'Acre',
    'हेक्टेयर': 'Hectare'
  };
  const hasLandValue = crop?.landSize?.value !== undefined && crop?.landSize?.value !== null;
  const landUnit = landUnitTranslation[crop?.landSize?.unit] || crop?.landSize?.unit || '';
  const landAreaText = hasLandValue
    ? `${crop.landSize.value} ${landUnit}`.trim()
    : t('notAvailable');
  const durationText = Number.isFinite(Number(crop?.expectedDuration))
    ? `${Number(crop.expectedDuration)} ${t('months')}`
    : t('notAvailable');
  const statusTextMap = {
    'चालू': t('statusActive'),
    'पूर्ण': t('statusCompleted'),
    'रद्द': t('statusCancelled')
  };
  const statusText = statusTextMap[crop?.status] || crop?.status || t('notAvailable');

  const cropDetails = crop && Object.keys(crop).length
    ? [
        { label: t('cropName'), value: cropNameText },
        { label: t('startDate'), value: startDateText },
        endDateText ? { label: t('endDate'), value: endDateText } : null,
        { label: t('landArea'), value: landAreaText },
        { label: t('duration'), value: durationText },
        { label: t('status'), value: statusText }
      ].filter(Boolean)
    : [{ label: t('cropDetails'), value: t('notAvailable') }];
  
  cropDetails.forEach(detail => {
    doc.setFont('helvetica', 'bold');
    doc.text(detail.label, 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(String(detail.value || ''), 65, yPos);
    yPos += 7;
  });
  
  // Expenses Section
  yPos += 10;
  doc.setFillColor(240, 248, 255);
  doc.rect(15, yPos - 5, 180, 8, 'F');
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(t('expenseDetails'), 20, yPos);
  
  yPos += 12;
  
  if (!materials || materials.length === 0) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(t('noExpenses'), 20, yPos);
    yPos += 10;
  } else {
    // Table header
    doc.setFillColor(220, 220, 220);
    doc.rect(15, yPos - 5, 180, 8, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(t('date'), 20, yPos);
    doc.text(t('type'), 50, yPos);
    doc.text(t('name'), 80, yPos);
    doc.text(t('qty'), 120, yPos);
    doc.text(t('rate'), 145, yPos);
    doc.text(t('total'), 170, yPos);
    
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    
    // Group by type for summary
    const groupedByType = materials.reduce((acc, mat) => {
      if (!acc[mat.materialType]) {
        acc[mat.materialType] = [];
      }
      acc[mat.materialType].push(mat);
      return acc;
    }, {});
    
    // Type translation
    const typeTranslation = {
      'बीज': 'Seeds',
      'खाद': 'Fertilizer',
      'दवाई': 'Medicine',
      'कीटनाशक': 'Pesticide',
      'मजदूरी': 'Labour',
      'ट्रैक्टर/उपकरण': 'Tractor',
      'पानी/बिजली': 'Water/Electricity',
      'परिवहन': 'Transport',
      'भंडारण': 'Storage',
      'अन्य': 'Other'
    };
    
    // Unit translation
    const unitTranslation = {
      'किलोग्राम': 'kg',
      'लीटर': 'ltr',
      'पैकेट': 'pkt',
      'बोरी': 'bag',
      'दिन': 'days',
      'घंटा': 'hrs',
      'पीस': 'pcs',
      'बोतल': 'btl',
      'व्यक्ति': 'person'
    };
    
    // Show expenses by category
    Object.entries(groupedByType).forEach(([type, items]) => {
      if (yPos > 265) {
        doc.addPage();
        yPos = 20;
      }
      
      // Category header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(typeTranslation[type] || type, 20, yPos);
      yPos += 5;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      
      items.forEach(material => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        
        const dateText = new Date(material.date).toLocaleDateString('en-IN');
        const nameText = material.materialName || '-';
        const translatedUnit = unitTranslation[material.quantity?.unit] || material.quantity?.unit || '';
        const qtyText = material.quantity ? `${material.quantity.value} ${translatedUnit}` : '-';
        const rateText = material.pricePerUnit ? material.pricePerUnit.toFixed(2) : '-';
        const priceText = material.price ? material.price.toFixed(2) : '0.00';
        
        doc.text(dateText, 20, yPos);
        doc.text(nameText, 80, yPos, { maxWidth: 35 });
        doc.text(qtyText, 120, yPos);
        doc.text(rateText, 145, yPos);
        doc.text(priceText, 170, yPos);
        yPos += 5;
      });
      
      yPos += 3;
    });
  }
  
  // Financial Summary
  yPos += 10;
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }
  
  doc.setFillColor(240, 248, 255);
  doc.rect(15, yPos - 5, 180, 8, 'F');
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(t('financialSummary'), 20, yPos);
  
  yPos += 12;
  doc.setFontSize(11);
  
  // Total Cost
  doc.setFont('helvetica', 'bold');
  doc.text(t('totalCost'), 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(`Rs ${crop.totalCost?.toFixed(2) || '0.00'}`, 170, yPos);
  yPos += 8;
  
  // Production & Profit (if completed)
  if (crop.status === 'पूर्ण' && crop.production) {
    // Unit translation for production
    const unitTranslation = {
      'किलोग्राम': 'kg',
      'लीटर': 'ltr',
      'पैकेट': 'pkt',
      'बोरी': 'bag',
      'क्विंटल': 'quintal',
      'टन': 'ton'
    };
    const prodUnit = unitTranslation[crop.production.unit] || crop.production.unit;
    
    doc.setFont('helvetica', 'bold');
    doc.text(t('production'), 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(`${crop.production.quantity} ${prodUnit}`, 170, yPos);
    yPos += 8;
    
    doc.setFont('helvetica', 'bold');
    doc.text(t('sellingPrice'), 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(`Rs ${crop.production.sellingPrice}/${prodUnit}`, 170, yPos);
    yPos += 8;
    
    doc.setFont('helvetica', 'bold');
    doc.text(t('totalIncome'), 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(`Rs ${crop.totalIncome?.toFixed(2) || '0.00'}`, 170, yPos);
    yPos += 10;
    
    // Net Profit/Loss with highlight
    const isProfit = crop.netProfit >= 0;
    doc.setFillColor(isProfit ? 144 : 220, isProfit ? 238 : 20, isProfit ? 144 : 60);
    doc.rect(15, yPos - 5, 180, 10, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(isProfit ? 0 : 139, isProfit ? 100 : 0, 0);
    doc.text(isProfit ? t('netProfit') : t('netLoss'), 20, yPos);
    doc.text(`Rs ${Math.abs(crop.netProfit || 0).toFixed(2)}`, 170, yPos);
    doc.setTextColor(0, 0, 0);
  }
  
  // Footer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(128, 128, 128);
  const footerText = `${t('reportGenerated')} ${new Date().toLocaleDateString('en-IN')} ${new Date().toLocaleTimeString('en-IN')}`;
  doc.text(footerText, 105, 285, { align: 'center' });
  
  // Open PDF in new tab for preview instead of auto-download
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, '_blank');
};
