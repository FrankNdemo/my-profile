import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Github, ImageIcon, Link2, MonitorDot } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { usePortfolio } from "@/context/PortfolioContext";
import { filterFilledStrings, hasMeaningfulValue, hasValue } from "@/lib/content-filters";
import { cn } from "@/lib/utils";
import MediaLightbox from "@/components/MediaLightbox";

const PROJECT_DESCRIPTION_PREVIEW_LENGTH = 170;

const getLinkIcon = (label: string, url: string) => {
  const normalizedLabel = `${label} ${url}`.toLowerCase();

  if (normalizedLabel.includes("github") || normalizedLabel.includes("source")) {
    return Github;
  }

  if (normalizedLabel.includes("demo") || normalizedLabel.includes("live")) {
    return MonitorDot;
  }

  return Link2;
};

const normalizeExternalUrl = (url: string) => {
  const trimmedUrl = url.trim();

  if (!trimmedUrl) {
    return "";
  }

  if (/^(\/|\.\/|\.\.\/|#)/.test(trimmedUrl)) {
    return trimmedUrl;
  }

  if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmedUrl)) {
    return trimmedUrl;
  }

  if (
    /^(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?(\/.*)?$/i.test(trimmedUrl) ||
    /^(10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})(:\d+)?(\/.*)?$/i.test(trimmedUrl)
  ) {
    return `http://${trimmedUrl}`;
  }

  return `https://${trimmedUrl}`;
};

const getReadableProjectUrl = (url: string) => {
  if (!hasValue(url)) {
    return "";
  }

  if (/^(\/|\.\/|\.\.\/|#)/.test(url)) {
    return url;
  }

  if (/^mailto:/i.test(url)) {
    return url.replace(/^mailto:/i, "");
  }

  if (/^tel:/i.test(url)) {
    return url.replace(/^tel:/i, "");
  }

  try {
    const parsedUrl = new URL(url);
    const path = parsedUrl.pathname === "/" ? "" : parsedUrl.pathname;
    const readableUrl = `${parsedUrl.host}${path}${parsedUrl.search}`;

    return readableUrl.length > 52 ? `${readableUrl.slice(0, 49)}...` : readableUrl;
  } catch {
    const fallbackUrl = url.replace(/^(https?:\/\/)/i, "");
    return fallbackUrl.length > 52 ? `${fallbackUrl.slice(0, 49)}...` : fallbackUrl;
  }
};

const getProjectLinkLabel = (label: string, url: string) => {
  const trimmedLabel = label.trim();
  const normalizedLabel = trimmedLabel.toLowerCase();
  const normalizedUrl = url.toLowerCase();

  if (!trimmedLabel) {
    if (normalizedUrl.includes("github.com")) {
      return "View Repository";
    }

    if (normalizedUrl.includes("case-study")) {
      return "View Case Study";
    }

    return "View Site";
  }

  if (normalizedLabel.includes("github") || normalizedLabel.includes("repository")) {
    return "View Repository";
  }

  if (normalizedLabel.includes("source")) {
    return "View Source Code";
  }

  if (normalizedLabel.includes("case study")) {
    return "View Case Study";
  }

  if (normalizedLabel.includes("demo") || normalizedLabel.includes("live") || normalizedLabel.includes("system")) {
    return "View Site";
  }

  return trimmedLabel.replace(/^attach\s+/i, "View ").replace(/^add\s+/i, "Open ");
};

const ProjectsSection = () => {
  const {
    content: { projects },
  } = usePortfolio();
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});
  const [selectedPreview, setSelectedPreview] = useState<{
    alt: string;
    src: string;
    title: string;
  } | null>(null);
  const visibleProjects = projects.items.filter((project) => hasValue(project.title) && hasValue(project.description));

  if (visibleProjects.length === 0) {
    return null;
  }

  const toggleProjectDescription = (projectId: string) => {
    setExpandedProjects((current) => ({
      ...current,
      [projectId]: !current[projectId],
    }));
  };

  return (
    <section id="projects" className="relative py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(38_48%_62%_/_0.12),transparent_36%)]" />

      <div className="container relative z-10 mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.34em] text-primary/85">
            {projects.sectionLabel}
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            {projects.title}
          </h2>
          {hasValue(projects.intro) && (
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              {projects.intro}
            </p>
          )}
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {visibleProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              index={index}
              isExpanded={Boolean(expandedProjects[project.id])}
              onPreviewImage={(src, alt, title) => setSelectedPreview({ src, alt, title })}
              onToggleDescription={() => toggleProjectDescription(project.id)}
              project={project}
            />
          ))}
        </div>
      </div>

      <MediaLightbox
        open={selectedPreview !== null}
        onClose={() => setSelectedPreview(null)}
        src={selectedPreview?.src ?? ""}
        alt={selectedPreview?.alt ?? "Project preview"}
        title={selectedPreview?.title}
      />
    </section>
  );
};

