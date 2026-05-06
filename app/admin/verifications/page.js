'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, MapPin, Globe, AlertCircle, FileText, ExternalLink } from 'lucide-react';
import { useVerifyCompany, useRejectCompanyVerification, usePendingVerifications } from '@/hooks/useAdmin';
import { useAdminDocuments, useReviewDocument } from '@/hooks/useDocuments';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ListRowSkeleton } from '@/components/SkeletonCard';
import PageHeader from '@/components/PageHeader';
import { Modal } from '@/components/ui/Modal';
import toast from 'react-hot-toast';

const DOC_LABELS = { nid: 'NID', trade_license: 'Trade License', student_id: 'Student ID', other: 'Document' };

export default function VerificationsPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState('companies');
  const { data: companies = [], isLoading: loadingC } = usePendingVerifications();
  const { data: docs = [], isLoading: loadingD } = useAdminDocuments();
  const verifyMutation = useVerifyCompany();
  const rejectMutation = useRejectCompanyVerification();
  const reviewDoc = useReviewDocument();
  const [rejectTarget, setRejectTarget] = useState(null);
  const [note, setNote] = useState('');
  const [rejectDocTarget, setRejectDocTarget] = useState(null);
  const [docNote, setDocNote] = useState('');

  async function handleVerify(id, name) {
    try { await verifyMutation.mutateAsync(id); toast.success(`${name} verified!`); }
    catch (err) { toast.error(err.message); }
  }

  async function handleRejectCompany() {
    if (!note.trim()) return;
    try {
      await rejectMutation.mutateAsync({ id: rejectTarget.id, note });
      toast.success('Rejected'); setRejectTarget(null); setNote('');
    } catch (err) { toast.error(err.message); }
  }

  async function handleDocApprove(doc) {
    try {
      await reviewDoc.mutateAsync({ id: doc.id, status: 'approved', reviewerId: user.id });
      toast.success('Document approved');
    } catch (err) { toast.error(err.message); }
  }

  async function handleDocReject() {
    try {
      await reviewDoc.mutateAsync({ id: rejectDocTarget.id, status: 'rejected', rejectionReason: docNote, reviewerId: user.id });
      toast.success('Document rejected'); setRejectDocTarget(null); setDocNote('');
    } catch (err) { toast.error(err.message); }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <PageHeader title="Verifications" description="Review company and document verification requests" />

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
        {[['companies', `Companies (${companies.length})`], ['documents', `Documents (${docs.length})`]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === key ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Companies Tab */}
      {tab === 'companies' && (
        loadingC ? <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <ListRowSkeleton key={i} />)}</div>
        : companies.length === 0 ? (
          <Card><div className="p-12 text-center"><CheckCircle className="h-12 w-12 text-green-200 mx-auto mb-3" /><p className="text-gray-500 font-medium">No pending verifications</p></div></Card>
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
        )
      )}

      {/* Documents Tab */}
      {tab === 'documents' && (
        loadingD ? <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <ListRowSkeleton key={i} />)}</div>
        : docs.length === 0 ? (
          <Card><div className="p-12 text-center"><FileText className="h-12 w-12 text-gray-200 mx-auto mb-3" /><p className="text-gray-500 font-medium">No pending documents</p></div></Card>
        ) : (
          <div className="space-y-4">
            {docs.map(doc => (
              <Card key={doc.id}>
                <div className="p-5 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <FileText className="h-8 w-8 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{doc.file_name}</p>
                      <p className="text-sm text-gray-500">{DOC_LABELS[doc.doc_type]} · {doc.profiles?.name} ({doc.profiles?.email})</p>
                      <p className="text-xs text-gray-400 capitalize mt-0.5">{doc.profiles?.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <a href={doc.file_url} target="_blank" rel="noreferrer">
                      <Button size="sm" variant="ghost"><ExternalLink className="h-3.5 w-3.5" /> View</Button>
                    </a>
                    <Button size="sm" variant="success" onClick={() => handleDocApprove(doc)} loading={reviewDoc.isPending}>
                      <CheckCircle className="h-4 w-4" /> Approve
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => { setRejectDocTarget(doc); setDocNote(''); }}>
                      <XCircle className="h-4 w-4" /> Reject
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      )}

      {/* Reject Company Modal */}
      <Modal isOpen={!!rejectTarget} onClose={() => setRejectTarget(null)} title="Reject Verification">
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
            <div><p className="font-medium text-sm">{rejectTarget?.company_name}</p><p className="text-xs text-gray-500">{rejectTarget?.profiles?.email}</p></div>
          </div>
          <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} placeholder="Rejection reason..." className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => setRejectTarget(null)}>Cancel</Button>
            <Button variant="danger" size="sm" onClick={handleRejectCompany} disabled={!note.trim()} loading={rejectMutation.isPending}>Reject</Button>
          </div>
        </div>
      </Modal>

      {/* Reject Document Modal */}
      <Modal isOpen={!!rejectDocTarget} onClose={() => setRejectDocTarget(null)} title="Reject Document">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Rejecting <strong>{rejectDocTarget?.file_name}</strong> from <strong>{rejectDocTarget?.profiles?.name}</strong>.</p>
          <textarea value={docNote} onChange={e => setDocNote(e.target.value)} rows={3} placeholder="Reason for rejection..." className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => setRejectDocTarget(null)}>Cancel</Button>
            <Button variant="danger" size="sm" onClick={handleDocReject} loading={reviewDoc.isPending}>Reject</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
