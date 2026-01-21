const calculateMatchScore = (userA, userB) => {
    let score = 0;
    const breakdown = {};

    const prefA = userA.preferences;
    const prefB = userB.preferences;

    if (!prefA || !prefB) return { score: 0, breakdown };

    // 1. Budget Overlap (+20)
    // Check if ranges overlap
    const budgetOverlap = Math.max(0, Math.min(prefA.budget.max, prefB.budget.max) - Math.max(prefA.budget.min, prefB.budget.min));
    if (budgetOverlap > 0) {
        score += 20;
        breakdown.budget = 20;
    } else {
        breakdown.budget = 0;
    }

    // 2. Cleanliness Closeness (+15)
    // Difference of 0 -> 15, Diff 1 -> 10, etc? Or just linear?
    // Let's say if abs diff is 0 => +15, 1 => +10, 2 => +5, >2 => 0
    const cleanDiff = Math.abs(prefA.cleanliness - prefB.cleanliness);
    if (cleanDiff === 0) { score += 15; breakdown.cleanliness = 15; }
    else if (cleanDiff === 1) { score += 10; breakdown.cleanliness = 10; }
    else if (cleanDiff === 2) { score += 5; breakdown.cleanliness = 5; }
    else { breakdown.cleanliness = 0; }

    // 3. Sleep Schedule Match (+15)
    if (prefA.sleepSchedule === prefB.sleepSchedule) {
        score += 15;
        breakdown.sleepSchedule = 15;
    } else {
        breakdown.sleepSchedule = 0;
    }

    // 4. Smoking Match (+10)
    // If both yes or both no => match? Or just strict 'no' requires 'no'?
    // Generally, non-smokers want non-smokers. Smokers might not care.
    // Let's assume exact match = +10.
    if (prefA.smoking === prefB.smoking) {
        score += 10;
        breakdown.smoking = 10;
    } else {
        breakdown.smoking = 0;
    }

    // 5. Drinking Match (+10)
    if (prefA.drinking === prefB.drinking) {
        score += 10;
        breakdown.drinking = 10;
    } else {
        breakdown.drinking = 0;
    }

    // 6. Study Hours Closeness (+15)
    // Similar logic to cleanliness?
    const studyDiff = Math.abs(prefA.studyHours - prefB.studyHours);
    if (studyDiff <= 2) { score += 15; breakdown.studyHours = 15; } // Close enough
    else if (studyDiff <= 4) { score += 10; breakdown.studyHours = 10; }
    else { breakdown.studyHours = 0; }

    // 7. Personality Closeness (+10) (Introvert/Extrovert)
    // Some people like opposites, but prompt says "match". Assuming similarity for now?
    // Or maybe Introvert+Introvert = Good, Ext+Ext = Good?
    // Let's go with similarity.
    const personalityDiff = Math.abs(prefA.introvertExtrovert - prefB.introvertExtrovert);
    if (personalityDiff <= 1) { score += 10; breakdown.personality = 10; }
    else { breakdown.personality = 0; }

    // 8. Food Preference (+5)
    // 'any' matches anything? Or exact match?
    if (prefA.foodPreference === 'any' || prefB.foodPreference === 'any' || prefA.foodPreference === prefB.foodPreference) {
        score += 5;
        breakdown.foodPreference = 5;
    } else {
        breakdown.foodPreference = 0;
    }

    return { score, breakdown };
};

module.exports = { calculateMatchScore };
