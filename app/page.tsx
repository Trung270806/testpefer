'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PlusCircle, Calendar, PieChart, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export default function HomePage() {
  const { user } = useApp();

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-b from-muted/50 to-background border-b">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Smart Personal Finance Tracker</span>
          </div>

          <h1
            data-testid="home-title"
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6"
          >
            SpendWise
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed">
            Take full control of your daily spending. Record your expenses, organize them by categories, filter by months, and gain clear visual insights into where your money actually goes.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {user ? (
              <Button
                size="lg"
                className="h-11 px-8 gap-2 shadow-md cursor-pointer"
                onClick={() => window.location.href = '/expenses'}
              >
                Go to Expenses
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <>
                <Button
                  size="lg"
                  className="h-11 px-8 gap-2 shadow-md cursor-pointer"
                  onClick={() => window.location.href = '/register'}
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-11 px-8 cursor-pointer"
                  onClick={() => window.location.href = '/login'}
                >
                  Sign In
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-16 md:py-20 flex-1">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Everything you need to master your finances
            </h2>
            <p className="mt-2 text-muted-foreground">
              Simple, powerful, and intuitive tools built to help you save more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Feature Card 1 */}
            <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-muted-foreground/20">
              <CardHeader className="space-y-3">
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <PlusCircle className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-bold">Add expenses</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  Easily record what you spend with amounts, precise dates, custom notes, and categorized tags like Food, Transport, Shopping, Bills, or Other.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground font-medium pt-2">
                Fast entry with real-time validation & instant updates.
              </CardContent>
            </Card>

            {/* Feature Card 2 */}
            <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-muted-foreground/20">
              <CardHeader className="space-y-3">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Calendar className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-bold">Filter by month</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  Pinpoint your historical expenses by month or combine with category filters to review exactly what happened during specific billing cycles.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground font-medium pt-2">
                Instant interactive filtering with one-click reset.
              </CardContent>
            </Card>

            {/* Feature Card 3 */}
            <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-muted-foreground/20">
              <CardHeader className="space-y-3">
                <div className="h-12 w-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <PieChart className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-bold">See where money goes</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  View aggregated totals, expense counts, and automated category breakdowns sorted with your highest expenditure areas at the top.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground font-medium pt-2">
                Dynamic live breakdown calculated on every change.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        <div className="container mx-auto px-4">
          SpendWise &copy; 2026 &mdash; FER202 Practical Exam Fall 2026.
        </div>
      </footer>
    </div>
  );
}
