import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export default async function EditWikiPage({ 
  params 
}: { 
  params: { courseId: string; slug: string } 
}) {
  const { slug } = params;

  const { data: page } = await supabase
    .from('wiki_pages')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!page) return notFound();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Propose Edit: {page.title}</h1>
      
      <form className="space-y-6">
        {/* Note: This form won't work without a Server Action, 
            but this is the UI structure requested. */}
        <div>
          <label className="block text-sm font-bold text-slate-400 mb-2">Content (Markdown)</label>
          <textarea 
            name="content"
            defaultValue={page.content}
            className="w-full h-96 bg-black/30 border border-white/10 rounded-xl p-4 text-slate-200 font-mono focus:border-brand focus:outline-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-slate-400 mb-2">Comment (Why are you making this change?)</label>
          <input 
            type="text" 
            name="comment"
            className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-brand focus:outline-none"
            placeholder="e.g., Fixed a typo in the formula..."
          />
        </div>

        <button className="bg-brand text-black font-bold px-6 py-3 rounded-lg hover:bg-brand-dark transition-colors">
          Submit Proposal
        </button>
      </form>
    </div>
  );
}