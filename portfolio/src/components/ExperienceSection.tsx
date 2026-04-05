import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Calendar, ChevronRight, MapPin } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import { filterFilledStrings, hasValue } from "@/lib/content-filters";

const EXPERIENCE_RESPONSIBILITIES_PREVIEW_COUNT = 4;

const ExperienceSection = () => {
  const {
    content: { experience },
  } = usePortfolio();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [expandedExperience, setExpandedExperience] = useState<Record<string, boolean>>({});
  const visibleExperience = experience.items
    .map((item) => ({
      ...item,
      responsibilities: filterFilledStrings(item.responsibilities),
    }))
    .filter((item) => hasValue(item.title) || hasValue(item.company) || item.responsibilities.length > 0);

  if (visibleExperience.length === 0) {
    return null;
  }

  const toggleExperienceResponsibilities = (experienceId: string) => {
    setExpandedExperience((current) => ({
      ...current,
      [experienceId]: !current[experienceId],
    }));
  };

  return (
    <section id="experience" className="py-24 relative" ref={ref}>
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/5 to-transparent" />
      
      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />
            <h2 className="text-3xl md:text-4xl font-mono font-bold">
              <span className="text-secondary">&gt;</span> {experience.sectionLabel}
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />
          </div>
          {hasValue(experience.title) && <p className="text-center text-muted-foreground">{experience.title}</p>}
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-primary/20 transform md:-translate-x-1/2" />

          {visibleExperience.map((exp, index) => {
            const isExpanded = Boolean(expandedExperience[exp.id]);
            const shouldTruncate = exp.responsibilities.length > EXPERIENCE_RESPONSIBILITIES_PREVIEW_COUNT;
            const visibleResponsibilities = isExpanded
              ? exp.responsibilities
              : exp.responsibilities.slice(0, EXPERIENCE_RESPONSIBILITIES_PREVIEW_COUNT);

            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`relative mb-12 md:mb-16 ${
                  index % 2 === 0 ? "md:pr-[50%] md:text-right" : "md:pl-[50%]"
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-0 md:left-1/2 top-0 w-4 h-4 bg-primary rounded-full transform -translate-x-1/2 border-4 border-background animate-pulse-glow" />

                <div
                  className={`ml-8 md:ml-0 ${
                    index % 2 === 0 ? "md:mr-8" : "md:ml-8"
                  }`}
                >
                  <div className="p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-all duration-300 group">
                    {/* Header */}
                    <div className={`flex flex-wrap items-start gap-4 mb-4 ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                      <div className={index % 2 === 0 ? "md:text-right" : ""}>
                        {hasValue(exp.type) && (
                          <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-mono text-primary">
                            {exp.type}
                          </span>
                        )}
                        {hasValue(exp.title) && (
                          <h3 className="text-xl font-mono font-bold text-foreground transition-colors group-hover:text-primary">
                            {exp.title}
                          </h3>
                        )}
                        {hasValue(exp.company) && <p className="text-lg font-medium text-secondary">{exp.company}</p>}
                      </div>
                    </div>

                    {/* Meta */}
                    <div className={`flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                      {hasValue(exp.period) && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{exp.period}</span>
                        </div>
                      )}
                      {hasValue(exp.location) && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{exp.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Responsibilities */}
                    {exp.responsibilities.length > 0 && (
                      <div className={`space-y-2 ${index % 2 === 0 ? "md:text-left" : ""}`}>
                        {visibleResponsibilities.map((resp, i) => (
                          <div key={`${exp.id}-${i}`} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <ChevronRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                            <span>{resp}</span>
                          </div>
                        ))}
                        {shouldTruncate && (
                          <button
                            type="button"
                            onClick={() => toggleExperienceResponsibilities(exp.id)}
                            className="mt-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                          >
                            {isExpanded ? "View less" : "View more"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
