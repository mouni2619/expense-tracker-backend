const express = require('express');
const Expense = require('../models/expense');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new expense
router.post('/', protect, async (req, res) => {
  const { amount, category, date, description } = req.body;
  try {
    const expense = new Expense({
      user: req.user.id,
      amount,
      category,
      date,
      description
    });
    await expense.save();
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/', protect, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!updatedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.delete('/:id', protect, async (req, res) => {
  try {
    const deletedExpense = await Expense.findOneAndDelete(
      { _id: req.params.id, user: req.user.id }
    );
    if (!deletedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json(deletedExpense);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
