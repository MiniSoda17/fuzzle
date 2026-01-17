import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  // #region agent log
  console.log(JSON.stringify({location:'src/app/api/auth/[...supabase]/route.ts:4',message:'API route: GET handler entry',data:{hasCode:!!code,codeLength:code?.length||0,url:requestUrl.toString(),hasEnvUrl:!!process.env.NEXT_PUBLIC_SUPABASE_URL,hasEnvKey:!!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'}));
  // #endregion

  const response = NextResponse.next()

  if (code) {
    // #region agent log
    console.log(JSON.stringify({location:'src/app/api/auth/[...supabase]/route.ts:12',message:'API route: before createServerClient',data:{codeLength:code.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'}));
    // #endregion
    
    try {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return request.cookies.get(name)?.value
            },
            set(name: string, value: string, options: any) {
              request.cookies.set({ name, value, ...options })
              response.cookies.set({ name, value, ...options })
            },
            remove(name: string, options: any) {
              request.cookies.delete({ name, ...options })
              response.cookies.delete({ name, ...options })
            },
          },
        }
      )

      // #region agent log
      console.log(JSON.stringify({location:'src/app/api/auth/[...supabase]/route.ts:32',message:'API route: before exchangeCodeForSession',data:{clientCreated:!!supabase},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'}));
      // #endregion

      const result = await supabase.auth.exchangeCodeForSession(code)
      
      // #region agent log
      console.log(JSON.stringify({location:'src/app/api/auth/[...supabase]/route.ts:37',message:'API route: after exchangeCodeForSession',data:{hasError:!!result.error,hasSession:!!result.data.session,userId:result.data.session?.user?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'}));
      // #endregion

      return NextResponse.redirect(requestUrl.origin)
    } catch (err: any) {
      // #region agent log
      console.log(JSON.stringify({location:'src/app/api/auth/[...supabase]/route.ts:42',message:'API route: catch block',data:{error:err?.message||String(err),errorName:err?.name},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'}));
      // #endregion
      return NextResponse.redirect(requestUrl.origin)
    }
  }

  // Redirect to home page after auth
  return NextResponse.redirect(requestUrl.origin)
}