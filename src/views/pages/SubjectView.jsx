import { UnitRowSkeleton } from '../components/LoadingSkeletons';
import { getUnitLockStatus } from '../../utils/missionLogic'; 

const SubjectView = ({ 
  subject, units, completedMissions, 
  onBack, onSelectMission, isLoading,
  isEditing, onRenameUnit, onReorderUnit, onDeleteUnit,
  onEdit, onSave, onCancel,
  aiPrompt, setAiPrompt, onAiEdit, isAiProcessing
}) => {
  
  const getMissionStyle = (type) => {
    switch (type) {
      case 'theory': return { icon: '📖', label: 'Lesson', color: 'bg-blue-500/20 border-blue-500 text-blue-300' };
      case 'quiz': return { icon: '🧩', label: 'Quiz', color: 'bg-purple-500/20 border-purple-500 text-purple-300' };
      case 'exam': return { icon: '🏆', label: 'Boss', color: 'bg-orange-500/20 border-orange-500 text-orange-300' };
      default: return { icon: '⭐', label: 'Activity', color: 'bg-gray-700 border-gray-600 text-gray-300' };
    }
  };

  return (
    <div className="relative min-h-screen pt-16 md:pt-0">
      
      <div className="bg-gray-800 border-b border-gray-700 p-4 sticky top-16 md:top-0 z-30 flex flex-wrap items-center justify-between gap-4 shadow-md transition-all">
         <button onClick={onBack} className="cursor-pointer text-gray-400 hover:text-white">← Back</button>
         <div className="flex items-center gap-2">
             {isEditing ? (
                 <>
                    <button onClick={onSave} className="cursor-pointer bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold">Save</button>
                    <button onClick={onCancel} className="cursor-pointer text-red-400 hover:text-white px-4">Cancel</button>
                 </>
             ) : (
                 <button onClick={onEdit} className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                    <span>✏️</span> Edit Course
                 </button>
             )}
         </div>
      </div>

      {isEditing && (
         <div className="max-w-5xl mx-auto mt-6 p-6 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl border border-blue-500/50 mx-4">
            <h3 className="text-blue-200 font-bold mb-2 flex items-center gap-2">🤖 AI Assistant Editor</h3>
            <div className="flex flex-col md:flex-row gap-2">
                <input 
                    value={aiPrompt} 
                    onChange={(e) => setAiPrompt(e.target.value)} 
                    placeholder="e.g. 'Add a unit about Black Holes'" 
                    className="flex-1 bg-gray-900/80 text-white border border-gray-600 rounded-lg p-3" 
                    disabled={isAiProcessing} 
                />
                <button 
                    onClick={onAiEdit} 
                    disabled={isAiProcessing} 
                    className="cursor-pointer bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 md:py-0 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                >
                    {isAiProcessing ? "Thinking..." : "✨ Magic Edit"}
                </button>
            </div>
         </div>
      )}

      <div className={`p-6 md:p-10 max-w-5xl mx-auto space-y-10 ${isEditing ? "border-2 border-dashed border-blue-500/30 m-4 rounded-xl" : ""}`}>
        
        <div className="flex items-center gap-4 border-b border-gray-700 pb-8">
            <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center text-4xl shadow-lg border border-gray-700">
                {subject?.icon || '📚'}
            </div>
            <div>
                <h1 className="text-3xl font-bold text-white">
                    {subject?.title || <span className="animate-pulse bg-gray-700 h-8 w-40 rounded block"></span>}
                </h1>
                <p className="text-gray-400">{subject?.description || "Explore the units below..."}</p>
            </div>
        </div>

        {isLoading && (!units || units.length === 0) && (
            <div className="space-y-6">
                <UnitRowSkeleton />
                <UnitRowSkeleton />
            </div>
        )}

        {units && units.map((unit, index) => {
            
            const isLocked = !isEditing && getUnitLockStatus(index, units, completedMissions);

            return (
                <div key={unit.id || index} className={`space-y-4 animate-fade-in-up transition-all ${isEditing ? 'p-4 border border-dashed border-gray-600 rounded-xl bg-gray-800/30' : ''} ${isLocked ? 'opacity-40 pointer-events-none filter grayscale-[0.8]' : ''}`}>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div className="flex-1">
                            {isEditing ? (
                                <div className="space-y-2">
                                    <input value={unit.title} onChange={(e) => onRenameUnit(index, 'title', e.target.value)} className="w-full bg-gray-900 border border-blue-500 rounded p-2 text-white font-bold" />
                                    <input value={unit.description} onChange={(e) => onRenameUnit(index, 'description', e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-gray-300 text-sm" />
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                        {unit.title}
                                        {isLocked && <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full border border-gray-600">🔒 LOCKED</span>}
                                    </h2>
                                    <p className="text-gray-400 text-sm">{unit.description}</p>
                                </>
                            )}
                        </div>

                        {isEditing ? (
                            <div className="flex items-center gap-2">
                                <button onClick={() => onReorderUnit(index, -1)} disabled={index === 0} className="cursor-pointer p-2 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed">⬆️</button>
                                <button onClick={() => onReorderUnit(index, 1)} disabled={index === units.length - 1} className="cursor-pointer p-2 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed">⬇️</button>
                                <button onClick={() => onDeleteUnit(index)} className="cursor-pointer p-2 bg-red-900/50 text-red-400 rounded hover:bg-red-900 border border-red-800">🗑️</button>
                            </div>
                        ) : (
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest bg-gray-800 px-3 py-1 rounded-full">
                                {unit.missions ? unit.missions.length : 0} Missions
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {unit.missions && unit.missions.map(mission => {
                            const style = getMissionStyle(mission.type);
                            const isCompleted = completedMissions?.[mission.id]; 

                            return (
                                <div 
                                key={mission.id}
                                onClick={() => !isEditing && onSelectMission(mission.id)}
                                className={`relative group flex items-center gap-4 p-5 rounded-xl border-2 transition-all duration-300 ${isEditing ? 'opacity-70 cursor-default border-gray-700 bg-gray-900' : 'cursor-pointer hover:scale-[1.02] hover:shadow-xl bg-gray-800 border-gray-700'} ${isCompleted ? 'bg-gray-800/80 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : ''}`}
                                >
                                    {isCompleted && !isEditing && <div className="absolute top-[-10px] right-[-10px] bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg z-10 animate-bounce-short">✅</div>}
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-inner ${style.color}`}>{style.icon}</div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-1 inline-block ${style.color.replace('bg-', 'bg-opacity-10 ')}`}>{style.label}</span>
                                            <span className="text-xs text-yellow-500 font-bold">+{mission.xpReward} XP</span>
                                        </div>
                                        <h3 className={`text-base font-bold transition ${isCompleted ? 'text-green-400' : 'text-white'}`}>{mission.title}</h3>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="w-full h-px bg-gray-800 mt-8"></div>
                </div>
            );
        })}
      </div>
    </div>
  );
};

export default SubjectView;
