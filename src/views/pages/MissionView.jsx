import { Link } from 'react-router-dom';

const MissionView = ({ 
  mission, nextMissionId,
  currentTask, totalTasks, currentIndex,
  selectedOption, onSelectOption,
  isCorrect, onCheck, onNext, onTheoryDone,
  
  onAskLumen, aiHelp, isAiLoading,
  
  isFinished, score, onExit
}) => {

  if (isFinished) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-3xl p-8 max-w-md w-full text-center border border-gray-700 shadow-2xl">
          <div className="text-6xl mb-4 animate-bounce">🏆</div>
          <h2 className="text-3xl font-bold text-white mb-2">Mission Complete!</h2>
          <p className="text-gray-400 mb-6">You earned +{mission.xpReward} XP</p>
          
          <div className="bg-gray-900 rounded-xl p-4 mb-8">
            <div className="text-sm text-gray-500 uppercase font-bold">Your Score</div>
            <div className="text-4xl font-bold text-blue-400">{score} / {totalTasks}</div>
          </div>

          <div className="space-y-3">
             {nextMissionId ? (
                <Link to={`/mission/${nextMissionId}`} className="block w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition">
                    Next Level 🚀
                </Link>
             ) : (
                <div className="text-green-400 font-bold mb-2">Unit Complete!</div>
             )}
             
             <button 
                onClick={onExit}
                className="block w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition"
             >
               Back to Menu
             </button>
          </div>
        </div>
      </div>
    );
  }

  const progressPercent = ((currentIndex + 1) / totalTasks) * 100;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      
      <div className="h-16 flex items-center px-4 bg-gray-800 justify-between">
        <button onClick={onExit} className="text-gray-400 hover:text-white">✕ Exit</button>
        <div className="font-bold text-lg">{mission.title}</div>
        <div className="w-16"></div> 
      </div>

      <div className="h-2 bg-gray-700 w-full">
        <div 
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-3xl mx-auto w-full">
        
        <div className="bg-gray-800 rounded-3xl p-8 shadow-2xl w-full border border-gray-700 relative">

          <div className="mb-8">
            <span className="bg-blue-900 text-blue-200 text-xs font-bold px-2 py-1 rounded mb-4 inline-block">
                {currentTask.type === 'theory' ? 'LEARN' : `QUESTION ${currentIndex + 1}`}
            </span>
            
            <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                {currentTask.type === 'theory' ? currentTask.content : currentTask.question}
            </h2>
          </div>

          {currentTask.type === 'quiz' && (
            <div className="space-y-3 mb-6">
                {currentTask.options.map((option, idx) => {

                    let btnClass = "bg-gray-700 hover:bg-gray-600 border-gray-600";
                    if (isCorrect !== null) {
                        if (option === currentTask.correct) btnClass = "bg-green-600 border-green-500";
                        else if (selectedOption === option && option !== currentTask.correct) btnClass = "bg-red-600 border-red-500"; 
                        else btnClass = "opacity-50 cursor-not-allowed";
                    } else if (selectedOption === option) {
                        btnClass = "bg-blue-600 border-blue-500 ring-2 ring-blue-400"; 
                    }

                    return (
                        <button
                            key={idx}
                            onClick={() => !isCorrect && onSelectOption(option)}
                            disabled={isCorrect !== null}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium text-lg ${btnClass}`}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>
          )}


          <div className="mt-8 pt-6 border-t border-gray-700">

            {!aiHelp && !isAiLoading && (
                <button 
                  onClick={onAskLumen}
                  className="flex items-center gap-2 text-blue-400 hover:text-white transition bg-blue-900/20 px-4 py-2 rounded-lg border border-blue-800/50 hover:border-blue-500 hover:bg-blue-900/40"
                >
                  <span className="text-xl">🤖</span> 
                  <span className="font-bold text-sm">I'm stuck, Lumen! Explain this.</span>
                </button>
            )}

            {isAiLoading && (
                <div className="flex items-center gap-3 text-gray-400 animate-pulse p-2">
                  <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce delay-75"></div>
                  <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce delay-150"></div>
                  <span className="text-sm font-medium">Lumen is thinking...</span>
                </div>
            )}

            {aiHelp && (
                <div className="bg-gradient-to-r from-gray-700 to-gray-800 border-l-4 border-blue-500 p-4 rounded-r-xl shadow-lg relative animate-fade-in-up">
                  <div className="flex gap-4">
                    <div className="text-3xl shrink-0">🤖</div>
                    <div className="text-gray-200 text-sm leading-relaxed">
                        <div className="font-bold text-blue-300 mb-1 text-xs uppercase tracking-wider">Lumen says:</div>
                        {aiHelp}
                    </div>
                  </div>
                </div>
            )}
          </div>

          <div className="mt-8 flex justify-end">
            {currentTask.type === 'theory' ? (
                 <button 
                    onClick={onNext}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform hover:scale-105 transition"
                 >
                    Got it! Next ➜
                 </button>
            ) : (
                <>
                    {selectedOption && isCorrect === null && (
                        <button 
                            onClick={onCheck}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform hover:scale-105 transition"
                        >
                            Check Answer
                        </button>
                    )}

                    {isCorrect !== null && (
                        <button 
                            onClick={onNext}
                            className={`${isCorrect ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-600 hover:bg-gray-500'} text-white font-bold py-3 px-8 rounded-xl shadow-lg transform hover:scale-105 transition flex items-center gap-2`}
                        >
                            {isCorrect ? "Awesome! Next ➜" : "Continue ➜"}
                        </button>
                    )}
                </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default MissionView;