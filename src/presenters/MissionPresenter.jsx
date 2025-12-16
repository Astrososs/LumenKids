import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMissionById, getMissionsByUnit, getUnitById } from '../models/missionModel'; 
import { saveGameProgress } from '../store/slices/userSlice';
import { sendMessageToAi } from '../models/aiModel'; 
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
  const [aiHelp, setAiHelp] = useState(""); 
  const [isAiLoading, setIsAiLoading] = useState(false);


  useEffect(() => {
    setTaskIndex(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setScore(0);
    setIsFinished(false);
    setAiHelp("");
    setIsAiLoading(false);
  }, [missionId]);

  if (!mission || !mission.tasks || mission.tasks.length === 0) {
      return <div className="p-10 text-white">Mission loading or not found...</div>;
  }
  
  const currentTask = mission.tasks[taskIndex];



  const handleAskLumen = async () => {
    if (isAiLoading) return; 
    setIsAiLoading(true);
    setAiHelp(""); 

    const userAge = user?.stats?.age || 10;
    let prompt = "";
    if (currentTask.type === 'theory') {
        prompt = `I am reading a lesson about: "${currentTask.content}". Can you explain this to me in a fun, simple way with a real-life example?`;
    } else {
        prompt = `I am stuck on this quiz question: "${currentTask.question}". The options are ${JSON.stringify(currentTask.options)}. Can you give me a helpful hint about the concept? Don't tell me the answer directly, just guide me!`;
    }

    try {
        const response = await sendMessageToAi(prompt, userAge, []);
        setAiHelp(response.text);
    } catch (error) {
        setAiHelp("Oops! My brain froze. Try asking again later! 🧊");
    } finally {
        setIsAiLoading(false);
    }
  };

  const handleCheck = () => {
    if (!selectedOption) return;
    const correct = selectedOption === currentTask.correct;
    setIsCorrect(correct);
    if (correct) setScore(prev => prev + 1);
  };

  const handleNext = () => {
    if (taskIndex + 1 < mission.tasks.length) {
      setTaskIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
      setAiHelp(""); 
    } else {
      finishMission();
    }
  };

  const finishMission = () => {
    let finalScore = score;
    if (mission.type === 'theory') {
        finalScore = mission.tasks.length;
        setScore(finalScore); 
    }

    setIsFinished(true);
    

    let stars = 1;
    const percentage = finalScore / mission.tasks.length;
    if (percentage === 1) stars = 3;
    else if (percentage > 0) stars = 2;

    const resultData = {
        status: 'completed',
        stars: stars,
        score: finalScore,
        completedAt: new Date().toISOString()
    };

    if (user && user.uid) {
        dispatch(saveGameProgress({
            uid: user.uid,
            missionId: mission.id,
            result: resultData,
            xpGained: mission.xpReward + (finalScore * 2)
        }));
    }
  };

  const handleExit = () => {

    const unit = getUnitById(mission.unitId);
    if (unit) {
        navigate(`/courses/${unit.subjectId}`);
    } else {
        navigate('/courses');
    }
  };

  return (
    <MissionView 
      mission={mission}
      nextMissionId={nextMission?.id}
      currentTask={currentTask}
      totalTasks={mission.tasks.length}
      currentIndex={taskIndex}
      selectedOption={selectedOption}
      onSelectOption={setSelectedOption}
      isCorrect={isCorrect}
      onCheck={handleCheck}
      onNext={handleNext}
      onTheoryDone={handleNext} 
      onAskLumen={handleAskLumen}
      aiHelp={aiHelp}
      isAiLoading={isAiLoading}
      isFinished={isFinished}
      score={score}
      onExit={handleExit} 
    />
  );
}