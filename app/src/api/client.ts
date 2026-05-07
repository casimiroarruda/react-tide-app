// src/api/client.ts
// Cliente HTTP base — 12-factor: URL lida do ambiente, nunca hardcoded.
// O BFF é tratado como um backing service opaco: o React não sabe que existe JWT.

const BFF_URL = import.meta.env.VITE_BFF_URL

if (!BFF_URL) {
    throw new Error(
        '[api/client] VITE_BFF_URL não definida. ' +
        'Verifique o arquivo .env e consulte .env.example.'
    )
}

// ---------------------------------------------------------------------------
// Erro tipado — nunca throw string
// ---------------------------------------------------------------------------

export class ApiError extends Error {
    readonly status: number
    readonly statusText: string

    constructor(status: number, statusText: string, message: string) {
        super(message)
        this.name = 'ApiError'
        this.status = status
        this.statusText = statusText
    }
}
// ---------------------------------------------------------------------------
// Fetch configurado
// ---------------------------------------------------------------------------

type RequestOptions = Omit<RequestInit, 'body'> & {
    params?: Record<string, string | number | undefined>
    body?: unknown
}

export async function apiFetch<T>(
    path: string,
    options: RequestOptions = {}
): Promise<T> {
    const { params, body, ...init } = options

    // Monta query string ignorando valores undefined
    const url = new URL(path, BFF_URL)
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                url.searchParams.set(key, String(value))
            }
        })
    }

    const response = await fetch(url.toString(), {
        ...init,
        headers: {
            'Content-Type': 'application/json',
            ...init.headers,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
        throw new ApiError(
            response.status,
            response.statusText,
            `[${response.status}] ${response.statusText} — ${url.pathname}`
        )
    }

    // 204 No Content — retorna undefined como T
    if (response.status === 204) {
        return undefined as T
    }

    return response.json() as Promise<T>
}