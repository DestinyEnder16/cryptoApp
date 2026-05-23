type ApiErrorShape = {
  data?: { error?: { code?: string; message?: string; requestId?: string } };
  status?: number | string;
};

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (!error || typeof error !== "object") return fallback;
  const msg = (error as ApiErrorShape).data?.error?.message;
  return msg ?? fallback;
}
