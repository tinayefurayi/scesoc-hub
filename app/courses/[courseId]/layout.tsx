import { supabase } from '@/lib/supabase';
import Sidebar from '@/components/layout/Sidebar';
import { notFound } from 'next/navigation';

interface CourseInfo {
  code: string;
  title: string;
}

export default async function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) {
  const { courseId } = params;

  // Fetch course details for sidebar header
  const { data: rawCourse, error } = await supabase
    .from('courses')
    .select('code, title')
    .eq('id', courseId)
    .single();

  if (error || !rawCourse) return notFound();

  const course = rawCourse as unknown as CourseInfo;

  return (
    <div className="flex min-h-screen bg-surface-subtle">
      <aside className="w-64 fixed h-full z-10 hidden md:block border-r border-white/5 bg-surface">
        <Sidebar courseId={courseId} courseCode={course.code} />
      </aside>

      <main className="flex-1 md:pl-64">
        {children}
      </main>
    </div>
  );
}