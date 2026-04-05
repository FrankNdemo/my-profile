import type { Dispatch, SetStateAction } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PortfolioContent } from "@/data/portfolio-content";
import { FormField, ItemEditorCard, RemoveItemButton, selectClassName } from "@/components/admin/shared";
import { createId, joinLines, parseLines, removeArrayItem, updateArrayItem } from "@/components/admin/utils";
import { hasValue } from "@/lib/content-filters";

interface CertificationsSectionEditorProps {
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

const CertificationsSectionEditor = ({
  draftContent,
  setDraftContent,
}: CertificationsSectionEditorProps) => {
  const handleCertificationImageSelection = async (index: number, file: File | null) => {
    if (!file) {
      return;
    }

    try {
      const imageSrc = await readImageFileAsDataUrl(file);

      setDraftContent((current) => ({
        ...current,
        certifications: {
          ...current.certifications,
          items: updateArrayItem(current.certifications.items, index, (entry) => ({
            ...entry,
            imageSrc,
            imageAlt: hasValue(entry.imageAlt)
              ? entry.imageAlt
              : `${entry.title.trim() || "Certification"} preview image`,
          })),
        },
      }));
    } catch (error) {
      console.error("Unable to load the selected certification image.", error);
    }
  };

  return (
  <div className="space-y-5">
    <div className="grid gap-4 md:grid-cols-2">
      <FormField htmlFor="certifications-section-label" label="Section label">
        <Input
          id="certifications-section-label"
          value={draftContent.certifications.sectionLabel}
          onChange={(event) =>
            setDraftContent((current) => ({
              ...current,
              certifications: { ...current.certifications, sectionLabel: event.target.value },
            }))
          }
        />
      </FormField>
      <FormField htmlFor="certifications-title" label="Section title">
        <Input
          id="certifications-title"
          value={draftContent.certifications.title}
          onChange={(event) =>
            setDraftContent((current) => ({
              ...current,
              certifications: { ...current.certifications, title: event.target.value },
            }))
          }
        />
      </FormField>
    </div>

    <FormField htmlFor="certifications-intro" label="Intro text">
      <Textarea
        id="certifications-intro"
        className="min-h-[140px]"
        value={draftContent.certifications.intro}
        onChange={(event) =>
          setDraftContent((current) => ({
            ...current,
            certifications: { ...current.certifications, intro: event.target.value },
          }))
        }
      />
    </FormField>

    <FormField htmlFor="certifications-highlight" label="Highlight text">
      <Textarea
        id="certifications-highlight"
        className="min-h-[120px]"
        value={draftContent.certifications.highlight}
        onChange={(event) =>
          setDraftContent((current) => ({
            ...current,
            certifications: { ...current.certifications, highlight: event.target.value },
          }))
        }
      />
    </FormField>

    <div className="flex items-center justify-between gap-3">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Certification cards</h3>
        <p className="text-sm text-muted-foreground">Manage statuses, images, skills, and verification links.</p>
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          setDraftContent((current) => ({
            ...current,
            certifications: {
              ...current.certifications,
              items: [
                ...current.certifications.items,
                {
                  id: createId("cert"),
                  title: "",
                  issuer: "",
                  issuedOn: "",
                  credentialId: "",
                  status: "Completed",
                  imageSrc: "",
                  imageAlt: "",
                  credentialUrl: "",
                  skills: [],
                },
              ],
            },
          }))
        }
      >
        <Plus className="h-4 w-4" />
        Add certification
      </Button>
    </div>

    <div className="space-y-4">
      {draftContent.certifications.items.map((item, index) => (
        <ItemEditorCard
          key={item.id}
          title={`Certification ${index + 1}`}
          action={
            <RemoveItemButton
              onClick={() =>
                setDraftContent((current) => ({
                  ...current,
                  certifications: {
                    ...current.certifications,
                    items: removeArrayItem(current.certifications.items, index),
                  },
                }))
              }
            />
          }
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <FormField htmlFor={`certification-title-${item.id}`} label="Title">
              <Input
                id={`certification-title-${item.id}`}
                value={item.title}
                onChange={(event) =>
                  setDraftContent((current) => ({
                    ...current,
                    certifications: {
                      ...current.certifications,
                      items: updateArrayItem(current.certifications.items, index, (entry) => ({
                        ...entry,
                        title: event.target.value,
                      })),
                    },
                  }))
                }
              />
            </FormField>
            <FormField htmlFor={`certification-issuer-${item.id}`} label="Issuer">
              <Input
                id={`certification-issuer-${item.id}`}
                value={item.issuer}
                onChange={(event) =>
                  setDraftContent((current) => ({
                    ...current,
                    certifications: {
                      ...current.certifications,
                      items: updateArrayItem(current.certifications.items, index, (entry) => ({
                        ...entry,
                        issuer: event.target.value,
                      })),
                    },
                  }))
                }
              />
            </FormField>
            <FormField htmlFor={`certification-issued-on-${item.id}`} label="Issued on">
              <Input
                id={`certification-issued-on-${item.id}`}
                value={item.issuedOn}
                onChange={(event) =>
                  setDraftContent((current) => ({
                    ...current,
                    certifications: {
                      ...current.certifications,
                      items: updateArrayItem(current.certifications.items, index, (entry) => ({
                        ...entry,
                        issuedOn: event.target.value,
                      })),
                    },
                  }))
                }
              />
            </FormField>
            <FormField htmlFor={`certification-id-${item.id}`} label="Credential ID">
              <Input
                id={`certification-id-${item.id}`}
                value={item.credentialId}
                onChange={(event) =>
                  setDraftContent((current) => ({
                    ...current,
                    certifications: {
                      ...current.certifications,
                      items: updateArrayItem(current.certifications.items, index, (entry) => ({
                        ...entry,
                        credentialId: event.target.value,
                      })),
                    },
                  }))
                }
              />
            </FormField>
            <FormField htmlFor={`certification-status-${item.id}`} label="Status">
              <select
                id={`certification-status-${item.id}`}
                className={selectClassName}
                value={item.status}
                onChange={(event) =>
                  setDraftContent((current) => ({
                    ...current,
                    certifications: {
                      ...current.certifications,
                      items: updateArrayItem(current.certifications.items, index, (entry) => ({
                        ...entry,
                        status: event.target.value as typeof entry.status,
                      })),
                    },
                  }))
                }
              >
                <option value="Completed">Completed</option>
                <option value="Active">Active</option>
                <option value="In Progress">In Progress</option>
              </select>
            </FormField>
            <FormField htmlFor={`certification-url-${item.id}`} label="Verification URL">
              <Input
                id={`certification-url-${item.id}`}
                value={item.credentialUrl}
                onChange={(event) =>
                  setDraftContent((current) => ({
                    ...current,
                    certifications: {
                      ...current.certifications,
                      items: updateArrayItem(current.certifications.items, index, (entry) => ({
                        ...entry,
                        credentialUrl: event.target.value,
                      })),
                    },
                  }))
                }
              />
            </FormField>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/35 p-4">
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-foreground">Certificate image</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Upload a certificate photo from your device or paste an image URL. The live certification card will update after you save.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
              <div className="overflow-hidden rounded-2xl border border-border/70 bg-muted/20">
                <div className="aspect-[4/3]">
                  <img
                    src={hasValue(item.imageSrc) ? item.imageSrc : "/certificate-placeholder.svg"}
                    alt={hasValue(item.imageAlt) ? item.imageAlt : `${item.title || "Certification"} preview`}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  htmlFor={`certification-image-upload-${item.id}`}
                  label="Insert photo"
                  description="Choose a PNG, JPG, SVG, or WebP image from your computer."
                >
                  <Input
                    id={`certification-image-upload-${item.id}`}
                    accept="image/*"
                    type="file"
                    onChange={async (event) => {
                      const file = event.target.files?.[0] ?? null;
                      await handleCertificationImageSelection(index, file);
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
                        certifications: {
                          ...current.certifications,
                          items: updateArrayItem(current.certifications.items, index, (entry) => ({
                            ...entry,
                            imageSrc: "",
                          })),
                        },
                      }))
                    }
                  >
                    Remove photo
                  </Button>
                </div>

                <FormField
                  htmlFor={`certification-image-src-${item.id}`}
                  label="Or paste image URL / path"
                  description="Use this if the certificate image is already online or in the public folder."
                >
                  <Input
                    id={`certification-image-src-${item.id}`}
                    value={item.imageSrc}
                    onChange={(event) =>
                      setDraftContent((current) => ({
                        ...current,
                        certifications: {
                          ...current.certifications,
                          items: updateArrayItem(current.certifications.items, index, (entry) => ({
                            ...entry,
                            imageSrc: event.target.value,
                          })),
                        },
                      }))
                    }
                  />
                </FormField>

                <FormField htmlFor={`certification-image-alt-${item.id}`} label="Image alt text">
                  <Input
                    id={`certification-image-alt-${item.id}`}
                    value={item.imageAlt}
                    onChange={(event) =>
                      setDraftContent((current) => ({
                        ...current,
                        certifications: {
                          ...current.certifications,
                          items: updateArrayItem(current.certifications.items, index, (entry) => ({
                            ...entry,
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

          <FormField htmlFor={`certification-skills-${item.id}`} label="Certification skills" description="Enter one skill per line.">
            <Textarea
              id={`certification-skills-${item.id}`}
              className="min-h-[120px]"
              value={joinLines(item.skills)}
              onChange={(event) =>
                setDraftContent((current) => ({
                  ...current,
                  certifications: {
                    ...current.certifications,
                    items: updateArrayItem(current.certifications.items, index, (entry) => ({
                      ...entry,
                      skills: parseLines(event.target.value),
                    })),
                  },
                }))
              }
            />
          </FormField>
        </ItemEditorCard>
      ))}
    </div>
  </div>
  );
};

export default CertificationsSectionEditor;
