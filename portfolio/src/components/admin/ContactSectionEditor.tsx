import type { Dispatch, SetStateAction } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PortfolioContent } from "@/data/portfolio-content";
import { FormField, ItemEditorCard, RemoveItemButton } from "@/components/admin/shared";
import { createId, removeArrayItem, updateArrayItem } from "@/components/admin/utils";

interface ContactSectionEditorProps {
  draftContent: PortfolioContent;
  setDraftContent: Dispatch<SetStateAction<PortfolioContent>>;
}

const ContactSectionEditor = ({ draftContent, setDraftContent }: ContactSectionEditorProps) => (
  <div className="space-y-5">
    <div className="grid gap-4 md:grid-cols-2">
      <FormField htmlFor="contact-section-label" label="Section label">
        <Input
          id="contact-section-label"
          value={draftContent.contact.sectionLabel}
          onChange={(event) =>
            setDraftContent((current) => ({
              ...current,
              contact: { ...current.contact, sectionLabel: event.target.value },
            }))
          }
        />
      </FormField>
      <FormField htmlFor="contact-title" label="Section title">
        <Input
          id="contact-title"
          value={draftContent.contact.title}
          onChange={(event) =>
            setDraftContent((current) => ({
              ...current,
              contact: { ...current.contact, title: event.target.value },
            }))
          }
        />
      </FormField>
      <FormField htmlFor="contact-email" label="Email">
        <Input
          id="contact-email"
          value={draftContent.contact.email}
          onChange={(event) =>
            setDraftContent((current) => ({
              ...current,
              contact: { ...current.contact, email: event.target.value },
            }))
          }
        />
      </FormField>
      <FormField htmlFor="contact-phone" label="Phone">
        <Input
          id="contact-phone"
          value={draftContent.contact.phone}
          onChange={(event) =>
            setDraftContent((current) => ({
              ...current,
              contact: { ...current.contact, phone: event.target.value },
            }))
          }
        />
      </FormField>
      <FormField htmlFor="contact-location" label="Location">
        <Input
          id="contact-location"
          value={draftContent.contact.location}
          onChange={(event) =>
            setDraftContent((current) => ({
              ...current,
              contact: { ...current.contact, location: event.target.value },
            }))
          }
        />
      </FormField>
      <FormField htmlFor="contact-cta-label" label="CTA button label">
        <Input
          id="contact-cta-label"
          value={draftContent.contact.ctaLabel}
          onChange={(event) =>
            setDraftContent((current) => ({
              ...current,
              contact: { ...current.contact, ctaLabel: event.target.value },
            }))
          }
        />
      </FormField>
      <FormField htmlFor="contact-references-heading" label="References heading">
        <Input
          id="contact-references-heading"
          value={draftContent.contact.referencesHeading}
          onChange={(event) =>
            setDraftContent((current) => ({
              ...current,
              contact: { ...current.contact, referencesHeading: event.target.value },
            }))
          }
        />
      </FormField>
    </div>

    <FormField htmlFor="contact-intro" label="Intro text">
      <Textarea
        id="contact-intro"
        className="min-h-[140px]"
        value={draftContent.contact.intro}
        onChange={(event) =>
          setDraftContent((current) => ({
            ...current,
            contact: { ...current.contact, intro: event.target.value },
          }))
        }
      />
    </FormField>

    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground">References</h3>
          <p className="text-sm text-muted-foreground">Add the professional references shown on the portfolio.</p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            setDraftContent((current) => ({
              ...current,
              contact: {
                ...current.contact,
                references: [
                  ...current.contact.references,
                  { id: createId("reference"), name: "", title: "", company: "", phone: "", email: "" },
                ],
              },
            }))
          }
        >
          <Plus className="h-4 w-4" />
          Add reference
        </Button>
      </div>

      <div className="space-y-4">
        {draftContent.contact.references.map((reference, index) => (
          <ItemEditorCard
            key={reference.id}
            title={`Reference ${index + 1}`}
            action={
              <RemoveItemButton
                onClick={() =>
                  setDraftContent((current) => ({
                    ...current,
                    contact: {
                      ...current.contact,
                      references: removeArrayItem(current.contact.references, index),
                    },
                  }))
                }
              />
            }
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormField htmlFor={`reference-name-${reference.id}`} label="Name">
                <Input
                  id={`reference-name-${reference.id}`}
                  value={reference.name}
                  onChange={(event) =>
                    setDraftContent((current) => ({
                      ...current,
                      contact: {
                        ...current.contact,
                        references: updateArrayItem(current.contact.references, index, (item) => ({
                          ...item,
                          name: event.target.value,
                        })),
                      },
                    }))
                  }
                />
              </FormField>
              <FormField htmlFor={`reference-title-${reference.id}`} label="Role title">
                <Input
                  id={`reference-title-${reference.id}`}
                  value={reference.title}
                  onChange={(event) =>
                    setDraftContent((current) => ({
                      ...current,
                      contact: {
                        ...current.contact,
                        references: updateArrayItem(current.contact.references, index, (item) => ({
                          ...item,
                          title: event.target.value,
                        })),
                      },
                    }))
                  }
                />
              </FormField>
              <FormField htmlFor={`reference-company-${reference.id}`} label="Company">
                <Input
                  id={`reference-company-${reference.id}`}
                  value={reference.company}
                  onChange={(event) =>
                    setDraftContent((current) => ({
                      ...current,
                      contact: {
                        ...current.contact,
                        references: updateArrayItem(current.contact.references, index, (item) => ({
                          ...item,
                          company: event.target.value,
                        })),
                      },
                    }))
                  }
                />
              </FormField>
              <FormField htmlFor={`reference-phone-${reference.id}`} label="Phone">
                <Input
                  id={`reference-phone-${reference.id}`}
                  value={reference.phone}
                  onChange={(event) =>
                    setDraftContent((current) => ({
                      ...current,
                      contact: {
                        ...current.contact,
                        references: updateArrayItem(current.contact.references, index, (item) => ({
                          ...item,
                          phone: event.target.value,
                        })),
                      },
                    }))
                  }
                />
              </FormField>
              <FormField
                htmlFor={`reference-email-${reference.id}`}
                label="Email"
                description="Optional"
              >
                <Input
                  id={`reference-email-${reference.id}`}
                  value={reference.email}
                  onChange={(event) =>
                    setDraftContent((current) => ({
                      ...current,
                      contact: {
                        ...current.contact,
                        references: updateArrayItem(current.contact.references, index, (item) => ({
                          ...item,
                          email: event.target.value,
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

export default ContactSectionEditor;
