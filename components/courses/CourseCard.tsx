import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Course } from '@/types';

export default function CourseCard({ course }: { course: Course }) {
  return (
    <Link 
      href={`/courses/${course.id}`}
      className="group flex flex-col bg-surface border border-white/5 rounded-xl overflow-hidden hover:border-brand/50 hover:shadow-[0_0_20px_rgba(242,201,76,0.15)] transition-all duration-300"
    >
      <div className="p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="bg-brand/10 text-brand px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
            {course.code}
          </div>
          <BookOpen size={16} className="text-slate-500 group-hover:text-brand transition-colors" />
        </div>

        {/* Content */}
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand transition-colors">
          {course.title}
        </h3>
        <p className="text-slate-400 text-sm line-clamp-2 mb-6 flex-1">
          {course.description || "No description available."}
        </p>

        {/* Footer */}
        <div className="flex items-center text-sm font-medium text-slate-500 group-hover:text-white transition-colors mt-auto">
          <span>View Resources</span>
          <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}