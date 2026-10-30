'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const { signUp } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [authError, setAuthError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
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
    if (val.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const validateConfirmPassword = (val: string, pwdVal: string) => {
    if (!val) return 'Confirm password is required';
    if (val !== pwdVal) return 'Passwords do not match';
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
      if (confirmPassword) {
        setConfirmPasswordError(validateConfirmPassword(confirmPassword, val));
      }
    }
    setAuthError('');
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setConfirmPassword(val);
    if (hasSubmitted) {
      setConfirmPasswordError(validateConfirmPassword(val, password));
    }
    setAuthError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    setAuthError('');
    setSuccessMessage('');

    const errEmail = validateEmail(email);
    const errPwd = validatePassword(password);
    const errConf = validateConfirmPassword(confirmPassword, password);

    setEmailError(errEmail);
    setPasswordError(errPwd);
    setConfirmPasswordError(errConf);

    if (errEmail || errPwd || errConf) {
      return;
    }

    setLoading(true);
    try {
      const res = await signUp(email.trim(), password);
      if (res.error) {
        setAuthError(res.error.message || 'Registration failed');
      } else {
        setSuccessMessage('Registration successful');
        // Clear inputs after successful registration
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setHasSubmitted(false);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Registration error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-xl border-muted-foreground/20">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
            <UserPlus className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
          <CardDescription>
            Enter your details below to register for SpendWise
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form data-testid="register-form" noValidate onSubmit={handleSubmit} className="space-y-4">
            {/* Success message */}
            {successMessage && (
              <div
                data-testid="form-success"
                className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3 text-sm font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

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
              <Label htmlFor="register-email">Email</Label>
              <Input
                id="register-email"
                type="email"
                data-testid="register-email"
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
              <Label htmlFor="register-password">Password</Label>
              <Input
                id="register-password"
                type="password"
                data-testid="register-password"
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

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <Label htmlFor="register-confirm-password">Confirm Password</Label>
              <Input
                id="register-confirm-password"
                type="password"
                data-testid="register-confirm-password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className={confirmPasswordError ? 'border-destructive focus-visible:ring-destructive' : ''}
              />
              {confirmPasswordError && (
                <p data-testid="error-confirm-password" className="text-xs font-medium text-destructive">
                  {confirmPasswordError}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              data-testid="register-submit"
              className="w-full mt-2 cursor-pointer"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Register'}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t py-4 text-center text-sm text-muted-foreground">
          <span>
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline underline-offset-4">
              Sign in
            </Link>
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}
