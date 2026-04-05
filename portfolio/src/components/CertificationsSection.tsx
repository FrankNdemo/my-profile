import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowUpRight, BadgeCheck, CalendarDays, FileBadge2, ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { usePortfolio } from "@/context/PortfolioContext";
import { filterFilledStrings, hasMeaningfulValue, hasValue } from "@/lib/content-filters";
import { cn } from "@/lib/utils";
import MediaLightbox from "@/components/MediaLightbox";

const certifications = [
  {
    name: "Cisco Certified Network Associate (CCNA)",
    issuer: "Cisco",
    date: "February 2024",
    status: "completed",
    color: "primary",
  },
  {
    name: "Enterprise Networking, Security & Automation",
    issuer: "Cisco",
    date: "December 2024",
    status: "completed",
    color: "primary",
  },
  {
    name: "Certified in Cybersecurity (CC)",
    issuer: "ISC²",
    date: "April 2026",
    status: "in-progress",
    color: "secondary",
  },
  {
    name: "Cyber Threat Management",
    issuer: "Cisco",
    date: "February 2026",
    status: "in-progress",
    color: "secondary",
  },
];

const CertificationsSection = () => {
  const {
    content: { certifications: certificationsContent },
  } = usePortfolio();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedPreview, setSelectedPreview] = useState<{
    alt: string;
    src: string;
    title: string;
  } | null>(null);
  const visibleCertifications = certificationsContent.items.filter(
    (certification) => hasValue(certification.title) && hasValue(certification.issuer),
  );

  if (visibleCertifications.length === 0) {
    return null;
  }

  return (
    <section id="certifications" className="relative py-24" ref={ref}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,hsl(203_28%_58%_/_0.1),transparent_36%)]" />

      <div className="container relative mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.34em] text-primary/85">
            {certificationsContent.sectionLabel}
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            {certificationsContent.title}
          </h2>
          {hasValue(certificationsContent.intro) && (
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              {certificationsContent.intro}
            </p>
          )}
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {visibleCertifications.map((cert, index) => {
            const visibleSkills = filterFilledStrings(cert.skills);
            const hasCredentialId = hasMeaningfulValue(cert.credentialId, ["Add credential ID"]);
            const hasCredentialUrl = hasValue(cert.credentialUrl);
            const hasCertificateImage = hasMeaningfulValue(cert.imageSrc, ["/certificate-placeholder.svg"]);

            return (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group h-full overflow-hidden rounded-[28px] border border-border/80 bg-card/95 shadow-[0_24px_50px_rgba(8,15,30,0.18)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/45">
                <div className="relative aspect-[4/3] overflow-hidden border-b border-border/70 bg-muted/10">
                  <img
                    src={hasValue(cert.imageSrc) ? cert.imageSrc : "/certificate-placeholder.svg"}
                    alt={hasValue(cert.imageAlt) ? cert.imageAlt : `${cert.title} certificate preview`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
                  <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-border/70 bg-background/85 px-4 py-1 text-xs font-medium text-foreground">
                    <FileBadge2 className="h-3.5 w-3.5 text-primary" />
                    {cert.issuer}
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                        {cert.title}
                      </h3>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <CalendarDays className="h-4 w-4 text-primary" />
                          {cert.issuedOn}
                        </span>
                        {hasCredentialId && (
                          <span className="rounded-full border border-border/80 bg-muted/20 px-3 py-1 text-xs">
                            {cert.credentialId}
                          </span>
                        )}
                      </div>
                    </div>

                    <span
                      className={cn(
                        "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                        cert.status === "Completed"
                          ? "bg-primary/12 text-primary"
                          : cert.status === "Active"
                            ? "bg-secondary/12 text-secondary"
                            : "bg-accent/12 text-accent",
                      )}
                    >
                      {cert.status}
                    </span>
                  </div>

                  {visibleSkills.length > 0 && (
                    <div className="mb-6 flex flex-wrap gap-2">
                      {visibleSkills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-border/80 bg-muted/20 px-3 py-1 text-xs font-medium text-muted-foreground"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {(hasCertificateImage || hasCredentialUrl) && (
                    <div className="grid gap-3">
                      {hasCertificateImage && (
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedPreview({
                              src: cert.imageSrc,
                              alt: hasValue(cert.imageAlt) ? cert.imageAlt : `${cert.title} certificate preview`,
                              title: cert.title,
                            })
                          }
                          className="flex items-center justify-between rounded-2xl border border-border/80 bg-background/50 px-4 py-3 text-sm font-medium text-foreground transition-all duration-200 hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                        >
                          <span className="flex items-center gap-3">
                            <ImageIcon className="h-4 w-4" />
                            View Certificate
                          </span>
                          <ArrowUpRight className="h-4 w-4" />
                        </button>
                      )}

                      {hasCredentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between rounded-2xl border border-border/80 bg-background/50 px-4 py-3 text-sm font-medium text-foreground transition-all duration-200 hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                        >
                          <span className="flex items-center gap-3">
                            <BadgeCheck className="h-4 w-4" />
                            Verify Credential
                          </span>
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
            );
          })}
        </div>

        {hasValue(certificationsContent.highlight) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 rounded-[28px] border border-primary/20 bg-gradient-to-r from-primary/10 via-background/60 to-secondary/10 p-6 text-center"
          >
            <p className="text-lg text-muted-foreground">
              {certificationsContent.highlight}
            </p>
          </motion.div>
        )}
      </div>

      <MediaLightbox
        open={selectedPreview !== null}
        onClose={() => setSelectedPreview(null)}
        src={selectedPreview?.src ?? ""}
        alt={selectedPreview?.alt ?? "Certificate preview"}
        title={selectedPreview?.title}
      />
    </section>
  );
};

export default CertificationsSection;
