'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PlusCircle, Trash2, RotateCcw, DollarSign, Calendar, Tag, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ExpensesPage() {
  const router = useRouter();
  const {
    user,
    authLoading,
    filteredExpenses,
    totalAmount,
    expenseCount,
    categoryBreakdown,
    categoryFilter,
    monthFilter,
    setCategoryFilter,
    setMonthFilter,
    clearFilters,
    addExpense,
    deleteExpense,
  } = useApp();

  // Form states
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [spentOn, setSpentOn] = useState('');
  const [note, setNote] = useState('');

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [amountError, setAmountError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [dateError, setDateError] = useState('');
  const [noteError, setNoteError] = useState('');
  const [expenseError, setExpenseError] = useState('');
  const [expenseSuccess, setExpenseSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Protected route check:
  // "While the app is still finding out whether someone is logged in, nothing from this page is shown (no flash of content, no wrong redirect). A logged-in person sees the page with expenses-page."
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return null;
  }

  // Validation functions
  const validateAmount = (val: string) => {
    if (!val || val.trim() === '') return 'Amount is required';
    const num = Number(val);
    if (isNaN(num) || num <= 0) return 'Amount must be greater than 0';
    return '';
  };

  const validateCategory = (val: string) => {
    if (!val || val.trim() === '') return 'Please choose a category';
    return '';
  };

  const validateDate = (val: string) => {
    if (!val) return 'Date is required';
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    if (val > todayStr) {
      return 'Date cannot be in the future';
    }
    return '';
  };

  const validateNote = (val: string) => {
    if (val && val.length > 100) return 'Note must be at most 100 characters';
    return '';
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAmount(val);
    if (hasSubmitted) {
      setAmountError(validateAmount(val));
    }
    setExpenseSuccess('');
    setExpenseError('');
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setCategory(val);
    if (hasSubmitted) {
      setCategoryError(validateCategory(val));
    }
    setExpenseSuccess('');
    setExpenseError('');
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSpentOn(val);
    if (hasSubmitted) {
      setDateError(validateDate(val));
    }
    setExpenseSuccess('');
    setExpenseError('');
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNote(val);
    if (hasSubmitted) {
      setNoteError(validateNote(val));
    }
    setExpenseSuccess('');
    setExpenseError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    setExpenseError('');
    setExpenseSuccess('');

    const errAmt = validateAmount(amount);
    const errCat = validateCategory(category);
    const errDate = validateDate(spentOn);
    const errNote = validateNote(note);

    setAmountError(errAmt);
    setCategoryError(errCat);
    setDateError(errDate);
    setNoteError(errNote);

    if (errAmt || errCat || errDate || errNote) {
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await addExpense({
        amount: Number(amount),
        category,
        spent_on: spentOn,
        note: note.trim(),
      });

      if (res.error) {
        setExpenseError(res.error.message || 'Failed to add expense');
      } else {
        setExpenseSuccess('Expense added');
        // Clear form
        setAmount('');
        setCategory('');
        setSpentOn('');
        setNote('');
        setHasSubmitted(false);
      }
    } catch (err: any) {
      setExpenseError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteExpense(id);
  };

  return (
    <div data-testid="expenses-page" className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column: Add Expense Form & Summary (xl:col-span-5) */}
        <div className="xl:col-span-5 space-y-6">
          {/* Add Expense Form Card */}
          <Card className="shadow-md border-muted-foreground/20">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <PlusCircle className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl font-bold">Add an expense</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <form data-testid="expense-form" noValidate onSubmit={handleSubmit} className="space-y-4">
                {/* Success Message */}
                {expenseSuccess && (
                  <div
                    data-testid="expense-success"
                    className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3 text-sm font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>{expenseSuccess}</span>
                  </div>
                )}

                {/* Expense Error Message */}
                {expenseError && (
                  <div
                    data-testid="error-expense"
                    className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive border border-destructive/20"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{expenseError}</span>
                  </div>
                )}

                {/* Amount */}
                <div className="space-y-1.5">
                  <Label htmlFor="input-amount" className="flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>Amount</span>
                  </Label>
                  <Input
                    id="input-amount"
                    type="number"
                    step="0.01"
                    data-testid="input-amount"
                    placeholder="0.00"
                    value={amount}
                    onChange={handleAmountChange}
                    className={amountError ? 'border-destructive focus-visible:ring-destructive' : ''}
                  />
                  {amountError && (
                    <p data-testid="error-amount" className="text-xs font-medium text-destructive">
                      {amountError}
                    </p>
                  )}
                </div>

                {/* Category Select */}
                <div className="space-y-1.5">
                  <Label htmlFor="select-category" className="flex items-center gap-1.5">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span>Category</span>
                  </Label>
                  <select
                    id="select-category"
                    data-testid="select-category"
                    value={category}
                    onChange={handleCategoryChange}
                    className={`w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      categoryError ? 'border-destructive focus-visible:ring-destructive' : 'border-input'
                    }`}
                  >
                    <option value="">Choose category</option>
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Bills">Bills</option>
                    <option value="Other">Other</option>
                  </select>
                  {categoryError && (
                    <p data-testid="error-category" className="text-xs font-medium text-destructive">
                      {categoryError}
                    </p>
                  )}
                </div>

                {/* Date */}
                <div className="space-y-1.5">
                  <Label htmlFor="input-date" className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Date</span>
                  </Label>
                  <Input
                    id="input-date"
                    type="date"
                    data-testid="input-date"
                    value={spentOn}
                    onChange={handleDateChange}
                    className={dateError ? 'border-destructive focus-visible:ring-destructive' : ''}
                  />
                  {dateError && (
                    <p data-testid="error-date" className="text-xs font-medium text-destructive">
                      {dateError}
                    </p>
                  )}
                </div>

                {/* Note */}
                <div className="space-y-1.5">
                  <Label htmlFor="input-note" className="flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>Note (optional)</span>
                  </Label>
                  <Input
                    id="input-note"
                    type="text"
                    data-testid="input-note"
                    placeholder="e.g. Lunch with team"
                    value={note}
                    onChange={handleNoteChange}
                    className={noteError ? 'border-destructive focus-visible:ring-destructive' : ''}
                  />
                  {noteError && (
                    <p data-testid="error-note" className="text-xs font-medium text-destructive">
                      {noteError}
                    </p>
                  )}
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  data-testid="btn-add-expense"
                  className="w-full cursor-pointer mt-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Adding...' : 'Add Expense'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Expenses Summary Card */}
          <Card className="shadow-md border-muted-foreground/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-lg bg-muted/50 border">
                  <span className="text-xs text-muted-foreground font-medium block mb-1">Total Spent</span>
                  <span data-testid="total-amount" className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="p-3.5 rounded-lg bg-muted/50 border">
                  <span className="text-xs text-muted-foreground font-medium block mb-1">Expenses Count</span>
                  <span data-testid="expense-count" className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
                    {expenseCount}
                  </span>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="pt-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                  Category Breakdown
                </span>
                <div data-testid="category-breakdown" className="space-y-2">
                  {categoryBreakdown.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">No category data available.</p>
                  ) : (
                    categoryBreakdown.map((item) => (
                      <div
                        key={item.category}
                        data-testid="breakdown-row"
                        className="flex items-center justify-between p-2.5 rounded-md bg-muted/40 border border-muted text-sm"
                      >
                        <span data-testid="breakdown-name" className="font-medium text-foreground">
                          {item.category}
                        </span>
                        <span data-testid="breakdown-amount" className="font-semibold text-primary">
                          ${item.total.toFixed(2)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Filters and Expenses List (xl:col-span-7) */}
        <div className="xl:col-span-7 space-y-6">
          {/* Filters Card */}
          <Card className="shadow-md border-muted-foreground/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category Filter */}
                <div className="space-y-1.5">
                  <Label htmlFor="filter-category" className="text-xs font-medium">Category</Label>
                  <select
                    id="filter-category"
                    data-testid="filter-category"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">All</option>
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Bills">Bills</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Month Filter */}
                <div className="space-y-1.5">
                  <Label htmlFor="filter-month" className="text-xs font-medium">Month</Label>
                  <Input
                    id="filter-month"
                    type="month"
                    data-testid="filter-month"
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  data-testid="btn-clear-filters"
                  onClick={clearFilters}
                  className="gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Clear</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Expenses List */}
          <div>
            <h3 className="text-lg font-bold tracking-tight text-foreground mb-4">
              Expense Records ({filteredExpenses.length})
            </h3>

            {filteredExpenses.length === 0 ? (
              <div
                data-testid="expenses-empty"
                className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-muted-foreground/30 bg-muted/20"
              >
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-3">
                  <DollarSign className="h-6 w-6" />
                </div>
                <p className="text-base font-semibold text-foreground">No expenses found</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try clearing your filters or add a new expense from the form.
                </p>
              </div>
            ) : (
              <div data-testid="expense-list" className="space-y-3">
                {filteredExpenses.map((expense) => (
                  <Card
                    key={expense.id}
                    data-testid="expense-item"
                    className="transition-all hover:shadow-md border-muted-foreground/20"
                  >
                    <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            data-testid="expense-category"
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20"
                          >
                            {expense.category}
                          </span>
                          <span
                            data-testid="expense-date"
                            className="text-xs text-muted-foreground font-mono"
                          >
                            {expense.spent_on}
                          </span>
                        </div>
                        <p
                          data-testid="expense-note"
                          className="text-sm text-foreground/80 pt-1 min-h-[1rem]"
                        >
                          {expense.note || ''}
                        </p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0">
                        <span
                          data-testid="expense-amount"
                          className="text-lg font-bold text-foreground font-mono"
                        >
                          ${Number(expense.amount).toFixed(2)}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          data-testid="btn-delete-expense"
                          onClick={() => handleDelete(expense.id)}
                          className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                          title="Delete expense"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
