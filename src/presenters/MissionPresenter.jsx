import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getMissionById, getMissionsByUnit } from '../models/missionModel';
import { addExperience, updateMissionProgress } from '../store/slices/userSlice';
import MissionView from '../views/pages/MissionView';

export default function MissionPresenter() {
  const { missionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const mission = getMissionById(missionId);
  
  
  const unitMissions = getMissionsByUnit(mission?.unitId);
  const currentIndexInUnit = unitMissions.findIndex(m => m.id === mission.id);
  const nextMission = unitMissions[currentIndexInUnit + 1]; 


  const [taskIndex, setTaskIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!mission) return <div className="text-white">Mission not found</div>;


  const handleTheoryComplete = () => {
  
    dispatch(addExperience(mission.xpReward));
    dispatch(updateMissionProgress({ missionId: mission.id, result: { status: 'completed' } }));
    
    if (nextMission) {
        navigate(`/mission/${nextMission.id}`);
    } else {
        navigate('/courses'); 
    }
  };


  const handleCheck = () => {
    const currentTask = mission.tasks[taskIndex];
    const correct = selectedOption === currentTask.correct;
    setIsCorrect(correct);
    if (correct) setScore(s => s + 1);
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
    dispatch(addExperience(mission.xpReward + score));
    dispatch(updateMissionProgress({ 
        missionId: mission.id, 
        result: { status: 'completed', score: score } 
    }));
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