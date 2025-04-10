// constants.ts
export const TOTAL_ONBOARDING_STEPS = 4;

export const SKILL_LEVELS = [
  { id: 'beginner', label: 'Complete Beginner' },
  { id: 'some_experience', label: 'Some Experience' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
];

export const GOAL_LEVELS = [
  { id: 'basic', label: 'Basic Proficiency' },
  { id: 'hobby', label: 'Hobby Level' },
  { id: 'advanced', label: 'Advanced Skills' },
  { id: 'professional', label: 'Professional Level' },
];

export const TIME_OPTIONS = [
  { id: 'casual', label: '1-2 hours per week' },
  { id: 'regular', label: '3-5 hours per week' },
  { id: 'dedicated', label: '5-10 hours per week' },
  { id: 'intense', label: '10+ hours per week' },
];

export const STORAGE_KEYS = {
  hobbyName: 'hobbyName',
  currentSkillLevel: 'currentSkillLevel',
  desiredSkillLevel: 'desiredSkillLevel',
  timeCommitment: 'timeCommitment',
  onboardingCompleted: 'onboardingCompleted'
};

export const LABELS: Record<string, string> = {
      'beginner': 'Complete Beginner',
      'some_experience': 'Some Experience',
      'intermediate': 'Intermediate',
      'advanced': 'Advanced',
      'basic': 'Basic Proficiency',
      'hobby': 'Hobby Level',
      'professional': 'Professional Level',
      'casual': '1-2 hours per week',
      'regular': '3-5 hours per week',
      'dedicated': '5-10 hours per week',
      'intense': '10+ hours per week',
};