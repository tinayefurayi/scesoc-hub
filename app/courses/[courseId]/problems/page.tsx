import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface ProblemSummary {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question_markdown: string;
  module: { title: string };
}

export default async function ProblemsList({ params }: { params: { courseId: string } }) {
  const { courseId } = params;

  const { data: rawProblems } = await supabase
    .from('problems')
    .select(`
      id, difficulty, question_markdown,
      module:course_modules!inner ( title, course_id )
    `)
    .eq('module.course_id', courseId)
    .order('difficulty', { ascending: true }); // Easy first

  const problems = rawProblems as unknown as ProblemSummary[];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Practice Problems</h1>
      
      <div className="grid gap-4">
        {problems?.map((prob) => (
          <Link 
            key={prob.id}
            href={`/courses/${courseId}/problems/${prob.id}`}
            className="bg-surface hover:bg-surface-subtle border border-white/5 hover:border-brand/50 p-6 rounded-xl transition-all group flex justify-between items-center"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded
                  ${prob.difficulty === 'easy' ? 'bg-green-500/10 text-green-400' : 
                    prob.difficulty === 'medium' ? 'bg-yellow-500/10 text-yellow-400' : 
                    'bg-red-500/10 text-red-400'}`
                }>
                  {prob.difficulty}
                </span>
                <span className="text-slate-500 text-xs">{prob.module.title}</span>
              </div>
              <p className="text-slate-300 font-medium line-clamp-1 group-hover:text-brand">
                {prob.question_markdown.replace(/[#*`]/g, '')}
              </p>
            </div>
            <ArrowRight className="text-slate-600 group-hover:text-white" />
          </Link>
        ))}

        {(!problems || problems.length === 0) && (
          <div className="text-slate-500">No problems available yet.</div>
        )}
      </div>
    </div>
  );
}