import type { Dispatch, SetStateAction } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PortfolioContent } from "@/data/portfolio-content";
import { FormField, ItemEditorCard, RemoveItemButton } from "@/components/admin/shared";
import { createId, joinLines, parseLines, removeArrayItem, updateArrayItem } from "@/components/admin/utils";

interface AboutSectionEditorProps {
  draftContent: PortfolioContent;
  setDraftContent: Dispatch<SetStateAction<PortfolioContent>>;
}

const AboutSectionEditor = ({ draftContent, setDraftContent }: AboutSectionEditorProps) => (
  <div className="space-y-5">
    <div className="grid gap-4 md:grid-cols-2">
      <FormField htmlFor="about-section-label" label="Section label">
        <Input
          id="about-section-label"
          value={draftContent.about.sectionLabel}
          onChange={(event) =>
            setDraftContent((current) => ({
              ...current,
              about: { ...current.about, sectionLabel: event.target.value },
            }))
          }
        />
      </FormField>
      <FormField htmlFor="about-title" label="Section title">
        <Input
          id="about-title"
          value={draftContent.about.title}
          onChange={(event) =>
            setDraftContent((current) => ({
              ...current,
              about: { ...current.about, title: event.target.value },
            }))
          }
        />
      </FormField>
    </div>

    <FormField htmlFor="about-paragraphs" label="Profile paragraphs" description="Enter one paragraph per line.">
      <Textarea
        id="about-paragraphs"
        className="min-h-[180px]"
        value={joinLines(draftContent.about.paragraphs)}
        onChange={(event) =>
          setDraftContent((current) => ({
            ...current,
            about: { ...current.about, paragraphs: parseLines(event.target.value) },
          }))
        }
      />
    </FormField>

    <FormField htmlFor="about-goals" label="Career goals" description="Enter one goal per line.">
      <Textarea
        id="about-goals"
        className="min-h-[140px]"
        value={joinLines(draftContent.about.goals)}
        onChange={(event) =>
          setDraftContent((current) => ({
            ...current,
            about: { ...current.about, goals: parseLines(event.target.value) },
          }))
        }
      />
    </FormField>

    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Languages</h3>
          <p className="text-sm text-muted-foreground">Add or remove spoken languages and their levels.</p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            setDraftContent((current) => ({
              ...current,
              about: {
                ...current.about,
                languages: [...current.about.languages, { id: createId("lang"), name: "", level: "" }],
              },
            }))
          }
        >
          <Plus className="h-4 w-4" />
          Add language
        </Button>
      </div>

      <div className="grid gap-4">
        {draftContent.about.languages.map((language, index) => (
          <ItemEditorCard
            key={language.id}
            title={`Language ${index + 1}`}
            action={
              <RemoveItemButton
                onClick={() =>
                  setDraftContent((current) => ({
                    ...current,
                    about: {
                      ...current.about,
                      languages: removeArrayItem(current.about.languages, index),
                    },
                  }))
                }
              />
            }
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormField htmlFor={`language-name-${language.id}`} label="Language name">
                <Input
                  id={`language-name-${language.id}`}
                  value={language.name}
                  onChange={(event) =>
                    setDraftContent((current) => ({
                      ...current,
                      about: {
                        ...current.about,
                        languages: updateArrayItem(current.about.languages, index, (item) => ({
                          ...item,
                          name: event.target.value,
                        })),
                      },
                    }))
                  }
                />
              </FormField>
              <FormField htmlFor={`language-level-${language.id}`} label="Level">
                <Input
                  id={`language-level-${language.id}`}
                  value={language.level}
                  onChange={(event) =>
                    setDraftContent((current) => ({
                      ...current,
                      about: {
                        ...current.about,
                        languages: updateArrayItem(current.about.languages, index, (item) => ({
                          ...item,
                          level: event.target.value,
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
  </div>
);

export default AboutSectionEditor;
