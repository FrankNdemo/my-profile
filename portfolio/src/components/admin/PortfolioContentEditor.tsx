import { type Dispatch, type SetStateAction } from "react";
import { RefreshCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PortfolioContent } from "@/data/portfolio-content";
import AboutSectionEditor from "@/components/admin/AboutSectionEditor";
import CertificationsSectionEditor from "@/components/admin/CertificationsSectionEditor";
import ContactSectionEditor from "@/components/admin/ContactSectionEditor";
import EducationSectionEditor from "@/components/admin/EducationSectionEditor";
import ExperienceSectionEditor from "@/components/admin/ExperienceSectionEditor";
import HeroSectionEditor from "@/components/admin/HeroSectionEditor";
import ProjectsSectionEditor from "@/components/admin/ProjectsSectionEditor";
import SkillsSectionEditor from "@/components/admin/SkillsSectionEditor";
import { hasValue } from "@/lib/content-filters";

interface PortfolioContentEditorProps {
  content: PortfolioContent;
  draftContent: PortfolioContent;
  onReset: () => void;
  onSave: () => Promise<void>;
  setDraftContent: Dispatch<SetStateAction<PortfolioContent>>;
}

const PortfolioContentEditor = ({
  content,
  draftContent,
  onReset,
  onSave,
  setDraftContent,
}: PortfolioContentEditorProps) => {
  const projectCount = draftContent.projects.items.filter(
    (project) => hasValue(project.title) && hasValue(project.description),
  ).length;
  const certificationCount = draftContent.certifications.items.filter(
    (certification) => hasValue(certification.title) && hasValue(certification.issuer),
  ).length;
  const referenceCount = draftContent.contact.references.filter((reference) => hasValue(reference.name)).length;
  const hasUnsavedChanges = JSON.stringify(content) !== JSON.stringify(draftContent);

  return (
    <Card className="border-primary/15 bg-card/95">
      <CardHeader className="gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <CardTitle>Edit live portfolio content</CardTitle>
          <CardDescription className="mt-2 max-w-3xl leading-6">
            These are real form controls for your portfolio data. Update any section here, then save to publish the changes.
          </CardDescription>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={!hasUnsavedChanges}
            onClick={onReset}
          >
            <RefreshCcw className="h-4 w-4" />
            Reset unsaved
          </Button>
          <Button type="button" onClick={() => void onSave()}>
            <Save className="h-4 w-4" />
            Save changes
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid gap-4 text-sm text-muted-foreground md:grid-cols-4">
          <div className="rounded-2xl border border-border/70 bg-muted/10 p-4">
            <p className="font-semibold text-foreground">{projectCount}</p>
            <p className="mt-1">Projects currently listed</p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-muted/10 p-4">
            <p className="font-semibold text-foreground">{certificationCount}</p>
            <p className="mt-1">Certifications currently listed</p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-muted/10 p-4">
            <p className="font-semibold text-foreground">{referenceCount}</p>
            <p className="mt-1">References currently listed</p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-muted/10 p-4">
            <p className="font-semibold text-foreground">{hasUnsavedChanges ? "Unsaved" : "Saved"}</p>
            <p className="mt-1">Draft status</p>
          </div>
        </div>

        <Tabs defaultValue="hero" className="space-y-4">
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-2 rounded-2xl bg-muted/20 p-1">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="hero">
            <HeroSectionEditor draftContent={draftContent} setDraftContent={setDraftContent} />
          </TabsContent>
          <TabsContent value="about">
            <AboutSectionEditor draftContent={draftContent} setDraftContent={setDraftContent} />
          </TabsContent>
          <TabsContent value="experience">
            <ExperienceSectionEditor draftContent={draftContent} setDraftContent={setDraftContent} />
          </TabsContent>
          <TabsContent value="projects">
            <ProjectsSectionEditor draftContent={draftContent} setDraftContent={setDraftContent} />
          </TabsContent>
          <TabsContent value="skills">
            <SkillsSectionEditor draftContent={draftContent} setDraftContent={setDraftContent} />
          </TabsContent>
          <TabsContent value="education">
            <EducationSectionEditor draftContent={draftContent} setDraftContent={setDraftContent} />
          </TabsContent>
          <TabsContent value="certifications">
            <CertificationsSectionEditor draftContent={draftContent} setDraftContent={setDraftContent} />
          </TabsContent>
          <TabsContent value="contact">
            <ContactSectionEditor draftContent={draftContent} setDraftContent={setDraftContent} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PortfolioContentEditor;
