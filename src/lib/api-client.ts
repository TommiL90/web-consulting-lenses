export type ApiErrorResponse = {
  error: {
    statusCode: number;
    code: string;
    message: string;
    details?: unknown;
  };
};

export class ApiError extends Error {
  statusCode: number;
  code: string;
  details?: unknown;

  constructor(payload: ApiErrorResponse["error"]) {
    super(payload.message);
    this.name = "ApiError";
    this.statusCode = payload.statusCode;
    this.code = payload.code;
    this.details = payload.details;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

type ApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  searchParams?: Record<
    string,
    | string
    | number
    | boolean
    | null
    | undefined
    | Array<string | number | boolean>
  >;
};

export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "/api";

function buildUrl(path: string, searchParams?: ApiFetchOptions["searchParams"]) {
  const normalizedBase = API_BASE_URL.endsWith("/")
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  let url = `${normalizedBase}${normalizedPath}`;

  if (searchParams && Object.keys(searchParams).length > 0) {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(searchParams)) {
      if (value === null || value === undefined || value === "") {
        continue;
      }

      if (Array.isArray(value)) {
        value.forEach((entry) =>
          params.append(key, entry != null ? String(entry) : ""),
        );
        continue;
      }

      params.append(key, String(value));
    }

    const serialized = params.toString();
    if (serialized) {
      url = `${url}?${serialized}`;
    }
  }

  return url;
}

export async function apiFetch<T>(
  path: string,
  { body, headers, searchParams, ...options }: ApiFetchOptions = {},
): Promise<T> {
  const url = buildUrl(path, searchParams);
  const init: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? {}),
    },
  };

  if (body !== undefined) {
    init.body = typeof body === "string" ? body : JSON.stringify(body);
  }

  const response = await fetch(url, init);
  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  if (!response.ok) {
    let errorPayload: ApiErrorResponse["error"] = {
      statusCode: response.status,
      code: "UNKNOWN_ERROR",
      message: response.statusText || "Error inesperado",
    };

    if (isJson) {
      try {
        const data = (await response.json()) as ApiErrorResponse;
        if (data?.error?.code) {
          errorPayload = data.error;
        }
      } catch {
        // ignore parse errors, use fallback payload
      }
    }

    throw new ApiError(errorPayload);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  if (!isJson) {
    throw new Error("Respuesta inesperada del servidor");
  }

  return (await response.json()) as T;
}
