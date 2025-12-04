const Mock_Missions ={
//this is just me spitting out some ideas
// mission_type: perma_missons && timed_mission && custom_missions
// just create the missions no user data will be stored here


//add id
math_missions:{
"math_1":{
topic_name:"Addition_1",
difficulty:1,
total_tasks:5,
xp_rewards:5,
total_stars:1,
badge:"badge_math_novice"

}
,"math_2":{
topic_name:"Addition_2",
difficulty:2,
total_tasks:5,
xp_rewards:10,
total_stars:2

},
"math_3":{
topic_name:"Addition_3",
difficulty:3,
total_tasks:5,
xp_rewards:15,
total_stars:3

}

},
science_missions:{
"science_1":{
topic_name:"State_of_matter_1",
difficulty:1,
total_tasks:5,
xp_rewards:5,
total_stars:1

},
"science_2":{
topic_name:"State_of_matter_2",
difficulty:2,
total_tasks:5,
xp_rewards:10,
total_stars:2

},
"science_3":{
topic_name:"State_of_matter_3",
difficulty:3,
total_tasks:5,
xp_rewards:15,
total_stars:3

}

},
english_missions:{
"english_1":{
topic_name:"Grammar_1",
difficulty:1,
total_tasks:5,
xp_rewards:5,
total_stars:1

},

"english_2":{
topic_name:"Grammar_2",
difficulty:2,
total_tasks:5,
xp_rewards:10,
total_stars:2

},

"english_3":{
topic_name:"Grammar_3",
difficulty:3,
total_tasks:5,
xp_rewards:15,
total_stars:3

}
}

}

//Creates a list of all the main objects in Mock_Missions. So when we scale it will still work.
export function dynamicMission(){
var list = Object.values(Mock_Missions);
return list;

}

export function idVaildator(id){
   // Get the list of Missions as in the folders like (Math_Mission,....)
    var folders = dynamicMission();

    // Loop through each folder
    for (var folder of folders) {
        // "Look inside the folder for this ID"
        if (folder[id]) {
            return true;
        }
    }
    return false;
}



export function getMissionById(id){
 //Edge case so we don't waste time going through this function
 if(!idVaildator(id))return null;   

var missions= dynamicMission();

for (var mission of missions) {
        if (mission[id]) {
            return mission[id]; // Return the mission object itself
        }
    }
    //Not found
    return null;
 

}

export function getAllMissons(){

   var folders = dynamicMission();
   var allMissionsList = [];

   for (var folder of folders) {
      // Get missions inside this folder
      var missionsInFolder = Object.values(folder);
      
      // Add them to our list
      for (var mission of missionsInFolder) {
         
        allMissionsList.push(mission);

      }
   }

   return allMissionsList;



}

//This function needs a bit of collab to use.
//Collab:Sami
export function getMissionsByTopic(){



}

export function getMissionsByDifficulty(diff){

var missions= getAllMissons();
var difficultyList = [];
//Goes Through the folders to then look into the objects
for (var mission of missions) {
        if (mission.difficulty==diff) {

            difficultyList.push(mission);

        }
    }
    //Return the whole list
    return difficultyList;

}
