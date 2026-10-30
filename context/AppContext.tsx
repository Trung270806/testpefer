'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { supabase, isPlaceholderSupabase } from '@/lib/supabaseClient';

export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  category: string;
  spent_on: string;
  note?: string;
  created_at?: string;
}

export interface User {
  id: string;
  email: string;
}

interface BreakdownItem {
  category: string;
  total: number;
}

interface AppContextType {
  user: User | null;
  authLoading: boolean;
  expenses: Expense[];
  expensesLoading: boolean;
  categoryFilter: string;
  monthFilter: string;
  filteredExpenses: Expense[];
  totalAmount: number;
  expenseCount: number;
  categoryBreakdown: BreakdownItem[];
  setCategoryFilter: (category: string) => void;
  setMonthFilter: (month: string) => void;
  clearFilters: () => void;
  signUp: (email: string, password: string) => Promise<{ error: Error | null; data?: any }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; data?: any }>;
  signOut: () => Promise<void>;
  addExpense: (expense: { amount: number; category: string; spent_on: string; note?: string }) => Promise<{ error: Error | null; data?: Expense }>;
  deleteExpense: (id: string) => Promise<{ error: Error | null }>;
  refreshExpenses: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_MOCK_USERS = [
  { id: 'mock-user-1', email: '1@gmail.com', password: '123456' },
  { id: 'mock-user-grader', email: 'grader.qe200012@example.com', password: 'Test1234!' }
];

const DEFAULT_SAMPLE_EXPENSES: Expense[] = [
  {
    id: 'exp-demo-1',
    user_id: 'mock-user-1',
    amount: 15.5,
    category: 'Food',
    spent_on: '2026-10-28',
    note: 'Lunch with colleagues',
    created_at: '2026-10-28T12:00:00Z',
  },
  {
    id: 'exp-demo-2',
    user_id: 'mock-user-1',
    amount: 25.0,
    category: 'Transport',
    spent_on: '2026-10-29',
    note: 'Taxi to downtown',
    created_at: '2026-10-29T08:30:00Z',
  },
  {
    id: 'exp-demo-3',
    user_id: 'mock-user-1',
    amount: 60.0,
    category: 'Shopping',
    spent_on: '2026-10-30',
    note: 'Groceries and home supplies',
    created_at: '2026-10-30T09:15:00Z',
  },
];

