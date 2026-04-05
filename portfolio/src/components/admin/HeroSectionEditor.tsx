import type { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PortfolioContent } from "@/data/portfolio-content";
import { FormField } from "@/components/admin/shared";
import { joinLines, parseLines } from "@/components/admin/utils";
import { hasValue } from "@/lib/content-filters";

interface HeroSectionEditorProps {
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

const HeroSectionEditor = ({ draftContent, setDraftContent }: HeroSectionEditorProps) => {
  const handleHeroImageSelection = async (file: File | null) => {
    if (!file) {
      return;
    }

    try {
      const imageSrc = await readImageFileAsDataUrl(file);

      setDraftContent((current) => ({
        ...current,
        hero: {
          ...current.hero,
          profileImageSrc: imageSrc,
          profileImageAlt: hasValue(current.hero.profileImageAlt)
            ? current.hero.profileImageAlt
            : `${current.hero.firstName.trim()} ${current.hero.lastName.trim()} profile photo`.trim(),
        },
      }));
    } catch (error) {
      console.error("Unable to load the selected hero image.", error);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField htmlFor="hero-first-name" label="First name">
          <Input
            id="hero-first-name"
            value={draftContent.hero.firstName}
            onChange={(event) =>
              setDraftContent((current) => ({
                ...current,
                hero: { ...current.hero, firstName: event.target.value },
              }))
            }
          />
        </FormField>
        <FormField htmlFor="hero-last-name" label="Last name">
          <Input
            id="hero-last-name"
            value={draftContent.hero.lastName}
            onChange={(event) =>
              setDraftContent((current) => ({
                ...current,
                hero: { ...current.hero, lastName: event.target.value },
              }))
            }
          />
        </FormField>
      </div>

      <div className="rounded-2xl border border-border/70 bg-background/35 p-4">
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-foreground">Profile image</h4>
          <p className="mt-1 text-xs text-muted-foreground">
            Upload a profile photo from your device or paste an image URL. This image will replace the text inside the hero profile circle.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
          <div className="overflow-hidden rounded-[28px] border border-border/70 bg-muted/20">
            <div className="aspect-square">
              {hasValue(draftContent.hero.profileImageSrc) ? (
                <img
                  src={draftContent.hero.profileImageSrc}
                  alt={
                    hasValue(draftContent.hero.profileImageAlt)
                      ? draftContent.hero.profileImageAlt
                      : `${draftContent.hero.firstName || "Portfolio"} ${draftContent.hero.lastName}`.trim()
                  }
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,hsl(38_48%_62%_/_0.14),transparent_42%),linear-gradient(160deg,hsl(220_24%_14%),hsl(220_22%_11%))]">
                  <div className="flex h-28 w-28 items-center justify-center rounded-full border border-primary/20 bg-background/55 text-4xl font-bold tracking-[0.18em] text-foreground">
                    {`${draftContent.hero.firstName.charAt(0)}${draftContent.hero.lastName.charAt(0)}`.trim().toUpperCase() || "FN"}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              htmlFor="hero-profile-image-upload"
              label="Insert image"
              description="Choose a PNG, JPG, SVG, or WebP image from your computer."
            >
              <Input
                id="hero-profile-image-upload"
                accept="image/*"
                type="file"
                onChange={async (event) => {
                  const file = event.target.files?.[0] ?? null;
                  await handleHeroImageSelection(file);
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
                    hero: {
                      ...current.hero,
                      profileImageSrc: "",
                    },
                  }))
                }
              >
                Remove image
              </Button>
            </div>

            <FormField
              htmlFor="hero-profile-image-src"
              label="Or paste image URL / path"
              description="Use this if your profile photo is already online or inside the public folder."
            >
              <Input
                id="hero-profile-image-src"
                value={draftContent.hero.profileImageSrc}
                onChange={(event) =>
                  setDraftContent((current) => ({
                    ...current,
                    hero: { ...current.hero, profileImageSrc: event.target.value },
                  }))
                }
              />
            </FormField>

            <FormField htmlFor="hero-profile-image-alt" label="Image alt text">
              <Input
                id="hero-profile-image-alt"
                value={draftContent.hero.profileImageAlt}
                onChange={(event) =>
                  setDraftContent((current) => ({
                    ...current,
                    hero: { ...current.hero, profileImageAlt: event.target.value },
                  }))
                }
              />
            </FormField>
          </div>
        </div>
      </div>

      <FormField htmlFor="hero-specialties" label="Specialties" description="Enter one specialty per line.">
        <Textarea
          id="hero-specialties"
          className="min-h-[120px]"
          value={joinLines(draftContent.hero.specialties)}
          onChange={(event) =>
            setDraftContent((current) => ({
              ...current,
              hero: { ...current.hero, specialties: parseLines(event.target.value) },
            }))
          }
        />
      </FormField>

      <FormField htmlFor="hero-summary" label="Summary">
        <Textarea
          id="hero-summary"
          className="min-h-[140px]"
          value={draftContent.hero.summary}
          onChange={(event) =>
            setDraftContent((current) => ({
              ...current,
              hero: { ...current.hero, summary: event.target.value },
            }))
          }
        />
      </FormField>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField htmlFor="hero-primary-label" label="Primary button label">
          <Input
            id="hero-primary-label"
            value={draftContent.hero.primaryCtaLabel}
            onChange={(event) =>
              setDraftContent((current) => ({
                ...current,
                hero: { ...current.hero, primaryCtaLabel: event.target.value },
              }))
            }
          />
        </FormField>
        <FormField htmlFor="hero-primary-link" label="Primary button link">
          <Input
            id="hero-primary-link"
            value={draftContent.hero.primaryCtaHref}
            onChange={(event) =>
              setDraftContent((current) => ({
                ...current,
                hero: { ...current.hero, primaryCtaHref: event.target.value },
              }))
            }
          />
        </FormField>
        <FormField htmlFor="hero-secondary-label" label="Secondary button label">
          <Input
            id="hero-secondary-label"
            value={draftContent.hero.secondaryCtaLabel}
            onChange={(event) =>
              setDraftContent((current) => ({
                ...current,
                hero: { ...current.hero, secondaryCtaLabel: event.target.value },
              }))
            }
          />
        </FormField>
        <FormField htmlFor="hero-secondary-link" label="Secondary button link">
          <Input
            id="hero-secondary-link"
            value={draftContent.hero.secondaryCtaHref}
            onChange={(event) =>
              setDraftContent((current) => ({
                ...current,
                hero: { ...current.hero, secondaryCtaHref: event.target.value },
              }))
            }
          />
        </FormField>
      </div>
    </div>
  );
};

export default HeroSectionEditor;
