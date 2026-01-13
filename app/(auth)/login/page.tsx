import Link from 'next/link';
import { login } from '@/app/actions/auth';

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string, message?: string }
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Welcome back</h2>
        <p className="text-slate-400 text-sm mt-1">Sign in to access course materials</p>
      </div>

      {searchParams.error && (
        <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-red-400 text-xs text-center">
          {searchParams.error}
        </div>
      )}

      <form className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Email Address</label>
          <input 
            name="email" 
            type="email" 
            required 
            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-brand focus:outline-none transition-colors"
            placeholder="student@cmail.carleton.ca"
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Password</label>
          <input 
            name="password" 
            type="password" 
            required 
            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-brand focus:outline-none transition-colors"
            placeholder="••••••••"
          />
        </div>

        <button 
          formAction={login}
          className="w-full bg-brand text-black font-bold py-3 rounded-lg hover:bg-brand-dark transition-all transform hover:scale-[1.02]"
        >
          Sign In
        </button>
      </form>

      <div className="text-center text-sm text-slate-400">
        Don't have an account?{' '}
        <Link href="/signup" className="text-brand hover:underline font-bold">
          Sign up
        </Link>
      </div>
    </div>
  );
}