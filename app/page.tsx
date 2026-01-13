import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { BookOpen, Search, GraduationCap, ArrowRight, Database, Zap } from 'lucide-react';
import CourseCard from '@/components/courses/CourseCard';
import { Course } from '@/types';

// Forces dynamic rendering so stats are always up-to-date
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  
  // Fetches Summary Stats (Parallel Requests for Speed)
  const [coursesRes, wikiRes, problemsRes] = await Promise.all([
    supabase.from('courses').select('id', { count: 'exact', head: true }),
    supabase.from('wiki_pages').select('id', { count: 'exact', head: true }),
    supabase.from('problems').select('id', { count: 'exact', head: true })
  ]);

  // Fetches Featured Courses 
  const { data: rawCourses } = await supabase
    .from('courses')
    .select('*')
    .order('code', { ascending: true })
    .limit(6);  // Limit 6 for Homepage

  // Casts the data to 'Course' data type
  const courses = rawCourses as unknown as Course[];

  return (
    <div className="min-h-screen bg-surface-subtle">
      
      {/* HERO SECTION */}
      <div className="relative border-b border-white/5 bg-[#1a1a1a] overflow-hidden">
        
        {/* Background Glow Effect */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 pt-24 pb-24 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-wider mb-6">
              <Zap size={14} />
              <span>Official Engineering Hub</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 leading-tight">
              Master your <br />
              <span className="text-brand">Engineering Degree.</span>
            </h1>
            
            <p className="text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed">
              The central open-source knowledge base for Systems and Computer Engineering students. 
              Course notes, practice problems, and community guides.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link 
                href="/courses" 
                className="bg-brand hover:bg-brand-dark text-black font-bold px-8 py-4 rounded-xl flex items-center gap-2 transition-all hover:scale-105"
              >
                <Search size={20} />
                Find a Course
              </Link>
              <Link 
                href="/admin" 
                className="bg-white/5 hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-xl flex items-center gap-2 border border-white/10 transition-all"
              >
                <Database size={20} />
                Contribute
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="border-t border-white/5 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="flex flex-col">
                <span className="text-3xl font-black text-white">{coursesRes.count || 0}</span>
                <span className="text-xs text-brand uppercase font-bold tracking-wider">Active Courses</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black text-white">{wikiRes.count || 0}</span>
                <span className="text-xs text-brand uppercase font-bold tracking-wider">Wiki Modules</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black text-white">{problemsRes.count || 0}</span>
                <span className="text-xs text-brand uppercase font-bold tracking-wider">Practice Problems</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black text-white">100%</span>
                <span className="text-xs text-brand uppercase font-bold tracking-wider">Open Source</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURED COURSES SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Featured Courses</h2>
            <p className="text-slate-400">Popular resources visited by other students.</p>
          </div>
          <Link 
            href="/courses" 
            className="hidden md:flex items-center gap-2 text-brand font-bold hover:text-brand-light transition-colors"
          >
            View All Courses <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
          
          {(!courses || courses.length === 0) && (
            <div className="col-span-full py-24 text-center border-2 border-dashed border-white/10 rounded-2xl bg-white/5">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white">No courses found</h3>
              <p className="text-slate-500 mt-2 max-w-md mx-auto">
                The database appears to be empty. If you are the developer, please run the seed script to populate data.
              </p>
            </div>
          )}
        </div>
        
        <div className="mt-12 md:hidden text-center">
          <Link 
            href="/courses" 
            className="inline-flex items-center gap-2 text-brand font-bold hover:text-brand-light transition-colors"
          >
             View All Courses <ArrowRight size={18} />
          </Link>
        </div>
      </div>

    </div>
  );
}