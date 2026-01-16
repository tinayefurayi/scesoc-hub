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
  // In Next.js 15, params is a Promise
  params: Promise<{ courseId: string }>;
}) {
  // FIX: You must await params in Next.js 15+
  const { courseId } = await params;

  // Verify ID format (Prevent database crashing on "favicon.ico")
  if (!courseId || courseId.length < 10) return notFound();

  const { data: rawCourse, error } = await supabase
    .from('courses')
    .select('code, title')
    .eq('id', courseId)
    .single();

  if (error || !rawCourse) {
    return notFound();
  }

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