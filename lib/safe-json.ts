export function safeParseJson<T>(value: string | null | undefined, fallback: T): T {
  if (value == null || !value.trim()) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export async function safeParseResponseJson<T>(
  response: Response,
  fallback: T
): Promise<T> {
  try {
    const text = await response.text();
    if (!text.trim()) return fallback;
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}
