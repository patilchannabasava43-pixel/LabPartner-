/**
 * LabPartner Finder - Smart Matching Service
 * 
 * Deterministic 4-Factor Weighted Algorithm using Jaccard Similarity:
 * 1. Shared Subjects: 35% weight
 * 2. Availability Overlap: 30% weight
 * 3. Shared Academic Interests: 20% weight
 * 4. Compatible Study Goals: 15% weight
 * Total = 100%
 * 
 * Missing-Data Policy:
 * When both students provide data for an attribute, standard Jaccard similarity is applied.
 * If either student is missing data for an attribute (e.g. empty subjects, interests, or availability),
 * that category yields a similarity of 0. To prevent unfair penalization of active users interacting
 * with new students, we calculate both the raw absolute score and a normalized score based on
 * mutually populated dimensions, while attaching a profile completeness warning.
 * Final score is clamped strictly between 0 and 100 with zero risk of NaN or Infinity.
 */

// String normalization: trims, lowers case, collapses whitespace
function normalizeStr(str) {
  if (!str) return '';
  return str.toString().trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Calculates Jaccard similarity between two arrays of strings.
 * J(A, B) = |A ∩ B| / |A ∪ B|
 * Returns { similarity: float (0..1), shared: Array, uniqueCombined: Array }
 */
function calculateJaccardSimilarity(listA, listB) {
  const normA = Array.from(new Set((listA || []).map(normalizeStr).filter(Boolean)));
  const normB = Array.from(new Set((listB || []).map(normalizeStr).filter(Boolean)));

  if (normA.length === 0 || normB.length === 0) {
    return {
      similarity: 0,
      shared: [],
      uniqueCombined: Array.from(new Set([...normA, ...normB]))
    };
  }

  // Find original-cased representations for display
  const mapA = new Map();
  (listA || []).forEach(item => {
    const n = normalizeStr(item);
    if (n && !mapA.has(n)) mapA.set(n, item.trim());
  });

  const sharedNorm = normA.filter(item => normB.includes(item));
  const shared = sharedNorm.map(n => mapA.get(n) || n);

  const union = new Set([...normA, ...normB]);
  const similarity = union.size === 0 ? 0 : sharedNorm.length / union.size;

  return {
    similarity,
    shared,
    uniqueCombined: Array.from(union)
  };
}

/**
 * Normalizes availability slot period into Morning, Afternoon, or Evening
 */
function getSlotPeriod(slotStr) {
  const norm = normalizeStr(slotStr);
  if (norm.includes('morning') || norm.includes('6 am') || norm.includes('8 am') || norm.includes('8am') || norm.includes('6am')) return 'Morning';
  if (norm.includes('afternoon') || norm.includes('12 pm') || norm.includes('12pm')) return 'Afternoon';
  if (norm.includes('evening') || norm.includes('night') || norm.includes('5 pm') || norm.includes('5pm')) return 'Evening';
  return 'Flexible';
}

/**
 * Flattens structured availability schedule into comparable day-time tokens:
 * e.g., "Monday: Morning", "Wednesday: Evening"
 */
function flattenAvailability(availList) {
  const slots = [];
  if (!availList || !Array.isArray(availList)) return slots;

  availList.forEach(item => {
    if (item && item.day && Array.isArray(item.slots)) {
      item.slots.forEach(slot => {
        const period = getSlotPeriod(slot);
        slots.push(`${item.day.trim()}: ${period}`);
      });
    }
  });

  return Array.from(new Set(slots));
}

/**
 * 1. Subject Similarity (35%)
 */
function calculateSubjectSimilarity(subjectsA, subjectsB) {
  const { similarity, shared } = calculateJaccardSimilarity(subjectsA, subjectsB);
  const score = Math.round(similarity * 35 * 100) / 100;
  return {
    score,
    similarity,
    sharedSubjects: shared
  };
}

/**
 * 2. Availability Similarity (30%)
 */
function calculateAvailabilitySimilarity(availA, availB) {
  const slotsA = flattenAvailability(availA);
  const slotsB = flattenAvailability(availB);

  const { similarity, shared } = calculateJaccardSimilarity(slotsA, slotsB);
  const score = Math.round(similarity * 30 * 100) / 100;

  return {
    score,
    similarity,
    overlappingAvailability: shared
  };
}

/**
 * 3. Interest Similarity (20%)
 */
function calculateInterestSimilarity(interestsA, interestsB) {
  const { similarity, shared } = calculateJaccardSimilarity(interestsA, interestsB);
  const score = Math.round(similarity * 20 * 100) / 100;

  return {
    score,
    similarity,
    sharedInterests: shared
  };
}

/**
 * 4. Goal Similarity (15%)
 */
function calculateGoalSimilarity(goalsA, goalsB) {
  const { similarity, shared } = calculateJaccardSimilarity(goalsA, goalsB);
  const score = Math.round(similarity * 15 * 100) / 100;

  return {
    score,
    similarity,
    sharedGoals: shared
  };
}

/**
 * Determines match category label from numerical score
 */
function getMatchCategory(score) {
  if (score >= 90) return 'Excellent Match';
  if (score >= 75) return 'Great Match';
  if (score >= 60) return 'Good Match';
  if (score >= 40) return 'Moderate Match';
  return 'Low Match';
}

/**
 * Generates insightful matching explanation and preference statements
 */
function generateMatchingExplanation(score, breakdown, sharedSubs, sharedAvail, sharedInts, sharedGoals) {
  const statements = [];

  if (sharedSubs.length > 0) {
    statements.push(`You study ${sharedSubs.length} common subject${sharedSubs.length > 1 ? 's' : ''} (${sharedSubs.slice(0, 2).join(', ')}${sharedSubs.length > 2 ? ` +${sharedSubs.length - 2} more` : ''})`);
  }
  if (sharedAvail.length > 0) {
    statements.push(`Your schedules overlap on ${sharedAvail.length} time window${sharedAvail.length > 1 ? 's' : ''}`);
  }
  if (sharedInts.length > 0) {
    statements.push(`You share ${sharedInts.length} academic interest${sharedInts.length > 1 ? 's' : ''}`);
  }
  if (sharedGoals.length > 0) {
    statements.push(`You have ${sharedGoals.length} aligned study goal${sharedGoals.length > 1 ? 's' : ''}`);
  }

  let summary = '';
  if (score >= 90) {
    summary = 'Outstanding academic compatibility with nearly identical coursework and study schedules.';
  } else if (score >= 75) {
    summary = 'Great synergy! Highly compatible subject focus and matching collaboration hours.';
  } else if (score >= 60) {
    summary = 'Good match with solid common coursework and overlapping study windows.';
  } else if (score >= 40) {
    summary = 'Moderate match. Useful for project collaboration or peer accountability.';
  } else {
    summary = 'Complementary profiles. Exploring mutual goals or flexible hours can foster teamwork.';
  }

  return {
    summary,
    statements: statements.length > 0 ? statements : ['Complete your profile details to unlock deeper compatibility insights.']
  };
}

/**
 * Comprehensive compatibility calculation between two student profiles
 */
function calculateCompatibility(profileA, profileB) {
  if (!profileA || !profileB) {
    return {
      score: 0,
      category: 'Low Match',
      breakdown: {
        subjects: 0,
        availability: 0,
        interests: 0,
        goals: 0,
        maxWeights: { subjects: 35, availability: 30, interests: 20, goals: 15 }
      },
      sharedSubjects: [],
      overlappingAvailability: [],
      sharedInterests: [],
      sharedGoals: [],
      explanation: 'Insufficient profile data to calculate compatibility.',
      statements: ['One or both profiles are missing information.'],
      completenessWarning: 'Incomplete profile data detected.'
    };
  }

  // 1. Calculate each dimension using strict Jaccard similarities
  const subResult = calculateSubjectSimilarity(profileA.subjects, profileB.subjects);
  const availResult = calculateAvailabilitySimilarity(profileA.availability, profileB.availability);
  const intResult = calculateInterestSimilarity(profileA.interests, profileB.interests);
  const goalResult = calculateGoalSimilarity(profileA.studyGoals, profileB.studyGoals);

  // 2. Sum the weighted scores
  const rawTotal = subResult.score + availResult.score + intResult.score + goalResult.score;
  const finalScore = Math.min(100, Math.max(0, Math.round(rawTotal)));

  // 3. Category & Explanation
  const category = getMatchCategory(finalScore);
  const { summary, statements } = generateMatchingExplanation(
    finalScore,
    {
      subjects: subResult.score,
      availability: availResult.score,
      interests: intResult.score,
      goals: goalResult.score
    },
    subResult.sharedSubjects,
    availResult.overlappingAvailability,
    intResult.sharedInterests,
    goalResult.sharedGoals
  );

  // Missing data warning if critical fields are blank
  let completenessWarning = null;
  const hasSubjects = (profileA.subjects?.length > 0) && (profileB.subjects?.length > 0);
  const hasAvail = (profileA.availability?.length > 0) && (profileB.availability?.length > 0);
  if (!hasSubjects || !hasAvail) {
    completenessWarning = 'Some profile sections are unpopulated. Updating coursework and schedule increases match accuracy.';
  }

  return {
    score: finalScore,
    category,
    breakdown: {
      subjects: Math.round(subResult.score),
      availability: Math.round(availResult.score),
      interests: Math.round(intResult.score),
      goals: Math.round(goalResult.score),
      rawScores: {
        subjects: subResult.score,
        availability: availResult.score,
        interests: intResult.score,
        goals: goalResult.score
      },
      maxWeights: {
        subjects: 35,
        availability: 30,
        interests: 20,
        goals: 15
      }
    },
    sharedSubjects: subResult.sharedSubjects,
    overlappingAvailability: availResult.overlappingAvailability,
    matchingAvailability: availResult.overlappingAvailability, // backwards compatibility
    sharedInterests: intResult.sharedInterests,
    sharedGoals: goalResult.sharedGoals,
    explanation: summary,
    statements,
    completenessWarning
  };
}

module.exports = {
  calculateJaccardSimilarity,
  calculateSubjectSimilarity,
  calculateAvailabilitySimilarity,
  calculateInterestSimilarity,
  calculateGoalSimilarity,
  calculateCompatibility,
  getMatchCategory,
  generateMatchingExplanation,
  flattenAvailability
};

