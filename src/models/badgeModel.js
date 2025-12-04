//THE BADGE DATABASE
const MOCK_BADGES = {
    "badge_math_novice": {
        id: "badge_math_novice",
        title: "Number Ninja",
        icon: "2"
    }, 
    
    "badge_science_novice": {
        id: "badge_science_novice",
        title: "science Ninja",
        icon: "3"
    }, 
    
    "badge_english_novice": {
        id: "badge_english_novice",
        title: "english Ninja",
        icon: "4"
    },
    "badge_streak_7": { 
        id: "badge_streak_7",
        title: "On Fire!",
        icon: "5"
    }
};

//This won't work 100% beacuse we need to implemnt many other things 
export function getBadgeById(id) {
    return MOCK_BADGES[id] || null;
}


export function getAllBadges() {
    return Object.values(MOCK_BADGES);
}