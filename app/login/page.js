'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Briefcase } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters'),
});

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

export default function LoginPage() {
  const [showPw, setShowPw] = useState(false);
  const { login, loginWithGoogle } = useAuth();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values) {
    try {
      await login(values.email, values.password);
      toast.success('Welcome back!');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    }
  }

  async function handleGoogle() {
    try {
      await loginWithGoogle();
    } catch (err) {
      toast.error(err.message || 'Google login failed');
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
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-1">Welcome back</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-8">Sign in to your InternHub account</p>

        <button
          onClick={handleGoogle}
          type="button"
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition mb-4"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-700" /></div>
          <div className="relative flex justify-center text-xs text-gray-400 bg-white dark:bg-gray-800 px-2">or continue with email</div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
          <div className="relative">
            <Input label="Password" type={showPw ? 'text' : 'password'} placeholder="••••••••" error={errors.password?.message} {...register('password')} />
            <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-8 text-gray-400 hover:text-gray-600">
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <div className="text-right">
            <Link href="/forgot-password" className="text-xs text-blue-600 hover:underline">Forgot password?</Link>
          </div>
          <Button type="submit" className="w-full" loading={isSubmitting}>Log in</Button>
        </form>

        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-blue-600 font-medium hover:underline">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}
