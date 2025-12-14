import ReactMarkdown from 'react-markdown'; 
import ProgressBar from '../components/common/ProgressBar'; 
import Button from '../components/common/Button';
import { Link, useNavigate } from 'react-router-dom';

const MissionView = ({ 
  mission, nextMissionId, 
  currentTask, totalTasks, currentIndex, 
  selectedOption, onSelectOption, isCorrect, 
  onCheck, onNext, onTheoryDone, 
  isFinished, score, onExit 
}) => {
  const navigate = useNavigate();
  const isExam = mission.type === 'exam';

 
  if (mission.type === 'theory') {
    return (
      <div className="max-w-2xl mx-auto p-6 min-h-screen flex flex-col items-center justify-center animate-fade-in-up">
        <div className="bg-gray-800 p-8 rounded-3xl border border-gray-700 shadow-2xl w-full">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-700 pb-4">
                <span className="text-4xl">📖</span>
                <h1 className="text-2xl font-bold text-white">{mission.title}</h1>
            </div>
            
           
            <div className="prose prose-invert prose-lg text-gray-300 mb-8">
                <ReactMarkdown>{mission.content}</ReactMarkdown>
            </div>

            <Button 
                label={nextMissionId ? "I Understand! Next Mission →" : "Finish Unit"} 
                onClick={onTheoryDone} 
                variant="primary" 
            />
        </div>
      </div>
    );
  }


  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6 animate-fade-in-up">
        <div className="text-8xl mb-4 animate-bounce">
            {isExam ? '🎓' : '🏆'}
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">
            {isExam ? 'Exam Passed!' : 'Mission Complete!'}
        </h1>
        <p className="text-gray-400 text-xl mb-8">You earned +{mission.xpReward} XP</p>
        
        <div className="text-5xl font-bold text-blue-400 mb-8">
            {score} / {totalTasks}
        </div>

        <div className="flex gap-4">
            <Button label="Back to Map" onClick={onExit} variant="secondary" />
            
           
            {nextMissionId && (
                <Button 
                    label="Next Level →" 
                    onClick={() => navigate(`/mission/${nextMissionId}`)} 
                    variant="primary" 
                />
            )}
        </div>
      </div>
    );
  }

  
  return (
    <div className={`max-w-3xl mx-auto p-6 min-h-screen flex flex-col ${isExam ? 'border-4 border-red-900/30 rounded-xl' : ''}`}>
      
     
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
            <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${isExam ? 'bg-red-600 text-white' : 'bg-blue-900 text-blue-200'}`}>
                {isExam ? 'FINAL EXAM 🛑' : 'PRACTICE'}
            </span>
            <button onClick={onExit} className="text-gray-500 hover:text-white">✕ Quit</button>
        </div>
       
        <ProgressBar value={currentIndex} max={totalTasks} color={isExam ? "bg-red-500" : "bg-green-500"} />
      </div>

     
      <div className="flex-1 flex flex-col justify-center">
        <div className="bg-gray-800 p-8 rounded-3xl border border-gray-700 shadow-xl mb-8">
            <h1 className="text-2xl font-bold text-white text-center">{currentTask.question}</h1>
        </div>

       
        <div className="grid grid-cols-1 gap-4 mb-8">
            {currentTask.options.map((opt, i) => {
                let style = "bg-gray-700 hover:bg-gray-600";
                
                
                if (isCorrect !== null) {
                   if (opt === currentTask.correct) style = "bg-green-600";
                   else if (opt === selectedOption) style = "bg-red-600";
                   else style = "opacity-50";
                } else if (selectedOption === opt) {
                   style = "bg-blue-600 ring-2 ring-blue-400";
                }

                return (
                    <button 
                        key={i}
                        onClick={() => !isCorrect && onSelectOption(opt)}
                        disabled={isCorrect !== null}
                        className={`p-4 rounded-xl text-lg font-bold text-white transition-all ${style}`}
                    >
                        {opt}
                    </button>
                );
            })}
        </div>
      </div>

     
      <div className="mt-auto pt-6 border-t border-gray-800 flex items-center justify-between">
          
            {!isExam ? (
                <Link to="/chat" className="flex items-center gap-2 text-blue-400 font-bold hover:text-blue-300">
                    <span>💡</span> Hint
                </Link>
            ) : (
                <span className="text-gray-600 italic text-sm">No hints allowed in exam mode.</span>
            )}

            <div className="w-40">
                {isCorrect === null ? (
                    <Button label="Check" onClick={onCheck} disabled={!selectedOption} />
                ) : (
                    <Button 
                        label={currentIndex + 1 === totalTasks ? "Finish" : "Next"} 
                        onClick={onNext} 
                        variant={isExam || isCorrect ? "primary" : "danger"} 
                    />
                )}
            </div>
      </div>
    </div>
  );
};

export default MissionView;