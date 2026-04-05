import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortfolio } from "@/context/PortfolioContext";
import { buildDisplayName, filterFilledStrings, hasValue } from "@/lib/content-filters";

const sectionTitleClass =
  "mb-4 border-b-2 border-secondary/75 pb-2 text-xs font-bold uppercase tracking-[0.24em] text-slate-900";

const CV = () => {
  const {
    content: { hero, about, experience, skills, education, certifications, contact },
  } = usePortfolio();
  const fullName = buildDisplayName(hero.firstName, hero.lastName) || "Portfolio CV";
  const printableTitle = `${fullName.replace(/\s+/g, "-")}-CV`;
  const displayInitials =
    fullName
      .split(" ")
      .filter(Boolean)
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "CV";
  const firstNameLine = hasValue(hero.firstName) ? hero.firstName : fullName;
  const lastNameLine = hasValue(hero.lastName) ? hero.lastName : "";
  const profileSummary = filterFilledStrings(about.paragraphs)[0] ?? hero.summary;
  const visibleSpecialties = filterFilledStrings(hero.specialties);
  const roleTitle = visibleSpecialties.length > 0 ? visibleSpecialties.join(" | ") : "ICT Professional";
  const featuredSkills = filterFilledStrings([
    ...skills.technical.map((item) => item.name),
    ...skills.soft.map((item) => item.name),
  ]).slice(0, 10);
  const visibleLanguages = about.languages.filter(
    (language) => hasValue(language.name) || hasValue(language.level),
  );
  const visibleExperience = experience.items
    .map((item) => ({
      ...item,
      responsibilities: filterFilledStrings(item.responsibilities),
    }))
    .filter((item) => hasValue(item.title) || hasValue(item.company) || item.responsibilities.length > 0);
  const visibleCoursework = filterFilledStrings(education.coursework);
  const hasUniversityDetails =
    hasValue(education.universityDegree) ||
    hasValue(education.universityName) ||
    hasValue(education.universityPeriod) ||
    visibleCoursework.length > 0;
  const hasSecondaryDetails =
    hasValue(education.secondarySchoolName) ||
    hasValue(education.secondarySchoolSubtitle) ||
    hasValue(education.secondarySchoolPeriod);
  const visibleCertifications = certifications.items
    .filter((item) => hasValue(item.title) && hasValue(item.issuer))
    .slice(0, 3);
  const contactItems = [
    hasValue(contact.email)
      ? {
          href: `mailto:${contact.email}`,
          icon: Mail,
          label: contact.email,
        }
      : null,
    hasValue(contact.phone)
      ? {
          href: `tel:${contact.phone.replace(/\s+/g, "")}`,
          icon: Phone,
          label: contact.phone,
        }
      : null,
    hasValue(contact.location)
      ? {
          href: "",
          icon: MapPin,
          label: contact.location,
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null);
  const hasAsideContent =
    contactItems.length > 0 ||
    hasValue(profileSummary) ||
    featuredSkills.length > 0 ||
    visibleLanguages.length > 0;
  const hasMainContent =
    visibleExperience.length > 0 ||
    hasUniversityDetails ||
    hasSecondaryDetails ||
    visibleCertifications.length > 0;

  useEffect(() => {
    const previousTitle = document.title;
    document.title = printableTitle;

    return () => {
      document.title = previousTitle;
    };
  }, [printableTitle]);

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="cv-page-shell min-h-screen bg-background px-4 py-8 md:px-6 md:py-10">
      <div className="cv-print-controls mx-auto mb-6 flex max-w-[210mm] flex-wrap items-center justify-between gap-3">
        <Button asChild variant="outline">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Back to portfolio
          </Link>
        </Button>

        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm text-muted-foreground">
            Download tip: choose <span className="font-semibold text-foreground">Save as PDF</span> in the print dialog.
          </p>
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4" />
            Download CV
          </Button>
        </div>
      </div>

      <article className="cv-sheet mx-auto w-full max-w-[210mm] overflow-hidden rounded-[30px] border border-primary/20 bg-white text-slate-900 shadow-[0_30px_80px_rgba(5,10,20,0.32)]">
        <div className="grid md:grid-cols-[220px_1fr]">
          <div className="flex items-center justify-center bg-[linear-gradient(155deg,hsl(203_28%_92%),hsl(203_28%_98%))] px-6 py-8 md:min-h-[190px]">
            <div className="flex h-36 w-36 items-center justify-center rounded-full border-[10px] border-white bg-[linear-gradient(135deg,hsl(38_48%_62%),hsl(203_28%_58%))] shadow-[0_16px_40px_rgba(15,23,42,0.18)]">
              <span className="font-mono text-4xl font-bold tracking-[0.22em] text-white">
                {displayInitials}
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-center px-8 py-8 md:px-10">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-secondary">
              Curriculum Vitae
            </p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950 md:text-5xl">
              <span className="block text-2xl font-semibold text-slate-800 md:text-3xl">{firstNameLine}</span>
              {hasValue(lastNameLine) && <span>{lastNameLine}</span>}
            </h1>
            {hasValue(hero.summary) && (
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">{hero.summary}</p>
            )}
          </div>
        </div>

        <div className="bg-[linear-gradient(90deg,hsl(203_28%_42%),hsl(203_28%_58%))] px-8 py-3 text-center text-sm font-semibold uppercase tracking-[0.3em] text-white md:px-10">
          {roleTitle}
        </div>

        <div className={hasAsideContent && hasMainContent ? "grid md:grid-cols-[255px_1fr]" : "block"}>
          {hasAsideContent && (
            <aside className="bg-[linear-gradient(180deg,hsl(210_33%_97%),hsl(210_20%_99%))] px-6 py-8 md:px-7 md:py-9">
              {contactItems.length > 0 && (
                <section className="cv-avoid-break mb-8">
                  <h2 className={sectionTitleClass}>Contact</h2>
                  <div className="space-y-4 text-sm text-slate-700">
                    {contactItems.map((item) => {
                      const Icon = item.icon;

                      if (!item.href) {
                        return (
                          <div key={item.label} className="flex items-start gap-3">
                            <Icon className="mt-0.5 h-4 w-4 text-secondary" />
                            <span>{item.label}</span>
                          </div>
                        );
                      }

                      return (
                        <a key={item.label} className="flex items-start gap-3 hover:text-secondary" href={item.href}>
                          <Icon className="mt-0.5 h-4 w-4 text-secondary" />
                          <span>{item.label}</span>
                        </a>
                      );
                    })}
                  </div>
                </section>
              )}

              {hasValue(profileSummary) && (
                <section className="cv-avoid-break mb-8">
                  <h2 className={sectionTitleClass}>Profile Summary</h2>
                  <p className="text-sm leading-6 text-slate-700">{profileSummary}</p>
                </section>
              )}

              {featuredSkills.length > 0 && (
                <section className="cv-avoid-break mb-8">
                  <h2 className={sectionTitleClass}>Skills</h2>
                  <ul className="space-y-2.5 text-sm text-slate-700">
                    {featuredSkills.map((skill) => (
                      <li key={skill} className="flex items-start gap-2">
                        <ShieldCheck className="mt-0.5 h-4 w-4 text-primary" />
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {visibleLanguages.length > 0 && (
                <section className="cv-avoid-break">
                  <h2 className={sectionTitleClass}>Languages</h2>
                  <ul className="space-y-2.5 text-sm text-slate-700">
                    {visibleLanguages.map((language) => (
                      <li key={language.id} className="flex items-start justify-between gap-3">
                        <span className="font-medium text-slate-900">{language.name}</span>
                        {hasValue(language.level) && <span className="text-slate-500">{language.level}</span>}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </aside>
          )}

          {hasMainContent && (
            <main className="px-6 py-8 md:px-8 md:py-9">
              {visibleExperience.length > 0 && (
                <section className="cv-avoid-break mb-10">
                  <h2 className={sectionTitleClass}>Professional Experience</h2>
                  <div className="space-y-8">
                    {visibleExperience.map((item) => (
                      <div key={item.id} className="cv-avoid-break">
                        {hasValue(item.company) && (
                          <h3 className="text-base font-bold uppercase tracking-wide text-slate-900">{item.company}</h3>
                        )}
                        {hasValue(item.title) && <p className="mt-1 text-sm font-semibold text-secondary">{item.title}</p>}
                        {(hasValue(item.location) || hasValue(item.period)) && (
                          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">
                            {[item.location, item.period].filter((value) => hasValue(value)).join(" | ")}
                          </p>
                        )}
                        {item.responsibilities.length > 0 && (
                          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                            {item.responsibilities.slice(0, 4).map((responsibility) => (
                              <li key={responsibility} className="flex gap-3">
                                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                                <span>{responsibility}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {(hasUniversityDetails || hasSecondaryDetails) && (
                <section className="cv-avoid-break mb-10">
                  <h2 className={sectionTitleClass}>Education</h2>
                  <div className="space-y-6">
                    {hasUniversityDetails && (
                      <div className="cv-avoid-break">
                        {hasValue(education.universityDegree) && (
                          <h3 className="text-base font-bold uppercase tracking-wide text-slate-900">
                            {education.universityDegree}
                          </h3>
                        )}
                        {hasValue(education.universityName) && (
                          <p className="mt-1 text-sm font-semibold text-secondary">{education.universityName}</p>
                        )}
                        {hasValue(education.universityPeriod) && (
                          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">{education.universityPeriod}</p>
                        )}
                        {visibleCoursework.length > 0 && (
                          <p className="mt-2 text-sm leading-6 text-slate-700">{visibleCoursework.slice(0, 3).join(" | ")}</p>
                        )}
                      </div>
                    )}

                    {hasSecondaryDetails && (
                      <div className="cv-avoid-break">
                        {hasValue(education.secondarySchoolName) && (
                          <h3 className="text-base font-bold uppercase tracking-wide text-slate-900">
                            {education.secondarySchoolName}
                          </h3>
                        )}
                        {hasValue(education.secondarySchoolSubtitle) && (
                          <p className="mt-1 text-sm font-semibold text-secondary">{education.secondarySchoolSubtitle}</p>
                        )}
                        {hasValue(education.secondarySchoolPeriod) && (
                          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">{education.secondarySchoolPeriod}</p>
                        )}
                      </div>
                    )}
                  </div>
                </section>
              )}

              {visibleCertifications.length > 0 && (
                <section className="cv-avoid-break">
                  <h2 className={sectionTitleClass}>Certifications</h2>
                  <div className="space-y-5">
                    {visibleCertifications.map((item) => (
                      <div key={item.id} className="cv-avoid-break">
                        <h3 className="text-base font-bold uppercase tracking-wide text-slate-900">{item.title}</h3>
                        <p className="mt-1 text-sm font-semibold text-secondary">{item.issuer}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">
                          {[item.issuedOn, item.status].filter((value) => hasValue(value)).join(" | ")}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </main>
          )}
        </div>
      </article>
    </div>
  );
};

export default CV;
