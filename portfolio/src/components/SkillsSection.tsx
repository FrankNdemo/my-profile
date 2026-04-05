import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Network, Shield, Code, Server, Globe, Database,
  Brain, Users, Target, Eye, Lightbulb, MessageSquare, type LucideIcon
} from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import { hasValue } from "@/lib/content-filters";

const resolveTechnicalSkillIcon = (name: string): LucideIcon => {
  const normalizedName = name.toLowerCase();

  if (normalizedName.includes("network")) {
    return Network;
  }

  if (normalizedName.includes("security")) {
    return Shield;
  }

  if (normalizedName.includes("web")) {
    return Globe;
  }

  if (normalizedName.includes("program")) {
    return Code;
  }

  if (normalizedName.includes("database")) {
    return Database;
  }

  if (normalizedName.includes("infrastructure") || normalizedName.includes("server")) {
    return Server;
  }

  return Code;
};

const resolveSoftSkillIcon = (name: string): LucideIcon => {
  const normalizedName = name.toLowerCase();

  if (normalizedName.includes("problem")) {
    return Brain;
  }

  if (normalizedName.includes("analytic")) {
    return Target;
  }

  if (normalizedName.includes("team")) {
    return Users;
  }

  if (normalizedName.includes("commun")) {
    return MessageSquare;
  }

  if (normalizedName.includes("detail")) {
    return Eye;
  }

  if (normalizedName.includes("learn")) {
    return Lightbulb;
  }

  return Brain;
};

const SkillBar = ({ name, icon: Icon, level, delay }: { name: string; icon: LucideIcon; level: number; delay: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="group"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-primary" />
          <span className="font-mono text-sm">{name}</span>
        </div>
        <span className="text-xs text-muted-foreground font-mono">{level}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${level}%` } : {}}
          transition={{ duration: 1, delay: delay + 0.2, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full relative"
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
      </div>
    </motion.div>
  );
};

const SkillsSection = () => {
  const {
    content: { skills },
  } = usePortfolio();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const visibleTechnicalSkills = skills.technical.filter((skill) => hasValue(skill.name));
  const visibleSoftSkills = skills.soft.filter((skill) => hasValue(skill.name));

  if (visibleTechnicalSkills.length === 0 && visibleSoftSkills.length === 0) {
    return null;
  }

  return (
    <section id="skills" className="py-24 relative" ref={ref}>
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
              <span className="text-primary">&gt;</span> {skills.sectionLabel}
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          </div>
          {hasValue(skills.title) && <p className="text-center text-muted-foreground">{skills.title}</p>}
        </motion.div>

        <div className={visibleTechnicalSkills.length > 0 && visibleSoftSkills.length > 0 ? "grid gap-12 lg:grid-cols-2" : "mx-auto max-w-4xl"}>
          {/* Technical Skills */}
          {visibleTechnicalSkills.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Code className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-mono font-semibold">{skills.technicalHeading}</h3>
                </div>
                <div className="space-y-5">
                  {visibleTechnicalSkills.map((skill, index) => (
                    <SkillBar
                      key={skill.id}
                      name={skill.name}
                      icon={resolveTechnicalSkillIcon(skill.name)}
                      level={skill.level}
                      delay={index * 0.1}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Soft Skills */}
          {visibleSoftSkills.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="h-full rounded-xl border border-border bg-card p-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-lg bg-secondary/10 p-2">
                    <Brain className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="text-xl font-mono font-semibold">{skills.softHeading}</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {visibleSoftSkills.map((skill, index) => {
                    const SkillIcon = resolveSoftSkillIcon(skill.name);

                    return (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                        className="group rounded-lg border border-border bg-muted/20 p-4 transition-all duration-300 hover:border-secondary/50"
                      >
                        <SkillIcon className="mb-2 h-6 w-6 text-secondary transition-transform group-hover:scale-110" />
                        <p className="text-sm font-medium">{skill.name}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
