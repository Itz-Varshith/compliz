"use client"

import useSWR from "swr"


const fetcher = async (url) => {
  const res = await fetch(url, {
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Request failed ${res.status}: ${text}`)
  }
  return (await res.json()) 
}

function formatDate(iso) {
  if (!iso) return ""
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

function VerdictBadge({ verdict }) {
  const v = verdict?.toLowerCase()
  const base = "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
  const cls =
    v === "accepted"
      ? `${base} bg-green-600/15 text-green-600`
      : v?.includes("error")
        ? `${base} bg-red-600/15 text-red-600`
        : `${base} bg-amber-600/15 text-amber-600`
  return <span className={cls}>{verdict || "Unknown"}</span>
}

export default function PastSubmissions() {
  const { data, error, isLoading } = useSWR("http://localhost:5000/submission/all", fetcher, {
    revalidateOnFocus: false,
  })

  if (isLoading) {
    return (
      <div aria-busy="true" className="text-sm text-muted-foreground">
        Loading submissions…
      </div>
    )
  }

  if (error) {
    return (
      <div role="alert" className="text-sm text-red-600">
        Failed to load submissions: {error.message}
      </div>
    )
  }

  const submissions = data?.submissions ?? []
  const questions = data?.questions ?? []
  const qMap = new Map()
  for (const q of questions) qMap.set(q._id, q)

  if (!submissions.length) {
    return <div className="text-sm text-muted-foreground">No submissions found.</div>
  }

  return (
    <ul className="flex flex-col gap-4">
      {submissions.map((s, idx) => {
        const qTitle = qMap.get(s.questionID?.questionUUID || "")?.title || "Unknown Question"
        return (
          <li key={`${s.createdAt}-${idx}`} className="rounded-md border border-border bg-card p-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <h4 className="text-sm font-medium text-foreground text-pretty">{qTitle}</h4>
                  <p className="text-xs text-muted-foreground">{formatDate(s.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <VerdictBadge verdict={s.verdict} />
                  <span className="text-xs text-muted-foreground">{s.langId?.toUpperCase()}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span>
                  Time: <span className="text-foreground">{s.timeUsed} ms</span>
                </span>
                <span>
                  Memory: <span className="text-foreground">{s.memoryUsed} KB</span>
                </span>
                <span>
                  Passed: <span className="text-foreground">{s.isPassed ? "Yes" : "No"}</span>
                </span>
              </div>

              <details className="group">
                <summary className="cursor-pointer select-none text-xs text-primary hover:underline">
                  View submitted code
                </summary>
                <pre className="mt-2 max-h-64 overflow-auto rounded-md bg-muted p-3 text-xs leading-5">
                  {`// Language: ${s.langId}
${s.code || "// (no code provided)"}`}
                </pre>
              </details>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
