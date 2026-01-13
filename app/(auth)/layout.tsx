import { Zap } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-surface-subtle flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <Link href="/" className="flex items-center justify-center gap-2 group mb-4">
          <div className="bg-brand p-2 rounded-xl transition-transform group-hover:scale-110">
            <Zap size={28} className="text-black" />
          </div>
        </Link>
        <h1 className="text-3xl font-black text-white tracking-tight">
          SCESoc <span className="text-brand">Hub</span>
        </h1>
      </div>

      <div className="w-full max-w-md bg-surface border border-white/10 rounded-2xl shadow-2xl p-8">
        {children}
      </div>

      <div className="mt-8 text-slate-500 text-sm">
        © SCESoc Engineering Society
      </div>
    </div>
  );
}