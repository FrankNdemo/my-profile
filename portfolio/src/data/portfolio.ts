export interface NavigationItem {
  label: string;
  href: `#${string}`;
}

export interface PortfolioLink {
  label: string;
  url?: string;
}

export interface PortfolioProject {
  title: string;
  category: string;
  year: string;
  description: string;
  stack: string[];
  imageSrc: string;
  imageAlt: string;
  links: PortfolioLink[];
}

export interface CertificationItem {
  title: string;
  issuer: string;
  issuedOn: string;
  credentialId?: string;
  status: "Completed" | "Active" | "In Progress";
  imageSrc: string;
  imageAlt: string;
  credentialUrl?: string;
  skills: string[];
}

export const navigationItems: NavigationItem[] = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Education", href: "#education" },
  { label: "Certifications", href: "#certifications" },
  { label: "Contact", href: "#contact" },
];

// Replace `imageSrc` with files you add under `/public` and fill in the URLs below.
export const portfolioProjects: PortfolioProject[] = [
  {
    title: "Network Security Monitor",
    category: "Cybersecurity",
    year: "2026",
    description:
      "A real-time monitoring dashboard that helps identify suspicious traffic, surface alerts quickly, and support faster incident response for internal networks.",
    stack: ["Python", "Packet Analysis", "Network Security"],
    imageSrc: "/project-placeholder.svg",
    imageAlt: "Placeholder preview for Network Security Monitor",
    links: [
      { label: "Attach Live Demo" },
      { label: "Attach GitHub Repository" },
    ],
  },
  {
    title: "IT Asset Management System",
    category: "Web Application",
    year: "2025",
    description:
      "A web-based platform for managing hardware inventories, software assignments, and audit-ready asset records across an organization.",
    stack: ["React", "Node.js", "Database Design"],
    imageSrc: "/project-placeholder.svg",
    imageAlt: "Placeholder preview for IT Asset Management System",
    links: [
      { label: "Attach Live System Link" },
      { label: "Attach Case Study" },
    ],
  },
  {
    title: "Secure File Transfer Portal",
    category: "Infrastructure",
    year: "2025",
    description:
      "A secure document exchange portal focused on controlled access, encrypted file delivery, and a clear audit trail for sensitive transfers.",
    stack: ["Encryption", "Access Control", "Full-Stack"],
    imageSrc: "/project-placeholder.svg",
    imageAlt: "Placeholder preview for Secure File Transfer Portal",
    links: [
      { label: "Attach Product Demo" },
      { label: "Attach Source Code" },
    ],
  },
];

export const certificationItems: CertificationItem[] = [
  {
    title: "Cisco Certified Network Associate (CCNA)",
    issuer: "Cisco",
    issuedOn: "February 2024",
    credentialId: "Add credential ID",
    status: "Completed",
    imageSrc: "/certificate-placeholder.svg",
    imageAlt: "Placeholder certificate preview for CCNA",
    skills: ["Routing", "Switching", "Network Fundamentals"],
  },
  {
    title: "Enterprise Networking, Security and Automation",
    issuer: "Cisco",
    issuedOn: "December 2024",
    credentialId: "Add credential ID",
    status: "Completed",
    imageSrc: "/certificate-placeholder.svg",
    imageAlt: "Placeholder certificate preview for Enterprise Networking, Security and Automation",
    skills: ["Security Operations", "Automation", "Enterprise Networking"],
  },
  {
    title: "Certified in Cybersecurity (CC)",
    issuer: "(ISC)2",
    issuedOn: "April 2026",
    credentialId: "Add credential ID",
    status: "In Progress",
    imageSrc: "/certificate-placeholder.svg",
    imageAlt: "Placeholder certificate preview for Certified in Cybersecurity",
    skills: ["Security Principles", "Risk Management", "Governance"],
  },
  {
    title: "Cyber Threat Management",
    issuer: "Cisco",
    issuedOn: "February 2026",
    credentialId: "Add credential ID",
    status: "Active",
    imageSrc: "/certificate-placeholder.svg",
    imageAlt: "Placeholder certificate preview for Cyber Threat Management",
    skills: ["Threat Analysis", "Detection", "Response Planning"],
  },
];
