'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Book, FileText, MessageSquare, Home, ChevronRight } from 'lucide-react';

interface SidebarProps {
  courseId: string;
  courseCode: string;
}

export default function Sidebar({ courseId, courseCode }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Overview', href: `/courses/${courseId}`, icon: Home },
    { name: 'Wiki Modules', href: `/courses/${courseId}`, icon: Book }, 
    { name: 'Practice Problems', href: `/courses/${courseId}/problems`, icon: FileText },
    { name: 'Discussion', href: `/courses/${courseId}/forum`, icon: MessageSquare },
  ];

  return (
    <div className="flex flex-col h-full bg-surface border-r border-white/5">
      <div className="p-6">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Current Course</div>
        <h2 className="text-2xl font-black text-brand leading-none">{courseCode}</h2>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                isActive 
                  ? 'bg-brand text-black font-bold shadow-lg shadow-brand/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} />
                <span>{item.name}</span>
              </div>
              {isActive && <ChevronRight size={14} />}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 mt-auto border-t border-white/5">
        <div className="bg-brand/10 rounded-xl p-4 border border-brand/20">
          <p className="text-[10px] uppercase font-bold text-brand tracking-tighter mb-1">Developer</p>
          <p className="text-xs text-slate-300">Logged in as Admin</p>
        </div>
      </div>
    </div>
  );
}