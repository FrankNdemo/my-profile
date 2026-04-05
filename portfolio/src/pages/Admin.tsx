import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, KeyRound, LogOut, ShieldCheck, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PortfolioContentEditor from "@/components/admin/PortfolioContentEditor";
import { defaultCredentials, usePortfolio } from "@/context/PortfolioContext";
import { clonePortfolioContent, type PortfolioContent } from "@/data/portfolio-content";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const {
    content,
    credentials,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateContent,
    updateCredentials,
  } = usePortfolio();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [draftContent, setDraftContent] = useState<PortfolioContent>(() => clonePortfolioContent(content));
  const [credentialUsername, setCredentialUsername] = useState(credentials.username);
  const [credentialPassword, setCredentialPassword] = useState(credentials.password);

  useEffect(() => {
    setDraftContent(clonePortfolioContent(content));
  }, [content]);

  useEffect(() => {
    setCredentialUsername(credentials.username);
    setCredentialPassword(credentials.password);
  }, [credentials]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValid = await login(username.trim(), password);

    if (!isValid) {
      toast({
        title: "Login failed",
        description: "Check your username and password, then try again.",
        variant: "destructive",
      });
      return;
    }

    setPassword("");
    toast({
      title: "Signed in",
      description: "You can now update the live portfolio content and access settings.",
    });
  };

  const handleSaveContent = async () => {
    try {
      await updateContent(draftContent);

      toast({
        title: "Portfolio updated",
        description: "Your dashboard changes were saved to the live portfolio.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save the portfolio changes.";
      toast({
        title: "Unable to save content",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleResetContent = () => {
    setDraftContent(clonePortfolioContent(content));
    toast({
      title: "Unsaved changes cleared",
      description: "Your draft has been restored to the last saved portfolio content.",
    });
  };

  const handleCredentialsUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!credentialUsername.trim() || !credentialPassword) {
      toast({
        title: "Missing credentials",
        description: "Both a username and password are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateCredentials({
        username: credentialUsername.trim(),
        password: credentialPassword,
      });

      setCredentialPassword("");
      toast({
        title: "Access updated",
        description: "Your superuser credentials were updated in the system data.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update the superuser credentials.";
      toast({
        title: "Update failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Signed out",
        description: "The admin session has been closed.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sign out right now.";
      toast({
        title: "Sign-out failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background px-4 py-10">
        <div className="mx-auto max-w-4xl rounded-[28px] border border-primary/15 bg-card/90 p-8 text-center shadow-[0_28px_60px_rgba(5,10,20,0.28)]">
          <p className="text-sm uppercase tracking-[0.32em] text-primary/80">Loading</p>
          <h1 className="mt-4 text-3xl font-bold text-foreground">Preparing admin data</h1>
          <p className="mt-3 text-muted-foreground">
            The portfolio and system settings are loading from the backend.
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background px-4 py-10">
        <div className="mx-auto flex max-w-5xl justify-start">
          <Button asChild variant="ghost" className="mb-6 gap-2">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Back to portfolio
            </Link>
          </Button>
        </div>

        <Card className="mx-auto max-w-md border-primary/15 bg-card/95 shadow-[0_28px_60px_rgba(5,10,20,0.32)]">
          <CardHeader className="space-y-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
              <ShieldCheck className="h-7 w-7 text-primary" />
            </div>
            <div>
              <CardTitle className="text-3xl">Admin access</CardTitle>
              <CardDescription className="mt-2 text-sm leading-6">
                Sign in with your superuser account to add, edit, and publish real changes to the portfolio.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4 text-sm text-muted-foreground">
              Initial superuser username: <span className="font-semibold text-foreground">{defaultCredentials.username}</span>
            </div>

            <form className="space-y-4" onSubmit={handleLogin}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="username">
                  Username
                </label>
                <Input
                  id="username"
                  autoComplete="username"
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Enter admin username"
                  value={username}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="password">
                  Password
                </label>
                <Input
                  id="password"
                  autoComplete="current-password"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter admin password"
                  type="password"
                  value={password}
                />
              </div>

              <Button className="w-full gap-2" size="lg" type="submit">
                <ShieldCheck className="h-4 w-4" />
                Sign in
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-[32px] border border-primary/15 bg-card/90 p-6 shadow-[0_28px_60px_rgba(5,10,20,0.28)] md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm uppercase tracking-[0.32em] text-primary/85">
              <WandSparkles className="h-4 w-4" />
              Portfolio Control Room
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Manage your portfolio</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Edit each section directly from this dashboard, then save to publish the changes to the live portfolio.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild variant="outline">
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                View site
              </Link>
            </Button>
            <Button variant="secondary" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>

        <Tabs className="space-y-4" defaultValue="content">
          <TabsList className="w-fit">
            <TabsTrigger value="content">Editor</TabsTrigger>
            <TabsTrigger value="access">Access</TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <PortfolioContentEditor
              content={content}
              draftContent={draftContent}
              onReset={handleResetContent}
              onSave={handleSaveContent}
              setDraftContent={setDraftContent}
            />
          </TabsContent>

          <TabsContent value="access">
            <Card className="border-primary/15 bg-card/95">
              <CardHeader>
                <CardTitle>Superuser credentials</CardTitle>
                <CardDescription className="mt-2 max-w-3xl leading-6">
                  Change the username or password used for `/admin`. These credentials are now stored in the backend system data.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-5">
                <form className="grid gap-4 md:grid-cols-2" onSubmit={handleCredentialsUpdate}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground" htmlFor="credential-username">
                      Username
                    </label>
                    <Input
                      id="credential-username"
                      onChange={(event) => setCredentialUsername(event.target.value)}
                      value={credentialUsername}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground" htmlFor="credential-password">
                      Password
                    </label>
                    <Input
                      id="credential-password"
                      placeholder="Enter a new password"
                      onChange={(event) => setCredentialPassword(event.target.value)}
                      type="password"
                      value={credentialPassword}
                    />
                  </div>

                  <div className="md:col-span-2 flex flex-wrap items-center gap-3">
                    <Button type="submit">
                      <KeyRound className="h-4 w-4" />
                      Update credentials
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Current admin user: <span className="font-semibold text-foreground">{credentials.username}</span>
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
