import { supabase } from '@/lib/supabase';
import { checkAdmin } from '@/lib/auth';
import { approveEdit, rejectEdit } from '@/app/actions/admin';
import { Check, X, FileText, Calendar, User } from 'lucide-react';
import { redirect } from 'next/navigation';

// Defines specific shape of expected data from Supabase join query
interface WikiEditWithDetails {
  id: string;
  page_id: string;
  user_id: string;
  proposed_content: string;
  comment: string | null;
  status: string;
  created_at: string;
  page: {
    title: string;
    content: string;
  };
  user: {
    full_name: string;
    email: string;
  } | null;
}

export default async function AdminDashboard() {
  // Security Guard: Check if user is Admin
  const isAdmin = await checkAdmin();
  
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-subtle text-slate-400">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p>You must be an administrator to view this page.</p>
        </div>
      </div>
    );
  }

  // Fetch Pending Edits w/ their Page and User details
  const { data: rawEdits } = await supabase
    .from('wiki_edits')
    .select(`
      *,
      page:wiki_pages (title, content),
      user:profiles (full_name, email)
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  // Force TS to trust custom data structure
  const edits = rawEdits as unknown as WikiEditWithDetails[];

  return (
    <div className="min-h-screen bg-surface-subtle p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-slate-400">Review and moderate community contributions.</p>
          </div>
          <div className="bg-surface border border-white/10 px-4 py-2 rounded-lg">
            <span className="text-slate-400 text-sm">Pending Reviews: </span>
            <span className="text-brand font-bold text-lg ml-1">{edits?.length || 0}</span>
          </div>
        </div>

        <div className="space-y-6">
          {edits?.map((edit) => (
            <div key={edit.id} className="bg-surface rounded-xl border border-white/5 shadow-xl overflow-hidden">
              
              {/* Card Header */}
              <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-brand flex items-center gap-2 text-lg">
                    <FileText size={20} />
                    {edit.page?.title || 'Unknown Page'}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {edit.user?.full_name || 'Unknown User'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(edit.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                {edit.comment && (
                  <div className="bg-brand/10 text-brand text-sm px-4 py-2 rounded-lg border border-brand/20 italic max-w-md">
                    "{edit.comment}"
                  </div>
                )}
              </div>

              {/* Content Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/5 border-b border-white/5">
                {/* Original Content */}
                <div className="p-6">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">
                    Current Content
                  </span>
                  <div className="h-64 overflow-y-auto text-sm font-mono text-slate-400 bg-black/20 p-4 rounded-lg border border-white/5 whitespace-pre-wrap">
                    {edit.page?.content}
                  </div>
                </div>

                {/* Proposed Content */}
                <div className="p-6 bg-brand/5">
                  <span className="text-xs font-bold text-brand uppercase tracking-widest mb-3 block">
                    Proposed Change
                  </span>
                  <div className="h-64 overflow-y-auto text-sm font-mono text-slate-200 bg-surface-subtle p-4 rounded-lg border border-brand/20 whitespace-pre-wrap">
                    {edit.proposed_content}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 flex justify-end gap-3 bg-white/5">
                {/* Reject Form */}
                <form action={rejectEdit}>
                  <input type="hidden" name="editId" value={edit.id} />
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 border border-transparent transition-all">
                    <X size={18} />
                    Reject
                  </button>
                </form>

                {/* Approve Form */}
                <form action={approveEdit}>
                  <input type="hidden" name="editId" value={edit.id} />
                  <input type="hidden" name="pageId" value={edit.page_id} />
                  <input type="hidden" name="proposedContent" value={edit.proposed_content} />
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold bg-brand text-black hover:bg-brand-dark shadow-lg shadow-brand/10 transition-all">
                    <Check size={18} />
                    Approve & Publish
                  </button>
                </form>
              </div>
            </div>
          ))}

          {(!edits || edits.length === 0) && (
            <div className="text-center py-20 bg-surface rounded-xl border border-dashed border-white/10">
              <div className="text-slate-500 text-lg">No pending edits to review.</div>
              <p className="text-slate-600 text-sm mt-2">The Wiki is up to date!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}