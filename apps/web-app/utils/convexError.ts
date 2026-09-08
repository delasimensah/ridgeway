const FALLBACK = "Could not save. Check the fields and try again.";

export interface ConvexErrorInfo {
  code?: string;
  message: string;
}

export function getConvexErrorInfo(error: unknown): ConvexErrorInfo {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = (error as { data: unknown }).data;
    if (typeof data === "object" && data !== null && "code" in data) {
      const code = String((data as { code: unknown }).code);
      const rawMessage = (data as { message?: unknown }).message;
      const message =
        typeof rawMessage === "string" && rawMessage.length > 0
          ? rawMessage
          : code;
      return { code, message };
    }
    if (typeof data === "string" && data.length > 0) {
      return { message: data };
    }
  }

  if (error instanceof Error) {
    const match = /ConvexError:\s*(\{[\s\S]*\})/.exec(error.message);
    if (match !== null) {
      try {
        const parsed = JSON.parse(match[1]) as {
          code?: string;
          message?: string;
        };
        return {
          code: parsed.code,
          message: parsed.message ?? error.message,
        };
      } catch {
        return { message: error.message };
      }
    }
    return { message: error.message };
  }

  return { message: FALLBACK };
}

export function getConvexErrorMessage(
  error: unknown,
  fallback: string = FALLBACK
): string {
  if (error === null || error === undefined) {
    return fallback;
  }

  const { message } = getConvexErrorInfo(error);
  return message.length > 0 ? message : fallback;
}
