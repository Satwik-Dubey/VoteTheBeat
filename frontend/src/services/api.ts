const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"

// for create session

export async function createSession(name: string): Promise<{ id: string }> {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/68c26709-5c59-4b14-a85a-d10b5366cb4e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.ts:6',message:'createSession called',data:{name,apiBaseUrl:API_BASE_URL,fullUrl:`${API_BASE_URL}/sessions`},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  const res = await fetch(`${API_BASE_URL}/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  })
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/68c26709-5c59-4b14-a85a-d10b5366cb4e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.ts:11',message:'fetch response received',data:{status:res.status,statusText:res.statusText,ok:res.ok,url:res.url},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  if (!res.ok) {
    // #region agent log
    const errorText = await res.text().catch(() => res.statusText);
    fetch('http://127.0.0.1:7242/ingest/68c26709-5c59-4b14-a85a-d10b5366cb4e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.ts:14',message:'fetch failed - throwing error',data:{status:res.status,errorText},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    throw new Error(errorText)
  }
  const result = await res.json();
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/68c26709-5c59-4b14-a85a-d10b5366cb4e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.ts:20',message:'createSession success',data:{result},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  return result
}