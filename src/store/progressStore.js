import { seedData } from '../data/seed';

export const getActiveUser = () => {
  return localStorage.getItem('russian_app_active_user') || null;
};

export const setActiveUser = (username) => {
  if (username) {
    localStorage.setItem('russian_app_active_user', username);
  } else {
    localStorage.removeItem('russian_app_active_user');
  }
};

const getUserKey = (baseKey) => {
  const user = getActiveUser();
  return user ? `${user}_${baseKey}` : baseKey;
};

// SuperMemo-2 logic
const calculateSM2 = (quality, prevInterval, prevEase, prevLapses, prevReps) => {
  let interval, ease, lapses, reps;

  // quality: 1 (Again), 2 (Hard), 3 (Good), 4 (Easy)
  if (quality >= 3) {
    // Correct
    if (prevReps === 0) {
      interval = 1;
    } else if (prevReps === 1) {
      interval = 6;
    } else {
      interval = Math.round(prevInterval * prevEase);
    }
    reps = prevReps + 1;
    lapses = prevLapses;
  } else {
    // Incorrect
    reps = 0;
    interval = 1;
    lapses = prevLapses + 1;
  }

  // Calculate new ease factor
  let sm2Quality = quality === 4 ? 5 : (quality === 3 ? 4 : (quality === 2 ? 3 : 0));
  ease = prevEase + (0.1 - (5 - sm2Quality) * (0.08 + (5 - sm2Quality) * 0.02));
  if (ease < 1.3) ease = 1.3;

  // If Easy, increase interval by a larger bonus
  if (quality === 4 && prevReps > 0) {
      interval = Math.round(interval * 1.3);
  }

  return { interval, ease, lapses, reps };
};

export const getProgressData = () => {
  const data = localStorage.getItem(getUserKey('russian_app_progress'));
  if (data) {
    return JSON.parse(data);
  }
  return {};
};

export const saveProgressData = (data) => {
  localStorage.setItem(getUserKey('russian_app_progress'), JSON.stringify(data));
};

export const getSettings = () => {
  const data = localStorage.getItem(getUserKey('russian_app_settings'));
  if (data) {
    return JSON.parse(data);
  }
  return {
    showTransliteration: false,
    autoplayAudio: true,
    dailyNewGoal: 5,
    darkMode: true
  };
};

export const saveSettings = (settings) => {
  localStorage.setItem(getUserKey('russian_app_settings'), JSON.stringify(settings));
  applyTheme(settings.darkMode);
};

