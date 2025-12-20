import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadActiveMission,
  clearActiveMission,
  askLumenHelp,
  clearAiHelp,
} from '../store/slices/courseSlice';
import { saveGameProgress } from '../store/slices/userSlice';
import MissionView from '../views/pages/MissionView';
import { isAnswerCorrect, calculateRewards, generateAiPrompt } from '../utils/missionLogic';

export default function MissionPresenter() {
  const { missionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { activeMission: mission, loading, error, aiHelp, aiHelpStatus } = useSelector(
    (state) => state.courses
  );
  const { data: user } = useSelector((state) => state.user);

  const [taskIndex, setTaskIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (missionId && user?.uid) {
      dispatch(loadActiveMission({ uid: user.uid, missionId }));
    }

    return () => {
      dispatch(clearActiveMission());
      setTaskIndex(0);
      setIsFinished(false);
    };
  }, [missionId, user?.uid, dispatch]);

  // --- LOGIC: Calculate Derived State ---
  // If we are loading and have no mission data yet, we are in "initial load"
  const isInitialLoading = loading && !mission;
  
  // Safe access to current task
  const currentTask = mission && mission.tasks ? mission.tasks[taskIndex] : null;
  const totalTasks = mission && mission.tasks ? mission.tasks.length : 0;

  const handleCheck = () => {
    if (!selectedOption || !currentTask) return;
    const correct = isAnswerCorrect(selectedOption, currentTask.correct);
    setIsCorrect(correct);
    if (correct) setScore((s) => s + 1);
  };

  const finishMission = () => {
    if (!mission) return;
    const finalScore = mission.type === 'theory' ? totalTasks : score;
    if (mission.type === 'theory') setScore(finalScore);

    setIsFinished(true);

    if (user?.uid) {
      const { stars, xpEarned } = calculateRewards(mission, finalScore);
      dispatch(
        saveGameProgress({
          uid: user.uid,
          missionId: mission.id,
          result: {
            status: 'completed',
            stars,
            score: finalScore,
            completedAt: new Date().toISOString(),
          },
          xpGained: xpEarned,
        })
      );
    }
  };

  const handleNext = () => {
    if (!mission) return;
    if (taskIndex + 1 < totalTasks) {
      setTaskIndex((i) => i + 1);
      setSelectedOption(null);
      setIsCorrect(null);
      dispatch(clearAiHelp());
    } else {
      finishMission();
    }
  };

  const handleAskLumen = () => {
    if (!currentTask) return;
    dispatch(
      askLumenHelp({
        prompt: generateAiPrompt(currentTask),
        userAge: user?.stats?.age || 10,
      })
    );
  };

  const handleExit = () => {
    if (mission?.courseId) {
        navigate(`/courses/${mission.courseId}`);
    } else {
        navigate('/courses');
    }
  };

  return (
    <MissionView
      // Data Props
      mission={mission}
      nextMissionId={null}
      currentTask={currentTask}
      totalTasks={totalTasks}
      currentIndex={taskIndex}
      score={score}
      aiHelp={aiHelp}
      
      // State Props
      isLoading={isInitialLoading} // Passing the boolean, not the component
      error={error}                // Passing the error string, not the div
      isAiLoading={aiHelpStatus === 'loading'}
      isFinished={isFinished}
      selectedOption={selectedOption}
      isCorrect={isCorrect}

      // Event Handlers
      onSelectOption={setSelectedOption}
      onCheck={handleCheck}
      onNext={handleNext}
      onTheoryDone={handleNext}
      onAskLumen={handleAskLumen}
      onExit={handleExit}
    />
  );
}
