'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Briefcase, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

const schema = z.object({ email: z.string().email('Invalid email') });

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const { sendPasswordReset } = useAuth();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  async function onSubmit({ email }) {
    try {
      await sendPasswordReset(email);
      setSent(true);
    } catch (err) {
      toast.error(err.message || 'Failed to send reset email');
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
      >
        <div className="flex justify-center mb-6">
          <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <Briefcase className="h-6 w-6 text-blue-600" />
          </div>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Check your email</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              We sent a password reset link. Check your inbox and spam folder.
            </p>
            <Link href="/login">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to login
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-1">Forgot password?</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-8">
              Enter your email and we&apos;ll send a reset link.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email')}
              />
              <Button type="submit" className="w-full" loading={isSubmitting}>
                Send reset link
              </Button>
            </form>

            <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-6">
              <Link href="/login" className="text-blue-600 font-medium hover:underline flex items-center justify-center gap-1">
                <ArrowLeft className="h-3 w-3" /> Back to login
              </Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
