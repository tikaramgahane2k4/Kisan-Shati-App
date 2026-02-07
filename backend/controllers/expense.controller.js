import Crop from '../models/Crop.model.js';

// @desc    Add expense to crop
// @route   POST /api/expenses/:cropId
// @access  Private
export const addExpense = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.cropId);

    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    // Make sure user owns crop
    if (crop.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    crop.expenses.push(req.body);
    await crop.save();

    res.status(201).json({
      success: true,
      data: crop
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:cropId/:expenseId
// @access  Private
export const updateExpense = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.cropId);

    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    // Make sure user owns crop
    if (crop.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const expense = crop.expenses.id(req.params.expenseId);

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    // Update expense fields
    Object.assign(expense, req.body);
    await crop.save();

    res.json({
      success: true,
      data: crop
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:cropId/:expenseId
// @access  Private
export const deleteExpense = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.cropId);

    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    // Make sure user owns crop
    if (crop.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    crop.expenses.pull(req.params.expenseId);
    await crop.save();

    res.json({
      success: true,
      data: crop
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
