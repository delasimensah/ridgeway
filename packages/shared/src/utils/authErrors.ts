/**
 * Map auth failures to a message the user can act on.
 */
export const handleAuthError = (
  error: { message?: string; code?: string } | Error | unknown
): { message: string; code?: string } => {
  const rawMessage =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error !== null && "message" in error
        ? String((error as { message?: string }).message ?? "")
        : "";

  const errorMessages: Record<string, string> = {
    "Invalid account ID": "Invalid email or password. Please try again.",
    InvalidSecret: "Invalid email or password. Please try again.",
    "Invalid login credentials": "Invalid email or password. Please try again.",
    TooManyFailedAttempts: "Too many attempts. Please try again later.",
  };

  const customMessage = rawMessage ? errorMessages[rawMessage] : undefined;
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code?: string }).code ?? "")
      : undefined;

  return {
    message: customMessage || rawMessage || "An authentication error occurred",
    code: code || undefined,
  };
};
