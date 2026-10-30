'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut, ArrowRight, User as UserIcon } from 'lucide-react';

export default function Header() {
  const { user, signOut, authLoading } = useApp();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-foreground hover:opacity-90 transition-opacity">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Wallet className="h-5 w-5" />
          </div>
          <span>SpendWise</span>
        </Link>

        <div className="flex items-center gap-3">
          {authLoading ? (
            <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
          ) : user ? (
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                <UserIcon className="h-4 w-4 hidden sm:inline-block" />
                <span data-testid="user-email" className="text-foreground">
                  {user.email}
                </span>
              </div>
              <Link
                href="/expenses"
                data-testid="link-expenses"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline underline-offset-4"
              >
                Expenses
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Button
                type="button"
                variant="outline"
                size="sm"
                data-testid="btn-logout"
                onClick={handleLogout}
                className="gap-1.5 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                data-testid="btn-login"
                onClick={() => router.push('/login')}
                className="cursor-pointer"
              >
                Login
              </Button>
              <Button
                type="button"
                size="sm"
                data-testid="btn-register"
                onClick={() => router.push('/register')}
                className="cursor-pointer"
              >
                Register
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
