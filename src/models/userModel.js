const Mock_User_Data = {
    uid: "user_abc123", 
    nickname: "John Doe",
    email: "john@example.com", 
    age: 12,
    createdAt: "2024-01-01T10:00:00Z", 

    settings: {
        theme: "light", 
        avatarId: "robot_blue_v1", 
        language: "en-US", 
        soundEnabled: true
    },

    stats: {
        xp: 150,
        currentLevel: 2,
        totalStars: 15, 
        streakDays: 3   
    },

    badges: [
        { id: "math_wizard", earnedAt: "2024-02-01T10:00:00Z" },
        { id: "first_login", earnedAt: "2024-01-01T10:00:00Z" }
    ],

    progress: {
        "mission_math_01": { 
            status: "completed", 
            stars: 3, 
            lastPlayed: "2024-02-10" 
        },
        "mission_science_04": { 
            status: "in_progress", 
            stars: 0, 
            lastPlayed: "2024-02-12" 
        }
    }
};