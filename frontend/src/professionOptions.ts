export interface ProfessionProfile {
  keywords: string[];
  seniorityLevels: string[];
  areas: string[];
}

const defaultProfile: ProfessionProfile = {
  keywords: [],
  seniorityLevels: ["Entry-Level", "Associate", "Mid-Level", "Senior", "Lead", "Manager"],
  areas: [
    "Role-Specific Skills",
    "Communication and Collaboration",
    "Problem Solving",
    "Professional Judgment",
    "Career Motivation"
  ]
};

const professionProfiles: ProfessionProfile[] = [
  {
    keywords: ["ciso", "chief information security officer", "security executive"],
    seniorityLevels: ["Director", "Senior Director", "VP Security", "CISO", "Chief Security Officer", "Board Advisor"],
    areas: [
      "Security Strategy and Governance",
      "Board and Executive Communication",
      "Risk Appetite and Prioritization",
      "Incident Leadership",
      "Compliance and Program Maturity"
    ]
  },
  {
    keywords: ["software engineer", "developer", "frontend", "backend", "full stack", "programmer"],
    seniorityLevels: ["Intern", "Junior Engineer", "Mid-Level Engineer", "Senior Engineer", "Staff Engineer", "Principal Engineer"],
    areas: [
      "Coding and Debugging",
      "System Design",
      "Data Structures and Algorithms",
      "Code Quality and Testing",
      "Technical Collaboration"
    ]
  },
  {
    keywords: ["doctor", "physician", "surgeon", "clinician", "medical officer", "nurse", "nursing"],
    seniorityLevels: ["Student", "Resident", "Fellow", "Attending", "Consultant", "Medical Director"],
    areas: [
      "Clinical Judgment",
      "Patient Communication",
      "Ethics and Safety",
      "Diagnosis and Treatment Planning",
      "Interdisciplinary Care"
    ]
  },
  {
    keywords: ["teacher", "educator", "lecturer", "professor", "instructor", "tutor"],
    seniorityLevels: ["Trainee Teacher", "Classroom Teacher", "Senior Teacher", "Department Lead", "Principal", "Academic Director"],
    areas: [
      "Lesson Planning",
      "Classroom Management",
      "Student Assessment",
      "Inclusive Teaching",
      "Parent and Stakeholder Communication"
    ]
  },
  {
    keywords: ["lawyer", "attorney", "legal counsel", "advocate", "solicitor", "paralegal"],
    seniorityLevels: ["Paralegal", "Junior Associate", "Associate", "Senior Associate", "Counsel", "Partner"],
    areas: [
      "Legal Research and Analysis",
      "Client Advisory",
      "Negotiation and Drafting",
      "Ethics and Confidentiality",
      "Case Strategy"
    ]
  },
  {
    keywords: ["accountant", "finance", "financial analyst", "auditor", "controller", "bookkeeper"],
    seniorityLevels: ["Junior Analyst", "Analyst", "Senior Analyst", "Manager", "Controller", "Finance Director"],
    areas: [
      "Financial Reporting",
      "Budgeting and Forecasting",
      "Controls and Compliance",
      "Data Analysis",
      "Stakeholder Reporting"
    ]
  },
  {
    keywords: ["sales", "account executive", "business development", "customer success", "account manager"],
    seniorityLevels: ["Sales Development Rep", "Account Executive", "Senior Account Executive", "Account Manager", "Sales Manager", "Revenue Leader"],
    areas: [
      "Discovery and Qualification",
      "Pipeline Management",
      "Objection Handling",
      "Customer Relationship Management",
      "Commercial Negotiation"
    ]
  },
  {
    keywords: ["product manager", "product owner", "program manager", "project manager", "scrum master"],
    seniorityLevels: ["Associate PM", "Product Manager", "Senior Product Manager", "Group Product Manager", "Director of Product", "VP Product"],
    areas: [
      "Product Strategy",
      "User Research",
      "Prioritization",
      "Cross-Functional Delivery",
      "Metrics and Experimentation"
    ]
  },
  {
    keywords: ["designer", "ux", "ui", "product designer", "graphic designer", "creative director"],
    seniorityLevels: ["Junior Designer", "Designer", "Senior Designer", "Lead Designer", "Design Manager", "Creative Director"],
    areas: [
      "User-Centered Design",
      "Visual Craft",
      "Prototyping and Testing",
      "Design Systems",
      "Stakeholder Critique"
    ]
  },
  {
    keywords: ["hr", "human resources", "recruiter", "talent acquisition", "people operations"],
    seniorityLevels: ["HR Assistant", "Recruiter", "HR Generalist", "Senior HR Partner", "People Manager", "CHRO"],
    areas: [
      "Talent Acquisition",
      "Employee Relations",
      "Policy and Compliance",
      "Performance Management",
      "Culture and Engagement"
    ]
  }
];

export const getProfessionProfile = (position: string): ProfessionProfile => {
  const normalizedPosition = position.trim().toLowerCase();

  if (!normalizedPosition) {
    return defaultProfile;
  }

  return (
    professionProfiles.find((profile) =>
      profile.keywords.some((keyword) => normalizedPosition.includes(keyword))
    ) || defaultProfile
  );
};
