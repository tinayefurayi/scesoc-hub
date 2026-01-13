import Link from 'next/link';
import { signup } from '@/app/actions/auth';

export default function SignupPage({
  searchParams,
}: {
  searchParams: { error?: string, message?: string }
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Create Account</h2>
        <p className="text-slate-400 text-sm mt-1">Join the engineering community</p>
      </div>

      {/* Success Message (After Email Sent) */}
      {searchParams.message && (
        <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg text-green-400 text-sm text-center">
          <p className="font-bold mb-1">Check your email!</p>
          {searchParams.message}
        </div>
      )}

      {/* Error Message */}
      {searchParams.error && (
        <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-red-400 text-xs text-center">
          {searchParams.error}
        </div>
      )}

      {!searchParams.message && (
        <form className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Full Name</label>
            <input 
              name="fullName" 
              type="text" 
              required 
              className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-brand focus:outline-none transition-colors"
              placeholder="Jane Doe"
            />
          </div>

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
            formAction={signup}
            className="w-full bg-brand text-black font-bold py-3 rounded-lg hover:bg-brand-dark transition-all transform hover:scale-[1.02]"
          >
            Create Account
          </button>
        </form>
      )}

      <div className="text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link href="/login" className="text-brand hover:underline font-bold">
          Sign in
        </Link>
      </div>
    </div>
  );
}