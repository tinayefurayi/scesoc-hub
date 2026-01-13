'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, LayoutDashboard, Settings, User } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-surface-subtle/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-brand p-1.5 rounded-lg transition-transform group-hover:scale-110">
            <Zap size={20} className="text-black" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">
            SCESoc <span className="text-brand">Hub</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link 
            href="/courses" 
            className={`text-sm font-medium transition-colors ${pathname.startsWith('/courses') ? 'text-brand' : 'text-slate-300 hover:text-brand'}`}
          >
            Courses
          </Link>
          <Link 
            href="/admin" 
            className={`text-sm font-medium transition-colors ${pathname === '/admin' ? 'text-brand' : 'text-slate-300 hover:text-brand'}`}
          >
            Admin
          </Link>
        </div>
        
        {/* User Profile / Actions */}
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full text-slate-400 hover:text-brand hover:bg-white/5 transition-all">
            <User size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}