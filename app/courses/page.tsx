import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { Course } from '@/types';

export const dynamic = 'force-dynamic';

export default async function CoursesDirectory() {
  const { data: rawCourses } = await supabase
    .from('courses')
    .select('*')
    .order('code', { ascending: true });

  const courses = rawCourses as unknown as Course[];

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-white mb-8">All Courses</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.map((course) => (
          <Link 
            key={course.id} 
            href={`/courses/${course.id}`}
            className="group bg-surface hover:bg-surface-subtle border border-white/5 hover:border-brand/50 rounded-xl p-6 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-brand/10 text-brand rounded-lg group-hover:bg-brand group-hover:text-black transition-colors">
                <BookOpen size={24} />
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest border border-white/10 px-2 py-1 rounded">
                {course.program}
              </span>
            </div>
            
            <h2 className="text-xl font-bold text-white mb-2 group-hover:text-brand transition-colors">
              {course.code}
            </h2>
            <p className="text-slate-400 text-sm line-clamp-2">
              {course.title}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}