export const applyTheme = (isDark) => {
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export const getCustomCards = () => {
    const data = localStorage.getItem(getUserKey('russian_app_custom_cards'));
    return data ? JSON.parse(data) : [];
};

export const saveCustomCards = (cards) => {
    localStorage.setItem(getUserKey('russian_app_custom_cards'), JSON.stringify(cards));
};

export const getEditedData = () => {
    const data = localStorage.getItem(getUserKey('russian_app_edited_cards'));
    return data ? JSON.parse(data) : {};
};

export const saveEditedData = (data) => {
    localStorage.setItem(getUserKey('russian_app_edited_cards'), JSON.stringify(data));
};

export const getDeletedCardIds = () => {
    const data = localStorage.getItem(getUserKey('russian_app_deleted_cards'));
    return data ? JSON.parse(data) : [];
};

export const saveDeletedCardIds = (ids) => {
    localStorage.setItem(getUserKey('russian_app_deleted_cards'), JSON.stringify(ids));
};

export const getAllCards = () => {
    const custom = getCustomCards();
    const edited = getEditedData();
    const deleted = getDeletedCardIds();
    
    const baseCards = seedData
        .filter(c => !deleted.includes(c.id))
        .map(c => edited[c.id] ? { ...c, ...edited[c.id] } : c);
        
    // Place recently added custom cards at the top
    const reversedCustom = [...custom].reverse();
    return [...reversedCustom, ...baseCards];
}
// Logic to get exactly what's due, or new items based on goals
export const getDashboardStats = () => {
    const progress = getProgressData();
    const settings = getSettings();
    const now = new Date().getTime();
    
    let dueCount = 0;
    let newCount = 0;
    let newCardsAvailable = 0;
    let totalMastered = 0;
    let weakStats = [];
    
    // Group day string for streak tracking
    const todayStr = new Date().toDateString();
    
    const allData = getAllCards();
    
    // Process all cards
    allData.forEach(card => {
        const cardProgress = progress[card.id];
        if (!cardProgress) {
            newCardsAvailable++;
        } else {
            if (cardProgress.status === 'learning' || cardProgress.status === 'review') {
                if (cardProgress.due_at <= now) {
                    dueCount++;
                }
            } else if (cardProgress.status === 'new') {
               newCount++;
            }
            
            if (cardProgress.interval_days >= 21) {
                totalMastered++;
            }
            if (cardProgress.lapses > 3) {
                weakStats.push({ ...card, lapses: cardProgress.lapses });
            }
        }
    });

    // Per-level counts for selection screen
    const levelCounts = {
        fundamental: allData.filter(c => c.level === 'fundamental' && !progress[c.id]).length,
        b2: allData.filter(c => c.level === 'b2' && !progress[c.id]).length,
        advanced: allData.filter(c => c.level === 'advanced' && !progress[c.id]).length,
    };

    let streak = localStorage.getItem(getUserKey('russian_app_streak')) || 0;
    streak = parseInt(streak, 10);
    
    const lastStudied = localStorage.getItem(getUserKey('russian_app_last_studied'));
    if (lastStudied !== todayStr) {
        // Did they miss yesterday?
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (lastStudied !== yesterday.toDateString() && lastStudied !== todayStr && lastStudied) {
           streak = 0; // Streak broken
           localStorage.setItem(getUserKey('russian_app_streak'), 0);
        }
    }

    return {
        dueCount,
        newCardsAvailable: Math.min(settings.dailyNewGoal, newCardsAvailable),
        totalCards: allData.length,
        totalMastered,
        streak,
        weakStats,
        levelCounts
    };
};

export const fetchDueCards = () => {
    const progress = getProgressData();
    const now = new Date().getTime();
    const dueCards = [];

    const allData = getAllCards();

    allData.forEach(card => {
        const cardProgress = progress[card.id];
        if (cardProgress && (cardProgress.status === 'learning' || cardProgress.status === 'review')) {
            if (cardProgress.due_at <= now) {
                dueCards.push({ card, progress: cardProgress });
            }
        }
    });
    
    // Sort by due date, older first
    return dueCards.sort((a, b) => a.progress.due_at - b.progress.due_at);
}

export const fetchNewCards = (level, limit) => {
    const progress = getProgressData();
    const newCards = [];

    const allData = getAllCards();

    for (let card of allData) {
        if (!progress[card.id] && (!level || card.level === level)) {
            newCards.push(card);
            if (newCards.length >= limit) break;
        }
    }
    return newCards;
}

export const initializeNewCards = (cards) => {
    const progress = getProgressData();
    const now = new Date().getTime();
    
    cards.forEach(card => {
        progress[card.id] = {
            card_id: card.id,
            status: 'learning',
            last_reviewed_at: now,
            due_at: now, // Due immediately for first learning step
            interval_days: 0,
            ease_factor: 2.5,
            repetition_count: 0,
            lapses: 0,
            last_rating: null
        };
    });
    
    saveProgressData(progress);
}

export const submitReview = (cardId, rating) => {
    const progress = getProgressData();
    let cardP = progress[cardId];
    
    if (!cardP) {
        // Technically shouldn't happen unless error
        return;
    }

    const { interval, ease, lapses, reps } = calculateSM2(
        rating, 
        cardP.interval_days || 0, 
        cardP.ease_factor || 2.5, 
        cardP.lapses || 0, 
        cardP.repetition_count || 0
    );

    const now = new Date();
    
    // Set next due date
    const nextDue = new Date();
    if (interval < 1) { // Same day review (within minutes)
         nextDue.setMinutes(nextDue.getMinutes() + 10);
    } else {
         nextDue.setDate(nextDue.getDate() + interval);
    }

    cardP = {
        ...cardP,
        status: interval > 1 ? 'review' : 'learning',
        last_reviewed_at: now.getTime(),
        due_at: nextDue.getTime(),
        interval_days: interval,
        ease_factor: ease,
        repetition_count: reps,
        lapses: lapses,
        last_rating: rating
    };

    progress[cardId] = cardP;
    saveProgressData(progress);

    // Update streak if studying today
    const todayStr = new Date().toDateString();
    const lastStudied = localStorage.getItem(getUserKey('russian_app_last_studied'));
    if (lastStudied !== todayStr) {
        let streak = parseInt(localStorage.getItem(getUserKey('russian_app_streak')) || 0, 10);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastStudied === yesterday.toDateString() || !lastStudied) {
            streak++;
        } else {
            streak = 1; // Restart streak
        }
        localStorage.setItem(getUserKey('russian_app_streak'), streak);
        localStorage.setItem(getUserKey('russian_app_last_studied'), todayStr);
    }
};

export const resetProgress = () => {
    localStorage.removeItem(getUserKey('russian_app_progress'));
    localStorage.removeItem(getUserKey('russian_app_streak'));
    localStorage.removeItem(getUserKey('russian_app_last_studied'));
}
