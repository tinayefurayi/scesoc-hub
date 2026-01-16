import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function TestPage() {
  console.log("--- STARTING DB TEST ---");
  
  // 1. Check Env Vars
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // 2. Try to fetch courses
  const { data, error } = await supabase.from('courses').select('*');

  console.log("Data Found:", data?.length);
  if (error) console.error("Error:", error);

  return (
    <div className="min-h-screen bg-black text-white p-12 font-mono">
      <h1 className="text-3xl font-bold text-brand mb-8 border-b border-white/20 pb-4">
        🛠️ Database Diagnostic Tool
      </h1>
      
      {/* SECTION 1: API KEYS */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-yellow-400 mb-2">1. Environment Variables</h2>
        <div className="bg-gray-900 p-4 rounded border border-gray-700">
          <p>
            <strong>SUPABASE_URL:</strong>{' '}
            {url ? <span className="text-green-400">✅ Loaded ({url.slice(0, 15)}...)</span> : <span className="text-red-500">❌ MISSING</span>}
          </p>
          <p>
            <strong>SUPABASE_KEY:</strong>{' '}
            {key ? <span className="text-green-400">✅ Loaded ({key.slice(0, 10)}...)</span> : <span className="text-red-500">❌ MISSING</span>}
          </p>
        </div>
      </div>

      {/* SECTION 2: CONNECTION TEST */}
      <div>
        <h2 className="text-xl font-bold text-blue-400 mb-2">2. Database Query Result</h2>
        
        {error ? (
          <div className="bg-red-900/50 p-6 rounded border border-red-500">
            <h3 className="font-bold text-red-200 text-lg">❌ CONNECTION FAILED</h3>
            <p className="mt-2"><strong>Code:</strong> {error.code}</p>
            <p><strong>Message:</strong> {error.message}</p>
            <p className="mt-4 text-sm opacity-80">
              *Hint: If code is "PGRST301" or similar, RLS is blocking you.<br/>
              *Hint: If message mentions "fetch failed", your URL is wrong.
            </p>
          </div>
        ) : (
          <div className="bg-green-900/30 p-6 rounded border border-green-500">
            <h3 className="font-bold text-green-400 text-lg">
              ✅ CONNECTION SUCCESSFUL
            </h3>
            <p className="mb-4">Found <strong>{data?.length || 0}</strong> courses.</p>
            
            {data && data.length > 0 ? (
              <pre className="text-xs bg-black p-4 rounded overflow-auto max-h-96 border border-white/10">
                {JSON.stringify(data, null, 2)}
              </pre>
            ) : (
              <div className="text-yellow-400 font-bold bg-yellow-900/20 p-4 rounded">
                ⚠️ THE DATABASE IS EMPTY. Run the seed script again!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}