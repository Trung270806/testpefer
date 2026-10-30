'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { LogIn, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { signIn } = useApp();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const validateEmail = (val: string) => {
    if (!val.trim()) return 'Email is required';
    if (!isValidEmail(val)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (val: string) => {
    if (!val) return 'Password is required';
    return '';
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (hasSubmitted) {
      setEmailError(validateEmail(val));
    }
    setAuthError('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    if (hasSubmitted) {
      setPasswordError(validatePassword(val));
    }
    setAuthError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    setAuthError('');

    const errEmail = validateEmail(email);
    const errPwd = validatePassword(password);

    setEmailError(errEmail);
    setPasswordError(errPwd);

    if (errEmail || errPwd) {
      return;
    }

    setLoading(true);
    try {
      const res = await signIn(email.trim(), password);
      if (res.error) {
        setAuthError(res.error.message || 'Login failed');
      } else {
        router.push('/expenses');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Login error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-xl border-muted-foreground/20">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
            <LogIn className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
          <CardDescription>
            Enter your credentials to access your expenses
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form data-testid="login-form" noValidate onSubmit={handleSubmit} className="space-y-4">
            {/* Auth error message */}
            {authError && (
              <div
                data-testid="error-auth"
                className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive border border-destructive/20"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                data-testid="login-email"
                placeholder="name@example.com"
                value={email}
                onChange={handleEmailChange}
                className={emailError ? 'border-destructive focus-visible:ring-destructive' : ''}
              />
              {emailError && (
                <p data-testid="error-email" className="text-xs font-medium text-destructive">
                  {emailError}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                data-testid="login-password"
                placeholder="••••••••"
                value={password}
                onChange={handlePasswordChange}
                className={passwordError ? 'border-destructive focus-visible:ring-destructive' : ''}
              />
              {passwordError && (
                <p data-testid="error-password" className="text-xs font-medium text-destructive">
                  {passwordError}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              data-testid="login-submit"
              className="w-full mt-2 cursor-pointer"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Login'}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t py-4 text-center text-sm text-muted-foreground">
          <span>
            Don't have an account?{' '}
            <Link href="/register" className="font-semibold text-primary hover:underline underline-offset-4">
              Register
            </Link>
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}
