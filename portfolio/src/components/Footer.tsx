import { Link } from "react-router-dom";
import { usePortfolio } from "@/context/PortfolioContext";
import { hasValue } from "@/lib/content-filters";

const Footer = () => {
  const {
    content: {
      contact: { email },
      hero: { firstName, lastName },
    },
  } = usePortfolio();
  const currentYear = new Date().getFullYear();
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.trim().toUpperCase() || "FN";

  return (
    <footer className="border-t border-border bg-card/50 py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-xs font-semibold tracking-[0.28em] text-primary">
              {initials}
            </div>
            <span className="hidden">
              Francis Ndemo © {currentYear}
            </span>
            <span className="text-sm text-muted-foreground">{firstName} {lastName} {currentYear}</span>
          </div>

          {/* Quick links */}
          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Admin
            </Link>
            {hasValue(email) && (
              <a
                href={`mailto:${email}`}
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {email}
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
