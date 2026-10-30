-- Create expenses table
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    amount NUMERIC NOT NULL CHECK (amount > 0),
    category TEXT NOT NULL CHECK (category IN ('Food', 'Transport', 'Shopping', 'Bills', 'Other')),
    spent_on DATE NOT NULL,
    note TEXT DEFAULT '' CHECK (char_length(COALESCE(note, '')) <= 100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_spent_on ON public.expenses(spent_on DESC, created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- 1. SELECT policy: Users can only see their own rows
CREATE POLICY "Users can view own expenses"
    ON public.expenses
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- 2. INSERT policy: Users can only insert rows belonging to their own user_id
CREATE POLICY "Users can insert own expenses"
    ON public.expenses
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- 3. DELETE policy: Users can only delete their own rows
CREATE POLICY "Users can delete own expenses"
    ON public.expenses
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- 4. UPDATE policy: Users can only update their own rows
CREATE POLICY "Users can update own expenses"
    ON public.expenses
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
