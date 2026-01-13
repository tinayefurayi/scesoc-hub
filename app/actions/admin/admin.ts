'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Helper to get a secure server-side Supabase client
async function createClient() {
  const cookieStore = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

export async function approveEdit(formData: FormData) {
  const supabase = await createClient()
  
  // Form data retrieved
  const editId = formData.get('editId') as string
  const pageId = formData.get('pageId') as string
  const proposedContent = formData.get('proposedContent') as string

  // Security Check: Ensure User is Admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  const userProfile = profile as { role: string } | null
  if (userProfile?.role !== 'admin') throw new Error('Access Denied')

  // Update Live Wiki Page
  const { error: updateError } = await supabase
    .from('wiki_pages')
    .update({ 
      content: proposedContent,
      last_updated_by: user.id
    })
    .eq('id', pageId)

  if (updateError) throw new Error('Failed to update page')

  // Mark Edit as Approved
  await supabase
    .from('wiki_edits')
    .update({ status: 'approved' })
    .eq('id', editId)

  // Refresh UI
  revalidatePath('/admin')
  revalidatePath('/courses') 
}

export async function rejectEdit(formData: FormData) {
  const supabase = await createClient()
  const editId = formData.get('editId') as string

  // Security Check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const userProfile = profile as { role: string } | null
  if (userProfile?.role !== 'admin') throw new Error('Access Denied')

  // Mark Edit as Rejected
  await supabase
    .from('wiki_edits')
    .update({ status: 'rejected' })
    .eq('id', editId)

  revalidatePath('/admin')
}