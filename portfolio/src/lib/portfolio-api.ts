import type { PortfolioContent } from "@/data/portfolio-content";
import type { SuperUserCredentials } from "@/context/PortfolioContext";

const API_BASE_PATH = (import.meta.env.VITE_PORTFOLIO_API_BASE_URL || "/api").replace(/\/$/, "");

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface ApiResponse<T> {
  data?: T;
  message?: string;
}

interface SessionData {
  authenticated: boolean;
  username: string;
}

interface ContentData {
  content: PortfolioContent;
  username: string;
}

interface CredentialsData {
  username: string;
}

const buildApiUrl = (path: string) => `${API_BASE_PATH}/${path.replace(/^\//, "")}`;

const requestApi = async <T>(action: string, init?: RequestInit) => {
  const response = await fetch(buildApiUrl(action), {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  const payload = (await response.json().catch(() => ({}))) as ApiResponse<T>;

  if (!response.ok) {
    throw new ApiError(payload.message || "Unable to complete the request.", response.status);
  }

  if (payload.data === undefined) {
    throw new ApiError("The server returned an empty response.", response.status);
  }

  return payload.data;
};

export const loadPortfolioContent = () => requestApi<ContentData>("public/");

export const getAdminSession = () => requestApi<SessionData>("session/");

export const loginSuperUser = (username: string, password: string) =>
  requestApi<SessionData>("login/", {
    body: JSON.stringify({ username, password }),
    method: "POST",
  });

export const logoutSuperUser = () =>
  requestApi<SessionData>("logout/", {
    method: "POST",
  });

export const notifyAdminExitLogout = async () => {
  try {
    await fetch(buildApiUrl("logout/"), {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      keepalive: true,
      method: "POST",
    });
  } catch {
    // Best-effort logout for page exit; nothing else to do if the request is interrupted.
  }
};

export const savePortfolioContent = (content: PortfolioContent) =>
  requestApi<ContentData>("content/", {
    body: JSON.stringify({ content }),
    method: "POST",
  });

export const saveSuperUserCredentials = (credentials: SuperUserCredentials) =>
  requestApi<CredentialsData>("credentials/", {
    body: JSON.stringify(credentials),
    method: "POST",
  });
