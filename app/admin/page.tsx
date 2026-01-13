import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { approveEdit, rejectEdit } from '@/app/actions/admin/admin';
import { Check, X, FileText, User, Calendar } from 'lucide-react';
import { redirect } from 'next/navigation';

interface WikiEditWithDetails {
  id: string;
  page_id: string;
  user_id: string;
  proposed_content: string;
  comment: string | null;
  status: string;
  created_at: string;
  page: { title: string; content: string };
  user: { full_name: string; email: string } | null;
}

export default async function AdminDashboard() {
  // Setup Server Client to Check Auth
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {} // We don't write cookies in a page render
      }
    }
  );

  // Check Admin Status
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/courses'); // Kick out if not logged in

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const userProfile = profile as { role: string } | null;
  
  if (userProfile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-subtle text-slate-400">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p>You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  // 3. Fetch Pending Edits
  const { data: rawEdits } = await supabase
    .from('wiki_edits')
    .select(`
      *,
      page:wiki_pages (title, content),
      user:profiles (full_name, email)
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  const edits = rawEdits as unknown as WikiEditWithDetails[];

  return (
    <div className="min-h-screen bg-surface-subtle p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-slate-400">Review pending changes to the Wiki.</p>
          </div>
          <div className="bg-surface border border-white/10 px-4 py-2 rounded-lg">
            <span className="text-slate-400 text-sm">Pending: </span>
            <span className="text-brand font-bold text-lg ml-1">{edits?.length || 0}</span>
          </div>
        </div>

        <div className="space-y-6">
          {edits?.map((edit) => (
            <div key={edit.id} className="bg-surface rounded-xl border border-white/10 overflow-hidden shadow-xl">
              
              {/* Header */}
              <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <h3 className="font-bold text-brand flex items-center gap-2 text-lg">
                    <FileText size={20} />
                    {edit.page?.title || 'Unknown Page'}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {edit.user?.full_name || 'Anonymous'}
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

              {/* Diff View */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10 border-b border-white/10">
                <div className="p-6">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">Original</span>
                  <div className="h-64 overflow-y-auto text-sm font-mono text-slate-400 bg-black/20 p-4 rounded-lg border border-white/5 whitespace-pre-wrap">
                    {edit.page?.content}
                  </div>
                </div>
                <div className="p-6 bg-brand/5">
                  <span className="text-xs font-bold text-brand uppercase tracking-widest mb-3 block">Proposed</span>
                  <div className="h-64 overflow-y-auto text-sm font-mono text-slate-200 bg-surface-subtle p-4 rounded-lg border border-brand/20 whitespace-pre-wrap">
                    {edit.proposed_content}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 flex justify-end gap-3 bg-white/5">
                <form action={rejectEdit}>
                  <input type="hidden" name="editId" value={edit.id} />
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 border border-transparent transition-all">
                    <X size={18} /> Reject
                  </button>
                </form>

                <form action={approveEdit}>
                  <input type="hidden" name="editId" value={edit.id} />
                  <input type="hidden" name="pageId" value={edit.page_id} />
                  <input type="hidden" name="proposedContent" value={edit.proposed_content} />
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold bg-brand text-black hover:bg-brand-dark transition-all shadow-lg shadow-brand/10">
                    <Check size={18} /> Approve
                  </button>
                </form>
              </div>
            </div>
          ))}

          {(!edits || edits.length === 0) && (
            <div className="text-center py-20 bg-surface rounded-xl border border-dashed border-white/10">
              <p className="text-slate-500">No pending edits.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}