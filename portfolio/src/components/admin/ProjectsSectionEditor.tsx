import type { Dispatch, SetStateAction } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PortfolioContent } from "@/data/portfolio-content";
import { FormField, ItemEditorCard, RemoveItemButton } from "@/components/admin/shared";
import { createId, joinLines, parseLines, removeArrayItem, updateArrayItem } from "@/components/admin/utils";
import { hasValue } from "@/lib/content-filters";

interface ProjectsSectionEditorProps {
  draftContent: PortfolioContent;
  setDraftContent: Dispatch<SetStateAction<PortfolioContent>>;
}

const readImageFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Unable to read the selected image."));
    };

    reader.onerror = () => {
      reject(new Error("Unable to read the selected image."));
    };

    reader.readAsDataURL(file);
  });

const ProjectsSectionEditor = ({ draftContent, setDraftContent }: ProjectsSectionEditorProps) => {
  const handleProjectImageSelection = async (projectIndex: number, file: File | null) => {
    if (!file) {
      return;
    }

    try {
      const imageSrc = await readImageFileAsDataUrl(file);

      setDraftContent((current) => ({
        ...current,
        projects: {
          ...current.projects,
          items: updateArrayItem(current.projects.items, projectIndex, (item) => ({
            ...item,
            imageSrc,
            imageAlt: hasValue(item.imageAlt)
              ? item.imageAlt
              : `${item.title.trim() || "Project"} preview image`,
          })),
        },
      }));
    } catch (error) {
      console.error("Unable to load the selected project image.", error);
    }
  };

  return (
    <div className="space-y-5">
    <div className="grid gap-4 md:grid-cols-2">
      <FormField htmlFor="projects-section-label" label="Section label">
        <Input
          id="projects-section-label"
          value={draftContent.projects.sectionLabel}
          onChange={(event) =>
            setDraftContent((current) => ({
              ...current,
              projects: { ...current.projects, sectionLabel: event.target.value },
            }))
          }
        />
      </FormField>
      <FormField htmlFor="projects-title" label="Section title">
        <Input
          id="projects-title"
          value={draftContent.projects.title}
          onChange={(event) =>
            setDraftContent((current) => ({
              ...current,
              projects: { ...current.projects, title: event.target.value },
            }))
          }
        />
      </FormField>
    </div>

    <FormField htmlFor="projects-intro" label="Intro text">
      <Textarea
        id="projects-intro"
        className="min-h-[140px]"
        value={draftContent.projects.intro}
        onChange={(event) =>
          setDraftContent((current) => ({
            ...current,
            projects: { ...current.projects, intro: event.target.value },
          }))
        }
      />
    </FormField>

    <div className="flex items-center justify-between gap-3">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Project cards</h3>
        <p className="text-sm text-muted-foreground">Manage project details, images, and links.</p>
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          setDraftContent((current) => ({
            ...current,
            projects: {
              ...current.projects,
              items: [
                ...current.projects.items,
                {
                  id: createId("project"),
                  title: "",
                  category: "",
                  year: "",
                  description: "",
                  stack: [],
                  imageSrc: "",
                  imageAlt: "",
                  links: [],
                },
              ],
            },
          }))
        }
      >
        <Plus className="h-4 w-4" />
        Add project
      </Button>
    </div>

    <div className="space-y-4">
      {draftContent.projects.items.map((project, projectIndex) => (
        <ItemEditorCard
          key={project.id}
          title={`Project ${projectIndex + 1}`}
          action={
            <RemoveItemButton
              onClick={() =>
                setDraftContent((current) => ({
                  ...current,
                  projects: {
                    ...current.projects,
                    items: removeArrayItem(current.projects.items, projectIndex),
                  },
                }))
              }
            />
          }
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <FormField htmlFor={`project-title-${project.id}`} label="Title">
              <Input
                id={`project-title-${project.id}`}
                value={project.title}
                onChange={(event) =>
                  setDraftContent((current) => ({
                    ...current,
                    projects: {
                      ...current.projects,
                      items: updateArrayItem(current.projects.items, projectIndex, (item) => ({
                        ...item,
                        title: event.target.value,
                      })),
                    },
                  }))
                }
              />
            </FormField>
            <FormField htmlFor={`project-category-${project.id}`} label="Category">
              <Input
                id={`project-category-${project.id}`}
                value={project.category}
                onChange={(event) =>
                  setDraftContent((current) => ({
                    ...current,
                    projects: {
                      ...current.projects,
                      items: updateArrayItem(current.projects.items, projectIndex, (item) => ({
                        ...item,
                        category: event.target.value,
                      })),
                    },
                  }))
                }
              />
            </FormField>
            <FormField htmlFor={`project-year-${project.id}`} label="Year">
              <Input
                id={`project-year-${project.id}`}
                value={project.year}
                onChange={(event) =>
                  setDraftContent((current) => ({
                    ...current,
                    projects: {
                      ...current.projects,
                      items: updateArrayItem(current.projects.items, projectIndex, (item) => ({
                        ...item,
                        year: event.target.value,
                      })),
                    },
                  }))
                }
              />
            </FormField>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/35 p-4">
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-foreground">Project preview image</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Insert an image from your device or paste an image URL. The live card will update after you save.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
              <div className="overflow-hidden rounded-2xl border border-border/70 bg-muted/20">
                <div className="aspect-[16/10]">
                  <img
                    src={hasValue(project.imageSrc) ? project.imageSrc : "/project-placeholder.svg"}
                    alt={hasValue(project.imageAlt) ? project.imageAlt : `${project.title || "Project"} preview`}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  htmlFor={`project-image-upload-${project.id}`}
                  label="Insert image"
                  description="Choose a PNG, JPG, SVG, or WebP file from your computer."
                >
                  <Input
                    id={`project-image-upload-${project.id}`}
                    accept="image/*"
                    type="file"
                    onChange={async (event) => {
                      const file = event.target.files?.[0] ?? null;
                      await handleProjectImageSelection(projectIndex, file);
                      event.currentTarget.value = "";
                    }}
                  />
                </FormField>

                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setDraftContent((current) => ({
                        ...current,
                        projects: {
                          ...current.projects,
                          items: updateArrayItem(current.projects.items, projectIndex, (item) => ({
                            ...item,
                            imageSrc: "",
                          })),
                        },
                      }))
                    }
                  >
                    Remove image
                  </Button>
                </div>

                <FormField
                  htmlFor={`project-image-src-${project.id}`}
                  label="Or paste image URL / path"
                  description="Use this if your project image is already online or inside the public folder."
                >
                  <Input
                    id={`project-image-src-${project.id}`}
                    value={project.imageSrc}
                    onChange={(event) =>
                      setDraftContent((current) => ({
                        ...current,
                        projects: {
                          ...current.projects,
                          items: updateArrayItem(current.projects.items, projectIndex, (item) => ({
                            ...item,
                            imageSrc: event.target.value,
                          })),
                        },
                      }))
                    }
                  />
                </FormField>

                <FormField htmlFor={`project-image-alt-${project.id}`} label="Image alt text">
                  <Input
                    id={`project-image-alt-${project.id}`}
                    value={project.imageAlt}
                    onChange={(event) =>
                      setDraftContent((current) => ({
                        ...current,
                        projects: {
                          ...current.projects,
                          items: updateArrayItem(current.projects.items, projectIndex, (item) => ({
                            ...item,
                            imageAlt: event.target.value,
                          })),
                        },
                      }))
                    }
                  />
                </FormField>
              </div>
            </div>
          </div>

          <FormField htmlFor={`project-description-${project.id}`} label="Description">
            <Textarea
              id={`project-description-${project.id}`}
              className="min-h-[150px]"
              value={project.description}
              onChange={(event) =>
                setDraftContent((current) => ({
                  ...current,
                  projects: {
                    ...current.projects,
                    items: updateArrayItem(current.projects.items, projectIndex, (item) => ({
                      ...item,
                      description: event.target.value,
                    })),
                  },
                }))
              }
            />
          </FormField>

          <FormField htmlFor={`project-stack-${project.id}`} label="Technology stack" description="Enter one item per line.">
            <Textarea
              id={`project-stack-${project.id}`}
              className="min-h-[120px]"
              value={joinLines(project.stack)}
              onChange={(event) =>
                setDraftContent((current) => ({
                  ...current,
                  projects: {
                    ...current.projects,
                    items: updateArrayItem(current.projects.items, projectIndex, (item) => ({
                      ...item,
                      stack: parseLines(event.target.value),
                    })),
                  },
                }))
              }
            />
          </FormField>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-semibold text-foreground">Project links</h4>
                <p className="text-xs text-muted-foreground">Add live demos, repositories, or case studies.</p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setDraftContent((current) => ({
                    ...current,
                    projects: {
                      ...current.projects,
                      items: updateArrayItem(current.projects.items, projectIndex, (item) => ({
                        ...item,
                        links: [...item.links, { id: createId("link"), label: "", url: "" }],
                      })),
                    },
                  }))
                }
              >
                <Plus className="h-4 w-4" />
                Add link
              </Button>
            </div>

            <div className="space-y-3">
              {project.links.map((link, linkIndex) => (
                <ItemEditorCard
                  key={link.id}
                  title={`Link ${linkIndex + 1}`}
                  action={
                    <RemoveItemButton
                      onClick={() =>
                        setDraftContent((current) => ({
                          ...current,
                          projects: {
                            ...current.projects,
                            items: updateArrayItem(current.projects.items, projectIndex, (item) => ({
                              ...item,
                              links: removeArrayItem(item.links, linkIndex),
                            })),
                          },
                        }))
                      }
                    />
                  }
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      htmlFor={`project-link-label-${link.id}`}
                      label="Button label"
                      description="Optional. If left empty, the site will show a default clickable label like View Site."
                    >
                      <Input
                        id={`project-link-label-${link.id}`}
                        value={link.label}
                        onChange={(event) =>
                          setDraftContent((current) => ({
                            ...current,
                            projects: {
                              ...current.projects,
                              items: updateArrayItem(current.projects.items, projectIndex, (item) => ({
                                ...item,
                                links: updateArrayItem(item.links, linkIndex, (entry) => ({
                                  ...entry,
                                  label: event.target.value,
                                })),
                              })),
                            },
                          }))
                        }
                      />
                    </FormField>
                    <FormField
                      htmlFor={`project-link-url-${link.id}`}
                      label="URL"
                      description="Paste the website link here. It will appear on the live project card after saving."
                    >
                      <Input
                        id={`project-link-url-${link.id}`}
                        value={link.url}
                        onChange={(event) =>
                          setDraftContent((current) => ({
                            ...current,
                            projects: {
                              ...current.projects,
                              items: updateArrayItem(current.projects.items, projectIndex, (item) => ({
                                ...item,
                                links: updateArrayItem(item.links, linkIndex, (entry) => ({
                                  ...entry,
                                  url: event.target.value,
                                })),
                              })),
                            },
                          }))
                        }
                      />
                    </FormField>
                  </div>
                </ItemEditorCard>
              ))}
            </div>
          </div>
        </ItemEditorCard>
      ))}
    </div>
    </div>
  );
};

export default ProjectsSectionEditor;
