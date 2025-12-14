export const SUBJECTS = [
    { 
        id: "math", 
        title: "Math Masters", 
        icon: "🧮", 
        color: "bg-blue-600",
        description: "Master numbers, shapes, and logic!" 
    },
    { 
        id: "science", 
        title: "Science Explorers", 
        icon: "🧬", 
        color: "bg-green-600",
        description: "Discover the world around you." 
    },
    { 
        id: "english", 
        title: "Language Legends", 
        icon: "📚", 
        color: "bg-yellow-600",
        description: "Become a wizard of words." 
    }
];


const UNITS_DB = [

    { id: "math_u1", subjectId: "math", title: "Unit 1: Number Basics", description: "Start your journey with simple numbers." },
    { id: "math_u2", subjectId: "math", title: "Unit 2: Operations", description: "Learning to add and subtract." },
    { id: "sci_u1", subjectId: "science", title: "Unit 1: Matter", description: "Everything is made of stuff!" },
    { id: "eng_u1", subjectId: "english", title: "Unit 1: Grammar", description: "Building better sentences." }
];


const MISSIONS_DB = [
{
        id: "math_001_theory",
        unitId: "math_u1",
        type: "theory", 
        title: "Lesson: What is Addition?",
        difficulty: 1,
        xpReward: 5,
        content: `
## Welcome to Addition! 
Adding is like bringing friends together.

If you have **2 apples** 🍎🍎 and get **1 more** 🍎, you now have **3 apples**!

We write this as:
**2 + 1 = 3**

The "+" sign means "add" or "plus".
        `
    },
    {
        id: "math_001_quiz",
        unitId: "math_u1",
        type: "quiz",
        title: "Practice: Counting Up",
        difficulty: 1,
        xpReward: 10,
        tasks: [
            { id: "t1", type: "quiz", question: "What is 1 + 1?", options: ["1", "2", "3"], correct: "2" },
            { id: "t2", type: "quiz", question: "You have 2 cats and get 1 more. How many?", options: ["2", "3", "4"], correct: "3" }
        ]
    },
    {
        id: "math_001_exam",
        unitId: "math_u1",
        type: "exam", 
        title: "UNIT TEST: Number Basics",
        difficulty: 3,
        xpReward: 50, 
        tasks: [
            { id: "e1", type: "quiz", question: "What is 5 + 3?", options: ["7", "8", "9"], correct: "8" },
            { id: "e2", type: "quiz", question: "Which equation equals 10?", options: ["5+5", "4+4", "3+3"], correct: "5+5" },
            { id: "e3", type: "quiz", question: "2 + 2 + 2 = ?", options: ["4", "6", "8"], correct: "6" }
        ]
    }
];

export function getSubjects() {
    return SUBJECTS;
}

export function getUnitsBySubject(subjectId) {
    return UNITS_DB.filter(unit => unit.subjectId === subjectId);
}

export function getMissionsByUnit(unitId) {
    return MISSIONS_DB.filter(mission => mission.unitId === unitId);
}

export function getMissionById(missionId) {
    return MISSIONS_DB.find(mission => mission.id === missionId);
}

export function getAllMissions() {
    return MISSIONS_DB;
}
