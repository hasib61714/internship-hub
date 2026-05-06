'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, MapPin, Globe, AlertCircle } from 'lucide-react';
import { useVerifyCompany, useRejectCompanyVerification, usePendingVerifications } from '@/hooks/useAdmin';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ListRowSkeleton } from '@/components/SkeletonCard';
import PageHeader from '@/components/PageHeader';
import { Modal } from '@/components/ui/Modal';
import toast from 'react-hot-toast';

export default function VerificationsPage() {
  const { data: companies = [], isLoading } = usePendingVerifications();
  const verifyMutation = useVerifyCompany();
  const rejectMutation = useRejectCompanyVerification();
  const [rejectTarget, setRejectTarget] = useState(null);
  const [note, setNote] = useState('');

  async function handleVerify(id, name) {
    try {
      await verifyMutation.mutateAsync(id);
      toast.success(`${name} verified!`);
    } catch (err) { toast.error(err.message); }
  }

  async function handleRejectSubmit() {
    if (!note.trim()) return;
    try {
      await rejectMutation.mutateAsync({ id: rejectTarget.id, note });
      toast.success('Verification rejected');
      setRejectTarget(null);
      setNote('');
    } catch (err) { toast.error(err.message); }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <PageHeader
        title="Company Verifications"
        description={isLoading ? 'Loading...' : `${companies.length} pending`}
      />

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <ListRowSkeleton key={i} />)}</div>
      ) : companies.length === 0 ? (
        <Card>
          <div className="p-12 text-center">
            <CheckCircle className="h-12 w-12 text-green-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No pending verifications</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {companies.map(company => (
            <Card key={company.id}>
              <div className="p-5 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{company.company_name}</h3>
                  <p className="text-sm text-gray-500">{company.profiles?.email}</p>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
                    {company.company_location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{company.company_location}</span>}
                    {company.website && <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-500 hover:underline"><Globe className="h-3 w-3" />{company.website}</a>}
                    {company.industry && <span>{company.industry}</span>}
                  </div>
                  {company.description && <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{company.description}</p>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="success" onClick={() => handleVerify(company.id, company.company_name)} loading={verifyMutation.isPending}>
                    <CheckCircle className="h-4 w-4" /> Verify
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => { setRejectTarget(company); setNote(''); }}>
                    <XCircle className="h-4 w-4" /> Reject
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={!!rejectTarget} onClose={() => setRejectTarget(null)} title="Reject Verification">
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-sm text-gray-900 dark:text-white">{rejectTarget?.company_name}</p>
              <p className="text-xs text-gray-500">{rejectTarget?.profiles?.email}</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Rejection note <span className="text-red-500">*</span>
            </label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={3}
              placeholder="Explain why verification is being rejected..."
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => setRejectTarget(null)}>Cancel</Button>
            <Button variant="danger" size="sm" onClick={handleRejectSubmit} disabled={!note.trim()} loading={rejectMutation.isPending}>
              Reject Verification
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
