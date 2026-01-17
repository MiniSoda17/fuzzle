import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/0f48da00-b74d-40dc-acbd-e1c9ad29da88',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'src/lib/supabase/client.ts:4',message:'createClient: env vars check',data:{hasUrl:!!process.env.NEXT_PUBLIC_SUPABASE_URL,hasKey:!!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,urlLength:process.env.NEXT_PUBLIC_SUPABASE_URL?.length||0,keyLength:process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length||0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/0f48da00-b74d-40dc-acbd-e1c9ad29da88',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'src/lib/supabase/client.ts:10',message:'createClient: before createBrowserClient',data:{urlDefined:!!url,keyDefined:!!key},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  
  try {
    const client = createBrowserClient(url, key);
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/0f48da00-b74d-40dc-acbd-e1c9ad29da88',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'src/lib/supabase/client.ts:16',message:'createClient: client created successfully',data:{clientCreated:!!client},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    return client;
  } catch (err: any) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/0f48da00-b74d-40dc-acbd-e1c9ad29da88',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'src/lib/supabase/client.ts:21',message:'createClient: error creating client',data:{error:err?.message||String(err),errorName:err?.name},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    throw err;
  }
}