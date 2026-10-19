/** Work history and education. Only real roles and dates live here. */
export type Role = {
  organisation: string;
  title: string;
  start: string;
  end: string;
  current?: boolean;
  summary: string;
  highlights: string[];
  focus: string[];
};

export const roles: Role[] = [
  {
    organisation: "WorkDo Solutions Pvt. Ltd.",
    title: "Web Developer",
    start: "Oct 2023",
    end: "Present",
    current: true,
    summary:
      "Full-time on the product team that builds SaaS, ERP and booking software for business customers.",
    highlights: [
      "Build and extend modules in the company’s SaaS and ERP products, from the database and API to the screens customers use.",
      "Work on booking flows and the admin dashboards operations teams use every day.",
      "Connect REST APIs and third-party services to existing products without breaking what’s already there.",
      "Handle frontend work end to end: landing pages, themes and reusable UI components.",
    ],
    focus: ["SaaS", "ERP", "Booking systems", "Dashboards", "APIs", "Landing pages", "Themes"],
  },
  {
    organisation: "Independent product work",
    title: "Full-stack developer",
    start: "2025",
    end: "Present",
    summary:
      "Complete products I build outside work, so I can go deeper on architecture than day-to-day tickets allow.",
    highlights: [
      "Built WayPoint, a multi-tenant travel platform with AI trip planning, Razorpay payments and an audit log.",
      "Built PetCare and Rezumely across the stack: Express APIs, MongoDB and PostgreSQL, JWT auth and Gemini features.",
      "Wrote each one up as a case study, including what I’d change.",
    ],
    focus: ["Next.js", "Node.js", "Prisma", "PostgreSQL", "MongoDB", "Gemini"],
  },
];

export const education = {
  degree: "Bachelor of Computer Applications",
  institution: "Bhagwan Mahavir University",
  start: "2021",
  end: "2024",
  grade: "CGPA 8.16",
};
