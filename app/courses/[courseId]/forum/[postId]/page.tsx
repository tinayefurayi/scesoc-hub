import { supabase } from '@/lib/supabase';
import { User } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function ThreadPage({ params }: { params: { postId: string } }) {
  const { postId } = params;

  // Fetch the thread + replies
  const { data: post } = await supabase
    .from('forum_posts')
    .select(`*, user:profiles(full_name)`)
    .eq('id', postId)
    .single();

  if (!post) return notFound();

  // Fetch replies separately (simpler for now)
  const { data: replies } = await supabase
    .from('forum_posts')
    .select(`*, user:profiles(full_name)`)
    .eq('parent_id', postId)
    .order('created_at', { ascending: true });

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Main Post */}
      <div className="bg-surface p-8 rounded-xl border border-brand/20 mb-8">
        <h1 className="text-2xl font-bold text-white mb-4">{post.title}</h1>
        <p className="text-slate-300 whitespace-pre-wrap">{post.content}</p>
        <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-2 text-slate-500 text-sm">
          <User size={14} />
          {post.user?.full_name} • {new Date(post.created_at).toLocaleDateString()}
        </div>
      </div>

      {/* Replies */}
      <h3 className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-4">Replies</h3>
      <div className="space-y-4">
        {replies?.map((reply: any) => (
          <div key={reply.id} className="bg-surface p-6 rounded-xl border border-white/5 ml-8">
            <p className="text-slate-300">{reply.content}</p>
            <div className="mt-2 text-xs text-slate-500">
              {reply.user?.full_name} • {new Date(reply.created_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
      
      {/* (Optional) Simple Reply Box placeholder */}
      <div className="mt-8 p-6 bg-white/5 rounded-xl text-center text-slate-500 text-sm">
        Log in to reply to this thread.
      </div>
    </div>
  );
}