const getStoredMockUsers = () => {
  if (typeof window === 'undefined') return DEFAULT_MOCK_USERS;
  try {
    const raw = localStorage.getItem('spendwise_mock_users');
    let list = raw ? JSON.parse(raw) : [];
    if (!list.some((u: any) => u.email.toLowerCase() === '1@gmail.com')) {
      list = [...DEFAULT_MOCK_USERS, ...list];
      localStorage.setItem('spendwise_mock_users', JSON.stringify(list));
    }
    return list;
  } catch {
    return DEFAULT_MOCK_USERS;
  }
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expensesLoading, setExpensesLoading] = useState(false);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');

  // 1. Initial auth check
  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      try {
        if (isPlaceholderSupabase) {
          // Local mock mode: ensure default accounts exist
          if (typeof window !== 'undefined') {
            getStoredMockUsers();
            const stored = localStorage.getItem('spendwise_mock_current_user');
            if (stored && mounted) {
              setUser(JSON.parse(stored));
            }
          }
          if (mounted) setAuthLoading(false);
          return;
        }

        // Real Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Auth getSession error:', error);
        }
        if (mounted) {
          if (session?.user?.email) {
            setUser({ id: session.user.id, email: session.user.email });
          } else {
            setUser(null);
          }
          setAuthLoading(false);
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (!mounted) return;
          if (session?.user?.email) {
            setUser({ id: session.user.id, email: session.user.email });
          } else {
            setUser(null);
            setExpenses([]);
          }
          setAuthLoading(false);
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error('checkAuth catch:', err);
        if (mounted) setAuthLoading(false);
      }
    }

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

  // 2. Fetch expenses when user changes or logs in
  const fetchExpensesForUser = async (currentUser: User | null) => {
    if (!currentUser) {
      setExpenses([]);
      return;
    }

    setExpensesLoading(true);
    try {
      if (isPlaceholderSupabase) {
        if (typeof window !== 'undefined') {
          const key = `spendwise_mock_expenses_${currentUser.id}`;
          let stored = localStorage.getItem(key);
          if (!stored && currentUser.email === '1@gmail.com') {
            localStorage.setItem(key, JSON.stringify(DEFAULT_SAMPLE_EXPENSES));
            stored = JSON.stringify(DEFAULT_SAMPLE_EXPENSES);
          }
          const parsed: Expense[] = stored ? JSON.parse(stored) : [];
          // Sort newest date first, then newest created_at first
          parsed.sort((a, b) => {
            if (b.spent_on !== a.spent_on) {
              return b.spent_on.localeCompare(a.spent_on);
            }
            return (b.created_at || '').localeCompare(a.created_at || '');
          });
          setExpenses(parsed);
        }
        setExpensesLoading(false);
        return;
      }

      // Real Supabase
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('spent_on', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Fetch expenses error:', error);
      } else if (data) {
        setExpenses(data);
      }
    } catch (err) {
      console.error('fetchExpenses error:', err);
    } finally {
      setExpensesLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchExpensesForUser(user);
    } else {
      setExpenses([]);
    }
  }, [user?.id]);

  // Auth actions
  const signUp = async (email: string, password: string) => {
    if (isPlaceholderSupabase) {
      // Mock signup
      const users: Array<{ id: string; email: string; password: string }> = getStoredMockUsers();
      if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return { error: new Error('User already registered') };
      }
      const newUser = { id: 'mock-user-' + Date.now(), email, password };
      users.push(newUser);
      localStorage.setItem('spendwise_mock_users', JSON.stringify(users));
      return { error: null, data: { user: newUser } };
    }

    // Real Supabase signup
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { error, data };
  };

  const signIn = async (email: string, password: string) => {
    if (isPlaceholderSupabase) {
      const users: Array<{ id: string; email: string; password: string }> = getStoredMockUsers();
      const found = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      if (!found) {
        return { error: new Error('Invalid login credentials') };
      }
      const loggedUser = { id: found.id, email: found.email };
      setUser(loggedUser);
      localStorage.setItem('spendwise_mock_current_user', JSON.stringify(loggedUser));
      return { error: null, data: { user: loggedUser } };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!error && data.session?.user?.email) {
      setUser({ id: data.session.user.id, email: data.session.user.email });
    }
    return { error, data };
  };

  const signOut = async () => {
    if (isPlaceholderSupabase) {
      setUser(null);
      setExpenses([]);
      localStorage.removeItem('spendwise_mock_current_user');
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
    setExpenses([]);
  };

  // Expenses actions
  const addExpense = async (expData: {
    amount: number;
    category: string;
    spent_on: string;
    note?: string;
  }) => {
    if (!user) {
      return { error: new Error('User not logged in') };
    }

    if (isPlaceholderSupabase) {
      const newExp: Expense = {
        id: 'mock-exp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
        user_id: user.id,
        amount: Number(expData.amount),
        category: expData.category,
        spent_on: expData.spent_on,
        note: expData.note || '',
        created_at: new Date().toISOString(),
      };

      const updated = [newExp, ...expenses];
      updated.sort((a, b) => {
        if (b.spent_on !== a.spent_on) {
          return b.spent_on.localeCompare(a.spent_on);
        }
        return (b.created_at || '').localeCompare(a.created_at || '');
      });

      setExpenses(updated);
      localStorage.setItem(`spendwise_mock_expenses_${user.id}`, JSON.stringify(updated));
      return { error: null, data: newExp };
    }

    // Real Supabase insert
    const insertPayload = {
      user_id: user.id,
      amount: Number(expData.amount),
      category: expData.category,
      spent_on: expData.spent_on,
      note: expData.note || '',
    };

    const { data, error } = await supabase
      .from('expenses')
      .insert([insertPayload])
      .select()
      .single();

    if (error) {
      return { error };
    }

    if (data) {
      const updated = [data, ...expenses];
      updated.sort((a, b) => {
        if (b.spent_on !== a.spent_on) {
          return b.spent_on.localeCompare(a.spent_on);
        }
        return (b.created_at || '').localeCompare(a.created_at || '');
      });
      setExpenses(updated);
    }

    return { error: null, data };
  };

  const deleteExpense = async (id: string) => {
    if (!user) return { error: new Error('User not logged in') };

    if (isPlaceholderSupabase) {
      const updated = expenses.filter((e) => e.id !== id);
      setExpenses(updated);
      localStorage.setItem(`spendwise_mock_expenses_${user.id}`, JSON.stringify(updated));
      return { error: null };
    }

    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (!error) {
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    }
    return { error };
  };

  const refreshExpenses = async () => {
    if (user) {
      await fetchExpensesForUser(user);
    }
  };

  const clearFilters = () => {
    setCategoryFilter('');
    setMonthFilter('');
  };

  // Filtered expenses based on category and month
  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      // Category filter: empty = All
      if (categoryFilter && item.category !== categoryFilter) {
        return false;
      }
      // Month filter: format YYYY-MM, empty = all months
      if (monthFilter) {
        if (!item.spent_on.startsWith(monthFilter)) {
          return false;
        }
      }
      return true;
    });
  }, [expenses, categoryFilter, monthFilter]);

  // Summary computations based strictly on filteredExpenses
  const totalAmount = useMemo(() => {
    return filteredExpenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  }, [filteredExpenses]);

  const expenseCount = filteredExpenses.length;

  // Breakdown: one row per category that appears, highest total first
  const categoryBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of filteredExpenses) {
      const cat = item.category;
      const val = Number(item.amount || 0);
      map.set(cat, (map.get(cat) || 0) + val);
    }

    const rows: BreakdownItem[] = [];
    map.forEach((total, category) => {
      rows.push({ category, total });
    });

    // Highest total first
    rows.sort((a, b) => b.total - a.total);
    return rows;
  }, [filteredExpenses]);

  return (
    <AppContext.Provider
      value={{
        user,
        authLoading,
        expenses,
        expensesLoading,
        categoryFilter,
        monthFilter,
        filteredExpenses,
        totalAmount,
        expenseCount,
        categoryBreakdown,
        setCategoryFilter,
        setMonthFilter,
        clearFilters,
        signUp,
        signIn,
        signOut,
        addExpense,
        deleteExpense,
        refreshExpenses,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
