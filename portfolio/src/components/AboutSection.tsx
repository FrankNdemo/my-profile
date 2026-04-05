import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Mail, Phone, Target, Rocket } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import { filterFilledStrings, hasValue } from "@/lib/content-filters";

const AboutSection = () => {
  const {
    content: { about, contact },
  } = usePortfolio();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const bioParagraphs = filterFilledStrings(about.paragraphs);
  const goals = filterFilledStrings(about.goals);
  const visibleLanguages = about.languages.filter(
    (language) => hasValue(language.name) || hasValue(language.level),
  );
  const contactInfo = [
    hasValue(contact.location) ? { icon: MapPin, label: "Location", value: contact.location } : null,
    hasValue(contact.email) ? { icon: Mail, label: "Email", value: contact.email } : null,
    hasValue(contact.phone) ? { icon: Phone, label: "Phone", value: contact.phone } : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null);
  const showBioColumn = hasValue(about.title) || bioParagraphs.length > 0 || contactInfo.length > 0;
  const showDetailsColumn = goals.length > 0 || visibleLanguages.length > 0;

  if (!showBioColumn && !showDetailsColumn) {
    return null;
  }

  return (
    <section id="about" className="py-24 relative" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <h2 className="text-3xl md:text-4xl font-mono font-bold">
              <span className="text-primary">&gt;</span> {about.sectionLabel}
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          </div>
        </motion.div>

        <div className={showBioColumn && showDetailsColumn ? "grid gap-12 lg:grid-cols-2" : "mx-auto max-w-4xl"}>
          {/* Bio */}
          {showBioColumn && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {(hasValue(about.title) || bioParagraphs.length > 0) && (
                <div className="rounded-xl border border-border bg-card p-6">
                  {hasValue(about.title) && (
                    <h3 className="mb-4 text-xl font-mono font-semibold text-foreground">{about.title}</h3>
                  )}
                  {bioParagraphs.length > 0 && (
                    <div className="space-y-6">
                      {bioParagraphs.map((paragraph) => (
                        <p key={paragraph} className="text-lg leading-relaxed text-muted-foreground">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {contactInfo.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-3">
                  {contactInfo.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                      className="group rounded-lg border border-border bg-muted/30 p-4 transition-colors hover:border-primary/50"
                    >
                      <item.icon className="mb-2 h-5 w-5 text-primary" />
                      <p className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="break-all text-sm font-medium">{item.value}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Career Goals */}
          {showDetailsColumn && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              {goals.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-6">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-mono font-semibold">Career Goals</h3>
                  </div>
                  <div className="space-y-4">
                    {goals.map((goal, index) => (
                      <motion.div
                        key={goal}
                        initial={{ opacity: 0, x: 20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                        className="flex items-start gap-3 rounded-lg bg-muted/20 p-3"
                      >
                        <Rocket className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary" />
                        <p className="text-muted-foreground">{goal}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {visibleLanguages.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-6">
                  <h3 className="mb-4 text-lg font-mono font-semibold">Languages</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {visibleLanguages.map((language) => (
                      <div key={language.id} className="flex-1 rounded-lg bg-muted/20 p-3 text-center">
                        {hasValue(language.name) && <p className="font-semibold">{language.name}</p>}
                        {hasValue(language.level) && <p className="text-sm text-primary">{language.level}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
