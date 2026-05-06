'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Briefcase, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

const schema = z.object({
  password: z.string().min(8, 'Minimum 8 characters'),
  confirm: z.string(),
}).refine(d => d.password === d.confirm, { message: 'Passwords do not match', path: ['confirm'] });

export default function ResetPasswordPage() {
  const [showPw, setShowPw] = useState(false);
  const [done, setDone] = useState(false);
  const { updatePassword } = useAuth();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  async function onSubmit({ password }) {
    try {
      await updatePassword(password);
      setDone(true);
      setTimeout(() => router.push('/login'), 2500);
    } catch (err) {
      toast.error(err.message || 'Failed to update password');
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

        {done ? (
          <div className="text-center">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Password updated!</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Redirecting you to login...</p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-1">Set new password</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-8">Choose a strong password for your account.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="relative">
                <Input
                  label="New Password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  error={errors.password?.message}
                  {...register('password')}
                />
                <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-8 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                error={errors.confirm?.message}
                {...register('confirm')}
              />
              <Button type="submit" className="w-full" loading={isSubmitting}>Update password</Button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
