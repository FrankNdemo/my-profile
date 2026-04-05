import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import {
  defaultPortfolioContent,
  hydratePortfolioContent,
  type PortfolioContent,
} from "@/data/portfolio-content";
import {
  getAdminSession,
  loadPortfolioContent,
  loginSuperUser,
  logoutSuperUser,
  savePortfolioContent,
  saveSuperUserCredentials,
} from "@/lib/portfolio-api";
import { ApiError } from "@/lib/portfolio-api";

export interface SuperUserCredentials {
  username: string;
  password: string;
}

interface PortfolioContextValue {
  content: PortfolioContent;
  updateContent: (nextContent: PortfolioContent) => Promise<void>;
  resetContent: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  credentials: SuperUserCredentials;
  updateCredentials: (nextCredentials: SuperUserCredentials) => Promise<void>;
}

export const defaultCredentials: SuperUserCredentials = {
  username: "frank",
  password: "",
};


const PortfolioContext = createContext<PortfolioContextValue | undefined>(undefined);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState<PortfolioContent>(() => hydratePortfolioContent(defaultPortfolioContent));
  const [credentials, setCredentials] = useState<SuperUserCredentials>({
    username: defaultCredentials.username,
    password: "",
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const syncAdminSession = async () => {
    const session = await getAdminSession();
    setIsAuthenticated(session.authenticated);
    setCredentials((currentCredentials) => ({
      username: session.username,
      password: currentCredentials.password,
    }));
    return session;
  };

  const handleUnauthorizedSession = (error: unknown) => {
    if (error instanceof ApiError && error.status === 401) {
      setIsAuthenticated(false);
      throw new ApiError("Your admin session expired. Sign in again to continue editing.", 401);
    }

    throw error;
  };

  useEffect(() => {
    let isMounted = true;

    const hydratePortfolio = async () => {
      try {
        const [{ content: apiContent, username }, session] = await Promise.all([
          loadPortfolioContent(),
          syncAdminSession(),
        ]);

        if (!isMounted) {
          return;
        }

        setContent(hydratePortfolioContent(apiContent));
        setCredentials({
          username: session.username || username,
          password: "",
        });
      } catch (error) {
        console.error("Unable to load portfolio data from the backend API.", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void hydratePortfolio();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const syncSessionOnFocus = () => {
      void syncAdminSession().catch(() => undefined);
    };

    window.addEventListener("focus", syncSessionOnFocus);
    document.addEventListener("visibilitychange", syncSessionOnFocus);

    return () => {
      window.removeEventListener("focus", syncSessionOnFocus);
      document.removeEventListener("visibilitychange", syncSessionOnFocus);
    };
  }, []);

  const updateContent = async (nextContent: PortfolioContent) => {
    try {
      const session = await syncAdminSession();

      if (!session.authenticated) {
        throw new ApiError("Your admin session expired. Sign in again to continue editing.", 401);
      }

      const { content: savedContent, username } = await savePortfolioContent(nextContent);
      setContent(hydratePortfolioContent(savedContent));
      setCredentials((currentCredentials) => ({
        username,
        password: currentCredentials.password,
      }));
    } catch (error) {
      handleUnauthorizedSession(error);
    }
  };

  const resetContent = async () => {
    await updateContent(defaultPortfolioContent);
  };

  const login = async (username: string, password: string) => {
    try {
      await loginSuperUser(username, password);
      const session = await syncAdminSession();
      setIsAuthenticated(session.authenticated);
      setCredentials((currentCredentials) => ({
        username: session.username,
        password: currentCredentials.password,
      }));
      return session.authenticated;
    } catch {
      setIsAuthenticated(false);
      return false;
    }
  };

  const logout = useCallback(async () => {
    try {
      await logoutSuperUser();
    } finally {
      setIsAuthenticated(false);
    }
  }, []);

  const updateCredentials = async (nextCredentials: SuperUserCredentials) => {
    try {
      const session = await syncAdminSession();

      if (!session.authenticated) {
        throw new ApiError("Your admin session expired. Sign in again to update access details.", 401);
      }

      const { username } = await saveSuperUserCredentials(nextCredentials);
      setCredentials({
        username,
        password: "",
      });
      setIsAuthenticated(true);
    } catch (error) {
      handleUnauthorizedSession(error);
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        content,
        updateContent,
        resetContent,
        isAuthenticated,
        isLoading,
        login,
        logout,
        credentials,
        updateCredentials,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);

  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }

  return context;
};
