import { StudentProfile, SkillGapAnalysis, SkillGapItem } from '../../src/types/project';

/**
 * Deterministic skill gap analysis engine.
 * Computes exact match percentages based on explicit weights.
 */
export function calculateSkillGap(
  profile: StudentProfile,
  requiredSkills: { skill: string; category: string }[]
): SkillGapAnalysis {
  const studentSkillsNormalized = new Set<string>();

  // Collect all student skills into a normalized lowercase set
  const allStudentSkillLists = [
    ...profile.skills.languages,
    ...profile.skills.frameworks,
    ...profile.skills.aiMl,
    ...profile.skills.databases,
    ...profile.skills.cloudDeployment,
    ...profile.skills.other,
  ];

  allStudentSkillLists.forEach((skill) => {
    if (skill && skill.trim()) {
      studentSkillsNormalized.add(skill.trim().toLowerCase());
    }
  });

  const items: SkillGapItem[] = [];
  let totalPoints = 0;
  let earnedPoints = 0;

  const strongSkills: string[] = [];
  const partialSkills: string[] = [];
  const missingSkills: string[] = [];

  // Helper for partial matching (e.g., student knows 'react', project needs 'react native')
  requiredSkills.forEach((req) => {
    const reqClean = req.skill.trim().toLowerCase();
    totalPoints += 1.0;

    let status: 'Strong' | 'Partial' | 'Missing' = 'Missing';
    let weight = 0.0;
    let estimatedHours = 20;

    if (studentSkillsNormalized.has(reqClean)) {
      status = 'Strong';
      weight = 1.0;
      estimatedHours = 0;
      strongSkills.push(req.skill);
    } else {
      // Check partial match substring or related terms
      const isPartial = Array.from(studentSkillsNormalized).some((sSkill) => {
        return (
          reqClean.includes(sSkill) ||
          sSkill.includes(reqClean) ||
          (reqClean.includes('sql') && sSkill.includes('sql')) ||
          (reqClean.includes('python') && sSkill.includes('ml')) ||
          (reqClean.includes('node') && sSkill.includes('express'))
        );
      });

      if (isPartial) {
        status = 'Partial';
        weight = 0.5;
        estimatedHours = 10;
        partialSkills.push(req.skill);
      } else {
        status = 'Missing';
        weight = 0.0;
        estimatedHours = 25;
        missingSkills.push(req.skill);
      }
    }

    earnedPoints += weight;

    items.push({
      skill: req.skill,
      category: req.category || 'General',
      status,
      weight,
      estimatedLearningHours: estimatedHours,
      recommendedResources: `Learn ${req.skill} basics & build a small practice module.`,
      reason:
        status === 'Strong'
          ? `Already listed in your profile.`
          : status === 'Partial'
          ? `You have foundational knowledge, but need hands-on experience with ${req.skill}.`
          : `Not currently listed in your technical skill set.`,
    });
  });

  // Calculate deterministic match percentage
  const matchPercentage =
    totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 100;

  // Sort items so Missing & Partial are prioritized
  const prioritySequence = [...items].sort((a, b) => a.weight - b.weight);

  const totalLearningHours = items.reduce(
    (sum, item) => sum + item.estimatedLearningHours,
    0
  );

  return {
    matchPercentage,
    strongSkills,
    partialSkills,
    missingSkills,
    prioritySequence,
    totalLearningHours,
    overallAdvice: `Your skill set aligns ${matchPercentage}% with this project. Focus on learning ${missingSkills.slice(0, 3).join(', ') || 'advanced patterns'}.`,
  };
}
