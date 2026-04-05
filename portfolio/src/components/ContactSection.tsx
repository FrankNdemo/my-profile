import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Mail, Phone, MapPin, Send, User } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import { hasValue } from "@/lib/content-filters";

const ContactSection = () => {
  const {
    content: { contact },
  } = usePortfolio();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const phoneHref = `tel:${contact.phone.replace(/\s+/g, "")}`;
  const contactInfo = [
    hasValue(contact.email)
      ? {
          href: `mailto:${contact.email}`,
          icon: Mail,
          label: "Email",
          value: contact.email,
          accentClass: "bg-primary/10 group-hover:bg-primary/20",
          hrefClass: "group-hover:text-primary",
          iconClass: "text-primary",
        }
      : null,
    hasValue(contact.phone)
      ? {
          href: phoneHref,
          icon: Phone,
          label: "Phone",
          value: contact.phone,
          accentClass: "bg-secondary/10 group-hover:bg-secondary/20",
          hrefClass: "group-hover:text-secondary",
          iconClass: "text-secondary",
        }
      : null,
    hasValue(contact.location)
      ? {
          href: "",
          icon: MapPin,
          label: "Location",
          value: contact.location,
          accentClass: "bg-accent/10",
          hrefClass: "",
          iconClass: "text-accent",
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null);
  const visibleReferences = contact.references.filter((reference) => hasValue(reference.name));

  if (contactInfo.length === 0 && visibleReferences.length === 0) {
    return null;
  }

  return (
    <section id="contact" className="py-24 relative" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/5 to-muted/10" />
      
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
              <span className="text-secondary">&gt;</span> {contact.sectionLabel}
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />
          </div>
          {hasValue(contact.intro) && (
            <p className="mx-auto max-w-2xl text-center text-muted-foreground">
              {contact.intro}
            </p>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="p-6 bg-card border border-border rounded-xl">
              <h3 className="text-xl font-mono font-semibold mb-6">Contact Information</h3>
              
              <div className="space-y-4">
                {contactInfo.map((item) => {
                  const Icon = item.icon;

                  if (!item.href) {
                    return (
                      <div key={item.label} className="flex items-center gap-4 rounded-lg bg-muted/20 p-4">
                        <div className={`rounded-lg p-2 ${item.accentClass}`}>
                          <Icon className={`h-5 w-5 ${item.iconClass}`} />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider text-muted-foreground">{item.label}</p>
                          <p className="font-medium">{item.value}</p>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      className="group flex items-center gap-4 rounded-lg bg-muted/20 p-4 transition-colors hover:bg-muted/40"
                    >
                      <div className={`rounded-lg p-2 transition-colors ${item.accentClass}`}>
                        <Icon className={`h-5 w-5 ${item.iconClass}`} />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">{item.label}</p>
                        <p className={`font-medium transition-colors ${item.hrefClass}`}>{item.value}</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            {hasValue(contact.email) && (
              <motion.a
                href={`mailto:${contact.email}`}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex items-center justify-center gap-3 rounded-xl bg-primary p-4 font-mono font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
              >
                <Send className="w-5 h-5" />
                <span>{contact.ctaLabel}</span>
              </motion.a>
            )}
          </motion.div>

          {/* Referees */}
          {visibleReferences.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-6 text-xl font-mono font-semibold">{contact.referencesHeading}</h3>

                <div className="space-y-4">
                  {visibleReferences.map((referee, index) => (
                    <motion.div
                      key={referee.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                      className="rounded-lg border border-border bg-muted/20 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="rounded-full bg-muted p-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{referee.name}</p>
                          {hasValue(referee.title) && <p className="text-sm text-primary">{referee.title}</p>}
                          {hasValue(referee.company) && <p className="text-sm text-muted-foreground">{referee.company}</p>}
                          <div className="mt-1 flex flex-col gap-1">
                            {hasValue(referee.phone) && (
                              <a
                                href={`tel:${referee.phone.replace(/\s+/g, "")}`}
                                className="text-sm text-muted-foreground transition-colors hover:text-secondary"
                              >
                                {referee.phone}
                              </a>
                            )}
                            {hasValue(referee.email) && (
                              <a
                                href={`mailto:${referee.email}`}
                                className="text-sm text-muted-foreground transition-colors hover:text-primary"
                              >
                                {referee.email}
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
