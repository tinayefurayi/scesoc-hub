import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ChevronRight, FileText } from 'lucide-react';

// Define the shape of our data
interface ModuleWithPages {
  id: string;
  title: string;
  wiki_pages: {
    slug: string;
    title: string;
  }[];
}

export default async function CourseDashboard({ 
  params 
}: { 
  params: Promise<{ courseId: string }> 
}) {
  // 1. Await params (Required for Next.js 15)
  const { courseId } = await params;

  // 2. Fetch Modules AND their Wiki Pages in one query
  const { data: rawModules } = await supabase
    .from('course_modules')
    .select(`
      id,
      title,
      order_index,
      wiki_pages ( slug, title )
    `)
    .eq('course_id', courseId)
    .order('order_index', { ascending: true });

  const modules = rawModules as unknown as ModuleWithPages[];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Course Modules</h1>
      <p className="text-slate-400 mb-8">Select a topic to start learning.</p>

      <div className="space-y-6">
        {modules?.map((module) => (
          <div key={module.id} className="bg-surface rounded-xl border border-white/5 overflow-hidden">
            {/* Module Header */}
            <div className="bg-white/5 px-6 py-4 border-b border-white/5">
              <h2 className="font-bold text-brand text-lg">{module.title}</h2>
            </div>
            
            {/* List of Wiki Pages */}
            <div className="divide-y divide-white/5">
              {module.wiki_pages.map((page) => (
                <Link 
                  key={page.slug}
                  href={`/courses/${courseId}/wiki/${page.slug}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-slate-500 group-hover:text-brand" />
                    <span className="text-slate-300 group-hover:text-white transition-colors">
                      {page.title}
                    </span>
                  </div>
                  <ChevronRight size={16} className="text-slate-600 group-hover:text-white" />
                </Link>
              ))}
              
              {module.wiki_pages.length === 0 && (
                <div className="px-6 py-4 text-sm text-slate-500 italic">
                  No pages in this module yet.
                </div>
              )}
            </div>
          </div>
        ))}

        {(!modules || modules.length === 0) && (
          <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
            <p className="text-slate-500">No modules found for this course.</p>
          </div>
        )}
      </div>
    </div>
  );
}