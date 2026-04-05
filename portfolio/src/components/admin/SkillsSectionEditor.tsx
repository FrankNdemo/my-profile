import type { Dispatch, SetStateAction } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PortfolioContent } from "@/data/portfolio-content";
import { FormField, ItemEditorCard, RemoveItemButton } from "@/components/admin/shared";
import { createId, removeArrayItem, updateArrayItem } from "@/components/admin/utils";

interface SkillsSectionEditorProps {
  draftContent: PortfolioContent;
  setDraftContent: Dispatch<SetStateAction<PortfolioContent>>;
}

const SkillsSectionEditor = ({ draftContent, setDraftContent }: SkillsSectionEditorProps) => (
  <div className="space-y-5">
    <div className="grid gap-4 md:grid-cols-2">
      <FormField htmlFor="skills-section-label" label="Section label">
        <Input
          id="skills-section-label"
          value={draftContent.skills.sectionLabel}
          onChange={(event) =>
            setDraftContent((current) => ({
              ...current,
              skills: { ...current.skills, sectionLabel: event.target.value },
            }))
          }
        />
      </FormField>
      <FormField htmlFor="skills-title" label="Section title">
        <Input
          id="skills-title"
          value={draftContent.skills.title}
          onChange={(event) =>
            setDraftContent((current) => ({
              ...current,
              skills: { ...current.skills, title: event.target.value },
            }))
          }
        />
      </FormField>
      <FormField htmlFor="skills-technical-heading" label="Technical heading">
        <Input
          id="skills-technical-heading"
          value={draftContent.skills.technicalHeading}
          onChange={(event) =>
            setDraftContent((current) => ({
              ...current,
              skills: { ...current.skills, technicalHeading: event.target.value },
            }))
          }
        />
      </FormField>
      <FormField htmlFor="skills-soft-heading" label="Soft-skill heading">
        <Input
          id="skills-soft-heading"
          value={draftContent.skills.softHeading}
          onChange={(event) =>
            setDraftContent((current) => ({
              ...current,
              skills: { ...current.skills, softHeading: event.target.value },
            }))
          }
        />
      </FormField>
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Technical skills</h3>
            <p className="text-sm text-muted-foreground">Set each skill name and its percentage level.</p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setDraftContent((current) => ({
                ...current,
                skills: {
                  ...current.skills,
                  technical: [...current.skills.technical, { id: createId("tech"), name: "", level: 0 }],
                },
              }))
            }
          >
            <Plus className="h-4 w-4" />
            Add technical skill
          </Button>
        </div>

        <div className="space-y-3">
          {draftContent.skills.technical.map((skill, index) => (
            <ItemEditorCard
              key={skill.id}
              title={`Technical skill ${index + 1}`}
              action={
                <RemoveItemButton
                  onClick={() =>
                    setDraftContent((current) => ({
                      ...current,
                      skills: {
                        ...current.skills,
                        technical: removeArrayItem(current.skills.technical, index),
                      },
                    }))
                  }
                />
              }
            >
              <div className="grid gap-4 md:grid-cols-[1fr_140px]">
                <FormField htmlFor={`technical-name-${skill.id}`} label="Skill name">
                  <Input
                    id={`technical-name-${skill.id}`}
                    value={skill.name}
                    onChange={(event) =>
                      setDraftContent((current) => ({
                        ...current,
                        skills: {
                          ...current.skills,
                          technical: updateArrayItem(current.skills.technical, index, (item) => ({
                            ...item,
                            name: event.target.value,
                          })),
                        },
                      }))
                    }
                  />
                </FormField>
                <FormField htmlFor={`technical-level-${skill.id}`} label="Level (%)">
                  <Input
                    id={`technical-level-${skill.id}`}
                    type="number"
                    min={0}
                    max={100}
                    value={skill.level}
                    onChange={(event) =>
                      setDraftContent((current) => ({
                        ...current,
                        skills: {
                          ...current.skills,
                          technical: updateArrayItem(current.skills.technical, index, (item) => ({
                            ...item,
                            level: Number(event.target.value) || 0,
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

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Soft skills</h3>
            <p className="text-sm text-muted-foreground">These appear as the skill cards on the site.</p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setDraftContent((current) => ({
                ...current,
                skills: {
                  ...current.skills,
                  soft: [...current.skills.soft, { id: createId("soft"), name: "" }],
                },
              }))
            }
          >
            <Plus className="h-4 w-4" />
            Add soft skill
          </Button>
        </div>

        <div className="space-y-3">
          {draftContent.skills.soft.map((skill, index) => (
            <ItemEditorCard
              key={skill.id}
              title={`Soft skill ${index + 1}`}
              action={
                <RemoveItemButton
                  onClick={() =>
                    setDraftContent((current) => ({
                      ...current,
                      skills: {
                        ...current.skills,
                        soft: removeArrayItem(current.skills.soft, index),
                      },
                    }))
                  }
                />
              }
            >
              <FormField htmlFor={`soft-name-${skill.id}`} label="Skill name">
                <Input
                  id={`soft-name-${skill.id}`}
                  value={skill.name}
                  onChange={(event) =>
                    setDraftContent((current) => ({
                      ...current,
                      skills: {
                        ...current.skills,
                        soft: updateArrayItem(current.skills.soft, index, (item) => ({
                          ...item,
                          name: event.target.value,
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
    </div>
  </div>
);

export default SkillsSectionEditor;
