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
import { MissionSkeleton } from '../views/components/LoadingSkeletons';
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

  if (loading && !mission) return <MissionSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white p-4 text-center">
        <h2 className="text-2xl font-bold text-red-400 mb-2">Mission Not Found ⚠️</h2>
        <p className="text-gray-400 mb-6">{error}</p>
        <button
          onClick={() => navigate('/courses')}
          className="bg-gray-700 px-6 py-2 rounded-lg hover:bg-gray-600 transition"
        >
          Return to Base
        </button>
      </div>
    );
  }

  if (!mission || !mission.tasks) return <MissionSkeleton />;

  const currentTask = mission.tasks[taskIndex];

  const handleCheck = () => {
    if (!selectedOption) return;
    const correct = isAnswerCorrect(selectedOption, currentTask.correct);
    setIsCorrect(correct);
    if (correct) setScore((s) => s + 1);
  };

  const finishMission = () => {
    const finalScore = mission.type === 'theory' ? mission.tasks.length : score;
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
    if (taskIndex + 1 < mission.tasks.length) {
      setTaskIndex((i) => i + 1);
      setSelectedOption(null);
      setIsCorrect(null);
      dispatch(clearAiHelp());
    } else {
      finishMission();
    }
  };

  const handleAskLumen = () => {
    dispatch(
      askLumenHelp({
        prompt: generateAiPrompt(currentTask),
        userAge: user?.stats?.age || 10,
      })
    );
  };

  return (
    <MissionView
      mission={mission}
      nextMissionId={null}
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
      isAiLoading={aiHelpStatus === 'loading'}
      isFinished={isFinished}
      score={score}
      onExit={() => navigate(mission.courseId ? `/courses/${mission.courseId}` : '/courses')}
    />
  );
}
