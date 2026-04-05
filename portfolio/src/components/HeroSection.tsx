import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  Code2,
  Globe,
  MapPin,
  Network,
  Server,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import { filterFilledStrings, hasValue } from "@/lib/content-filters";

const resolveSpecialtyIcon = (specialty: string): LucideIcon => {
  const normalizedSpecialty = specialty.toLowerCase();

  if (normalizedSpecialty.includes("network")) {
    return Network;
  }

  if (normalizedSpecialty.includes("security") || normalizedSpecialty.includes("cyber")) {
    return Shield;
  }

  if (normalizedSpecialty.includes("infra") || normalizedSpecialty.includes("server")) {
    return Server;
  }

  if (normalizedSpecialty.includes("web") || normalizedSpecialty.includes("front")) {
    return Globe;
  }

  return Code2;
};

const HeroSection = () => {
  const {
    content: { hero, contact, projects, experience, certifications },
  } = usePortfolio();
  const visibleSpecialties = filterFilledStrings(hero.specialties);
  const showPrimaryCta = hasValue(hero.primaryCtaLabel) && hasValue(hero.primaryCtaHref);
  const showSecondaryCta = hasValue(hero.secondaryCtaLabel) && hasValue(hero.secondaryCtaHref);
  const heroInitials = `${hero.firstName.charAt(0)}${hero.lastName.charAt(0)}`.trim().toUpperCase() || "FN";
  const hasHeroProfileImage = hasValue(hero.profileImageSrc);
  const heroProfileAlt = hasValue(hero.profileImageAlt)
    ? hero.profileImageAlt
    : `${hero.firstName} ${hero.lastName} profile photo`.trim();
  const fullName = [hero.firstName, hero.lastName].filter((value) => hasValue(value)).join(" ").trim() || "Portfolio";
  const focusLabel = visibleSpecialties.slice(0, 2).join(" + ") || "Python + Cybersecurity";
  const typewriterLines = [
    `python profile.py --name "${fullName}"`,
    `python profile.py --focus "${focusLabel}"`,
    'python profile.py --build "secure systems"',
  ];
  const heroStats = [
    {
      label: "Projects",
      value: String(projects.items.filter((project) => hasValue(project.title) && hasValue(project.description)).length).padStart(2, "0"),
    },
    {
      label: "Roles",
      value: String(experience.items.filter((item) => hasValue(item.title) || hasValue(item.company)).length).padStart(2, "0"),
    },
    {
      label: "Credentials",
      value: String(certifications.items.filter((item) => hasValue(item.title) && hasValue(item.issuer)).length).padStart(2, "0"),
    },
  ];
  const locationLabel = hasValue(contact.location) ? contact.location : "Kenya";
  const [typewriterLineIndex, setTypewriterLineIndex] = useState(0);
  const [typedLineText, setTypedLineText] = useState("");
  const [isDeletingTypedLine, setIsDeletingTypedLine] = useState(false);
  const activeTypewriterLine = typewriterLines[typewriterLineIndex] ?? typewriterLines[0];

  useEffect(() => {
    const delay = !isDeletingTypedLine && typedLineText === activeTypewriterLine
      ? 1500
      : isDeletingTypedLine && typedLineText.length === 0
        ? 320
        : isDeletingTypedLine
          ? 34
          : 78;

    const timeoutId = window.setTimeout(() => {
      if (!isDeletingTypedLine) {
        if (typedLineText === activeTypewriterLine) {
          setIsDeletingTypedLine(true);
          return;
        }

        setTypedLineText(activeTypewriterLine.slice(0, typedLineText.length + 1));
        return;
      }

      if (typedLineText.length > 0) {
        setTypedLineText(activeTypewriterLine.slice(0, typedLineText.length - 1));
        return;
      }

      setIsDeletingTypedLine(false);
      setTypewriterLineIndex((currentIndex) => (currentIndex + 1) % typewriterLines.length);
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [activeTypewriterLine, isDeletingTypedLine, typedLineText, typewriterLines.length]);

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden pt-28 md:pt-32">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-[-8%] top-[-10%] h-[26rem] w-[26rem] rounded-full bg-primary/14 blur-3xl" />
        <div className="absolute right-[-8%] top-[10%] h-[18rem] w-[18rem] rounded-full bg-secondary/12 blur-3xl" />
        <div className="absolute bottom-[-16%] right-[-8%] h-[24rem] w-[24rem] rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute inset-0 grid-pattern opacity-25" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(220_28%_16%_/_0.16),transparent_55%)]" />
        <div className="absolute top-1/3 left-0 w-1/3 circuit-line opacity-60" />
        <div className="absolute top-2/3 right-0 w-1/4 circuit-line opacity-60" />
      </div>

      <div className="container relative z-10 mx-auto px-6 pb-16 pt-8 md:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid items-center gap-14 lg:min-h-[calc(100vh-11rem)] lg:grid-cols-[1.05fr_0.95fr]"
        >
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-4xl text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl"
            >
              <span className="text-foreground">{hero.firstName}</span>{" "}
              <span className="gradient-text">{hero.lastName}</span>
            </motion.h1>

            {visibleSpecialties.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                {visibleSpecialties.map((specialty, index) => {
                  const SpecialtyIcon = resolveSpecialtyIcon(specialty);
                  const accentClass = index % 2 === 0 ? "text-primary" : "text-secondary";

                  return (
                    <div
                      key={specialty}
                      className="flex items-center gap-2 rounded-full border border-border/80 bg-card/85 px-4 py-2.5 shadow-sm"
                    >
                      <SpecialtyIcon className={`h-5 w-5 ${accentClass}`} />
                      <span className="font-medium">{specialty}</span>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {hasValue(hero.summary) && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl"
              >
                {hero.summary}
              </motion.p>
            )}

            {(showPrimaryCta || showSecondaryCta) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85 }}
                className="mt-10 flex flex-wrap items-center gap-4"
              >
                {showPrimaryCta && (
                  <a
                    href={hero.primaryCtaHref}
                    className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-semibold text-primary-foreground transition-all duration-300 hover:scale-[1.02]"
                  >
                    <span>{hero.primaryCtaLabel}</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </a>
                )}
                {showSecondaryCta && (
                  <a
                    href={hero.secondaryCtaHref}
                    className="inline-flex items-center gap-2 rounded-full border border-primary/35 bg-background/35 px-8 py-4 font-semibold text-primary transition-all duration-300 hover:bg-primary/10 hover:box-glow"
                  >
                    {hero.secondaryCtaLabel}
                  </a>
                )}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-10 grid gap-4 sm:grid-cols-3"
            >
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[24px] border border-border/70 bg-card/80 p-5 shadow-[0_18px_35px_rgba(5,10,20,0.18)]"
                >
                  <p className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{stat.value}</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.22em] text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="relative mx-auto w-full max-w-[520px]"
          >
            <div className="absolute -left-4 top-10 hidden rounded-2xl border border-secondary/25 bg-card/85 px-4 py-3 shadow-[0_16px_40px_rgba(5,10,20,0.28)] md:block">
              <p className="text-xs uppercase tracking-[0.26em] text-secondary">Based In</p>
              <p className="mt-2 text-sm font-semibold text-foreground">{locationLabel}</p>
            </div>

            <div className="absolute -right-4 bottom-12 hidden rounded-2xl border border-primary/20 bg-card/85 px-4 py-3 text-right shadow-[0_16px_40px_rgba(5,10,20,0.28)] md:block">
              <p className="text-xs uppercase tracking-[0.26em] text-primary">Availability</p>
              <p className="mt-2 text-sm font-semibold text-foreground">Open to impactful technology work</p>
            </div>

            <div className="relative overflow-hidden rounded-[36px] border border-primary/15 bg-[linear-gradient(160deg,hsl(220_26%_16%_/_0.98),hsl(220_24%_12%_/_0.96))] p-6 shadow-[0_32px_80px_rgba(4,8,18,0.42)] md:p-7">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(38_48%_62%_/_0.12),transparent_36%),radial-gradient(circle_at_bottom_left,hsl(203_28%_58%_/_0.12),transparent_34%)]" />
              <div className="absolute inset-x-6 top-6 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />

              <div className="relative">
                <div className="rounded-[30px] border border-white/10 bg-background/35 p-5 backdrop-blur-md">
                  <div className="relative mb-6 overflow-hidden rounded-[24px] border border-primary/15 bg-[linear-gradient(135deg,hsl(220_28%_14%_/_0.94),hsl(220_24%_10%_/_0.82))] px-4 py-4 backdrop-blur-md animate-float">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/45 to-transparent" />
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-primary/80">
                      <span className="h-2 w-2 rounded-full bg-primary/80" />
                      <span className="h-2 w-2 rounded-full bg-secondary/65" />
                      <span className="ml-1">Python Profile Loop</span>
                    </div>
                    <div className="mt-3 min-h-[3.5rem] font-mono text-sm leading-7 text-foreground/90 md:text-[0.95rem]">
                      <span className="text-primary/80">&gt;&gt;&gt;</span>{" "}
                      <span>{typedLineText}</span>
                      <span className="terminal-cursor ml-1 text-primary">|</span>
                    </div>
                  </div>

                  <div className="mx-auto flex w-full max-w-[344px] items-center justify-center">
                    <div className="relative aspect-square w-full">
                      <div className="absolute inset-[8%] rounded-full bg-primary/10 blur-3xl" />
                      <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full border border-primary/20 bg-background/50 shadow-[0_30px_80px_rgba(4,8,18,0.42)]">
                        {!hasHeroProfileImage && (
                          <>
                            <div className="absolute inset-[12%] rounded-full border border-secondary/20" />
                            <div className="absolute inset-[24%] rounded-full border border-primary/15" />
                          </>
                        )}
                        {hasHeroProfileImage ? (
                          <div className="absolute inset-[1.75%] overflow-hidden rounded-full border border-primary/18 shadow-[0_22px_46px_rgba(4,8,18,0.38)]">
                            <img
                              src={hero.profileImageSrc}
                              alt={heroProfileAlt}
                              className="h-full w-full scale-[1.08] object-cover object-center"
                            />
                          </div>
                        ) : (
                          <div className="relative flex h-full w-full items-center justify-center">
                            <div className="absolute inset-[11%] rounded-full bg-[radial-gradient(circle_at_top,hsl(38_48%_62%_/_0.18),transparent_44%),linear-gradient(160deg,hsl(220_24%_16%),hsl(220_22%_11%))]" />
                            <p className="relative text-7xl font-bold tracking-[0.16em] text-foreground">
                              {heroInitials}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3">
                    <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/45 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Shield className="h-4 w-4 text-primary" />
                        <span className="text-sm text-muted-foreground">Core focus</span>
                      </div>
                      <span className="text-sm font-semibold text-foreground">
                        {visibleSpecialties.slice(0, 2).join(" / ") || "Reliable delivery"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/45 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-secondary" />
                        <span className="text-sm text-muted-foreground">Location</span>
                      </div>
                      <span className="text-sm font-semibold text-foreground">{locationLabel}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/45 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <BadgeCheck className="h-4 w-4 text-accent" />
                        <span className="text-sm text-muted-foreground">Experience mode</span>
                      </div>
                      <span className="text-sm font-semibold text-foreground">Professional showcase</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.button
          onClick={scrollToAbout}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.15 }}
          className="mx-auto mt-12 flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-2"
          >
            <span className="text-sm font-medium uppercase tracking-[0.24em]">Scroll</span>
            <ChevronDown className="h-6 w-6" />
          </motion.div>
        </motion.button>
      </div>
    </section>
  );
};

export default HeroSection;
