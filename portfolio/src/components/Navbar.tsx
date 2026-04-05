import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { navigationItems } from "@/data/portfolio";
import { filterFilledStrings, hasValue } from "@/lib/content-filters";
import { cn } from "@/lib/utils";
import { usePortfolio } from "@/context/PortfolioContext";

const Navbar = () => {
  const {
    content: { hero, about, experience, projects, skills, education, certifications, contact },
  } = usePortfolio();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#about");
  const initials = `${hero.firstName.charAt(0)}${hero.lastName.charAt(0)}`.trim().toUpperCase() || "FN";
  const visibleNavigationItems = navigationItems.filter((item) => {
    switch (item.href) {
      case "#about":
        return (
          hasValue(about.title) ||
          filterFilledStrings(about.paragraphs).length > 0 ||
          filterFilledStrings(about.goals).length > 0 ||
          about.languages.some((language) => hasValue(language.name) || hasValue(language.level)) ||
          [contact.email, contact.phone, contact.location].some((value) => hasValue(value))
        );
      case "#experience":
        return experience.items.some((entry) => hasValue(entry.title) || hasValue(entry.company));
      case "#projects":
        return projects.items.some((project) => hasValue(project.title) && hasValue(project.description));
      case "#skills":
        return (
          skills.technical.some((skill) => hasValue(skill.name)) ||
          skills.soft.some((skill) => hasValue(skill.name))
        );
      case "#education":
        return (
          hasValue(education.universityName) ||
          hasValue(education.universityDegree) ||
          hasValue(education.secondarySchoolName) ||
          filterFilledStrings(education.coursework).length > 0 ||
          education.stats.some((stat) => hasValue(stat.value) || hasValue(stat.label))
        );
      case "#certifications":
        return certifications.items.some((certification) => hasValue(certification.title) && hasValue(certification.issuer));
      case "#contact":
        return (
          [contact.email, contact.phone, contact.location].some((value) => hasValue(value)) ||
          contact.references.some((reference) => hasValue(reference.name))
        );
      default:
        return true;
    }
  });
  const navigationKey = visibleNavigationItems.map((item) => item.href).join("|");
  const handleNavigationClick = (href: string) => {
    setActiveSection(href);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = visibleNavigationItems
      .map((item) => document.querySelector(item.href))
      .filter((section): section is HTMLElement => section instanceof HTMLElement);

    if (!sections.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleSection?.target.id) {
          setActiveSection(`#${visibleSection.target.id}`);
        }
      },
      {
        rootMargin: "-42% 0px -42% 0px",
        threshold: [0.15, 0.3, 0.5, 0.7],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [navigationKey]);

  useEffect(() => {
    if (visibleNavigationItems.length === 0) {
      return;
    }

    if (!visibleNavigationItems.some((item) => item.href === activeSection)) {
      setActiveSection(visibleNavigationItems[0].href);
    }
  }, [activeSection, navigationKey]);

  return (
    <nav
      aria-label="Primary navigation"
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4"
    >
      <div
        className={cn(
          "mx-auto max-w-6xl rounded-[28px] border backdrop-blur-xl transition-all duration-300",
          isScrolled
            ? "border-primary/20 bg-background/92 shadow-[0_22px_60px_rgba(5,10,20,0.42)]"
            : "border-white/10 bg-background/78 shadow-[0_18px_45px_rgba(5,10,20,0.28)]",
        )}
      >
        <div className="flex min-h-[74px] items-center justify-between px-5 md:px-7">
          <a href="#" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 font-mono text-sm font-semibold tracking-[0.28em] text-primary">
              {initials}
            </div>

            <div className="hidden sm:block">
              <p className="text-[0.68rem] uppercase tracking-[0.34em] text-muted-foreground">
                Portfolio
              </p>
              <p className="text-sm font-semibold text-foreground">{hero.firstName} {hero.lastName}</p>
            </div>
          </a>

          <div className="hidden lg:flex items-center gap-2 rounded-full border border-border/70 bg-muted/20 p-1">
            {visibleNavigationItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => handleNavigationClick(item.href)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                  activeSection === item.href
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-background/70 hover:text-foreground",
                )}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/cv"
              className="hidden md:inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              View CV
              <ChevronRight className="h-4 w-4" />
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-muted/25 text-muted-foreground transition-colors hover:text-primary lg:hidden"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-auto mt-3 max-w-6xl overflow-hidden rounded-[28px] border border-primary/15 bg-background/95 shadow-[0_22px_60px_rgba(5,10,20,0.42)] backdrop-blur-xl lg:hidden"
          >
            <div className="px-5 py-4">
              {visibleNavigationItems.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleNavigationClick(item.href)}
                  className={cn(
                    "flex items-center justify-between border-b border-border/60 py-4 text-base font-medium transition-colors last:border-0",
                    activeSection === item.href ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <span>{item.label}</span>
                  <ChevronRight className="h-4 w-4" />
                </motion.a>
              ))}

              <Link
                to="/cv"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                View CV
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
