import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: [
      'Labour',
      'Tractor',
      'Paddy Threshing',
      'Fertilizer',
      'Seeds',
      'Paani',
      'Other',
      // Backward compatible labels
      'Labour Charge',
      'Tractor Charge',
      'Threshing Charge',
      'Fertilizer Cost',
      'Seeds Cost',
      'Irrigation Cost',
      'Other Expenses'
    ]
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    required: true
  },
  daysOfWork: {
    type: Number,
    min: 1
  },
  description: {
    type: String,
    trim: true
  }
}, { _id: true });

const saleSchema = new mongoose.Schema({
  weight: {
    type: Number,
    min: 0
  },
  weightUnit: {
    type: String,
    enum: ['kg', 'quintal', 'ton'],
    default: 'kg'
  },
  ratePerUnit: {
    type: Number,
    min: 0
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    trim: true
  }
}, { _id: true });

const cropSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Crop name is required'],
    trim: true
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  landArea: {
    type: Number,
    required: [true, 'Land area is required'],
    min: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['Acre', 'Bigha'],
    default: 'Acre'
  },
  location: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Active', 'Completed'],
    default: 'Active'
  },
  expenses: [expenseSchema],
  sales: [saleSchema]
}, {
  timestamps: true
});
cropSchema.set('toObject', { virtuals: true });
cropSchema.set('toJSON', { virtuals: true });

// Index for faster queries
cropSchema.index({ userId: 1, status: 1 });


// Virtual for total expenses
cropSchema.virtual('totalExpense').get(function() {
  return this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
});

// Virtual for total sales
cropSchema.virtual('totalSales').get(function() {
  return this.sales?.reduce((sum, sale) => sum + sale.amount, 0) || 0;
});

// Virtual for profit
cropSchema.virtual('profit').get(function() {
  return this.totalSales - this.totalExpense;
});

// Virtual for cost per unit area
cropSchema.virtual('costPerUnit').get(function() {
  return this.landArea > 0 ? this.totalExpense / this.landArea : 0;
});

const Crop = mongoose.model('Crop', cropSchema);

export default Crop;
