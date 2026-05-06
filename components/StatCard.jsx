import { Card } from '@/components/ui/Card';

/**
 * Reusable stat card for dashboards (student, company, admin).
 * @param {string} label - stat label
 * @param {string|number} value - stat value
 * @param {React.ElementType} icon - Lucide icon component
 * @param {string} color - Tailwind text color class e.g. "text-blue-600"
 * @param {string} bg - Tailwind bg color class e.g. "bg-blue-50"
 */
export default function StatCard({ label, value, icon: Icon, color = 'text-blue-600', bg = 'bg-blue-50' }) {
  return (
    <Card>
      <div className="p-5 flex items-center gap-4">
        <div className={`h-10 w-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value ?? 0}</p>
          <p className="text-xs text-gray-500 mt-0.5">{label}</p>
        </div>
      </div>
    </Card>
  );
}
