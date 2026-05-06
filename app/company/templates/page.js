'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FileText, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useJobTemplates, useDeleteJobTemplate } from '@/hooks/useJobs';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import PageHeader from '@/components/PageHeader';
import toast from 'react-hot-toast';

export default function JobTemplatesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { data: templates = [], isLoading } = useJobTemplates(user?.id);
  const deleteTemplate = useDeleteJobTemplate();

  async function handleDelete(id) {
    if (!confirm('Delete this template?')) return;
    try {
      await deleteTemplate.mutateAsync(id);
      toast.success('Template deleted');
    } catch {
      toast.error('Failed to delete');
    }
  }

  function useTemplate(templateData) {
    const params = new URLSearchParams();
    Object.entries(templateData).forEach(([k, v]) => {
      if (v != null) params.set(k, String(v));
    });
    router.push(`/company/post-job?${params.toString()}`);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <PageHeader
        title="Job Templates"
        description="Reuse your frequently posted job formats"
        action={
          <Button size="sm" onClick={() => router.push('/company/post-job')}>
            <Plus className="h-4 w-4 mr-1" /> Create New Job
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : templates.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">No templates yet</p>
          <p className="text-sm text-gray-400 mt-1 mb-4">
            Save a job as a template when posting to reuse it later.
          </p>
          <Button onClick={() => router.push('/company/post-job')}>
            <Plus className="h-4 w-4 mr-1" /> Post a Job
          </Button>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {templates.map((tpl, i) => (
            <motion.div key={tpl.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">{tpl.name}</p>
                      <p className="text-xs text-gray-400">{tpl.data?.title ?? 'No title'} · {tpl.data?.job_type ?? ''}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(tpl.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  {tpl.data?.location ?? ''}{tpl.data?.work_mode ? ` · ${tpl.data.work_mode}` : ''}
                </p>
                <Button variant="outline" size="sm" className="w-full" onClick={() => useTemplate(tpl.data)}>
                  Use Template <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
