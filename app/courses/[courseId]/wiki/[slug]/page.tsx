import { supabase } from '@/lib/supabase';
import WikiRenderer from '@/components/wiki/WikiRenderer';
import Link from 'next/link';
import { Edit, ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

// Interface for the Wiki Page Join
interface WikiPageData {
  id: string;
  title: string;
  content: string;
  slug: string;
  module: {
    title: string;
    course_id: string;
  };
}

export default async function WikiPageView({ 
  params 
}: { 
  params: { courseId: string; slug: string } 
}) {
  const { courseId, slug } = params;

  // 1. Fetch Page by Slug + Verify it belongs to this Course
  const { data: rawPage } = await supabase
    .from('wiki_pages')
    .select(`
      id, title, content, slug,
      module:course_modules!inner ( title, course_id )
    `)
    .eq('slug', slug)
    .eq('module.course_id', courseId) // Strict check: page must be in this course
    .single();

  if (!rawPage) return notFound();

  const page = rawPage as unknown as WikiPageData;

  return (
    <div className="min-h-screen bg-surface-subtle">
      {/* Header / Breadcrumb */}
      <div className="border-b border-white/5 bg-surface px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <Link 
            href={`/courses/${courseId}`}
            className="text-xs text-brand font-bold uppercase tracking-widest hover:underline flex items-center gap-2 mb-2"
          >
            <ArrowLeft size={12} /> Back to Modules
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-black text-white">{page.title}</h1>
              <p className="text-slate-400 text-sm mt-1">Module: {page.module.title}</p>
            </div>
            
            <Link 
              href={`/courses/${courseId}/wiki/${slug}/edit`}
              className="bg-white/10 hover:bg-brand hover:text-black text-white px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2"
            >
              <Edit size={16} /> Edit Page
            </Link>
          </div>
        </div>
      </div>

      {/* Wiki Content */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="bg-surface rounded-2xl p-8 md:p-12 border border-white/5 shadow-2xl">
          <WikiRenderer content={page.content} />
        </div>
      </div>
    </div>
  );
}