import { StudentProfile, ProjectIdea } from '../../src/types/project';

export const PromptBuilder = {
  generateIdeas(profile: StudentProfile): string {
    return `
You are a top-tier senior software architect and competition mentor.
Your task is to generate 5 to 7 HIGHLY PERSONALIZED, INNOVATIVE, and REALISTIC final-year project ideas for an engineering student.

STUDENT PROFILE:
- Academic: Branch: ${profile.academic.branch}, Year: ${profile.academic.year}, Specialization: ${profile.academic.specialization}
- Technical Skills:
  - Languages: ${profile.skills.languages.join(', ') || 'None listed'}
  - Frameworks: ${profile.skills.frameworks.join(', ') || 'None listed'}
  - AI/ML: ${profile.skills.aiMl.join(', ') || 'None listed'}
  - Databases: ${profile.skills.databases.join(', ') || 'None listed'}
  - Cloud/Deployment: ${profile.skills.cloudDeployment.join(', ') || 'None listed'}
- Interests:
  - Domains: ${profile.interests.domains.join(', ') || 'Software Development'}
  - Problem Areas: ${profile.interests.problemAreas.join(', ') || 'General'}
  - Hobbies: ${profile.interests.hobbies.join(', ') || 'None'}
  - Career Goals: ${profile.interests.careerGoals.join(', ') || 'Software Engineer'}
- Experience Level: ${profile.experience.level} (Previous: ${profile.experience.previousProjects || 'None'})
- Constraints:
  - Team Size: ${profile.constraints.teamSize} member(s)
  - Time Available: ${profile.constraints.availableWeeks} weeks (${profile.constraints.hoursPerWeek} hrs/week)
  - Budget: $${profile.constraints.budgetUsd}
  - Hardware: ${profile.constraints.hardware} (GPU available: ${profile.constraints.hasGPU ? 'Yes' : 'No'})
  - Internet: ${profile.constraints.hasGoodInternet ? 'High speed' : 'Limited'}
  - Difficulty Preference: ${profile.constraints.preferredDifficulty}
- Learning Goals: Wants to learn ${profile.learningGoals.technologiesToLearn.join(', ') || 'Modern Fullstack'}, wants to improve ${profile.learningGoals.skillsToImprove.join(', ') || 'System Design'}

RULES:
- DO NOT generate generic cliché ideas (e.g., basic library management, simple attendance app, basic weather widget, generic e-commerce clone, simple calculator).
- Every idea MUST solve a real-world problem and incorporate intelligent features, AI/ML, or modern system architecture.
- Every idea MUST match the student's constraints (team size, GPU availability, budget).

Return a JSON array of project ideas adhering strictly to this schema:
[
  {
    "id": "idea-1",
    "title": "Clear, Catchy, Technical Project Title",
    "shortDescription": "2-sentence summary of the solution",
    "problemStatement": "Detailed real-world problem being solved",
    "targetUsers": ["Target User 1", "Target User 2"],
    "realWorldProblem": "Industry/social domain gap being addressed",
    "coreFeatures": ["Feature 1", "Feature 2", "Feature 3"],
    "advancedFeatures": ["Advanced Feature 1", "Advanced Feature 2"],
    "technologyStack": {
      "frontend": ["React", "TypeScript", "Tailwind CSS"],
      "backend": ["Node.js", "Express"],
      "database": ["PostgreSQL"],
      "aiMl": ["Gemini API", "PyTorch"],
      "tools": ["Docker", "Vite"]
    },
    "aiMlUsage": "Detailed description of how AI/ML is integrated",
    "difficulty": "Moderate", // Easy, Moderate, Challenging, Competition-Level
    "estimatedDurationWeeks": 12,
    "estimatedCostUsd": 0,
    "scores": {
      "innovation": 85,
      "feasibility": 90,
      "impact": 88,
      "scalability": 82,
      "technicalDepth": 85,
      "skillMatch": 80
    },
    "whyItMatches": "Specific explanation referencing the student's profile, interests, and constraints"
  }
]
`;
  },

  compareIdeas(profile: StudentProfile, ideas: ProjectIdea[]): string {
    return `
You are a senior competition judge and project decision engine.
Compare the following ${ideas.length} project ideas for a final-year student.

STUDENT CONSTRAINTS & GOALS:
- Skills: ${[...profile.skills.languages, ...profile.skills.frameworks].join(', ')}
- Team Size: ${profile.constraints.teamSize} member(s)
- Time Available: ${profile.constraints.availableWeeks} weeks
- Preferred Difficulty: ${profile.constraints.preferredDifficulty}

PROJECT IDEAS TO COMPARE:
${JSON.stringify(ideas, null, 2)}

Return JSON adhering to this schema:
{
  "projectIds": [${ideas.map((i) => `"${i.id}"`).join(', ')}],
  "overallComparison": "Comprehensive side-by-side analysis contrasting technical depth, feasibility, and competition value.",
  "strengths": {
    "${ideas[0]?.id || 'idea-1'}": ["Strength 1", "Strength 2"]
  },
  "weaknesses": {
    "${ideas[0]?.id || 'idea-1'}": ["Weakness 1", "Weakness 2"]
  },
  "bestProjectId": "${ideas[0]?.id || 'idea-1'}",
  "recommendationReason": "Strong contextual rationale choosing the single best project based on student skills, time limit, and competition potential."
}
`;
  },

  analyzeProject(profile: StudentProfile, project: ProjectIdea, adjustmentMode?: string): string {
    return `
You are a strict project feasibility engineer & Reality Check auditor.
Perform a serious, realistic feasibility audit for this selected final-year project.

${adjustmentMode ? `SPECIAL ADJUSTMENT REQUEST: Adjust the analysis with goal: "${adjustmentMode}" (e.g. Make More Feasible, Make More Innovative, Make More Advanced, Reduce Scope).` : ''}

STUDENT CONSTRAINTS:
- Team size: ${profile.constraints.teamSize}
- Time: ${profile.constraints.availableWeeks} weeks (${profile.constraints.hoursPerWeek} hrs/wk)
- Budget: $${profile.constraints.budgetUsd}
- Hardware: ${profile.constraints.hardware} (GPU: ${profile.constraints.hasGPU})

PROJECT DETAILS:
${JSON.stringify(project, null, 2)}

Return JSON with this schema:
{
  "realityScore": 82, // Score /100 based on realistic probability of completion
  "feasibility": "High / Medium / Low analysis narrative",
  "timeFit": "Will fit within ${profile.constraints.availableWeeks} weeks if prioritized correctly",
  "technicalComplexity": "Detailed assessment of complexity",
  "costFeasibility": "Budget analysis for $${profile.constraints.budgetUsd}",
  "resourceRequirements": ["Resource 1", "Resource 2"],
  "datasetDependency": "Evaluation of required datasets and public availability",
  "apiDependency": "APIs required and rate limit/cost considerations",
  "hardwareDependency": "Hardware/GPU considerations",
  "teamDependency": "Workload distribution for ${profile.constraints.teamSize} person(s)",
  "majorRisks": ["Risk 1", "Risk 2"],
  "majorBlockers": ["Blocker 1"],
  "versions": {
    "mvp": { "title": "Essential MVP", "features": ["Core Feature 1", "Core Feature 2"], "estimatedWeeks": 4 },
    "standard": { "title": "Standard Competition Version", "features": ["Core + Advanced Feature"], "estimatedWeeks": 8 },
    "advanced": { "title": "Advanced Award-Winning Version", "features": ["Full feature set + AI innovations"], "estimatedWeeks": 12 }
  },
  "actionableRecommendations": ["Recommendation 1", "Recommendation 2"]
}
`;
  },

  generateBlueprint(profile: StudentProfile, project: ProjectIdea): string {
    return `
You are a Principal Software Architect.
Create a complete, production-grade technical project blueprint for the following final-year project.

STUDENT PROFILE & STACK:
- Branch: ${profile.academic.branch}
- Student Skills: ${[...profile.skills.languages, ...profile.skills.frameworks].join(', ')}

SELECTED PROJECT:
Title: ${project.title}
Problem: ${project.problemStatement}
Tech Stack: ${JSON.stringify(project.technologyStack)}
AI Usage: ${project.aiMlUsage}

Return JSON with this exact schema:
{
  "problem": {
    "statement": "${project.problemStatement.replace(/"/g, '\\"')}",
    "motivation": "Why this project is urgent and valuable",
    "existingLimitations": ["Limitation of current existing solutions 1", "Limitation 2"]
  },
  "objectives": {
    "mainObjectives": ["Primary objective 1", "Primary objective 2"],
    "measurableGoals": ["Measurable metric 1 (e.g. sub-200ms latency)", "Measurable metric 2"]
  },
  "users": {
    "targetUsers": ${JSON.stringify(project.targetUsers)},
    "userRoles": ["Admin", "Student/End-User"],
    "userJourneys": ["User logs in, uploads data, receives AI insights, exports PDF report"]
  },
  "features": {
    "core": ${JSON.stringify(project.coreFeatures)},
    "advanced": ${JSON.stringify(project.advancedFeatures)},
    "optional": ["Real-time WebSocket alerts", "Mobile PWA wrapper"]
  },
  "architecture": {
    "frontend": "React, TypeScript, Vite, Tailwind CSS",
    "backend": "Node.js, Express, TypeScript",
    "apis": ["RESTful /api/* endpoints", "Gemini API integration"],
    "databaseRecommendation": "PostgreSQL or Firestore with schema migration plan",
    "aiServices": ["Google Gemini 3.8 Flash for reasoning", "Custom embeddings"],
    "externalServices": ["Cloud hosting", "Object storage"],
    "deploymentArchitecture": "Dockerized container on Google Cloud Run"
  },
  "aiComponents": [
    {
      "whereUsed": "Core analysis engine",
      "whyNeeded": "Automates complex pattern recognition that standard rules cannot handle",
      "input": "User profile & project parameters",
      "processing": "Prompt engineering with Gemini model and structured schema validation",
      "output": "Structured JSON blueprint and scores",
      "modelResponsibility": "Gemini 3.8 Flash handles reasoning & text processing"
    }
  ],
  "security": {
    "authentication": "JWT / Firebase Auth with secure HTTP-only cookies",
    "authorization": "Role-Based Access Control (RBAC)",
    "inputValidation": "Zod / TypeScript schema runtime validation",
    "apiSecurity": "Express rate limiting, CORS configuration, API key hiding on server",
    "dataPrivacy": "Sanitizing user inputs, avoiding storing unencrypted PII",
    "secretManagement": "Environment variables managed via Google Cloud Secret Manager / .env"
  },
  "testing": {
    "unitTesting": "Jest / Vitest for business logic and score calculation functions",
    "integrationTesting": "Supertest for API endpoint route testing",
    "uiTesting": "Playwright / React Testing Library",
    "aiValidation": "Schema validation and fallback error handling for Gemini outputs",
    "edgeCases": ["Missing API key", "Malformed user input", "Network timeout"]
  },
  "deployment": {
    "recommendations": ["Deploy frontend and backend to Cloud Run / Vercel", "Set up CI/CD via GitHub Actions"],
    "pipeline": "GitHub Push -> Automated Tests -> Docker Build -> Cloud Run Deploy"
  },
  "futureScope": ["Multi-tenant organizational dashboard", "Mobile iOS/Android app release"]
}
`;
  },

  mentorChat(
    profile: StudentProfile,
    project: ProjectIdea | null,
    history: { sender: string; text: string }[],
    userMessage: string
  ): string {
    return `
You are a world-class Senior Software Engineering Director and Competition Mentor guiding a student on their final-year engineering project.

STUDENT CONTEXT:
- Student Name/Branch: ${profile.academic.branch} (${profile.academic.year} Year)
- Skills: ${[...profile.skills.languages, ...profile.skills.frameworks, ...profile.skills.aiMl].join(', ')}
- Constraints: ${profile.constraints.availableWeeks} weeks available, team size ${profile.constraints.teamSize}.

${
  project
    ? `ACTIVE SELECTED PROJECT:
- Title: ${project.title}
- Stack: Frontend: ${project.technologyStack.frontend.join(', ')} | Backend: ${project.technologyStack.backend.join(', ')} | AI: ${project.aiMlUsage}
- Problem Statement: ${project.problemStatement}
- Difficulty: ${project.difficulty}`
    : 'No project selected yet. Guide the student to complete their profile and choose an idea.'
}

CONVERSATION HISTORY:
${history.map((h) => `${h.sender.toUpperCase()}: ${h.text}`).join('\n')}

STUDENT'S NEW QUESTION:
"${userMessage}"

INSTRUCTIONS:
- Give direct, highly technical, encouraging, and actionable guidance.
- Refer specifically to the student's project context, stack, and constraints.
- Do NOT repeat generic fluff. Provide code structure, architectural advice, or competition presentation tips when relevant.
- Keep tone professional, concise, authoritative yet approachable.
`;
  },

  generateInnovations(project: ProjectIdea): string {
    return `
You are a Competition Innovation Strategist.
Suggest 5 to 7 high-impact, achievable innovation enhancements for this final-year project to make it stand out to competition judges.

PROJECT DETAILS:
Title: ${project.title}
Problem: ${project.problemStatement}
Core Features: ${project.coreFeatures.join(', ')}
Stack: ${JSON.stringify(project.technologyStack)}

Return JSON array of objects:
[
  {
    "category": "AI Innovation", // Choose from: AI Innovation, Technical Innovation, UX Innovation, Automation, Social/Real-World Impact, Scalability, Data/Analytics
    "title": "Clear Catchy Title",
    "idea": "Detailed explanation of the innovative feature",
    "whyItImproves": "Why this will impress competition judges and real users",
    "difficulty": "Medium", // Easy, Medium, Hard
    "expectedImpact": "Game Changer", // High, Very High, Game Changer
    "implementationTip": "Technical step-by-step guidance to implement"
  }
]
`;
  },

  generateScopeOptimizer(profile: StudentProfile, project: ProjectIdea): string {
    return `
You are a Software Delivery Manager.
Optimize the feature scope into 4 distinct execution modes for a ${profile.constraints.availableWeeks}-week project timeline with team size ${profile.constraints.teamSize}.

PROJECT:
Title: ${project.title}
Features: Core: ${project.coreFeatures.join(', ')} | Advanced: ${project.advancedFeatures.join(', ')}

Return JSON array for modes [MVP, Standard, Advanced, Competition]:
[
  {
    "mode": "MVP",
    "description": "Bare minimum working prototype required to pass base requirements",
    "buildNow": ["Core Feature 1", "Core Feature 2"],
    "buildLater": ["Advanced Feature 1"],
    "remove": ["Bloated Feature 1"],
    "optional": ["Theme switcher"],
    "reasoning": "Focus purely on working end-to-end data flow first."
  },
  {
    "mode": "Standard",
    "description": "Solid final-year project suitable for standard grading",
    "buildNow": ["Core Features", "Primary AI component"],
    "buildLater": ["Multi-user RBAC"],
    "remove": ["Complex microservices"],
    "optional": ["Export PDF"],
    "reasoning": "Balances technical depth with guaranteed completion."
  },
  {
    "mode": "Advanced",
    "description": "High-scoring project with robust architecture and polish",
    "buildNow": ["Full core + advanced features", "AI evaluation pipeline"],
    "buildLater": [],
    "remove": [],
    "optional": ["Real-time analytics"],
    "reasoning": "Demonstrates full-stack proficiency and high code quality."
  },
  {
    "mode": "Competition",
    "description": "Award-winning build designed for hackathons and project expos",
    "buildNow": ["Full feature set", "AI Innovation features", "Live analytics", "Polished UX"],
    "buildLater": [],
    "remove": [],
    "optional": [],
    "reasoning": "Maximizes judges' evaluation metrics across all criteria."
  }
]
`;
  },

  generateRiskRadar(profile: StudentProfile, project: ProjectIdea): string {
    return `
You are a Senior Risk & Reliability Engineer.
Analyze technical, operational, and project risks for this project.

CONSTRAINTS:
- Timeline: ${profile.constraints.availableWeeks} weeks
- Hardware: ${profile.constraints.hardware} (GPU: ${profile.constraints.hasGPU ? 'Yes' : 'No'})
- Budget: $${profile.constraints.budgetUsd}

PROJECT:
Title: ${project.title}
Stack: ${JSON.stringify(project.technologyStack)}
AI Usage: ${project.aiMlUsage}

Return JSON array of risks:
[
  {
    "id": "risk-1",
    "category": "Technical", // Technical, Time, Cost, Dataset, API, Hardware, Security, Scalability, Team
    "risk": "Name of the risk",
    "severity": "High", // Low, Medium, High, Critical
    "probability": "Medium", // Low, Medium, High
    "explanation": "Why this risk threatens the project",
    "mitigation": "Proactive steps to avoid the risk",
    "backupPlan": "Plan B if the risk materializes"
  }
]
`;
  },

  evaluateJudgeMode(profile: StudentProfile, project: ProjectIdea): string {
    return `
You are a strict, experienced University Project Examiner & Hackathon Judge.
Evaluate this final-year project with brutal honesty. Do NOT inflate scores artificially.

PROJECT DETAILS:
Title: ${project.title}
Problem: ${project.problemStatement}
Core Features: ${project.coreFeatures.join(', ')}
Tech Stack: ${JSON.stringify(project.technologyStack)}
AI Integration: ${project.aiMlUsage}

Return JSON with this schema:
{
  "overallScore": 78, // Realistic score out of 100
  "criteriaScores": {
    "problemRelevance": 82,
    "innovation": 75,
    "technicalDepth": 80,
    "feasibility": 85,
    "aiUsage": 78,
    "impact": 76,
    "scalability": 70,
    "security": 72,
    "ux": 80,
    "presentationPotential": 85
  },
  "strongestAspects": ["Clear real-world problem alignment", "Solid AI integration plan"],
  "weakestAspects": ["Database scalability is vague", "Lack of explicit automated testing plan"],
  "majorConcerns": ["Risk of API key rate limits during demo"],
  "top3Improvements": [
    "Add fallback local offline model support",
    "Implement automated unit test suite for core algorithms",
    "Include a live benchmark comparison chart against existing solutions"
  ],
  "judgeFeedback": "Honest, constructive 2-paragraph evaluation explaining why this score was awarded and how the student can push it into 90+ territory."
}
`;
  },

  generateVivaQuestions(project: ProjectIdea): string {
    return `
You are a University External Viva Examiner.
Generate 8 to 10 realistic, tough viva questions for this project across multiple technical categories.

PROJECT:
Title: ${project.title}
Problem: ${project.problemStatement}
Tech Stack: ${JSON.stringify(project.technologyStack)}
AI Usage: ${project.aiMlUsage}

Return JSON array of viva questions:
[
  {
    "id": "viva-1",
    "category": "Architecture", // Basic, Problem Statement, Architecture, Technology, AI/ML, Database, Security, Testing, Deployment, Tricky
    "question": "Why did you choose Node.js/Express over Python FastAPI for your backend service?",
    "suggestedAnswer": "Detailed model answer demonstrating technical depth, async performance awareness, and team skill alignment.",
    "whyExaminerAsks": "Tests whether the candidate made intentional architectural decisions vs blindly following tutorials.",
    "keyPoints": ["Async non-blocking I/O", "TypeScript ecosystem consistency", "Low memory footprint on Cloud Run"]
  }
]
`;
  },

  evaluateVivaAnswer(
    question: string,
    category: string,
    userAnswer: string,
    modelAnswer: string
  ): string {
    return `
You are an External Viva Examiner.
Evaluate the student's spoken/written answer to this viva question.

QUESTION (${category}):
"${question}"

EXPECTED MODEL ANSWER KEYPOINTS:
"${modelAnswer}"

STUDENT'S ANSWER:
"${userAnswer}"

Return JSON:
{
  "accuracyScore": 85, // 0-100
  "technicalUnderstandingScore": 80, // 0-100
  "completenessScore": 75, // 0-100
  "clarityScore": 88, // 0-100
  "missingConcepts": ["Mentioning async I/O event loop details"],
  "feedback": "Constructive feedback on how to improve the answer for the actual viva presentation.",
  "modelAnswer": "${modelAnswer.replace(/"/g, '\\"')}"
}
`;
  },

  improveExistingProject(rawProjectIdea: string, profile: StudentProfile): string {
    return `
You are a Master Software Architect and Project Advisor.
An engineering student pasted their existing rough project idea.
Analyze it and transform it into an elite, competition-ready final-year project.

STUDENT RAW IDEA INPUT:
"${rawProjectIdea}"

STUDENT CONSTRAINTS & STACK:
- Branch: ${profile.academic.branch}
- Skills: ${[...profile.skills.languages, ...profile.skills.frameworks].join(', ')}

Return JSON:
{
  "originalIdea": "${rawProjectIdea.replace(/"/g, '\\"')}",
  "weaknesses": ["Weakness 1", "Weakness 2"],
  "missingFeatures": ["Missing feature 1"],
  "technicalProblems": ["Technical problem 1"],
  "innovationOpportunities": ["AI Innovation opportunity 1"],
  "aiOpportunities": ["Smart reasoning opportunity"],
  "securityProblems": ["Exposed API key risk"],
  "scalabilityImprovements": ["Database index optimization"],
  "improvedProject": {
    "id": "improved-1",
    "title": "Transformed Elite Title",
    "shortDescription": "Sophisticated summary",
    "problemStatement": "Deeper problem statement",
    "targetUsers": ["User 1", "User 2"],
    "realWorldProblem": "Industry gap",
    "coreFeatures": ["Core 1", "Core 2"],
    "advancedFeatures": ["Advanced 1", "Advanced 2"],
    "technologyStack": {
      "frontend": ["React", "TypeScript"],
      "backend": ["Node.js", "Express"],
      "database": ["PostgreSQL"],
      "aiMl": ["Gemini API"],
      "tools": ["Docker"]
    },
    "aiMlUsage": "Detailed AI integration description",
    "difficulty": "Challenging",
    "estimatedDurationWeeks": 12,
    "estimatedCostUsd": 0,
    "scores": {
      "innovation": 90,
      "feasibility": 85,
      "impact": 88,
      "scalability": 85,
      "technicalDepth": 88,
      "skillMatch": 82
    },
    "whyItMatches": "Why this upgraded version suits the student's background."
  }
}
`;
  },
};