interface ProjectCardProps {
  index: number;
  isExpanded: boolean;
  onPreviewImage: (src: string, alt: string, title: string) => void;
  onToggleDescription: () => void;
  project: ProjectsSectionProject;
}

type ProjectsSectionProject = ProjectsSectionContent["items"][number];
type ProjectsSectionContent = ReturnType<typeof usePortfolio>["content"]["projects"];

const ProjectCard = ({ index, isExpanded, onPreviewImage, onToggleDescription, project }: ProjectCardProps) => {
  const visibleStack = filterFilledStrings(project.stack);
  const visibleLinks = project.links
    .map((link) => {
      const normalizedUrl = normalizeExternalUrl(link.url);

      return {
        ...link,
        displayLabel: getProjectLinkLabel(link.label, normalizedUrl),
        displayUrl: getReadableProjectUrl(normalizedUrl),
        normalizedUrl,
      };
    })
    .filter((link) => Boolean(link.normalizedUrl));
  const shouldTruncate = project.description.length > PROJECT_DESCRIPTION_PREVIEW_LENGTH;
  const previewDescription = shouldTruncate
    ? `${project.description.slice(0, PROJECT_DESCRIPTION_PREVIEW_LENGTH).trimEnd()}...`
    : project.description;
  const description = isExpanded ? project.description : previewDescription;
  const previewImage = hasValue(project.imageSrc) ? project.imageSrc : "/project-placeholder.svg";
  const previewAlt = hasValue(project.imageAlt) ? project.imageAlt : `${project.title} preview`;
  const hasCustomPreview = hasMeaningfulValue(project.imageSrc, ["/project-placeholder.svg"]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Card className="group h-full overflow-hidden rounded-[28px] border border-border/80 bg-card/95 shadow-[0_24px_50px_rgba(8,15,30,0.2)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/45">
        <div className="relative aspect-[16/10] overflow-hidden border-b border-border/70 bg-muted/15">
          <img
            src={previewImage}
            alt={previewAlt}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/55 via-transparent to-transparent" />
          {hasCustomPreview && (
            <button
              type="button"
              onClick={() => onPreviewImage(previewImage, previewAlt, project.title)}
              className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/88 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary transition-colors hover:border-primary/40 hover:bg-primary/12"
            >
              <ImageIcon className="h-3.5 w-3.5" />
              Preview Image
            </button>
          )}
          <span className="absolute left-5 top-5 rounded-full border border-primary/20 bg-background/85 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            {project.category}
          </span>
          <span className="absolute right-5 top-5 rounded-full border border-border/70 bg-background/85 px-3 py-1 text-xs font-medium text-muted-foreground">
            {project.year}
          </span>
        </div>

        <CardContent className="p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                {project.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {description}
              </p>
              {shouldTruncate && (
                <button
                  type="button"
                  onClick={onToggleDescription}
                  className="mt-3 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  {isExpanded ? "View less" : "View more"}
                </button>
              )}
            </div>
            <span className="hidden rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary md:inline-flex">
              Featured
            </span>
          </div>

          {visibleStack.length > 0 && (
            <div className="mb-6 grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
              {visibleStack.map((item) => (
                <span
                  key={item}
                  className="flex min-w-0 items-center justify-center rounded-full border border-border/80 bg-muted/20 px-2 py-2 text-center text-[10px] font-medium leading-tight text-muted-foreground sm:px-3 sm:py-1 sm:text-xs"
                >
                  {item}
                </span>
              ))}
            </div>
          )}

          {visibleLinks.length > 0 && (
            <div className="grid gap-3">
              {visibleLinks.map((link) => {
              const LinkIcon = getLinkIcon(link.displayLabel, link.normalizedUrl);

              return (
                <a
                  key={link.id}
                  href={link.normalizedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group/project-link flex items-center justify-between rounded-2xl border border-border/80 bg-background/50 px-4 py-3 text-sm font-medium text-foreground transition-all duration-200",
                    "hover:border-primary/40 hover:bg-primary/10 hover:text-primary",
                  )}
                >
                  <span className="flex min-w-0 items-start gap-3">
                    <LinkIcon className="mt-0.5 h-4 w-4 shrink-0" />
                    <span className="min-w-0">
                      <span className="block truncate">{link.displayLabel}</span>
                      {hasValue(link.displayUrl) && (
                        <span className="block truncate text-xs font-normal text-muted-foreground transition-colors duration-200 group-hover/project-link:text-primary/80">
                          {link.displayUrl}
                        </span>
                      )}
                    </span>
                  </span>
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProjectsSection;
