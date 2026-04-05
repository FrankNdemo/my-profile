import { Link } from "react-router-dom";
import { navigationItems } from "@/data/portfolio";
import { usePortfolio } from "@/context/PortfolioContext";
import { hasValue } from "@/lib/content-filters";

const SiteFooter = () => {
  const {
    content: {
      contact: { email, location },
      hero: { firstName, lastName },
    },
  } = usePortfolio();
  const currentYear = new Date().getFullYear();
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.trim().toUpperCase() || "FN";

  return (
    <footer className="relative border-t border-border bg-card/40 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(38_48%_62%_/_0.08),transparent_35%)]" />

      <div className="container relative mx-auto px-6">
        <div className="rounded-[32px] border border-primary/12 bg-card/70 p-6 shadow-[0_24px_70px_rgba(5,10,20,0.22)] backdrop-blur-md md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-xs font-semibold tracking-[0.28em] text-primary">
                  {initials}
                </div>
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.34em] text-muted-foreground">Portfolio</p>
                  <p className="text-lg font-semibold text-foreground">{firstName} {lastName}</p>
                </div>
              </div>

              <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">
                Professional portfolio focused on networking, cybersecurity, and modern ICT delivery with a smoother media-rich presentation.
              </p>

              <div className="mt-5 flex flex-wrap gap-3 text-sm">
                {hasValue(location) && (
                  <span className="rounded-full border border-border/70 bg-background/45 px-4 py-2 text-muted-foreground">
                    {location}
                  </span>
                )}
                <span className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-primary">
                  Open to impactful technology work
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary/80">Quick Links</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {navigationItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary/80">Actions</p>
              <div className="mt-4 flex flex-col gap-3">
                <Link
                  to="/cv"
                  className="inline-flex items-center justify-center rounded-full border border-primary/20 bg-primary/10 px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  View CV
                </Link>
                <Link
                  to="/admin"
                  className="inline-flex items-center justify-center rounded-full border border-border/70 bg-background/45 px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/30 hover:text-primary"
                >
                  Admin
                </Link>
                {hasValue(email) && (
                  <a
                    href={`mailto:${email}`}
                    className="text-center text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {email}
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-border/70 pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
            <p>{firstName} {lastName} Copyright {currentYear}</p>
            <p>Built for a smoother, more professional portfolio experience.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
