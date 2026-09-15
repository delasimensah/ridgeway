export type ScreenLoadState = "loading" | "failed" | "ready";

export interface QueryLoadResult {
  isPending: boolean;
  isError: boolean;
  error?: Error;
}

export function screenLoadState(
  queries: ReadonlyArray<QueryLoadResult>
): ScreenLoadState {
  if (queries.some((query) => query.isError)) {
    return "failed";
  }

  if (queries.some((query) => query.isPending)) {
    return "loading";
  }

  return "ready";
}

export function firstQueryError(
  queries: ReadonlyArray<QueryLoadResult>
): Error | undefined {
  return queries.find((query) => query.isError)?.error;
}

export function isNotPermittedError(error: unknown): boolean {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = (error as { data: unknown }).data;
    if (typeof data === "object" && data !== null && "code" in data) {
      return String((data as { code: unknown }).code) === "NOT_PERMITTED";
    }
  }

  if (error instanceof Error) {
    return (
      error.message.includes('"code":"NOT_PERMITTED"') ||
      error.message.includes("NOT_PERMITTED")
    );
  }

  return false;
}
