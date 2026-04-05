import type { Dispatch, SetStateAction } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PortfolioContent } from "@/data/portfolio-content";
import { FormField, ItemEditorCard, RemoveItemButton } from "@/components/admin/shared";
import { createId, joinLines, parseLines, removeArrayItem, updateArrayItem } from "@/components/admin/utils";

interface EducationSectionEditorProps {
  draftContent: PortfolioContent;
  setDraftContent: Dispatch<SetStateAction<PortfolioContent>>;
}

const EducationSectionEditor = ({ draftContent, setDraftContent }: EducationSectionEditorProps) => (
  <div className="space-y-5">
    <div className="grid gap-4 md:grid-cols-2">
      <FormField htmlFor="education-section-label" label="Section label">
        <Input
          id="education-section-label"
          value={draftContent.education.sectionLabel}
          onChange={(event) =>
            setDraftContent((current) => ({
              ...current,
              education: { ...current.education, sectionLabel: event.target.value },
            }))
          }
        />
      </FormField>
      <FormField htmlFor="education-title" label="Section title">
        <Input
          id="education-title"
          value={draftContent.education.title}
          onChange={(event) =>
            setDraftContent((current) => ({
              ...current,
              education: { ...current.education, title: event.target.value },
            }))
          }
        />
      </FormField>
    </div>

    <ItemEditorCard title="University details">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField htmlFor="education-university-name" label="University name">
          <Input
            id="education-university-name"
            value={draftContent.education.universityName}
            onChange={(event) =>
              setDraftContent((current) => ({
                ...current,
                education: { ...current.education, universityName: event.target.value },
              }))
            }
          />
        </FormField>
        <FormField htmlFor="education-university-degree" label="Degree">
          <Input
            id="education-university-degree"
            value={draftContent.education.universityDegree}
            onChange={(event) =>
              setDraftContent((current) => ({
                ...current,
                education: { ...current.education, universityDegree: event.target.value },
              }))
            }
          />
        </FormField>
        <FormField htmlFor="education-university-period" label="Period">
          <Input
            id="education-university-period"
            value={draftContent.education.universityPeriod}
            onChange={(event) =>
              setDraftContent((current) => ({
                ...current,
                education: { ...current.education, universityPeriod: event.target.value },
              }))
            }
          />
        </FormField>
        <FormField htmlFor="education-university-badge" label="Badge">
          <Input
            id="education-university-badge"
            value={draftContent.education.universityBadge}
            onChange={(event) =>
              setDraftContent((current) => ({
                ...current,
                education: { ...current.education, universityBadge: event.target.value },
              }))
            }
          />
        </FormField>
      </div>

      <FormField htmlFor="education-coursework-heading" label="Coursework heading">
        <Input
          id="education-coursework-heading"
          value={draftContent.education.courseworkHeading}
          onChange={(event) =>
            setDraftContent((current) => ({
              ...current,
              education: { ...current.education, courseworkHeading: event.target.value },
            }))
          }
        />
      </FormField>

      <FormField htmlFor="education-coursework" label="Coursework list" description="Enter one course per line.">
        <Textarea
          id="education-coursework"
          className="min-h-[160px]"
          value={joinLines(draftContent.education.coursework)}
          onChange={(event) =>
            setDraftContent((current) => ({
              ...current,
              education: { ...current.education, coursework: parseLines(event.target.value) },
            }))
          }
        />
      </FormField>
    </ItemEditorCard>

    <ItemEditorCard title="Secondary school details">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField htmlFor="education-school-name" label="School name">
          <Input
            id="education-school-name"
            value={draftContent.education.secondarySchoolName}
            onChange={(event) =>
              setDraftContent((current) => ({
                ...current,
                education: { ...current.education, secondarySchoolName: event.target.value },
              }))
            }
          />
        </FormField>
        <FormField htmlFor="education-school-subtitle" label="Subtitle">
          <Input
            id="education-school-subtitle"
            value={draftContent.education.secondarySchoolSubtitle}
            onChange={(event) =>
              setDraftContent((current) => ({
                ...current,
                education: { ...current.education, secondarySchoolSubtitle: event.target.value },
              }))
            }
          />
        </FormField>
        <FormField htmlFor="education-school-period" label="Period">
          <Input
            id="education-school-period"
            value={draftContent.education.secondarySchoolPeriod}
            onChange={(event) =>
              setDraftContent((current) => ({
                ...current,
                education: { ...current.education, secondarySchoolPeriod: event.target.value },
              }))
            }
          />
        </FormField>
      </div>

      <FormField htmlFor="education-school-description" label="Description">
        <Textarea
          id="education-school-description"
          className="min-h-[140px]"
          value={draftContent.education.secondarySchoolDescription}
          onChange={(event) =>
            setDraftContent((current) => ({
              ...current,
              education: { ...current.education, secondarySchoolDescription: event.target.value },
            }))
          }
        />
      </FormField>
    </ItemEditorCard>

    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Education stats</h3>
          <p className="text-sm text-muted-foreground">These appear as the small highlight cards.</p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            setDraftContent((current) => ({
              ...current,
              education: {
                ...current.education,
                stats: [...current.education.stats, { id: createId("education-stat"), value: "", label: "" }],
              },
            }))
          }
        >
          <Plus className="h-4 w-4" />
          Add stat
        </Button>
      </div>

      <div className="space-y-3">
        {draftContent.education.stats.map((stat, index) => (
          <ItemEditorCard
            key={stat.id}
            title={`Stat ${index + 1}`}
            action={
              <RemoveItemButton
                onClick={() =>
                  setDraftContent((current) => ({
                    ...current,
                    education: {
                      ...current.education,
                      stats: removeArrayItem(current.education.stats, index),
                    },
                  }))
                }
              />
            }
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormField htmlFor={`education-stat-value-${stat.id}`} label="Value">
                <Input
                  id={`education-stat-value-${stat.id}`}
                  value={stat.value}
                  onChange={(event) =>
                    setDraftContent((current) => ({
                      ...current,
                      education: {
                        ...current.education,
                        stats: updateArrayItem(current.education.stats, index, (item) => ({
                          ...item,
                          value: event.target.value,
                        })),
                      },
                    }))
                  }
                />
              </FormField>
              <FormField htmlFor={`education-stat-label-${stat.id}`} label="Label">
                <Input
                  id={`education-stat-label-${stat.id}`}
                  value={stat.label}
                  onChange={(event) =>
                    setDraftContent((current) => ({
                      ...current,
                      education: {
                        ...current.education,
                        stats: updateArrayItem(current.education.stats, index, (item) => ({
                          ...item,
                          label: event.target.value,
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

export default EducationSectionEditor;
