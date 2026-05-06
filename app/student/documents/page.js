'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, XCircle, Clock, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useMyDocuments, useUploadDocument } from '@/hooks/useDocuments';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import PageHeader from '@/components/PageHeader';
import Badge from '@/components/ui/Badge';
import toast from 'react-hot-toast';

const DOC_TYPES = [
  { value: 'nid',           label: 'National ID (NID)',     desc: 'Verify your identity' },
  { value: 'student_id',    label: 'Student ID',            desc: 'Prove your enrollment' },
  { value: 'trade_license', label: 'Trade License',         desc: 'For companies' },
  { value: 'other',         label: 'Other Document',        desc: 'Any supporting document' },
];

const STATUS_CONFIG = {
  pending:  { icon: Clock,         color: 'bg-yellow-100 text-yellow-700', label: 'Under Review' },
  approved: { icon: CheckCircle,   color: 'bg-green-100 text-green-700',   label: 'Approved' },
  rejected: { icon: XCircle,       color: 'bg-red-100 text-red-700',       label: 'Rejected' },
};

export default function DocumentsPage() {
  const { user } = useAuth();
  const { data: docs = [], isLoading } = useMyDocuments(user?.id);
  const upload = useUploadDocument();
  const [docType, setDocType] = useState('nid');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  async function handleFile(file) {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error('File must be under 5 MB');
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowed.includes(file.type)) return toast.error('Only JPG, PNG, WEBP, or PDF allowed');
    try {
      await upload.mutateAsync({ userId: user.id, docType, file });
      toast.success('Document uploaded — pending review');
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    }
  }

  const existingTypes = docs.map(d => d.doc_type);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <PageHeader
        title="My Documents"
        description="Upload verification documents. Approved documents add a verified badge to your profile."
      />

      {/* Upload card */}
      <Card className="p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Document Type</label>
          <div className="grid sm:grid-cols-2 gap-2">
            {DOC_TYPES.map(t => (
              <button
                key={t.value}
                onClick={() => setDocType(t.value)}
                className={`flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-colors ${
                  docType === t.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className={`h-4 w-4 mt-0.5 shrink-0 ${docType === t.value ? 'text-blue-500' : 'text-gray-400'}`} />
                <div>
                  <p className={`text-sm font-medium ${docType === t.value ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}>{t.label}</p>
                  <p className="text-xs text-gray-400">{t.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
            dragOver ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
          }`}
        >
          <Upload className="h-8 w-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {upload.isPending ? 'Uploading…' : 'Drop file here or click to browse'}
          </p>
          <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP, PDF — max 5 MB</p>
          <input ref={fileRef} type="file" className="hidden" accept=".jpg,.jpeg,.png,.webp,.pdf" onChange={e => handleFile(e.target.files[0])} />
        </div>
      </Card>

      {/* Uploaded documents */}
      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}</div>
      ) : docs.length > 0 && (
        <Card>
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white">Uploaded Documents</h3>
          </div>
          <ul className="divide-y divide-gray-50 dark:divide-gray-800">
            {docs.map(doc => {
              const cfg = STATUS_CONFIG[doc.status];
              const Icon = cfg.icon;
              return (
                <li key={doc.id} className="px-5 py-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="h-5 w-5 text-gray-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{doc.file_name}</p>
                      <p className="text-xs text-gray-400">{DOC_TYPES.find(t => t.value === doc.doc_type)?.label}</p>
                      {doc.rejection_reason && (
                        <p className="text-xs text-red-500 mt-0.5">Reason: {doc.rejection_reason}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                      <Icon className="h-3 w-3" />{cfg.label}
                    </span>
                    {doc.file_url && (
                      <a href={doc.file_url} target="_blank" rel="noreferrer">
                        <Button size="sm" variant="ghost" className="text-xs text-blue-500">View</Button>
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </div>
  );
}
