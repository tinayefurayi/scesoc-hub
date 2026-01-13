import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { MessageSquare, User } from 'lucide-react';

interface ForumPost {
  id: string;
  title: string;
  created_at: string;
  user: { full_name: string } | null;
}

export default async function ForumPage({ params }: { params: { courseId: string } }) {
  const { courseId } = params;

  // Fetch top-level posts (threads)
  const { data: rawPosts } = await supabase
    .from('forum_posts')
    .select(`
      id, title, created_at,
      user:profiles(full_name)
    `)
    .eq('course_id', courseId)
    .is('parent_id', null) // Only main threads
    .order('created_at', { ascending: false });

  const posts = rawPosts as unknown as ForumPost[];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Discussion Forum</h1>
        <button className="bg-brand text-black font-bold px-4 py-2 rounded-lg text-sm hover:bg-brand-dark transition-colors">
          + New Thread
        </button>
      </div>

      <div className="space-y-4">
        {posts?.map((post) => (
          <Link 
            key={post.id}
            href={`/courses/${courseId}/forum/${post.id}`}
            className="block bg-surface p-6 rounded-xl border border-white/5 hover:border-brand/50 transition-all"
          >
            <h3 className="text-lg font-bold text-white mb-2">{post.title || 'Untitled Discussion'}</h3>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <User size={12} /> {post.user?.full_name || 'Anonymous'}
              </span>
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
          </Link>
        ))}

        {(!posts || posts.length === 0) && (
          <div className="text-slate-500 p-8 border border-dashed border-white/10 rounded-xl text-center">
            No discussions yet. Be the first to post!
          </div>
        )}
      </div>
    </div>
  );
}