import type { Dispatch, SetStateAction } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PortfolioContent } from "@/data/portfolio-content";
import { FormField, ItemEditorCard, RemoveItemButton } from "@/components/admin/shared";
import { createId, joinLines, parseLines, removeArrayItem, updateArrayItem } from "@/components/admin/utils";

interface ExperienceSectionEditorProps {
  draftContent: PortfolioContent;
  setDraftContent: Dispatch<SetStateAction<PortfolioContent>>;
}

const ExperienceSectionEditor = ({ draftContent, setDraftContent }: ExperienceSectionEditorProps) => (
  <div className="space-y-5">
    <div className="grid gap-4 md:grid-cols-2">
      <FormField htmlFor="experience-section-label" label="Section label">
        <Input
          id="experience-section-label"
          value={draftContent.experience.sectionLabel}
          onChange={(event) =>
            setDraftContent((current) => ({
              ...current,
              experience: { ...current.experience, sectionLabel: event.target.value },
            }))
          }
        />
      </FormField>
      <FormField htmlFor="experience-title" label="Section title">
        <Input
          id="experience-title"
          value={draftContent.experience.title}
          onChange={(event) =>
            setDraftContent((current) => ({
              ...current,
              experience: { ...current.experience, title: event.target.value },
            }))
          }
        />
      </FormField>
    </div>

    <div className="flex items-center justify-between gap-3">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Experience items</h3>
        <p className="text-sm text-muted-foreground">Each item becomes a timeline entry on the site.</p>
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          setDraftContent((current) => ({
            ...current,
            experience: {
              ...current.experience,
              items: [
                ...current.experience.items,
                {
                  id: createId("exp"),
                  title: "",
                  company: "",
                  location: "",
                  period: "",
                  type: "",
                  responsibilities: [],
                },
              ],
            },
          }))
        }
      >
        <Plus className="h-4 w-4" />
        Add experience
      </Button>
    </div>

    <div className="space-y-4">
      {draftContent.experience.items.map((item, index) => (
        <ItemEditorCard
          key={item.id}
          title={`Experience ${index + 1}`}
          action={
            <RemoveItemButton
              onClick={() =>
                setDraftContent((current) => ({
                  ...current,
                  experience: {
                    ...current.experience,
                    items: removeArrayItem(current.experience.items, index),
                  },
                }))
              }
            />
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
            <FormField htmlFor={`experience-title-${item.id}`} label="Role title">
              <Input
                id={`experience-title-${item.id}`}
                value={item.title}
                onChange={(event) =>
                  setDraftContent((current) => ({
                    ...current,
                    experience: {
                      ...current.experience,
                      items: updateArrayItem(current.experience.items, index, (entry) => ({
                        ...entry,
                        title: event.target.value,
                      })),
                    },
                  }))
                }
              />
            </FormField>
            <FormField htmlFor={`experience-company-${item.id}`} label="Company">
              <Input
                id={`experience-company-${item.id}`}
                value={item.company}
                onChange={(event) =>
                  setDraftContent((current) => ({
                    ...current,
                    experience: {
                      ...current.experience,
                      items: updateArrayItem(current.experience.items, index, (entry) => ({
                        ...entry,
                        company: event.target.value,
                      })),
                    },
                  }))
                }
              />
            </FormField>
            <FormField htmlFor={`experience-location-${item.id}`} label="Location">
              <Input
                id={`experience-location-${item.id}`}
                value={item.location}
                onChange={(event) =>
                  setDraftContent((current) => ({
                    ...current,
                    experience: {
                      ...current.experience,
                      items: updateArrayItem(current.experience.items, index, (entry) => ({
                        ...entry,
                        location: event.target.value,
                      })),
                    },
                  }))
                }
              />
            </FormField>
            <FormField htmlFor={`experience-period-${item.id}`} label="Period">
              <Input
                id={`experience-period-${item.id}`}
                value={item.period}
                onChange={(event) =>
                  setDraftContent((current) => ({
                    ...current,
                    experience: {
                      ...current.experience,
                      items: updateArrayItem(current.experience.items, index, (entry) => ({
                        ...entry,
                        period: event.target.value,
                      })),
                    },
                  }))
                }
              />
            </FormField>
            <FormField htmlFor={`experience-type-${item.id}`} label="Type">
              <Input
                id={`experience-type-${item.id}`}
                value={item.type}
                onChange={(event) =>
                  setDraftContent((current) => ({
                    ...current,
                    experience: {
                      ...current.experience,
                      items: updateArrayItem(current.experience.items, index, (entry) => ({
                        ...entry,
                        type: event.target.value,
                      })),
                    },
                  }))
                }
              />
            </FormField>
          </div>

          <FormField
            htmlFor={`experience-responsibilities-${item.id}`}
            label="Responsibilities"
            description="Enter one responsibility per line."
          >
            <Textarea
              id={`experience-responsibilities-${item.id}`}
              className="min-h-[150px]"
              value={joinLines(item.responsibilities)}
              onChange={(event) =>
                setDraftContent((current) => ({
                  ...current,
                  experience: {
                    ...current.experience,
                    items: updateArrayItem(current.experience.items, index, (entry) => ({
                      ...entry,
                      responsibilities: parseLines(event.target.value),
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

export default ExperienceSectionEditor;
