import  { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMissionById, getMissionsByUnit } from '../models/missionModel';
import { saveGameProgress } from '../store/slices/userSlice';
import MissionView from '../views/pages/MissionView';

export default function MissionPresenter() {
  const { missionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: user } = useSelector((state) => state.user);

  const mission = getMissionById(missionId);
  
  
  const unitMissions = getMissionsByUnit(mission?.unitId);
  const currentIndexInUnit = unitMissions ? unitMissions.findIndex(m => m.id === mission.id) : -1;
  const nextMission = (unitMissions && currentIndexInUnit >= 0) ? unitMissions[currentIndexInUnit + 1] : null;

 
  const [taskIndex, setTaskIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

 
  if (!mission) return <div className="text-white p-10">Mission not found!</div>;


  
  const handleTheoryComplete = () => {
   
    if (user && user.uid) {
        dispatch(saveGameProgress({
            uid: user.uid,
            missionId: mission.id,
            result: { 
                status: 'completed',
                completedAt: new Date().toISOString()
            },
            xpGained: mission.xpReward
        }));
    }

   
    if (nextMission) {
        navigate(`/mission/${nextMission.id}`);
    } else {
        navigate('/courses');
    }
  };


  
  const handleCheck = () => {
    if (!selectedOption) return;

    const currentTask = mission.tasks[taskIndex];
    const correct = selectedOption === currentTask.correct;
    
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prev => prev + 1);
    }
  };



  const handleNext = () => {
    if (taskIndex + 1 < mission.tasks.length) {
     
      setTaskIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      
      finishMission();
    }
  };


 
  const finishMission = () => {
    setIsFinished(true);

    
    let stars = 1;
    const percentage = score / mission.tasks.length;
    if (percentage === 1) stars = 3;
    else if (percentage > 0) stars = 2;

    const resultData = {
        status: 'completed',
        stars: stars,
        score: score,
        completedAt: new Date().toISOString()
    };

   
    if (user && user.uid) {
        
        const totalXp = mission.xpReward + (score * 2);

        dispatch(saveGameProgress({
            uid: user.uid,
            missionId: mission.id,
            result: resultData,
            xpGained: totalXp
        }));
    }
  };

  return (
    <MissionView 
      mission={mission}
      nextMissionId={nextMission?.id} 
      
    
      currentTask={mission.tasks ? mission.tasks[taskIndex] : null}
      totalTasks={mission.tasks ? mission.tasks.length : 0}
      currentIndex={taskIndex}
      
     
      selectedOption={selectedOption}
      onSelectOption={setSelectedOption}
      isCorrect={isCorrect}
      onCheck={handleCheck}
      onNext={handleNext}
      onTheoryDone={handleTheoryComplete}
      
     
      isFinished={isFinished}
      score={score}
      onExit={() => navigate('/courses')} 
    />
  );
}