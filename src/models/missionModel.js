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
    { id: "math_u2", subjectId: "math", title: "Unit 2: Subtraction Squad", description: "Learning to take things away." },
    { id: "sci_u1", subjectId: "science", title: "Unit 1: States of Matter", description: "Solids, Liquids, and Gases!" },
    { id: "sci_u2", subjectId: "science", title: "Unit 2: The Solar System", description: "Explore the planets and stars." },
    { id: "eng_u1", subjectId: "english", title: "Unit 1: Nouns & Names", description: "People, places, and things." },
    { id: "eng_u2", subjectId: "english", title: "Unit 2: Action Verbs", description: "Running, jumping, and playing!" }
];

const MISSIONS_DB = [
    {
        id: "math_001_theory",
        unitId: "math_u1",
        type: "theory", 
        title: "Lesson: What is Addition?",
        difficulty: 1,
        xpReward: 5,
        tasks: [
            {
                type: "theory",
                content: `
## Welcome to Addition! 
Adding is like bringing friends together.

If you have **2 apples** 🍎🍎 and get **1 more** 🍎, you now have **3 apples**!

We write this as:
**2 + 1 = 3**

The "+" sign means "add" or "plus".
                `
            }
        ]
    },
    {
        id: "math_001_quiz",
        unitId: "math_u1",
        type: "quiz",
        title: "Practice: Counting Up",
        difficulty: 1,
        xpReward: 10,
        tasks: [
            { type: "quiz", question: "What is 1 + 1?", options: ["1", "2", "3"], correct: "2" },
            { type: "quiz", question: "You have 2 cats and get 1 more. How many?", options: ["2", "3", "4"], correct: "3" },
            { type: "quiz", question: "What symbol means add?", options: ["-", "+", "="], correct: "+" }
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
            { type: "quiz", question: "What is 5 + 3?", options: ["7", "8", "9"], correct: "8" },
            { type: "quiz", question: "Which equation equals 10?", options: ["5+5", "4+4", "3+3"], correct: "5+5" },
            { type: "quiz", question: "2 + 2 + 2 = ?", options: ["4", "6", "8"], correct: "6" }
        ]
    },
    {
        id: "math_002_theory",
        unitId: "math_u2",
        type: "theory",
        title: "Lesson: Taking Away",
        difficulty: 1,
        xpReward: 5,
        tasks: [
            {
                type: "theory",
                content: `
## Subtraction means Taking Away! ➖

Imagine you have **5 balloons** 🎈🎈🎈🎈🎈.
Pop! **2 balloons** fly away.

Now you have **3 balloons** left.

We write this as:
**5 - 2 = 3**
                `
            }
        ]
    },
    {
        id: "math_002_quiz",
        unitId: "math_u2",
        type: "quiz",
        title: "Practice: Simple Subtraction",
        difficulty: 2,
        xpReward: 15,
        tasks: [
            { type: "quiz", question: "What is 5 - 1?", options: ["3", "4", "5"], correct: "4" },
            { type: "quiz", question: "If you have 3 cookies and eat 3, how many are left?", options: ["0", "1", "3"], correct: "0" },
            { type: "quiz", question: "10 - 5 = ?", options: ["2", "5", "8"], correct: "5" }
        ]
    },
    {
        id: "sci_001_theory",
        unitId: "sci_u1",
        type: "theory",
        title: "Lesson: Solids, Liquids, Gases",
        difficulty: 1,
        xpReward: 5,
        tasks: [
            {
                type: "theory",
                content: `
## Everything is Matter! 🌍

There are three main states of matter:

1. **Solid**: Keeps its shape (Like a Rock 🪨)
2. **Liquid**: Flows and takes the shape of a cup (Like Water 💧)
3. **Gas**: Invisible and fills the room (Like Air 💨)
                `
            }
        ]
    },
    {
        id: "sci_001_quiz",
        unitId: "sci_u1",
        type: "quiz",
        title: "Lab: Identify the Matter",
        difficulty: 2,
        xpReward: 20,
        tasks: [
            { type: "quiz", question: "Is a brick a Solid, Liquid, or Gas?", options: ["Solid", "Liquid", "Gas"], correct: "Solid" },
            { type: "quiz", question: "Milk is an example of a...", options: ["Solid", "Liquid", "Gas"], correct: "Liquid" },
            { type: "quiz", question: "What do we breathe?", options: ["Rocks", "Water", "Air (Gas)"], correct: "Air (Gas)" }
        ]
    },
    {
        id: "eng_001_theory",
        unitId: "eng_u1",
        type: "theory",
        title: "Lesson: What is a Noun?",
        difficulty: 1,
        xpReward: 5,
        tasks: [
            {
                type: "theory",
                content: `
## Nouns are Names! 🏷️

A **Noun** is a word for a:
* **Person** (Teacher, Mom, Harry Potter) 👮
* **Place** (School, Park, London) 🏫
* **Thing** (Ball, Car, Pizza) 🍕

If you can touch it or see it, it is usually a noun!
                `
            }
        ]
    },
    {
        id: "eng_001_quiz",
        unitId: "eng_u1",
        type: "quiz",
        title: "Game: Spot the Noun",
        difficulty: 1,
        xpReward: 10,
        tasks: [
            { type: "quiz", question: "Which word is a Noun?", options: ["Run", "Apple", "Blue"], correct: "Apple" },
            { type: "quiz", question: "Find the Person:", options: ["Doctor", "Hospital", "Medicine"], correct: "Doctor" },
            { type: "quiz", question: "Is 'Happy' a noun?", options: ["Yes", "No"], correct: "No" }
        ]
    }
];



export function getSubjects() {
    return SUBJECTS;
}

export function getSubjectById(id) {
    return SUBJECTS.find(subject => subject.id === id);
}

export function getUnitsBySubject(subjectId) {
    return UNITS_DB.filter(unit => unit.subjectId === subjectId);
}

export function getMissionsByUnit(unitId) {
    return MISSIONS_DB.filter(mission => mission.unitId === unitId);
}

export function getMissionsBySubject(subjectId) {
    const subjectUnits = UNITS_DB.filter(u => u.subjectId === subjectId);
    const unitIds = subjectUnits.map(u => u.id);
    
    return MISSIONS_DB.filter(m => unitIds.includes(m.unitId));
}

export function getMissionById(missionId) {
    return MISSIONS_DB.find(mission => mission.id === missionId);
}

export function getUnitById(unitId) {
    return UNITS_DB.find(unit => unit.id === unitId);
}

export function getAllMissions() {
    return MISSIONS_DB;
}