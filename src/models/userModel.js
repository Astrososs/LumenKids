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

export function createUser(userId, email, nickname, age) {
    const newProfile = {
        uid: userId,
        nickname: nickname,
        email: email,
        age: age,
        createdAt: new Date().toISOString(),
        settings: {
            theme: "light",
            avatarId: "default",
            language: "en-US",
            soundEnabled: true
        },
        stats: {
            xp: 0,
            currentLevel: 1,
            totalStars: 0,
            streakDays: 0
        },
        badges: [],
        progress: {},
    }

    console.log("[Model] Creating new user in DB...");


    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(newProfile);
        }, 1000);
    });
}

export function getUserProfile(userId) {

    console.log(`[Model] Searching for user: ${userId}...`);

    return new Promise((resolve) => {
        setTimeout(() => {
            if (userId == Mock_User_Data.uid) {
                resolve(Mock_User_Data) 
            } else {
                resolve(null)
            }
        }, 1000)
    })
}


export function validateUser(userId){

    return new Promise((resolve) => {
        setTimeout(() => {
            if (userId == Mock_User_Data.uid) {
                resolve(true)
            } else {
                resolve(false)
            }
        },500)
    })
}

export const updateUserSettings = async(userId,settingKey,newValue) => {


    const Valid = await validateUser(userId);

    if(!Valid) {
        console.log("user not found")
        return false
    }

    return new Promise((resolve) => {
        setTimeout(() => {

        console.log(`[Model] Updating ${settingKey} to ${newValue}...`);
            
      
        Mock_User_Data.settings[settingKey] = newValue
        resolve(true)
        },1000)
    })
}

export const addExperience = async(userId,xpAmount) =>{

const Valid = await validateUser(userId)

if(!Valid) {
    return {success: false, leveledUp: false}
}


return new Promise((resolve) =>{
    setTimeout(() => {
        let leveledUp = false
        let currentXp = Mock_User_Data.stats.xp
        currentXp = currentXp + xpAmount

        if(currentXp >= 100){
           currentXp = currentXp - 100
           Mock_User_Data.stats.currentLevel += 1
           leveledUp = true
        } 


        Mock_User_Data.stats.xp = currentXp

        resolve({ 
                success: true, 
                leveledUp: leveledUp 
            });


    }, 1000);
})
}



export const saveMissionProgress = async(userId, missionId, resultData) => {
    const Valid = await validateUser(userId)

    if(!Valid){
        return {
            success: false
        }
    }
    
    return new Promise((resolve) => {
        setTimeout(() => {
            

            Mock_User_Data.progress[missionId] = resultData

            resolve({
                success: true
            })
        }, 1000);
    })
}