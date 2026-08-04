/**
 * In-memory rate limiter for auth endpoints.
 *
 * Storage: a module-level Map that persists for the lifetime of the Node.js
 * process. Correct for a single Render instance. If the app ever scales to
 * multiple instances, replace both Maps with a shared Redis/Upstash store —
 * the exported function signatures stay identical, only the internals change.
 *
 * Clean-up: expired entries are pruned every 60 s to prevent unbounded growth.
 */

type WindowEntry = { count: number; resetAt: number };
type FailureEntry = { failures: number; resetAt: number };

const windows = new Map<string, WindowEntry>();
const failures = new Map<string, FailureEntry>();

// Prune stale entries every minute.
// .unref() prevents this timer from keeping the process alive in tests.
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of windows) if (v.resetAt < now) windows.delete(k);
  for (const [k, v] of failures) if (v.resetAt < now) failures.delete(k);
}, 60_000).unref();

// ---- fixed-window limiter ------------------------------------------------

export type RateLimitResult =
  { limited: false } | { limited: true; retryAfterMs: number };

/**
 * Fixed-window rate limiter.
 * Returns `limited: true` if the key has exceeded `max` requests
 * within the current `windowMs` window.
 */
export function checkLimit(
  key: string,
  max: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const e = windows.get(key);

  if (!e || e.resetAt < now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { limited: false };
  }

  if (e.count >= max) {
    return { limited: true, retryAfterMs: e.resetAt - now };
  }

  e.count++;
  return { limited: false };
}

// ---- per-email progressive throttle (login only) -------------------------
//
// Progressive backoff schedule — never a hard lockout (prevents griefing):
//   ≤ 3 failures  →    0 ms  (no delay, normal wrong-password UX)
//     4 failures  →    2 s
//     5 failures  →    5 s
//   6+ failures   →   15 s × (n − 5), capped at 60 s
//
// Failure counter resets after 15 minutes with no further failures.
// The delay is applied server-side (await sleep) before returning 401,
// which makes each brute-force attempt progressively slower without
// ever locking a legitimate user out of their account.

const EMAIL_FAIL_TTL = 15 * 60_000; // 15 min

export function recordFailure(email: string): number {
  const now = Date.now();
  const key = `f:${email}`;
  const e = failures.get(key);
  const n = e && e.resetAt > now ? e.failures + 1 : 1;
  failures.set(key, { failures: n, resetAt: now + EMAIL_FAIL_TTL });
  return backoffMs(n);
}

/** Call on successful login to reset the failure counter for this email. */
export function clearFailures(email: string): void {
  failures.delete(`f:${email}`);
}

function backoffMs(n: number): number {
  if (n <= 3) return 0;
  if (n === 4) return 2_000;
  if (n === 5) return 5_000;
  return Math.min(15_000 * (n - 5), 60_000); // cap at 60 s
}

// ---- IP extraction -------------------------------------------------------
//
// Render sits behind a proxy that sets x-forwarded-for.
// Take the first (leftmost) IP — that is the real client address.

export function getIP(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
 if (xff) return xff.split(',').pop()?.trim() ?? 'unknown';
  const ri = req.headers.get('x-real-ip');
  if (ri) return ri.trim();
  return 'unknown';
}

// ---- convenience: 429 response -------------------------------------------

export function tooManyRequests(retryAfterMs: number): Response {
  return Response.json(
    { error: 'Too many attempts. Please try again later.' },
    {
      status: 429,
      headers: { 'Retry-After': String(Math.ceil(retryAfterMs / 1000)) },
    },
  );
}
