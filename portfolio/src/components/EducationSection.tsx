import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, BookOpen, Calendar, Award } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import { filterFilledStrings, hasValue } from "@/lib/content-filters";

const EducationSection = () => {
  const {
    content: { education },
  } = usePortfolio();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const visibleCoursework = filterFilledStrings(education.coursework);
  const visibleStats = education.stats.filter((stat) => hasValue(stat.value) || hasValue(stat.label));
  const hasUniversityDetails =
    hasValue(education.universityName) ||
    hasValue(education.universityDegree) ||
    hasValue(education.universityPeriod) ||
    hasValue(education.universityBadge) ||
    visibleCoursework.length > 0;
  const hasSecondaryDetails =
    hasValue(education.secondarySchoolName) ||
    hasValue(education.secondarySchoolSubtitle) ||
    hasValue(education.secondarySchoolPeriod) ||
    hasValue(education.secondarySchoolDescription);

  if (!hasUniversityDetails && !hasSecondaryDetails && visibleStats.length === 0) {
    return null;
  }

  return (
    <section id="education" className="py-24 relative" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/5 to-transparent" />
      
      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
            <h2 className="text-3xl md:text-4xl font-mono font-bold">
              <span className="text-accent">&gt;</span> {education.sectionLabel}
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
          </div>
          {hasValue(education.title) && <p className="text-center text-muted-foreground">{education.title}</p>}
        </motion.div>

        <div className={hasUniversityDetails && (hasSecondaryDetails || visibleStats.length > 0) ? "grid gap-8 lg:grid-cols-2" : "mx-auto max-w-4xl"}>
          {/* University */}
          {hasUniversityDetails && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-accent/50"
            >
              <div className="mb-6 flex items-start gap-4">
                <div className="rounded-xl bg-accent/10 p-3">
                  <GraduationCap className="h-8 w-8 text-accent" />
                </div>
                <div>
                  {hasValue(education.universityName) && (
                    <h3 className="text-xl font-mono font-bold">{education.universityName}</h3>
                  )}
                  {hasValue(education.universityDegree) && (
                    <p className="text-lg text-accent">{education.universityDegree}</p>
                  )}
                  {hasValue(education.universityPeriod) && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{education.universityPeriod}</span>
                    </div>
                  )}
                  {hasValue(education.universityBadge) && (
                    <span className="mt-2 inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-mono text-accent">
                      {education.universityBadge}
                    </span>
                  )}
                </div>
              </div>

              {visibleCoursework.length > 0 && (
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-accent" />
                    <h4 className="font-mono font-semibold">
                      {hasValue(education.courseworkHeading) ? education.courseworkHeading : "Coursework"}
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {visibleCoursework.map((course, index) => (
                      <motion.div
                        key={course}
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="mt-1 text-accent">-</span>
                        <span>{course}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* High School */}
          {(hasSecondaryDetails || visibleStats.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              {hasSecondaryDetails && (
                <div className="rounded-xl border border-border bg-card p-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-muted p-3">
                      <Award className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      {hasValue(education.secondarySchoolName) && (
                        <h3 className="text-xl font-mono font-bold">{education.secondarySchoolName}</h3>
                      )}
                      {hasValue(education.secondarySchoolSubtitle) && (
                        <p className="text-muted-foreground">{education.secondarySchoolSubtitle}</p>
                      )}
                      {hasValue(education.secondarySchoolPeriod) && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{education.secondarySchoolPeriod}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {hasValue(education.secondarySchoolDescription) && (
                    <p className="mt-4 text-sm text-muted-foreground">
                      {education.secondarySchoolDescription}
                    </p>
                  )}
                </div>
              )}

              {visibleStats.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {visibleStats.map((stat, index) => (
                    <motion.div
                      key={stat.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                      className="rounded-xl border border-border bg-card p-4 text-center"
                    >
                      {hasValue(stat.value) && <p className="gradient-text text-3xl font-mono font-bold">{stat.value}</p>}
                      {hasValue(stat.label) && <p className="text-sm text-muted-foreground">{stat.label}</p>}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
